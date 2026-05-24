import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { payments, identityApplications } from "@db/schema";
import { eq, and, like, count } from "drizzle-orm";
import { nanoid } from "nanoid";

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = nanoid(8).toUpperCase();
  return `INV-${year}-${random}`;
}

export const paymentRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          applicationId: z.number().optional(),
          status: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.applicationId) {
        conditions.push(eq(payments.applicationId, input.applicationId));
      }

      if (input?.status) {
        conditions.push(eq(payments.status, input.status as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(payments)
        .where(where)
        .orderBy(payments.createdAt);

      return result;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.id, input.id));
      return result[0] || null;
    }),

  getByApplicationId: publicQuery
    .input(z.object({ applicationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(payments)
        .where(eq(payments.applicationId, input.applicationId));
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        applicationId: z.number(),
        amount: z.number().positive(),
        currency: z.string().default("USD"),
        paymentMethod: z
          .enum(["cash", "card", "upi", "bank_transfer", "online", "government_voucher"])
          .default("cash"),
        notes: z.string().optional(),
        transactionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const invoiceNumber = generateInvoiceNumber();

      const result = await db.insert(payments).values({
        applicationId: input.applicationId,
        invoiceNumber,
        amount: input.amount.toString(),
        currency: input.currency,
        paymentMethod: input.paymentMethod,
        status: "pending",
        notes: input.notes || null,
        transactionId: input.transactionId || null,
      });

      await db
        .update(identityApplications)
        .set({
          paymentAmount: input.amount.toString(),
          paymentStatus: "pending",
          status: "payment_pending",
        })
        .where(eq(identityApplications.id, input.applicationId));

      return {
        id: Number(result[0].insertId),
        invoiceNumber,
        success: true,
      };
    }),

  processPayment: publicQuery
    .input(
      z.object({
        paymentId: z.number(),
        transactionId: z.string().optional(),
        gatewayReference: z.string().optional(),
        gatewayResponse: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.id, input.paymentId));

      if (payment.length === 0) {
        return { success: false, error: "Payment not found" };
      }

      await db
        .update(payments)
        .set({
          status: "completed",
          transactionId: input.transactionId || `TXN-${nanoid(12)}`,
          gatewayReference: input.gatewayReference || null,
          gatewayResponse: input.gatewayResponse ? JSON.stringify(input.gatewayResponse) : null,
          paidAt: new Date(),
        })
        .where(eq(payments.id, input.paymentId));

      await db
        .update(identityApplications)
        .set({
          paymentStatus: "completed",
          status: "payment_completed",
        })
        .where(eq(identityApplications.id, payment[0].applicationId));

      return { success: true };
    }),

  simulatePayment: publicQuery
    .input(
      z.object({
        paymentId: z.number(),
        success: z.boolean().default(true),
        failureReason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.id, input.paymentId));

      if (payment.length === 0) {
        return { success: false, error: "Payment not found" };
      }

      if (input.success) {
        await db
          .update(payments)
          .set({
            status: "completed",
            transactionId: `TXN-SIM-${nanoid(12)}`,
            gatewayReference: `GW-SIM-${nanoid(8)}`,
            gatewayResponse: JSON.stringify({
              status: "success",
              message: "Payment processed successfully (simulated)",
              timestamp: new Date().toISOString(),
            }),
            paidAt: new Date(),
          })
          .where(eq(payments.id, input.paymentId));

        await db
          .update(identityApplications)
          .set({
            paymentStatus: "completed",
            status: "payment_completed",
          })
          .where(eq(identityApplications.id, payment[0].applicationId));
      } else {
        await db
          .update(payments)
          .set({
            status: "failed",
            failureReason: input.failureReason || "Payment simulation failed",
            gatewayResponse: JSON.stringify({
              status: "failed",
              message: input.failureReason || "Payment failed (simulated)",
              timestamp: new Date().toISOString(),
            }),
          })
          .where(eq(payments.id, input.paymentId));
      }

      return { success: true };
    }),

  refund: publicQuery
    .input(
      z.object({
        paymentId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(payments)
        .set({
          status: "refunded",
          refundedAt: new Date(),
          refundReason: input.reason,
        })
        .where(eq(payments.id, input.paymentId));

      return { success: true };
    }),

  generateReceipt: publicQuery
    .input(z.object({ paymentId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.id, input.paymentId));

      if (payment.length === 0) {
        return { success: false, error: "Payment not found" };
      }

      const receiptUrl = `/receipts/${payment[0].invoiceNumber}.pdf`;

      await db
        .update(payments)
        .set({ receiptUrl })
        .where(eq(payments.id, input.paymentId));

      return { success: true, receiptUrl };
    }),

  stats: publicQuery
    .input(
      z
        .object({
          authorityId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(payments);

      if (input?.authorityId) {
        const apps = await db
          .select({ id: identityApplications.id })
          .from(identityApplications)
          .where(eq(identityApplications.authorityId, input.authorityId));

        const appIds = apps.map((a) => a.id);
        if (appIds.length > 0) {
          query = db
            .select()
            .from(payments)
            .where(
              and(...appIds.map((id) => eq(payments.applicationId, id)))
            );
        } else {
          return {
            total: 0,
            completed: 0,
            pending: 0,
            failed: 0,
            refunded: 0,
            totalAmount: 0,
          };
        }
      }

      const all = await query;

      const totalAmount = all
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      return {
        total: all.length,
        completed: all.filter((p) => p.status === "completed").length,
        pending: all.filter((p) => p.status === "pending").length,
        failed: all.filter((p) => p.status === "failed").length,
        refunded: all.filter((p) => p.status === "refunded").length,
        totalAmount,
      };
    }),
});
