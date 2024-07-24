"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { UnderArr } from "../form";

function SelectOrderType() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //1: 인기순, 2: 높은가격순, 3: 낮은가격순
  const [type, setType] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    // params.set("product_type", "1");
    if (type) {
      params.set("order_type", type + "");
    }
    replace(`${pathname}?${params.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className="relative">
      <select
        className=" appearance-none focus:outline-none border py-3 pl-4 w-52 border-neutral-300 text-neutral-700 cursor-pointer"
        onChange={(e) => setType(+e.target.value)}
        value={type}
      >
        <option value={1}>Best Sellers</option>
        <option value={3}>Price: Low to High</option>
        <option value={2}>Price: High to Low</option>
      </select>
      <UnderArr />
    </div>
  );
}

export default SelectOrderType;
