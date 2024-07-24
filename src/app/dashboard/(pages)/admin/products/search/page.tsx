import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import SelectProductType from "@/app/ui/dashboard/products/select-productType";
import ProductTable from "@/app/ui/dashboard/products/table";
import { TableSkeleton } from "@/app/ui/dashboard/skeletons";
import Search from "@/app/ui/search";
import { PRODUCT_BASE_PATH } from "@/lib/constants";
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
  const productType = Number(searchParams?.product_type) || -1;

  const currentPage = Number(searchParams?.page) || 1;
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: PRODUCT_BASE_PATH,
              label: "Products",
            },
            {
              label: "Search",
            },
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-x-12">
        <SelectProductType defaultType={-1} />
        <Search placeholder="Searching Products..." />
      </div>
      <Suspense key={currentPage} fallback={<TableSkeleton />}>
        <ProductTable
          forSearch
          productType={productType}
          query={query}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}

export default Page;
