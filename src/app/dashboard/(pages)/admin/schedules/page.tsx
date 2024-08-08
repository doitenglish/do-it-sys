import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { ADMIN_SCHEDULES_BASE_PATH, DAY_OF_WEEKS } from "@/lib/constants";
import { AdminSceduleTable } from "@/app/ui/dashboard/schedules/admin-table";
import DayPicker from "@/app/ui/dashboard/schedules/dayPicker";
import { getCurrentPeriod, getToday } from "@/lib/utils";
import SelectPeriod from "@/app/ui/dashboard/schedules/select-period";

async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    dayOfWeek?: string;
    period?: string;
  };
}) {
  const today = getToday();

  const currentPage = Number(searchParams?.page) || 1;

  const currentDayOfWeek =
    Number(searchParams?.dayOfWeek) ||
    DAY_OF_WEEKS.find((day) => day.backendFormat == today.getDay())
      ?.backendFormat ||
    DAY_OF_WEEKS[0].backendFormat;
  const currentPeriod =
    Number(searchParams?.period) || getCurrentPeriod(today.getUTCHours() + 9);

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: ADMIN_SCHEDULES_BASE_PATH,
              label: "Schedules",
            },
          ]}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <DayPicker currentDayOfWeek={currentDayOfWeek} />
        <SelectPeriod currentPeriod={currentPeriod} />
      </div>

      <Suspense
        key={currentDayOfWeek + currentPeriod}
        fallback={<TableSkeleton />}
      >
        <AdminSceduleTable
          currentPage={currentPage}
          currentPeriod={currentPeriod}
          currentDayOfWeek={currentDayOfWeek}
        />
      </Suspense>
    </div>
  );
}

export default Page;
