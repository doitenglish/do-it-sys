import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditLevelStudents from "@/app/ui/dashboard/levels/edit-students";
import { LEVELS_BASE_PATH } from "@/lib/constants";
import { getLevelsForSelect } from "@/lib/data/level-data";
import { getStudentsForSelect } from "@/lib/data/student-data";
import { notFound } from "next/navigation";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const { id } = params;
  const currentPage = Number(searchParams.page) || 1;

  const [levels, { data }] = await Promise.all([
    getLevelsForSelect(),
    getStudentsForSelect(id, "All"),
  ]);

  const level = levels.find((lvl) => lvl.id === id);

  if (!level) {
    return notFound();
  }

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
              label: "Students",
            },
          ]}
        />
      </div>
      <EditLevelStudents
        id={id}
        levels={levels}
        students={data}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Page;
