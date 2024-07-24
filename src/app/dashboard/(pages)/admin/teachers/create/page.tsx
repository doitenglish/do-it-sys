import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import CreateTeacherForm from "@/app/ui/dashboard/teachers/create-form";

function Page() {
  return (
    <div className="default-wrapper">
      <div className="breadcrumbs-wrapper">
        <Breadcrumbs
          breadcrumbs={[
            {
              href: "/dashboard/admin/teachers",
              label: "Teachers",
            },
            {
              href: "/dashboard/admin/teachers/create",
              label: "Create",
            },
          ]}
        />
      </div>
      <CreateTeacherForm />
    </div>
  );
}

export default Page;
