import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import ChangePassword from "@/app/ui/dashboard/teachers/change-password";
import { getCurrentUser } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";

async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect(LOGIN_PATH);
  }

  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          role={user.role}
          breadcrumbs={[
            {
              label: "Change Password",
            },
          ]}
        />
      </div>
      <ChangePassword forAdmin />
    </div>
  );
}

export default Page;
