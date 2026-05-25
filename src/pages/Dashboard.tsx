import { useAuthStore } from "@/store/authStore";
import { trpc } from "@/providers/trpc";
import {
  Building2,
  FileText,
  IdCard,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899"];

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (endValue - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function Dashboard() {
  const { t } = useTranslation(["dashboard", "common"]);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin());
  const { data: superAdminStats } = trpc.dashboard.superAdmin.useQuery(
    undefined,
    { enabled: isSuperAdmin }
  );
  const { data: overviewStats } = trpc.dashboard.overview.useQuery();

  const statusBreakdown = superAdminStats?.statusBreakdown || [];
  const pieData = statusBreakdown.map((s) => ({
    name: t(`common:status.${s.status}` as any),
    value: s.count,
    rawStatus: s.status,
  }));

  const recentApplications = overviewStats?.recentApplications || [];

  const trendData = [
    { day: "Mon", applications: 12, issued: 8 },
    { day: "Tue", applications: 19, issued: 12 },
    { day: "Wed", applications: 15, issued: 10 },
    { day: "Thu", applications: 22, issued: 15 },
    { day: "Fri", applications: 18, issued: 14 },
    { day: "Sat", applications: 8, issued: 6 },
    { day: "Sun", applications: 5, issued: 4 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div data-tour="welcome-banner" className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">{isSuperAdmin ? t("welcomeAdmin") : t("welcomeUser")}</h2>
          <p className="mt-1 text-blue-100">{t("subtitle")}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/applications/new"
              className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <FileText size={16} />
              {t("newApplication")}
            </Link>
            <Link
              to="/verification"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <CheckCircle size={16} />
              {t("pendingVerifications")}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div data-tour="stats-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("totalAuthorities")}
          value={superAdminStats?.totalAuthorities || 0}
          icon={Building2}
          color="blue"
          link="/authorities"
          trend={t("trendMonth")}
        />
        <StatCard
          title={t("totalApplications")}
          value={superAdminStats?.totalApplications || 0}
          icon={FileText}
          color="indigo"
          link="/applications"
          trend={t("trendWeek")}
        />
        <StatCard
          title={t("cardsIssued")}
          value={superAdminStats?.totalCards || 0}
          icon={IdCard}
          color="emerald"
          link="/card-issuance"
          trend={t("trendToday")}
        />
        <StatCard
          title={t("systemUsers")}
          value={superAdminStats?.totalUsers || 0}
          icon={Users}
          color="amber"
          link="/users"
          trend={t("trendActive")}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SecondaryStatCard
          title={t("pendingVerification")}
          value={statusBreakdown.find((s) => s.status === "submitted")?.count || 0}
          icon={Clock}
          color="blue"
        />
        <SecondaryStatCard
          title={t("approved")}
          value={statusBreakdown.find((s) => s.status === "approved")?.count || 0}
          icon={CheckCircle}
          color="emerald"
        />
        <SecondaryStatCard
          title={t("rejected")}
          value={statusBreakdown.find((s) => s.status === "rejected")?.count || 0}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{t("weeklyOverview")}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{t("weeklySubtitle")}</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-600">{t("chartApplications")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">{t("chartIssued")}</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorApplications)"
                />
                <Area
                  type="monotone"
                  dataKey="issued"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorIssued)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-2">{t("statusDistribution")}</h3>
          <p className="text-sm text-slate-500 mb-4">{t("statusSubtitle")}</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.slice(0, 5).map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-slate-600 capitalize">{entry.name}</span>
                </div>
                <span className="text-xs font-medium text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div data-tour="recent-apps" className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{t("recentApplications")}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{t("recentSubtitle")}</p>
          </div>
          <Link
            to="/applications"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            {t("viewAll")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentApplications.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">{t("noApplications")}</p>
              <p className="text-sm text-slate-400 mt-1">{t("noApplicationsSubtitle")}</p>
            </div>
          ) : (
            recentApplications.map((app, index) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 text-xs font-semibold group-hover:scale-110 transition-transform">
                    {(app.firstName?.[0] || "") + (app.lastName?.[0] || "")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      ID: {app.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} />
                  <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  link,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  link: string;
  trend?: string;
}) {
  const colorMap: Record<string, { gradient: string }> = {
    blue: { gradient: "from-blue-500 to-blue-600" },
    indigo: { gradient: "from-indigo-500 to-indigo-600" },
    emerald: { gradient: "from-emerald-500 to-emerald-600" },
    amber: { gradient: "from-amber-500 to-amber-600" },
    red: { gradient: "from-red-500 to-red-600" },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <Link
      to={link}
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300 block"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            <AnimatedCounter value={value} />
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} />
        </div>
      </div>
    </Link>
  );
}

function SecondaryStatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-200" },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white rounded-xl border ${colors.border} p-5 flex items-center gap-4 hover:shadow-md transition-shadow`}>
      <div className={`p-3 rounded-xl ${colors.bg}`}>
        <Icon size={22} className={colors.icon} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">
          <AnimatedCounter value={value} />
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation("common");
  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    draft: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    submitted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    under_review: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    correction_requested: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    issued: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  };

  const styles = statusStyles[status] || statusStyles.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {t(`status.${status}` as any)}
    </span>
  );
}
