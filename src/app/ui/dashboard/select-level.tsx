"use client";

import { FrontendLevel } from "@/definitions/level-types";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { UnderArr } from "./form";

function SelectLevel({
  levels,
  forSchedule = false,
}: {
  levels: FrontendLevel[];
  forSchedule?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [level, setLevel] = useState(
    forSchedule ? "All" : levels.length > 0 ? levels[0].id : "All"
  );
  const [divisions, setDivisions] = useState<string[]>([]);
  const [division, setDivision] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const currentLvl = levels.find((lvl) => lvl.id == level);
    setDivisions(currentLvl?.divisions ?? []);
    params.set("query", "");
    params.set("page", "1");
    params.set("division", "All");
    if (level) {
      params.set("level", level);
    }
    replace(`${pathname}?${params.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (division) {
      params.set("division", division);
    }
    replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [division]);

  return (
    <div className="flex gap-x-3">
      <div className="relative flex-1">
        <select
          className=" appearance-none focus:outline-none border py-3 pl-4 w-24 border-neutral-300 text-neutral-700 cursor-pointer"
          onChange={(e) => setLevel(e.target.value)}
          value={level}
        >
          <option value="All">All</option>
          {levels.map((lvl) => (
            <option key={lvl.id} value={lvl.id}>
              {lvl.name.slice(0, 4)}
            </option>
          ))}
        </select>
        <UnderArr />
      </div>
      <div className="relative flex-1">
        <select
          className=" appearance-none focus:outline-none border py-3 pl-4 w-24 border-neutral-300 text-neutral-700 cursor-pointer"
          onChange={(e) => setDivision(e.target.value)}
          value={division}
        >
          <option value="All">All</option>
          {divisions.map((dvs) => (
            <option key={dvs} value={dvs}>
              {dvs}
            </option>
          ))}
        </select>
        <UnderArr />
      </div>
    </div>
  );
}

export default SelectLevel;
