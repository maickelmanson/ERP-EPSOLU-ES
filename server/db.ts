import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clients,
  equipment,
  serviceOrders,
  statusHistory,
  InsertStatusHistory,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Feature queries

export async function getServiceOrders(filters?: {
  status?: string;
  clientId?: number;
  equipmentId?: number;
}): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(serviceOrders);
  
  if (filters?.status) {
    query = query.where(eq(serviceOrders.status, filters.status as any));
  }
  if (filters?.clientId) {
    query = query.where(eq(serviceOrders.clientId, filters.clientId));
  }
  if (filters?.equipmentId) {
    query = query.where(eq(serviceOrders.equipmentId, filters.equipmentId));
  }

  return await query;
}

export async function getClients(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clients);
}

export async function getEquipment(clientId?: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query: any = db.select().from(equipment);
  if (clientId) {
    query = query.where(eq(equipment.clientId, clientId));
  }
  return await query;
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function getEquipmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(equipment).where(eq(equipment.id, id)).limit(1);
  return result[0];
}

export async function getServiceOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(serviceOrders).where(eq(serviceOrders.id, id)).limit(1);
  return result[0];
}

export async function getStatusHistory(serviceOrderId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(statusHistory).where(eq(statusHistory.serviceOrderId, serviceOrderId));
}

export async function createStatusHistoryEntry(data: InsertStatusHistory) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(statusHistory).values(data);
  return result;
}

export async function updateServiceOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(serviceOrders).set({ status: status as any }).where(eq(serviceOrders.id, id));
}
