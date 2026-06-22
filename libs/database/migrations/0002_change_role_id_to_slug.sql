ALTER TABLE `roles` MODIFY COLUMN `id` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` MODIFY COLUMN `name` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role_id` varchar(50);