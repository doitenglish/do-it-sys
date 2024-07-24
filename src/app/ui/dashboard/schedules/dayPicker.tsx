"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DAY_OF_WEEKS } from "@/lib/constants";
import clsx from "clsx";

function Day({
  label,
  value,
  isTheDay,
  handleDayChange,
}: {
  label: string;
  value: number;
  isTheDay: boolean;
  handleDayChange: (value: number) => void;
}) {
  return (
    <button
      className={clsx(
        "focus:outline-none   font-light py-2  w-20 rounded-2xl",
        {
          "bg-neutral-200 bg-opacity-60": isTheDay,
        }
      )}
      onClick={() => handleDayChange(value)}
    >
      {label}
    </button>
  );
}

function DayPicker({ currentDayOfWeek }: { currentDayOfWeek: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [day, setDay] = useState(currentDayOfWeek);

  const handleDayChange = (value: number) => {
    setDay(value);
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    if (day) {
      params.set("dayOfWeek", day + "");
    }

    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);
  return (
    <div className=" gap-x-2">
      {DAY_OF_WEEKS.map((dow) => (
        <Day
          key={dow.backendFormat}
          label={dow.frontendFormat}
          value={dow.backendFormat}
          isTheDay={day === dow.backendFormat}
          handleDayChange={handleDayChange}
        />
      ))}
    </div>
  );
}

export default DayPicker;
