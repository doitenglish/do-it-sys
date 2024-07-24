import { getStudentsForSelect } from "@/lib/data/student-data";
import SelectStudentTable from "../students/select-student-table";

async function SelectStudentContainer({
  id,
  _class,
  currentlevel,
  currentDivision,
}: {
  id: string;
  _class: string;
  currentlevel: string;
  currentDivision: string;
}) {
  const { data } = await getStudentsForSelect(currentlevel, currentDivision);

  return (
    <>
      <SelectStudentTable id={id} _class={_class} students={data} />
    </>
  );
}

export default SelectStudentContainer;
