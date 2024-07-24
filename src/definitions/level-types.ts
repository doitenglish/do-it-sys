import { Transaction, DocumentReference } from "firebase-admin/firestore";
import {
  BackendCommon,
  ByID,
  FrontendCommon,
  GetTableInput,
  MutateOutput,
  QueryOutput,
  TableOutput,
} from "./common-types";

export interface LevelBase {
  name: string;
  useDivision: boolean;
  divisions?: string[];
}

interface Countable {
  totalStudents: number;
  totalClasses: number;
}

export type BackendLevel = LevelBase & BackendCommon & Countable;

export type FrontendLevel = LevelBase & FrontendCommon & Countable;

export type CreateLevelInput = {
  name: string;
  amount: number;
};

export type CreateLevelOutput = MutateOutput;

export type UpdateLevelInput = {
  id: string;
  amount: number;
};

export type UpdateLevelOuput = MutateOutput;

export type UpdateLevelCountableInput = {
  levelRef: DocumentReference;
  countable: string;
  transaction: Transaction;
  amount: number;
};

export type UpdateLevelCountableOutput = MutateOutput;

export type DeleteLevelInput = ByID;

export type DeleteLevelOuput = MutateOutput;

export type GetLevelsInput = GetTableInput;

export type GetLevelsOutput = TableOutput<FrontendLevel[]>;

export type GetLevelByIdInput = ByID;

export type GetLevelByIdOutput = QueryOutput<FrontendLevel>;

export type GetLevelsForSelectOutput = QueryOutput<FrontendLevel[]>;
