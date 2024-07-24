import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditProductForm from "@/app/ui/dashboard/products/edit-form";
import { PRODUCT_BASE_PATH } from "@/lib/constants";
import { getProductById } from "@/lib/data/product-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const product = await getProductById(id);

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
              label: product.id,
            },
            {
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditProductForm id={id} product={product} />
    </div>
  );
}

export default Page;
