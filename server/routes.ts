import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.shops.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const shops = await storage.getShops(search);
    res.json(shops);
  });

  app.post(api.shops.create.path, async (req, res) => {
    try {
      const input = api.shops.create.input.parse(req.body);
      const shop = await storage.createShop(input);
      res.status(201).json(shop);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed initial data if empty
  const seedData = async () => {
    const existing = await storage.getShops();
    if (existing.length === 0) {
      console.log("Seeding database...");
      await storage.createShop({
        name: "Atelier Vélo Plateau",
        type: "Réparation",
        address: "123 av. du Mont-Royal E, Montréal",
        postalCode: "H2J 1X1",
        phone: "514-555-0101",
        email: "contact@atelierplateau.ca"
      });
      await storage.createShop({
        name: "Vélo Service Rosemont",
        type: "Réparation et Location",
        address: "456 rue Beaubien E, Montréal",
        postalCode: "H2G 1M1",
        phone: "514-555-0202",
        email: "info@veloservicerosemont.ca"
      });
      console.log("Database seeded successfully.");
    }
  };
  
  // Run seeding asynchronously
  seedData().catch(console.error);

  return httpServer;
}
