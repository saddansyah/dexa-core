import { mysqlTable, int, bigint, varchar, timestamp, date, mysqlEnum, serial, primaryKey } from 'drizzle-orm/mysql-core';
import { v7 as uuidv7 } from 'uuid';

export const roles = mysqlTable('roles', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const departments = mysqlTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const employees = mysqlTable('employees', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
  departmentId: bigint('department_id', { mode: 'number', unsigned: true }).references(() => departments.id, { onDelete: 'set null' }),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }),
  address: varchar('address', { length: 255 }),
  dob: date('dob').notNull(),
  position: varchar('position', { length: 255 }),
  joinDate: date('join_date').notNull(),
  resignDate: date('resign_date'),
  status: mysqlEnum('status', ['permanent', 'contract', 'intern']),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv7()),
  roleId: varchar('role_id', { length: 50 }).references(() => roles.id, { onDelete: 'restrict' }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const attendances = mysqlTable('attendances', {
  employeeId: varchar('employee_id', { length: 36 }).references(() => employees.id, { onDelete: 'restrict' }),
  attendanceDate: date('attendance_date').notNull(),
  clockInTime: timestamp('clock_in_time'),
  clockInPhoto: varchar('clock_in_photo', { length: 255 }),
  clockOutTime: timestamp('clock_out_time'),
  clockOutPhoto: varchar('clock_out_photo', { length: 255 }),
  status: mysqlEnum('status', ['present', 'late', 'absent', 'incomplete']),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => [
  primaryKey({ name: 'employee_attendance', columns: [t.employeeId, t.attendanceDate] })
]);
