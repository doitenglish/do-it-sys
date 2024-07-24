"use client";

import clsx from "clsx";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ToggleClass() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selected, setSelected] = useState("Today");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    if (selected) {
      params.set("filter", selected);
    }
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  return (
    <div className="flex text-neutral-600">
      <button
        name="Today"
        onClick={() => setSelected("Today")}
        className={clsx(
          "bg-neutral-100  py-3 w-20 text-center text-sm border border-neutral-200",
          {
            "bg-yellow-300 border-yellow-300 text-neutral-700":
              selected == "Today",
          }
        )}
      >
        Today
      </button>
      <button
        name="All"
        onClick={() => setSelected("All")}
        className={clsx(
          "bg-neutral-100  py-3 w-20 text-center text-sm border border-neutral-200",
          {
            "bg-yellow-300 border-yellow-300 text-neutral-700":
              selected == "All",
          }
        )}
      >
        All
      </button>
    </div>
  );
}

export default ToggleClass;
