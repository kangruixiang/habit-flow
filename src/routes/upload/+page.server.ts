import { writeFile } from 'fs/promises'
import { fail } from '@sveltejs/kit'
import dayjs from 'dayjs';

import { eq } from "drizzle-orm"
import { drizzle } from 'drizzle-orm/libsql';

import { db } from '$lib/server/db';
import * as schema from "$lib/server/db/schema"
import * as importSchema from "$lib/server/db/importSchema"

async function uploadtoLocalDB(DBLocation: string) {
  // connect to db
  console.log('Connecting to uploaded DB')
  const uploadedDB = drizzle(DBLocation, { schema: importSchema });

  const eventsTable = importSchema.uploadedEventsTable

  // fetch uploaded events
  console.log('Fetching uploaded events')
  const uploadedEvents = await uploadedDB.select({
    id: eventsTable.id,
    eventName: eventsTable.eventName
  }).from(eventsTable)

  // add uploaded events
  console.log('Adding uploaded events to local events')
  for (const uploadedEvent of uploadedEvents) {
    await db.insert(schema.events).values({ eventName: uploadedEvent.eventName }).onConflictDoNothing()
  }

  // fetch uploaded history
  console.log('Fetching uploaded history')
  const uploadedHistories = await uploadedDB.query.uploadedHistoryTable.findMany()

  // add uploaded history to local history
  type History = {
    eventID: number,
    historyDate: string
  }

  const uploadedHistoryWithEvent: History[] = []
  for (const uploadedHistory of uploadedHistories) {

    // get event name from uploaded dtabase
    const eventName = await uploadedDB.select().from(eventsTable).where(eq(eventsTable.id, uploadedHistory.historyEventID))

    // get new event id from local database
    const newEventID = await db.select({ id: schema.events.id }).from(schema.events).where(eq(schema.events.eventName, eventName[0].eventName))

    // reconstruct history
    const history = {
      eventID: newEventID[0].id,
      historyDate: dayjs(uploadedHistory.historyDate).toISOString()
    }

    uploadedHistoryWithEvent.push(history)
  }

  console.log('Inserting into database')
  await db.insert(schema.history).values(uploadedHistoryWithEvent).onConflictDoNothing()
}


export const actions = {
  uploadDB: async ({ request }) => {
    const data = await request.formData()
    const dbFile = data.get('db_file') as File
    const newName = 'uploadedDB.db'

    if (dbFile === null || dbFile.size == 0) {
      return fail(400, {
        error: true,
        message: "You must provide a file to upload"
      })
    }

    await writeFile(`db/${newName}`, Buffer.from(await dbFile.arrayBuffer()))

    await uploadtoLocalDB(`file:db/${newName}`)

    return {
      success: true
    }

  }
}
