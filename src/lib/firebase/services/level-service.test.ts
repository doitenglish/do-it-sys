// src/lib/data/level-data.test.ts
import {
  createLevel,
  updateLevel,
  updateLevelCountable,
  deleteLevel,
  getLevels,
  getLevelById,
  getLevelsForSelect,
} from "./level-service"; // 실제 getLevels 함수의 경로로 변경
import { getPaginateAndCount } from "../firestore-utils"; // 실제 getPaginateAndCount 함수의 경로로 변경
import { adminDB } from "../firebase-admin"; // 실제 adminDB 경로로 변경
import {
  DocumentReference,
  FieldValue,
  Timestamp,
  Transaction,
} from "firebase-admin/firestore";

// Mock Firebase adminDB
jest.mock("../firebase-admin", () => ({
  adminDB: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock getPaginateAndCount
jest.mock("../firestore-utils", () => ({
  getPaginateAndCount: jest.fn(),
}));

jest.mock("firebase-admin/firestore", () => ({
  Timestamp: {
    now: jest.fn(),
  },
  FieldValue: {
    increment: jest.fn(),
  },
}));

describe("firebase: createLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when amount greater than 5.", async () => {
    const result = await createLevel({ name: "Level 1", amount: 6 });

    expect(result).toEqual({
      ok: false,
      error:
        "Maximum of 5 divisions allowed. Please adjust the amount to 5 or fewer.",
    });

    expect(
      adminDB.collection("levels").where("name", "==", "Level 1").get
    ).not.toHaveBeenCalled();
    expect(adminDB.collection("levels").doc().set).not.toHaveBeenCalled();
  });

  it("should returns error when name already exists.", async () => {
    const mockSnapshot = { empty: false };

    (
      adminDB.collection("levels").where("name", "==", "Level 1")
        .get as jest.Mock
    ).mockResolvedValue(mockSnapshot);

    const result = await createLevel({ name: "Level 1", amount: 3 });

    expect(result).toEqual({
      ok: false,
      error: "A level with this name already exists.",
    });

    expect(adminDB.collection("levels").doc().set).not.toHaveBeenCalled();
  });

  it("should create a new level successfully with amount greater than 0.", async () => {
    const mockSnapshot = { empty: true };

    (
      adminDB.collection("levels").where("name", "==", "Level 1")
        .get as jest.Mock
    ).mockResolvedValue(mockSnapshot);

    (adminDB.collection("levels").doc().set as jest.Mock).mockResolvedValue(
      undefined
    );

    (Timestamp.now as jest.Mock).mockReturnValue(new Date());

    const result = await createLevel({ name: "Level 1", amount: 3 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").where).toHaveBeenCalledWith(
      "name",
      "==",
      "Level 1"
    );
    expect(
      adminDB.collection("levels").where("name", "==", "Level 1").get
    ).toHaveBeenCalled();
    expect(adminDB.collection("levels").doc().set).toHaveBeenCalledWith({
      name: "Level 1",
      totalStudents: 0,
      totalClasses: 0,
      useDivision: true, // Assuming generateDivisionDetails function sets useDivision to true
      divisions: ["a", "b", "c"], // Assuming generateDivisionDetails function generates these divisions
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should create a new level successfully with 0 amount.", async () => {
    const mockSnapshot = { empty: true };

    (
      adminDB.collection("levels").where("name", "==", "Level 1")
        .get as jest.Mock
    ).mockResolvedValue(mockSnapshot);

    (adminDB.collection("levels").doc().set as jest.Mock).mockResolvedValue(
      undefined
    );

    (Timestamp.now as jest.Mock).mockReturnValue(new Date());

    const result = await createLevel({ name: "Level 1", amount: 0 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").where).toHaveBeenCalledWith(
      "name",
      "==",
      "Level 1"
    );
    expect(
      adminDB.collection("levels").where("name", "==", "Level 1").get
    ).toHaveBeenCalled();
    expect(adminDB.collection("levels").doc().set).toHaveBeenCalledWith({
      name: "Level 1",
      totalStudents: 0,
      totalClasses: 0,
      useDivision: false,
      divisions: [],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should returns error when get fails", async () => {
    (
      adminDB.collection("levels").where("name", "==", "Level 1")
        .get as jest.Mock
    ).mockRejectedValue(new Error());

    const result = await createLevel({ name: "Level 1", amount: 3 });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot create level.",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").where).toHaveBeenCalledWith(
      "name",
      "==",
      "Level 1"
    );
    expect(
      adminDB.collection("levels").where("name", "==", "Level 1").get
    ).toHaveBeenCalled();
    expect(adminDB.collection("levels").doc().set).not.toHaveBeenCalled();
  });

  it("should returns error when set fails", async () => {
    (
      adminDB.collection("levels").where("name", "==", "Level 1")
        .get as jest.Mock
    ).mockResolvedValue({ empty: true });
    (adminDB.collection("levels").doc().set as jest.Mock).mockRejectedValue(
      new Error()
    );
    (Timestamp.now as jest.Mock).mockReturnValue(new Date());

    const result = await createLevel({ name: "Level 1", amount: 3 });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot create level.",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").where).toHaveBeenCalledWith(
      "name",
      "==",
      "Level 1"
    );
    expect(
      adminDB.collection("levels").where("name", "==", "Level 1").get
    ).toHaveBeenCalled();
    expect(adminDB.collection("levels").doc().set).toHaveBeenCalledWith({
      name: "Level 1",
      totalStudents: 0,
      totalClasses: 0,
      useDivision: true, // Assuming generateDivisionDetails function sets useDivision to true
      divisions: ["a", "b", "c"], // Assuming generateDivisionDetails function generates these divisions
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

describe("firebase: updateLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when amount greater than 5.", async () => {
    const result = await updateLevel({ id: "1", amount: 6 });

    expect(result).toEqual({
      ok: false,
      error:
        "Maximum of 5 divisions allowed. Please adjust the amount to 5 or fewer.",
    });

    expect(adminDB.collection("levels").doc("1").get).not.toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).not.toHaveBeenCalled();
  });

  it("should returns error when level with given id not exists", async () => {
    const mockSnapshot = { exists: false };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockSnapshot
    );

    const result = await updateLevel({ id: "1", amount: 3 });

    expect(result).toEqual({
      ok: false,
      error: `firebase: Level with id: 1 not exists.`,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();
    expect(adminDB.collection("levels").doc("1").update).not.toHaveBeenCalled();
  });

  it("should update level successfully with same amount.", async () => {
    const mockSnapshot = {
      exists: true,
      data: () => ({
        useDivision: true,
        divisions: ["a", "b", "c"],
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockSnapshot
    );

    (
      adminDB.collection("levels").doc("1").update as jest.Mock
    ).mockResolvedValue(undefined);

    const result = await updateLevel({ id: "1", amount: 3 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).not.toHaveBeenCalled();
  });

  it("should update level successfully with lower amount.", async () => {
    const mockSnapshot = {
      exists: true,
      data: () => ({
        useDivision: true,
        divisions: ["a", "b", "c"],
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockSnapshot
    );

    const result = await updateLevel({ id: "1", amount: 2 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).toHaveBeenCalledWith({
      useDivision: true,
      divisions: ["a", "b"],
      updatedAt: expect.any(Date),
    });
  });

  it("should update level successfully with higher amount.", async () => {
    const mockSnapshot = {
      exists: true,
      data: () => ({
        useDivision: true,
        divisions: ["a", "b", "c"],
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockSnapshot
    );

    const result = await updateLevel({ id: "1", amount: 4 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).toHaveBeenCalledWith({
      useDivision: true,
      divisions: ["a", "b", "c", "d"],
      updatedAt: expect.any(Date),
    });
  });

  it("should update level successfully with toggle division from 0 to many.", async () => {
    const mockSnapshot = {
      exists: true,
      data: () => ({
        useDivision: false,
        divisions: [],
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockSnapshot
    );

    const result = await updateLevel({ id: "1", amount: 3 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).toHaveBeenCalledWith({
      useDivision: true,
      divisions: ["a", "b", "c"],
      updatedAt: expect.any(Date),
    });
  });

  it("should update level successfully with toggle division from many to 0.", async () => {
    const mockSnapshot = {
      exists: true,
      data: () => ({
        useDivision: true,
        divisions: ["a", "b", "c"],
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockSnapshot
    );

    const result = await updateLevel({ id: "1", amount: 0 });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).toHaveBeenCalledWith({
      useDivision: false,
      divisions: [],
      updatedAt: expect.any(Date),
    });
  });

  it("should returns error when get fails", async () => {
    (adminDB.collection("levels").doc("1").get as jest.Mock).mockRejectedValue(
      new Error()
    );

    const result = await updateLevel({ id: "1", amount: 3 });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot update level.",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).not.toHaveBeenCalled();
  });

  it("should returns error when update fails", async () => {
    (
      adminDB.collection("levels").doc("1").get as jest.Mock
    ).mockResolvedValueOnce({
      exists: true,
      data: () => ({
        useDivision: true,
        divisions: ["a", "b", "c"],
      }),
    });

    (
      adminDB.collection("levels").doc("1").update as jest.Mock
    ).mockRejectedValue(new Error());

    const result = await updateLevel({ id: "1", amount: 4 });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot update level.",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").update).toHaveBeenCalledWith({
      useDivision: true,
      divisions: ["a", "b", "c", "d"],
      updatedAt: expect.any(Date),
    });
  });
});

describe("firebase: updateLevelCountable", () => {
  const mockLevelRef: Partial<DocumentReference> = { id: "mockLevelId" };
  const mockTransaction: Partial<Transaction> = {
    update: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update level countable successfully", async () => {
    const updateLevelCountableInput = {
      levelRef: mockLevelRef as DocumentReference,
      countable: "totalStudents",
      transaction: mockTransaction as Transaction,
      amount: 1,
    };

    const result = await updateLevelCountable(updateLevelCountableInput);

    expect(result).toEqual({
      ok: true,
    });

    expect(mockTransaction.update).toHaveBeenCalledWith(mockLevelRef, {
      totalStudents: FieldValue.increment(1),
    });
  });

  it("should returns error when transaction update fails", async () => {
    (mockTransaction.update as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const updateLevelCountableInput = {
      levelRef: mockLevelRef as DocumentReference,
      countable: "totalStudents",
      transaction: mockTransaction as Transaction,
      amount: 1,
    };

    const result = await updateLevelCountable(updateLevelCountableInput);

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot update level countable.",
    });
  });
});

describe("firebase: deleteLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when level with given id not exists", async () => {
    const mockResult = {
      exists: false,
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockResult
    );

    const result = await deleteLevel({ id: "1" });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Level with id: 1 not exists.",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").delete).not.toHaveBeenCalled();
  });

  it("should returns error when level with given id have classes", async () => {
    const mockResult = {
      exists: true,
      data: () => ({
        totalClasses: 3,
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockResult
    );

    const result = await deleteLevel({ id: "1" });

    expect(result).toEqual({
      ok: false,
      error: "firebase: 3 classes exist on level with id 1",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").delete).not.toHaveBeenCalled();
  });

  it("should returns error when level with given id have students", async () => {
    const mockResult = {
      exists: true,
      data: () => ({
        totalStudents: 5,
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockResult
    );

    const result = await deleteLevel({ id: "1" });

    expect(result).toEqual({
      ok: false,
      error: "firebase: 5 students exist on level with id 1",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").delete).not.toHaveBeenCalled();
  });

  it("should delete level successfully when no classes or students", async () => {
    const mockResult = {
      exists: true,
      data: () => ({
        totalClasses: 0,
        totalStudents: 0,
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockResult
    );

    const result = await deleteLevel({ id: "1" });

    expect(result).toEqual({
      ok: true,
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").delete).toHaveBeenCalled();
  });

  it("should returns error when delete fails", async () => {
    (
      adminDB.collection("levels").doc("1").delete as jest.Mock
    ).mockRejectedValue(new Error());

    const result = await deleteLevel({ id: "1" });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot delete Level.",
    });

    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection("levels").doc("1").get).toHaveBeenCalled();

    expect(adminDB.collection("levels").doc("1").delete).toHaveBeenCalled();
  });
});

describe("firebase: getLevels", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns data correctly when getPaginateAndCount succeeds", async () => {
    const mockSnapshot = {
      docs: [
        {
          id: "1",
          data: () => ({
            name: "Level 1",
            createdAt: { toDate: () => new Date("2022-01-01") },
            updatedAt: { toDate: () => new Date("2022-01-02") },
          }),
        },
      ],
    };
    const mockResult = {
      ok: true,
      data: mockSnapshot,
      totalCounts: 1,
      totalPages: 1,
    };

    (getPaginateAndCount as jest.Mock).mockResolvedValue(mockResult);

    const result = await getLevels({ currentPage: 1 });

    expect(result).toEqual({
      ok: true,
      data: [
        {
          id: "1",
          name: "Level 1",
          createdAt: new Date("2022-01-01"),
          updatedAt: new Date("2022-01-02"),
        },
      ],
      totalCounts: 1,
      totalPages: 1,
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").orderBy).toHaveBeenCalledWith("name");
    expect(getPaginateAndCount).toHaveBeenCalledWith(
      adminDB.collection("levels").orderBy("name"),
      {
        currentPage: 1,
      }
    );
  });

  test("returns error when getPaginateAndCount fails", async () => {
    const mockResult = {
      ok: false,
    };

    (getPaginateAndCount as jest.Mock).mockResolvedValue(mockResult);

    const result = await getLevels({ currentPage: 1 });

    expect(result).toEqual({
      ok: false,
      error: "Cannot get paginated data.",
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").orderBy).toHaveBeenCalledWith("name");
    expect(getPaginateAndCount).toHaveBeenCalledWith(
      adminDB.collection("levels").orderBy("name"),
      {
        currentPage: 1,
      }
    );
  });

  test("returns error when getPaginateAndCount throws an error", async () => {
    (getPaginateAndCount as jest.Mock).mockRejectedValue(new Error());

    const result = await getLevels({ currentPage: 1 });

    expect(result).toEqual({
      ok: false,
      error: "Firebase: Cannot get levels",
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").orderBy).toHaveBeenCalledWith("name");
    expect(getPaginateAndCount).toHaveBeenCalledWith(
      adminDB.collection("levels").orderBy("name"),
      {
        currentPage: 1,
      }
    );
  });
});

describe("firebase: getLevelById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns error when document with id does not exists", async () => {
    const mockLevelSnapshot = { exists: false };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockLevelSnapshot
    );

    const result = await getLevelById({ id: "1" });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Level with id: 1 not exists.",
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
  });

  test("returns data correctly when document with id exists", async () => {
    const mockLevelSnapshot = {
      exists: true,
      id: "1",
      data: () => ({
        name: "Level 1",
        createdAt: { toDate: () => new Date("2022-01-01") },
        updatedAt: { toDate: () => new Date("2022-01-02") },
      }),
    };

    (adminDB.collection("levels").doc("1").get as jest.Mock).mockResolvedValue(
      mockLevelSnapshot
    );

    const result = await getLevelById({ id: "1" });

    expect(result).toEqual({
      ok: true,
      data: {
        id: "1",
        name: "Level 1",
        createdAt: new Date("2022-01-01"),
        updatedAt: new Date("2022-01-02"),
      },
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
  });

  test("returns error when document with id throws an error", async () => {
    (adminDB.collection("levels").doc("1").get as jest.Mock).mockRejectedValue(
      new Error()
    );

    const result = await getLevelById({ id: "1" });

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot get level with id: 1.",
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
  });
});

describe("firebase: getLevelsForSelect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns data correctly", async () => {
    const mockLevelsSnapshot = {
      docs: [
        {
          id: "1",
          data: () => ({
            name: "Level 1",
            createdAt: { toDate: () => new Date("2022-01-01") },
            updatedAt: { toDate: () => new Date("2022-01-02") },
          }),
        },
        {
          id: "2",
          data: () => ({
            name: "Level 2",
            createdAt: { toDate: () => new Date("2022-01-03") },
            updatedAt: { toDate: () => new Date("2022-01-04") },
          }),
        },
      ],
    };

    (
      adminDB.collection("levels").orderBy("name").get as jest.Mock
    ).mockResolvedValue(mockLevelsSnapshot);

    const result = await getLevelsForSelect();

    expect(result).toEqual({
      ok: true,
      data: [
        {
          id: "1",
          name: "Level 1",
          createdAt: new Date("2022-01-01"),
          updatedAt: new Date("2022-01-02"),
        },
        {
          id: "2",
          name: "Level 2",
          createdAt: new Date("2022-01-03"),
          updatedAt: new Date("2022-01-04"),
        },
      ],
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").orderBy).toHaveBeenCalledWith("name");
    expect(adminDB.collection("levels").orderBy("name").get).toHaveBeenCalled();
  });

  test("returns error when get fails", async () => {
    (
      adminDB.collection("levels").orderBy("name").get as jest.Mock
    ).mockRejectedValue(new Error());

    const result = await getLevelsForSelect();

    expect(result).toEqual({
      ok: false,
      error: "firebase: Cannot get levels for select.",
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").orderBy).toHaveBeenCalledWith("name");
    expect(adminDB.collection("levels").orderBy("name").get).toHaveBeenCalled();
  });
});
