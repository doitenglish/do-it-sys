import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateClassForm from "@/app/ui/dashboard/classes/create-form";
import { getCurrentUser } from "@/lib/auth";
import { CLASS_BASE_PATH, LOGIN_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { getTeachersForSelect } from "@/lib/data/teacher-data";
import { redirect } from "next/navigation";

import React from "react";

async function Page() {
  const [user, teachers, levels] = await Promise.all([
    getCurrentUser(),
    getTeachersForSelect(),
    getLevelsForSelect(),
  ]);

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const currentTeacher = teachers.filter((teacher) => teacher.id == user.uid)!;
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          role={user?.role}
          breadcrumbs={[
            {
              href: CLASS_BASE_PATH,
              label: "Classes",
            },
            {
              href: CLASS_BASE_PATH + "/create",
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateClassForm levels={levels} teachers={currentTeacher} />
    </div>
  );
}

export default Page;
