import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - PF (Pessoa Física) or PJ (Pessoa Jurídica)
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  clientType: mysqlEnum("clientType", ["PF", "PJ"]).default("PF").notNull(),
  priority: mysqlEnum("priority", ["1", "2", "3"]).default("3").notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Equipment table - linked to a client
 */
export const equipment = mysqlTable("equipment", {
  id: int("id").autoincrement().primaryKey(),
  serialNumber: varchar("serialNumber", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  model: varchar("model", { length: 100 }),
  equipmentType: varchar("equipmentType", { length: 50 }),
  color: varchar("color", { length: 50 }),
  warranty: varchar("warranty", { length: 30 }).default("SEM_GARANTIA").notNull(),
  isWarrantyReturn: boolean("isWarrantyReturn").default(false).notNull(),
  budgetDueDate: timestamp("budgetDueDate"),
  notes: text("notes"),
  clientId: int("clientId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;

/**
 * Service Orders table - updated status flow with tracking
 */
export const serviceOrders = mysqlTable("serviceOrders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 20 }).notNull().unique(),
  trackingToken: varchar("trackingToken", { length: 32 }).notNull().unique(),
  clientId: int("clientId").notNull(),
  equipmentId: int("equipmentId").notNull(),
  status: mysqlEnum("status", [
    "AGUARDANDO",
    "EM_CHECKLIST",
    "ORCAMENTO_ENCAMINHADO",
    "APROVADO",
    "AGUARDANDO_PECA",
    "EM_ANDAMENTO",
    "EM_TESTES",
    "FINALIZACAO",
    "PRONTA",
    "ENTREGUE",
    "CANCELADO",
  ]).default("AGUARDANDO").notNull(),
  priorityScore: int("priorityScore").default(2).notNull(),
  isWarrantyReturn: boolean("isWarrantyReturn").default(false).notNull(),
  description: text("description"),
  diagnosis: text("diagnosis"),
  estimatedValue: varchar("estimatedValue", { length: 20 }),
  finalValue: varchar("finalValue", { length: 20 }),
  budgetDueDate: timestamp("budgetDueDate"),
  expectedReturn: timestamp("expectedReturn"),
  expectedDelivery: timestamp("expectedDelivery"),
  completedAt: timestamp("completedAt"),
  deliveredAt: timestamp("deliveredAt"),
  entryDate: timestamp("entryDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceOrder = typeof serviceOrders.$inferSelect;
export type InsertServiceOrder = typeof serviceOrders.$inferInsert;

/**
 * Status History table - audit trail for OS status changes
 */
export const statusHistory = mysqlTable("statusHistory", {
  id: int("id").autoincrement().primaryKey(),
  serviceOrderId: int("serviceOrderId").notNull(),
  fromStatus: varchar("fromStatus", { length: 50 }),
  toStatus: varchar("toStatus", { length: 50 }).notNull(),
  operator: varchar("operator", { length: 255 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StatusHistoryEntry = typeof statusHistory.$inferSelect;
export type InsertStatusHistory = typeof statusHistory.$inferInsert;

/**
 * Deletion Logs table - audit trail
 */
export const deletionLogs = mysqlTable("deletionLogs", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId").notNull(),
  entityDescription: text("entityDescription"),
  reason: text("reason").notNull(),
  operator: varchar("operator", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeletionLog = typeof deletionLogs.$inferSelect;
export type InsertDeletionLog = typeof deletionLogs.$inferInsert;

/**
 * Settings table - configurable options (equipment types, brands, statuses)
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;