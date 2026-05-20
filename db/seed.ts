import { getDb } from "../api/queries/connection";
import {
  authorities,
  platformUsers,
  identityApplications,
  identityCards,
  documents,
  biometrics,
  payments,
  sessions,
  passwordResetTokens,
  apiKeys,
  auditLogs,
  devices,
  cardPrintQueue,
} from "./schema";
import { hash } from "bcryptjs";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createHash } from "crypto";

function generateUniqueAuthorityId(): string {
  const year = new Date().getFullYear();
  const random = nanoid(8).toUpperCase();
  return `AUTH-${year}-${random}`;
}

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Clear existing data first
  try {
    await db.delete(cardPrintQueue);
    await db.delete(devices);
    await db.delete(auditLogs);
    await db.delete(apiKeys);
    await db.delete(passwordResetTokens);
    await db.delete(sessions);
    await db.delete(payments);
    await db.delete(biometrics);
    await db.delete(identityCards);
    await db.delete(documents);
    await db.delete(identityApplications);
    await db.delete(platformUsers);
    await db.delete(authorities);
    console.log("Cleared existing data");
  } catch (e) {
    console.log("Some tables may not exist yet, continuing...");
  }

  // Reset auto increment
  await db.execute(sql`ALTER TABLE authorities AUTO_INCREMENT = 1`);
  await db.execute(sql`ALTER TABLE platform_users AUTO_INCREMENT = 1`);
  await db.execute(sql`ALTER TABLE identity_applications AUTO_INCREMENT = 1`);
  await db.execute(sql`ALTER TABLE documents AUTO_INCREMENT = 1`);
  await db.execute(sql`ALTER TABLE identity_cards AUTO_INCREMENT = 1`);
  await db.execute(sql`ALTER TABLE biometrics AUTO_INCREMENT = 1`);
  await db.execute(sql`ALTER TABLE payments AUTO_INCREMENT = 1`);

  // Create authorities with digital signatures and unique IDs
  const authorityData = [
    {
      uniqueAuthorityId: generateUniqueAuthorityId(),
      authorityName: "National Identity Authority",
      authorityCode: "NIA-001",
      registrationNumber: "GOV-REG-2024-001234",
      address: "123 Government Plaza, Capital City",
      contactNumber: "+1-800-555-0100",
      email: "info@nia.gov",
      digitalSignature: "-----BEGIN CERTIFICATE-----\nMIID...SIMULATED...SIGNATURE...DATA\n-----END CERTIFICATE-----",
      signatureImageUrl: "/signatures/nia-signature.png",
      signingCertificate: "CERT-NIA-2026-001",
    },
    {
      uniqueAuthorityId: generateUniqueAuthorityId(),
      authorityName: "State Digital Services",
      authorityCode: "SDS-002",
      registrationNumber: "GOV-REG-2024-005678",
      address: "456 Tech Boulevard, Metro City",
      contactNumber: "+1-800-555-0200",
      email: "contact@sds.gov",
      digitalSignature: "-----BEGIN CERTIFICATE-----\nMIID...SIMULATED...SIGNATURE...DATA\n-----END CERTIFICATE-----",
      signatureImageUrl: "/signatures/sds-signature.png",
      signingCertificate: "CERT-SDS-2026-002",
    },
    {
      uniqueAuthorityId: generateUniqueAuthorityId(),
      authorityName: "Citizen Registration Bureau",
      authorityCode: "CRB-003",
      registrationNumber: "GOV-REG-2024-009012",
      address: "789 Civic Center, Central District",
      contactNumber: "+1-800-555-0300",
      email: "support@crb.gov",
      digitalSignature: null,
      signatureImageUrl: null,
      signingCertificate: null,
    },
  ];

  await db.insert(authorities).values(authorityData);
  console.log(`Inserted ${authorityData.length} authorities`);

  // Create platform users
  const password = await hash("password123", 10);
  const platformUserData = [
    {
      name: "Super Admin",
      email: "superadmin@eims.com",
      password,
      role: "super_admin" as const,
      authorityId: null,
      mfaEnabled: false,
    },
    {
      name: "Authority Admin",
      email: "admin@nia.gov",
      password,
      role: "authority_admin" as const,
      authorityId: 1,
      mfaEnabled: false,
    },
    {
      name: "Enrollment Operator",
      email: "operator@nia.gov",
      password,
      role: "operator" as const,
      authorityId: 1,
      mfaEnabled: false,
    },
    {
      name: "Verification Officer",
      email: "verifier@nia.gov",
      password,
      role: "verification_officer" as const,
      authorityId: 1,
      mfaEnabled: false,
    },
    {
      name: "State Admin",
      email: "admin@sds.gov",
      password,
      role: "authority_admin" as const,
      authorityId: 2,
      mfaEnabled: false,
    },
    {
      name: "Card Printing Operator",
      email: "printer@nia.gov",
      password,
      role: "card_printing_operator" as const,
      authorityId: 1,
      mfaEnabled: false,
    },
  ];

  await db.insert(platformUsers).values(platformUserData);
  console.log(`Inserted ${platformUserData.length} platform users`);

  // Create sample applications with various statuses
  const applicationData = [
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "John Michael Smith",
      dateOfBirth: "1985-03-15",
      gender: "Male" as const,
      bloodGroup: "O+",
      nationality: "United States",
      mobileNumber: "+1-555-0101",
      email: "john.smith@email.com",
      address: "456 Oak Avenue, Springfield, IL 62701",
      photoUrl: null,
      status: "issued" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: 4,
      remarks: null,
      identityNumber: "EC-2026-8A3F21",
      paymentAmount: "50.00",
      paymentStatus: "completed" as const,
      biometricStatus: "verified" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "Sarah Elizabeth Johnson",
      dateOfBirth: "1990-07-22",
      gender: "Female" as const,
      bloodGroup: "A-",
      nationality: "United States",
      mobileNumber: "+1-555-0102",
      email: "sarah.j@email.com",
      address: "789 Pine Street, Riverside, CA 92501",
      photoUrl: null,
      status: "approved" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: 4,
      remarks: "All documents verified",
      identityNumber: null,
      paymentAmount: "50.00",
      paymentStatus: "pending" as const,
      biometricStatus: "verified" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "David Robert Williams",
      dateOfBirth: "1978-11-08",
      gender: "Male" as const,
      bloodGroup: "B+",
      nationality: "United States",
      mobileNumber: "+1-555-0103",
      email: "dr.williams@email.com",
      address: "321 Maple Drive, Austin, TX 78701",
      photoUrl: null,
      status: "payment_completed" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: 4,
      remarks: null,
      identityNumber: null,
      paymentAmount: "50.00",
      paymentStatus: "completed" as const,
      biometricStatus: "verified" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "Emily Grace Brown",
      dateOfBirth: "1995-01-30",
      gender: "Female" as const,
      bloodGroup: "AB+",
      nationality: "United States",
      mobileNumber: "+1-555-0104",
      email: "emily.brown@email.com",
      address: "654 Elm Boulevard, Denver, CO 80201",
      photoUrl: null,
      status: "biometric_captured" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: 4,
      remarks: null,
      identityNumber: null,
      paymentAmount: null,
      paymentStatus: "pending" as const,
      biometricStatus: "captured" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "Michael James Davis",
      dateOfBirth: "1982-09-12",
      gender: "Male" as const,
      bloodGroup: "O-",
      nationality: "United States",
      mobileNumber: "+1-555-0105",
      email: "m.davis@email.com",
      address: "987 Cedar Lane, Seattle, WA 98101",
      photoUrl: null,
      status: "rejected" as const,
      authorityId: 2,
      createdBy: 5,
      verifiedBy: 4,
      remarks: "Invalid address proof provided",
      identityNumber: null,
      paymentAmount: null,
      paymentStatus: "pending" as const,
      biometricStatus: "pending" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "Jessica Marie Wilson",
      dateOfBirth: "1988-05-25",
      gender: "Female" as const,
      bloodGroup: "A+",
      nationality: "United States",
      mobileNumber: "+1-555-0106",
      email: "j.wilson@email.com",
      address: "147 Birch Road, Boston, MA 02101",
      photoUrl: null,
      status: "draft" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: null,
      remarks: null,
      identityNumber: null,
      paymentAmount: null,
      paymentStatus: "pending" as const,
      biometricStatus: "pending" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "Christopher Lee Taylor",
      dateOfBirth: "1975-12-03",
      gender: "Male" as const,
      bloodGroup: "B-",
      nationality: "United States",
      mobileNumber: "+1-555-0107",
      email: "chris.taylor@email.com",
      address: "258 Spruce Court, Miami, FL 33101",
      photoUrl: null,
      status: "correction_requested" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: 4,
      remarks: "Please upload clearer passport photo",
      identityNumber: null,
      paymentAmount: null,
      paymentStatus: "pending" as const,
      biometricStatus: "pending" as const,
    },
    {
      applicationRef: `APP-2026-${nanoid(6).toUpperCase()}`,
      fullName: "Amanda Nicole Anderson",
      dateOfBirth: "1993-04-18",
      gender: "Female" as const,
      bloodGroup: "O+",
      nationality: "United States",
      mobileNumber: "+1-555-0108",
      email: "amanda.a@email.com",
      address: "369 Willow Way, Portland, OR 97201",
      photoUrl: null,
      status: "submitted" as const,
      authorityId: 1,
      createdBy: 3,
      verifiedBy: null,
      remarks: null,
      identityNumber: null,
      paymentAmount: null,
      paymentStatus: "pending" as const,
      biometricStatus: "pending" as const,
    },
  ];

  await db.insert(identityApplications).values(applicationData);
  console.log(`Inserted ${applicationData.length} applications`);

  // Create sample documents
  const documentData = [
    {
      applicationId: 1,
      fileUrl: "/uploads/passport_john_smith.pdf",
      fileName: "passport_john_smith.pdf",
      documentType: "passport" as const,
      fileSize: 2048000,
      mimeType: "application/pdf",
      version: 1,
      isEncrypted: true,
      checksum: `CHK-${nanoid(16)}`,
    },
    {
      applicationId: 1,
      fileUrl: "/uploads/address_proof_john.pdf",
      fileName: "address_proof_john.pdf",
      documentType: "address_proof" as const,
      fileSize: 1024000,
      mimeType: "application/pdf",
      version: 1,
      isEncrypted: true,
      checksum: `CHK-${nanoid(16)}`,
    },
    {
      applicationId: 2,
      fileUrl: "/uploads/drivers_license_sarah.pdf",
      fileName: "drivers_license_sarah.pdf",
      documentType: "driver_license" as const,
      fileSize: 1536000,
      mimeType: "application/pdf",
      version: 1,
      isEncrypted: true,
      checksum: `CHK-${nanoid(16)}`,
    },
    {
      applicationId: 3,
      fileUrl: "/uploads/utility_bill_david.pdf",
      fileName: "utility_bill_david.pdf",
      documentType: "utility_bill" as const,
      fileSize: 512000,
      mimeType: "application/pdf",
      version: 1,
      isEncrypted: true,
      checksum: `CHK-${nanoid(16)}`,
    },
    {
      applicationId: 4,
      fileUrl: "/uploads/voter_id_emily.pdf",
      fileName: "voter_id_emily.pdf",
      documentType: "voter_id" as const,
      fileSize: 1280000,
      mimeType: "application/pdf",
      version: 1,
      isEncrypted: true,
      checksum: `CHK-${nanoid(16)}`,
    },
  ];

  await db.insert(documents).values(documentData);
  console.log(`Inserted ${documentData.length} documents`);

  // Create sample biometric data
  const biometricData = [
    {
      applicationId: 1,
      fingerprints: JSON.stringify([
        `FP-RIGHT-THUMB-${nanoid(16)}`,
        `FP-RIGHT-INDEX-${nanoid(16)}`,
        `FP-RIGHT-MIDDLE-${nanoid(16)}`,
        `FP-RIGHT-RING-${nanoid(16)}`,
        `FP-RIGHT-PINKY-${nanoid(16)}`,
        `FP-LEFT-THUMB-${nanoid(16)}`,
        `FP-LEFT-INDEX-${nanoid(16)}`,
        `FP-LEFT-MIDDLE-${nanoid(16)}`,
        `FP-LEFT-RING-${nanoid(16)}`,
        `FP-LEFT-PINKY-${nanoid(16)}`,
      ]),
      leftIris: `IRIS-L-${nanoid(32)}`,
      rightIris: `IRIS-R-${nanoid(32)}`,
      facePhotoUrl: "/photos/face_john_smith.jpg",
      livenessCheck: true,
      livenessScore: "98.50",
      deviceId: "BIO-DEV-001",
      deviceName: "SecuGen Hamster Pro 20",
      deviceCertified: true,
      captureQuality: "excellent" as const,
      isEncrypted: true,
      encryptionKey: `ENC-${nanoid(16)}`,
      checksum: `CHK-${nanoid(16)}`,
      capturedBy: 3,
      capturedAt: new Date(),
      verifiedAt: new Date(),
      deduplicationCheck: true,
      deduplicationResult: "pass" as const,
    },
    {
      applicationId: 4,
      fingerprints: JSON.stringify([
        `FP-RIGHT-THUMB-${nanoid(16)}`,
        `FP-RIGHT-INDEX-${nanoid(16)}`,
      ]),
      leftIris: null,
      rightIris: null,
      facePhotoUrl: "/photos/face_emily_brown.jpg",
      livenessCheck: true,
      livenessScore: "92.30",
      deviceId: "BIO-DEV-001",
      deviceName: "SecuGen Hamster Pro 20",
      deviceCertified: true,
      captureQuality: "high" as const,
      isEncrypted: true,
      encryptionKey: `ENC-${nanoid(16)}`,
      checksum: `CHK-${nanoid(16)}`,
      capturedBy: 3,
      capturedAt: new Date(),
      verifiedAt: null,
      deduplicationCheck: false,
      deduplicationResult: "pending" as const,
    },
  ];

  await db.insert(biometrics).values(biometricData);
  console.log(`Inserted ${biometricData.length} biometric records`);

  // Create sample identity cards
  const cardData = [
    {
      applicationId: 1,
      identityNumber: "EC-2026-8A3F21",
      cardSerialNumber: `CSN-${nanoid(12).toUpperCase()}`,
      qrCodeUrl: "EC-2026-8A3F21",
      qrCodeData: "data:image/png;base64,simulated-qr-code",
      pdfUrl: null,
      cardData: JSON.stringify({
        fullName: "John Michael Smith",
        dateOfBirth: "1985-03-15",
        gender: "Male",
        nationality: "United States",
        bloodGroup: "O+",
        authorityName: "National Identity Authority",
        authorityId: authorityData[0].uniqueAuthorityId,
        issueDate: "2026-01-15T00:00:00.000Z",
        expiryDate: "2031-01-15T00:00:00.000Z",
        identityNumber: "EC-2026-8A3F21",
        cardSerialNumber: `CSN-${nanoid(12).toUpperCase()}`,
        hologramCode: `HGC-${nanoid(6).toUpperCase()}`,
      }),
      chipData: JSON.stringify({
        identityNumber: "EC-2026-8A3F21",
        fullName: "John Michael Smith",
        dateOfBirth: "1985-03-15",
        gender: "Male",
        nationality: "United States",
        bloodGroup: "O+",
        authorityName: "National Identity Authority",
        issueDate: "2026-01-15T00:00:00.000Z",
        cardVersion: "1.0",
        chipFormat: "ISO7816",
      }),
      nfcData: JSON.stringify({
        ndefRecords: [
          {
            tnf: 1,
            type: "U",
            payload: "https://verify.earthcard.io/EC-2026-8A3F21",
          },
        ],
      }),
      publicKeyCertificate: `CERT-${nanoid(24).toUpperCase()}`,
      verificationToken: `VTK-${nanoid(16).toUpperCase()}`,
      hologramCode: `HGC-${nanoid(6).toUpperCase()}`,
      digitalSignature: authorityData[0].digitalSignature,
      printStatus: "printed" as const,
      chipEncoded: true,
      chipEncodedAt: new Date(),
      expiresAt: new Date("2031-01-15"),
      isActive: true,
    },
  ];

  await db.insert(identityCards).values(cardData);
  console.log(`Inserted ${cardData.length} identity card`);

  // Create sample payments
  const paymentData = [
    {
      applicationId: 1,
      invoiceNumber: `INV-2026-${nanoid(8).toUpperCase()}`,
      amount: "50.00",
      currency: "USD",
      status: "completed" as const,
      paymentMethod: "card" as const,
      transactionId: `TXN-${nanoid(12)}`,
      gatewayReference: `GW-${nanoid(8)}`,
      gatewayResponse: JSON.stringify({ status: "success", message: "Payment processed" }),
      receiptUrl: "/receipts/INV-001.pdf",
      paidBy: 3,
      paidAt: new Date(),
    },
    {
      applicationId: 3,
      invoiceNumber: `INV-2026-${nanoid(8).toUpperCase()}`,
      amount: "50.00",
      currency: "USD",
      status: "completed" as const,
      paymentMethod: "upi" as const,
      transactionId: `TXN-${nanoid(12)}`,
      gatewayReference: `GW-${nanoid(8)}`,
      gatewayResponse: JSON.stringify({ status: "success", message: "UPI payment successful" }),
      paidBy: 3,
      paidAt: new Date(),
    },
    {
      applicationId: 2,
      invoiceNumber: `INV-2026-${nanoid(8).toUpperCase()}`,
      amount: "50.00",
      currency: "USD",
      status: "pending" as const,
      paymentMethod: "cash" as const,
    },
  ];

  await db.insert(payments).values(paymentData);
  console.log(`Inserted ${paymentData.length} payments`);

  // Create sample devices
  const deviceData = [
    {
      authorityId: 1,
      deviceId: "BIO-DEV-001",
      deviceName: "SecuGen Hamster Pro 20",
      deviceType: "fingerprint_scanner" as const,
      manufacturer: "SecuGen",
      model: "Hamster Pro 20",
      serialNumber: `SN-${nanoid(12)}`,
      certificationNumber: `CERT-BIO-2024-001`,
      certificationExpiry: new Date("2027-01-01"),
      isCertified: true,
      isActive: true,
      firmwareVersion: "3.2.1",
      ipAddress: "192.168.1.100",
      registeredBy: 1,
    },
    {
      authorityId: 1,
      deviceId: "BIO-DEV-002",
      deviceName: "IrisID iCAM7000",
      deviceType: "iris_scanner" as const,
      manufacturer: "IrisID",
      model: "iCAM7000",
      serialNumber: `SN-${nanoid(12)}`,
      certificationNumber: `CERT-BIO-2024-002`,
      certificationExpiry: new Date("2027-06-01"),
      isCertified: true,
      isActive: true,
      firmwareVersion: "2.1.0",
      ipAddress: "192.168.1.101",
      registeredBy: 1,
    },
    {
      authorityId: 1,
      deviceId: "PRINT-DEV-001",
      deviceName: "Evolis Primacy 2",
      deviceType: "card_printer" as const,
      manufacturer: "Evolis",
      model: "Primacy 2",
      serialNumber: `SN-${nanoid(12)}`,
      isCertified: false,
      isActive: true,
      firmwareVersion: "1.5.3",
      ipAddress: "192.168.1.200",
      registeredBy: 1,
    },
  ];

  await db.insert(devices).values(deviceData);
  console.log(`Inserted ${deviceData.length} devices`);

  // Create sample API keys
  const apiKeyData = [
    {
      authorityId: 1,
      keyName: "NIA Verification API Key",
      keyValue: `ek_live_${nanoid(32)}`,
      keyPrefix: "ek_live",
      permissions: JSON.stringify(["verify", "read"]),
      rateLimit: 10000,
      isActive: true,
      expiresAt: new Date("2027-12-31"),
    },
    {
      authorityId: 2,
      keyName: "SDS Integration Key",
      keyValue: `ek_live_${nanoid(32)}`,
      keyPrefix: "ek_live",
      permissions: JSON.stringify(["verify", "read", "enroll"]),
      rateLimit: 5000,
      isActive: true,
      expiresAt: new Date("2027-06-30"),
    },
  ];

  await db.insert(apiKeys).values(apiKeyData);
  console.log(`Inserted ${apiKeyData.length} API keys`);

  // Create sample audit logs
  const auditLogData = [
    {
      userId: 1,
      userName: "Super Admin",
      userRole: "super_admin",
      action: "System initialized",
      actionCategory: "system" as const,
      entityType: "system",
      entityId: "1",
      details: "EIMS system initialized with seed data",
      severity: "info" as const,
      success: true,
      ipAddress: "127.0.0.1",
    },
    {
      userId: 1,
      userName: "Super Admin",
      userRole: "super_admin",
      action: "Authority created",
      actionCategory: "authority_management" as const,
      entityType: "authority",
      entityId: "1",
      entityRef: authorityData[0].uniqueAuthorityId,
      details: `Created authority: ${authorityData[0].authorityName}`,
      severity: "info" as const,
      success: true,
      ipAddress: "127.0.0.1",
    },
    {
      userId: 3,
      userName: "Enrollment Operator",
      userRole: "operator",
      action: "Application created",
      actionCategory: "enrollment" as const,
      entityType: "application",
      entityId: "1",
      entityRef: applicationData[0].applicationRef,
      details: `Created application for ${applicationData[0].fullName}`,
      severity: "info" as const,
      success: true,
      ipAddress: "192.168.1.50",
    },
    {
      userId: 3,
      userName: "Enrollment Operator",
      userRole: "operator",
      action: "Biometric data captured",
      actionCategory: "biometric" as const,
      entityType: "biometric",
      entityId: "1",
      details: "Captured 10 fingerprints, iris scans, and face photo",
      metadata: JSON.stringify({ deviceId: "BIO-DEV-001", quality: "excellent" }),
      severity: "info" as const,
      success: true,
      ipAddress: "192.168.1.50",
    },
    {
      userId: 4,
      userName: "Verification Officer",
      userRole: "verification_officer",
      action: "Application approved",
      actionCategory: "verification" as const,
      entityType: "application",
      entityId: "1",
      entityRef: applicationData[0].applicationRef,
      details: "All documents and biometrics verified successfully",
      severity: "info" as const,
      success: true,
      ipAddress: "192.168.1.60",
    },
    {
      userId: 3,
      userName: "Enrollment Operator",
      userRole: "operator",
      action: "Payment processed",
      actionCategory: "payment" as const,
      entityType: "payment",
      entityId: "1",
      details: "Payment of $50.00 processed via card",
      severity: "info" as const,
      success: true,
      ipAddress: "192.168.1.50",
    },
    {
      userId: 1,
      userName: "Super Admin",
      userRole: "super_admin",
      action: "Identity card issued",
      actionCategory: "card_issuance" as const,
      entityType: "card",
      entityId: "1",
      entityRef: "EC-2026-8A3F21",
      details: "Identity card issued with chip encoding",
      severity: "info" as const,
      success: true,
      ipAddress: "127.0.0.1",
    },
  ];

  // Insert audit logs with hash chain
  let previousHash: string | null = null;
  for (const log of auditLogData) {
    const content = JSON.stringify({
      userId: log.userId,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      timestamp: new Date().toISOString(),
      previousHash,
    });
    const logHash = createHash("sha256").update(content).digest("hex");

    await db.insert(auditLogs).values({
      ...log,
      previousLogHash: previousHash,
      logHash,
      createdAt: new Date(),
    });
    previousHash = logHash;
  }
  console.log(`Inserted ${auditLogData.length} audit logs`);

  console.log("\n=========================================");
  console.log("Seeding completed successfully!");
  console.log("=========================================");
  console.log("\nDefault login credentials:");
  console.log("  Super Admin:   superadmin@eims.com / password123");
  console.log("  Authority Admin:  admin@nia.gov / password123");
  console.log("  Operator:      operator@nia.gov / password123");
  console.log("  Verifier:      verifier@nia.gov / password123");
  console.log("  Printer:       printer@nia.gov / password123");
  console.log("=========================================");
  console.log("\nNew Features Seeded:");
  console.log("  - Authorities with digital signatures & unique IDs");
  console.log("  - Biometric data (fingerprints, iris, face)");
  console.log("  - Payment records with invoices");
  console.log("  - Smart card chip data & NFC data");
  console.log("  - Device registry (biometric scanners, printers)");
  console.log("  - API keys for external verification");
  console.log("  - Audit logs with hash chain integrity");
  console.log("=========================================");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
