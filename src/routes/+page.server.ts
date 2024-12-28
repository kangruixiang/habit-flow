import { db } from "$lib/server/db"
import { usersTable } from "$lib/server/db/schema"


export async function load() {

  const user: typeof usersTable.$inferInsert = {
    name: 'Kang',
    age: 15
  }
  try {
    await db.insert(usersTable).values(user)
    console.log('New user created!')
  } catch (e) {
    console.log('Error creating new users: ', e)
  }

  const users = await db.select().from(usersTable)
  console.log(users)
  return {
    users
  }
}
