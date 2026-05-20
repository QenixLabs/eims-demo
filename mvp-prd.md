Product Requirements Document (PRD)
Earth Card Identity Management System (EIMS) — MVP
1. Product Overview
Product Name

Earth Card Identity Management System (EIMS)

Product Type

Web-based Identity Enrollment and Card Issuance Platform

Product Goal

The goal of the MVP is to build a secure and scalable platform that enables authorized organizations (“Issuing Authorities”) to:

Register identity applicants
Upload and verify documents
Approve/reject identity applications
Generate unique identity cards
Print/download identity cards
Verify issued cards through QR codes

The MVP focuses on validating the core operational workflow while keeping the architecture scalable for future biometric and smart-card integrations.

2. Business Problem

Organizations and governments often require:

A centralized identity issuance platform
Standardized enrollment workflows
Document validation systems
Printable identity card generation
Identity verification mechanisms

Existing manual systems:

Are fragmented
Lack auditability
Are difficult to scale
Create verification challenges

EIMS solves this by providing a centralized identity management workflow.

3. MVP Goals
Primary Goals
Enable authorities to issue identity cards digitally
Simplify identity enrollment process
Provide QR-based verification
Maintain secure document storage
Enable cloud and on-prem deployments
Secondary Goals
Build scalable architecture
Support future biometric integration
Enable multi-authority support
Establish audit logging foundation
4. Target Users
User Type	Description
Super Admin	Global platform administrator
Authority Admin	Manages authority operations
Enrollment Operator	Creates identity applications
Verification Officer	Reviews and approves applications
Issuer/Citizen	Identity applicant
Verification User	Verifies issued identities
5. User Roles & Permissions
5.1 Super Admin

Permissions:

Create/manage authorities
Manage system users
View analytics
Suspend authorities
Configure platform settings
5.2 Authority Admin

Permissions:

Manage operators
Review applications
Approve/reject enrollments
Issue identity cards
Access authority-level reports
5.3 Enrollment Operator

Permissions:

Create applications
Upload documents
Upload applicant photo
Track application status
5.4 Verification Officer

Permissions:

Verify submitted applications
Approve/reject applications
Add remarks
6. Core MVP Features
6.1 Authentication & Authorization
Description

Secure login system with role-based access.

Functional Requirements
User Login
Email/password authentication
Secure session management
JWT-based authorization
Password Features
Password hashing
Reset password
Change password
Role-Based Access

Different dashboards and permissions based on role.

6.2 Authority Management
Description

Super Admin can register and manage issuing authorities.

Functional Requirements
Create Authority

Fields:

Authority Name
Authority ID
Address
Contact Number
Email
Manage Authority
Activate/deactivate authority
Edit authority details
View authority users
6.3 User Management
Description

Authority Admin manages internal users.

Functional Requirements
Create Users

Fields:

Name
Email
Role
Password
Roles
Operator
Verification Officer
6.4 Identity Enrollment Module
Description

Operators create identity applications.

Enrollment Form Fields
Field	Required
Full Name	Yes
Date of Birth	Yes
Gender	Yes
Blood Group	No
Nationality	Yes
Mobile Number	Yes
Email	No
Address	Yes
Photo	Yes
Features
Save draft
Submit application
Edit before approval
Status tracking
6.5 Document Upload Module
Description

Applicants’ supporting documents shall be uploaded and attached to identity applications.

Supported Documents
Document Type
Driver License
Voter ID
Passport
Address Proof
Utility Bill
Functional Requirements
Upload
PDF/JPG/PNG support
Max file size validation
Secure upload
Preview
View uploaded documents
Download documents
Storage
Cloud object storage
Secure access URLs
6.6 Verification Workflow
Description

Verification Officers review and validate submitted applications.

Functional Requirements
Review Application
View applicant details
View uploaded documents
Add verification remarks
Decision Actions
Approve
Reject
Request correction
Application Status Flow
Draft
→ Submitted
→ Under Review
→ Correction Requested
→ Approved
→ Rejected
→ Issued
6.7 Identity Number Generation
Description

Generate unique identity numbers for approved applications.

Requirements
Identity Number Rules
Unique
Auto-generated
Non-editable
Human-readable

Example:

EC-2026-94A8XF
6.8 Identity Card Generation
Description

Generate downloadable/printable identity cards.

Card Contents
Field
Identity Number
Name
Photo
DOB
Gender
QR Code
Authority Name
Features
PDF export
Printable format
Responsive preview
6.9 QR Verification Module
Description

Verify identity cards using QR code.

Verification Workflow
Scan QR
→ Open Verification Page
→ Fetch Identity Record
→ Show Verification Status
Verification Page Displays
Field
Name
Identity Number
Photo
Authority
Verification Status
6.10 Dashboard & Reporting
Super Admin Dashboard
Total authorities
Total applications
Total issued cards
Authority Dashboard
Pending approvals
Approved applications
Rejected applications
Operator Dashboard
Draft applications
Submitted applications
Application status tracking
7. Non-Functional Requirements
7.1 Performance
Requirement	Target
API Response	< 500ms
Page Load	< 3 sec
Concurrent Users	500+
7.2 Scalability

The system shall:

Support horizontal scaling
Use stateless APIs
Support future microservice migration
7.3 Security
Required Security Features
Feature
HTTPS
Password Hashing
JWT Authentication
RBAC
Input Validation
File Validation
Rate Limiting
Audit Logs
7.4 Availability
Requirement	Target
Uptime	99.5%
8. Technical Architecture
8.1 Frontend
Technology	Purpose
Next.js	Full-stack framework
Tailwind CSS	Styling
shadcn/ui	UI components
React Hook Form	Forms
Zod	Validation
Zustand	State management
8.2 Backend
Technology	Purpose
Next.js API Routes	Backend APIs
Prisma	ORM
PostgreSQL	Database
NextAuth/Auth.js	Authentication
8.3 Storage
Data Type	Storage
Documents	AWS S3 / MinIO
Photos	S3 / MinIO
PDFs	S3 / MinIO
Application Data	PostgreSQL
8.4 Deployment
Cloud
AWS EC2
Docker
NGINX
On-Prem
Docker Compose
Linux server deployment
9. Database Design (High Level)
Tables
users
id
name
email
password
role
authority_id
authorities
id
authority_name
authority_code
address
identity_applications
id
identity_number
applicant_name
status
authority_id
documents
id
application_id
file_url
document_type
identity_cards
id
application_id
qr_code
pdf_url
audit_logs
id
user_id
action
created_at
10. API Modules
Module
Auth API
Authority API
User API
Enrollment API
Document API
Verification API
QR Verification API
Identity Card API
11. Audit Logging

The system shall log:

User logins
Application updates
Verification actions
Approval/rejection actions
Identity issuance actions
12. File Upload Requirements
Supported Formats
PDF
JPG
PNG
Restrictions
Max upload size: configurable
Virus scan ready architecture
File type validation
13. MVP Limitations

The MVP does NOT include:

Biometrics
Fingerprint scanning
Iris scanning
Smart card chip encoding
NFC support
PKI infrastructure
Offline verification
AI fraud detection
Active-active HA
14. Future Roadmap

Future versions may include:

Biometric enrollment
Smart card chip integration
Mobile apps
AI fraud detection
Government integrations
PKI-based signing
Offline verification SDK
Multi-region failover
15. Success Metrics
Metric	Goal
Identity issuance completion rate	> 90%
Verification success rate	> 99%
Average enrollment time	< 10 mins
Approval turnaround	< 24 hrs
16. Risks & Challenges
Area	Risk
File uploads	Storage abuse
Identity duplication	No deduplication in MVP
Security	Sensitive personal data
Scaling	Large document storage
Verification	Fraudulent documents
17. Acceptance Criteria

The MVP shall be considered complete when:

Authorities can be created
Users can login securely
Applications can be submitted
Documents can be uploaded
Applications can be approved/rejected
Identity numbers are generated
Identity cards can be downloaded
QR verification works successfully
Application deploys successfully on cloud and on-prem