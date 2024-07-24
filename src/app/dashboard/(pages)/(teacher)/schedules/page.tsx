import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import TodoTable from "@/app/ui/dashboard/schedules/todo-table";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/constants";

async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    level?: string;
    division?: string;
  };
}) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          role={user.role}
          breadcrumbs={[
            {
              href: "schedules",
              label: "Schedules",
            },
          ]}
        />
      </div>

      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <TodoTable id={user.uid} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
