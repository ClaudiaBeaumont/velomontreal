import { db } from "./db";
import { shops, type InsertShop, type Shop } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getShops(service?: string): Promise<Shop[]>;
  getPendingShops(): Promise<Shop[]>;
  getShopById(id: number): Promise<Shop | undefined>;
  createShop(shop: InsertShop, status?: string): Promise<Shop>;
  updateShopStatus(id: number, status: string): Promise<Shop | undefined>;
  clearShops(): Promise<void>;
  countShops(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getShops(service?: string): Promise<Shop[]> {
    const conditions = [eq(shops.status, "approved")];

    if (service === 'repair') {
      conditions.push(eq(shops.repair, true));
    } else if (service === 'rental') {
      conditions.push(eq(shops.rental, true));
    } else if (service === 'sale') {
      conditions.push(eq(shops.sale, true));
    } else if (service === 'storage') {
      conditions.push(eq(shops.storage, true));
    }

    return await db.select().from(shops).where(and(...conditions));
  }

  async getPendingShops(): Promise<Shop[]> {
    return await db.select().from(shops).where(eq(shops.status, "pending"));
  }

  async getShopById(id: number): Promise<Shop | undefined> {
    const [shop] = await db.select().from(shops).where(eq(shops.id, id));
    return shop;
  }

  async createShop(insertShop: InsertShop, status: string = "approved"): Promise<Shop> {
    const [shop] = await db.insert(shops).values({ ...insertShop, status }).returning();
    return shop;
  }

  async updateShopStatus(id: number, status: string): Promise<Shop | undefined> {
    const [shop] = await db.update(shops).set({ status }).where(eq(shops.id, id)).returning();
    return shop;
  }

  async clearShops(): Promise<void> {
    await db.delete(shops);
  }

  async countShops(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(shops);
    return Number(result[0].count);
  }
}

export const storage = new DatabaseStorage();
