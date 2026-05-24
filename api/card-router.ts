import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import {
  identityCards,
  identityApplications,
  authorities,
  biometrics,
} from "@db/schema";
import { eq, desc, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

function generateIdentityNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EC-${year}-${random}`;
}

function generateCardSerialNumber(): string {
  return `CSN-${nanoid(12).toUpperCase()}`;
}

function generateHologramCode(): string {
  return `HGC-${nanoid(6).toUpperCase()}`;
}

function generateVerificationToken(): string {
  return `VTK-${nanoid(16).toUpperCase()}`;
}

function generateChipData(app: any, identityNumber: string, authority: any, bioData: any): any {
  return {
    identityNumber,
    firstName: app.firstName,
    middleName: app.middleName,
    lastName: app.lastName,
    dateOfBirth: app.dateOfBirth,
    gender: app.gender,
    nationality: app.nationality,
    bloodGroup: app.bloodGroup || "N/A",
    authorityName: authority?.authorityName || "Unknown",
    authorityId: authority?.uniqueAuthorityId || "N/A",
    issueDate: new Date().toISOString(),
    cardVersion: "1.0",
    chipFormat: "ISO7816",
    dataStructure: {
      EF_DG1: {
        MRZ: `${(app.firstName + " " + app.lastName).substring(0, 39).padEnd(39)}${app.dateOfBirth.replace(/-/g, "")}${app.gender === "Male" ? "M" : app.gender === "Female" ? "F" : "X"}`,
      },
      EF_DG2: {
        photoReference: app.photoUrl || "none",
      },
      EF_DG3: {
        fingerprintTemplate: bioData?.fingerprints ? "encrypted" : "none",
        irisTemplate: bioData?.leftIris ? "encrypted" : "none",
      },
      EF_SOD: {
        documentSecurityObject: "digital_signature",
      },
    },
  };
}

function generateNfcData(identityNumber: string, verificationToken: string): any {
  return {
    ndefRecords: [
      {
        tnf: 1,
        type: "U",
        payload: `https://verify.earthcard.io/${identityNumber}`,
      },
      {
        tnf: 2,
        type: "text/en",
        payload: JSON.stringify({
          id: identityNumber,
          token: verificationToken,
          verify: true,
        }),
      },
    ],
    accessConditions: {
      readAccess: "public",
      writeAccess: "secure_channel",
      authenticationRequired: true,
    },
  };
}

export const cardRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          search: z.string().optional(),
          authorityId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();

      const result = await db
        .select({
          id: identityCards.id,
          applicationId: identityCards.applicationId,
          identityNumber: identityCards.identityNumber,
          cardSerialNumber: identityCards.cardSerialNumber,
          qrCodeUrl: identityCards.qrCodeUrl,
          pdfUrl: identityCards.pdfUrl,
          cardData: identityCards.cardData,
          chipData: identityCards.chipData,
          printStatus: identityCards.printStatus,
          chipEncoded: identityCards.chipEncoded,
          issuedAt: identityCards.issuedAt,
          expiresAt: identityCards.expiresAt,
          isActive: identityCards.isActive,
          firstName: identityApplications.firstName,
          lastName: identityApplications.lastName,
          dateOfBirth: identityApplications.dateOfBirth,
          gender: identityApplications.gender,
          nationality: identityApplications.nationality,
          photoUrl: identityApplications.photoUrl,
          authorityName: authorities.authorityName,
        })
        .from(identityCards)
        .innerJoin(
          identityApplications,
          eq(identityCards.applicationId, identityApplications.id)
        )
        .leftJoin(
          authorities,
          eq(identityApplications.authorityId, authorities.id)
        )
        .orderBy(desc(identityCards.issuedAt));

      if (input?.search) {
        return result.filter(
          (r) =>
            r.identityNumber?.includes(input.search!) ||
            r.firstName?.toLowerCase().includes(input.search!.toLowerCase()) ||
            r.lastName?.toLowerCase().includes(input.search!.toLowerCase()) ||
            r.cardSerialNumber?.includes(input.search!)
        );
      }

      return result;
    }),

  getByApplicationId: publicQuery
    .input(z.object({ applicationId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(identityCards)
        .where(eq(identityCards.applicationId, input.applicationId));
      return result[0] || null;
    }),

  getByIdentityNumber: publicQuery
    .input(z.object({ identityNumber: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const card = await db
        .select()
        .from(identityCards)
        .where(eq(identityCards.identityNumber, input.identityNumber));

      if (card.length === 0) return null;

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
          authorityName: authorities.authorityName,
        })
        .from(identityApplications)
        .leftJoin(
          authorities,
          eq(identityApplications.authorityId, authorities.id)
        )
        .where(eq(identityApplications.id, card[0].applicationId));

      return {
        card: card[0],
        application: application[0] || null,
      };
    }),

  issue: publicQuery
    .input(
      z.object({
        applicationId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const application = await db
        .select()
        .from(identityApplications)
        .where(eq(identityApplications.id, input.applicationId));

      if (application.length === 0) {
        return { success: false, error: "Application not found" };
      }

      const app = application[0];

      if (app.status !== "approved" && app.status !== "payment_completed") {
        return {
          success: false,
          error: "Application must be approved and payment completed before issuing card",
        };
      }

      let identityNumber = generateIdentityNumber();
      let existing = await db
        .select()
        .from(identityCards)
        .where(eq(identityCards.identityNumber, identityNumber));

      while (existing.length > 0) {
        identityNumber = generateIdentityNumber();
        existing = await db
          .select()
          .from(identityCards)
          .where(eq(identityCards.identityNumber, identityNumber));
      }

      const cardSerialNumber = generateCardSerialNumber();
      const hologramCode = generateHologramCode();
      const verificationToken = generateVerificationToken();

      const authority = await db
        .select()
        .from(authorities)
        .where(eq(authorities.id, app.authorityId));

      const bioData = await db
        .select()
        .from(biometrics)
        .where(eq(biometrics.applicationId, input.applicationId));

      const chipData = generateChipData(app, identityNumber, authority[0], bioData[0]);
      const nfcData = generateNfcData(identityNumber, verificationToken);

      const verifyUrl = `${process.env.APP_URL || "http://localhost:3000"}/verify/${identityNumber}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      });

      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 5);

      const cardDataObj = {
        firstName: app.firstName,
    middleName: app.middleName,
    lastName: app.lastName,
        dateOfBirth: app.dateOfBirth,
        gender: app.gender,
        nationality: app.nationality,
        bloodGroup: app.bloodGroup || "N/A",
        authorityName: authority[0]?.authorityName || "Unknown",
        authorityId: authority[0]?.uniqueAuthorityId || "N/A",
        photoUrl: app.photoUrl,
        issueDate: new Date().toISOString(),
        expiryDate: expiresAt.toISOString(),
        identityNumber,
        cardSerialNumber,
        hologramCode,
      };

      await db
        .update(identityApplications)
        .set({
          status: "issued",
          identityNumber,
        })
        .where(eq(identityApplications.id, input.applicationId));

      const result = await db.insert(identityCards).values({
        applicationId: input.applicationId,
        identityNumber,
        cardSerialNumber,
        qrCodeUrl: identityNumber,
        qrCodeData: qrCodeDataUrl,
        cardData: JSON.stringify(cardDataObj),
        chipData: JSON.stringify(chipData),
        nfcData: JSON.stringify(nfcData),
        publicKeyCertificate: `CERT-${nanoid(24).toUpperCase()}`,
        verificationToken,
        hologramCode,
        digitalSignature: authority[0]?.digitalSignature || null,
        printStatus: "pending",
        chipEncoded: false,
        expiresAt,
      });

      return {
        success: true,
        id: Number(result[0].insertId),
        identityNumber,
        cardSerialNumber,
        qrCodeDataUrl,
        chipData,
      };
    }),

  encodeChip: publicQuery
    .input(z.object({ cardId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(identityCards)
        .set({
          chipEncoded: true,
          chipEncodedAt: new Date(),
        })
        .where(eq(identityCards.id, input.cardId));

      return { success: true };
    }),

  updatePrintStatus: publicQuery
    .input(
      z.object({
        cardId: z.number(),
        status: z.enum(["pending", "printed", "failed", "reprinted"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const updates: any = { printStatus: input.status };
      if (input.status === "printed") {
        updates.printDate = new Date();
      }

      await db
        .update(identityCards)
        .set(updates)
        .where(eq(identityCards.id, input.cardId));

      return { success: true };
    }),

  revoke: publicQuery
    .input(
      z.object({
        cardId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const card = await db
        .select()
        .from(identityCards)
        .where(eq(identityCards.id, input.cardId));

      if (card.length === 0) {
        return { success: false, error: "Card not found" };
      }

      await db
        .update(identityCards)
        .set({
          isActive: false,
          revokedAt: new Date(),
          revokeReason: input.reason,
        })
        .where(eq(identityCards.id, input.cardId));

      await db
        .update(identityApplications)
        .set({ status: "revoked" })
        .where(eq(identityApplications.id, card[0].applicationId));

      return { success: true };
    }),

  toggleStatus: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(identityCards)
        .where(eq(identityCards.id, input.id));
      if (existing.length === 0) return { success: false };
      await db
        .update(identityCards)
        .set({ isActive: !existing[0].isActive })
        .where(eq(identityCards.id, input.id));
      return { success: true };
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db.select({ count: count() }).from(identityCards);
    const active = await db
      .select({ count: count() })
      .from(identityCards)
      .where(eq(identityCards.isActive, true));
    const printed = await db
      .select({ count: count() })
      .from(identityCards)
      .where(eq(identityCards.printStatus, "printed"));
    const chipEncoded = await db
      .select({ count: count() })
      .from(identityCards)
      .where(eq(identityCards.chipEncoded, true));
    return {
      total: total[0]?.count || 0,
      active: active[0]?.count || 0,
      printed: printed[0]?.count || 0,
      chipEncoded: chipEncoded[0]?.count || 0,
    };
  }),
});
