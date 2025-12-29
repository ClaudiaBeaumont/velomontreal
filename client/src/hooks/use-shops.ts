import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ShopInput } from "@shared/routes";
import { z } from "zod";

// Helper to log validation errors
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    // In production, we might return the raw data or throw, 
    // but throwing allows Query to handle the error state.
    throw result.error;
  }
  return result.data;
}

export function useShops(search?: string) {
  const queryKey = search ? [api.shops.list.path, { search }] : [api.shops.list.path];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build URL with query params
      const url = new URL(api.shops.list.path, window.location.origin);
      if (search) {
        url.searchParams.append("search", search);
      }

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de charger les boutiques");
      
      const data = await res.json();
      return parseWithLogging(api.shops.list.responses[200], data, "shops.list");
    },
  });
}

export function useCreateShop() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newShop: ShopInput) => {
      // Validate input before sending (double safety)
      const validatedInput = api.shops.create.input.parse(newShop);

      const res = await fetch(api.shops.create.path, {
        method: api.shops.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.shops.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Erreur lors de la création de la boutique");
      }

      return api.shops.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.shops.list.path] });
    },
  });
}
