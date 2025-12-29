import { db } from "./db";
import { shops, type InsertShop, type Shop } from "@shared/schema";
import { ilike, or } from "drizzle-orm";

export interface IStorage {
  getShops(search?: string): Promise<Shop[]>;
  createShop(shop: InsertShop): Promise<Shop>;
}

export class DatabaseStorage implements IStorage {
  async getShops(search?: string): Promise<Shop[]> {
    if (!search) return await db.select().from(shops);
    
    // Simple search on postal code or name
    const searchPattern = `%${search}%`;
    return await db.select().from(shops).where(
      or(
        ilike(shops.postalCode, searchPattern),
        ilike(shops.name, searchPattern)
      )
    );
  }

  async createShop(insertShop: InsertShop): Promise<Shop> {
    const [shop] = await db.insert(shops).values(insertShop).returning();
    return shop;
  }
}

export const storage = new DatabaseStorage();
