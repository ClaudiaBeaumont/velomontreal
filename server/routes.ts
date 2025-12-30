import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { loadShopsFromCSV } from "./csv-loader";
import { sendNewShopNotification } from "./email";
import {
  geocodePostalCode,
  filterAndRankShops,
  isValidCanadianPostalCode,
} from "./geo";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get shops with optional service filter (only approved)
  app.get(api.shops.list.path, async (req, res) => {
    const service = req.query.service as string | undefined;
    const shops = await storage.getShops(service);
    res.json(shops);
  });

  // Search shops by postal code with distance filtering (only approved)
  app.get("/api/shops/search", async (req, res) => {
    const service = req.query.service as string | undefined;
    const postalCode = req.query.postalCode as string | undefined;
    const maxDistance = parseFloat(req.query.maxDistance as string) || 15;

    const shops = await storage.getShops(service);

    if (!postalCode) {
      return res.json(shops.map((shop) => ({ ...shop, distance: null })));
    }

    if (!isValidCanadianPostalCode(postalCode)) {
      return res.status(400).json({
        message: "Code postal invalide. Format attendu: A1A1A1",
      });
    }

    const userCoords = await geocodePostalCode(postalCode);
    if (!userCoords) {
      console.log(`Geocoding failed for ${postalCode}, returning all shops without distance`);
      return res.json(shops.map((shop) => ({ ...shop, distance: null })));
    }

    const results = filterAndRankShops(
      shops,
      userCoords.lat,
      userCoords.lon,
      maxDistance
    );

    res.json(results);
  });

  // Create new shop submission (pending approval)
  app.post(api.shops.create.path, async (req, res) => {
    try {
      const input = api.shops.create.input.parse(req.body);
      const shop = await storage.createShop(input, "pending");
      
      // Send email notification (don't block response if it fails)
      sendNewShopNotification(input, shop.id).catch(console.error);
      
      res.status(201).json({ 
        ...shop, 
        message: "Votre demande a été soumise et sera examinée sous peu." 
      });
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

  // Admin: Get pending shops
  app.get("/api/admin/pending", async (req, res) => {
    const adminToken = req.headers["x-admin-token"];
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: "Non autorisé" });
    }
    
    const pendingShops = await storage.getPendingShops();
    res.json(pendingShops);
  });

  // Admin: Approve or reject a shop
  app.patch("/api/admin/shops/:id/status", async (req, res) => {
    const adminToken = req.headers["x-admin-token"];
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const shop = await storage.updateShopStatus(id, status);
    if (!shop) {
      return res.status(404).json({ message: "Commerce non trouvé" });
    }

    res.json(shop);
  });

  // Seed data from CSV - reload if we have fewer than expected shops
  const seedData = async () => {
    const count = await storage.countShops();
    const csvShops = loadShopsFromCSV();
    
    if (count < csvShops.length) {
      console.log(`Database has ${count} shops but CSV has ${csvShops.length}. Reseeding...`);
      await storage.clearShops();
      for (const shop of csvShops) {
        await storage.createShop(shop, "approved");
      }
      console.log(`Database reseeded with ${csvShops.length} shops.`);
    } else {
      console.log(`Database already has ${count} shops, skipping seed.`);
    }
  };

  seedData().catch(console.error);

  return httpServer;
}
