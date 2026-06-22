import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const DRIZZLE_MODULE_PROVIDER = 'drizzle';

@Module({
  providers: [
    {
      provide: DRIZZLE_MODULE_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.getOrThrow<string>('DATABASE_URL');
        const pool = mysql.createPool({
          uri: connectionString,
        });
        return drizzle(pool, { schema, mode: 'default' });
      },
    },
  ],
  exports: [DRIZZLE_MODULE_PROVIDER],
})
export class DatabaseModule { }
