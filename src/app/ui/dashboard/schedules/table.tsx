import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { formatDate, formatTimeToString } from "@/lib/utils";
import { CLASS_BASE_PATH, DAY_OF_WEEKS } from "@/lib/constants";
import { getSchedulesByClass } from "@/lib/data/schedule-data";
import { FrontendSchedule } from "@/definitions/schedule-types";
import TotalItems from "../total-items";

function ScheduleTableRow({ schedule }: { schedule: FrontendSchedule }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="text-lg pl-12">
        {
          DAY_OF_WEEKS.find(
            (day) => day.backendFormat === Number(schedule.dayOfWeek)
          )?.frontendFormat
        }
      </TableCell>
      <TableCell>{formatTimeToString(schedule.startTime)}</TableCell>
      <TableCell>{formatTimeToString(schedule.endTime)}</TableCell>
      <TableCell
        href={`${CLASS_BASE_PATH}/${schedule._class}/schedules/${schedule.id}/attendees`}
      >
        {schedule.attendees.length}
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(schedule.updatedAt)}
      </TableCell>
    </tr>
  );
}

async function ScheduleTable({
  id,
  currentPage,
}: {
  id: string;
  currentPage: number;
}) {
  const { data, totalCounts, totalPages } = await getSchedulesByClass(
    id,
    currentPage
  );

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm ">
              <tr>
                <TableHeaderCell className="pl-10">DayOfWeek</TableHeaderCell>
                <TableHeaderCell>StartTime</TableHeaderCell>
                <TableHeaderCell>EndTime</TableHeaderCell>
                <TableHeaderCell>Attendees</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((schedule: FrontendSchedule) => (
                <ScheduleTableRow key={schedule.id} schedule={schedule} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between ">
        <Pagination totalPages={totalPages} />
        <TotalItems label="schedules" counts={totalCounts} />
      </div>
    </>
  );
}

export default ScheduleTable;
