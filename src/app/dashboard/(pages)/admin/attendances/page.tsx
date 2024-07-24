import AttendanceTable from "@/app/ui/dashboard/attendances/table";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { getCurrentUser } from "@/lib/auth";
import { ATTENDANCE_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const user = await getCurrentUser();

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
              href: ATTENDANCE_BASE_PATH,
              label: "Attendances",
            },
          ]}
        />
      </div>

      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <AttendanceTable currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
