import type { Job } from "./types";

function applicationLine(job: Job) {
  if (job.applicationUrl) return `Apply: ${job.applicationUrl}`;
  if (job.applicationEmail) return `Apply by email: ${job.applicationEmail}`;
  return `How to apply: ${job.applicationInstructions}`;
}

function deadlineLine(job: Job) {
  return job.deadline ? `Deadline: ${job.deadline}` : "Deadline: Confirm at source";
}

export function generateWhatsAppPost(job: Job) {
  return [
    `*${job.title}*`,
    job.company,
    `Location: ${job.location}`,
    `Type: ${job.type}`,
    deadlineLine(job),
    "",
    job.summary,
    "",
    applicationLine(job),
    "",
    "Get Hired KE",
  ].join("\n");
}

export function generateTelegramPost(job: Job) {
  return [
    `📌 ${job.title}`,
    `Organization: ${job.company}`,
    `Location: ${job.location}`,
    `Category: ${job.category}`,
    deadlineLine(job),
    "",
    job.summary,
    "",
    applicationLine(job),
    "",
    "#GetHiredKE #JobsKenya #CareerOpportunities",
  ].join("\n");
}

export function generateFacebookPost(job: Job) {
  return [
    `${job.title} at ${job.company}`,
    "",
    `${job.summary}`,
    "",
    `Location: ${job.location}`,
    `Category: ${job.category}`,
    deadlineLine(job),
    "",
    applicationLine(job),
    "",
    "Shared by Get Hired KE.",
  ].join("\n");
}

export function generateSocialPosts(job: Job) {
  return {
    whatsapp: generateWhatsAppPost(job),
    telegram: generateTelegramPost(job),
    facebook: generateFacebookPost(job),
  };
}
