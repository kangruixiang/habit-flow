import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core';

export const uploadedEventsTable = sqliteTable('events', {
  id: int('_id').primaryKey({ autoIncrement: true }),
  eventName: text('events_name').notNull().unique(),
})

export const uploadedHistoryTable = sqliteTable('history', {
  id: int('_id').primaryKey({ autoIncrement: true }),
  historyEventID: int('history_event_id').notNull().references(() => uploadedEventsTable.id),
  historyDate: text('history_date').notNull()
})
