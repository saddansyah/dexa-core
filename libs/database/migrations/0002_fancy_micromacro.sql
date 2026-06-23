ALTER TABLE `users` MODIFY COLUMN `role_id` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `attendances` DROP COLUMN `status`;