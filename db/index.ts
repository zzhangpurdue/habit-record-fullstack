import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from './schema/auth';
import * as habitsSchema from './schema/habits';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authSchema, ...habitsSchema },
});

export * from './schema/auth';
export * from './schema/habits';