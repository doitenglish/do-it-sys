import {
  createStudent,
  updateStudent,
  deleteStudent,
  resetPassword,
  updateStudentsLevel,
} from "./student-actions";
import {
  createStudent as FBcreateStudent,
  updateStudent as FBupdateStudent,
  deleteStudent as FBdeleteStudent,
  resetPassword as FBresetPassword,
  updateStudentsLevel as FBupdateStudentsLevel,
} from "../firebase/services/student-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LEVELS_BASE_PATH, STUDENTS_BASE_PATH } from "../constants";

jest.mock("../firebase/services/student-service", () => ({
  createStudent: jest.fn(),
  updateStudent: jest.fn(),
  deleteStudent: jest.fn(),
  resetPassword: jest.fn(),
  updateStudentsLevel: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("createStudent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error message with invalid formData(name)", async () => {
    const mockInvalidFormData = new FormData();
    mockInvalidFormData.append("nameKo", "");
    mockInvalidFormData.append("nameEn", "John Doe");
    mockInvalidFormData.append("signInID", "John Doe");
    mockInvalidFormData.append("level", "1");
    mockInvalidFormData.append("division", "none");
    mockInvalidFormData.append("birth", "1990-01-01");
    mockInvalidFormData.append("phone", "010-1234-5678");

    const result = await createStudent("Level1 ", {}, mockInvalidFormData);

    expect(result).toEqual({
      message: "Invalid Fields. Failed to create student.",
    });

    expect(FBcreateStudent).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message with invalid formData(phone)", async () => {
    const mockInvalidFormData = new FormData();
    mockInvalidFormData.append("nameKo", "홍길동");
    mockInvalidFormData.append("nameEn", "John Doe");
    mockInvalidFormData.append("signInID", "홍길동");
    mockInvalidFormData.append("level", "1");
    mockInvalidFormData.append("division", "none");
    mockInvalidFormData.append("birth", "1990-01-01");
    mockInvalidFormData.append("phone", "010-1234-56789");

    const result = await createStudent("Level 1 ", {}, mockInvalidFormData);

    expect(result).toEqual({
      message: "Invalid Fields. Failed to create student.",
    });

    expect(FBcreateStudent).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message when FBcreateStudents returns false", async () => {
    const mockFormData = new FormData();
    mockFormData.append("nameKo", "홍길동");
    mockFormData.append("nameEn", "John Doe");
    mockFormData.append("signInID", "홍길동");
    mockFormData.append("level", "1");
    mockFormData.append("division", "none");
    mockFormData.append("birth", "1990-01-01");
    mockFormData.append("phone", "010-1234-5678");

    const mockResult = { ok: false, error: "Some error" };

    (FBcreateStudent as jest.Mock).mockResolvedValue(mockResult);

    const result = await createStudent("Level 1", {}, mockFormData);

    expect(result).toEqual({
      message: "Some error",
    });

    expect(FBcreateStudent).toHaveBeenCalledWith({
      nameKo: "홍길동",
      nameEn: "John Doe",
      signInID: "홍길동",
      level: "1",
      levelName: "Level 1",
      division: "none",
      birth: "1990-01-01",
      phone: "010-1234-5678",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return error message when FBcreateStudents fails", async () => {
    const mockFormData = new FormData();
    mockFormData.append("nameKo", "홍길동");
    mockFormData.append("nameEn", "John Doe");
    mockFormData.append("signInID", "홍길동");
    mockFormData.append("level", "1");
    mockFormData.append("division", "none");
    mockFormData.append("birth", "1990-01-01");
    mockFormData.append("phone", "010-1234-5678");

    (FBcreateStudent as jest.Mock).mockRejectedValue(new Error());

    const result = await createStudent("Level 1", {}, mockFormData);

    expect(result).toEqual({
      message: "Server Error: Failed to create student.",
    });

    expect(FBcreateStudent).toHaveBeenCalledWith({
      nameKo: "홍길동",
      nameEn: "John Doe",
      signInID: "홍길동",
      level: "1",
      levelName: "Level 1",
      division: "none",
      birth: "1990-01-01",
      phone: "010-1234-5678",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should revalidate and redirect when createStudent succeeds", async () => {
    const mockFormData = new FormData();
    mockFormData.append("nameKo", "홍길동");
    mockFormData.append("nameEn", "John Doe");
    mockFormData.append("signInID", "홍길동");
    mockFormData.append("level", "1");
    mockFormData.append("division", "none");
    mockFormData.append("birth", "1990-01-01");
    mockFormData.append("phone", "010-1234-5678");

    const mockResult = { ok: true };

    (FBcreateStudent as jest.Mock).mockResolvedValue(mockResult);

    const result = await createStudent("Level 1", {}, mockFormData);

    expect(FBcreateStudent).toHaveBeenCalledWith({
      nameKo: "홍길동",
      nameEn: "John Doe",
      signInID: "홍길동",
      level: "1",
      levelName: "Level 1",
      division: "none",
      birth: "1990-01-01",
      phone: "010-1234-5678",
    });

    expect(revalidatePath).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
    expect(redirect).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
  });
});

describe("updateStudent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error message with invalid formData(name)", async () => {
    const mockInvalidFormData = new FormData();
    mockInvalidFormData.append("nameKo", "");
    mockInvalidFormData.append("nameEn", "John Doe");
    mockInvalidFormData.append("level", "1");
    mockInvalidFormData.append("division", "none");
    mockInvalidFormData.append("phone", "010-1234-5678");

    const result = await updateStudent("1", "Level 1", {}, mockInvalidFormData);

    expect(result).toEqual({
      message: "Invalid Fields. Failed to update student.",
    });

    expect(FBupdateStudent).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message when FBcreateStudent returns false", async () => {
    const mockFormData = new FormData();
    mockFormData.append("nameKo", "홍길동");
    mockFormData.append("nameEn", "John Doe");
    mockFormData.append("level", "1");
    mockFormData.append("division", "none");
    mockFormData.append("phone", "010-1234-5678");

    const mockResult = { ok: false, error: "Some error" };

    (FBupdateStudent as jest.Mock).mockResolvedValue(mockResult);

    const result = await updateStudent("1", "Level 1", {}, mockFormData);

    expect(result).toEqual({
      message: "Some error",
    });

    expect(FBupdateStudent).toHaveBeenCalledWith({
      id: "1",
      nameKo: "홍길동",
      nameEn: "John Doe",
      phone: "010-1234-5678",
      level: "1",
      levelName: "Level 1",
      division: "none",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return error message when FBcreateStudents fails", async () => {
    const mockFormData = new FormData();
    mockFormData.append("nameKo", "홍길동");
    mockFormData.append("nameEn", "John Doe");
    mockFormData.append("level", "1");
    mockFormData.append("division", "none");
    mockFormData.append("phone", "010-1234-5678");

    (FBupdateStudent as jest.Mock).mockRejectedValue(new Error());

    const result = await updateStudent("1", "Level 1", {}, mockFormData);

    expect(result).toEqual({
      message: "Server Error: Failed to update student.",
    });

    expect(FBupdateStudent).toHaveBeenCalledWith({
      id: "1",
      nameKo: "홍길동",
      nameEn: "John Doe",
      phone: "010-1234-5678",
      level: "1",
      levelName: "Level 1",
      division: "none",
    });

    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should revalidate and redirect when updateStudent succeeds", async () => {
    const mockFormData = new FormData();
    mockFormData.append("nameKo", "홍길동");
    mockFormData.append("nameEn", "John Doe");
    mockFormData.append("level", "1");
    mockFormData.append("division", "none");
    mockFormData.append("phone", "010-1234-5678");

    const mockResult = { ok: true };

    (FBupdateStudent as jest.Mock).mockResolvedValue(mockResult);

    await updateStudent("1", "Level 1", {}, mockFormData);

    expect(FBupdateStudent).toHaveBeenCalledWith({
      id: "1",
      nameKo: "홍길동",
      nameEn: "John Doe",
      phone: "010-1234-5678",
      level: "1",
      levelName: "Level 1",
      division: "none",
    });

    expect(revalidatePath).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
    expect(redirect).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
  });
});

describe("deleteStudent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error message when FBdeleteStudent returns false", async () => {
    const mockResult = { ok: false, error: "Some error" };

    (FBdeleteStudent as jest.Mock).mockResolvedValue(mockResult);

    const result = await deleteStudent("1");

    expect(result).toEqual({
      message: "Some error",
    });

    expect(FBdeleteStudent).toHaveBeenCalledWith({ id: "1" });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return error message when FBdeleteStudent fails", async () => {
    (FBdeleteStudent as jest.Mock).mockRejectedValue(new Error());

    const result = await deleteStudent("1");

    expect(result).toEqual({
      message: "Server Error: Failed to delete student.",
    });

    expect(FBdeleteStudent).toHaveBeenCalledWith({ id: "1" });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should revalidate and redirect when deleteStudent succeeds", async () => {
    const mockResult = { ok: true };

    (FBdeleteStudent as jest.Mock).mockResolvedValue(mockResult);

    await deleteStudent("1");

    expect(FBdeleteStudent).toHaveBeenCalledWith({ id: "1" });
    expect(revalidatePath).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
    expect(redirect).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
  });
});

describe("resetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error message when FBresetPassword returns false", async () => {
    const mockResult = { ok: false, error: "Some error" };

    (FBresetPassword as jest.Mock).mockResolvedValue(mockResult);

    const result = await resetPassword("1");

    expect(result).toEqual({
      message: "Some error",
    });

    expect(FBresetPassword).toHaveBeenCalledWith({ id: "1" });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return error message when FBresetPassword fails", async () => {
    (FBresetPassword as jest.Mock).mockRejectedValue(new Error());

    const result = await resetPassword("1");

    expect(result).toEqual({
      message: "Server Error: Failed to reset password.",
    });

    expect(FBresetPassword).toHaveBeenCalledWith({ id: "1" });

    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect when resetPassword succeeds", async () => {
    const mockResult = { ok: true };

    (FBresetPassword as jest.Mock).mockResolvedValue(mockResult);

    await resetPassword("1");

    expect(FBresetPassword).toHaveBeenCalledWith({ id: "1" });

    expect(redirect).toHaveBeenCalledWith(STUDENTS_BASE_PATH);
  });
});

describe("updateStudentsLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns ok with empty ids", async () => {
    const result = await updateStudentsLevel(
      [],
      "Level 1",
      "Level 2",
      {},
      new FormData()
    );

    expect(result).toEqual({
      ok: true,
    });

    expect(FBupdateStudentsLevel).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should returns error message with invalid formData", async () => {
    const result = await updateStudentsLevel(
      ["1", "2"],
      "1",
      "Level 2",
      {},
      new FormData()
    );

    expect(result).toEqual({
      ok: false,
      message: "Invalid Fields. Failed to update students level.",
    });

    expect(FBupdateStudentsLevel).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should return error message when FBupdateStudentsLevel returns false", async () => {
    const mockFormData = new FormData();
    mockFormData.append("levelTo", "2");
    mockFormData.append("division", "none");

    const mockResult = { ok: false, error: "Some error" };
    (FBupdateStudentsLevel as jest.Mock).mockResolvedValue(mockResult);

    const result = await updateStudentsLevel(
      ["1", "2"],
      "1",
      "Level 2",
      {},
      mockFormData
    );

    expect(result).toEqual({
      ok: false,
      message: "Some error",
    });

    expect(FBupdateStudentsLevel).toHaveBeenCalledWith({
      ids: ["1", "2"],
      levelFrom: "1",
      levelTo: "2",
      levelToName: "Level 2",
      division: "none",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should return error message when FBupdateStudentsLevel fails", async () => {
    const mockFormData = new FormData();
    mockFormData.append("levelTo", "2");
    mockFormData.append("division", "none");

    (FBupdateStudentsLevel as jest.Mock).mockRejectedValue(new Error());

    const result = await updateStudentsLevel(
      ["1", "2"],
      "1",
      "Level 2",
      {},
      mockFormData
    );

    expect(result).toEqual({
      ok: false,
      message: "Server Error: Failed to update students level.",
    });

    expect(FBupdateStudentsLevel).toHaveBeenCalledWith({
      ids: ["1", "2"],
      levelFrom: "1",
      levelTo: "2",
      levelToName: "Level 2",
      division: "none",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should revalidate and return true when updateStudentsLevel succeeds", async () => {
    const mockFormData = new FormData();
    mockFormData.append("levelTo", "2");
    mockFormData.append("division", "none");

    const mockResult = { ok: true };
    (FBupdateStudentsLevel as jest.Mock).mockResolvedValue(mockResult);

    const result = await updateStudentsLevel(
      ["1", "2"],
      "1",
      "Level 2",
      {},
      mockFormData
    );

    expect(result).toEqual({
      ok: true,
      message: "Successfully updated students level.",
    });

    expect(FBupdateStudentsLevel).toHaveBeenCalledWith({
      ids: ["1", "2"],
      levelFrom: "1",
      levelTo: "2",
      levelToName: "Level 2",
      division: "none",
    });
    expect(revalidatePath).toHaveBeenCalledWith(
      LEVELS_BASE_PATH + "/2/students"
    );
  });
});
