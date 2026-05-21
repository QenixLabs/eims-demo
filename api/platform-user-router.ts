import { z } from "zod";
import * as cookie from "cookie";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { platformUsers } from "@db/schema";
import { eq, like, or, and, count } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { getSessionCookieOptions } from "./lib/cookies";
import { signSessionToken } from "./kimi/session";
import { env } from "./lib/env";
import { Session } from "@contracts/constants";

export const platformUserRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          authorityId: z.number().optional(),
          role: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.search) {
        conditions.push(
          or(
            like(platformUsers.name, `%${input.search}%`),
            like(platformUsers.email, `%${input.search}%`)
          )
        );
      }

      if (input?.authorityId) {
        conditions.push(
          eq(platformUsers.authorityId, input.authorityId)
        );
      }

      if (input?.role) {
        conditions.push(eq(platformUsers.role, input.role as any));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(platformUsers)
        .where(where)
        .orderBy(platformUsers.createdAt);

      return result.map((u) => ({ ...u, password: undefined }));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(platformUsers)
        .where(eq(platformUsers.id, input.id));
      if (result[0]) {
        const { password, ...user } = result[0];
        return user;
      }
      return null;
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum([
          "operator",
          "verification_officer",
          "authority_admin",
          "super_admin",
        ]),
        authorityId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const hashedPassword = await hash(input.password, 10);
      const result = await db.insert(platformUsers).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role,
        authorityId: input.authorityId || null,
      });
      return { id: Number(result[0].insertId), success: true };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z
          .enum([
            "operator",
            "verification_officer",
            "authority_admin",
            "super_admin",
          ])
          .optional(),
        authorityId: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db
        .update(platformUsers)
        .set(data)
        .where(eq(platformUsers.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(platformUsers)
        .where(eq(platformUsers.id, input.id));
      return { success: true };
    }),

  toggleStatus: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(platformUsers)
        .where(eq(platformUsers.id, input.id));
      if (existing.length === 0) return { success: false };
      await db
        .update(platformUsers)
        .set({ isActive: !existing[0].isActive })
        .where(eq(platformUsers.id, input.id));
      return { success: true };
    }),

  // Authentication for platform users
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(platformUsers)
        .where(eq(platformUsers.email, input.email));

      if (result.length === 0) {
        return { success: false, error: "Invalid credentials" };
      }

      const user = result[0];

      if (!user.isActive) {
        return { success: false, error: "Account is deactivated" };
      }

      const validPassword = await compare(input.password, user.password);
      if (!validPassword) {
        return { success: false, error: "Invalid credentials" };
      }

      const token = await signSessionToken({
        userId: String(user.id),
        clientId: env.appId,
      });

      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as
            | "lax"
            | "none"
            | "strict"
            | undefined,
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db
      .select({ count: count() })
      .from(platformUsers);
    const active = await db
      .select({ count: count() })
      .from(platformUsers)
      .where(eq(platformUsers.isActive, true));
    return {
      total: total[0]?.count || 0,
      active: active[0]?.count || 0,
    };
  }),
});
