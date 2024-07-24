"use client";

import { Button, CancelButton, DeleteButton, ResetPassword } from "../buttons";
import { deleteTeacher, resetPassword } from "@/lib/actions/teacher-actions";
import { FrontendTeacher } from "@/definitions/teacher-types";
import { FormRow } from "../form";

function EditTeacherForm({
  id,
  teacher,
  deletable,
}: {
  id: string;
  teacher: FrontendTeacher;
  deletable: boolean;
}) {
  const deleteTeacherWithBind = deleteTeacher.bind(null, id);
  const resetPasswordWithBind = resetPassword.bind(null, id);
  return (
    <form className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && signInID*/}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" disabled>
            <div className="input-field">{teacher.name}</div>
          </FormRow>
          {/*signInID*/}
          <FormRow label="ID" disabled>
            <div className="input-field">{teacher.signInID}</div>
          </FormRow>
        </div>
      </div>

      <div className="flex w-full justify-between mt-4">
        <div className="flex gap-x-4">
          <CancelButton href={`/dashboard/admin/teachers`} />
          <DeleteButton action={deleteTeacherWithBind} disabled={!deletable} />
        </div>
        <div className="flex gap-x-4">
          <ResetPassword action={resetPasswordWithBind} />
          <Button type="submit" disabled>
            Edit
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EditTeacherForm;
