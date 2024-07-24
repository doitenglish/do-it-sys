import { Timestamp } from "firebase-admin/firestore";
import {
  ByID,
  GetTableInput,
  MutateOutput,
  QueryOutput,
  TableOutput,
  WithLevelFilter,
} from "./common-types";

export interface AttendanceBase {
  date: string;
  dateForOrder: Timestamp;
  dayOfWeek: number;
  absents: string[];
}

export type GetAttendancesInput = GetTableInput;

export type GetAttendancesOutput = TableOutput<AttendanceBase[]>;

export type GetAttendanceByIdInput = ByID;

export type GetAttendanceByIdOutput = QueryOutput<AttendanceBase>;

export type DeleteAttendanceInput = ByID;

export type DeleteAttendanceOutput = MutateOutput;
