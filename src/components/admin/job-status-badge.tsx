import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/jobs/types";

export function JobStatusBadge({ job }: { job: Job }) {
  const label = job.status === "published" ? stateLabel(job.deadlineState) : statusLabel(job.status);
  return <Badge variant={job.status === "published" ? "default" : "secondary"}>{label}</Badge>;
}

function statusLabel(status: Job["status"]) {
  return status[0]!.toUpperCase() + status.slice(1);
}

function stateLabel(state: Job["deadlineState"]) {
  if (state === "closing-soon") return "Closing soon";
  return state[0]!.toUpperCase() + state.slice(1);
}
