# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server with Turbopack at http://localhost:3000
npm run build        # Build production application
npm run start        # Start production server after build
npm run lint         # Run ESLint to check code quality
```

### Database (Prisma)
```bash
npm run db:generate  # Generate Prisma client after schema changes
npm run db:migrate   # Create and apply database migrations
npm run db:push      # Push schema changes directly (development only)
npm run db:studio    # Open Prisma Studio GUI for database management
npm run db:reset     # Reset database (caution: data loss)
```

## Architecture

This is a Next.js 15 application using the App Router pattern with TypeScript and Prisma ORM.

### Key Technologies
- **Framework**: Next.js 15.3.4 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4 (new PostCSS plugin approach)
- **Language**: TypeScript with strict mode

### Directory Structure
- `src/app/`: Next.js App Router pages and layouts
- `src/generated/prisma/`: Generated Prisma client (custom output location)
- `prisma/schema.prisma`: Database schema definition
- `public/`: Static assets

### Important Configuration
- **TypeScript**: Path alias `@/*` maps to `./src/*`
- **Prisma Client**: Generated to `../src/generated/prisma` (non-standard location)
- **Environment**: Requires `DATABASE_URL` for database connection

### Development Notes
- The app uses Turbopack in development for faster builds
- Dark mode is configured via CSS custom properties and `prefers-color-scheme`
- No testing framework is currently set up
- When adding new features, follow the App Router patterns (not Pages Router)

## Project-Specific Details

This is a Valorant 10-stack leaderboard stats site that:
- Fetches match data from HenrikDev API (`/valorant/v2/match/{id}`)
- Stores data in Supabase via Prisma
- Computes leaderboards, badges, and tier lists synchronously
- No background jobs - everything happens on POST to `/updategame`

### Badge System
Badges are defined in `src/types/badges.ts` with conditions:
- Serious badges: Raid Boss, Sharpshooter, Clutch King, etc.
- Troll badges: Toe Shooter, Bottom Frag, Bottomest Frag

### Tier List Calculation
- Uses z-scored composite: `0.45*KD + 0.25*ADR + 0.20*ACS + 0.10*Win%`
- Tiers: S (≥+1σ), A (≥+0.3σ), B (±0.3σ), C (≤-0.3σ), D (≤-1σ)