CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_name_age_unique` ON `user` (`name`,`age`);