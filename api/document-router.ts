import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { documents } from "@db/schema";
import { eq } from "drizzle-orm";

export const documentRouter = createRouter({
  list: publicQuery
    .input(z.object({ applicationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(documents)
        .where(eq(documents.applicationId, input.applicationId));
      return result;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(documents)
        .where(eq(documents.id, input.id));
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        applicationId: z.number(),
        fileUrl: z.string(),
        fileName: z.string(),
        documentType: z.enum([
          "driver_license",
          "voter_id",
          "passport",
          "address_proof",
          "utility_bill",
          "photo",
          "other",
        ]),
        fileSize: z.number().optional(),
        mimeType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(documents).values({
        applicationId: input.applicationId,
        fileUrl: input.fileUrl,
        fileName: input.fileName,
        documentType: input.documentType,
        fileSize: input.fileSize || null,
        mimeType: input.mimeType || null,
      });
      return { id: Number(result[0].insertId), success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(documents).where(eq(documents.id, input.id));
      return { success: true };
    }),
});
