"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Type({
  label,
  value,
  isFocus,
  handleTypeChange,
}: {
  label: string;
  value: number;
  isFocus: boolean;
  handleTypeChange: (value: number) => void;
}) {
  return (
    <button
      className={clsx(
        "focus:outline-none   font-light py-2  w-20 rounded-2xl",
        {
          "bg-neutral-200 bg-opacity-60": isFocus,
        }
      )}
      onClick={() => handleTypeChange(value)}
    >
      {label}
    </button>
  );
}

interface ISelectProductType {
  defaultType?: number;
}

function SelectProductType({ defaultType }: ISelectProductType) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [type, setType] = useState<number>(defaultType || 2);

  const handleTypeChange = (value: number) => {
    setType(value);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    //params.set("order_type", "1");
    if (type) {
      params.set("product_type", type + "");
    }

    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className=" gap-x-2">
      <Type
        label="All"
        value={-1}
        isFocus={type == -1}
        handleTypeChange={handleTypeChange}
      />
      <Type
        label="Offline"
        value={2}
        isFocus={type == 2}
        handleTypeChange={handleTypeChange}
      />
      <Type
        label="Online"
        value={1}
        isFocus={type == 1}
        handleTypeChange={handleTypeChange}
      />
    </div>
  );
}

export default SelectProductType;
