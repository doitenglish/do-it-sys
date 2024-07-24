"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import clsx from "clsx";

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
        "focus:outline-none font-normal text-gray-400 py-2 w-24 rounded-2xl",
        {
          "bg-neutral-200 bg-opacity-60 text-gray-700": isFocus,
        }
      )}
      onClick={() => handleTypeChange(value)}
    >
      {label}
    </button>
  );
}

function SelectOrderType() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  //1: 주문대기, 2: 배송대기, 3: 수령대기, 4:수령완료, 5: 주문취소
  const [status, setStatus] = useState<number>(1);

  const handleStatusChange = (value: number) => {
    setStatus(value);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    // params.set("product_type", "1");
    if (status) {
      params.set("order_status", status + "");
    }
    replace(`${pathname}?${params.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="gap-x-4">
      <Type
        label="주문 대기"
        value={1}
        isFocus={status == 1}
        handleTypeChange={handleStatusChange}
      />
      <Type
        label="배송 대기"
        value={2}
        isFocus={status == 2}
        handleTypeChange={handleStatusChange}
      />
      <Type
        label="수령 대기"
        value={3}
        isFocus={status == 3}
        handleTypeChange={handleStatusChange}
      />
    </div>
  );
}

export default SelectOrderType;
