import crypto from "crypto";

/**
 * Script to generate RSA 2048-bit keypair for transaction digital signatures.
 * Outputs both raw PEM and Base64-encoded strings for deployment convenience.
 */
function generateKeypair() {
  console.log("🔐 Generating 2048-bit RSA Keypair for RudraKart Transaction Security...\n");

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

  const privateBase64 = Buffer.from(privateKey).toString("base64");
  const publicBase64 = Buffer.from(publicKey).toString("base64");

  console.log("=== Base64 Format (Recommended for Vercel & .env single-line) ===");
  console.log(`TRANSACTION_SIGNING_PRIVATE_KEY="${privateBase64}"\n`);
  console.log(`TRANSACTION_SIGNING_PUBLIC_KEY="${publicBase64}"\n`);

  console.log("=== Raw PEM Format ===");
  console.log("--- PUBLIC KEY ---");
  console.log(publicKey);
  console.log("--- PRIVATE KEY (KEEP SECRET! NEVER COMMIT TO GIT) ---");
  console.log(privateKey);
}

generateKeypair();
