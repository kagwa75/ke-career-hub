import type { DeadlineState, Job, JobStatus } from "./types";

const closingSoonDays = 3;

export function getDeadlineState(job: Pick<Job, "status" | "deadlineISO" | "scheduledFor">, now = new Date()): DeadlineState {
  if (job.status === "archived") return "archived";
  if (job.status === "draft") return "draft";
  if (job.status === "scheduled") return "scheduled";

  if (!job.deadlineISO) return "active";

  const deadline = new Date(job.deadlineISO);
  if (Number.isNaN(deadline.getTime()) || deadline.getTime() < now.getTime()) return "expired";

  const days = Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
  return days <= closingSoonDays ? "closing-soon" : "active";
}

export function isPubliclyActive(status: JobStatus, deadlineIso: string | null, scheduledFor?: string | null, now = new Date()) {
  if (status !== "published") return false;
  if (scheduledFor && new Date(scheduledFor).getTime() > now.getTime()) return false;
  return !deadlineIso || new Date(deadlineIso).getTime() >= now.getTime();
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
