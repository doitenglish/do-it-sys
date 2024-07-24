import { formatTimeToNumber } from "./utils";

export const LEVEL_DIVISION_CHILDREN = [1, 2, 3, 4, 5];

// Base paths
export const DASHBOARD_BASE_PATH = "/dashboard";
export const ADMIN_BASE_PATH = DASHBOARD_BASE_PATH + "/admin";

// Specific paths under Admin and Dashboard
export const STUDENTS_BASE_PATH = ADMIN_BASE_PATH + "/students";
export const TEACHER_BASE_PATH = ADMIN_BASE_PATH + "/teachers";
export const LEVELS_BASE_PATH = ADMIN_BASE_PATH + "/levels";
export const ADMIN_CLASS_BASE_PATH = ADMIN_BASE_PATH + "/classes";
export const CLASS_BASE_PATH = DASHBOARD_BASE_PATH + "/classes";
export const ADMIN_SCHEDULES_BASE_PATH = ADMIN_BASE_PATH + "/schedules";
export const SCHEDULES_BASE_PATH = DASHBOARD_BASE_PATH + "/schedules";
export const ATTENDANCE_BASE_PATH = ADMIN_BASE_PATH + "/attendances";
export const PRODUCT_BASE_PATH = ADMIN_BASE_PATH + "/products";
export const ORDER_BASE_PATH = ADMIN_BASE_PATH + "/orders";
export const RANKING_BASE_PATH = ADMIN_BASE_PATH + "/ranking";

// New additions for public paths and roles
export const PUBLIC_PATHS = [
  DASHBOARD_BASE_PATH + "/login",
  DASHBOARD_BASE_PATH + "/unauthorized",
  "/", // The homepage might also be public
];
export const LOGIN_PATH = DASHBOARD_BASE_PATH + "/login";
export const UNAUTHORIZED_PATH = DASHBOARD_BASE_PATH + "/unauthorized";

// Roles
export const ROLES = {
  TEACHER: "teacher",
  ADMIN: "admin",
};

export const DAY_OF_WEEKS = [
  {
    frontendFormat: "Mon",
    backendFormat: 1,
  },
  {
    frontendFormat: "Tue",
    backendFormat: 2,
  },
  {
    frontendFormat: "Wed",
    backendFormat: 3,
  },
  {
    frontendFormat: "Thu",
    backendFormat: 4,
  },
  {
    frontendFormat: "Fri",
    backendFormat: 5,
  },
];
