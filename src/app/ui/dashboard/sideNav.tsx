import Image from "next/image";
import NavLinks from "./nav-links";
import { signOut } from "@/lib/actions/auth-actions";
import Link from "next/link";

function SideNav({ role, name }: { role: string; name: string }) {
  const href = role == "teacher" ? "/dashboard/me" : "/dashboard/admin/me";

  return (
    <div className="h-full  w-full min-w-[320px] px-7 py-12 flex flex-col justify-between border-r-[1.5px] border-neutral-200  ">
      <div className="flex flex-col w-full">
        <div className=" mb-12 flex w-full  justify-between items-end">
          <Image
            src="/logo_final_4.png"
            alt="main logo"
            width={55}
            height={55}
            priority
          />

          <Link href={href} className=" underline -mb-1 text-lg">
            {" "}
            {name}
          </Link>
        </div>
        <div>
          <NavLinks role={role} />
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="p-3.5 border-2 border-neutral-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-neutral-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default SideNav;
