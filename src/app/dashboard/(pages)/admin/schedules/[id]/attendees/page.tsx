import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { CancelButton } from "@/app/ui/dashboard/buttons";
import SelectStudentContainer from "@/app/ui/dashboard/schedules/students-container";
import SelectLevel from "@/app/ui/dashboard/select-level";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import Spinner from "@/app/ui/dashboard/Spinner";
import AttendeeTable from "@/app/ui/dashboard/students/attendees-table";
import { ADMIN_SCHEDULES_BASE_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { getScheduleById } from "@/lib/data/schedule-data";
import { getAttendees } from "@/lib/data/student-data";

import { Suspense } from "react";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { level?: string; division?: string };
}) {
  const { id } = params;

  const schedule = await getScheduleById(id);
  const attendees = await getAttendees(schedule.attendees);
  const levels = await getLevelsForSelect();

  const currentLevel = searchParams?.level || levels[0].id || "All";
  const currentDivision = searchParams?.division || "All";
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: ADMIN_SCHEDULES_BASE_PATH,
              label: "Schedules",
            },
            {
              label: schedule.id,
            },
            {
              label: "Attendees",
            },
          ]}
        />
      </div>
      <div className="flex gap-x-16 mt-20">
        <div className="flex-1 min-w-[500px] border border-neutral-200 px-5 pt-6 pb-10">
          <div className="flex justify-between items-center pl-3">
            <h2 className="text-xl font-light text-neutral-700">
              All Students
            </h2>
            <SelectLevel levels={levels} forSchedule />
          </div>
          <Suspense
            key={currentLevel + currentDivision}
            fallback={
              <div className="w-full h-96 flex justify-center items-center">
                <Spinner />
              </div>
            }
          >
            <SelectStudentContainer
              id={id}
              _class={schedule._class}
              currentlevel={currentLevel}
              currentDivision={currentDivision}
            />
          </Suspense>
        </div>
        <div className="flex-1 min-w-[530px] border border-neutral-200 px-5 pt-6 pb-10">
          <h2 className="text-xl font-light text-neutral-700 pl-3 pt-3">
            Attendees
          </h2>
          <AttendeeTable
            id={id}
            _class={schedule._class}
            attendees={attendees}
          />
        </div>
      </div>
      <div className="mt-10">
        <CancelButton href={`${ADMIN_SCHEDULES_BASE_PATH}`} />
      </div>
    </div>
  );
}

export default Page;
