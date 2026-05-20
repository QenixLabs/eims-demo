import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { authorities } from "@db/schema";
import { eq, count, like, or, and } from "drizzle-orm";
import { nanoid } from "nanoid";

function generateUniqueAuthorityId(): string {
  const year = new Date().getFullYear();
  const random = nanoid(8).toUpperCase();
  return `AUTH-${year}-${random}`;
}

export const authorityRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          isActive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.search) {
        conditions.push(
          or(
            like(authorities.authorityName, `%${input.search}%`),
            like(authorities.authorityCode, `%${input.search}%`),
            like(authorities.uniqueAuthorityId, `%${input.search}%`),
            like(authorities.email, `%${input.search}%`)
          )
        );
      }

      if (input?.isActive !== undefined) {
        conditions.push(eq(authorities.isActive, input.isActive));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(authorities)
        .where(where)
        .orderBy(authorities.createdAt);

      return result;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(authorities)
        .where(eq(authorities.id, input.id));
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        authorityName: z.string().min(1),
        authorityCode: z.string().min(1),
        registrationNumber: z.string().optional(),
        address: z.string().optional(),
        contactNumber: z.string().optional(),
        email: z.string().email().optional(),
        digitalSignature: z.string().optional(),
        signatureImageUrl: z.string().optional(),
        signingCertificate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const uniqueAuthorityId = generateUniqueAuthorityId();
      const result = await db.insert(authorities).values({
        uniqueAuthorityId,
        authorityName: input.authorityName,
        authorityCode: input.authorityCode,
        registrationNumber: input.registrationNumber || null,
        address: input.address || null,
        contactNumber: input.contactNumber || null,
        email: input.email || null,
        digitalSignature: input.digitalSignature || null,
        signatureImageUrl: input.signatureImageUrl || null,
        signingCertificate: input.signingCertificate || null,
      });
      return { id: Number(result[0].insertId), uniqueAuthorityId, success: true };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        authorityName: z.string().min(1).optional(),
        authorityCode: z.string().min(1).optional(),
        registrationNumber: z.string().optional(),
        address: z.string().optional(),
        contactNumber: z.string().optional(),
        email: z.string().email().optional(),
        digitalSignature: z.string().optional(),
        signatureImageUrl: z.string().optional(),
        signingCertificate: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(authorities)
        .set(data)
        .where(eq(authorities.id, id));
      return { success: true };
    }),

  uploadSignature: publicQuery
    .input(
      z.object({
        id: z.number(),
        signatureImageUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(authorities)
        .set({ signatureImageUrl: input.signatureImageUrl })
        .where(eq(authorities.id, input.id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(authorities).where(eq(authorities.id, input.id));
      return { success: true };
    }),

  toggleStatus: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(authorities)
        .where(eq(authorities.id, input.id));
      if (existing.length === 0) return { success: false };
      await db
        .update(authorities)
        .set({ isActive: !existing[0].isActive })
        .where(eq(authorities.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const totalAuthorities = await db
      .select({ count: count() })
      .from(authorities);
    const activeAuthorities = await db
      .select({ count: count() })
      .from(authorities)
      .where(eq(authorities.isActive, true));
    return {
      total: totalAuthorities[0]?.count || 0,
      active: activeAuthorities[0]?.count || 0,
    };
  }),
});
