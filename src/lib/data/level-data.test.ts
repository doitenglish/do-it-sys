import { getLevels, getLevelById, getLevelsForSelect } from "./level-data";
import {
  getLevels as FBgetLevels,
  getLevelById as FBgetLevelById,
  getLevelsForSelect as FBgetLevelsForSelect,
} from "../firebase/services/level-service";

// Mock FBgetLevels
jest.mock("../firebase/services/level-service", () => ({
  getLevels: jest.fn(),
  getLevelById: jest.fn(),
  getLevelsForSelect: jest.fn(),
}));

describe("getLevels", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns data correctly when FBgetLevels succeeds", async () => {
    const mockData = {
      data: [{ id: 1, name: "Level 1" }],
      totalCounts: 1,
      totalPages: 1,
      ok: true,
    };

    (FBgetLevels as jest.Mock).mockResolvedValue(mockData);

    const result = await getLevels(1);
    expect(result).toEqual({
      data: mockData.data,
      totalCounts: mockData.totalCounts,
      totalPages: mockData.totalPages,
    });
    expect(FBgetLevels).toHaveBeenCalledWith({ currentPage: 1 });
  });

  test("throws an error when FBgetLevels response is not ok", async () => {
    const mockError = {
      ok: false,
      error: "Some error",
    };

    (FBgetLevels as jest.Mock).mockResolvedValue(mockError);

    await expect(getLevels(1)).rejects.toThrow("Some error");
    expect(FBgetLevels).toHaveBeenCalledWith({ currentPage: 1 });
  });

  test("throws an error when FBgetLevels fails", async () => {
    (FBgetLevels as jest.Mock).mockRejectedValue(new Error());

    await expect(getLevels(1)).rejects.toThrow("Failed to fetch levels");
    expect(FBgetLevels).toHaveBeenCalledWith({ currentPage: 1 });
  });
});

describe("getLevelById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns data correctly when FBgetLevelById succeeds", async () => {
    const mockResult = { ok: true, data: { id: "1", name: "Level 1" } };

    (FBgetLevelById as jest.Mock).mockResolvedValue(mockResult);

    const result = await getLevelById({ id: "1" });
    expect(result).toEqual(mockResult.data);
    expect(FBgetLevelById).toHaveBeenCalledWith({ id: "1" });
  });

  test("throws an error when FBgetLevelById response is not ok", async () => {
    const mockError = {
      ok: false,
      error: "Some error",
    };

    (FBgetLevelById as jest.Mock).mockResolvedValue(mockError);

    await expect(getLevelById({ id: "1" })).rejects.toThrow("Some error");

    expect(FBgetLevelById).toHaveBeenCalledWith({ id: "1" });
  });

  test("throws an error when FBgetLevelById fails", async () => {
    (FBgetLevelById as jest.Mock).mockRejectedValue(new Error());
    await expect(getLevelById({ id: "1" })).rejects.toThrow();

    expect(FBgetLevelById).toHaveBeenCalledWith({ id: "1" });
  });
});

describe("getLevelsForSelect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns data correctly when FBgetLevelsForSelect succeeds", async () => {
    const mockResult = {
      ok: true,
      data: [
        { id: "1", name: "Level 1" },
        { id: "2", name: "Level 2" },
      ],
    };

    (FBgetLevelsForSelect as jest.Mock).mockResolvedValue(mockResult);

    const result = await getLevelsForSelect();
    expect(result).toEqual([
      { id: "1", name: "Level 1" },
      { id: "2", name: "Level 2" },
    ]);
    expect(FBgetLevelsForSelect).toHaveBeenCalled();
  });

  test("throws an error when FBgetLevelsForSelect response is not ok", async () => {
    const mockError = {
      ok: false,
      error: "Some error",
    };

    (FBgetLevelsForSelect as jest.Mock).mockResolvedValue(mockError);

    await expect(getLevelsForSelect()).rejects.toThrow("Some error");
    expect(FBgetLevelsForSelect).toHaveBeenCalled();
  });

  test("throws an error when FBgetLevelsForSelect fails", async () => {
    (FBgetLevelsForSelect as jest.Mock).mockRejectedValue(new Error());

    await expect(getLevelsForSelect()).rejects.toThrow(
      "Failed to fetch levels"
    );
    expect(FBgetLevelsForSelect).toHaveBeenCalled();
  });
});
