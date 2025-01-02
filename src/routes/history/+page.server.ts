import { eq } from "drizzle-orm";

import { db } from "$lib/server/db"
import * as schema from "$lib/server/db/schema"

export async function load({ url }) {
  const eventID = Number(url.searchParams.get('event_id'))

  const events = await db.select().from(schema.events).where(eq(schema.events.id, eventID)).limit(1)
  const histories = await db.select().from(schema.history).where(eq(schema.history.eventID, eventID))

  return {
    events,
    histories
  }
}

export const actions = {
  deleteHistory: async ({ request }) => {
    const data = await request.formData()
    const historyID = Number(data.get('history_id'))

    await db.delete(schema.history).where(eq(schema.history.id, historyID))
  }
}

