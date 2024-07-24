import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import LevelTable from "@/app/ui/dashboard/levels/table";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { Suspense } from "react";

function Page({
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
              href: "levels",
              label: "Levels",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <CreateButton href="levels/create" label="Create" />
      </div>
      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <LevelTable currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
