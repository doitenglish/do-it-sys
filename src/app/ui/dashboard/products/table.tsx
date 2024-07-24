import Pagination from "../pagination";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { TableHeaderCell, TableCell } from "../table";
import TotalItems from "../total-items";
import { PRODUCT_BASE_PATH } from "@/lib/constants";
import { getProducts, getProductsBySearch } from "@/lib/data/product-data";
import { FrontendProduct } from "@/definitions/product-types";

function ProductTableRow({ product }: { product: FrontendProduct }) {
  const type = product.type === 1 ? "Online" : "Offline";

  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10">
        {product.name}
      </TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell className="text-sm">{formatDate(product.createdAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton href={`${PRODUCT_BASE_PATH}/${product.id}/edit`} />
        </div>
      </TableCell>
    </tr>
  );
}

async function ProductTable({
  forSearch,
  query,
  productType,
  orderType,
  currentPage,
}: {
  forSearch: boolean;
  query: string;
  productType: number;
  orderType?: number;
  currentPage: number;
}) {
  const { data, totalCounts, totalPages } = forSearch
    ? await getProductsBySearch(query, productType, currentPage)
    : await getProducts(productType, orderType, currentPage);

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm">
              <tr>
                <TableHeaderCell className="pl-10">Name</TableHeaderCell>
                <TableHeaderCell className="w-1/6">Type</TableHeaderCell>
                <TableHeaderCell className="w-1/6">Price</TableHeaderCell>
                <TableHeaderCell className="w-1/6">CreatedAt</TableHeaderCell>
                <TableHeaderCell className="w-1/6 pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((product: FrontendProduct) => (
                <ProductTableRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex justify-between items-center">
        <Pagination totalPages={totalPages} />
        <TotalItems label="products" counts={totalCounts} />
      </div>
    </>
  );
}

export default ProductTable;
