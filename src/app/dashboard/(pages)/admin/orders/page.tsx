import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import SelectStatus from "@/app/ui/dashboard/orders/select-status";
import OrderTable from "@/app/ui/dashboard/orders/table";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import { Suspense } from "react";

function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    order_status?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const status = Number(searchParams?.order_status) || 1;
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "orders",
              label: "Orders",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-end -m-3">
        <SelectStatus />
      </div>
      <Suspense key={currentPage + status} fallback={<TableSkeleton />}>
        <OrderTable status={status} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}

export default Page;
