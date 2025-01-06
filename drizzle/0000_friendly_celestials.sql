CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_name` text NOT NULL,
	`event_last_date` text,
	`event_late_relative` text,
	`event_prediction_date` text,
	`event_prediction_relative` text,
	`event_average_occurence` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_event_name_unique` ON `events` (`event_name`);--> statement-breakpoint
CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer,
	`history_date` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_history` ON `history` (`event_id`,`history_date`);