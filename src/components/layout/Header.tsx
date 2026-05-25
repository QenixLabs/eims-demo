import { Search, Bell, Plus, HelpCircle } from "lucide-react";
import { useLocation } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { useTour } from "@/components/tour/TourProvider";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation(["header", "common"]);
  const location = useLocation();
  const platformUser = useAuthStore((s) => s.platformUser);
  const isOperator = useAuthStore((s) => s.isOperator());
  const isAdmin = useAuthStore((s) => s.isSuperAdmin() || s.isAuthorityAdmin());
  const { startTour, hasTourForPage } = useTour();

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === "/") return { title: t("dashboardTitle"), subtitle: t("dashboardSubtitle") };
    if (path === "/applications") return { title: t("applicationsTitle"), subtitle: t("applicationsSubtitle") };
    if (path === "/applications/new") return { title: t("newApplicationTitle"), subtitle: t("newApplicationSubtitle") };
    if (path === "/verification") return { title: t("verificationTitle"), subtitle: t("verificationSubtitle") };
    if (path === "/card-issuance") return { title: t("cardIssuanceTitle"), subtitle: t("cardIssuanceSubtitle") };
    if (path === "/authorities") return { title: t("authoritiesTitle"), subtitle: t("authoritiesSubtitle") };
    if (path === "/users") return { title: t("usersTitle"), subtitle: t("usersSubtitle") };
    if (path === "/verify") return { title: t("verifyCardTitle"), subtitle: t("verifyCardSubtitle") };
    if (path === "/settings") return { title: t("settingsTitle"), subtitle: t("settingsSubtitle") };
    if (path.startsWith("/applications/")) return { title: t("applicationDetailsTitle"), subtitle: t("applicationDetailsSubtitle") };
    if (path.startsWith("/verification/")) return { title: t("reviewApplicationTitle"), subtitle: t("reviewApplicationSubtitle") };
    if (path.startsWith("/card-issuance/")) return { title: t("issueCardTitle"), subtitle: t("issueCardSubtitle") };
    return { title: t("defaultTitle"), subtitle: t("defaultSubtitle") };
  };

  const pageInfo = getPageInfo();
  const canCreate = isOperator || isAdmin;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 lg:left-[260px] right-0 z-30 flex items-center px-6">
      <div className="flex items-center flex-1 min-w-0">
        {/* Breadcrumb / Title */}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 truncate">{pageInfo.title}</h2>
          <p className="text-xs text-slate-500 truncate hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 justify-center max-w-md mx-8">
        <div className="relative w-full group">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {canCreate && (
          <a
            href="/applications/new"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <Plus size={16} />
            <span>{t("common:quickEnroll")}</span>
          </a>
        )}
        {hasTourForPage("dashboard") && (
          <button
            onClick={() => startTour()}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title={t("common:startTour")}
          >
            <HelpCircle size={18} />
          </button>
        )}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {platformUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-900">{platformUser?.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{platformUser?.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
