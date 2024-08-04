import Search from "@/app/ui/search";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import { getLevelsForSelect } from "@/lib/data/level-data";

import SelectLevel from "@/app/ui/dashboard/select-level";
import StudentTable from "@/app/ui/dashboard/students/table";

async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    level?: string;
    division?: string;
  };
}) {
  const levels = await getLevelsForSelect();

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const currentLevel = searchParams?.level || "All";
  const currentDivision = searchParams?.division || "All";

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "/dashboard/admin/students",
              label: "Students",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <CreateButton href="students/create" label="Create" />

        <SelectLevel levels={levels} />
        <Search placeholder="Search Students..." />
      </div>

      <Suspense key={currentLevel} fallback={<TableSkeleton />}>
        <StudentTable
          query={query}
          currentlevel={currentLevel}
          currentDivision={currentDivision}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}

export default Page;
