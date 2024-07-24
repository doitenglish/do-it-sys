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

export interface StudentBase {
  signInID: string;
  nameKo: string;
  nameEn: string;
  phone: string;
  birth: string;
  level: string;
  levelName: string;
  division: string;
}

interface Countable {
  totalSchedules: number;
}

export interface BackendStudent extends StudentBase, BackendCommon, Countable {
  tags: string[];
}

export interface FrontendStudent
  extends StudentBase,
    FrontendCommon,
    Countable {}

export type CreateStudentInput = StudentBase;

export type CreateStudentOutput = MutateOutput;

export type UpdateStudentInput = ByID & Omit<StudentBase, "birth" | "signInID">;

export type UpdateStudentOutput = MutateOutput;

export type DeleteStudentInput = ByID;

export type DeleteStudentOutput = MutateOutput;

export type GetStudentsInput = GetTableInput & WithLevelFilter;

export type GetStudentsOutput = TableOutput<FrontendStudent[]>;

export type GetStudentByIdInput = ByID;

export type GetStudentByIdOutput = QueryOutput<FrontendStudent>;

export interface StudentForSelect
  extends ByID,
    Pick<StudentBase, "nameKo" | "nameEn" | "birth" | "division"> {}
export type GetStudentsForSelectInput = WithLevelFilter;

export type GetStudentsForSelectOutput = TableOutput<StudentForSelect[]>;

export type UpdateStudentsLevelInput = {
  ids: string[];
  levelFrom: string;
  levelTo: string;
  levelToName: string;
  division: string;
};

export type UpdateStudentsLevelOutput = MutateOutput;

export type ResetPasswordInput = ByID;

export type ResetPasswordOutput = MutateOutput;

export interface Attendee
  extends ByID,
    Pick<StudentBase, "nameKo" | "nameEn" | "phone"> {}

export type onAirAttendee = {
  id: string;
  absent: number;
  history: number[];
};

export type GetAttendeesInput = {
  ids: string[];
};

export type GetAttendeesOutput = QueryOutput<Attendee[]>;
