import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { biometrics, identityApplications } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export const biometricRouter = createRouter({
  getByApplicationId: publicQuery
    .input(z.object({ applicationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(biometrics)
        .where(eq(biometrics.applicationId, input.applicationId));
      return result[0] || null;
    }),

  capture: publicQuery
    .input(
      z.object({
        applicationId: z.number(),
        capturedBy: z.number(),
        deviceId: z.string().optional(),
        deviceName: z.string().optional(),
        deviceCertified: z.boolean().default(false),
        fingerprints: z.array(z.string()).optional(),
        leftIris: z.string().optional(),
        rightIris: z.string().optional(),
        facePhotoUrl: z.string().optional(),
        facePhotoData: z.string().optional(),
        livenessCheck: z.boolean().default(false),
        livenessScore: z.number().optional(),
        captureQuality: z.enum(["low", "medium", "high", "excellent"]).default("medium"),
        checksum: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const existing = await db
        .select()
        .from(biometrics)
        .where(eq(biometrics.applicationId, input.applicationId));

      const biometricData = {
        applicationId: input.applicationId,
        fingerprints: input.fingerprints ? JSON.stringify(input.fingerprints) : null,
        leftIris: input.leftIris || null,
        rightIris: input.rightIris || null,
        facePhotoUrl: input.facePhotoUrl || null,
        facePhotoData: input.facePhotoData || null,
        livenessCheck: input.livenessCheck,
        livenessScore: input.livenessScore?.toString() || null,
        deviceId: input.deviceId || `SIM-${nanoid(8)}`,
        deviceName: input.deviceName || "Simulated Biometric Device",
        deviceCertified: input.deviceCertified,
        captureQuality: input.captureQuality,
        isEncrypted: true,
        encryptionKey: `ENC-${nanoid(16)}`,
        checksum: input.checksum || `CHK-${nanoid(16)}`,
        capturedBy: input.capturedBy,
        capturedAt: new Date(),
      };

      if (existing.length > 0) {
        await db
          .update(biometrics)
          .set(biometricData)
          .where(eq(biometrics.applicationId, input.applicationId));

        await db
          .update(identityApplications)
          .set({
            biometricStatus: "captured",
            status: "biometric_captured",
          })
          .where(eq(identityApplications.id, input.applicationId));

        return { success: true, updated: true };
      }

      await db.insert(biometrics).values(biometricData);

      await db
        .update(identityApplications)
        .set({
          biometricStatus: "captured",
          status: "biometric_captured",
        })
        .where(eq(identityApplications.id, input.applicationId));

      return { success: true, updated: false };
    }),

  verify: publicQuery
    .input(
      z.object({
        applicationId: z.number(),
        verifiedBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(biometrics)
        .set({
          verifiedAt: new Date(),
        })
        .where(eq(biometrics.applicationId, input.applicationId));

      await db
        .update(identityApplications)
        .set({
          biometricStatus: "verified",
          status: "verification_pending",
        })
        .where(eq(identityApplications.id, input.applicationId));

      return { success: true };
    }),

  runDeduplicationCheck: publicQuery
    .input(z.object({ applicationId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const bio = await db
        .select()
        .from(biometrics)
        .where(eq(biometrics.applicationId, input.applicationId));

      if (bio.length === 0) {
        return { success: false, error: "No biometric data found" };
      }

      const allBiometrics = await db.select().from(biometrics);
      const isDuplicate = allBiometrics.some(
        (b) =>
          b.id !== bio[0].id &&
          b.applicationId !== input.applicationId &&
          b.fingerprints === bio[0].fingerprints
      );

      const result = isDuplicate ? "fail" : "pass";

      await db
        .update(biometrics)
        .set({
          deduplicationCheck: true,
          deduplicationResult: result,
        })
        .where(eq(biometrics.applicationId, input.applicationId));

      return { success: true, isDuplicate, result };
    }),

  stats: publicQuery
    .input(z.object({ authorityId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(biometrics);

      if (input?.authorityId) {
        const apps = await db
          .select({ id: identityApplications.id })
          .from(identityApplications)
          .where(eq(identityApplications.authorityId, input.authorityId));

        const appIds = apps.map((a) => a.id);
        if (appIds.length > 0) {
          query = db
            .select()
            .from(biometrics)
            .where(
              and(
                ...appIds.map((id) => eq(biometrics.applicationId, id))
              )
            );
        } else {
          return { total: 0, captured: 0, verified: 0, pending: 0 };
        }
      }

      const all = await query;

      return {
        total: all.length,
        captured: all.filter((b) => b.livenessCheck).length,
        verified: all.filter((b) => b.verifiedAt).length,
        pending: all.filter((b) => !b.verifiedAt).length,
      };
    }),
});
