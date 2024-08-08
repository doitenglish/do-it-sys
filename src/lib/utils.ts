import { StudentForSelect } from "@/definitions/student-types";

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const formatDate = (date: Date): string => {
  return `${date.getFullYear().toString()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

const ALPHABETIC = ["a", "b", "c", "d", "e"];

export const generateLevelChildren = (amount: number): string[] => {
  if (amount <= 1) {
    return [];
  }
  return ALPHABETIC.slice(0, amount);
};

export function formatTime(hour: number, minute: number) {
  return (
    (hour < 10 ? "0" : "") + hour + ":" + (minute < 10 ? "0" : "") + minute
  );
}
export function getDefaultEndTime(time: string) {
  const startTime = new Date("1970-01-01T" + time);

  startTime.setMinutes(startTime.getMinutes() + 40);
  return formatTime(startTime.getHours(), startTime.getMinutes());
}

export function formatTimeToString(time: number) {
  return formatTime(Math.floor(time / 60), time % 60);
}

export function formatTimeToNumber(time?: string): number {
  if (!time) {
    return 0;
  }
  const [hour, minute] = time.split(":");
  return parseInt(hour) * 60 + parseInt(minute);
}

export function getCurrentPeriod(hour: number): number {
  if (hour >= 9 && hour < 15) return 1;
  if (hour >= 15 && hour < 17) return 2;
  if (hour >= 17 && hour < 19) return 3;
  if (hour >= 19 && hour < 21) return 4;
  return 1;
}

export function filterStudentsByPage(
  students: StudentForSelect[],
  currentPage: number
) {
  students.sort((a, b) => {
    if (a.division < b.division) {
      return -1;
    }
    if (a.division > b.division) {
      return 1;
    }
    return 0;
  });
  const offset = (currentPage - 1) * 5;
  return students.slice(offset, offset + 5);
}

export function getNameFromEmail(email: string): string {
  return email.split("@")[0];
}

export function handleErrorMsg(error: unknown, defaultMessage: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return defaultMessage;
}

//Order Util functions
export function formatOrderType(type: number) {
  switch (type) {
    case 1:
      return "ONLINE";
    case 2:
      return "OFFLINE";
    default:
      return "ONLINE";
  }
}

export function getNextOrderStatus(type: number, status: number) {
  if (status === 4 || status === 5) {
    return status;
  }

  let status_to = status + 1;

  if (type === 2 && status === 1) {
    status_to++;
  }

  return status_to;
}

export function formatStatus(status: number) {
  switch (status) {
    case 1:
      return "주문 대기";
    case 2:
      return "배송 대기";
    case 3:
      return "수령 대기";
    case 4:
      return "수령 완료";
    default:
      return "주문 취소";
  }
}

export function getToday() {
  const now = new Date();
  const utcTime = new Date(now.toUTCString());
  
  utcTime.setHours(utcTime.getHours() + 9);

  return utcTime;
}
