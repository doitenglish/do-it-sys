import Pagination from "../pagination";
import { TableHeaderCell, TableCell } from "../table";
import TotalItems from "../total-items";
import { ATTENDANCE_BASE_PATH, DAY_OF_WEEKS } from "@/lib/constants";
import { getAttendances } from "@/lib/data/attendance-data";
import { AttendanceBase } from "@/definitions/attendance-types";

function AttendanceTableRow({ attendance }: { attendance: AttendanceBase }) {
  const dayOfweek = DAY_OF_WEEKS.find(
    (dow) => dow.backendFormat === attendance.dayOfWeek
  )?.frontendFormat;

  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal  tracking-wide text-neutral-700 pl-10">
        {attendance.date}
      </TableCell>
      <TableCell>{dayOfweek}</TableCell>
      <TableCell href={`${ATTENDANCE_BASE_PATH}/${attendance.date}/absents`}>
        {attendance.absents.length}
      </TableCell>
    </tr>
  );
}

async function AttendanceTable({ currentPage }: { currentPage: number }) {
  const { data, totalCounts, totalPages } = await getAttendances(currentPage);

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm">
              <tr>
                <TableHeaderCell className="pl-10">Date</TableHeaderCell>
                <TableHeaderCell>DayOfWeek</TableHeaderCell>
                <TableHeaderCell>Absents</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((atde: AttendanceBase) => (
                <AttendanceTableRow key={atde.date} attendance={atde} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex justify-between items-center">
        <Pagination totalPages={totalPages} />
        <TotalItems label="attendances" counts={totalCounts} />
      </div>
    </>
  );
}

export default AttendanceTable;
