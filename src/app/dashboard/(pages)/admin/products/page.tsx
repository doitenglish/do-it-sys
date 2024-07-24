import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { Button, CreateButton } from "@/app/ui/dashboard/buttons";
import SelectOrderType from "@/app/ui/dashboard/products/select-orderType";
import SelectProductType from "@/app/ui/dashboard/products/select-productType";
import ProductTable from "@/app/ui/dashboard/products/table";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";

import Link from "next/link";
import { Suspense } from "react";

function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    product_type?: string;
    order_type?: string;
  };
}) {
  const query = searchParams?.query || "";
  const productType = Number(searchParams?.product_type) || 2;
  const orderType = Number(searchParams?.order_type) || 1;
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "products",
              label: "Products",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-6">
        <div className="flex gap-x-3">
          <CreateButton href="products/create" label="Create" />
          <Link href={`products/search`}>
            <Button>Search</Button>
          </Link>
        </div>
        <div className="flex items-center gap-x-6">
          <SelectOrderType />
          <SelectProductType />
        </div>
      </div>
      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <ProductTable
          forSearch={false}
          productType={productType}
          orderType={orderType}
          query={query}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}

export default Page;
