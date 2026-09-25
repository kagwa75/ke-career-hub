import { createFileRoute, Link, notFound, Outlet, redirect, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-layout";
import { JobPreview } from "@/components/admin/job-preview";
import { SocialPosts } from "@/components/admin/social-posts";
import { Button } from "@/components/ui/button";
import {
  getAdminJobEditor,
  getAdminSocialPosts,
  recordAdminPublication,
} from "@/lib/jobs/admin-actions.server";
import { generateSocialPosts } from "@/lib/jobs/social";

export const Route = createFileRoute("/admin/jobs/$jobId")({
  loader: async ({ params }) => {
    try {
      const editor = await getAdminJobEditor({ data: { jobId: params.jobId } });
      if (!editor.job) throw notFound();
      const social = await getAdminSocialPosts({ data: { jobId: editor.job.id } });
      return { ...editor, posts: social.posts };
    } catch (error) {
      if (error instanceof Response && [401, 403].includes(error.status))
        throw redirect({ to: "/admin/login" });
      throw error;
    }
  },
  component: AdminJobPreviewPage,
});

function AdminJobPreviewPage() {
  const { job, publications, posts } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname.endsWith("/edit")) return <Outlet />;

  if (!job) return null;

  const generated = posts ?? generateSocialPosts(job);
  return (
    <>
      <AdminPageHeader
        title="Preview Job"
        description="Preview the public listing, generate social posts, and record repost publication history."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (router.history.canGoBack()) router.history.back();
                else void navigate({ to: "/admin/jobs" });
              }}
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
            <Button asChild variant="secondary">
              <Link to="/admin/jobs/$jobId/edit" params={{ jobId: job.id }}>
                Edit Job
              </Link>
            </Button>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <JobPreview job={job} />
        <SocialPosts
          posts={generated}
          publications={publications}
          onRecord={async (platform, content) => {
            await recordAdminPublication({
              data: { jobId: job.id, platform, content, context: "repost" },
            });
            await router.invalidate();
          }}
        />
      </div>
    </>
  );
}
