import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateProductForm from "@/app/ui/dashboard/products/create-form";

import { PRODUCT_BASE_PATH } from "@/lib/constants";

async function Page() {
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
              href: PRODUCT_BASE_PATH + "/create",
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateProductForm />
    </div>
  );
}

export default Page;
