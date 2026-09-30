import fs from "fs";
import path from "path";

function getDevBootId(): string {
  if (process.env.NODE_ENV === "production") {
    return "production";
  }

  const filePath = path.join(process.cwd(), ".next", ".dev-boot-id");
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8").trim();
    }
    const newId = `dev_${Date.now()}`;
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, newId, "utf-8");
    return newId;
  } catch {
    return "dev_default";
  }
}

export const SERVER_BOOT_ID = getDevBootId();
