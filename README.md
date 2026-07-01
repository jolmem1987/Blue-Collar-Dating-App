# BlueCollar Match

**Dating for blue-collar singles and the people who appreciate them.**

A mobile-first dating web app built for people who work hard — welders, mechanics, truckers, electricians, nurses, farmers, and the people who love them. Built around real-life compatibility (schedules, trades, values, intent) with safety and women's comfort designed in from day one. **Not** a hookup app.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · PostgreSQL · Prisma · NextAuth**.

---

## ⚡ Quick start

### 1. Prerequisites
- **Node.js 18.18+** (or 20+)
- A **PostgreSQL** database (local install, Docker, Neon, Supabase, or Railway all work)

### 2. Install
```bash
npm install
```

### 3. Configure environment
Copy the example env file and fill in the values:
```bash
cp .env.example .env
```
At minimum you need:
- `DATABASE_URL` — your Postgres connection string
- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev

Everything else (email SMTP, Cloudinary) is **optional** for local development — sensible dev fallbacks kick in when they're blank (see "What's stubbed" below).

### 4. Create the database schema
```bash
npm run db:push
```

### 5. (Optional) Seed test data
```bash
npm run db:seed
```
This creates an admin plus 12 demo members with photos, likes, and pre-made matches. **Test data only — never run against production.**

Demo logins (all use password `password123`):
- Members: `mike.welder@example.com`, `sara.nurse@example.com`, … (see `prisma/seed.ts`)
- Admin console: `admin@bluecollarmatch.app`

### 6. Run it
```bash
npm run dev
```
Open <http://localhost:3000>.

---

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Run the production build |
| `npm run db:push` | Push the Prisma schema to the database (no migration files) |
| `npm run db:migrate` | Create + apply a dev migration |
| `npm run db:seed` | Seed clearly-marked test data |
| `npm run db:studio` | Open Prisma Studio to inspect data |
| `npm run lint` | Run ESLint |

---

## 🗺️ Project structure

```
prisma/
  schema.prisma        # All models + enums (User, Photo, Like, Pass, Match, Message, Report, Block, Subscription)
  seed.ts              # DEV-ONLY test data
src/
  app/
    (public routes)    # /, /about, /how-it-works, /safety, /pricing, /terms, /privacy, /community-guidelines
    (auth)/            # /login, /signup
    (app)/             # Authenticated: discover, matches, messages, profile, settings, account-safety, subscription, support, u/[id]
    admin/             # Admin console: dashboard, users, reports, photos, messages, banned, analytics
    api/               # Route handlers (auth, onboarding, profile, photos, like, pass, block, report, discover, messages, account, admin/*)
    onboarding/        # 5-step onboarding wizard
  components/          # UI kit, SiteHeader/Footer, AppNav, PhotoUploader, ProfileView, PublicPage
  lib/                 # auth, prisma, session, matching, matches, email, ratelimit, tokens, constants, utils
  middleware.ts        # Auth + admin gating + onboarding redirect
```

---

## 🔑 Core flows

- **Auth** — email/password via NextAuth Credentials (bcrypt-hashed), email verification + password reset tokens, JWT sessions. Banned/deleted/unverified users can't sign in.
- **Onboarding** — 5 steps: basics → work + trade → who you're looking for → relationship intent → blue-collar preference. Required before using the app (enforced in middleware).
- **Discover & matching** — `lib/matching.ts` excludes self, blocks (both directions), prior likes/passes, and inactive accounts, then ranks candidates by the spec's 9 priorities (preference → age → distance → intent → blue-collar → trade → activity → verified → completeness). A like becomes a **match** only when it's mutual.
- **Messaging** — only matched users can message each other (enforced server-side). Rate-limited, with read receipts and a safety banner. Lightweight polling keeps threads fresh.
- **Safety** — Report and Block on every profile/chat. Blocking unmatches and hides both ways. Reports flow to the admin queue. Account pause + delete (with PII scrub) in Settings.
- **Admin** — role-gated console for user management, report review (with ban/dismiss), photo moderation, message moderation, banned users, and analytics.

---

## 🧪 What's stubbed (intentional, for MVP)

These are wired structurally but not connected to live third-party services, so the app runs end-to-end with zero paid accounts:

- **Email (SMTP)** — if `EMAIL_SERVER_*` is blank, verification and password-reset links are **logged to the server console** instead of emailed. Fill in SMTP creds to send real mail.
- **Photo uploads (Cloudinary)** — if `NEXT_PUBLIC_CLOUDINARY_*` is blank, the uploader falls back to in-browser data URLs so you can test the flow. Add a Cloudinary unsigned preset for real hosting (or swap in S3/UploadThing).
- **Verification badges** — admins can grant/revoke the `VERIFIED` status; an automated ID-verification pipeline is future work.
- **Message/photo moderation** — manual admin review is built. Automated/AI pre-screening is future work.

The legal pages (Terms, Privacy) are **starter templates** clearly marked as such — have a lawyer review them before launch.

---

## 🚀 Deploying (GitHub → DigitalOcean + Cloudflare)

The app is a standard Next.js server, so it runs anywhere that can run Node. This is the
GitHub + DigitalOcean App Platform + Cloudflare path. You do **not** need Vercel.

### 1. Push the code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/bluecollar-match.git
git push -u origin main
```

### 2. Create the production database
Use a hosted Postgres and copy its connection string (`postgresql://...`):
- **Neon** (free tier, quick) — neon.tech, or
- **DigitalOcean Managed Postgres** (in the DO console → *Databases → Create*) so it lives next
  to the app.

### 3. Deploy the app on DigitalOcean App Platform
1. DO console → **Apps → Create App → GitHub**, and pick this repo/branch (`main`).
2. DO auto-detects Next.js. Confirm:
   - **Build command:** `npm run build`  (runs `prisma generate` automatically)
   - **Run command:** `npm start`
   - **HTTP port:** `3000`
3. Add environment variables (from `.env.example`), marking secrets as *encrypted*:
   - `DATABASE_URL` — your production Postgres string
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your public URL, e.g. `https://bluecollarmatch.app`
   - Optional: `EMAIL_SERVER_*`, `NEXT_PUBLIC_CLOUDINARY_*`, `ADMIN_EMAILS`
4. Deploy. Every `git push` to `main` auto-redeploys.

### 4. Create the tables (once)
Point your local shell at the production DB and push the schema:
```bash
DATABASE_URL="<prod-url>" npm run db:push
# optional demo data: DATABASE_URL="<prod-url>" npm run db:seed
```
(Or run it from the App Platform **Console** tab.)

### 5. Point your domain through Cloudflare
1. In DO, find your app's default URL (`*.ondigitalocean.app`), and under **Settings →
   Domains** add your custom domain.
2. In **Cloudflare DNS**, add a `CNAME` for your domain → the `ondigitalocean.app` hostname
   (proxy **on** — the orange cloud), then finish domain verification in DO.
3. Set Cloudflare SSL/TLS mode to **Full (strict)** so Cloudflare↔DO stays encrypted.
4. Make sure `NEXTAUTH_URL` matches the final `https://` domain, or logins will misbehave.

> Note: the in-memory rate limiter (`lib/ratelimit.ts`) is per-instance — swap it for
> Redis/Upstash if you scale the app to more than one instance.

---

## ✅ Build status

This codebase represents a working MVP foundation:

**Done**
- Full data model + Prisma schema
- Auth (signup/login/verify/reset, 18+ gate)
- Onboarding wizard
- Profile creation/editing + photo upload
- Discover, like/pass, mutual matching
- Discovery filters
- Matches + matched-only messaging
- Report / block / pause / delete
- Settings, Account & Safety, Support
- Full admin console
- All public + legal pages
- Landing page
- Test seed data

**Future work**
- Real email delivery and automated ID verification
- Push/real-time messaging (replace polling with websockets)
- Automated content moderation
- Native mobile apps

---

*BlueCollar Match — built for people who work hard and love harder.*
