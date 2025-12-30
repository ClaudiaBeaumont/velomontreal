import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { loadShopsFromCSV } from "./csv-loader";
import {
  geocodePostalCode,
  filterAndRankShops,
  isValidCanadianPostalCode,
  normalizePostalCode,
} from "./geo";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get shops with optional service filter
  app.get(api.shops.list.path, async (req, res) => {
    const service = req.query.service as string | undefined;
    const shops = await storage.getShops(service);
    res.json(shops);
  });

  // Search shops by postal code with distance filtering
  app.get("/api/shops/search", async (req, res) => {
    const service = req.query.service as string | undefined;
    const postalCode = req.query.postalCode as string | undefined;
    const maxDistance = parseFloat(req.query.maxDistance as string) || 15;

    // Get all shops matching service filter
    const shops = await storage.getShops(service);

    // If no postal code, return all shops without distance
    if (!postalCode) {
      return res.json(shops.map((shop) => ({ ...shop, distance: null })));
    }

    // Validate postal code
    if (!isValidCanadianPostalCode(postalCode)) {
      return res.status(400).json({
        message: "Code postal invalide. Format attendu: A1A1A1",
      });
    }

    // Geocode postal code
    const userCoords = await geocodePostalCode(postalCode);
    if (!userCoords) {
      // If geocoding fails, return all shops without distance filtering
      console.log(`Geocoding failed for ${postalCode}, returning all shops without distance`);
      return res.json(shops.map((shop) => ({ ...shop, distance: null })));
    }

    // Filter and rank by distance
    const results = filterAndRankShops(
      shops,
      userCoords.lat,
      userCoords.lon,
      maxDistance
    );

    res.json(results);
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
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Seed data from CSV - reload if we have fewer than expected shops
  const seedData = async () => {
    const count = await storage.countShops();
    const csvShops = loadShopsFromCSV();
    
    // If database has fewer shops than CSV, clear and reseed
    if (count < csvShops.length) {
      console.log(`Database has ${count} shops but CSV has ${csvShops.length}. Reseeding...`);
      await storage.clearShops();
      for (const shop of csvShops) {
        await storage.createShop(shop);
      }
      console.log(`Database reseeded with ${csvShops.length} shops.`);
    } else {
      console.log(`Database already has ${count} shops, skipping seed.`);
    }
  };

  // Run seeding asynchronously
  seedData().catch(console.error);

  return httpServer;
}
