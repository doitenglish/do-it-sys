import {
  DocumentReference,
  Timestamp,
  Transaction,
} from "firebase-admin/firestore";

export type CurrentUser = {
  uid: string;
  role: "admin" | "teacher";
  name: string;
};

export type MutateOutput = SuccessOutput | ErrorOutput;

export type QueryOutput<T> = QuerySuccessOutput<T> | ErrorOutput;

export type TableOutput<T> = TableSuccessOutput<T> | ErrorOutput;

interface TableSuccessOutput<T> extends QuerySuccessOutput<T> {
  totalCounts: number;
  totalPages: number;
}
interface QuerySuccessOutput<T> extends SuccessOutput {
  data: T;
}
interface SuccessOutput {
  ok: true;
}

type ErrorOutput = {
  ok: false;
  error: string;
};

export interface BackendCommon {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FrontendCommon extends ByID {
  createdAt: Date;
  updatedAt: Date;
}

export interface ByID {
  id: string;
}

export interface GetTableInput {
  currentPage: number;
  query?: string;
}

export interface WithLevelFilter {
  level: string;
  division: string;
}

export type FormState = {
  message?: string | null;
};

export type UpdateCountableInput = {
  docRef: DocumentReference;
  transaction: Transaction;
  countable: string;
  amount: number;
};

export type UpdateCountableOutput = MutateOutput;
