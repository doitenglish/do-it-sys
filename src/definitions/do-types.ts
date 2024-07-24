import { Timestamp, Transaction } from "firebase-admin/firestore";
import {
  ByID,
  GetTableInput,
  MutateOutput,
  QueryOutput,
  TableOutput,
} from "./common-types";

interface DoRecordBase {
  amount: number;
  detail: string;
  createdBy: string;
  type: string;
}

export type BackendDoRecord = DoRecordBase & {
  createdAt: Timestamp;
};

export type FrontendDoRecord = DoRecordBase & {
  id: string;
  createdAt: Date;
};
interface Balance {
  balance: number;
}

export type DoAccount = Balance & {
  nameKo: string;
  nameEn: string;
  records?: BackendDoRecord[] | FrontendDoRecord[];
};

export type MutateBalanceByIdInput = ByID &
  DoRecordBase & {
    transaction: Transaction;
  };

export type AdminMutateBalanceByIdInput = ByID &
  Pick<DoRecordBase, "amount" | "createdBy">;

export type AdminMutateBalanceByIdOutput = MutateOutput;

export type GetBalanceByIdInput = ByID;

export type GetBalanceByIdOutput = QueryOutput<Balance>;

export type GetRecordsByIdInput = ByID & GetTableInput;

export type GetRecordsByIdOutput = TableOutput<FrontendDoRecord[]>;

export type GetTotalCountsOutput = QueryOutput<{
  totalBalance: number;
  totalStudents: number;
}>;
