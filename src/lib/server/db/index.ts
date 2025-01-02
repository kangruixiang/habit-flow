import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { seed } from 'drizzle-seed';
import { migrate } from 'drizzle-orm/node-postgres/migrator'

import * as schema from '$lib/server/db/schema';


if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = createClient({ url: process.env.DATABASE_URL! });

export const db = drizzle(client);

async function main() {
  await migrate(db, {
    migrationsFolder: "drizzle"
  })

  // try {
  //   await seed(db, schema).refine((f) => ({
  //     events: {
  //       count: 10,
  //       with: {
  //         history: 10
  //       }
  //     }
  //   }))
  // } catch (e) {
  //   console.log(e)
  // }

}

main()