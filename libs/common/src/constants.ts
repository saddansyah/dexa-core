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
    TEST: 'test-auth',
  },
  FILE: {
    UPLOAD: 'upload-file',
    DELETE: 'delete-file',
    GET_PRESIGNED_URL: 'get-presigned-url',
  },
  ATTENDANCE: {
    TEST: 'test-attendance',
  },
  EMPLOYEE: {
    TEST: 'test-employee',
  },
} as const;

export const DEFAULT_PORTS = DEFAULT.PORTS;
