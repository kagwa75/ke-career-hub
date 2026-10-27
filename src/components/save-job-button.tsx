import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getSavedJobIds, subscribeToJobPreferences, toggleSavedJob } from "@/lib/jobs/browser-preferences";

export function SaveJobButton({ jobId, compact = false }: { jobId: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const update = () => setSaved(getSavedJobIds().includes(jobId));
    update();
    return subscribeToJobPreferences(update);
  }, [jobId]);

  const toggle = () => setSaved(toggleSavedJob(jobId));
  return (
    <Button
      type="button"
      variant={saved ? "secondary" : "ghost"}
      size={compact ? "icon" : "sm"}
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove saved job" : "Save job"}
      title={saved ? "Remove saved job" : "Save job"}
    >
      <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
      {!compact && (saved ? "Saved" : "Save job")}
    </Button>
  );
}
