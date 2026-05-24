import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  json,
  boolean,
  decimal,
  longtext,
} from "drizzle-orm/mysql-core";

// ─── Users (OAuth-based) ──────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Authorities ───────────────────────────────────────────────
export const authorities = mysqlTable("authorities", {
  id: serial("id").primaryKey(),
  uniqueAuthorityId: varchar("unique_authority_id", { length: 50 }).notNull().unique(),
  authorityName: varchar("authority_name", { length: 255 }).notNull(),
  authorityCode: varchar("authority_code", { length: 50 }).notNull().unique(),
  registrationNumber: varchar("registration_number", { length: 100 }),
  address: text("address"),
  contactNumber: varchar("contact_number", { length: 50 }),
  email: varchar("email", { length: 320 }),
  digitalSignature: text("digital_signature"),
  signatureImageUrl: text("signature_image_url"),
  signingCertificate: text("signing_certificate"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Authority = typeof authorities.$inferSelect;
export type InsertAuthority = typeof authorities.$inferInsert;

// ─── Platform Users (managed by Authority Admin) ───────────────
export const platformUsers = mysqlTable("platform_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("platform_role", [
    "operator",
    "verification_officer",
    "authority_admin",
    "super_admin",
    "card_printing_operator",
  ])
    .default("operator")
    .notNull(),
  authorityId: bigint("authority_id", { mode: "number", unsigned: true }),
  isActive: boolean("is_active").default(true).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
  mfaSecret: varchar("mfa_secret", { length: 255 }),
  lastPasswordChange: timestamp("last_password_change").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type PlatformUser = typeof platformUsers.$inferSelect;
export type InsertPlatformUser = typeof platformUsers.$inferInsert;

// ─── Identity Applications ─────────────────────────────────────
export const identityApplications = mysqlTable("identity_applications", {
  id: serial("id").primaryKey(),
  applicationRef: varchar("application_ref", { length: 50 }).unique(),
  identityNumber: varchar("identity_number", { length: 50 }).unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  dateOfBirth: varchar("date_of_birth", { length: 50 }).notNull(),
  gender: mysqlEnum("gender", ["Male", "Female", "Other"]).notNull(),
  bloodGroup: varchar("blood_group", { length: 10 }),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  maritalStatus: mysqlEnum("marital_status", ["Single", "Married", "Divorced", "Widowed"]),
  educationLevel: varchar("education_level", { length: 255 }),
  profession: varchar("profession", { length: 255 }),
  professionalAddress: text("professional_address"),
  mobileNumber: varchar("mobile_number", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address").notNull(),
  photoUrl: text("photo_url"),
  status: mysqlEnum("status", [
    "draft",
    "submitted",
    "under_review",
    "correction_requested",
    "biometric_pending",
    "biometric_captured",
    "verification_pending",
    "approved",
    "payment_pending",
    "payment_completed",
    "card_generation_pending",
    "card_printed",
    "issued",
    "active",
    "suspended",
    "revoked",
    "expired",
    "rejected",
  ])
    .default("draft")
    .notNull(),
  authorityId: bigint("authority_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  createdBy: bigint("created_by", { mode: "number", unsigned: true }).notNull(),
  verifiedBy: bigint("verified_by", { mode: "number", unsigned: true }),
  remarks: text("remarks"),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("payment_status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  biometricStatus: mysqlEnum("biometric_status", ["pending", "captured", "verified", "failed"]).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type IdentityApplication = typeof identityApplications.$inferSelect;
export type InsertIdentityApplication =
  typeof identityApplications.$inferInsert;

// ─── Documents ─────────────────────────────────────────────────
export const documents = mysqlTable("documents", {
  id: serial("id").primaryKey(),
  applicationId: bigint("application_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  documentType: mysqlEnum("document_type", [
    "driver_license",
    "voter_id",
    "passport",
    "address_proof",
    "utility_bill",
    "photo",
    "other",
  ]).notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  version: int("version").default(1).notNull(),
  isEncrypted: boolean("is_encrypted").default(false).notNull(),
  checksum: varchar("checksum", { length: 128 }),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// ─── Biometrics ────────────────────────────────────────────────
export const biometrics = mysqlTable("biometrics", {
  id: serial("id").primaryKey(),
  applicationId: bigint("application_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  fingerprints: json("fingerprints"),
  leftIris: text("left_iris"),
  rightIris: text("right_iris"),
  facePhotoUrl: text("face_photo_url"),
  facePhotoData: longtext("face_photo_data"),
  livenessCheck: boolean("liveness_check").default(false).notNull(),
  livenessScore: decimal("liveness_score", { precision: 5, scale: 2 }),
  deviceId: varchar("device_id", { length: 100 }),
  deviceName: varchar("device_name", { length: 255 }),
  deviceCertified: boolean("device_certified").default(false).notNull(),
  captureQuality: mysqlEnum("capture_quality", ["low", "medium", "high", "excellent"]).default("medium"),
  isEncrypted: boolean("is_encrypted").default(true).notNull(),
  encryptionKey: varchar("encryption_key", { length: 255 }),
  checksum: varchar("checksum", { length: 128 }),
  capturedBy: bigint("captured_by", { mode: "number", unsigned: true }),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  deduplicationCheck: boolean("deduplication_check").default(false).notNull(),
  deduplicationResult: mysqlEnum("deduplication_result", ["pass", "fail", "pending"]).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Biometric = typeof biometrics.$inferSelect;
export type InsertBiometric = typeof biometrics.$inferInsert;

// ─── Identity Cards ────────────────────────────────────────────
export const identityCards = mysqlTable("identity_cards", {
  id: serial("id").primaryKey(),
  applicationId: bigint("application_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  identityNumber: varchar("identity_number", { length: 50 }).notNull().unique(),
  cardSerialNumber: varchar("card_serial_number", { length: 100 }).unique(),
  qrCodeUrl: text("qr_code_url").notNull(),
  qrCodeData: text("qr_code_data"),
  pdfUrl: text("pdf_url"),
  cardData: json("card_data"),
  chipData: json("chip_data"),
  nfcData: json("nfc_data"),
  publicKeyCertificate: text("public_key_certificate"),
  verificationToken: varchar("verification_token", { length: 255 }),
  digitalSignature: text("digital_signature"),
  hologramCode: varchar("hologram_code", { length: 50 }),
  barcodeData: varchar("barcode_data", { length: 255 }),
  printStatus: mysqlEnum("print_status", ["pending", "printed", "failed", "reprinted"]).default("pending"),
  printDate: timestamp("print_date"),
  chipEncoded: boolean("chip_encoded").default(false).notNull(),
  chipEncodedAt: timestamp("chip_encoded_at"),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  revokedAt: timestamp("revoked_at"),
  revokeReason: text("revoke_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type IdentityCard = typeof identityCards.$inferSelect;
export type InsertIdentityCard = typeof identityCards.$inferInsert;

// ─── Payments ──────────────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  applicationId: bigint("application_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "refunded", "cancelled"]).default("pending").notNull(),
  paymentMethod: mysqlEnum("payment_method", ["cash", "card", "upi", "bank_transfer", "online", "government_voucher"]).default("cash"),
  transactionId: varchar("transaction_id", { length: 255 }),
  gatewayReference: varchar("gateway_reference", { length: 255 }),
  gatewayResponse: json("gateway_response"),
  receiptUrl: text("receipt_url"),
  invoicePdfUrl: text("invoice_pdf_url"),
  paidBy: bigint("paid_by", { mode: "number", unsigned: true }),
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  refundReason: text("refund_reason"),
  failureReason: text("failure_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─── Sessions ──────────────────────────────────────────────────
export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  deviceInfo: json("device_info"),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// ─── Password Reset Tokens ─────────────────────────────────────
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// ─── API Keys (for external verification) ──────────────────────
export const apiKeys = mysqlTable("api_keys", {
  id: serial("id").primaryKey(),
  authorityId: bigint("authority_id", { mode: "number", unsigned: true }),
  keyName: varchar("key_name", { length: 255 }).notNull(),
  keyValue: varchar("key_value", { length: 500 }).notNull().unique(),
  keyPrefix: varchar("key_prefix", { length: 20 }).notNull(),
  permissions: json("permissions"),
  rateLimit: int("rate_limit").default(1000),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

// ─── Audit Logs (Enhanced) ─────────────────────────────────────
export const auditLogs = mysqlTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  userName: varchar("user_name", { length: 255 }),
  userRole: varchar("user_role", { length: 50 }),
  action: varchar("action", { length: 255 }).notNull(),
  actionCategory: mysqlEnum("action_category", [
    "authentication",
    "authority_management",
    "user_management",
    "enrollment",
    "document",
    "verification",
    "biometric",
    "card_issuance",
    "payment",
    "system",
    "api_access",
  ]).notNull(),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: varchar("entity_id", { length: 255 }),
  entityRef: varchar("entity_ref", { length: 255 }),
  details: text("details"),
  metadata: json("metadata"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  previousValue: json("previous_value"),
  newValue: json("new_value"),
  severity: mysqlEnum("severity", ["info", "warning", "error", "critical"]).default("info").notNull(),
  success: boolean("success").default(true).notNull(),
  errorMessage: text("error_message"),
  previousLogHash: varchar("previous_log_hash", { length: 128 }),
  logHash: varchar("log_hash", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ─── Device Registry (for biometric devices) ───────────────────
export const devices = mysqlTable("devices", {
  id: serial("id").primaryKey(),
  authorityId: bigint("authority_id", { mode: "number", unsigned: true }).notNull(),
  deviceId: varchar("device_id", { length: 100 }).notNull().unique(),
  deviceName: varchar("device_name", { length: 255 }).notNull(),
  deviceType: mysqlEnum("device_type", ["fingerprint_scanner", "iris_scanner", "camera", "card_printer", "smart_card_encoder"]).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 255 }),
  serialNumber: varchar("serial_number", { length: 100 }),
  certificationNumber: varchar("certification_number", { length: 100 }),
  certificationExpiry: timestamp("certification_expiry"),
  isCertified: boolean("is_certified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastConnectedAt: timestamp("last_connected_at"),
  firmwareVersion: varchar("firmware_version", { length: 50 }),
  ipAddress: varchar("ip_address", { length: 50 }),
  registeredBy: bigint("registered_by", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Device = typeof devices.$inferSelect;
export type InsertDevice = typeof devices.$inferInsert;

// ─── Card Print Queue ──────────────────────────────────────────
export const cardPrintQueue = mysqlTable("card_print_queue", {
  id: serial("id").primaryKey(),
  cardId: bigint("card_id", { mode: "number", unsigned: true }).notNull(),
  applicationId: bigint("application_id", { mode: "number", unsigned: true }).notNull(),
  printerId: bigint("printer_id", { mode: "number", unsigned: true }),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  status: mysqlEnum("status", ["queued", "printing", "printed", "failed", "cancelled"]).default("queued").notNull(),
  printAttempts: int("print_attempts").default(0).notNull(),
  errorMessage: text("error_message"),
  printedBy: bigint("printed_by", { mode: "number", unsigned: true }),
  printedAt: timestamp("printed_at"),
  queuedAt: timestamp("queued_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CardPrintQueue = typeof cardPrintQueue.$inferSelect;
export type InsertCardPrintQueue = typeof cardPrintQueue.$inferInsert;
