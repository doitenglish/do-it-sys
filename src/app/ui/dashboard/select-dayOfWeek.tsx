"use client";

import { DAY_OF_WEEKS } from "@/lib/constants";
import { UnderArr } from "./form";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SelectDayOfWeek({ today }: { today: Date }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [dayOfWeek, setDayOfWeek] = useState(
    DAY_OF_WEEKS.find((day) => day.backendFormat == today.getDay())
      ?.backendFormat ?? DAY_OF_WEEKS[0].backendFormat
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");
    if (dayOfWeek) {
      params.set("dayOfWeek", dayOfWeek + "");
    }

    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayOfWeek]);

  return (
    <div className="relative flex-1">
      <select
        id="dayOfWeek"
        name="dayOfWeek"
        className=" appearance-none focus:outline-none border py-3 pl-4 w-32 border-neutral-300 text-neutral-700 cursor-pointer"
        value={dayOfWeek}
        onChange={(e) => setDayOfWeek(+e.target.value)}
      >
        <option value={-1}>All</option>
        {DAY_OF_WEEKS.map((day) => (
          <option key={day.backendFormat} value={day.backendFormat}>
            {day.frontendFormat}
          </option>
        ))}
      </select>
      <UnderArr />
    </div>
  );
}

export default SelectDayOfWeek;
