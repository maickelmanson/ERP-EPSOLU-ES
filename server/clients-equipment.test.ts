import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Clients Router", () => {
  describe("clients.list", () => {
    it("should return array of clients", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("clients.getById", () => {
    it("should return undefined for non-existent client", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe("clients.create", () => {
    it("should require authentication", async () => {
      const ctx = { user: null } as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.clients.create({
          name: "Test Client",
          clientType: "PF",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should create a new client with required fields", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.create({
        name: "Test Client PF",
        clientType: "PF",
        cpfCnpj: "123.456.789-00",
        phone: "(11) 99999-9999",
        email: "client@example.com",
      });

      expect(result).toBeDefined();
    });

    it("should create a PJ client", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clients.create({
        name: "Test Company",
        clientType: "PJ",
        cpfCnpj: "12.345.678/0001-90",
        phone: "(11) 3333-3333",
        email: "company@example.com",
        address: "Rua Test, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
      });

      expect(result).toBeDefined();
    });
  });
});

describe("Equipment Router", () => {
  describe("equipment.list", () => {
    it("should return array of equipment", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.equipment.list();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter equipment by clientId", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.equipment.list({ clientId: 1 });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("equipment.getById", () => {
    it("should return undefined for non-existent equipment", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.equipment.getById(999999);

      expect(result).toBeUndefined();
    });
  });

  describe("equipment.create", () => {
    it("should require authentication", async () => {
      const ctx = { user: null } as any;
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.equipment.create({
          clientId: 1,
          brand: "HP",
          model: "LaserJet Pro",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should create a new equipment", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.equipment.create({
        clientId: 1,
        brand: "HP",
        model: "LaserJet Pro M404n",
        serialNumber: "SN123456",
        equipmentType: "IMPRESSORA",
        color: "Branco",
        warranty: "12 meses",
        isWarrantyReturn: false,
      });

      expect(result).toBeDefined();
    });

    it("should create a warranty return equipment", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.equipment.create({
        clientId: 1,
        brand: "Canon",
        model: "imagePRESS C5235",
        serialNumber: "SN789012",
        equipmentType: "MULTIFUNCIONAL",
        color: "Preto",
        warranty: "24 meses",
        isWarrantyReturn: true,
      });

      expect(result).toBeDefined();
    });

    it("should create different equipment types", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const equipmentTypes = ["IMPRESSORA", "MULTIFUNCIONAL", "COPIADORA", "SCANNER"];

      for (const type of equipmentTypes) {
        const result = await caller.equipment.create({
          clientId: 1,
          brand: "Test Brand",
          model: `Test Model ${type}`,
          equipmentType: type,
        });

        expect(result).toBeDefined();
      }
    });
  });
});

describe("Integration Tests", () => {
  it("should list clients and their equipment", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const clients = await caller.clients.list();
    expect(Array.isArray(clients)).toBe(true);

    if (clients.length > 0) {
      const equipment = await caller.equipment.list({ clientId: clients[0].id });
      expect(Array.isArray(equipment)).toBe(true);
    }
  });

  it("should maintain data consistency", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const clientsBefore = await caller.clients.list();
    const initialCount = clientsBefore.length;

    // Create a new client
    await caller.clients.create({
      name: "Consistency Test Client",
      clientType: "PF",
    });

    const clientsAfter = await caller.clients.list();
    expect(clientsAfter.length).toBeGreaterThanOrEqual(initialCount);
  });
});
