// 실제 Firebase Admin 모듈 경로로 변경
import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { adminDB, adminAuth } from "../firebase-admin";
import { createStudent } from "./student-service";
import updateCountable from "./common/updateCountable";

// 필요한 모듈 모킹
jest.mock("../firebase-admin", () => ({
  adminAuth: {
    createUser: jest.fn(),
    deleteUser: jest.fn(),
  },
  adminDB: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    runTransaction: jest.fn(),
  },
}));

jest.mock("firebase-admin/firestore", () => ({
  Timestamp: {
    now: jest.fn(),
  },
  FieldValue: {
    increment: jest.fn(),
  },
}));

jest.mock("./common/updateCountable", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("firebase: createStudent", () => {
  const createStudentInput = {
    signInID: "홍길동",
    nameKo: "홍길동",
    nameEn: "Hong",
    phone: "010-1234-5678",
    birth: "1990-01-01",
    level: "1",
    levelName: "Level 1",
    division: "a",
  };
  const mockUserRecord = {
    uid: "12345",
  };
  const DEFAULT_PASSWORD = "123456"; // 실제 비밀번호로 변경

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully creates student successfully", async () => {
    const mockTransaction = {
      set: jest.fn(),
    };

    (adminAuth.createUser as jest.Mock).mockResolvedValue(mockUserRecord);
    (adminDB.runTransaction as jest.Mock).mockImplementation(
      async (transactionFn: any) => {
        await transactionFn(mockTransaction);
        return Promise.resolve();
      }
    );
    (Timestamp.now as jest.Mock).mockReturnValue(new Date());

    const result = await createStudent(createStudentInput);

    expect(result).toEqual({ ok: true });
    expect(adminAuth.createUser).toHaveBeenCalledWith({
      email: "홍길동@do-it.student",
      emailVerified: false,
      password: DEFAULT_PASSWORD,
      disabled: false,
    });
    expect(adminDB.collection).toHaveBeenCalledWith("levels");
    expect(adminDB.collection("levels").doc).toHaveBeenCalledWith("1");
    expect(adminDB.collection).toHaveBeenCalledWith("students");
    expect(adminDB.collection("students").doc).toHaveBeenCalledWith("12345");
    expect(adminDB.collection).toHaveBeenCalledWith("do");
    expect(adminDB.collection("do").doc).toHaveBeenCalledWith("12345");
    expect(Timestamp.now).toHaveBeenCalledTimes(2);
    expect(updateCountable).toHaveBeenCalledWith({
      docRef: adminDB.collection("levels").doc("1"),
      countable: "totalStudents",
      transaction: expect.any(Object),
      amount: 1,
    });
    expect(mockTransaction.set).toHaveBeenCalledTimes(2);
  });

  it("should returns error when user with same sign in ID exists", async () => {
    (adminAuth.createUser as jest.Mock).mockRejectedValue({
      errorInfo: { code: "auth/email-already-exists" },
    });

    const result = await createStudent(createStudentInput);

    expect(result).toEqual({
      ok: false,
      error: "The ID is already in use by another account.",
    });
    expect(adminAuth.createUser).toHaveBeenCalledWith({
      email: "홍길동@do-it.student",
      emailVerified: false,
      password: DEFAULT_PASSWORD,
      disabled: false,
    });
    expect(adminDB.collection).not.toHaveBeenCalled();
    expect(adminDB.runTransaction).not.toHaveBeenCalled();
    expect(Timestamp.now).not.toHaveBeenCalled();
  });

  it("should deletes user if transaction fails after user creation", async () => {
    (adminAuth.createUser as jest.Mock).mockResolvedValue(mockUserRecord);
    (adminDB.runTransaction as jest.Mock).mockRejectedValue(
      new Error("Transaction failed")
    );

    const result = await createStudent(createStudentInput);

    expect(result).toEqual({
      ok: false,
      error: "Cannot create student.",
    });
    expect(adminAuth.createUser).toHaveBeenCalledWith({
      email: "홍길동@do-it.student",
      emailVerified: false,
      password: DEFAULT_PASSWORD,
      disabled: false,
    });
    expect(adminAuth.deleteUser).toHaveBeenCalledWith("12345");
  });
});
