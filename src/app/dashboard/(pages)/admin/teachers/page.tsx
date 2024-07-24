import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import TeacherTable from "@/app/ui/dashboard/teachers/table";

async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "teachers",
              label: "Teachers",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <CreateButton href="teachers/create" label="Create" />
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TeacherTable currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
