import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ShopInput } from "@shared/routes";
import type { Shop } from "@shared/schema";

export interface ShopWithDistance extends Shop {
  distance: number | null;
}

export function useShops(service?: string) {
  const queryKey = ["/api/shops", { service }];
  
  return useQuery<Shop[]>({
    queryKey,
    queryFn: async () => {
      const url = new URL("/api/shops", window.location.origin);
      if (service) {
        url.searchParams.append("service", service);
      }

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de charger les boutiques");
      
      return res.json();
    },
  });
}

export function useShopsSearch(postalCode?: string, service?: string) {
  const queryKey = ["/api/shops/search", { postalCode, service }];
  
  return useQuery<ShopWithDistance[], Error>({
    queryKey,
    queryFn: async () => {
      const url = new URL("/api/shops/search", window.location.origin);
      if (postalCode) {
        url.searchParams.append("postalCode", postalCode);
      }
      if (service) {
        url.searchParams.append("service", service);
      }

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur de recherche");
      }
      
      return res.json();
    },
    enabled: true,
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newShop: ShopInput) => {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShop),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Erreur de validation");
        }
        throw new Error("Erreur lors de la création de la boutique");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate both shops list and search queries
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shops/search"] });
    },
  });
}
