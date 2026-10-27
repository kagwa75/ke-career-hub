import { CalendarPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/jobs/types";

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function DeadlineReminderButton({ job }: { job: Job }) {
  const [added, setAdded] = useState(false);
  const date = job.deadlineISO.slice(0, 10).replaceAll("-", "");
  const hasFutureDeadline = Boolean(date) && new Date(`${job.deadlineISO.slice(0, 10)}T23:59:59`).getTime() > Date.now();

  const downloadReminder = () => {
    if (!hasFutureDeadline) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const description = [
      `Application deadline: ${job.deadline}`,
      `Organization: ${job.company}`,
      `Apply: ${job.applicationUrl}`,
    ].join("\n");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Get Hired KE//Deadline Reminder//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${job.id}-${date}@gethired.bermudaappstudios.online`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${date}T090000`,
      `DTEND:${date}T093000`,
      `SUMMARY:${escapeCalendarText(`Application deadline: ${job.title}`)}`,
      `DESCRIPTION:${escapeCalendarText(description)}`,
      `URL:${window.location.origin}/jobs/${encodeURIComponent(job.id)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Job application deadline is tomorrow",
      "TRIGGER:-P1D",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ];
    const file = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const href = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${job.id}-deadline.ics`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1_000);
    setAdded(true);
  };

  return (
    <Button type="button" variant="secondary" size="sm" disabled={!hasFutureDeadline} onClick={downloadReminder}>
      <CalendarPlus className="size-4" />
      {added ? "Reminder downloaded" : "Add deadline reminder"}
    </Button>
  );
}
