# Anthaathi - AI Farming Companion

## Overview

Anthaathi is a mobile-first AI farming companion application targeting farmers in Tamil Nadu, India. It provides weather information, pest/disease detection via image analysis, an AI chat assistant (UZHAVAN), market price tracking, expense management, and bilingual support (English and Tamil). The app is built with Expo (React Native) for the frontend and Express for the backend, designed to run as a web app on Replit with potential for native mobile deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, new architecture enabled, React 19.1
- **Routing**: File-based routing via `expo-router` v6 in the `app/` directory. Screens include: `index.tsx` (splash), `login.tsx`, `language.tsx`, `home.tsx`, `weather.tsx`, `chat.tsx`, `pest.tsx`, `market.tsx`, `expenses.tsx`, `profile.tsx`
- **State Management**: React Context for authentication (`lib/AuthContext.tsx`) and language/i18n (`lib/LanguageContext.tsx`). `@tanstack/react-query` is set up for server state but minimally used currently
- **Local Storage**: `@react-native-async-storage/async-storage` persists user profile, language preference, and expenses data client-side
- **Internationalization**: JSON-based i18n with `assets/lang/en.json` (English) and `assets/lang/ta.json` (Tamil)
- **UI**: Custom components without an external UI library. Uses `expo-linear-gradient`, `expo-image`, `expo-haptics`, `@expo/vector-icons` (Ionicons, MaterialCommunityIcons, Feather). Font: Nunito via `@expo-google-fonts/nunito`
- **Authentication**: Client-side only mock OTP flow stored in AsyncStorage. No real backend authentication is implemented
- **Path Aliases**: `@/*` maps to project root, `@shared/*` maps to `./shared/*` (configured in `tsconfig.json`)

### Backend (Express)

- **Framework**: Express v5 on Node.js, located in `server/` directory
- **Entry Point**: `server/index.ts` handles server setup, CORS configuration, and static file serving
- **Routes**: `server/routes.ts` registers API routes (currently minimal, prefixed with `/api`)
- **Storage**: `server/storage.ts` defines an `IStorage` interface with a `MemStorage` in-memory implementation. This is designed to be swapped for a database-backed implementation
- **CORS**: Dynamic CORS supporting Replit dev/deployment domains and localhost for Expo web development
- **Development**: Uses `tsx` for TypeScript execution (`server:dev` script)
- **Production Build**: Uses `esbuild` to bundle server to `server_dist/`, serves static Expo web build

### Database

- **ORM**: Drizzle ORM configured for PostgreSQL in `drizzle.config.ts`
- **Schema**: `shared/schema.ts` defines a `users` table with `id` (UUID, auto-generated via `gen_random_uuid()`), `username` (unique, text), and `password` (text). Uses `drizzle-zod` for Zod validation schema generation
- **Migrations**: Output to `./migrations` directory, managed via `drizzle-kit push` (`db:push` script)
- **Current State**: The database schema exists but is not fully integrated with the app's authentication flow. The app currently uses AsyncStorage for auth instead of the database. The `MemStorage` class in the server doesn't connect to PostgreSQL yet
- **Environment**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Build & Deployment

- **Development**: Two processes run separately — Expo dev server (`expo:dev`) and Express server (`server:dev`)
- **Production**: Static web build via custom `scripts/build.js`, server bundled via esbuild, Express serves static files (`server:prod`)
- **Replit Integration**: Scripts reference `REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, and `REPLIT_INTERNAL_APP_DOMAIN` for domain configuration

## External Dependencies

- **PostgreSQL**: Required database (connection via `DATABASE_URL` env var), used with Drizzle ORM
- **Expo ecosystem**: Expo SDK 54 with numerous Expo modules (image-picker, location, haptics, linear-gradient, etc.)
- **No external APIs currently integrated**: Weather data is mocked, pest detection uses simulated responses, market prices use sample data, and the AI chat returns pre-defined farming responses. These are all candidates for real API integration
- **AsyncStorage**: Used as the primary client-side persistence layer for user data, language preferences, and expenses
- **React Query**: Set up with `expo/fetch` for API communication but minimally utilized