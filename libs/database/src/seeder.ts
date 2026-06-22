import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import { v7 as uuidv7 } from 'uuid';
import { roles, departments, users, employees, attendances } from './schema';
import { hashPassword } from '@app/common';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
  }

  console.log('Connecting to database for seeding...');
  const connection = await mysql.createConnection(connectionString);
  const db = drizzle(connection);

  console.log('Clearing existing data...');
  // Disable foreign key checks to truncate/delete all tables safely
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.delete(attendances);
  await db.delete(employees);
  await db.delete(users);
  await db.delete(departments);
  await db.delete(roles);
  await connection.query('SET FOREIGN_KEY_CHECKS = 1');

  console.log('Seeding Roles...');
  await db.insert(roles).values([
    { name: 'Admin' },
    { name: 'HR' },
    { name: 'Employee' }
  ]);

  const allRoles = await db.select().from(roles);
  const adminRole = allRoles.find(r => r.name === 'Admin')!;
  const hrRole = allRoles.find(r => r.name === 'HR')!;
  const employeeRole = allRoles.find(r => r.name === 'Employee')!;

  console.log('Seeding Departments...');
  await db.insert(departments).values([
    { name: 'Technology', description: 'Software engineering, DevOps, and IT support' },
    { name: 'Human Resources', description: 'People operations and recruitment' },
    { name: 'Finance', description: 'Accounting, payroll, and financial planning' }
  ]);

  const allDepartments = await db.select().from(departments);
  const techDept = allDepartments.find(d => d.name === 'Technology')!;
  const hrDept = allDepartments.find(d => d.name === 'Human Resources')!;

  console.log('Seeding Users & Employees...');
  const hashedPassword = await hashPassword('password123');

  const adminUserId = uuidv7();
  await db.insert(users).values({
    id: adminUserId,
    roleId: adminRole.id,
    email: 'admin@dexa.com',
    password: hashedPassword,
  });

  const hrUserId = uuidv7();
  const hrEmployeeId = uuidv7();
  await db.insert(users).values({
    id: hrUserId,
    roleId: hrRole.id,
    email: 'hr@dexa.com',
    password: hashedPassword,
  });
  await db.insert(employees).values({
    id: hrEmployeeId,
    departmentId: hrDept.id,
    userId: hrUserId,
    name: 'Tiffany',
    address: 'Cakung, Jakarta',
    dob: new Date('1990-05-15'),
    position: 'HR Specialist',
    joinDate: new Date('2024-01-15'),
    status: 'permanent',
  });

  const emp1UserId = uuidv7();
  const emp1EmployeeId = uuidv7();
  await db.insert(users).values({
    id: emp1UserId,
    roleId: employeeRole.id,
    email: 'kazhim@dexa.com',
    password: hashedPassword,
  });
  await db.insert(employees).values({
    id: emp1EmployeeId,
    departmentId: techDept.id,
    userId: emp1UserId,
    name: 'Kazhim',
    address: 'Kalibawang, Kulonprogo',
    dob: new Date('1995-08-20'),
    position: 'Tech Lead',
    joinDate: new Date('2023-06-01'),
    status: 'permanent',
  });

  const emp2UserId = uuidv7();
  const emp2EmployeeId = uuidv7();
  await db.insert(users).values({
    id: emp2UserId,
    roleId: employeeRole.id,
    email: 'saddan@dexa.com',
    password: hashedPassword,
  });
  await db.insert(employees).values({
    id: emp2EmployeeId,
    departmentId: techDept.id,
    userId: emp2UserId,
    name: 'Saddan Syah Akbar',
    address: 'Kutoarjo, Purworejo',
    dob: new Date('2002-11-12'),
    position: 'Software Engineer',
    joinDate: new Date('2024-03-01'),
    status: 'contract',
  });

  const emp3UserId = uuidv7();
  const emp3EmployeeId = uuidv7();
  await db.insert(users).values({
    id: emp3UserId,
    roleId: employeeRole.id,
    email: 'zulfan@dexa.com',
    password: hashedPassword,
  });
  await db.insert(employees).values({
    id: emp3EmployeeId,
    departmentId: techDept.id,
    userId: emp3UserId,
    name: 'Zulfan',
    address: 'Kembaran, Banyumas',
    dob: new Date('2005-05-05'),
    position: 'Software Engineer Intern',
    joinDate: new Date('2026-05-01'),
    status: 'intern',
  });

  console.log('Seeding Attendances...');
  const employeeIds = [hrEmployeeId, emp1EmployeeId, emp2EmployeeId, emp3EmployeeId];
  const dates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  const attendanceRecords: (typeof attendances.$inferInsert)[] = [];
  for (const employeeId of employeeIds) {
    for (const dateVal of dates) {
      const day = dateVal.getDay();
      if (day === 0 || day === 6) continue; // Skip weekends

      const dateStr = dateVal.toISOString().split('T')[0];
      const rand = Math.random();
      let status: 'present' | 'late' | 'absent' | 'incomplete' = 'present';
      let clockInTime: Date | null = null;
      let clockOutTime: Date | null = null;

      if (rand < 0.7) {
        status = 'present';
        clockInTime = new Date(`${dateStr}T08:30:00Z`);
        clockOutTime = new Date(`${dateStr}T17:30:00Z`);
      } else if (rand < 0.85) {
        status = 'late';
        clockInTime = new Date(`${dateStr}T09:15:00Z`);
        clockOutTime = new Date(`${dateStr}T17:30:00Z`);
      } else if (rand < 0.95) {
        status = 'incomplete';
        clockInTime = new Date(`${dateStr}T08:45:00Z`);
        clockOutTime = null;
      } else {
        status = 'absent';
      }

      attendanceRecords.push({
        employeeId,
        attendanceDate: dateVal,
        clockInTime,
        clockInPhoto: clockInTime ? `https://jollycontrarian.com/images/6/6c/Rickroll.jpg` : null,
        clockOutTime,
        clockOutPhoto: clockOutTime ? `https://jollycontrarian.com/images/6/6c/Rickroll.jpg` : null,
        status,
      });
    }
  }

  await db.insert(attendances).values(attendanceRecords);

  console.log('Seeding completed successfully!');
  await connection.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
