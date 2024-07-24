import {
  BackendCommon,
  FrontendCommon,
  ByID,
  GetTableInput,
  TableOutput,
  MutateOutput,
  QueryOutput,
} from "./common-types";

export interface TeacherBase {
  signInID: string;
  name: string;
}

interface Countable {
  totalClasses: number;
}

type Role = {
  role: string;
};

export type BackendTeacher = TeacherBase & BackendCommon & Countable & Role;

export type FrontendTeacher = TeacherBase & FrontendCommon & Countable & Role;

export type CreateTeacherInput = TeacherBase;

export type CreateTeacherOutput = MutateOutput;

export type DeleteTeacherInput = ByID;

export type DeleteTeacherOutput = MutateOutput;

export type GetTeachersInput = GetTableInput;

export type GetTeachersOutput = TableOutput<FrontendTeacher[]>;

export type GetTeacherByIdInput = ByID;

export type GetTeahcerByIdOutput = QueryOutput<FrontendTeacher>;

export type ResetPasswordInput = ByID;

export type ResetPasswordOutput = MutateOutput;

export type GetTeachersForSelectOutput = QueryOutput<FrontendTeacher[]>;

export type ChangePasswordInput = ByID & {
  newPassword: string;
};

export type ChangePasswordOutput = MutateOutput;
