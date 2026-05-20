import { relations } from "drizzle-orm";
import {
  users,
  authorities,
  platformUsers,
  identityApplications,
  documents,
  identityCards,
  auditLogs,
} from "./schema";

export const usersRelations = relations(users, ({}) => ({}));

export const authoritiesRelations = relations(authorities, ({ many }) => ({
  applications: many(identityApplications),
  platformUsers: many(platformUsers),
}));

export const platformUsersRelations = relations(platformUsers, ({ one }) => ({
  authority: one(authorities, {
    fields: [platformUsers.authorityId],
    references: [authorities.id],
  }),
}));

export const identityApplicationsRelations = relations(
  identityApplications,
  ({ one, many }) => ({
    authority: one(authorities, {
      fields: [identityApplications.authorityId],
      references: [authorities.id],
    }),
    documents: many(documents),
    identityCard: one(identityCards, {
      fields: [identityApplications.id],
      references: [identityCards.applicationId],
    }),
  })
);

export const documentsRelations = relations(documents, ({ one }) => ({
  application: one(identityApplications, {
    fields: [documents.applicationId],
    references: [identityApplications.id],
  }),
}));

export const identityCardsRelations = relations(identityCards, ({ one }) => ({
  application: one(identityApplications, {
    fields: [identityCards.applicationId],
    references: [identityApplications.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({}) => ({}));
