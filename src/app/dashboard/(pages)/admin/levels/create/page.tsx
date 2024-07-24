import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateLevelForm from "@/app/ui/dashboard/levels/create-form";

async function Page() {
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "/admin/dashboard/levels",
              label: "Levels",
            },
            {
              href: "/admin/dashboard/levels/create",
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateLevelForm />
    </div>
  );
}

export default Page;
