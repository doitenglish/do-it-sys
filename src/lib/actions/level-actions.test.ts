import { createLevel, updateLevel, deleteLevel } from "./level-actions";
import {
  createLevel as FBcreateLevel,
  updateLevel as FBupdateLevel,
  deleteLevel as FBdeleteLevel,
} from "../firebase/services/level-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LEVELS_BASE_PATH } from "../constants";

jest.mock("../firebase/services/level-service", () => ({
  createLevel: jest.fn(),
  updateLevel: jest.fn(),
  deleteLevel: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("createLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error message with invalid formData(name)", async () => {
    const mockInvalidFormData = new FormData();
    mockInvalidFormData.append("name", "");
    mockInvalidFormData.append("amount", "3");

    const result = await createLevel({}, mockInvalidFormData);

    expect(result).toEqual({
      message: "Invalid Fields. Failed to create level.",
    });

    expect(FBcreateLevel).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message with invalid formData(amount)", async () => {
    const mockInvalidFormData = new FormData();
    mockInvalidFormData.append("name", "Level 1");
    mockInvalidFormData.append("amount", "6");

    const result = await createLevel({}, mockInvalidFormData);

    expect(result).toEqual({
      message: "Invalid Fields. Failed to create level.",
    });

    expect(FBcreateLevel).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message when FBcreateLevel returns false", async () => {
    const mockFormData = new FormData();
    mockFormData.set("name", "Level 1");
    mockFormData.set("amount", "3");

    const mockResult = { ok: false, error: "Failed to create level" };
    (FBcreateLevel as jest.Mock).mockResolvedValue(mockResult);

    const result = await createLevel({}, mockFormData);

    expect(result).toEqual({
      message: "Failed to create level",
    });
    expect(FBcreateLevel).toHaveBeenCalledWith({ name: "Level 1", amount: 3 });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should revalidate and redirect when createLevel succeeds", async () => {
    const mockFormData = new FormData();
    mockFormData.append("name", "Level 1");
    mockFormData.append("amount", "3");

    const mockResult = { ok: true };

    (FBcreateLevel as jest.Mock).mockResolvedValue(mockResult);

    await createLevel({}, mockFormData);

    expect(FBcreateLevel).toHaveBeenCalledWith({ name: "Level 1", amount: 3 });

    expect(revalidatePath).toHaveBeenCalledWith(LEVELS_BASE_PATH);
    expect(redirect).toHaveBeenCalledWith(LEVELS_BASE_PATH);
  });

  it("should returns error message when FBcreateLevel fails", async () => {
    const mockFormData = new FormData();
    mockFormData.set("name", "Level 1");
    mockFormData.set("amount", "3");

    (FBcreateLevel as jest.Mock).mockRejectedValue(new Error());

    const result = await createLevel({}, mockFormData);

    expect(result).toEqual({
      message: "Server Error: Failed to create level.",
    });
    expect(FBcreateLevel).toHaveBeenCalledWith({ name: "Level 1", amount: 3 });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("updateLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should revalidate and redirect when updateLevel succeeds", async () => {
    const mockFormData = new FormData();
    mockFormData.set("amount", "3");

    const mockResult = { ok: true };

    (FBupdateLevel as jest.Mock).mockResolvedValue(mockResult);

    await updateLevel("1", {}, mockFormData);

    expect(FBupdateLevel).toHaveBeenCalledWith({
      id: "1",
      amount: 3,
    });

    expect(revalidatePath).toHaveBeenCalledWith(LEVELS_BASE_PATH);
    expect(redirect).toHaveBeenCalledWith(LEVELS_BASE_PATH);
  });

  it("should returns error message when updateLevel fails due to invalid fields(amount)", async () => {
    const mockInvalidFormData = new FormData();
    mockInvalidFormData.set("amount", "6");

    const result = await updateLevel("1", {}, mockInvalidFormData);

    expect(result).toEqual({
      message: "Invalid Fields. Failed to edit level.",
    });

    expect(FBupdateLevel).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message when FBupdateLevel returns false", async () => {
    const mockFormData = new FormData();
    mockFormData.set("amount", "3");

    const mockResult = { ok: false, error: "Failed to update level." };
    (FBupdateLevel as jest.Mock).mockResolvedValue(mockResult);

    const result = await updateLevel("1", {}, mockFormData);

    expect(result).toEqual({
      message: "Failed to update level.",
    });
    expect(FBupdateLevel).toHaveBeenCalledWith({ id: "1", amount: 3 });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message when updateLevel fails", async () => {
    const mockFormData = new FormData();
    mockFormData.set("amount", "3");

    (FBupdateLevel as jest.Mock).mockRejectedValue(new Error());

    const result = await updateLevel("1", {}, mockFormData);

    expect(result).toEqual({
      message: "Server Error: Failed to edit level.",
    });
    expect(FBupdateLevel).toHaveBeenCalledWith({ id: "1", amount: 3 });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("deleteLevel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should revalidate and redirect when deleteLevel succeeds", async () => {
    const mockResult = { ok: true };

    (FBdeleteLevel as jest.Mock).mockResolvedValue(mockResult);

    await deleteLevel("1");

    expect(FBdeleteLevel).toHaveBeenCalledWith({ id: "1" });

    expect(revalidatePath).toHaveBeenCalledWith(LEVELS_BASE_PATH);
    expect(redirect).toHaveBeenCalledWith(LEVELS_BASE_PATH);
  });

  it("should returns error message when FBdeleteLevel returns false", async () => {
    const mockResult = { ok: false, error: "Failed to delete level." };
    (FBdeleteLevel as jest.Mock).mockResolvedValue(mockResult);

    const result = await deleteLevel("1");

    expect(result).toEqual({
      message: "Failed to delete level.",
    });

    expect(FBdeleteLevel).toHaveBeenCalledWith({ id: "1" });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should returns error message when FBdeleteLevel fails", async () => {
    (FBdeleteLevel as jest.Mock).mockRejectedValue(new Error("Some error"));

    const result = await deleteLevel("1");

    expect(result).toEqual({
      message: "Some error",
    });

    expect(FBdeleteLevel).toHaveBeenCalledWith({ id: "1" });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
