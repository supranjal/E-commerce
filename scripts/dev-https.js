const fs = require("node:fs");
const https = require("node:https");
const next = require("next");
const { ensureLocalCertificates } = require("./setup-local-tls");

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOST || "localhost";

try {
  const { certificatePath, privateKeyPath } = ensureLocalCertificates();
  process.env.NEXT_PUBLIC_LOCAL_HTTPS = "true";

  const app = next({ dev: true, hostname, port });
  const requestHandler = app.getRequestHandler();

  app.prepare().then(() => {
    const server = https.createServer(
      {
        cert: fs.readFileSync(certificatePath),
        key: fs.readFileSync(privateKeyPath),
      },
      requestHandler
    );

    server.on("upgrade", app.getUpgradeHandler());
    server.listen(port, hostname, () => {
      console.log(`> RudraKart local HTTPS: https://${hostname}:${port}`);
      console.log("> Development-only TLS demonstration; press Ctrl+C to stop.");
    });
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}