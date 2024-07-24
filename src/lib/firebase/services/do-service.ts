"server only";

import {
  AdminMutateBalanceByIdInput,
  AdminMutateBalanceByIdOutput,
  BackendDoRecord,
  DoAccount,
  FrontendDoRecord,
  GetBalanceByIdInput,
  GetBalanceByIdOutput,
  GetRecordsByIdInput,
  GetRecordsByIdOutput,
  GetTotalCountsOutput,
  MutateBalanceByIdInput,
} from "@/definitions/do-types";
import { adminDB } from "../firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getPaginateAndCount } from "../firestore-utils";

export function mutateBalanceById(
  mutateBalanceByIdInput: MutateBalanceByIdInput
) {
  const { id, transaction, amount, createdBy, detail, type } =
    mutateBalanceByIdInput;

  const accountRef = adminDB.collection("do").doc(id);
  try {
    //update balance
    transaction.update(accountRef, {
      balance: FieldValue.increment(amount),
    });

    //set record
    transaction.set(accountRef.collection("record").doc(), {
      amount,
      createdBy,
      detail,
      type,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    throw new Error();
  }
}

export async function adminMutateBalanceById(
  adminMutateBalanceByIdInput: AdminMutateBalanceByIdInput
): Promise<AdminMutateBalanceByIdOutput> {
  const { id, amount, createdBy } = adminMutateBalanceByIdInput;
  try {
    await adminDB.runTransaction(async (transaction) => {
      mutateBalanceById({
        id,
        transaction,
        amount,
        type: "-",
        detail: "-",
        createdBy,
      });
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Failed to update balance",
    };
  }
}

export async function getBalanceById(
  getBalanceByIdInput: GetBalanceByIdInput
): Promise<GetBalanceByIdOutput> {
  const { id } = getBalanceByIdInput;
  const accountRef = adminDB.collection("do").doc(id);
  try {
    const accountSnapshot = await accountRef.get();

    if (!accountSnapshot.exists) {
      return {
        ok: false,
        error: `Cannot get balance with id: ${id}`,
      };
    }

    const { balance } = accountSnapshot.data() as DoAccount;

    return {
      ok: true,
      data: { balance },
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get balance.",
    };
  }
}

export async function getRecordsById(
  getRecordsByIdInput: GetRecordsByIdInput
): Promise<GetRecordsByIdOutput> {
  const { id, currentPage } = getRecordsByIdInput;

  const recordsRef = adminDB
    .collection("do")
    .doc(id)
    .collection("record")
    .orderBy("createdAt", "desc");
  try {
    const result = await getPaginateAndCount(recordsRef, { currentPage });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const records: FrontendDoRecord[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() as BackendDoRecord;

      const record = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      };
      records.push(record);
    }

    return {
      ok: true,
      data: records,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get records.",
    };
  }
}

export async function getTotalBalanceAndStudentsCount(): Promise<GetTotalCountsOutput> {
  try {
    let totalBalance = 0;
    let totalStudents = 0;
    const accountRef = adminDB.collection("do");
    const accountSnapshot = await accountRef.get();

    accountSnapshot.forEach((doc) => {
      const { balance } = doc.data() as DoAccount;
      if (balance > 0) {
        totalBalance += balance;
      }
      totalStudents++;
    });

    return {
      ok: true,
      data: { totalBalance, totalStudents },
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get total balance and students count.",
    };
  }
}
