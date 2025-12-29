import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shops = pgTable("shops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
});

export const insertShopSchema = createInsertSchema(shops).omit({ id: true });

export type Shop = typeof shops.$inferSelect;
export type InsertShop = z.infer<typeof insertShopSchema>;
