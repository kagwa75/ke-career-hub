import { createFileRoute, redirect } from "@tanstack/react-router";

import { QuickImport } from "@/components/admin/quick-import";
import { getQuickImportOptions } from "@/lib/jobs/import-actions.server";

export const Route = createFileRoute("/admin/jobs/import")({
  loader: async () => {
    try {
      return await getQuickImportOptions();
    } catch (error) {
      if (error instanceof Response && [401, 403].includes(error.status))
        throw redirect({ to: "/admin/login" });
      throw error;
    }
  },
  component: QuickImportPage,
});

function QuickImportPage() {
  const { categories, organizations } = Route.useLoaderData();
  return <QuickImport categories={categories} organizations={organizations} />;
}
