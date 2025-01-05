import { sqliteTable, text, int, unique } from 'drizzle-orm/sqlite-core';
// import { relations } from 'drizzle-orm';

export const events = sqliteTable('events', {
	id: int('id').primaryKey({ autoIncrement: true }),
	eventName: text('event_name').notNull().unique(),
	eventLastDate: text('event_last_date'),
	eventPredictionDate: text('event_prediction_date')
});

// export const eventsRelations = relations(events, ({ many }) => ({
// 	history: many(history)
// }))

export const history = sqliteTable('history', {
	id: int('id').primaryKey({ autoIncrement: true }),
	eventID: int('event_id').references(() => events.id),
	historyDate: text('history_date'),
}, (t) => ({
	unique: unique('unique_history').on(t.eventID, t.historyDate)
}))

// export const historyRelations = relations(history, ({ one }) => ({
// 	event: one(events, {
// 		fields: [history.historyEventID],
// 		references: [events.id]
// 	})
// }))

