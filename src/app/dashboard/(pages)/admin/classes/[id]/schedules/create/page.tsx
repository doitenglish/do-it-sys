import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateScheduleForm from "@/app/ui/dashboard/schedules/create-form";
import { getCurrentUser } from "@/lib/auth";
import { ADMIN_CLASS_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { getClassById } from "@/lib/data/class-data";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [user, _class] = await Promise.all([
    getCurrentUser(),
    getClassById(id),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

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
            {
              label: _class.name,
            },
            {
              href: ADMIN_CLASS_BASE_PATH + `/${_class.id}/schedules`,
              label: "Schedules",
            },
            {
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateScheduleForm forAdmin={true} _class={_class} />
    </div>
  );
}

export default Page;
