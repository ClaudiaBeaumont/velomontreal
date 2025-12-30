import { pgTable, text, serial, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  repair: boolean("repair").default(false),
  rental: boolean("rental").default(false),
  sale: boolean("sale").default(false),
  storage: boolean("storage").default(false),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  city: text("city"),
  phone: text("phone"),
  website: text("website"),
  notes: text("notes"),
  lat: numeric("lat", { precision: 10, scale: 8 }),
  lon: numeric("lon", { precision: 11, scale: 8 }),
  status: text("status").default("approved"),
});

export const insertShopSchema = createInsertSchema(shops).omit({ id: true, status: true });

export type Shop = typeof shops.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;
