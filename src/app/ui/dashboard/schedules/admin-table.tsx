import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { EditButton } from "../buttons";
import { formatDate, formatTimeToString } from "@/lib/utils";
import TotalItems from "../total-items";
import { ADMIN_SCHEDULES_BASE_PATH, DAY_OF_WEEKS } from "@/lib/constants";
import { FrontendSchedule } from "@/definitions/schedule-types";
import {
  getSchedulesByClass,
  getSchedulesByFilters,
} from "@/lib/data/schedule-data";

function ScheduleByClassTableRow({ schedule }: { schedule: FrontendSchedule }) {
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
      <TableCell href={`${ADMIN_SCHEDULES_BASE_PATH}/${schedule.id}/attendees`}>
        {schedule.attendees.length}
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(schedule.updatedAt)}
      </TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton
            href={`${ADMIN_SCHEDULES_BASE_PATH}/${schedule.id}/edit`}
          />
        </div>
      </TableCell>
    </tr>
  );
}

export async function AdminSceduleByClassTable({
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
                <TableHeaderCell className="pl-12 ">DayOfWeek</TableHeaderCell>
                <TableHeaderCell>StartTime</TableHeaderCell>
                <TableHeaderCell>EndTime</TableHeaderCell>
                <TableHeaderCell>Attendees </TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((schedule: FrontendSchedule) => (
                <ScheduleByClassTableRow
                  key={schedule.id}
                  schedule={schedule}
                />
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

function ScheduleTableRow({ schedule }: { schedule: FrontendSchedule }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-semibold text-neutral-700  pl-10">
        {schedule._className}
      </TableCell>
      <TableCell className="font-medium">{schedule.teacherName}</TableCell>

      <TableCell className="font-medium">{schedule.levelName}</TableCell>
      <TableCell
        className={{
          "text-neutral-400 text-sm": schedule.division == "none",
        }}
      >
        {schedule.division}
      </TableCell>

      <TableCell>{formatTimeToString(schedule.startTime)}</TableCell>

      <TableCell href={`${ADMIN_SCHEDULES_BASE_PATH}/${schedule.id}/attendees`}>
        {schedule.attendees.length}
      </TableCell>

      <TableCell className="text-sm">
        {formatDate(schedule.updatedAt)}
      </TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton
            href={`${ADMIN_SCHEDULES_BASE_PATH}/${schedule.id}/edit`}
          />
        </div>
      </TableCell>
    </tr>
  );
}

export async function AdminSceduleTable({
  currentPage,
  currentDayOfWeek,
  currentPeriod,
}: {
  currentPage: number;
  currentDayOfWeek: number;
  currentPeriod: number;
}) {
  const { data, totalCounts, totalPages } = await getSchedulesByFilters(
    currentPage,
    {
      dayOfWeek: currentDayOfWeek,
      period: currentPeriod,
    }
  );
  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm ">
              <tr>
                <TableHeaderCell className="pl-10 ">ClassName</TableHeaderCell>
                <TableHeaderCell>Teacher</TableHeaderCell>

                <TableHeaderCell>Level</TableHeaderCell>
                <TableHeaderCell>Division</TableHeaderCell>

                {currentDayOfWeek < 0 && (
                  <TableHeaderCell>DayOfWeek</TableHeaderCell>
                )}

                <TableHeaderCell>StartTime</TableHeaderCell>
                <TableHeaderCell>Attendees </TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
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
