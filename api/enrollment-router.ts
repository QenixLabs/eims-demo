import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  identityApplications,
  documents,
  identityCards,
  authorities,
} from "@db/schema";
import {
  eq,
  and,
  or,
  like,
  count,
  desc,
} from "drizzle-orm";

export const enrollmentRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          status: z.string().optional(),
          authorityId: z.number().optional(),
          createdBy: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.search) {
        conditions.push(
          or(
            like(identityApplications.firstName, `%${input.search}%`),
            like(identityApplications.lastName, `%${input.search}%`),
            like(identityApplications.identityNumber, `%${input.search}%`),
            like(identityApplications.mobileNumber, `%${input.search}%`)
          )
        );
      }

      if (input?.status) {
        conditions.push(
          eq(identityApplications.status, input.status as any)
        );
      }

      if (input?.authorityId) {
        conditions.push(
          eq(identityApplications.authorityId, input.authorityId)
        );
      }

      if (input?.createdBy) {
        conditions.push(
          eq(identityApplications.createdBy, input.createdBy)
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select({
          id: identityApplications.id,
          identityNumber: identityApplications.identityNumber,
          firstName: identityApplications.firstName,
          middleName: identityApplications.middleName,
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
        .where(where)
        .orderBy(desc(identityApplications.createdAt));

      return result;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const application = await db
        .select()
        .from(identityApplications)
        .where(eq(identityApplications.id, input.id));

      if (application.length === 0) return null;

      const docs = await db
        .select()
        .from(documents)
        .where(eq(documents.applicationId, input.id));

      const card = await db
        .select()
        .from(identityCards)
        .where(eq(identityCards.applicationId, input.id));

      return {
        ...application[0],
        documents: docs,
        identityCard: card[0] || null,
      };
    }),

  create: publicQuery
    .input(
      z.object({
        firstName: z.string().min(1),
        middleName: z.string().optional(),
        lastName: z.string().min(1),
        dateOfBirth: z.string().min(1),
        gender: z.enum(["Male", "Female", "Other"]),
        bloodGroup: z.string().optional(),
        nationality: z.string().min(1),
        maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]).optional(),
        educationLevel: z.string().optional(),
        profession: z.string().optional(),
        professionalAddress: z.string().optional(),
        mobileNumber: z.string().min(1),
        email: z.string().email().optional(),
        address: z.string().min(1),
        photoUrl: z.string().optional(),
        authorityId: z.number(),
        createdBy: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db
        .insert(identityApplications)
        .values({
          firstName: input.firstName,
          middleName: input.middleName || null,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          bloodGroup: input.bloodGroup || null,
          nationality: input.nationality,
          maritalStatus: input.maritalStatus || null,
          educationLevel: input.educationLevel || null,
          profession: input.profession || null,
          professionalAddress: input.professionalAddress || null,
          mobileNumber: input.mobileNumber,
          email: input.email || null,
          address: input.address,
          photoUrl: input.photoUrl || null,
          authorityId: input.authorityId,
          createdBy: input.createdBy,
          status: "draft",
        });
      return { id: Number(result[0].insertId), success: true };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().min(1).optional(),
        middleName: z.string().optional(),
        lastName: z.string().min(1).optional(),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["Male", "Female", "Other"]).optional(),
        bloodGroup: z.string().optional(),
        nationality: z.string().optional(),
        maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]).optional(),
        educationLevel: z.string().optional(),
        profession: z.string().optional(),
        professionalAddress: z.string().optional(),
        mobileNumber: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) updateData[key] = value;
      }

      if (Object.keys(updateData).length > 0) {
        await db
          .update(identityApplications)
          .set(updateData)
          .where(eq(identityApplications.id, id));
      }
      return { success: true };
    }),

  submit: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(identityApplications)
        .set({ status: "submitted" })
        .where(eq(identityApplications.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(documents)
        .where(eq(documents.applicationId, input.id));
      await db
        .delete(identityApplications)
        .where(eq(identityApplications.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db
      .select({ count: count() })
      .from(identityApplications);
    const byStatus = await db
      .select({
        status: identityApplications.status,
        count: count(),
      })
      .from(identityApplications)
      .groupBy(identityApplications.status);

    return {
      total: total[0]?.count || 0,
      byStatus,
    };
  }),
});
