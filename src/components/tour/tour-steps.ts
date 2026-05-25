import type { TFunction } from "i18next";
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

function getDashboardSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="welcome-banner"]',
      popover: {
        title: t("tour:welcomeBannerTitle"),
        description: t("tour:welcomeBannerDesc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="sidebar-nav"]',
      popover: {
        title: t("tour:sidebarNavTitle"),
        description: t("tour:sidebarNavDesc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: '[data-tour="stats-cards"]',
      popover: {
        title: t("tour:statsCardsTitle"),
        description: t("tour:statsCardsDesc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="recent-apps"]',
      popover: {
        title: t("tour:recentActivityTitle"),
        description: t("tour:recentActivityDesc"),
        side: "top",
        align: "start",
      },
    },
  ];
}

function getSuperAdminDashboardSteps(t: TFunction): TourStep[] {
  return [
    ...getDashboardSteps(t),
    {
      element: '[data-tour="nav-authorities"]',
      popover: {
        title: t("tour:authoritiesManagementTitle"),
        description: t("tour:authoritiesManagementDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-users"]',
      popover: {
        title: t("tour:userManagementTitle"),
        description: t("tour:userManagementDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-audit"]',
      popover: {
        title: t("tour:auditLogTitle"),
        description: t("tour:auditLogDesc"),
        side: "right",
        align: "center",
      },
    },
  ];
}

function getAuthorityAdminDashboardSteps(t: TFunction): TourStep[] {
  return [
    ...getDashboardSteps(t),
    {
      element: '[data-tour="nav-applications"]',
      popover: {
        title: t("tour:applicationsTitle"),
        description: t("tour:applicationsDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-new_application"]',
      popover: {
        title: t("tour:newEnrollmentTitle"),
        description: t("tour:newEnrollmentDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-verification"]',
      popover: {
        title: t("tour:verificationWorkflowTitle"),
        description: t("tour:verificationWorkflowDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-card_issuance"]',
      popover: {
        title: t("tour:cardIssuanceTitle"),
        description: t("tour:cardIssuanceDesc"),
        side: "right",
        align: "center",
      },
    },
  ];
}

function getOperatorDashboardSteps(t: TFunction): TourStep[] {
  return [
    ...getDashboardSteps(t),
    {
      element: '[data-tour="nav-applications"]',
      popover: {
        title: t("tour:yourApplicationsTitle"),
        description: t("tour:yourApplicationsDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-new_application"]',
      popover: {
        title: t("tour:newEnrollmentTitle"),
        description: t("tour:newEnrollmentDesc"),
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-tour="nav-biometrics"]',
      popover: {
        title: t("tour:biometricCaptureTitle"),
        description: t("tour:biometricCaptureDesc"),
        side: "right",
        align: "center",
      },
    },
  ];
}

function getVerificationOfficerDashboardSteps(t: TFunction): TourStep[] {
  return [
    ...getDashboardSteps(t),
    {
      element: '[data-tour="nav-verification"]',
      popover: {
        title: t("tour:pendingVerificationsTitle"),
        description: t("tour:pendingVerificationsDesc"),
        side: "right",
        align: "center",
      },
    },
  ];
}

function getApplicationsSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="app-filters"]',
      popover: {
        title: t("tour:searchFilterTitle"),
        description: t("tour:searchFilterDesc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="app-table"]',
      popover: {
        title: t("tour:applicationsListTitle"),
        description: t("tour:applicationsListDesc"),
        side: "top",
        align: "start",
      },
    },
    {
      element: '[data-tour="new-app-btn"]',
      popover: {
        title: t("tour:createNewApplicationTitle"),
        description: t("tour:createNewApplicationDesc"),
        side: "left",
        align: "center",
      },
    },
  ];
}

function getNewApplicationSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="step-indicator"]',
      popover: {
        title: t("tour:enrollmentWizardTitle"),
        description: t("tour:enrollmentWizardDesc"),
        side: "bottom",
        align: "center",
      },
    },
    {
      element: '[data-tour="personal-info"]',
      popover: {
        title: t("tour:personalInformationTitle"),
        description: t("tour:personalInformationDesc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: '[data-tour="photo-upload"]',
      popover: {
        title: t("tour:applicantPhotoTitle"),
        description: t("tour:applicantPhotoDesc"),
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-tour="form-actions"]',
      popover: {
        title: t("tour:saveOrSubmitTitle"),
        description: t("tour:saveOrSubmitDesc"),
        side: "top",
        align: "end",
      },
    },
  ];
}

function getVerificationSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="verif-stats"]',
      popover: {
        title: t("tour:verificationQueueTitle"),
        description: t("tour:verificationQueueDesc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: '[data-tour="verif-table"]',
      popover: {
        title: t("tour:applicationsToReviewTitle"),
        description: t("tour:applicationsToReviewDesc"),
        side: "top",
        align: "start",
      },
    },
  ];
}

function getVerificationDetailSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="applicant-info"]',
      popover: {
        title: t("tour:applicantDetailsTitle"),
        description: t("tour:applicantDetailsDesc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: '[data-tour="documents"]',
      popover: {
        title: t("tour:supportingDocumentsTitle"),
        description: t("tour:supportingDocumentsDesc"),
        side: "right",
        align: "start",
      },
    },
    {
      element: '[data-tour="review-actions"]',
      popover: {
        title: t("tour:makeYourDecisionTitle"),
        description: t("tour:makeYourDecisionDesc"),
        side: "left",
        align: "start",
      },
    },
  ];
}

function getCardIssuanceSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="issuance-table"]',
      popover: {
        title: t("tour:approvedApplicationsTitle"),
        description: t("tour:approvedApplicationsDesc"),
        side: "top",
        align: "start",
      },
    },
  ];
}

function getAuthoritiesSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="create-auth"]',
      popover: {
        title: t("tour:createAuthorityTitle"),
        description: t("tour:createAuthorityDesc"),
        side: "left",
        align: "center",
      },
    },
    {
      element: '[data-tour="auth-table"]',
      popover: {
        title: t("tour:authoritiesListTitle"),
        description: t("tour:authoritiesListDesc"),
        side: "top",
        align: "start",
      },
    },
  ];
}

function getUsersSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="users-table"]',
      popover: {
        title: t("tour:systemUsersTitle"),
        description: t("tour:systemUsersDesc"),
        side: "top",
        align: "start",
      },
    },
  ];
}

function getAuditSteps(t: TFunction): TourStep[] {
  return [
    {
      element: '[data-tour="audit-table"]',
      popover: {
        title: t("tour:auditTrailTitle"),
        description: t("tour:auditTrailDesc"),
        side: "top",
        align: "start",
      },
    },
  ];
}

export function getStepsForPage(
  role: PlatformRole,
  page: string,
  t: TFunction
): TourStep[] | undefined {
  switch (role) {
    case "super_admin":
      switch (page) {
        case "dashboard": return getSuperAdminDashboardSteps(t);
        case "applications": return getApplicationsSteps(t);
        case "new-application": return getNewApplicationSteps(t);
        case "verification": return getVerificationSteps(t);
        case "verification-detail": return getVerificationDetailSteps(t);
        case "card-issuance": return getCardIssuanceSteps(t);
        case "authorities": return getAuthoritiesSteps(t);
        case "users": return getUsersSteps(t);
        case "audit": return getAuditSteps(t);
      }
      break;
    case "authority_admin":
      switch (page) {
        case "dashboard": return getAuthorityAdminDashboardSteps(t);
        case "applications": return getApplicationsSteps(t);
        case "new-application": return getNewApplicationSteps(t);
        case "verification": return getVerificationSteps(t);
        case "verification-detail": return getVerificationDetailSteps(t);
        case "card-issuance": return getCardIssuanceSteps(t);
        case "users": return getUsersSteps(t);
        case "audit": return getAuditSteps(t);
      }
      break;
    case "operator":
      switch (page) {
        case "dashboard": return getOperatorDashboardSteps(t);
        case "applications": return getApplicationsSteps(t);
        case "new-application": return getNewApplicationSteps(t);
      }
      break;
    case "verification_officer":
      switch (page) {
        case "dashboard": return getVerificationOfficerDashboardSteps(t);
        case "verification": return getVerificationSteps(t);
        case "verification-detail": return getVerificationDetailSteps(t);
      }
      break;
  }
  return undefined;
}

export function getAvailableTourPages(role: PlatformRole): string[] {
  const pages: Record<PlatformRole, string[]> = {
    super_admin: [
      "dashboard",
      "applications",
      "new-application",
      "verification",
      "verification-detail",
      "card-issuance",
      "authorities",
      "users",
      "audit",
    ],
    authority_admin: [
      "dashboard",
      "applications",
      "new-application",
      "verification",
      "verification-detail",
      "card-issuance",
      "users",
      "audit",
    ],
    operator: ["dashboard", "applications", "new-application"],
    verification_officer: ["dashboard", "verification", "verification-detail"],
  };
  return pages[role] || [];
}
