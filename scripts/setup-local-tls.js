const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const certificateDirectory = path.join(__dirname, "..", ".local-certs");
const certificatePath = path.join(certificateDirectory, "localhost.pem");
const privateKeyPath = path.join(certificateDirectory, "localhost-key.pem");

function ensureLocalCertificates() {
   if (fs.existsSync(certificatePath) && fs.existsSync(privateKeyPath)) {
      return { certificatePath, privateKeyPath };
   }

   fs.mkdirSync(certificateDirectory, { recursive: true });

   try {
      execFileSync("mkcert", ["-version"], { stdio: "ignore" });
   } catch {
      throw new Error(
         "mkcert is required for local HTTPS. On Windows install it with " +
            '`winget install FiloSottile.mkcert` (or `choco install mkcert`), then run `mkcert -install` and retry.'
      );
   }

   console.log("Generating locally trusted localhost certificate with mkcert...");
   execFileSync(
      "mkcert",
      [
         "-cert-file",
         certificatePath,
         "-key-file",
         privateKeyPath,
         "localhost",
         "127.0.0.1",
         "::1",
      ],
      { stdio: "inherit" }
   );

   return { certificatePath, privateKeyPath };
}

if (require.main === module) {
   try {
      ensureLocalCertificates();
      console.log("Local HTTPS certificate is ready in .local-certs/.");
   } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
   }
}

module.exports = { ensureLocalCertificates };
