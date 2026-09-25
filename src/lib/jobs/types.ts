export const WHATSAPP_URL = "https://www.whatsapp.com/channel/0029VbCy7ofFHWq30zTpFH2s";

export const opportunityTypes = [
  { slug: "all", label: "All Opportunities", heading: "Latest Opportunities" },
  { slug: "job", label: "Jobs", heading: "Jobs in Kenya" },
  { slug: "internship", label: "Internships", heading: "Internships & Attachments in Kenya" },
  { slug: "graduate-opportunity", label: "Graduate Opportunities", heading: "Graduate Jobs & Trainee Programmes in Kenya" },
  { slug: "scholarship", label: "Scholarships", heading: "Scholarships & Fellowships in Kenya" },
  { slug: "attachment", label: "Attachments", heading: "Attachments in Kenya" },
  { slug: "volunteer", label: "Volunteer", heading: "Volunteer Opportunities in Kenya" },
  { slug: "other", label: "Other Opportunities", heading: "Other Career Opportunities" },
] as const;

export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Graduate Programme",
  "Remote",
] as const;

export const locationOptions = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Other Counties",
  "Remote",
  "All Kenya",
] as const;

export const careerFields = [
  "Technology",
  "Finance & Accounting",
  "Healthcare",
  "Engineering",
  "Education",
  "Sales & Marketing",
  "Human Resources",
  "Administration",
  "Other",
] as const;

export const experienceLevels = [
  "No experience",
  "Entry level",
  "1-2 years",
  "3-5 years",
  "5+ years",
] as const;

export const deadlineOptions = ["Closing soon", "This week", "This month"] as const;

export const jobStatuses = ["draft", "scheduled", "published", "expired", "archived"] as const;
export type JobStatus = (typeof jobStatuses)[number];

export type DeadlineState = "active" | "closing-soon" | "expired" | "scheduled" | "draft" | "archived";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logo: string | null;
  description: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  organizationId: string | null;
  location: string;
  county: string;
  category: string;
  categoryId: string | null;
  type: string;
  opportunityType: string;
  salary: string;
  posted: string;
  deadline: string;
  featured: boolean;
  initials: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string;
  sector: string;
  employment: string;
  region: string;
  field: string;
  experience: string;
  deadlineISO: string;
  postedISO: string;
  source: string;
  sourceUrl: string;
  applicationUrl: string;
  applicationEmail: string;
  applicationMethod: string;
  verifiedAt: string;
  verifiedAtISO?: string;
  verifiedBy: string;
  verificationStatus: "unverified" | "verified";
  applicationInstructions: string;
  status: JobStatus;
  publishDate: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
  deadlineState: DeadlineState;
};

export type AdminJobFilters = {
  q?: string | undefined;
  status?: string | undefined;
  categoryId?: string | undefined;
  opportunityType?: string | undefined;
  featured?: string | undefined;
  deadlineState?: string | undefined;
  sort?: string | undefined;
};

export type JobFormInput = {
  id?: string | undefined;
  slug?: string | undefined;
  title: string;
  organizationId?: string | undefined;
  organizationName: string;
  location: string;
  county?: string | undefined;
  opportunityType: string;
  categoryId: string;
  field?: string | undefined;
  experienceLevel?: string | undefined;
  employmentType?: string | undefined;
  salary?: string | undefined;
  summary: string;
  description?: string | undefined;
  responsibilities: string[];
  requirements: string[];
  qualifications?: string | undefined;
  applicationMethod: string;
  applicationUrl?: string | undefined;
  applicationEmail?: string | undefined;
  applicationInstructions: string;
  sourceName: string;
  sourceUrl?: string | undefined;
  verificationStatus: "unverified" | "verified";
  verifiedAt?: string | undefined;
  verifiedBy?: string | undefined;
  status: JobStatus;
  featured: boolean;
  publishDate?: string | undefined;
  scheduledFor?: string | undefined;
  deadline?: string | null | undefined;
};

export type JobPublication = {
  id: string;
  jobId: string;
  platform: "website" | "whatsapp" | "telegram" | "facebook";
  format: string;
  context: string | null;
  content: string | null;
  status: string;
  publishedAt: string;
};
