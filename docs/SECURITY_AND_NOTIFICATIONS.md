# RudraKart — Security & Notification Technical Documentation
**BSc CSIT E-Commerce Final Evaluation Reference**

---

## 1. Executive Summary & Architecture Overview

This subsystem implements production-grade security, cryptographic verification, and transactional notifications for RudraKart without altering the underlying Next.js App Router architecture:

1. **Transactional Notification Architecture**: Multi-state lifecycle notification engine (`CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`) with transactional provider integration (Resend), WhatsApp Cloud API delivery for confirmations, and console/DB-backed development mode (`EMAIL_MODE=development`).
2. **Duplicate Notification Protection**: Database-backed notification tracking (`OrderEmailLog`) ensuring that idempotent admin actions or re-renders never send duplicate customer notifications.
3. **SSL/TLS Transport Security**: Full encryption in transit via TLS 1.3 / HTTPS (automatic on Vercel deployment). Local classroom demonstrations use `npm run dev:https` with a locally trusted mkcert certificate and the real Next.js application.
4. **SHA-256 Canonical Transaction Hashing**: Deterministic JSON normalization and one-way hashing to detect any post-transaction alteration.
5. **RSA-2048 Asymmetric Digital Signatures**: Cryptographic proof of origin and non-repudiation using server-isolated private keys and public key verification.
6. **Admin Security Demonstration Portal**: Dedicated inspection and safe educational tampering laboratory at `/admin/security/transactions`.

---

## 2. Core Cryptographic Concepts: The Security Matrix

For project defense presentation, examiners frequently evaluate the distinction between the three core pillars:

| Security Primitive | Primary Goal | Algorithm / Protocol | Implementation in RudraKart | What it Protects Against |
| :--- | :--- | :--- | :--- | :--- |
| **Data Hashing** | **Integrity Checking** (One-way digest) | **SHA-256** (FIPS 180-4) | `src/lib/security/transaction-crypto.ts` | Detects data alteration at rest. Any modified digit changes the 256-bit hash. |
| **Transport Encryption** | **Confidentiality in Transit** | **TLS 1.3 / HTTPS** (AES-GCM / ChaCha20) | Vercel Edge / Checkout (`/checkout`) | Eavesdropping, packet sniffing, and Man-in-the-Middle (MitM) interception over networks. |
| **Digital Signatures** | **Authenticity & Non-Repudiation** | **RSA-2048** with PKCS#1 v1.5 padding | Server actions & Crypto engine | Forgery, masquerading, and sender denial. Mathematically proves the transaction was authorized by the RudraKart server. |

> [!NOTE]
> **Critical Academic Distinction**:
> - Hashing is **one-way** and is **not encryption**; it provides integrity verification, not confidentiality.
> - TLS protects data **only while moving across the wire**; it does not protect against database tampering once received.
> - Digital Signatures use **asymmetric key cryptography** (private key signs, public key verifies); they prove **who** generated the data and that it remained intact.

---

## Local HTTPS Demonstration

`npm run dev` deliberately remains the normal HTTP development workflow at `http://localhost:3000`. HTTP has no TLS encryption.

Install mkcert and its local CA once on Windows:

```powershell
winget install FiloSottile.mkcert
mkcert -install
```

Run `npm run dev:https`, then open `https://localhost:3000/checkout`. The browser connection is actual HTTPS to the local Node.js server, and the certificate is generated in the ignored `.local-certs/` directory. If the browser still warns, confirm that `mkcert -install` completed for the same Windows user and restart the browser.

TLS encrypts data in transit, authenticates the server certificate, and protects the connection from interception or tampering in transit. It does not protect against every application or database attack. SHA-256 hashing detects changed transaction data and is not encryption. RSA signatures provide authenticity and integrity for signed transaction data and are not TLS.

## 3. Transactional Email Notification System

### 3.1 Data Flow Architecture
```text
Customer / Admin Action
       │
       ▼
Server-Side Order Logic (Server Action in order-actions.ts)
       │
       ▼
Order Status Updated in PostgreSQL (e.g. PENDING ──► CONFIRMED)
       │
       ▼
Email Service Dispatcher (lib/email/email.service.ts)
 ├── 1. Check Duplicate Notification Log (OrderEmailLog)
 ├── 2. Compile Template (order-confirmed / processing / shipped / delivered)
 ├── 3. If EMAIL_MODE=development ──► Log to server console & write DEV_LOGGED record
 └── 4. If EMAIL_MODE=production  ──► Call Resend Transactional API & write SENT record
       │
       ▼
Customer Email Inbox
   │
   └── WhatsApp Cloud API (order confirmations)
```

### 3.2 Supported Order Milestones & Templates
1. **`ORDER_CONFIRMED`**: Sent upon checkout or payment gateway confirmation (`confirmCommercialOrderPayment`). Contains customer name, order number, purchased items, price breakdown, payment method, shipping address, and RudraKart authenticity guarantee.
2. **`ORDER_PROCESSING`**: Sent when status moves to `PROCESSING`. Informs customer that the bead is undergoing laboratory optical and digital X-ray inspection and consecration.
3. **`ORDER_SHIPPED`**: Sent when status moves to `SHIPPED`. Includes destination address, courier service, and optional tracking number (`trackingNumber`).
4. **`ORDER_DELIVERED`**: Sent when status moves to `DELIVERED`. Summarizes items and provides direct instructions to verify the serial certificate in the laboratory registry.

### 3.3 Development Mode (`EMAIL_MODE=development`)
In development, no third-party email provider is required. The system outputs a structured terminal log:
```text
┌──────────────────────────────────────────────────────────┐
│        RUDRAKART EMAIL NOTIFICATION (DEV MODE)           │
├──────────────────────────────────────────────────────────┤
│ Mode:             EMAIL_MODE=development (Simulated)     │
│ Recipient:        customer@rudrakart.com                 │
│ Notification:     ORDER_CONFIRMED                        │
│ Order Number:     RK-2026-9041                           │
│ Subject:          Order Confirmed: RK-2026-9041          │
├──────────────────────────────────────────────────────────┤
│ Status Transition: PENDING -> CONFIRMED                  │
└──────────────────────────────────────────────────────────┘
```

---

## 4. SHA-256 Transaction Hashing & Canonical Representation

### 4.1 Why Canonical Serialization is Mandatory
JSON objects in JavaScript do not guarantee key order. Serializing `{ a: 1, b: 2 }` versus `{ b: 2, a: 1 }` produces different raw strings, which would yield completely different hashes even though the logical data is identical.

RudraKart implements `toCanonicalPayload()`:
1. Keys are alphabetically sorted (`amount`, `currency`, `orderId`, `orderNumber`, `paymentMethod`, `timestamp`, `transactionId`).
2. Whitespace is deterministic.
3. Resulting string is hashed using `crypto.createHash('sha256')`.

```json
{
  "amount": 145000,
  "currency": "NPR",
  "orderId": "ord-12345",
  "orderNumber": "RK-2026-9041",
  "paymentMethod": "ESEWA",
  "timestamp": "2026-03-24T10:15:00.000Z",
  "transactionId": "TXN-ESEWA-88392102"
}
```

---

## 5. RSA-2048 Digital Signatures & Key Management

### 5.1 Asymmetric Signing and Verification Flow
```text
[ ISSUANCE: Server-Side Confirmation ]
Canonical Transaction Data ──► SHA-256 Hash ──► Server RSA Private Key ──► Digital Signature (Base64)
                                                                                  │
                                                              Stored in PaymentTransaction Table

[ VERIFICATION: Admin / Auditor / Gateway ]
Stored Transaction Data   ──► Recompute SHA-256 ──┐
                                                  ▼
Stored Signature + Public Key ─────────────► RSA Verify ──► VALID / INVALID
```

### 5.2 Server-Side Key Management
- Private keys are stored exclusively on the server through `TRANSACTION_SIGNING_PRIVATE_KEY`.
- If environment variables are omitted during local evaluation, the crypto engine generates an in-memory 2048-bit RSA keypair with clean console logging.
- `scripts/generate-keys.ts` can generate fresh Base64 or PEM strings for deployment at any time.

---

## 6. Examiner Demonstration Guide (Walkthrough Script)

When demonstrating to academic evaluators:

1. **Demonstrate SSL/TLS Protection**:
   - Open `/checkout`.
   - Point out the "SSL/TLS Transport Security Guarantee" card explaining the transport layer encryption and the technical difference between TLS (in-transit) and digital signatures (at-rest integrity).
2. **Demonstrate Order Confirmation & Cryptographic Receipt**:
   - Complete an order using eSewa or Khalti simulation.
   - Show terminal output: `[RUDRAKART EMAIL NOTIFICATION (DEV MODE)]` with `ORDER_CONFIRMED`.
3. **Demonstrate Status Transition & Duplicate Protection**:
   - Navigate to `/admin/orders`.
   - Change order status from `CONFIRMED` to `PROCESSING` and click "Apply & Send Email".
   - Notice the status transition email logged in the console.
   - Click "Apply & Send Email" again without changing status; observe: *"Status unchanged. Duplicate notification blocked."*
4. **Demonstrate Cryptographic Verification**:
   - Navigate to `/admin/security/transactions`.
   - Click "Verify" next to any transaction; observe the real-time check of the SHA-256 digest and RSA signature.
5. **Demonstrate Tampering Detection Attack**:
   - In the "Safe Educational Tamper Testing Lab", select a transaction (e.g. NPR 145,000).
   - Change the amount to NPR 50,000 to simulate financial manipulation.
   - Click "Run Tampering Verification Attack".
   - Show the visual audit report:
     * Original Hash ≠ Tampered Hash (Integrity Breach Detected)
     * RSA Signature Verification = INVALID (Fraud Blocked)
