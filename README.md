# [SpaceCraft](https://space-craft.vercel.app) — Peer-to-Peer Creative Studio & Workspace Marketplace

SpaceCraft connects photographers, podcasters, musicians, and filmmakers with verified, bookable creative studios by the hour. Hosts can list and manage their workspaces, while creators can discover, filter, and reserve spaces with real-time cost calculation.

---

## Key Features

- **Curated Creative Studio Discovery:** Browse verified photography stages, podcast suites, music recording rooms, and film spaces with live keyword search and instant category filtering (`Photography`, `Podcast`, `Music`, `Film`, `Dance`, `Art`).
- **Dual Authentication & Route Protection:** Supports both Email/Password registration and Google OAuth via BetterAuth, enforced at the edge with Next.js 16 `proxy.ts` redirects and server-side Express session middleware.
- **Host Space Publishing (`/add-studio`):** Validated multi-field listing form powered by React Hook Form and Zod, featuring interactive amenity selectors and a live cover-image preview.
- **Dynamic Studio Showcase & Booking Calculator (`/studios/[id]`):** Detailed space pages displaying host profiles, capacity limits, included gear/amenities, and an interactive hourly booking calculator that prevents hosts from booking their own listings.
- **Unified Host & Renter Dashboard (`/my-studios`):** Three-tab management workspace where hosts can approve or decline incoming booking requests and safely delete listings, while renters can track and cancel their upcoming sessions.
- **Responsive Dark & Light Theme UI:** Built with accessible Shadcn UI primitives, Tailwind CSS, and Indigo/Zinc design tokens optimized across mobile, tablet, and desktop viewports.

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons, React Hook Form, Zod
- **Backend:** Node.js, Express.js, MongoDB Atlas (Native Driver)
- **Authentication & Security:** BetterAuth (HTTP-only signed session cookies, Google OAuth 2.0, CORS credential verification)
- **Deployment:** Vercel (Client & Serverless Express API)

---

## Examiner Test Credentials

You can sign in instantly with **Google OAuth** or use the pre-configured demo accounts below to test both host and renter workflows:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Studio Host** | `host@spacecraft.dev` | `Host@1234` |
| **Creator / Renter** | `renter@spacecraft.dev` | `Renter@1234` |

> **Note for Examiners:** Log in as the **Renter** to browse `/studios` and submit a booking request on any space, then log in as the **Host** to approve or decline that request inside `/my-studios`.

---

## Local Setup & Installation

### Prerequisites
- Node.js `v20+` installed
- A MongoDB Atlas connection URI
- Google Cloud OAuth 2.0 Client ID & Secret (optional for Google Sign-In)

### 1. Backend Server Setup (`space-craft-server`)

```bash
# Clone the backend repository
git clone [https://github.com/your-username/space-craft-server.git](https://github.com/your-username/space-craft-server.git)
cd space-craft-server

# Install dependencies
npm install

# Create a .env file in the root directory and add:
# PORT=5000
# MONGODB_URI=your_mongodb_atlas_connection_string
# BETTER_AUTH_SECRET=your_random_32_char_secret
# BETTER_AUTH_URL=http://localhost:5000
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# Start the Express server
npm run dev
```

### 2. Frontend Client Setup (`space-craft`)

```bash
# Clone the frontend repository
git clone [https://github.com/your-username/space-craft.git](https://github.com/your-username/space-craft.git)
cd space-craft

# Install dependencies
npm install

# Create a .env.local file in the root directory and add:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000

# Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore SpaceCraft locally.
