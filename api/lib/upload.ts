import fs from "fs";
import path from "path";
import { env } from "./env";

export function getUploadDir(): string {
  if (env.isProduction) {
    return path.resolve(process.cwd(), "dist/public/uploads");
  }
  return path.resolve(process.cwd(), "public/uploads");
}

export function ensureUploadDir(): string {
  const dir = getUploadDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function generateFileName(originalName: string): string {
  const ext = path.extname(originalName) || ".bin";
  const base = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  return `${base}${ext}`;
}
