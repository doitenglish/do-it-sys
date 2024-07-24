import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import EditOrderForm from "@/app/ui/dashboard/orders/edit-form";
import { ORDER_BASE_PATH } from "@/lib/constants";
import { getOrderById } from "@/lib/data/order-data";

async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const order = await getOrderById(id);

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: ORDER_BASE_PATH,
              label: "Orders",
            },
            {
              label: "Edit",
            },
          ]}
        />
      </div>
      <EditOrderForm id={id} order={order} />
    </div>
  );
}

export default Page;
