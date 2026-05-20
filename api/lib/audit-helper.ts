import { getDb } from "../queries/connection";
import { auditLogs } from "@db/schema";
import { createHash } from "crypto";

function generateLogHash(entry: any, previousHash: string | null): string {
  const content = JSON.stringify({
    userId: entry.userId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    timestamp: entry.createdAt?.toISOString() || new Date().toISOString(),
    previousHash,
  });
  return createHash("sha256").update(content).digest("hex");
}

async function getLastLogHash(db: any): Promise<string | null> {
  const lastLog = await db
    .select({ logHash: auditLogs.logHash })
    .from(auditLogs)
    .orderBy(auditLogs.createdAt)
    .limit(1);
  return lastLog[0]?.logHash || null;
}

export async function createAuditLog(data: {
  userId: number;
  userName?: string;
  userRole?: string;
  action: string;
  actionCategory:
    | "authentication"
    | "authority_management"
    | "user_management"
    | "enrollment"
    | "document"
    | "verification"
    | "biometric"
    | "card_issuance"
    | "payment"
    | "system"
    | "api_access";
  entityType?: string;
  entityId?: string;
  entityRef?: string;
  details?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  severity?: "info" | "warning" | "error" | "critical";
  success?: boolean;
  errorMessage?: string;
}): Promise<number> {
  const db = getDb();
  const previousHash = await getLastLogHash(db);

  const entry = {
    userId: data.userId,
    userName: data.userName || null,
    userRole: data.userRole || null,
    action: data.action,
    actionCategory: data.actionCategory,
    entityType: data.entityType || null,
    entityId: data.entityId || null,
    entityRef: data.entityRef || null,
    details: data.details || null,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    ipAddress: data.ipAddress || null,
    userAgent: data.userAgent || null,
    previousValue: data.previousValue ? JSON.stringify(data.previousValue) : null,
    newValue: data.newValue ? JSON.stringify(data.newValue) : null,
    severity: data.severity || "info",
    success: data.success !== false,
    errorMessage: data.errorMessage || null,
    previousLogHash: previousHash,
    createdAt: new Date(),
  };

  const logHash = generateLogHash(entry, previousHash);

  const result = await db.insert(auditLogs).values({
    ...entry,
    logHash,
  });

  return Number(result[0].insertId);
}

export function getActionCategory(action: string): any {
  const actionLower = action.toLowerCase();
  if (actionLower.includes("login") || actionLower.includes("logout") || actionLower.includes("auth")) {
    return "authentication";
  }
  if (actionLower.includes("authority")) {
    return "authority_management";
  }
  if (actionLower.includes("user") || actionLower.includes("platform")) {
    return "user_management";
  }
  if (actionLower.includes("enroll") || actionLower.includes("application") || actionLower.includes("submit")) {
    return "enrollment";
  }
  if (actionLower.includes("document") || actionLower.includes("upload")) {
    return "document";
  }
  if (actionLower.includes("verif") || actionLower.includes("approv") || actionLower.includes("reject")) {
    return "verification";
  }
  if (actionLower.includes("biometric") || actionLower.includes("fingerprint") || actionLower.includes("iris")) {
    return "biometric";
  }
  if (actionLower.includes("card") || actionLower.includes("issue") || actionLower.includes("print")) {
    return "card_issuance";
  }
  if (actionLower.includes("payment") || actionLower.includes("invoice") || actionLower.includes("refund")) {
    return "payment";
  }
  if (actionLower.includes("api") || actionLower.includes("key")) {
    return "api_access";
  }
  return "system";
}
