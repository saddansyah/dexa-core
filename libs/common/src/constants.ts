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
  },
  EMPLOYEE: {
    GET_ALL: 'get-employees',
    GET_BY_ID: 'get-employee-by-id',
    GET_BY_EMAIL: 'get-employee-by-email',
    CREATE: 'create-employee',
    UPDATE: 'update-employee',
    DELETE: 'delete-employee'
  },
} as const;

export const DEFAULT_PORTS = DEFAULT.PORTS;
