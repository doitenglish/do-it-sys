import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditStudentForm from "@/app/ui/dashboard/students/edit-form";
import { STUDENTS_BASE_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { getStudentById } from "@/lib/data/student-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [student, levels] = await Promise.all([
    getStudentById(id),
    getLevelsForSelect(),
  ]);

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
              label: student.nameEn,
            },
            {
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditStudentForm
        student={student}
        id={id}
        levels={levels}
        deletable={student.totalSchedules == 0}
      />
    </div>
  );
}

export default Page;
