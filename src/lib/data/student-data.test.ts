import {
  getStudents,
  getStudentById,
  getStudentsForSelect,
  getAttendees,
} from "./student-data";
import {
  getStudents as FBgetStudents,
  getStudentById as FBgetStudentById,
  getStudentsForSelect as FBgetStudentsForSelect,
  getAttendees as FBgetAttendees,
} from "../firebase/services/student-service";

jest.mock("../firebase/services/student-service", () => ({
  getStudents: jest.fn(),
  getStudentById: jest.fn(),
  getStudentsForSelect: jest.fn(),
  getAttendees: jest.fn(),
}));

describe("getStudents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when FBgetStudents returns false", async () => {
    const mockResult = { ok: false, error: "Some error" };
    (FBgetStudents as jest.Mock).mockResolvedValue(mockResult);

    await expect(getStudents("", "1", "a", 1)).rejects.toThrow("Some error");

    expect(FBgetStudents).toHaveBeenCalledWith({
      query: "",
      level: "1",
      division: "a",
      currentPage: 1,
    });
  });

  it("should returns data when FBgetStudents returns true", async () => {
    const mockResult = { ok: true, data: [], totalCounts: 0, totalPages: 0 };
    (FBgetStudents as jest.Mock).mockResolvedValue(mockResult);

    const result = await getStudents("", "1", "a", 1);
    expect(result).toEqual({ data: [], totalCounts: 0, totalPages: 0 });
    expect(FBgetStudents).toHaveBeenCalledWith({
      query: "",
      level: "1",
      division: "a",
      currentPage: 1,
    });
  });

  it("should throw error when FBgetStudents fails", async () => {
    (FBgetStudents as jest.Mock).mockRejectedValue(new Error());

    await expect(getStudents("", "1", "a", 1)).rejects.toThrow(
      "Failed to fetch students"
    );

    expect(FBgetStudents).toHaveBeenCalledWith({
      query: "",
      level: "1",
      division: "a",
      currentPage: 1,
    });
  });
});

describe("getStudentById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when FBgetStudentById returns false", async () => {
    const mockResult = { ok: false, error: "Some error" };
    (FBgetStudentById as jest.Mock).mockResolvedValue(mockResult);

    await expect(getStudentById("1")).rejects.toThrow("Some error");

    expect(FBgetStudentById).toHaveBeenCalledWith({ id: "1" });
  });

  it("should returns data when FBgetStudentById returns true", async () => {
    const mockResult = { ok: true, data: { id: "1", name: "John Doe" } };
    (FBgetStudentById as jest.Mock).mockResolvedValue(mockResult);

    const result = await getStudentById("1");
    expect(result).toEqual({ id: "1", name: "John Doe" });
    expect(FBgetStudentById).toHaveBeenCalledWith({ id: "1" });
  });

  it("should returns error when FBgetStudentById fails", async () => {
    (FBgetStudentById as jest.Mock).mockRejectedValue(new Error());

    await expect(getStudentById("1")).rejects.toThrow(
      "Failed to fetch student with id: 1"
    );

    expect(FBgetStudentById).toHaveBeenCalledWith({ id: "1" });
  });
});

describe("getStudentsForSelect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when FBgetStudentsForSelect returns false", async () => {
    const mockResult = { ok: false, error: "Some error" };
    (FBgetStudentsForSelect as jest.Mock).mockResolvedValue(mockResult);

    await expect(getStudentsForSelect("1", "a")).rejects.toThrow("Some error");
    expect(FBgetStudentsForSelect).toHaveBeenCalledWith({
      level: "1",
      division: "a",
    });
  });

  it("should returns data when FBgetStudentsForSelect returns true", async () => {
    const mockResult = {
      ok: true,
      data: [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Lee" },
      ],
      totalCounts: 2,
      totalPages: 1,
    };
    (FBgetStudentsForSelect as jest.Mock).mockResolvedValue(mockResult);

    const result = await getStudentsForSelect("1", "a");
    expect(result).toEqual({
      data: [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Lee" },
      ],
      totalCounts: 2,
      totalPages: 1,
    });
    expect(FBgetStudentsForSelect).toHaveBeenCalledWith({
      level: "1",
      division: "a",
    });
  });

  it("should throw error when FBgetStudentsForSelect fails", async () => {
    (FBgetStudentsForSelect as jest.Mock).mockRejectedValue(new Error());

    await expect(getStudentsForSelect("1", "a")).rejects.toThrow(
      "Failed to fetch students"
    );
    expect(FBgetStudentsForSelect).toHaveBeenCalledWith({
      level: "1",
      division: "a",
    });
  });
});

describe("getAttendees", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should returns error when FBgetAttendees returns false", async () => {
    const mockResult = { ok: false, error: "Some error" };

    (FBgetAttendees as jest.Mock).mockResolvedValue(mockResult);

    await expect(getAttendees(["1", "2"])).rejects.toThrow("Some error");

    expect(FBgetAttendees).toHaveBeenCalledWith({ ids: ["1", "2"] });
  });

  it("should returns data when FBgetAttendees returns true", async () => {
    const mockResult = {
      ok: true,
      data: [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Lee" },
      ],
    };

    (FBgetAttendees as jest.Mock).mockResolvedValue(mockResult);

    const result = await getAttendees(["1", "2"]);

    expect(result).toEqual([
      { id: "1", name: "John Doe" },
      { id: "2", name: "Lee" },
    ]);
    expect(FBgetAttendees).toHaveBeenCalledWith({ ids: ["1", "2"] });
  });

  it("should throw error when FBgetAttendees fails", async () => {
    (FBgetAttendees as jest.Mock).mockRejectedValue(new Error());

    await expect(getAttendees(["1", "2"])).rejects.toThrow(
      "Failed to fetch attendees"
    );

    expect(FBgetAttendees).toHaveBeenCalledWith({ ids: ["1", "2"] });
  });
});
