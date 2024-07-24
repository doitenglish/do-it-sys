import { Timestamp } from "firebase-admin/firestore";
import {
  BackendCommon,
  ByID,
  FrontendCommon,
  GetTableInput,
  MutateOutput,
  QueryOutput,
  TableOutput,
  WithLevelFilter,
} from "./common-types";
import { FrontendClass } from "./class-types";
import { onAirAttendee } from "./student-types";

interface ScheduleBase {
  _class: string;
  _className: string;
  textbook: string;
  level: string;
  levelName: string;
  division: string;
  defaultTeacher: string;
  teacher: string;
  teacherName: string;
  dayOfWeek: number;
  startTime: number;
  endTime: number;
  period: number;
  attendees: string[];
}

export interface BackendSchedule extends ScheduleBase, BackendCommon {
  lastClassAt: Timestamp | null;
}

export interface FrontendSchedule extends ScheduleBase, FrontendCommon {
  lastClassAt: Date | null;
}

export type GetSchedulesByClassInput = ByID & GetTableInput;

export type GetSchedulesByClassOutput = TableOutput<FrontendSchedule[]>;

export type GetScheduleByIdInput = ByID;

export type GetScheduleByIdOutput = QueryOutput<FrontendSchedule>;

export type GetSchedulesByFiltersInput = GetTableInput &
  Pick<ScheduleBase, "dayOfWeek"> & {
    period: number;
  };

export type GetSchedulesByFiltersOutput = TableOutput<FrontendSchedule[]>;

export type CreateScheduleInput = Pick<
  ScheduleBase,
  "dayOfWeek" | "startTime" | "endTime" | "period"
> & {
  _class: FrontendClass;
};

export type CreateScheduleOutput = MutateOutput;

export type UpdateScheduleInput = ByID &
  Pick<
    ScheduleBase,
    "dayOfWeek" | "startTime" | "endTime" | "teacher" | "teacherName" | "period"
  >;

export type UpdateScheduleOutput = MutateOutput;

export type DeleteScheduleInput = ByID &
  Pick<ScheduleBase, "attendees"> & {
    _classId: string;
  };

export type DeleteScheduleOutput = MutateOutput;

export type HandleAttendeesInput = {
  id: string;
  student: string;
};

export type HandleAttendeesOutput = MutateOutput;

export type GetTodoInput = GetTableInput & ByID;

export type GetTodoOutput = TableOutput<FrontendSchedule[]>;

export type SaveOnAirInput = ByID & {
  attendees: onAirAttendee[];
  teacherName: string;
  className: string;
};

export type SaveOnAirOutput = MutateOutput;
