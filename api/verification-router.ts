import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { identityApplications, documents, authorities } from "@db/schema";
import { eq, and, or, like, desc, count } from "drizzle-orm";

export const verificationRouter = createRouter({
  listPending: publicQuery
    .input(
      z
        .object({
          authorityId: z.number().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [
        or(
          eq(identityApplications.status, "submitted"),
          eq(identityApplications.status, "under_review"),
          eq(identityApplications.status, "correction_requested")
        ),
      ];

      if (input?.authorityId) {
        conditions.push(
          eq(identityApplications.authorityId, input.authorityId)
        );
      }

      if (input?.search) {
        conditions.push(
          or(
            like(identityApplications.firstName, `%${input.search}%`),
            like(identityApplications.lastName, `%${input.search}%`),
            like(identityApplications.identityNumber, `%${input.search}%`)
          )
        );
      }

      const result = await db
        .select({
          id: identityApplications.id,
          identityNumber: identityApplications.identityNumber,
          firstName: identityApplications.firstName,
          lastName: identityApplications.lastName,
          dateOfBirth: identityApplications.dateOfBirth,
          gender: identityApplications.gender,
          bloodGroup: identityApplications.bloodGroup,
          nationality: identityApplications.nationality,
          mobileNumber: identityApplications.mobileNumber,
          email: identityApplications.email,
          address: identityApplications.address,
          photoUrl: identityApplications.photoUrl,
          status: identityApplications.status,
          authorityId: identityApplications.authorityId,
          createdBy: identityApplications.createdBy,
          verifiedBy: identityApplications.verifiedBy,
          remarks: identityApplications.remarks,
          createdAt: identityApplications.createdAt,
          updatedAt: identityApplications.updatedAt,
          authorityName: authorities.authorityName,
        })
        .from(identityApplications)
        .leftJoin(
          authorities,
          eq(identityApplications.authorityId, authorities.id)
        )
        .where(and(...conditions))
        .orderBy(desc(identityApplications.createdAt));

      return result;
    }),

  getForReview: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const application = await db
        .select({
          id: identityApplications.id,
          identityNumber: identityApplications.identityNumber,
          firstName: identityApplications.firstName,
          lastName: identityApplications.lastName,
          dateOfBirth: identityApplications.dateOfBirth,
          gender: identityApplications.gender,
          bloodGroup: identityApplications.bloodGroup,
          nationality: identityApplications.nationality,
          mobileNumber: identityApplications.mobileNumber,
          email: identityApplications.email,
          address: identityApplications.address,
          photoUrl: identityApplications.photoUrl,
          status: identityApplications.status,
          authorityId: identityApplications.authorityId,
          createdBy: identityApplications.createdBy,
          verifiedBy: identityApplications.verifiedBy,
          remarks: identityApplications.remarks,
          createdAt: identityApplications.createdAt,
          updatedAt: identityApplications.updatedAt,
          authorityName: authorities.authorityName,
        })
        .from(identityApplications)
        .leftJoin(
          authorities,
          eq(identityApplications.authorityId, authorities.id)
        )
        .where(eq(identityApplications.id, input.id));

      if (application.length === 0) return null;

      const docs = await db
        .select()
        .from(documents)
        .where(eq(documents.applicationId, input.id));

      return {
        ...application[0],
        documents: docs,
      };
    }),

  startReview: publicQuery
    .input(
      z.object({
        id: z.number(),
        verifiedBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(identityApplications)
        .set({
          status: "under_review",
          verifiedBy: input.verifiedBy,
        })
        .where(eq(identityApplications.id, input.id));
      return { success: true };
    }),

  approve: publicQuery
    .input(
      z.object({
        id: z.number(),
        verifiedBy: z.number(),
        remarks: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(identityApplications)
        .set({
          status: "approved",
          verifiedBy: input.verifiedBy,
          remarks: input.remarks || null,
        })
        .where(eq(identityApplications.id, input.id));
      return { success: true };
    }),

  reject: publicQuery
    .input(
      z.object({
        id: z.number(),
        verifiedBy: z.number(),
        remarks: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(identityApplications)
        .set({
          status: "rejected",
          verifiedBy: input.verifiedBy,
          remarks: input.remarks,
        })
        .where(eq(identityApplications.id, input.id));
      return { success: true };
    }),

  requestCorrection: publicQuery
    .input(
      z.object({
        id: z.number(),
        verifiedBy: z.number(),
        remarks: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(identityApplications)
        .set({
          status: "correction_requested",
          verifiedBy: input.verifiedBy,
          remarks: input.remarks,
        })
        .where(eq(identityApplications.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const pending = await db
      .select({ count: count() })
      .from(identityApplications)
      .where(
        or(
          eq(identityApplications.status, "submitted"),
          eq(identityApplications.status, "under_review")
        )
      );
    const approved = await db
      .select({ count: count() })
      .from(identityApplications)
      .where(eq(identityApplications.status, "approved"));
    const rejected = await db
      .select({ count: count() })
      .from(identityApplications)
      .where(eq(identityApplications.status, "rejected"));
    return {
      pending: pending[0]?.count || 0,
      approved: approved[0]?.count || 0,
      rejected: rejected[0]?.count || 0,
    };
  }),
});
