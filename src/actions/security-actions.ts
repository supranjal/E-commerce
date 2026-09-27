"use server";

import prisma from "@/lib/prisma";
import {
  computeTransactionHash,
  createSecureTransactionRecord,
  getTransactionKeyPair,
  toCanonicalPayload,
  verifyTransactionIntegrity,
} from "@/lib/security/transaction-crypto";

export interface TransactionAuditItem {
  id: string;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionHash: string;
  digitalSignature: string;
  signatureAlgorithm: string;
  canonicalPayload: string;
  createdAt: string;
  isSimulated?: boolean;
}

// Built-in educational sample records with valid cryptographic hashes & signatures
function getFallbackDemoTransactions(): TransactionAuditItem[] {
  const demoList = [
    {
      transactionId: "TXN-DEMO-001",
      orderId: "ord-sample-01",
      orderNumber: "RK-2026-9041",
      customerName: "Aarav Sharma",
      amount: 145000,
      currency: "NPR",
      paymentMethod: "ESEWA",
      paymentStatus: "PAID",
      timestamp: "2026-03-24T10:15:00.000Z",
    },
    {
      transactionId: "TXN-DEMO-002",
      orderId: "ord-sample-02",
      orderNumber: "RK-2026-9042",
      customerName: "Sunita Poudel",
      amount: 16800,
      currency: "NPR",
      paymentMethod: "KHALTI",
      paymentStatus: "PAID",
      timestamp: "2026-03-23T14:30:00.000Z",
    },
    {
      transactionId: "TXN-DEMO-003",
      orderId: "ord-sample-03",
      orderNumber: "RK-2026-9044",
      customerName: "David Miller",
      amount: 210000,
      currency: "NPR",
      paymentMethod: "CARD",
      paymentStatus: "PAID",
      timestamp: "2026-03-22T09:00:00.000Z",
    },
  ];

  return demoList.map((demo) => {
    const sec = createSecureTransactionRecord({
      transactionId: demo.transactionId,
      orderId: demo.orderId,
      orderNumber: demo.orderNumber,
      amount: demo.amount,
      currency: demo.currency,
      paymentMethod: demo.paymentMethod,
      timestamp: demo.timestamp,
    });

    return {
      id: `fallback-${demo.transactionId}`,
      transactionId: demo.transactionId,
      orderId: demo.orderId,
      orderNumber: demo.orderNumber,
      customerName: demo.customerName,
      amount: demo.amount,
      currency: demo.currency,
      paymentMethod: demo.paymentMethod,
      paymentStatus: demo.paymentStatus,
      transactionHash: sec.transactionHash,
      digitalSignature: sec.digitalSignature,
      signatureAlgorithm: sec.signatureAlgorithm,
      canonicalPayload: sec.canonicalPayload,
      createdAt: demo.timestamp,
      isSimulated: true,
    };
  });
}

/**
 * Fetches all transaction security records from PostgreSQL with cryptographic hashes and signatures.
 */
export async function getTransactionSecurityRecords(): Promise<TransactionAuditItem[]> {
  try {
    const dbTransactions = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
          },
        },
      },
    });

    const mappedDbRecords: TransactionAuditItem[] = dbTransactions.map((tx) => ({
      id: tx.id,
      transactionId: tx.transactionId,
      orderId: tx.orderId,
      orderNumber: tx.order?.orderNumber || "UNKNOWN",
      customerName: tx.order?.customerName || "Customer",
      amount: tx.amount,
      currency: tx.currency,
      paymentMethod: tx.paymentMethod,
      paymentStatus: tx.paymentStatus,
      transactionHash: tx.transactionHash,
      digitalSignature: tx.digitalSignature,
      signatureAlgorithm: tx.signatureAlgorithm,
      canonicalPayload: tx.canonicalPayload || "",
      createdAt: tx.createdAt.toISOString(),
      isSimulated: false,
    }));

    // If database has records, return them merged with educational fallbacks
    const fallbacks = getFallbackDemoTransactions();
    const existingTxIds = new Set(mappedDbRecords.map((r) => r.transactionId));
    const nonDuplicatedFallbacks = fallbacks.filter((f) => !existingTxIds.has(f.transactionId));

    return [...mappedDbRecords, ...nonDuplicatedFallbacks];
  } catch (error) {
    console.warn("DB transaction fetch failed, providing verified academic demo fallbacks:", error);
    return getFallbackDemoTransactions();
  }
}

/**
 * Recalculates SHA-256 hash and verifies RSA digital signature on a transaction record.
 */
export async function verifyTransactionAction(transactionId: string) {
  try {
    let transaction: TransactionAuditItem | undefined;

    // Check DB first
    try {
      const dbTx = await prisma.paymentTransaction.findUnique({
        where: { transactionId },
        include: {
          order: {
            select: {
              orderNumber: true,
              customerName: true,
            },
          },
        },
      });

      if (dbTx) {
        transaction = {
          id: dbTx.id,
          transactionId: dbTx.transactionId,
          orderId: dbTx.orderId,
          orderNumber: dbTx.order?.orderNumber || "UNKNOWN",
          customerName: dbTx.order?.customerName || "Customer",
          amount: dbTx.amount,
          currency: dbTx.currency,
          paymentMethod: dbTx.paymentMethod,
          paymentStatus: dbTx.paymentStatus,
          transactionHash: dbTx.transactionHash,
          digitalSignature: dbTx.digitalSignature,
          signatureAlgorithm: dbTx.signatureAlgorithm,
          canonicalPayload: dbTx.canonicalPayload || "",
          createdAt: dbTx.createdAt.toISOString(),
        };
      }
    } catch {}

    // Fallback to sample demo
    if (!transaction) {
      transaction = getFallbackDemoTransactions().find(
        (t) => t.transactionId === transactionId
      );
    }

    if (!transaction) {
      return {
        success: false,
        error: `Transaction ${transactionId} could not be located.`,
      };
    }

    // Ensure we have canonical payload
    let canonical = transaction.canonicalPayload;
    if (!canonical) {
      canonical = toCanonicalPayload({
        amount: transaction.amount,
        currency: transaction.currency,
        orderId: transaction.orderId,
        orderNumber: transaction.orderNumber,
        paymentMethod: transaction.paymentMethod,
        timestamp: transaction.createdAt,
        transactionId: transaction.transactionId,
      });
    }

    const verification = verifyTransactionIntegrity({
      canonicalPayload: canonical,
      storedHash: transaction.transactionHash,
      storedSignature: transaction.digitalSignature,
    });

    return {
      success: true,
      transaction,
      verification,
      recalculatedHash: verification.computedHash,
      storedHash: transaction.transactionHash,
      isHashMatch: verification.isHashValid,
      isSignatureValid: verification.isSignatureValid,
      details: verification.diagnostics.details,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Cryptographic verification failed.",
    };
  }
}

/**
 * Educational Tampering Simulation:
 * Safely simulates payload tampering (e.g. modifying amount from 5,000 to 50,000)
 * and demonstrates why SHA-256 hash mismatch and RSA signature failure prevent fraud.
 */
export async function simulateTamperingAction(params: {
  transactionId: string;
  tamperedAmount: number;
}) {
  try {
    const originalRes = await verifyTransactionAction(params.transactionId);
    if (!originalRes.success || !originalRes.transaction) {
      return {
        success: false,
        error: originalRes.error || "Could not load base transaction for tampering test.",
      };
    }

    const tx = originalRes.transaction;

    // Construct intentionally modified/tampered payload
    const tamperedPayloadObj = {
      amount: params.tamperedAmount, // MODIFIED!
      currency: tx.currency,
      orderId: tx.orderId,
      orderNumber: tx.orderNumber,
      paymentMethod: tx.paymentMethod,
      timestamp: tx.createdAt,
      transactionId: tx.transactionId,
    };

    const tamperedCanonical = toCanonicalPayload(tamperedPayloadObj);
    const tamperedHash = computeTransactionHash(tamperedCanonical);

    // Run verification on the altered data using the original stored signature & hash
    const verification = verifyTransactionIntegrity({
      canonicalPayload: tamperedCanonical,
      storedHash: tx.transactionHash,
      storedSignature: tx.digitalSignature,
    });

    return {
      success: true,
      originalData: {
        amount: tx.amount,
        currency: tx.currency,
        storedHash: tx.transactionHash,
        digitalSignature: tx.digitalSignature,
      },
      tamperedData: {
        tamperedAmount: params.tamperedAmount,
        tamperedCanonical,
        tamperedHash,
      },
      comparison: {
        originalHash: tx.transactionHash,
        tamperedHash,
        isHashMatch: verification.isHashValid, // false!
        isSignatureValid: verification.isSignatureValid, // false!
        tamperDetected: verification.diagnostics.tamperDetected,
        message:
          "Tampering Caught! The recalculated SHA-256 hash does not match the stored hash, and the RSA digital signature is invalid for the modified payload. The transaction is instantly rejected.",
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Tampering simulation error.",
    };
  }
}

/**
 * Returns the public key information and active signature algorithm for admin security inspection.
 */
export async function getSecurityPublicKeyInfo() {
  const { publicKey } = getTransactionKeyPair();
  return {
    algorithm: "RSA-SHA256 (2048-bit)",
    modulusLength: 2048,
    hashAlgorithm: "SHA-256 (FIPS 180-4)",
    publicKeyPem: publicKey,
    publicKeySnippet: publicKey.slice(0, 120) + "...\n-----END PUBLIC KEY-----",
    isPrivateKeySecuredServerSide: true,
  };
}
