import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import StudentOrderTable from "@/app/ui/dashboard/students/order-table";
import { STUDENTS_BASE_PATH } from "@/lib/constants";
import { getStudentById } from "@/lib/data/student-data";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: {
    page?: string;
  };
}) {
  const { id } = params;

  const student = await getStudentById(id);

  if (!student) {
    return notFound();
  }
  const currentPage = Number(searchParams?.page) || 1;

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
              label: "Orders",
            },
          ]}
        />
      </div>

      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <StudentOrderTable id={id} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
