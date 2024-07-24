import {
  BackendCommon,
  FrontendCommon,
  ByID,
  GetTableInput,
  TableOutput,
  WithLevelFilter,
  MutateOutput,
  QueryOutput,
} from "./common-types";

export interface ClassBase {
  name: string;
  textbook: string;
  teacher: string;
  teacherName: string;
  level: string;
  levelName: string;
  division: string;
}
interface Countable {
  totalSchedules: number;
}

export interface BackendClass extends ClassBase, Countable, BackendCommon {
  tags: string[];
}

export interface FrontendClass extends ClassBase, Countable, FrontendCommon {}

export type GetClassesInput = GetTableInput & WithLevelFilter;

export type GetClassesOutput = TableOutput<FrontendClass[]>;

export type GetClassesByTeacherInput = GetTableInput & ByID & WithLevelFilter;

export type GetClassesByTeacherOutput = TableOutput<FrontendClass[]>;

export type GetClassByIdInput = ByID;

export type GetClassByIdOutput = QueryOutput<FrontendClass>;

export type CreateClassInput = ClassBase;

export type CreateClassOutput = MutateOutput;

export type UpdateClassInput = ByID &
  Pick<ClassBase, "teacher" | "teacherName">;

export type UpdateClassOutput = MutateOutput;

export type DeleteClassInput = ByID;

export type DeleteClassOutput = MutateOutput;
