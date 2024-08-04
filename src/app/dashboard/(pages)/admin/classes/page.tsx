import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import AdminClassTable from "@/app/ui/dashboard/classes/admin-table";
import SelectLevel from "@/app/ui/dashboard/select-level";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import Search from "@/app/ui/search";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_CLASS_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
  const [user, levels] = await Promise.all([
    getCurrentUser(),
    getLevelsForSelect(),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const query = searchParams?.query || "";
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
              href: ADMIN_CLASS_BASE_PATH,
              label: "Classes",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <CreateButton href="classes/create" label="Create" />

        <SelectLevel levels={levels} />
        <Search placeholder="Search Classes..." />
      </div>

      <Suspense
        key={query + currentLevel + currentDivision + currentPage}
        fallback={<TableSkeleton />}
      >
        <AdminClassTable
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
