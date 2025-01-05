import { eq } from "drizzle-orm"

import { db } from "$lib/server/db"
import * as schema from "$lib/server/db/schema"

export async function load() {
  const events = await db.select().from(schema.events)
  const histories = await db.select().from(schema.history)

  return {
    events, histories
  }
}

export const actions = {

  newEvent: async ({ request }) => {
    const data = await request.formData()
    const eventName = data.get('event_name') as string

    await db.insert(schema.events).values({
      eventName: eventName,
    }).returning({
      id: schema.events.id
    })

    return { success: true }
  }
}
