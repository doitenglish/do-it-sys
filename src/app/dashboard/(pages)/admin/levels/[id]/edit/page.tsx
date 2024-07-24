import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditLevelForm from "@/app/ui/dashboard/levels/edit-form";
import { LEVELS_BASE_PATH } from "@/lib/constants";
import { getLevelById } from "@/lib/data/level-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const level = await getLevelById({ id });

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: LEVELS_BASE_PATH,
              label: "Levels",
            },
            {
              label: level.name,
            },
            {
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditLevelForm
        id={id}
        level={level}
        deletable={level.totalClasses == 0 && level.totalStudents == 0}
      />
    </div>
  );
}

export default Page;
