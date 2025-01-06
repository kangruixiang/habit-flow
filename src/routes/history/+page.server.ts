import dayjs from 'dayjs';
import { fail } from '@sveltejs/kit';

import { desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db"

import * as schema from "$lib/server/db/schema"
import { updateEventColumns } from '@/calculations';


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
    const date = dayjs(new Date()).format("YYYY-MM-DD")

    try {
      await db.insert(schema.history).values({
        eventID,
        historyDate: date
      })
    } catch (e) {
      console.log("Error: ", e)
      return fail(400, { duplicate: true })
    }

    await updateEventColumns(eventID)

    return { success: true }
  },
  deleteHistory: async ({ request }) => {
    const data = await request.formData()
    const historyID = Number(data.get('history_id'))
    const eventID = Number(data.get('event_id'))
    console.log('deleting: ', historyID)

    await db.delete(schema.history).where(eq(schema.history.id, historyID))

    await updateEventColumns(eventID)
  },
  deleteEvent: async ({ request }) => {
    const data = await request.formData()
    const eventID = Number(data.get('event_id'))

    // delete all histories
    console.log('delete all histories for eventID: ', eventID)
    await db.delete(schema.history).where(eq(schema.history.eventID, eventID))

    // delete event
    console.log('deleting event: ', eventID)
    await db.delete(schema.events).where(eq(schema.events.id, eventID))
  }
}

