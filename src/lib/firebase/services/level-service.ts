import "server-only";

import { adminDB } from "../firebase-admin";
import {
  BackendLevel,
  FrontendLevel,
  GetLevelsOutput,
  CreateLevelInput,
  CreateLevelOutput,
  GetLevelByIdInput,
  GetLevelByIdOutput,
  UpdateLevelInput,
  UpdateLevelOuput,
  GetLevelsInput,
  DeleteLevelInput,
  DeleteLevelOuput,
  GetLevelsForSelectOutput,
  UpdateLevelCountableInput,
  UpdateLevelCountableOutput,
} from "@/definitions/level-types";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { generateLevelChildren, handleErrorMsg } from "@/lib/utils";
import { getPaginateAndCount } from "../firestore-utils";

function generateDivisionDetails(amount: number) {
  return {
    useDivision: amount > 1,
    divisions: generateLevelChildren(amount),
  };
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export async function createLevel(
  createLevelInput: CreateLevelInput
): Promise<CreateLevelOutput> {
  try {
    const { name, amount } = createLevelInput;

    if (amount > 5) {
      return {
        ok: false,
        error:
          "Maximum of 5 divisions allowed. Please adjust the amount to 5 or fewer.",
      };
    }

    const existLevelRef = adminDB
      .collection("levels")
      .where("name", "==", name);
    const existLevelsSnapshot = await existLevelRef.get();

    if (!existLevelsSnapshot.empty) {
      return {
        ok: false,
        error: "A level with this name already exists.",
      };
    }

    const { useDivision, divisions } = generateDivisionDetails(amount);

    const data: BackendLevel = {
      name,
      totalStudents: 0,
      totalClasses: 0,
      useDivision,
      divisions,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const levelRef = adminDB.collection("levels").doc();
    await levelRef.set(data);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot create level.",
    };
  }
}

export async function updateLevel(
  updateLevelInput: UpdateLevelInput
): Promise<UpdateLevelOuput> {
  try {
    const { id, amount } = updateLevelInput;

    if (amount > 5) {
      return {
        ok: false,
        error:
          "Maximum of 5 divisions allowed. Please adjust the amount to 5 or fewer.",
      };
    }

    const levelRef = adminDB.collection("levels").doc(id);
    const levelSnapshot = await levelRef.get();

    if (!levelSnapshot.exists) {
      return {
        ok: false,
        error: `firebase: Level with id: ${id} not exists.`,
      };
    }

    const level = levelSnapshot.data() as BackendLevel;
    const { useDivision, divisions } = generateDivisionDetails(amount);

    if (!arraysEqual(level.divisions!, divisions)) {
      await levelRef.update({
        useDivision,
        divisions,
        updatedAt: Timestamp.now(),
      });
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot update level.",
    };
  }
}

export async function updateLevelCountable(
  updateLevelCountableInput: UpdateLevelCountableInput
): Promise<UpdateLevelCountableOutput> {
  try {
    const { levelRef, countable, transaction, amount } =
      updateLevelCountableInput;
    transaction.update(levelRef, {
      [countable]: FieldValue.increment(amount),
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot update level countable.",
    };
  }
}

export async function deleteLevel(
  deleteLevelInput: DeleteLevelInput
): Promise<DeleteLevelOuput> {
  const { id } = deleteLevelInput;

  const levelRef = adminDB.collection("levels").doc(id);
  try {
    const levelSnapshot = await levelRef.get();

    if (!levelSnapshot.exists) {
      return {
        ok: false,
        error: `firebase: Level with id: ${id} not exists.`,
      };
    }

    const level = levelSnapshot.data() as BackendLevel;

    if (level.totalClasses > 0) {
      return {
        ok: false,
        error: `firebase: ${level.totalClasses} classes exist on level with id ${id}`,
      };
    }

    if (level.totalStudents > 0) {
      return {
        ok: false,
        error: `firebase: ${level.totalStudents} students exist on level with id ${id}`,
      };
    }

    await levelRef.delete();

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot delete Level.",
    };
  }
}

export async function getLevels(
  getLevelsInput: GetLevelsInput
): Promise<GetLevelsOutput> {
  const { currentPage } = getLevelsInput;
  try {
    let levelsRef = adminDB.collection("levels").orderBy("name");

    const result = await getPaginateAndCount(levelsRef, { currentPage });

    if (!result.ok) {
      throw new Error("Cannot get paginated data.");
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const levels = [] as FrontendLevel[];

    for (const doc of snapshot!.docs) {
      const data = doc.data() as BackendLevel;

      const level: FrontendLevel = {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      levels.push(level);
    }

    return {
      ok: true,
      data: levels,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "Firebase: Cannot get levels"),
    };
  }
}

export async function getLevelById(
  getLevelByIdInput: GetLevelByIdInput
): Promise<GetLevelByIdOutput> {
  const { id } = getLevelByIdInput;
  try {
    const levelRef = adminDB.collection("levels").doc(id);
    const levelSnapshot = await levelRef.get();

    if (!levelSnapshot.exists) {
      return {
        ok: false,
        error: `firebase: Level with id: ${id} not exists.`,
      };
    }

    const data = levelSnapshot.data() as BackendLevel;

    const level: FrontendLevel = {
      ...data,
      id: levelSnapshot.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };

    return {
      ok: true,
      data: level,
    };
  } catch (error) {
    return {
      ok: false,
      error: `firebase: Cannot get level with id: ${id}.`,
    };
  }
}

export async function getLevelsForSelect(): Promise<GetLevelsForSelectOutput> {
  try {
    const levelsRef = adminDB.collection("levels").orderBy("name");
    const levelsSnapshot = await levelsRef.get();

    const levels = [] as FrontendLevel[];

    for (const doc of levelsSnapshot.docs) {
      const data = doc.data() as BackendLevel;

      const level: FrontendLevel = {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      levels.push(level);
    }

    return {
      ok: true,
      data: levels,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot get levels for select.",
    };
  }
}
