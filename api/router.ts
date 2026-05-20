import { authRouter } from "./auth-router";
import { authorityRouter } from "./authority-router";
import { platformUserRouter } from "./platform-user-router";
import { enrollmentRouter } from "./enrollment-router";
import { documentRouter } from "./document-router";
import { verificationRouter } from "./verification-router";
import { cardRouter } from "./card-router";
import { dashboardRouter } from "./dashboard-router";
import { auditRouter } from "./audit-router";
import { biometricRouter } from "./biometric-router";
import { paymentRouter } from "./payment-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  authority: authorityRouter,
  platformUser: platformUserRouter,
  enrollment: enrollmentRouter,
  document: documentRouter,
  verification: verificationRouter,
  card: cardRouter,
  dashboard: dashboardRouter,
  audit: auditRouter,
  biometric: biometricRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
