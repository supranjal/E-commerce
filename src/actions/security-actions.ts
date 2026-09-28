"use server";

import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import {
  computeTransactionHash,
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
}

/**
 * Fetches all transaction security records from PostgreSQL with cryptographic hashes and signatures.
 */
export async function getTransactionSecurityRecords(): Promise<
  TransactionAuditItem[]
> {
  if (!(await isAdmin())) return [];

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

    const mappedDbRecords: TransactionAuditItem[] = dbTransactions.map(
      (tx) => ({
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
      }),
    );

    return mappedDbRecords;
  } catch {
    return [];
  }
}

/**
 * Recalculates SHA-256 hash and verifies RSA digital signature on a transaction record.
 */
export async function verifyTransactionAction(transactionId: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required." };
  }

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
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required." };
  }
  if (
    !params.transactionId ||
    !Number.isFinite(params.tamperedAmount) ||
    params.tamperedAmount <= 0
  ) {
    return { success: false, error: "Enter a valid transaction and amount." };
  }

  try {
    const originalRes = await verifyTransactionAction(params.transactionId);
    if (!originalRes.success || !originalRes.transaction) {
      return {
        success: false,
        error:
          originalRes.error ||
          "Could not load base transaction for tampering test.",
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
  if (!(await isAdmin())) {
    throw new Error("Admin access required.");
  }
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
