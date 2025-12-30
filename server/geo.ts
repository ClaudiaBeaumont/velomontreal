import type { Shop } from "@shared/schema";

const GEOCODE_CACHE: Map<string, { lat: number; lon: number }> = new Map();

export function normalizePostalCode(postalCode: string): string {
  return postalCode.replace(/\s/g, "").toUpperCase();
}

export function isValidCanadianPostalCode(postalCode: string): boolean {
  const normalized = normalizePostalCode(postalCode);
  return /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalized);
}

export async function geocodePostalCode(
  postalCode: string
): Promise<{ lat: number; lon: number } | null> {
  const normalized = normalizePostalCode(postalCode);

  // Check cache first
  if (GEOCODE_CACHE.has(normalized)) {
    return GEOCODE_CACHE.get(normalized)!;
  }

  try {
    // Format postal code for Nominatim (A1A 1A1 format)
    const formatted = `${normalized.slice(0, 3)} ${normalized.slice(3)}`;
    
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(
      formatted
    )}&country=Canada&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "VeloMontreal/1.0 (contact@velomontreal.ca)",
      },
    });

    if (!response.ok) {
      console.error("Nominatim request failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.length === 0) {
      console.warn(`No geocode result for postal code: ${normalized}`);
      return null;
    }

    const result = {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };

    // Cache the result
    GEOCODE_CACHE.set(normalized, result);

    return result;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export interface ShopWithDistance extends Shop {
  distance: number;
}

export function filterAndRankShops(
  shops: Shop[],
  userLat: number,
  userLon: number,
  maxDistanceKm: number = 15
): ShopWithDistance[] {
  const shopsWithDistance: ShopWithDistance[] = [];

  for (const shop of shops) {
    if (!shop.lat || !shop.lon) continue;

    const shopLat = parseFloat(shop.lat);
    const shopLon = parseFloat(shop.lon);

    if (isNaN(shopLat) || isNaN(shopLon)) continue;

    const distance = haversineKm(userLat, userLon, shopLat, shopLon);

    if (distance <= maxDistanceKm) {
      shopsWithDistance.push({
        ...shop,
        distance: Math.round(distance * 10) / 10, // 1 decimal
      });
    }
  }

  // Sort by distance ascending
  shopsWithDistance.sort((a, b) => a.distance - b.distance);

  return shopsWithDistance;
}
