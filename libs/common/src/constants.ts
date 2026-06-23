export const SERVICES = {
  AUTH: 'AUTH_SERVICE',
  FILE: 'FILE_SERVICE',
  ATTENDANCE: 'ATTENDANCE_SERVICE',
  EMPLOYEE: 'EMPLOYEE_SERVICE',
} as const;

export const DEFAULT = {
  PORTS: {
    GATEWAY: 9000,
    AUTH: 9001,
    FILE: 9002,
    ATTENDANCE: 9003,
    EMPLOYEE: 9004,
  },
  HOST: '127.0.0.1'
} as const;

export const COMMANDS = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    CREATE_ROLE: 'create-role',
    GET_ROLES: 'get-roles',
    GET_ROLE_BY_ID: 'get-role-by-id',
    UPDATE_ROLE: 'update-role',
    DELETE_ROLE: 'delete-role',
    REFRESH_TOKEN: 'refresh-token',
    LOGOUT: 'logout',
    LOGOUT_ALL: 'logout-all',
  },
  FILE: {
    UPLOAD: 'upload-file',
    DELETE: 'delete-file',
    GET_PRESIGNED_URL: 'get-presigned-url',
  },
  ATTENDANCE: {
    GET_ALL: 'get-attendances',
    GET_BY_ID: 'get-attendance-by-id',
    CREATE: 'create-attendance',
    UPDATE: 'update-attendance',
    DELETE: 'delete-attendance',
    CLOCK_IN: 'clock-in-attendance',
    CLOCK_OUT: 'clock-out-attendance',
  },
  EMPLOYEE: {
    GET_ALL: 'get-employees',
    GET_BY_ID: 'get-employee-by-id',
    GET_BY_EMAIL: 'get-employee-by-email',
    CREATE: 'create-employee',
    UPDATE: 'update-employee',
    DELETE: 'delete-employee'
  },
  DEPARTMENT: {
    GET_ALL: 'get-departments',
    GET_BY_ID: 'get-department-by-id',
    CREATE: 'create-department',
    UPDATE: 'update-department',
    DELETE: 'delete-department',
  },
} as const;

export const DEFAULT_PORTS = DEFAULT.PORTS;

export const STORAGE_FOLDERS = {
  ATTENDANCE: 'attendance',
} as const;
