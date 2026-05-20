import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { auditLogs } from "@db/schema";
import { desc, eq, and, like, count, gte, lte, asc } from "drizzle-orm";
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
    .orderBy(desc(auditLogs.createdAt))
    .limit(1);
  return lastLog[0]?.logHash || null;
}

export const auditRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(500).default(50),
          offset: z.number().default(0),
          userId: z.number().optional(),
          actionCategory: z.string().optional(),
          entityType: z.string().optional(),
          severity: z.string().optional(),
          success: z.boolean().optional(),
          search: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.userId) {
        conditions.push(eq(auditLogs.userId, input.userId));
      }

      if (input?.actionCategory) {
        conditions.push(eq(auditLogs.actionCategory, input.actionCategory as any));
      }

      if (input?.entityType) {
        conditions.push(eq(auditLogs.entityType, input.entityType));
      }

      if (input?.severity) {
        conditions.push(eq(auditLogs.severity, input.severity as any));
      }

      if (input?.success !== undefined) {
        conditions.push(eq(auditLogs.success, input.success));
      }

      if (input?.search) {
        conditions.push(
          like(auditLogs.action, `%${input.search}%`)
        );
      }

      if (input?.startDate) {
        conditions.push(gte(auditLogs.createdAt, new Date(input.startDate)));
      }

      if (input?.endDate) {
        conditions.push(lte(auditLogs.createdAt, new Date(input.endDate)));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const limit = input?.limit || 50;
      const offset = input?.offset || 0;

      const result = await db
        .select()
        .from(auditLogs)
        .where(where)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

      return result;
    }),

  create: publicQuery
    .input(
      z.object({
        userId: z.number(),
        userName: z.string().optional(),
        userRole: z.string().optional(),
        action: z.string(),
        actionCategory: z.enum([
          "authentication",
          "authority_management",
          "user_management",
          "enrollment",
          "document",
          "verification",
          "biometric",
          "card_issuance",
          "payment",
          "system",
          "api_access",
        ]),
        entityType: z.string().optional(),
        entityId: z.string().optional(),
        entityRef: z.string().optional(),
        details: z.string().optional(),
        metadata: z.record(z.any()).optional(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
        previousValue: z.record(z.any()).optional(),
        newValue: z.record(z.any()).optional(),
        severity: z.enum(["info", "warning", "error", "critical"]).default("info"),
        success: z.boolean().default(true),
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const previousHash = await getLastLogHash(db);

      const entry = {
        userId: input.userId,
        userName: input.userName || null,
        userRole: input.userRole || null,
        action: input.action,
        actionCategory: input.actionCategory,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        entityRef: input.entityRef || null,
        details: input.details || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        previousValue: input.previousValue ? JSON.stringify(input.previousValue) : null,
        newValue: input.newValue ? JSON.stringify(input.newValue) : null,
        severity: input.severity,
        success: input.success,
        errorMessage: input.errorMessage || null,
        previousLogHash: previousHash,
        createdAt: new Date(),
      };

      const logHash = generateLogHash(entry, previousHash);
      entry.logHash = logHash;

      const result = await db.insert(auditLogs).values(entry);
      return { id: Number(result[0].insertId), logHash, success: true };
    }),

  verifyIntegrity: publicQuery
    .input(
      z
        .object({
          startId: z.number().optional(),
          endId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.startId) {
        conditions.push(gte(auditLogs.id, input.startId));
      }

      if (input?.endId) {
        conditions.push(lte(auditLogs.id, input.endId));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const logs = await db
        .select()
        .from(auditLogs)
        .where(where)
        .orderBy(asc(auditLogs.id));

      let isValid = true;
      let previousHash: string | null = null;
      let brokenChainAt: number | null = null;

      for (const log of logs) {
        const expectedHash = generateLogHash(
          {
            userId: log.userId,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            createdAt: log.createdAt,
          },
          previousHash
        );

        if (log.logHash !== expectedHash) {
          isValid = false;
          brokenChainAt = log.id;
          break;
        }

        previousHash = log.logHash;
      }

      return {
        isValid,
        totalLogs: logs.length,
        brokenChainAt,
        lastHash: previousHash,
      };
    }),

  stats: publicQuery
    .input(
      z
        .object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.startDate) {
        conditions.push(gte(auditLogs.createdAt, new Date(input.startDate)));
      }

      if (input?.endDate) {
        conditions.push(lte(auditLogs.createdAt, new Date(input.endDate)));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const totalLogs = await db
        .select({ count: count() })
        .from(auditLogs)
        .where(where);

      const byCategory = await db
        .select({
          category: auditLogs.actionCategory,
          count: count(),
        })
        .from(auditLogs)
        .where(where)
        .groupBy(auditLogs.actionCategory);

      const bySeverity = await db
        .select({
          severity: auditLogs.severity,
          count: count(),
        })
        .from(auditLogs)
        .where(where)
        .groupBy(auditLogs.severity);

      const failedActions = await db
        .select({ count: count() })
        .from(auditLogs)
        .where(and(where, eq(auditLogs.success, false)));

      return {
        total: totalLogs[0]?.count || 0,
        byCategory,
        bySeverity,
        failedActions: failedActions[0]?.count || 0,
      };
    }),

  export: publicQuery
    .input(
      z.object({
        format: z.enum(["json", "csv"]).default("json"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        actionCategory: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.startDate) {
        conditions.push(gte(auditLogs.createdAt, new Date(input.startDate)));
      }

      if (input?.endDate) {
        conditions.push(lte(auditLogs.createdAt, new Date(input.endDate)));
      }

      if (input?.actionCategory) {
        conditions.push(eq(auditLogs.actionCategory, input.actionCategory as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const logs = await db
        .select()
        .from(auditLogs)
        .where(where)
        .orderBy(desc(auditLogs.createdAt));

      if (input.format === "csv") {
        const headers = [
          "ID",
          "Timestamp",
          "User",
          "Role",
          "Action",
          "Category",
          "Entity",
          "Entity ID",
          "Severity",
          "Success",
          "IP Address",
          "Details",
        ];

        const rows = logs.map((log) => [
          log.id,
          log.createdAt?.toISOString() || "",
          log.userName || "",
          log.userRole || "",
          log.action,
          log.actionCategory,
          log.entityType || "",
          log.entityId || "",
          log.severity,
          log.success ? "Yes" : "No",
          log.ipAddress || "",
          (log.details || "").replace(/"/g, '""'),
        ]);

        const csvContent = [
          headers.join(","),
          ...rows.map((row) =>
            row.map((cell) => `"${cell}"`).join(",")
          ),
        ].join("\n");

        return { format: "csv", content: csvContent };
      }

      return { format: "json", content: JSON.stringify(logs, null, 2) };
    }),

  recentActivity: publicQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit || 20;

      const result = await db
        .select({
          id: auditLogs.id,
          userId: auditLogs.userId,
          userName: auditLogs.userName,
          userRole: auditLogs.userRole,
          action: auditLogs.action,
          actionCategory: auditLogs.actionCategory,
          entityType: auditLogs.entityType,
          entityId: auditLogs.entityId,
          severity: auditLogs.severity,
          success: auditLogs.success,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit);

      return result;
    }),
});
