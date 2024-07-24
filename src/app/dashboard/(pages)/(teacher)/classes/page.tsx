import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import ClassTable from "@/app/ui/dashboard/classes/table";
import { getLevelsForSelect } from "@/lib/data/level-data";
import SelectLevel from "@/app/ui/dashboard/select-level";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LOGIN_PATH } from "@/lib/constants";

async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    level?: string;
    division?: string;
  };
}) {
  const [user, levels] = await Promise.all([
    getCurrentUser(),
    getLevelsForSelect(),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const currentPage = Number(searchParams?.page) || 1;
  const currentLevel = searchParams?.level || "All";
  const currentDivision = searchParams?.division || "All";

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          role={user.role}
          breadcrumbs={[
            {
              href: "classes",
              label: "Classes",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-start gap-6">
        <CreateButton href="/dashboard/classes/create" label="Create" />
        <SelectLevel levels={levels} forSchedule />
      </div>

      <Suspense
        key={currentPage + currentLevel + currentDivision}
        fallback={<TableSkeleton />}
      >
        <ClassTable
          id={user.uid}
          currentPage={currentPage}
          currentlevel={currentLevel}
          currentDivision={currentDivision}
        />
      </Suspense>
    </div>
  );
}

export default Page;
