import { writeFile } from 'fs/promises'
import { fail } from '@sveltejs/kit'
import dayjs from 'dayjs';

import { desc, eq } from "drizzle-orm"
import { drizzle } from 'drizzle-orm/libsql';

import { db } from '$lib/server/db';
import * as schema from "$lib/server/db/schema"
import * as importSchema from "$lib/server/db/importSchema"
import { EventDate, updateEventColumns } from '@/calculations';

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

  type History = {
    eventID: number,
    historyDate: string
  }

  // add uploaded history to local history
  const uploadedHistoryWithEvent: History[] = []
  const newEventIDList = [] as { id: number }[]
  for (const uploadedHistory of uploadedHistories) {

    // get event name from uploaded database
    const eventName = await uploadedDB.select().from(eventsTable).where(eq(eventsTable.id, uploadedHistory.historyEventID))

    // get new event id from local database
    const newEventID = await db.select({ id: schema.events.id }).from(schema.events).where(eq(schema.events.eventName, eventName[0].eventName))
    newEventIDList.push(newEventID[0])

    // reconstruct history
    const history = {
      eventID: newEventID[0].id,
      historyDate: dayjs(uploadedHistory.historyDate).format("YYYY-MM-DD")
    }

    uploadedHistoryWithEvent.push(history)
  }

  console.log('Inserting into database')
  await db.insert(schema.history).values(uploadedHistoryWithEvent).onConflictDoNothing()

  // updating other columns for events
  console.log('Updating event columns')
  for (const event of newEventIDList) {
    // get all the related histories chronologically from database again
    updateEventColumns(event.id)
  }
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
