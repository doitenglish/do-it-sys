import AbsentTable from "@/app/ui/dashboard/attendances/absents-table";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { getCurrentUser } from "@/lib/auth";
import { ATTENDANCE_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { getAttendanceById } from "@/lib/data/attendance-data";
import { getAttendees } from "@/lib/data/student-data";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const [user, attendance] = await Promise.all([
    getCurrentUser(),
    getAttendanceById(id),
  ]);
  if (!user) {
    return redirect(LOGIN_PATH);
  }
  const absents = await getAttendees(attendance.absents);

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
            {
              label: attendance.date,
            },
            {
              label: "Absents",
            },
          ]}
        />
      </div>
      <Suspense key={attendance.date} fallback={<TableSkeleton />}>
        <AbsentTable absents={absents} date={attendance.date} />
      </Suspense>
    </div>
  );
}

export default Page;
