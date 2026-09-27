import {
  createSecureTransactionRecord,
  verifyTransactionIntegrity,
  toCanonicalPayload,
  computeTransactionHash,
} from "@/lib/security/transaction-crypto";
import { sendOrderNotification } from "@/lib/email/email.service";

async function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING SECURITY & NOTIFICATIONS TEST SUITE");
  console.log("=================================================\n");

  // TEST 1: Hashing & Canonical Representation
  console.log("--- TEST 1: SHA-256 Canonical Hashing ---");
  const payload1 = {
    transactionId: "TXN-TEST-101",
    orderId: "ORD-TEST-101",
    orderNumber: "RK-2026-TEST",
    amount: 5000,
    currency: "NPR",
    paymentMethod: "ESEWA",
    timestamp: "2026-03-24T12:00:00.000Z",
  };
  const canonical = toCanonicalPayload(payload1);
  const hash = computeTransactionHash(canonical);
  console.log("Canonical JSON:", canonical);
  console.log("SHA-256 Hash:  ", hash);
  if (hash && hash.length === 64) {
    console.log("✅ TEST 1 PASSED: 64-char SHA-256 digest generated.\n");
  } else {
    throw new Error("❌ TEST 1 FAILED: Invalid hash length.");
  }

  // TEST 2: RSA Asymmetric Signing & Verification
  console.log("--- TEST 2: RSA-2048 Digital Signature Issuance & Verification ---");
  const secureRecord = createSecureTransactionRecord({
    transactionId: "TXN-TEST-101",
    orderId: "ORD-TEST-101",
    orderNumber: "RK-2026-TEST",
    amount: 5000,
    currency: "NPR",
    paymentMethod: "ESEWA",
    timestamp: "2026-03-24T12:00:00.000Z",
  });
  console.log("Digital Signature:", secureRecord.digitalSignature.slice(0, 40) + "...");
  console.log("Signature Algorithm:", secureRecord.signatureAlgorithm);

  const verification = verifyTransactionIntegrity({
    canonicalPayload: secureRecord.canonicalPayload,
    storedHash: secureRecord.transactionHash,
    storedSignature: secureRecord.digitalSignature,
  });
  console.log("Hash match:", verification.isHashValid);
  console.log("Signature valid:", verification.isSignatureValid);
  if (verification.isHashValid && verification.isSignatureValid) {
    console.log("✅ TEST 2 PASSED: Signature verified against public key.\n");
  } else {
    throw new Error("❌ TEST 2 FAILED: Signature verification failed.");
  }

  // TEST 3: Tampering Detection Attack Simulation
  console.log("--- TEST 3: Safe Educational Tampering Attack Simulation ---");
  const tamperedPayload = {
    ...payload1,
    amount: 50000, // Altered from 5000 to 50000!
  };
  const tamperedCanonical = toCanonicalPayload(tamperedPayload);
  const tamperedVerification = verifyTransactionIntegrity({
    canonicalPayload: tamperedCanonical,
    storedHash: secureRecord.transactionHash, // original stored hash
    storedSignature: secureRecord.digitalSignature, // original stored signature
  });
  console.log("Tampered Amount: 50,000 (Original: 5,000)");
  console.log("Tampered Hash valid?:", tamperedVerification.isHashValid);
  console.log("Tampered Signature valid?:", tamperedVerification.isSignatureValid);
  console.log("Tamper Detected?:", tamperedVerification.diagnostics.tamperDetected);

  if (!tamperedVerification.isHashValid && !tamperedVerification.isSignatureValid) {
    console.log("✅ TEST 3 PASSED: Tampering correctly detected and rejected!\n");
  } else {
    throw new Error("❌ TEST 3 FAILED: Tampering was not caught!");
  }

  // TEST 4: Email Service Development Mode & Duplicate Protection
  console.log("--- TEST 4: Email Development Mode & Duplicate Protection ---");
  const mockOrder = {
    id: `test-order-${Date.now()}`,
    orderNumber: "RK-2026-TEST-DUPE",
    customerName: "Aarav Sharma",
    customerEmail: "aarav@example.com",
    customerPhone: "+977 9841234567",
    shippingAddress: "Baluwatar, Kathmandu",
    city: "Kathmandu",
    country: "Nepal",
    total: 145000,
    currency: "NPR",
    paymentMethod: "ESEWA",
    status: "CONFIRMED",
    items: [
      {
        product: { name: "1 Mukhi Savar Rudraksha (Nepal)" },
        quantity: 1,
        price: 145000,
      },
    ],
  };

  const firstDispatch = await sendOrderNotification({
    order: mockOrder,
    previousStatus: "PENDING",
    newStatus: "CONFIRMED",
  });
  console.log("First Dispatch Success:", firstDispatch.success, "Mode:", firstDispatch.mode);

  const duplicateDispatch = await sendOrderNotification({
    order: mockOrder,
    previousStatus: "CONFIRMED",
    newStatus: "CONFIRMED",
  });
  console.log("Duplicate Dispatch Blocked?:", duplicateDispatch.isDuplicate);

  if (firstDispatch.success && duplicateDispatch.isDuplicate) {
    console.log("✅ TEST 4 PASSED: Duplicate notification successfully prevented.\n");
  }

  console.log("=================================================");
  console.log("🎉 ALL TESTS EXECUTED SUCCESSFULLY!");
  console.log("=================================================");
}

runTests().catch((e) => {
  console.error("Test Suite Failure:", e);
  process.exit(1);
});
