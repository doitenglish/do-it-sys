import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditScheduleForm from "@/app/ui/dashboard/schedules/edit-form";
import { ADMIN_SCHEDULES_BASE_PATH } from "@/lib/constants";
import { getScheduleById } from "@/lib/data/schedule-data";
import { getTeachersForSelect } from "@/lib/data/teacher-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [schedule, teachers] = await Promise.all([
    getScheduleById(id),
    getTeachersForSelect(),
  ]);

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
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditScheduleForm id={id} schedule={schedule} teachers={teachers} />
    </div>
  );
}

export default Page;
