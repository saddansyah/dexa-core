import { mysqlTable, serial, varchar, timestamp } from 'drizzle-orm/mysql-core';

export const employee = mysqlTable('employee', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
