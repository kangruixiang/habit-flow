import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
// import { Database } from 'bun:sqlite';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: process.env.DATABASE_URL! });
// const client = createClient({ url: env.DATABASE_URL });

// const sqlite = new Database("db/local.db");
export const db = drizzle(client);

