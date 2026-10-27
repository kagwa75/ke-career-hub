import { useState } from "react";
import { Check, Copy, Facebook, Link2, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/jobs/types";

export function ShareJobButtons({ job }: { job: Job }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const text = `${job.title} at ${job.company}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      // Clipboard access may be blocked by browser permissions.
    }
  };

  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-semibold">Share this opportunity</p>
      <div className="flex flex-wrap gap-2">
        <ShareLink href={`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`} label="WhatsApp"><MessageCircle className="size-4" /></ShareLink>
        <ShareLink href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} label="Telegram"><Send className="size-4" /></ShareLink>
        <ShareLink href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} label="Facebook"><Facebook className="size-4" /></ShareLink>
        <ShareLink href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} label="X"><span className="font-bold">𝕏</span></ShareLink>
        <Button type="button" variant="ghost" size="sm" onClick={copyLink} disabled={!shareUrl}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}

function ShareLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <Button asChild type="button" variant="secondary" size="sm">
      <a href={href} target="_blank" rel="noreferrer" aria-label={`Share on ${label}`}>
        {children}<span>{label}</span><Link2 className="size-3.5 opacity-60" />
      </a>
    </Button>
  );
}
