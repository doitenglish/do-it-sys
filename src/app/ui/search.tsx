"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

function Search({
  placeholder,
}: {
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback(
    (term: string) => {
      const params = new URLSearchParams(
        searchParams
      );
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    500
  );

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <input
        type="text"
        placeholder={placeholder}
        className="block w-full text-sm pl-14 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md"
        onChange={(e) =>
          handleSearch(e.target.value)
        }
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-[18px] h-[18px] absolute left-5 top-1/2 -translate-y-1/2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </div>
  );
}

export default Search;
