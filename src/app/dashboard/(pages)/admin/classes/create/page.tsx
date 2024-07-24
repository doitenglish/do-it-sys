import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateClassForm from "@/app/ui/dashboard/classes/create-form";
import { getCurrentUser } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { getTeachersForSelect } from "@/lib/data/teacher-data";
import { redirect } from "next/navigation";

async function Page() {
  const [user, teachers, levels] = await Promise.all([
    getCurrentUser(),
    getTeachersForSelect(),
    getLevelsForSelect(),
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
              href: "/dashboard/admin/classes",
              label: "Classes",
            },
            {
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateClassForm levels={levels} teachers={teachers} forAdmin />
    </div>
  );
}

export default Page;
