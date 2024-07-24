"use client";

import { UnderArr } from "../form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function SelectPeriod({ currentPeriod }: { currentPeriod: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [period, setPeriod] = useState(currentPeriod);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    if (period) {
      params.set("period", period + "");
    }

    router.replace(`${pathname}?${params.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);
  return (
    <div className="relative ">
      <select
        id="timeCategory"
        name="timeCategory"
        className=" appearance-none focus:outline-none border py-3.5 pl-4 w-40 border-neutral-300 text-neutral-700 cursor-pointer text-sm"
        value={period}
        onChange={(e) => setPeriod(+e.target.value)}
      >
        <option key={-1} value={-1}>
          All
        </option>
        {[1, 2, 3, 4, 5].map((period) => (
          <option key={period} value={period}>
            {period} 교시
          </option>
        ))}
      </select>
      <UnderArr />
    </div>
  );
}

export default SelectPeriod;
