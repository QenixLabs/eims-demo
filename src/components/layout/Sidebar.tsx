import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  CheckCircle,
  IdCard,
  Building2,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  route: string;
  badge?: string;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    route: "/",
    roles: ["super_admin", "authority_admin", "operator", "verification_officer"],
  },
  {
    id: "applications",
    label: "Applications",
    icon: FileText,
    route: "/applications",
    roles: ["super_admin", "authority_admin", "operator", "verification_officer"],
  },
  {
    id: "new_application",
    label: "New Application",
    icon: UserPlus,
    route: "/applications/new",
    roles: ["super_admin", "authority_admin", "operator"],
  },
  {
    id: "verification",
    label: "Verification",
    icon: CheckCircle,
    route: "/verification",
    badge: "Pending",
    roles: ["super_admin", "authority_admin", "verification_officer"],
  },

  {
    id: "card_issuance",
    label: "Card Issuance",
    icon: IdCard,
    route: "/card-issuance",
    roles: ["super_admin", "authority_admin"],
  },
  {
    id: "authorities",
    label: "Authorities",
    icon: Building2,
    route: "/authorities",
    roles: ["super_admin"],
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    route: "/users",
    roles: ["super_admin", "authority_admin"],
  },
  {
    id: "audit",
    label: "Audit Log",
    icon: Shield,
    route: "/audit",
    roles: ["super_admin", "authority_admin"],
  },
  {
    id: "verify_card",
    label: "Verify Card",
    icon: ShieldCheck,
    route: "/verify",
    roles: ["super_admin", "authority_admin", "operator", "verification_officer"],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    route: "/settings",
    roles: ["super_admin", "authority_admin", "operator", "verification_officer"],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const platformUser = useAuthStore((s) => s.platformUser);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) => {
    if (!platformUser) return false;
    return item.roles.includes(platformUser.role);
  });

  const isActive = (route: string) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        data-tour="sidebar-nav"
        className={cn(
          "fixed left-0 top-0 h-screen w-[260px] bg-slate-900 z-40 flex flex-col transition-transform duration-300 ease-out shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight tracking-tight">
                Earth Card
              </h1>
              <p className="text-slate-500 text-[10px] leading-tight font-medium">
                Identity Management
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {filteredNavItems.map((item, index) => (
              <Link
                key={item.id}
                to={item.route}
                data-tour={`nav-${item.id}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group",
                  isActive(item.route)
                    ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-white shadow-lg shadow-blue-500/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {isActive(item.route) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                )}
                <item.icon
                  size={18}
                  className={cn(
                    "transition-colors",
                    isActive(item.route) ? "text-blue-400" : "group-hover:text-white"
                  )}
                />
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/25">
                    {item.badge}
                  </span>
                )}
                {isActive(item.route) && (
                  <ChevronRight size={14} className="text-blue-400" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User info & logout */}
        {platformUser && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {platformUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {platformUser.name}
                </p>
                <p className="text-slate-500 text-[10px] truncate capitalize font-medium">
                  {platformUser.role.replace("_", " ")}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
            >
              <LogOut size={16} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
