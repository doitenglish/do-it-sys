import { UpdateCountableInput } from "@/definitions/common-types";
import { FieldValue } from "firebase-admin/firestore";

function updateCountable(updateCountableInput: UpdateCountableInput) {
  try {
    const { docRef, countable, transaction, amount } = updateCountableInput;
    transaction.update(docRef, {
      [countable]: FieldValue.increment(amount),
    });
  } catch (error) {
    throw new Error("Failed to update countable field. ");
  }
}

export default updateCountable;
