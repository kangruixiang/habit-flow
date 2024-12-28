import { sqliteTable, text, int, unique } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('user', {
	id: int('id').primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	age: int('age')
}, (table) => ({
	unique: unique().on(table.name, table.age)
}));
