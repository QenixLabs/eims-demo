import type { PlatformRole } from "@/store/authStore";

export interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
  };
}

export interface PageTour {
  page: string;
  steps: TourStep[];
}

const dashboardSteps: TourStep[] = [
  {
    element: '[data-tour="welcome-banner"]',
    popover: {
      title: "Welcome to Earth Card IMS",
      description:
        "Your centralized identity management platform. This dashboard gives you a real-time overview of your system's activity.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="sidebar-nav"]',
    popover: {
      title: "Navigation Sidebar",
      description:
        "Access all modules from here. The sidebar adapts based on your role, showing only the features you have permission to use.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats-cards"]',
    popover: {
      title: "Key Metrics",
      description:
        "Quick stats at a glance. Click any card to navigate to the corresponding module for detailed management.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="recent-apps"]',
    popover: {
      title: "Recent Activity",
      description:
        "Latest applications and their statuses. Click any row to view full application details.",
      side: "top",
      align: "start",
    },
  },
];

const superAdminDashboardSteps: TourStep[] = [
  ...dashboardSteps,
  {
    element: '[data-tour="nav-authorities"]',
    popover: {
      title: "Authorities Management",
      description:
        "Create and manage issuing authorities. Each authority can enroll applicants and issue identity cards.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-users"]',
    popover: {
      title: "User Management",
      description:
        "Add and manage system users across all authorities. Assign roles like Operator and Verification Officer.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-audit"]',
    popover: {
      title: "Audit Log",
      description:
        "View tamper-proof audit trails of all system actions. Every operation is logged with SHA-256 chaining for integrity.",
      side: "right",
      align: "center",
    },
  },
];

const authorityAdminDashboardSteps: TourStep[] = [
  ...dashboardSteps,
  {
    element: '[data-tour="nav-applications"]',
    popover: {
      title: "Applications",
      description:
        "Track all identity applications submitted by your operators. Monitor statuses from draft to issued.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-new_application"]',
    popover: {
      title: "New Enrollment",
      description:
        "Create new identity applications. The wizard guides you through personal info, contact details, and document upload.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-verification"]',
    popover: {
      title: "Verification Workflow",
      description:
        "Review submitted applications, verify documents, and approve or reject enrollments with remarks.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-card_issuance"]',
    popover: {
      title: "Card Issuance",
      description:
        "Generate identity cards with unique numbers and QR codes for approved applications.",
      side: "right",
      align: "center",
    },
  },
];

const operatorDashboardSteps: TourStep[] = [
  ...dashboardSteps,
  {
    element: '[data-tour="nav-applications"]',
    popover: {
      title: "Your Applications",
      description:
        "View and track all applications you have created. Check their status in real-time.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-new_application"]',
    popover: {
      title: "New Enrollment",
      description:
        "Start the identity enrollment process. Collect applicant details, upload photos, and submit for verification.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-biometrics"]',
    popover: {
      title: "Biometric Capture",
      description:
        "Capture fingerprints, iris scans, and face photographs for enrolled applicants.",
      side: "right",
      align: "center",
    },
  },
];

const verificationOfficerDashboardSteps: TourStep[] = [
  ...dashboardSteps,
  {
    element: '[data-tour="nav-verification"]',
    popover: {
      title: "Pending Verifications",
      description:
        "Your primary workspace. Review submitted applications, verify documents, and make approval decisions.",
      side: "right",
      align: "center",
    },
  },
];

const applicationsSteps: TourStep[] = [
  {
    element: '[data-tour="app-filters"]',
    popover: {
      title: "Search & Filter",
      description:
        "Find applications quickly by name, ID, or phone. Filter by status to focus on specific stages.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="app-table"]',
    popover: {
      title: "Applications List",
      description:
        "All applications with their current status. Click the eye icon to view details, or edit drafts.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="new-app-btn"]',
    popover: {
      title: "Create New Application",
      description:
        "Click here to start a new identity enrollment. You'll be guided through a 3-step wizard.",
      side: "left",
      align: "center",
    },
  },
];

const newApplicationSteps: TourStep[] = [
  {
    element: '[data-tour="step-indicator"]',
    popover: {
      title: "Enrollment Wizard",
      description:
        "The enrollment process has 3 steps: Personal Info, Contact Details, and Review & Submit.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="personal-info"]',
    popover: {
      title: "Personal Information",
      description:
        "Enter the applicant's full name, date of birth, gender, blood group, and nationality. Fields marked with * are required.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="photo-upload"]',
    popover: {
      title: "Applicant Photo",
      description:
        "Upload a passport-size photo of the applicant. Supported formats: JPG, PNG. Max size: 5MB.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="form-actions"]',
    popover: {
      title: "Save or Submit",
      description:
        "Save as draft to continue later, or proceed to the next step. All required fields must be filled before submission.",
      side: "top",
      align: "end",
    },
  },
];

const verificationSteps: TourStep[] = [
  {
    element: '[data-tour="verif-stats"]',
    popover: {
      title: "Verification Queue",
      description:
        "Overview of applications awaiting your review: pending, under review, and correction requested.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="verif-table"]',
    popover: {
      title: "Applications to Review",
      description:
        "Click the Review button to open an application and verify its details, documents, and biometric data.",
      side: "top",
      align: "start",
    },
  },
];

const verificationDetailSteps: TourStep[] = [
  {
    element: '[data-tour="applicant-info"]',
    popover: {
      title: "Applicant Details",
      description:
        "Review all demographic information submitted by the operator. Verify accuracy against supporting documents.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="documents"]',
    popover: {
      title: "Supporting Documents",
      description:
        "Review uploaded documents such as driver license, voter ID, passport, and address proof.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="review-actions"]',
    popover: {
      title: "Make Your Decision",
      description:
        "Approve the application for card issuance, request corrections with remarks, or reject with reason.",
      side: "left",
      align: "start",
    },
  },
];

const cardIssuanceSteps: TourStep[] = [
  {
    element: '[data-tour="issuance-table"]',
    popover: {
      title: "Approved Applications",
      description:
        "View all approved applications ready for card generation. Generate cards with unique identity numbers and QR codes.",
      side: "top",
      align: "start",
    },
  },
];

const authoritiesSteps: TourStep[] = [
  {
    element: '[data-tour="create-auth"]',
    popover: {
      title: "Create Authority",
      description:
        "Register a new issuing authority with name, ID, address, and contact details.",
      side: "left",
      align: "center",
    },
  },
  {
    element: '[data-tour="auth-table"]',
    popover: {
      title: "Authorities List",
      description:
        "Manage all registered authorities. Activate or deactivate authorities as needed.",
      side: "top",
      align: "start",
    },
  },
];

const usersSteps: TourStep[] = [
  {
    element: '[data-tour="users-table"]',
    popover: {
      title: "System Users",
      description:
        "Manage operators, verification officers, and other staff. Assign roles and monitor activity.",
      side: "top",
      align: "start",
    },
  },
];

const auditSteps: TourStep[] = [
  {
    element: '[data-tour="audit-table"]',
    popover: {
      title: "Audit Trail",
      description:
        "Every action in the system is logged here with SHA-256 integrity chaining. Search and filter to investigate events.",
      side: "top",
      align: "start",
    },
  },
];

const tourMap: Record<PlatformRole, Record<string, TourStep[]>> = {
  super_admin: {
    dashboard: superAdminDashboardSteps,
    applications: applicationsSteps,
    "new-application": newApplicationSteps,
    verification: verificationSteps,
    "verification-detail": verificationDetailSteps,
    "card-issuance": cardIssuanceSteps,
    authorities: authoritiesSteps,
    users: usersSteps,
    audit: auditSteps,
  },
  authority_admin: {
    dashboard: authorityAdminDashboardSteps,
    applications: applicationsSteps,
    "new-application": newApplicationSteps,
    verification: verificationSteps,
    "verification-detail": verificationDetailSteps,
    "card-issuance": cardIssuanceSteps,
    users: usersSteps,
    audit: auditSteps,
  },
  operator: {
    dashboard: operatorDashboardSteps,
    applications: applicationsSteps,
    "new-application": newApplicationSteps,
  },
  verification_officer: {
    dashboard: verificationOfficerDashboardSteps,
    verification: verificationSteps,
    "verification-detail": verificationDetailSteps,
  },
};

export function getStepsForPage(
  role: PlatformRole,
  page: string
): TourStep[] | undefined {
  return tourMap[role]?.[page];
}

export function getAvailableTourPages(role: PlatformRole): string[] {
  return Object.keys(tourMap[role] || {});
}
