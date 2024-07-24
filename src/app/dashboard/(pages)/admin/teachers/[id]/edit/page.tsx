import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditTeacherForm from "@/app/ui/dashboard/teachers/edit-form";
import { TEACHER_BASE_PATH } from "@/lib/constants";
import { getTeacherById } from "@/lib/data/teacher-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const teacher = await getTeacherById(id);

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: TEACHER_BASE_PATH,
              label: "Teachers",
            },
            {
              label: teacher.name,
            },
            {
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditTeacherForm
        id={id}
        teacher={teacher}
        deletable={teacher.totalClasses == 0}
      />
    </div>
  );
}

export default Page;
