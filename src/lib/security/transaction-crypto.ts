import crypto from "crypto";

export interface CanonicalTransactionPayload {
  amount: number;
  currency: string;
  orderId: string;
  orderNumber: string;
  paymentMethod: string;
  timestamp: string;
  transactionId: string;
}

export interface SecurityVerificationResult {
  isHashValid: boolean;
  isSignatureValid: boolean;
  computedHash: string;
  storedHash: string;
  signatureAlgorithm: string;
  diagnostics: {
    tamperDetected: boolean;
    authenticityConfirmed: boolean;
    details: string;
  };
}

// In-memory keypair fallback for development if env variables are omitted
let cachedKeyPair: { privateKey: string; publicKey: string } | null = null;

/**
 * Normalizes PEM string whether supplied as raw multiline, single-line with \n, or base64.
 */
function normalizeKey(keyStr?: string): string | null {
  if (!keyStr || !keyStr.trim()) return null;
  const trimmed = keyStr.trim();

  // Check if base64-encoded
  if (!trimmed.includes("-----BEGIN") && /^[A-Za-z0-9+/=]+$/.test(trimmed)) {
    try {
      const decoded = Buffer.from(trimmed, "base64").toString("utf-8");
      if (decoded.includes("-----BEGIN")) {
        return decoded;
      }
    } catch {}
  }

  // Replace literal escaped \n with actual newlines if present
  return trimmed.replace(/\\n/g, "\n");
}

/**
 * Retrieves the RSA 2048-bit asymmetric keypair.
 * Reads from environment variables or initializes a secure in-memory keypair for local dev.
 */
export function getTransactionKeyPair(): { privateKey: string; publicKey: string } {
  const envPrivate = normalizeKey(process.env.TRANSACTION_SIGNING_PRIVATE_KEY);
  const envPublic = normalizeKey(process.env.TRANSACTION_SIGNING_PUBLIC_KEY);

  if (envPrivate && envPublic) {
    return {
      privateKey: envPrivate,
      publicKey: envPublic,
    };
  }

  if (cachedKeyPair) {
    return cachedKeyPair;
  }

  // Generate ephemeral 2048-bit RSA keypair for academic/dev evaluation
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  cachedKeyPair = { privateKey, publicKey };

  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[RudraKart Crypto] Initialized ephemeral RSA 2048-bit transaction signing keypair for academic demonstration."
    );
  }

  return cachedKeyPair;
}

/**
 * Generates deterministic canonical JSON representation of transaction data.
 * Keys are alphabetically sorted and whitespace is uniform.
 */
export function toCanonicalPayload(data: Record<string, any>): string {
  const sortedKeys = Object.keys(data).sort();
  const canonicalObj: Record<string, any> = {};
  for (const key of sortedKeys) {
    canonicalObj[key] = data[key];
  }
  return JSON.stringify(canonicalObj);
}

/**
 * Computes the cryptographic SHA-256 hash of canonical transaction data.
 */
export function computeTransactionHash(canonicalString: string): string {
  return crypto.createHash("sha256").update(canonicalString, "utf8").digest("hex");
}

/**
 * Signs the SHA-256 transaction hash using the server-side RSA private key.
 * Algorithm: RSA-SHA256 with PKCS#1 v1.5 padding.
 * Never exposes the private key to the client.
 */
export function signTransactionHash(transactionHash: string): {
  digitalSignature: string;
  signatureAlgorithm: string;
} {
  const { privateKey } = getTransactionKeyPair();

  const sign = crypto.createSign("SHA256");
  sign.update(transactionHash, "utf8");
  sign.end();

  const digitalSignature = sign.sign(privateKey, "base64");

  return {
    digitalSignature,
    signatureAlgorithm: "RSA-SHA256",
  };
}

/**
 * Verifies both transaction data integrity (SHA-256) and authenticity/non-repudiation (RSA Signature).
 */
export function verifyTransactionIntegrity(params: {
  canonicalPayload: string;
  storedHash: string;
  storedSignature: string;
  publicKey?: string;
}): SecurityVerificationResult {
  const { canonicalPayload, storedHash, storedSignature } = params;
  const publicKey = params.publicKey || getTransactionKeyPair().publicKey;

  // 1. Recalculate SHA-256 hash from the canonical payload
  const computedHash = computeTransactionHash(canonicalPayload);
  const isHashValid = computedHash.toLowerCase() === storedHash.toLowerCase();

  // 2. Verify RSA Digital Signature against the computed hash
  let isSignatureValid = false;
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(computedHash, "utf8");
    verify.end();
    isSignatureValid = verify.verify(publicKey, storedSignature, "base64");
  } catch (err: any) {
    isSignatureValid = false;
  }

  // 3. Construct diagnostic breakdown for academic defense
  let details = "";
  if (isHashValid && isSignatureValid) {
    details =
      "✓ INTEGRITY & AUTHENTICITY VERIFIED: The computed SHA-256 digest exactly matches stored record, and the RSA signature confirms authentic origination from RudraKart private key.";
  } else if (!isHashValid && !isSignatureValid) {
    details =
      "✗ CRITICAL TAMPERING DETECTED: The transaction payload has been altered! The recalculated hash does not match, and the asymmetric signature verification failed.";
  } else if (!isHashValid) {
    details =
      "✗ INTEGRITY MISMATCH: Transaction data was altered after issuance. Hash mismatch detected.";
  } else {
    details =
      "✗ SIGNATURE INVALID: Data matches hash, but digital signature is invalid or was created with an untrusted key.";
  }

  return {
    isHashValid,
    isSignatureValid,
    computedHash,
    storedHash,
    signatureAlgorithm: "RSA-SHA256",
    diagnostics: {
      tamperDetected: !isHashValid || !isSignatureValid,
      authenticityConfirmed: isHashValid && isSignatureValid,
      details,
    },
  };
}

/**
 * Helper to generate full secure transaction record with canonical payload, hash, and signature.
 */
export function createSecureTransactionRecord(params: {
  transactionId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp?: string;
}) {
  const timestamp = params.timestamp || new Date().toISOString();

  const payloadObj: CanonicalTransactionPayload = {
    amount: params.amount,
    currency: params.currency,
    orderId: params.orderId,
    orderNumber: params.orderNumber,
    paymentMethod: params.paymentMethod,
    timestamp,
    transactionId: params.transactionId,
  };

  const canonicalPayload = toCanonicalPayload(payloadObj);
  const transactionHash = computeTransactionHash(canonicalPayload);
  const { digitalSignature, signatureAlgorithm } = signTransactionHash(transactionHash);

  return {
    payloadObj,
    canonicalPayload,
    transactionHash,
    digitalSignature,
    signatureAlgorithm,
  };
}
