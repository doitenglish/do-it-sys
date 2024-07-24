import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditClassForm from "@/app/ui/dashboard/classes/edit-form";
import { ADMIN_CLASS_BASE_PATH } from "@/lib/constants";
import { getClassById } from "@/lib/data/class-data";
import { getTeachersForSelect } from "@/lib/data/teacher-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [_class, teachers] = await Promise.all([
    getClassById(id),
    getTeachersForSelect(),
  ]);

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: ADMIN_CLASS_BASE_PATH,
              label: "Classes",
            },
            {
              label: _class.name,
            },
            {
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditClassForm
        id={id}
        _class={_class}
        teachers={teachers}
        deletable={_class.totalSchedules == 0}
      />
    </div>
  );
}

export default Page;
