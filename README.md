# ⭐ StarRate — Celebrity Photo Ranking Platform

StarRate is a flagship-grade, interactive celebrity rating web application built with a modern Next.js 14 stack. It features a premium "Aurora Glass" design language, physics-based 3D animations, and real-time aggregate scoring.

## 🚀 Features

- **Interactive 3D Rating Engine**: A highly tactile, physics-driven rating interface where celebrity cards track mouse movement with a 3D perspective tilt and dynamic specular shine.
- **Auto-Swipe Physics**: Smooth, directional spring-animated swipe transitions when submitting ratings.
- **Live Global Leaderboard**: Real-time aggregated rankings of celebrities based on community scores, featuring animated score bars and tiered medal highlights.
- **Personal Collection**: Users can track their own rating history in a completely sortable and visually rich gallery.
- **Aurora Glass Design Language**: A bespoke aesthetic combining frosted glassmorphism (`backdrop-filter`), vibrant animated gradient "blobs," and precise typography.
- **Secure Authentication**: Robust session management and route protection powered by Auth.js v5.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14.2](https://nextjs.org/) (App Router, Server Actions)
- **Animation**: [Motion v12](https://motion.dev/) (formerly Framer Motion) for complex spring physics and orchestration.
- **Database Layer**: [Prisma ORM](https://www.prisma.io/) + SQLite (Development)
- **Authentication**: [Auth.js v5](https://authjs.dev/) with Credentials Strategy.
- **Styling**: Vanilla CSS Modules with a comprehensive Custom Properties (Tokens) system.

## 🏗️ Project Architecture

```
ai project/
├── app/
│   ├── (auth)/             # Login and Registration routes
│   ├── (main)/             # Core app wrapped in Navbar/Sidebar layout
│   │   ├── rate/           # The primary 3D rating interface
│   │   ├── rankings/       # Live leaderboard
│   │   ├── collection/     # User's personal rated collection
│   │   ├── qa/             # FAQ and platform guidelines
│   │   └── about/          # Mission and live platform statistics
│   ├── api/                # Next.js Route Handlers (Auth, Ratings, Celebrities)
│   ├── globals.css         # The Aurora Glass design tokens
│   └── layout.tsx          # Root layout and Providers
├── components/
│   ├── auth/               # Secure authentication forms
│   ├── celebrity/          # The complex Rating engine (SwipeContainer, 3D Card)
│   ├── layout/             # Reusable shell (Sidebar, Navbar)
│   └── ui/                 # Reusable glass primitives (GlassPanel, GradientButton)
├── lib/                    # Core utilities (Auth config, Prisma singleton)
├── prisma/                 # Database schema and seed scripts
└── public/celebrities/     # Local high-res AI portrait assets
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   Generate the Prisma client and push the schema to your local SQLite database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed the Database:**
   Populate the database with the initial roster of celebrities:
   ```bash
   npm run seed
   ```

4. **Environment Variables:**
   Ensure you have a `.env` file at the root with a `AUTH_SECRET` (You can generate one using `openssl rand -base64 32`).
   ```env
   AUTH_SECRET="your-super-secret-key"
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. Unauthenticated users are appropriately redirected to `/login`.

## 🎨 Design Philosophy

StarRate introduces the **Aurora Glass** design token system:
> *A white canvas illuminated by northern-lights gradients, wrapped in frosted glass depth. Every surface breathes. Every interaction has weight.*

Emphasis was placed heavily on **Micro-interactions**:
- Hover states elevate components via `translateZ` and dynamically shift gradient box-shadows.
- Rating buttons use a snappy pop spring `scale(1.15)`.
- Navigating routes deploys staggered `AnimatePresence` animations for a fluid SPA feel.

## ✅ Performance & Polish

The application has undergone a full performance audit:
- All static assets are served using `next/image` to ensure responsive, optimized rendering without Cumulative Layout Shift (CLS).
- Responsive breakpoints natively reflow complex grid structures such as the main rating container and live ranking tables seamlessly to mobile screens.
- Strict typings across the entirety of the codebase ensure zero-warning, highly stabilized production builds.

---
*Built as a showcase of modern Next.js architecture and advanced UI physics.*
