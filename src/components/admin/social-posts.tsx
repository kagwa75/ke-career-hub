import { Copy, Megaphone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobPublication } from "@/lib/jobs/types";

type Posts = {
  whatsapp: string;
  telegram: string;
  facebook: string;
};

export function SocialPosts({
  posts,
  publications,
  onRecord,
}: {
  posts: Posts;
  publications: JobPublication[];
  onRecord?: (platform: keyof Posts, content: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (platform: keyof Posts) => {
    await navigator.clipboard.writeText(posts[platform]);
    setCopied(platform);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase text-primary">Generate posts</p>
          <h2 className="font-heading text-xl font-extrabold">Social post generator</h2>
        </div>
        <Megaphone className="size-6 text-primary" />
      </div>
      <Tabs defaultValue="whatsapp" className="mt-5">
        <TabsList>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
        </TabsList>
        {(["whatsapp", "telegram", "facebook"] as const).map((platform) => (
          <TabsContent key={platform} value={platform} className="mt-4">
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-background p-4 text-sm leading-6">
              {posts[platform]}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={() => copy(platform)}>
                <Copy className="size-4" />
                {copied === platform ? "Copied" : "Copy"}
              </Button>
              {onRecord && (
                <Button type="button" size="sm" variant="secondary" onClick={() => onRecord(platform, posts[platform])}>
                  Mark published
                </Button>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {publications.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="font-heading text-sm font-bold">Publication history</p>
          <div className="mt-3 space-y-2">
            {publications.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-surface px-3 py-2 text-sm">
                <span className="font-semibold capitalize">{item.platform}</span>
                <span className="text-muted-foreground">{new Date(item.publishedAt).toLocaleString("en-KE")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
