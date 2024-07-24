import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { CancelButton } from "@/app/ui/dashboard/buttons";
import SelectStudentContainer from "@/app/ui/dashboard/schedules/students-container";
import SelectLevel from "@/app/ui/dashboard/select-level";
import Spinner from "@/app/ui/dashboard/Spinner";
import AttendeeTable from "@/app/ui/dashboard/students/attendees-table";
import { getCurrentUser } from "@/lib/auth";
import { CLASS_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { getScheduleById } from "@/lib/data/schedule-data";
import { getAttendees } from "@/lib/data/student-data";
import { redirect } from "next/navigation";

import { Suspense } from "react";

async function Page({
  params,
  searchParams,
}: {
  params: { schedule_id: string };
  searchParams: { level?: string; division?: string };
}) {
  const { schedule_id } = params;

  const [user, schedule, levels] = await Promise.all([
    getCurrentUser(),
    getScheduleById(schedule_id),
    getLevelsForSelect(),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const attendees = await getAttendees(schedule.attendees);

  const currentLevel = searchParams?.level || levels[0].id || "All";
  const currentDivision = searchParams?.division || "All";
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
              label: schedule._className,
            },
            {
              href: `${CLASS_BASE_PATH}/${schedule._class}/schedules`,
              label: "Schedules",
            },

            {
              label: "Attendees",
            },
          ]}
        />
      </div>
      <div className="flex gap-x-12 mt-20">
        <div className="flex-1 min-w-[500px] border border-neutral-200 px-5 pt-6 pb-10">
          <div className="flex justify-between items-center pl-3">
            <h2 className="text-xl font-light text-neutral-700">
              All Students
            </h2>
            <SelectLevel levels={levels} />
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
              id={schedule_id}
              _class={schedule._class}
              currentlevel={currentLevel}
              currentDivision={currentDivision}
            />
          </Suspense>
        </div>
        <div className="flex-1 min-w-[500px] border border-neutral-200 px-5 pt-6 pb-10">
          <h2 className="text-xl font-light text-neutral-700 pl-3 pt-3">
            Attendees
          </h2>
          <AttendeeTable
            id={schedule_id}
            _class={schedule._class}
            attendees={attendees}
          />
        </div>
      </div>
      <div className="mt-10">
        <CancelButton
          href={`${CLASS_BASE_PATH}/${schedule._class}/schedules`}
        />
      </div>
    </div>
  );
}

export default Page;
