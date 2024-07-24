import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateStudentForm from "@/app/ui/dashboard/students/create-form";
import { STUDENTS_BASE_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";

async function Page() {
  const levels = await getLevelsForSelect();

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: STUDENTS_BASE_PATH,
              label: "Students",
            },
            {
              href: STUDENTS_BASE_PATH + "/create",
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateStudentForm levels={levels} />
    </div>
  );
}

export default Page;
