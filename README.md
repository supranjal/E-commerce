# RudraKart — Rudraksha and Puja E-Commerce Demo

**BSc CSIT 6th Semester E-Commerce Project**  
_Technology Stack:_ Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL (Neon Free Tier), Auth.js.

---

## 🌟 Key Features & Business USPs

1. **Product Catalog:**
   - Rudraksha beads, malas, and puja products with stock, category, and detail fields.
   - Certificate reference lookup at `/certificate-verification`; `RK-DEMO-*` entries are academic sample data, not independent certifications.

2. **Clean SEO-Optimized Catalog & Routing:**
   - Multi-facet filters (Mukhi 1–14, Category, Origin, Price, Sort).
   - Clean SEO URLs (e.g., `/rudraksha/5-mukhi`, `/rudraksha/7-mukhi`, `/rudraksha/gauri-shankar`).
   - Dynamic `sitemap.xml` and `robots.txt`.

3. **Currency Display:**
   - Switch between **NPR (Rs.)** and **USD ($)** for storefront price display. Orders are recorded in NPR.

4. **Checkout:**
   - Cash on Delivery, plus **eSewa** and **Khalti academic sandboxes** using published test logins (no live merchant settlement). Card/Stripe remains unavailable.

5. **Rule-Based Recommendation Engine:**
   - Suggests matching Mukhi creations (e.g. 5 Mukhi Mala with 5 Mukhi Bead), complementary silver caps/storage boxes, and similar price tier beads.

6. **Comprehensive Admin Portal (`/admin`):**
   - Dashboard statistics, pending orders, and low-stock alerts from available database records.
   - Products & Specimens CRUD with stock level indicators.
   - Order fulfillment & status updater (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED`).
   - Read-only academic sample certificate records; issuance is not implemented.
   - Inventory is updated when orders are placed and can be managed by an administrator.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-123456.us-east-2.aws.neon.tech/rudrakart?sslmode=require"
NEXTAUTH_SECRET="replace-with-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY_DEFAULT="NPR"
NEXT_PUBLIC_USD_RATE="135.0"
```

### 3. Database Setup & Sample Seeding

When connected to PostgreSQL (Neon Free Tier or local):

```powershell
# Push schema to database
npx prisma db push

# Requires a disposable database, a private admin password of at least 12 characters,
# and explicitly opts into deleting existing RudraKart records.
$env:ADMIN_SEED_PASSWORD="use-a-private-password"; $env:ALLOW_DESTRUCTIVE_SEED="true"; npm run seed; Remove-Item Env:ADMIN_SEED_PASSWORD,Env:ALLOW_DESTRUCTIVE_SEED
```

The fallback catalog and certificate records are illustrative sample data. Order creation requires a working database.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local HTTPS / TLS Demonstration

Normal development remains HTTP:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). HTTP has no TLS encryption.

For the classroom demonstration, install mkcert and its local certificate authority once:

```powershell
winget install FiloSottile.mkcert
mkcert -install
```

Then start the separate HTTPS development server:

```bash
npm run dev:https
```

Open [https://localhost:3000/checkout](https://localhost:3000/checkout). This is the real RudraKart application and checkout route, served through Node.js HTTPS with a locally trusted development certificate. The generated certificate and private key stay in `.local-certs/`, which is ignored by Git. This setup is for local development and classroom demonstration only; production remains Vercel HTTPS.

HTTPS is HTTP transported over TLS. It encrypts data in transit, authenticates the server with a certificate, and protects the connection against interception and tampering during transmission. SHA-256 transaction hashing detects changes to transaction data but is not encryption. RSA digital signatures provide authenticity and integrity for signed transaction data, but are not the same thing as TLS.

---

Create customer accounts through `/register`. The seeded admin email is `admin@rudrakart.com`; the password is supplied privately through `ADMIN_SEED_PASSWORD` during the guarded seed.

## 🧪 Sample Demo Certificate IDs to Test

Visit `/certificate-verification` and try:

- `RK-DEMO-00001` (1 Mukhi Savar Rudraksha - Sankhuwasabha)
- `RK-DEMO-00002` (2 Mukhi Dwi Mukhi Rudraksha)
- `RK-DEMO-00005` (5 Mukhi Collector Grade Rudraksha)
- `RK-DEMO-00007` (7 Mukhi Mahalakshmi Rudraksha)
- `RK-DEMO-00014` (14 Mukhi Devamani Rudraksha)
- `RK-DEMO-00015` (Gauri Shankar Sacred Conjoined Rudraksha)

---

## 🌐 Zero-Cost Free-Tier Deployment (Vercel + Neon)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete RudraKart academic e-commerce implementation"
   git push origin main
   ```
2. **Neon Database (Free):**
   - Create a free project at [neon.tech](https://neon.tech) and copy the PostgreSQL connection string.
3. **Deploy on Vercel:**
   - Import the GitHub repo on [vercel.com](https://vercel.com).
   - Add `DATABASE_URL` and `NEXTAUTH_SECRET` in Vercel Project Settings $\rightarrow$ Environment Variables.
   - Click Deploy (Cost: \$0 / NPR 0).
