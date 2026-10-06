import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";

const vite = await createServer({
  configFile: false,
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true, hmr: false },
});
const {
  extractedOpportunitiesSchema,
  normalizeExtractedOpportunity,
  matchExistingCategory,
  quickImportTextSchema,
} = await vite.ssrLoadModule("/src/lib/jobs/import-schema.ts");
const { jobFormSchema } = await vite.ssrLoadModule("/src/lib/jobs/validation.ts");
const { extractOpportunities } = await vite.ssrLoadModule("/src/lib/nvidia-nim.server.ts");
after(() => vite.close());

function opportunity(overrides = {}) {
  return {
    title: "Hospital Matron",
    organization_name: "Mombasa Hospital",
    location: null,
    county: null,
    opportunity_type: null,
    category_name: null,
    field: null,
    experience_level: null,
    employment_type: null,
    summary: null,
    description: null,
    responsibilities: [],
    requirements: [],
    qualifications: [],
    application_method: null,
    application_url: null,
    application_email: null,
    application_phone: null,
    application_instructions: null,
    deadline: null,
    source_name: "Mombasa Hospital",
    source_url: "https://mombasahospital.com/careers/",
    missing_information: [],
    needs_review: false,
    ...overrides,
  };
}

test("keeps multiple vacancies from one employer as separate opportunities", () => {
  const result = extractedOpportunitiesSchema.safeParse({
    opportunities: [opportunity(), opportunity({ title: "Medical Director" })],
  });
  assert.equal(result.success, true);
  assert.deepEqual(
    result.data.opportunities.map((item) => item.title),
    ["Hospital Matron", "Medical Director"],
  );
  assert.equal(
    result.data.opportunities[0].organization_name,
    result.data.opportunities[1].organization_name,
  );
});

test("supports four distinct roles and multiple employers in one response", () => {
  const items = [
    opportunity({ title: "Underwriting Intern", organization_name: "Britam" }),
    opportunity({ title: "System Support Analyst", organization_name: "Britam" }),
    opportunity({ title: "Legal Claims Intern", organization_name: "Britam" }),
    opportunity({ title: "Tutor", organization_name: "St Theresa Medical Training College" }),
  ];
  const parsed = extractedOpportunitiesSchema.parse({ opportunities: items });
  assert.equal(parsed.opportunities.length, 4);
  assert.equal(new Set(parsed.opportunities.map((item) => item.organization_name)).size, 2);
});

test("keeps an unspecified deadline and application URL null", () => {
  const result = normalizeExtractedOpportunity(opportunity());
  assert.equal(result.deadline, null);
  assert.equal(result.application_url, null);
  assert.ok(result.missing_information.some((item) => /application/i.test(item)));
});

test("preserves unavailable job details as null or empty lists without inventing content", () => {
  const result = normalizeExtractedOpportunity(opportunity());
  assert.equal(result.location, null);
  assert.equal(result.summary, null);
  assert.equal(result.description, null);
  assert.deepEqual(result.responsibilities, []);
  assert.deepEqual(result.requirements, []);
  assert.deepEqual(result.qualifications, []);
  assert.ok(result.missing_information.some((item) => /description/i.test(item)));
  assert.ok(result.missing_information.some((item) => /requirements/i.test(item)));
  assert.equal(result.needs_review, true);
});

test("manual job form accepts absent location, summary, responsibilities and requirements", () => {
  const result = jobFormSchema.parse({
    title: "Finance Assistant Intern",
    organizationName: "Cytonn Investments",
    location: "",
    opportunityType: "internship",
    categoryId: "college-jobs",
    summary: "",
    responsibilities: [""],
    requirements: [],
    applicationMethod: "other",
    applicationInstructions: "Check the employer listing for instructions.",
    sourceName: "Employer listing",
    verificationStatus: "pending",
    status: "draft",
    featured: false,
    deadline: null,
  });
  assert.equal(result.location, null);
  assert.equal(result.summary, null);
  assert.deepEqual(result.responsibilities, []);
  assert.deepEqual(result.requirements, []);
});

test("sends one NVIDIA NIM request and returns validated output", async () => {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.NVIDIA_NIM_API_KEY;
  const originalModel = process.env.NVIDIA_NIM_MODEL;
  const requestedModels = [];
  process.env.NVIDIA_NIM_API_KEY = "test-key";
  process.env.NVIDIA_NIM_MODEL = "test/first-model";
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    requestedModels.push(body.model);
    return new Response(
      JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ opportunities: [opportunity()] }) } }],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };

  try {
    const result = await extractOpportunities("A job post with enough source text.", []);
    assert.deepEqual(requestedModels, ["test/first-model"]);
    assert.equal(result.length, 1);
    assert.equal(result[0].title, "Hospital Matron");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.NVIDIA_NIM_API_KEY;
    else process.env.NVIDIA_NIM_API_KEY = originalApiKey;
    if (originalModel === undefined) delete process.env.NVIDIA_NIM_MODEL;
    else process.env.NVIDIA_NIM_MODEL = originalModel;
  }
});

test("normalizes a clear October 5 deadline to the database date form", () => {
  const result = normalizeExtractedOpportunity(opportunity({ deadline: "5 October 2026" }));
  assert.equal(result.deadline, "2026-10-05");
});

test("does not guess an ambiguous numeric deadline", () => {
  const result = normalizeExtractedOpportunity(opportunity({ deadline: "05/10/2026" }));
  assert.equal(result.deadline, null);
  assert.ok(result.missing_information.some((item) => /deadline/i.test(item)));
  assert.equal(result.needs_review, true);
});

test("preserves email applications without requiring an application URL", () => {
  const result = normalizeExtractedOpportunity(
    opportunity({
      application_method: "Email",
      application_email: "recruit@sttheresahosp-kiirua.com",
      application_instructions: "Send your application by email.",
    }),
  );
  assert.equal(result.application_method, "Email");
  assert.equal(result.application_email, "recruit@sttheresahosp-kiirua.com");
  assert.equal(result.application_url, null);
});

test("preserves a valid WhatsApp contact and rejects malformed phone values", () => {
  const result = normalizeExtractedOpportunity(
    opportunity({ application_method: "WhatsApp", application_phone: "+254 701 652 342" }),
  );
  assert.equal(result.application_phone, "+254 701 652 342");
  const invalid = normalizeExtractedOpportunity(
    opportunity({ application_phone: "call the office" }),
  );
  assert.equal(invalid.application_phone, null);
});

test("rejects malformed AI output and oversized source text", () => {
  assert.equal(
    extractedOpportunitiesSchema.safeParse({
      opportunities: [{ title: "Missing required fields" }],
    }).success,
    false,
  );
  assert.equal(quickImportTextSchema.safeParse("x".repeat(100_001)).success, false);
});

test("maps only categories present in the database taxonomy", () => {
  const categories = [
    { id: "county-jobs", name: "County Jobs", slug: "county-jobs", description: null },
  ];
  assert.equal(matchExistingCategory("COUNTY JOBS", categories)?.id, "county-jobs");
  assert.equal(matchExistingCategory("Private Sector", categories), null);
  assert.equal(matchExistingCategory(null, categories), null);
});
