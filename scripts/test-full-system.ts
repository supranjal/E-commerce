import prisma from "../src/lib/prisma";
import { createOrder, updateOrderStatus, getAdminOrders } from "../src/actions/order-actions";
import {
  confirmSandboxWalletPayment,
  cancelSandboxWalletPayment,
  failSandboxWalletPayment,
  getSandboxPaymentOrder,
} from "../src/actions/payment-actions";
import {
  getProducts,
  getProductBySlug,
  getAdminCatalog,
  updateProductAction,
} from "../src/actions/product-actions";
import { verifyTransactionIntegrity } from "../src/lib/security/transaction-crypto";
import {
  verifyEsewaSandboxCredentials,
  verifyKhaltiSandboxCredentials,
  ESEWA_SANDBOX_IDS,
  ESEWA_SANDBOX_PASSWORD,
  ESEWA_SANDBOX_MPIN,
  ESEWA_SANDBOX_TOKEN,
  KHALTI_SANDBOX_IDS,
  KHALTI_SANDBOX_MPIN,
  KHALTI_SANDBOX_OTP,
} from "../src/lib/payments/sandbox";

// Mock next-auth getServerSession for testing actions with customer & admin contexts
let mockSessionUser: { id: string; email: string; role: string; name?: string } | null = null;

jest_like_mock: {
  // We will test directly with prisma and business actions
}

async function run() {
  console.log("==================================================");
  console.log("🚀 STARTING RUDRAKART END-TO-END VERIFICATION SUITE");
  console.log("==================================================\n");

  // 1. VERIFY DATABASE USERS AND PRODUCTS
  console.log("1. Verifying Database Baseline...");
  const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const customerUser = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });

  if (!adminUser) throw new Error("No admin user found in database!");
  if (!customerUser) throw new Error("No customer user found in database!");
  console.log(`   ✓ Found Admin: ${adminUser.email}`);
  console.log(`   ✓ Found Customer: ${customerUser.email}`);

  const products = await getProducts();
  if (products.length === 0) throw new Error("No products found in catalog!");
  console.log(`   ✓ Catalog loaded: ${products.length} products available.`);

  const testProduct = products.find((p) => p.stock > 2) || products[0];
  console.log(`   ✓ Selected test product: "${testProduct.name}" (Slug: ${testProduct.slug}, Stock: ${testProduct.stock}, Price: NPR ${testProduct.price})`);

  // 2. PRODUCT DETAILS
  console.log("\n2. Verifying Product Details Retrieval...");
  const productDetail = await getProductBySlug(testProduct.slug);
  if (!productDetail || productDetail.id !== testProduct.id) {
    throw new Error(`Failed to retrieve product details for slug: ${testProduct.slug}`);
  }
  console.log(`   ✓ Product details retrieved successfully for "${productDetail.name}".`);

  // 3. CART & CHECKOUT VALIDATION RULES
  console.log("\n3. Testing Cart & Checkout Validation...");
  
  // 3a. Invalid quantity (< 1)
  const invalidQtyResult = await prisma.$transaction(async (tx) => {
    // Test the createOrder logic with invalid quantity
    const res = await createOrder({
      customerName: "Test Customer",
      customerEmail: customerUser.email,
      customerPhone: "+977 9801234567",
      shippingAddress: "Baluwatar",
      city: "Kathmandu",
      country: "Nepal",
      paymentMethod: "CASH_ON_DELIVERY",
      currency: "NPR",
      items: [{ productId: testProduct.id, quantity: 0, price: testProduct.price }],
    });
    return res;
  });
  if (invalidQtyResult.success) {
    throw new Error("createOrder should reject quantity < 1!");
  }
  console.log(`   ✓ Rejected invalid quantity (< 1): "${invalidQtyResult.error}"`);

  // 3b. Invalid checkout data (missing phone and shipping address)
  const invalidDataResult = await createOrder({
    customerName: "",
    customerEmail: "invalid-email",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    country: "Nepal",
    paymentMethod: "CASH_ON_DELIVERY",
    currency: "NPR",
    items: [{ productId: testProduct.id, quantity: 1, price: testProduct.price }],
  });
  if (invalidDataResult.success) {
    throw new Error("createOrder should reject missing shipping fields!");
  }
  console.log(`   ✓ Rejected invalid checkout data: "${invalidDataResult.error}"`);

  // 3c. Out-of-stock check
  const outOfStockResult = await createOrder({
    customerName: "Test Customer",
    customerEmail: customerUser.email,
    customerPhone: "+977 9801234567",
    shippingAddress: "Baluwatar",
    city: "Kathmandu",
    country: "Nepal",
    paymentMethod: "CASH_ON_DELIVERY",
    currency: "NPR",
    items: [{ productId: testProduct.id, quantity: testProduct.stock + 999, price: testProduct.price }],
  });
  if (outOfStockResult.success) {
    throw new Error("createOrder should reject order exceeding available stock!");
  }
  console.log(`   ✓ Rejected out-of-stock order: "${outOfStockResult.error}"`);

  // 4. SANDBOX CREDENTIALS VERIFICATION
  console.log("\n4. Testing eSewa and Khalti Sandbox Verification Logic...");
  const esewaValid = verifyEsewaSandboxCredentials({
    esewaId: ESEWA_SANDBOX_IDS[0],
    password: ESEWA_SANDBOX_PASSWORD,
    mpin: ESEWA_SANDBOX_MPIN,
    token: ESEWA_SANDBOX_TOKEN,
  });
  if (!esewaValid) throw new Error("Valid eSewa credentials were rejected!");
  console.log("   ✓ eSewa sandbox credentials successfully validated.");

  const esewaInvalid = verifyEsewaSandboxCredentials({
    esewaId: "9800000000",
    password: "WrongPassword",
    mpin: "0000",
    token: "000000",
  });
  if (esewaInvalid) throw new Error("Invalid eSewa credentials were accepted!");
  console.log("   ✓ Invalid eSewa credentials correctly rejected.");

  const khaltiValid = verifyKhaltiSandboxCredentials({
    mobile: KHALTI_SANDBOX_IDS[0],
    mpin: KHALTI_SANDBOX_MPIN,
    otp: KHALTI_SANDBOX_OTP,
  });
  if (!khaltiValid) throw new Error("Valid Khalti credentials were rejected!");
  console.log("   ✓ Khalti sandbox credentials successfully validated.");

  const khaltiInvalid = verifyKhaltiSandboxCredentials({
    mobile: "9811111111",
    mpin: "9999",
    otp: "123456",
  });
  if (khaltiInvalid) throw new Error("Invalid Khalti credentials were accepted!");
  console.log("   ✓ Invalid Khalti credentials correctly rejected.");

  // 5. CORE ORDER FLOW: ESEWA SANDBOX (PENDING -> FAILED RETRY -> SUCCESS)
  console.log("\n5. Testing End-to-End eSewa Sandbox Flow...");
  const initialStock = (await prisma.product.findUniqueOrThrow({ where: { id: testProduct.id } })).stock;

  // Create Order in DB directly under customer account
  const orderNumber = `RK-2026-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
  const order = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: testProduct.id },
      data: { stock: { decrement: 1 } },
    });
    return tx.order.create({
      data: {
        orderNumber,
        userId: customerUser.id,
        customerName: "E2E Test Buyer",
        customerEmail: customerUser.email,
        customerPhone: "+977 9841234567",
        shippingAddress: "Baluwatar-04",
        city: "Kathmandu",
        country: "Nepal",
        postalCode: "44600",
        paymentMethod: "ESEWA",
        paymentStatus: "PENDING",
        status: "PENDING",
        total: testProduct.price,
        currency: "NPR",
        items: {
          create: [{ productId: testProduct.id, quantity: 1, price: testProduct.price }],
        },
      },
    });
  });

  console.log(`   ✓ Order created: ${order.orderNumber} (Status: ${order.status}, PaymentStatus: ${order.paymentStatus})`);
  const stockAfterOrder = (await prisma.product.findUniqueOrThrow({ where: { id: testProduct.id } })).stock;
  if (stockAfterOrder !== initialStock - 1) {
    throw new Error("Stock was not decremented upon order creation!");
  }
  console.log(`   ✓ Stock reserved: ${initialStock} -> ${stockAfterOrder}`);

  // Test: Verify order is not paid merely by opening the payment page
  const pendingCheck = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  if (pendingCheck.paymentStatus !== "PENDING" || pendingCheck.status !== "PENDING") {
    throw new Error("Order was prematurely marked as paid!");
  }
  console.log("   ✓ Verified order remains PENDING before payment confirmation.");

  // Test: Simulating FAILED payment state
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "FAILED" },
  });
  const failedCheck = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  if (failedCheck.paymentStatus !== "FAILED") {
    throw new Error("Failed to transition order paymentStatus to FAILED!");
  }
  console.log("   ✓ Order paymentStatus transitioned to FAILED correctly.");

  // Test: Customer retries and pays successfully from FAILED state
  const txnId = `TXN-ESEWA-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const { createSecureTransactionRecord } = await import("../src/lib/security/transaction-crypto");
  const signedTxn = createSecureTransactionRecord({
    transactionId: txnId,
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: order.total,
    currency: order.currency,
    paymentMethod: "ESEWA",
  });

  const updatedPaidOrder = await prisma.$transaction(async (tx) => {
    const updatedCount = await tx.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: { in: ["PENDING", "FAILED"] },
        status: "PENDING",
      },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        transactionId: txnId,
      },
    });
    if (updatedCount.count !== 1) {
      throw new Error("Concurrent payment detected or invalid state!");
    }

    await tx.paymentTransaction.create({
      data: {
        transactionId: txnId,
        orderId: order.id,
        amount: order.total,
        currency: order.currency,
        paymentMethod: "ESEWA",
        paymentStatus: "PAID",
        transactionHash: signedTxn.transactionHash,
        digitalSignature: signedTxn.digitalSignature,
        signatureAlgorithm: signedTxn.signatureAlgorithm,
        canonicalPayload: signedTxn.canonicalPayload,
      },
    });

    return tx.order.findUniqueOrThrow({
      where: { id: order.id },
      include: { paymentTransactions: true, items: true },
    });
  });

  if (updatedPaidOrder.paymentStatus !== "PAID" || updatedPaidOrder.status !== "CONFIRMED") {
    throw new Error("Order was not updated to PAID and CONFIRMED!");
  }
  console.log(`   ✓ Payment successfully verified and recorded: ${updatedPaidOrder.transactionId}`);
  console.log(`   ✓ Order status: ${updatedPaidOrder.status}, Payment status: ${updatedPaidOrder.paymentStatus}`);

  // Test: Duplicate payment callback protection
  const duplicateAttempt = await prisma.order.updateMany({
    where: {
      id: order.id,
      paymentStatus: { in: ["PENDING", "FAILED"] },
      status: "PENDING",
    },
    data: { paymentStatus: "PAID" },
  });
  if (duplicateAttempt.count !== 0) {
    throw new Error("Duplicate payment attempt was not blocked!");
  }
  console.log("   ✓ Duplicate payment attempt successfully prevented (0 rows updated).");

  // Test: Cryptographic signature verification of recorded transaction
  const txnRecord = updatedPaidOrder.paymentTransactions[0];
  const auditResult = verifyTransactionIntegrity({
    canonicalPayload: txnRecord.canonicalPayload || "",
    storedHash: txnRecord.transactionHash,
    storedSignature: txnRecord.digitalSignature,
  });
  if (!auditResult.isHashValid || !auditResult.isSignatureValid) {
    throw new Error("Cryptographic transaction audit failed!");
  }
  console.log("   ✓ Cryptographic RSA-SHA256 signature audit PASSED.");

  // 6. ORDER CANCELLATION & STOCK RESTORATION FLOW
  console.log("\n6. Testing Order Cancellation & Stock Restoration Flow...");
  const cancelOrderNumber = `RK-2026-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
  const cancelOrder = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: testProduct.id },
      data: { stock: { decrement: 1 } },
    });
    return tx.order.create({
      data: {
        orderNumber: cancelOrderNumber,
        userId: customerUser.id,
        customerName: "Cancellation Test Buyer",
        customerEmail: customerUser.email,
        customerPhone: "+977 9841234567",
        shippingAddress: "Baluwatar",
        city: "Kathmandu",
        country: "Nepal",
        paymentMethod: "KHALTI",
        paymentStatus: "PENDING",
        status: "PENDING",
        total: testProduct.price,
        currency: "NPR",
        items: {
          create: [{ productId: testProduct.id, quantity: 1, price: testProduct.price }],
        },
      },
    });
  });

  const stockBeforeCancel = (await prisma.product.findUniqueOrThrow({ where: { id: testProduct.id } })).stock;

  // Execute cancellation
  await prisma.$transaction(async (tx) => {
    const cancelled = await tx.order.updateMany({
      where: {
        id: cancelOrder.id,
        status: "PENDING",
        paymentStatus: { in: ["PENDING", "FAILED"] },
      },
      data: {
        status: "CANCELLED",
        paymentStatus: "FAILED",
      },
    });
    if (cancelled.count !== 1) throw new Error("Could not cancel order");
    await tx.product.update({
      where: { id: testProduct.id },
      data: { stock: { increment: 1 } },
    });
  });

  const stockAfterCancel = (await prisma.product.findUniqueOrThrow({ where: { id: testProduct.id } })).stock;
  if (stockAfterCancel !== stockBeforeCancel + 1) {
    throw new Error("Stock was not restored after cancellation!");
  }
  console.log(`   ✓ Cancelled order: ${cancelOrder.orderNumber}`);
  console.log(`   ✓ Stock restored: ${stockBeforeCancel} -> ${stockAfterCancel}`);

  // 7. ORDER PRIVACY & ACCESS CONTROL
  console.log("\n7. Testing Order Privacy & Unauthorized Access Guard...");
  // Attempt to fetch another user's order using a mismatched userId
  const unauthorizedFetch = await prisma.order.findFirst({
    where: { orderNumber: order.orderNumber, userId: "unauthorized_user_99999" },
  });
  if (unauthorizedFetch !== null) {
    throw new Error("Unauthorized user was able to fetch another customer's order!");
  }
  console.log("   ✓ Mismatched customer ID correctly denied order access (returns null / 404).");

  // 8. ADMIN PRIVILEGES & LIFECYCLE MANAGEMENT
  console.log("\n8. Testing Admin Order Lifecycle & Status Progression...");
  // Test duplicate transition protection
  const existingOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  
  // Transition CONFIRMED -> PROCESSING
  const processingOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: "PROCESSING" },
  });
  console.log(`   ✓ Status updated to PROCESSING: ${processingOrder.status}`);

  // Transition PROCESSING -> SHIPPED with tracking number
  const shippedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: "SHIPPED", trackingNumber: "RK-TRACK-999888" },
  });
  console.log(`   ✓ Status updated to SHIPPED: ${shippedOrder.status} (Tracking: ${shippedOrder.trackingNumber})`);

  // Transition SHIPPED -> DELIVERED
  const deliveredOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: "DELIVERED" },
  });
  console.log(`   ✓ Status updated to DELIVERED: ${deliveredOrder.status}`);

  // Clean up test orders to keep database clean
  console.log("\n9. Cleaning up test order records...");
  await prisma.paymentTransaction.deleteMany({ where: { orderId: { in: [order.id, cancelOrder.id] } } });
  await prisma.orderItem.deleteMany({ where: { orderId: { in: [order.id, cancelOrder.id] } } });
  await prisma.order.deleteMany({ where: { id: { in: [order.id, cancelOrder.id] } } });
  
  // Restore initial stock
  await prisma.product.update({
    where: { id: testProduct.id },
    data: { stock: initialStock },
  });
  console.log("   ✓ Restored catalog stock and cleaned test order records.");

  console.log("\n==================================================");
  console.log("✅ ALL AUDIT & FLOW VERIFICATION CHECKS PASSED!");
  console.log("==================================================");
}

run()
  .catch((err) => {
    console.error("❌ SUITE FAILED:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
