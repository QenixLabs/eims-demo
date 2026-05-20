import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  authorities,
  identityApplications,
  identityCards,
  platformUsers,
} from "@db/schema";
import { count, eq, sql, and } from "drizzle-orm";

export const dashboardRouter = createRouter({
  superAdmin: publicQuery.query(async () => {
    const db = getDb();

    const totalAuthorities = await db
      .select({ count: count() })
      .from(authorities);
    const totalApplications = await db
      .select({ count: count() })
      .from(identityApplications);
    const totalCards = await db
      .select({ count: count() })
      .from(identityCards);
    const totalUsers = await db
      .select({ count: count() })
      .from(platformUsers);

    const statusBreakdown = await db
      .select({
        status: identityApplications.status,
        count: count(),
      })
      .from(identityApplications)
      .groupBy(identityApplications.status);

    return {
      totalAuthorities: totalAuthorities[0]?.count || 0,
      totalApplications: totalApplications[0]?.count || 0,
      totalCards: totalCards[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      statusBreakdown,
    };
  }),

  authorityAdmin: publicQuery
    .input(z.object({ authorityId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();

      const totalApplications = await db
        .select({ count: count() })
        .from(identityApplications)
        .where(
          eq(identityApplications.authorityId, input.authorityId)
        );

      const pendingApprovals = await db
        .select({ count: count() })
        .from(identityApplications)
        .where(
          and(
            eq(identityApplications.authorityId, input.authorityId),
            eq(identityApplications.status, "submitted")
          )
        );

      const approvedApplications = await db
        .select({ count: count() })
        .from(identityApplications)
        .where(
          and(
            eq(identityApplications.authorityId, input.authorityId),
            eq(identityApplications.status, "approved")
          )
        );

      const rejectedApplications = await db
        .select({ count: count() })
        .from(identityApplications)
        .where(
          and(
            eq(identityApplications.authorityId, input.authorityId),
            eq(identityApplications.status, "rejected")
          )
        );

      const issuedCards = await db
        .select({ count: count() })
        .from(identityApplications)
        .where(
          and(
            eq(identityApplications.authorityId, input.authorityId),
            eq(identityApplications.status, "issued")
          )
        );

      return {
        totalApplications: totalApplications[0]?.count || 0,
        pendingApprovals: pendingApprovals[0]?.count || 0,
        approvedApplications: approvedApplications[0]?.count || 0,
        rejectedApplications: rejectedApplications[0]?.count || 0,
        issuedCards: issuedCards[0]?.count || 0,
      };
    }),

  overview: publicQuery.query(async () => {
    const db = getDb();

    const approvedCount = await db
      .select({ count: count() })
      .from(identityApplications)
      .where(eq(identityApplications.status, "approved"));

    const rejectedCount = await db
      .select({ count: count() })
      .from(identityApplications)
      .where(eq(identityApplications.status, "rejected"));

    const recentApplications = await db
      .select({
        id: identityApplications.id,
        fullName: identityApplications.fullName,
        status: identityApplications.status,
        createdAt: identityApplications.createdAt,
      })
      .from(identityApplications)
      .orderBy(sql`${identityApplications.createdAt} DESC`)
      .limit(10);

    return {
      approved: approvedCount[0]?.count || 0,
      rejected: rejectedCount[0]?.count || 0,
      recentApplications,
    };
  }),
});
