import SideNav from "@/app/ui/dashboard/sideNav";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/dashboard/login");
  }

  return (
    <div className="flex flex-row h-screen w-full  ">
      <div className="hidden 2xl:flex h-full max-w-96">
        <SideNav role={user.role} name={user.name} />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

export default Layout;
