import { db } from "./db";
import { shops, type InsertShop, type Shop } from "@shared/schema";
import { ilike, or, and } from "drizzle-orm";

export interface IStorage {
  getShops(service?: string, postalCode?: string): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;
}

export class DatabaseStorage implements IStorage {
  async getShops(service?: string, postalCode?: string): Promise<Shop[]> {
    let query = db.select().from(shops);

    const conditions = [];

    // Filter by service type
    if (service === 'repair') {
      conditions.push(shops.repair.eq(true));
    } else if (service === 'rental') {
      conditions.push(shops.rental.eq(true));
    }

    // Filter by postal code (contains)
    if (postalCode) {
      const searchPattern = `%${postalCode}%`;
      conditions.push(ilike(shops.postalCode, searchPattern));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const [shop] = await db.insert(shops).values(insertShop).returning();
    return shop;
  }
}

export const storage = new DatabaseStorage();
