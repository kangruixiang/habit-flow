import dayjs from 'dayjs';
import { desc, eq } from "drizzle-orm";

import { db } from "$lib/server/db"
import * as schema from "$lib/server/db/schema"

export async function load({ url }) {
  const eventID = Number(url.searchParams.get('event_id'))

  const events = await db.select().from(schema.events).where(eq(schema.events.id, eventID)).limit(1)
  const histories = await db.select().from(schema.history).where(eq(schema.history.eventID, eventID)).limit(10).orderBy(desc(schema.history.historyDate))

  return {
    events,
    histories
  }
}

export const actions = {
  newHistory: async ({ request }) => {
    const data = await request.formData()
    const eventID = Number(data.get('event_id'))
    const date = new Date().toISOString()

    await db.insert(schema.history).values({
      eventID,
      historyDate: date
    })

    await db.update(schema.events).set({
      eventLastDate: date
    }).where(eq(schema.events.id, eventID))

    return { success: true }
  },
  deleteHistory: async ({ request }) => {
    const data = await request.formData()
    const historyID = Number(data.get('history_id'))
    console.log('deleting: ', historyID)

    await db.delete(schema.history).where(eq(schema.history.id, historyID))

  }
}

