import { db } from "./db";
import { shops, type InsertShop, type Shop } from "@shared/schema";
import { ilike, eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getShops(service?: string): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;
  clearShops(): Promise<void>;
  countShops(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getShops(service?: string): Promise<Shop[]> {
    const conditions = [];

    // Filter by service type
    if (service === 'repair') {
      conditions.push(eq(shops.repair, true));
    } else if (service === 'rental') {
      conditions.push(eq(shops.rental, true));
    } else if (service === 'sale') {
      conditions.push(eq(shops.sale, true));
    } else if (service === 'storage') {
      conditions.push(eq(shops.storage, true));
    }

    if (conditions.length > 0) {
      return await db.select().from(shops).where(and(...conditions));
    }

    return await db.select().from(shops);
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const [shop] = await db.insert(shops).values(insertShop).returning();
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
