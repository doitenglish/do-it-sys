import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import ClassTable from "@/app/ui/dashboard/classes/table";
import { getLevelsForSelect } from "@/lib/data/level-data";
import SelectLevel from "@/app/ui/dashboard/select-level";
import { TEACHER_BASE_PATH } from "@/lib/constants";
import { getTeacherById } from "@/lib/data/teacher-data";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    page?: string;
    level?: string;
    division?: string;
  };
}) {
  const { id } = params;

  const [teacher, levels] = await Promise.all([
    getTeacherById(id),
    getLevelsForSelect(),
  ]);

  const currentPage = Number(searchParams?.page) || 1;
  const currentLevel = searchParams?.level || "All";
  const currentDivision = searchParams?.division || "All";

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: TEACHER_BASE_PATH,
              label: "Teachers",
            },
            {
              label: teacher.name,
            },
            {
              label: "Classes",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-start gap-6">
        <SelectLevel levels={levels} forSchedule />
      </div>

      <Suspense
        key={currentPage + currentLevel + currentDivision}
        fallback={<TableSkeleton />}
      >
        <ClassTable
          forAdmin
          id={id!}
          currentPage={currentPage}
          currentlevel={currentLevel}
          currentDivision={currentDivision}
        />
      </Suspense>
    </div>
  );
}

export default Page;
