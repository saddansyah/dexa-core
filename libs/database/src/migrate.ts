import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import * as mysql from 'mysql2/promise';
import * as path from 'path';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const connection = await mysql.createConnection(connectionString);
  const db = drizzle(connection);

  console.log('Running migrations...');
  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, '../migrations'),
  });

  await connection.end();
  console.log('✅ Migrations completed successfully!');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
