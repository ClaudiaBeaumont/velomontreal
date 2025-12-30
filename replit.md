# Répertoire Vélo

## Overview

Répertoire Vélo is a bilingual (French) directory application for finding bicycle repair shops, rental services, sales, and storage facilities in the Montreal area. Users can search by postal code to find nearby services within a 15km radius, with results sorted by distance. The application uses geolocation via OpenStreetMap's Nominatim API and calculates distances using the Haversine formula.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite

The frontend follows a page-based structure with shared components:
- `client/src/pages/` - Route components (Home, Directory, AddShop, Admin)
- `client/src/components/` - Reusable components including shadcn/ui primitives
- `client/src/hooks/` - Custom React hooks for data fetching

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON API with `/api/` prefix

Key server modules:
- `server/routes.ts` - API endpoint definitions
- `server/storage.ts` - Database access layer
- `server/geo.ts` - Geocoding and distance calculations
- `server/csv-loader.ts` - CSV data import functionality
- `server/email.ts` - Gmail integration for notifications

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: `migrations/` directory managed by drizzle-kit

The `shops` table stores business listings with fields for:
- Basic info (name, address, postal code, city)
- Service flags (repair, rental, sale, storage as booleans)
- Contact details (phone, website, notes)
- Geolocation (lat/lon as numeric)
- Status (pending/approved/rejected for moderation)

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Drizzle table definitions and Zod validation schemas
- `routes.ts` - API route definitions and type contracts

### Build System
- Development: `tsx` for direct TypeScript execution
- Production: Custom build script using esbuild (server) and Vite (client)
- Output: `dist/` directory with `index.cjs` (server) and `public/` (static assets)

## Approval Workflow

New shop submissions require admin approval:
1. User submits shop via `/add` page
2. Shop is saved with `status: "pending"`
3. Email notification sent to admin via Gmail
4. Admin reviews at `/admin` page using ADMIN_TOKEN
5. Admin approves or rejects the submission
6. Only approved shops appear in the public directory

## External Dependencies

### Database
- **PostgreSQL**: Required, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and type-safe queries
- **connect-pg-simple**: Session storage (if sessions are implemented)

### Email Integration
- **Gmail API**: Connected via Replit connector for sending notification emails
- Sends email to admin when new shop submission is received

### Geocoding API
- **OpenStreetMap Nominatim**: Free geocoding service for Canadian postal codes
- Server-side caching implemented to reduce API calls
- User-Agent header required per Nominatim usage policy

### UI Components
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Headless UI primitives for dialogs, dropdowns, forms, etc.
- **Lucide React**: Icon library

### Data Source
- CSV file (`public/data/commerces.csv`) containing initial shop data
- Loaded at server startup and inserted into PostgreSQL database

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_TOKEN`: Secret token for admin authentication
- `SESSION_SECRET`: Session encryption key
