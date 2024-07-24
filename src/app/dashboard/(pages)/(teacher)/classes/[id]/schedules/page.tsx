import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { CreateButton } from "@/app/ui/dashboard/buttons";
import ScheduleTable from "@/app/ui/dashboard/schedules/table";

import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { getCurrentUser } from "@/lib/auth";
import { CLASS_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { getClassById } from "@/lib/data/class-data";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    page?: string;
  };
}) {
  const { id } = params;

  const [user, _class] = await Promise.all([
    getCurrentUser(),
    getClassById(id),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          role={user.role}
          breadcrumbs={[
            {
              href: CLASS_BASE_PATH,
              label: "Classes",
            },
            {
              label: _class.name,
            },
            {
              label: "Schedules",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <CreateButton
          href={CLASS_BASE_PATH + `/${id}/schedules/create`}
          label="Create"
        />
      </div>

      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <ScheduleTable id={id} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
