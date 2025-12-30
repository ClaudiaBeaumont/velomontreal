import { readFileSync } from "fs";
import { join } from "path";
import type { InsertShop } from "@shared/schema";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function loadShopsFromCSV(): InsertShop[] {
  const csvPath = join(process.cwd(), "public", "data", "commerces.csv");

  let csvContent: string;
  try {
    csvContent = readFileSync(csvPath, "utf-8");
  } catch (error) {
    console.warn("CSV file not found, skipping import:", csvPath);
    return [];
  }

  const lines = csvContent.split("\n").filter((line) => line.trim());
  const headers = parseCsvLine(lines[0]);

  const shops: InsertShop[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length < headers.length) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    let lat = parseFloat(row.lat) || null;
    let lon = parseFloat(row.lon) || null;

    // Fix positive longitude for Montreal (should be negative)
    if (lon && lon > 0 && row.city?.includes("Montréal")) {
      console.warn(`Correcting positive longitude for ${row.name}: ${lon} -> ${-lon}`);
      lon = -lon;
    }

    const shop: InsertShop = {
      name: row.name,
      repair: row.repair === "1",
      rental: row.rental === "1",
      sale: row.sale === "1",
      storage: row.storage === "1",
      address: row.address,
      postalCode: row.postal_code?.replace(/\s/g, "").toUpperCase() || "",
      city: row.city || "Montréal",
      phone: row.phone || null,
      website: row.website || null,
      notes: row.notes || null,
      lat: lat?.toString() || null,
      lon: lon?.toString() || null,
    };

    shops.push(shop);
  }

  console.log(`Loaded ${shops.length} shops from CSV`);
  return shops;
}
