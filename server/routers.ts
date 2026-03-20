import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getServiceOrders,
  getClients,
  getEquipment,
  getClientById,
  getEquipmentById,
  getServiceOrderById,
  getStatusHistory,
  createStatusHistoryEntry,
  updateServiceOrderStatus,
  getDb,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Service Orders
  serviceOrders: router({
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getServiceOrders({ status: input?.status });
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getServiceOrderById(input);
      }),

    changeStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const order = await getServiceOrderById(input.id);
        if (!order) throw new Error("Order not found");

        const oldStatus = order.status;
        await updateServiceOrderStatus(input.id, input.status);
        
        // Create history entry
        await createStatusHistoryEntry({
          serviceOrderId: input.id,
          fromStatus: oldStatus,
          toStatus: input.status,
          operator: ctx.user?.name ?? "Sistema",
          notes: input.notes,
        });

        return { success: true };
      }),

    getHistory: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getStatusHistory(input);
      }),
  }),

  // Clients
  clients: router({
    list: publicProcedure.query(async () => {
      return await getClients();
    }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getClientById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        clientType: z.enum(["PF", "PJ"]),
        cpfCnpj: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(clients).values({
          ...input,
          name: input.name.toUpperCase(),
        });
        return result;
      }),
  }),

  // Equipment
  equipment: router({
    list: publicProcedure
      .input(z.object({
        clientId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getEquipment(input?.clientId);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await getEquipmentById(input);
      }),

    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        serialNumber: z.string().optional(),
        brand: z.string().optional(),
        model: z.string().optional(),
        equipmentType: z.string().optional(),
        color: z.string().optional(),
        warranty: z.string().optional(),
        isWarrantyReturn: z.boolean().optional(),
        budgetDueDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(equipment).values({
          ...input,
          brand: input.brand?.toUpperCase(),
          model: input.model?.toUpperCase(),
        });
        return result;
      }),
  }),

  // Dashboard stats
  dashboard: router({
    stats: publicProcedure.query(async () => {
      const allClients = await getClients();
      const allOrders = await getServiceOrders();
      const activeOrders = await getServiceOrders({ status: "EM_ANDAMENTO" });
      const completedOrders = await getServiceOrders({ status: "ENTREGUE" });

      return {
        totalClients: allClients.length,
        totalOrders: allOrders.length,
        activeOrders: activeOrders.length,
        completedOrders: completedOrders.length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

// Import clients and equipment tables for the create mutations
import { clients, equipment } from "../drizzle/schema";
