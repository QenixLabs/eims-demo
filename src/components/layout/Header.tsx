import { Search, Bell, Plus, User } from "lucide-react";
import { useLocation } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Overview of your identity management system" },
  "/applications": { title: "Applications", subtitle: "Manage and track all identity applications" },
  "/applications/new": { title: "New Application", subtitle: "Create a new identity application" },
  "/verification": { title: "Verification", subtitle: "Review and verify pending applications" },
  "/card-issuance": { title: "Card Issuance", subtitle: "Issue and manage identity cards" },
  "/authorities": { title: "Authorities", subtitle: "Manage issuing authorities" },
  "/users": { title: "Users", subtitle: "Manage system users and permissions" },
  "/verify": { title: "Verify Card", subtitle: "Verify identity card authenticity" },
  "/settings": { title: "Settings", subtitle: "Manage your account preferences" },
};

export default function Header() {
  const location = useLocation();
  const platformUser = useAuthStore((s) => s.platformUser);
  const isOperator = useAuthStore((s) => s.isOperator());
  const isAdmin = useAuthStore((s) => s.isSuperAdmin() || s.isAuthorityAdmin());

  const getPageInfo = () => {
    const path = location.pathname;
    if (routeTitles[path]) return routeTitles[path];
    if (path.startsWith("/applications/")) return { title: "Application Details", subtitle: "View application information" };
    if (path.startsWith("/verification/")) return { title: "Review Application", subtitle: "Verify applicant details" };
    if (path.startsWith("/card-issuance/")) return { title: "Issue Card", subtitle: "Generate identity card" };
    return { title: "Earth Card IMS", subtitle: "Identity Management System" };
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
            placeholder="Search applications, cardholders..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {canCreate && (
          <a
            href="/applications/new"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <Plus size={16} />
            <span>Quick Enroll</span>
          </a>
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
