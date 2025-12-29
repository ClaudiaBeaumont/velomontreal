import { z } from 'zod';
import { insertShopSchema, shops } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  shops: {
    list: {
      method: 'GET' as const,
      path: '/api/shops',
      input: z.object({
        service: z.enum(['repair', 'rental']).optional(),
        postalCode: z.string().optional()
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof shops.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/shops',
      input: insertShopSchema,
      responses: {
        201: z.custom<typeof shops.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ShopInput = z.infer<typeof api.shops.create.input>;
export type ShopResponse = z.infer<typeof api.shops.create.responses[201]>;
