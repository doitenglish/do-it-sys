import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { CancelButton } from "@/app/ui/dashboard/buttons";
import Controller from "@/app/ui/dashboard/do/admin-controller";
import DoRecordTable from "@/app/ui/dashboard/do/record-table";
import TotalBalance from "@/app/ui/dashboard/do/total-balance";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import Spinner from "@/app/ui/dashboard/Spinner";
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
              label: "Do Account",
            },
          ]}
        />
      </div>
      <div className="flex gap-x-12 ">
        <div className="w-2/3">
          <Suspense fallback={<TableSkeleton />}>
            <DoRecordTable id={id} currentPage={currentPage} />
          </Suspense>
        </div>
        <div className="w-1/3 flex flex-col gap-y-5">
          <Suspense
            fallback={
              <div className="bg-neutral-100 bg-opacity-80  h-16 border border-neutral-200 flex items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <TotalBalance id={id} />
          </Suspense>
          <Controller id={student.id} />
          <CancelButton href={STUDENTS_BASE_PATH} />
        </div>
      </div>
    </div>
  );
}

export default Page;
