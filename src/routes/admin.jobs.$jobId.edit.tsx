import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { AdminPageHeader } from "@/components/admin/admin-layout";
import { JobForm } from "@/components/admin/job-form";
import { getAdminJobEditor } from "@/lib/jobs/admin-actions.server";

export const Route = createFileRoute("/admin/jobs/$jobId/edit")({
  loader: async ({ params }) => {
    try {
      const data = await getAdminJobEditor({ data: { jobId: params.jobId } });
      if (!data.job) throw notFound();
      return data;
    } catch (error) {
      if (error instanceof Response && [401, 403].includes(error.status))
        throw redirect({ to: "/admin/login" });
      throw error;
    }
  },
  component: EditJobPage,
});

function EditJobPage() {
  const { job, categories, organizations } = Route.useLoaderData();
  return (
    <>
      <AdminPageHeader
        title="Edit Job"
        description="Update the existing master job record without creating a duplicate."
      />
      <JobForm job={job} categories={categories} organizations={organizations} />
    </>
  );
}
