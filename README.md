# RudraKart — Specialized Authentic Rudraksha E-Commerce Platform

**BSc CSIT 6th Semester E-Commerce Project**  
*Technology Stack:* Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL (Neon Free Tier), Auth.js.

---

## 🌟 Key Features & Business USPs

1. **Authenticity & Scientific Transparency:**
   - Detailed Mukhi facets, physical dimensions, exact gram weight, and origin tracking (Sankhuwasabha / Dingla, Nepal).
   - Digital non-destructive **X-Ray Radiograph** and **Microscopic Ridge Analysis** records.
   - Public Certificate Verification tool (`/certificate-verification`) using serialized IDs (e.g. `RK-DEMO-00001`).

2. **Clean SEO-Optimized Catalog & Routing:**
   - Multi-facet filters (Mukhi 1–14, Category, Origin, Price, Sort).
   - Clean SEO URLs (e.g., `/rudraksha/5-mukhi`, `/rudraksha/7-mukhi`, `/rudraksha/gauri-shankar`).
   - Dynamic `sitemap.xml` and `robots.txt`.

3. **Dual Currency & Markets:**
   - Seamless one-click switch between **NPR (Rs.)** and **USD ($)** across all catalog pages.

4. **Multi-Gateway Payment Simulators:**
   - 🇳🇵 **eSewa Mobile Wallet** sandbox simulator with authentic UI.
   - 🇳🇵 **Khalti Digital Wallet** sandbox simulator.
   - 💳 **International Card (Stripe-style)** simulator.
   - 💵 **Cash on Delivery (COD)**.

5. **Rule-Based Recommendation Engine:**
   - Suggests matching Mukhi creations (e.g. 5 Mukhi Mala with 5 Mukhi Bead), complementary silver caps/storage boxes, and similar price tier beads.

6. **Comprehensive Admin Portal (`/admin`):**
   - Executive Dashboard with metrics (Revenue, Pending Orders, Low Stock Alerts).
   - Products & Specimens CRUD with stock level indicators.
   - Order fulfillment & status updater (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SHIPPED` $\rightarrow$ `DELIVERED`).
   - Certificate registry & issuance log.
   - Real-time Inventory Controller.

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
NEXTAUTH_SECRET="rudrakart_development_jwt_secret_academic_key_2026"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY_DEFAULT="NPR"
NEXT_PUBLIC_USD_RATE="135.0"
```

### 3. Database Migration & Realistic Seeding
When connected to PostgreSQL (Neon Free Tier or local):
```bash
# Push schema to database
npx prisma db push

# Seed 20+ authentic Nepali specimens, categories, certificates, and demo accounts
npm run seed
```
*(Note: The system also includes an automated fallback layer so all pages, catalog filters, and certificates work even if the database is offline).*

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

## 👥 Demo Test Accounts

On the `/login` page, you can use the **1-Click Fast-Fill buttons** or enter:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@rudrakart.com` | `Admin@12345` |
| **Customer** | `customer@rudrakart.com` | `Customer@12345` |

---

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
