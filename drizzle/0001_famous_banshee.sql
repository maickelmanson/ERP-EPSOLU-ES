CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`clientType` enum('PF','PJ') NOT NULL DEFAULT 'PF',
	`priority` enum('1','2','3') NOT NULL DEFAULT '3',
	`cpfCnpj` varchar(18),
	`phone` varchar(20),
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deletionLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`entityDescription` text,
	`reason` text NOT NULL,
	`operator` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deletionLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serialNumber` varchar(100),
	`brand` varchar(100),
	`model` varchar(100),
	`equipmentType` varchar(50),
	`color` varchar(50),
	`warranty` varchar(30) NOT NULL DEFAULT 'SEM_GARANTIA',
	`isWarrantyReturn` boolean NOT NULL DEFAULT false,
	`budgetDueDate` timestamp,
	`notes` text,
	`clientId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `equipment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `serviceOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(20) NOT NULL,
	`trackingToken` varchar(32) NOT NULL,
	`clientId` int NOT NULL,
	`equipmentId` int NOT NULL,
	`status` enum('AGUARDANDO','EM_CHECKLIST','ORCAMENTO_ENCAMINHADO','APROVADO','AGUARDANDO_PECA','EM_ANDAMENTO','EM_TESTES','FINALIZACAO','PRONTA','ENTREGUE','CANCELADO') NOT NULL DEFAULT 'AGUARDANDO',
	`priorityScore` int NOT NULL DEFAULT 2,
	`isWarrantyReturn` boolean NOT NULL DEFAULT false,
	`description` text,
	`diagnosis` text,
	`estimatedValue` varchar(20),
	`finalValue` varchar(20),
	`budgetDueDate` timestamp,
	`expectedReturn` timestamp,
	`expectedDelivery` timestamp,
	`completedAt` timestamp,
	`deliveredAt` timestamp,
	`entryDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `serviceOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `serviceOrders_orderNumber_unique` UNIQUE(`orderNumber`),
	CONSTRAINT `serviceOrders_trackingToken_unique` UNIQUE(`trackingToken`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(50) NOT NULL,
	`value` varchar(255) NOT NULL,
	`label` varchar(255) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `statusHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceOrderId` int NOT NULL,
	`fromStatus` varchar(50),
	`toStatus` varchar(50) NOT NULL,
	`operator` varchar(255) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `statusHistory_id` PRIMARY KEY(`id`)
);
