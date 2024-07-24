import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { getScheduleById } from "@/lib/data/schedule-data";
import { DAY_OF_WEEKS, LOGIN_PATH } from "@/lib/constants";
import { getAttendees } from "@/lib/data/student-data";
import OnAir from "@/app/ui/dashboard/schedules/on-air";
import AttendeeTable from "@/app/ui/dashboard/students/attendees-table";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Page({
  params,
  searchParams,
}: {
  params: {
    id: string;
  };
  searchParams?: {
    atd?: string;
  };
}) {
  const { id } = params;

  const [user, schedule] = await Promise.all([
    getCurrentUser(),
    getScheduleById(id),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const attendees = await getAttendees(schedule.attendees);

  const currentAtd = searchParams?.atd;

  //TODO: check if attendance exists && check if user is teacher of schedule

  const dayOfWeekFormat =
    DAY_OF_WEEKS.find((dow) => dow.backendFormat === schedule.dayOfWeek)
      ?.frontendFormat || "";

  const label = `${schedule._className} ( ${schedule.levelName},  ${dayOfWeekFormat} )`;

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          role={user.role}
          breadcrumbs={[
            {
              label: "Schedules",
            },
            {
              label,
            },
          ]}
        />
      </div>
      <div className="flex gap-x-6">
        <div className=" w-2/3">
          <AttendeeTable
            onAir
            id={id}
            _class={schedule._class}
            attendees={attendees}
          />
        </div>
        <div className="flex flex-col w-1/3 min-w-[480px] mt-10">
          <OnAir
            id={id}
            attendees={attendees}
            teacherName={schedule.teacherName}
            _className={schedule._className}
            currentAtd={currentAtd}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
