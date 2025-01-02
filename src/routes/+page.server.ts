import { eq } from "drizzle-orm"

import { db } from "$lib/server/db"
import * as schema from "$lib/server/db/schema"

export async function load() {
  const events = await db.select().from(schema.events)
  const history = await db.select().from(schema.history)

  return {
    events, history
  }
}

export const actions = {
  newHistory: async ({ request }) => {
    const data = await request.formData()
    const eventID = Number(data.get('event_id'))
    const date = new Date().toLocaleDateString()

    await db.insert(schema.history).values({
      eventID,
      historyDate: date
    })

    await db.update(schema.events).set({
      eventLastDate: date
    }).where(eq(schema.events.id, eventID))

    return { success: true }
  }
}
