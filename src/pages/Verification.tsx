import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Eye,
  Clock,
  AlertCircle,
  ShieldCheck,
  FileWarning,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Verification() {
  const { t } = useTranslation(["verification", "common"]);
  const [search, setSearch] = useState("");

  const { data: pendingApps, isLoading } =
    trpc.verification.listPending.useQuery({
      search: search || undefined,
    });

  const pendingCount = pendingApps?.filter((a) => a.status === "submitted").length || 0;
  const underReviewCount = pendingApps?.filter((a) => a.status === "under_review").length || 0;
  const correctionCount = pendingApps?.filter((a) => a.status === "correction_requested").length || 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Stats */}
      <div data-tour="verif-stats" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Clock}
          value={pendingCount}
          label={t("pendingReview")}
          color="blue"
        />
        <StatCard
          icon={AlertCircle}
          value={underReviewCount}
          label={t("underReview")}
          color="amber"
        />
        <StatCard
          icon={FileWarning}
          value={correctionCount}
          label={t("correctionRequested")}
          color="purple"
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Applications List */}
      <div data-tour="verif-table" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  {t("applicant")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  {t("authority")}
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  {t("submitted")}
                </th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 rounded" />
                          <div className="h-3 w-24 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-5 w-24 bg-slate-200 rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-8 w-20 bg-slate-200 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : pendingApps?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <ShieldCheck size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">{t("noPending")}</p>
                    <p className="text-sm text-slate-400 mt-1">{t("allReviewed")}</p>
                  </td>
                </tr>
              ) : (
                pendingApps?.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
                          {(app.firstName?.[0] || "") + (app.lastName?.[0] || "")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{app.firstName} {app.lastName}</p>
                          <p className="text-xs text-slate-500">{app.mobileNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm">
                      {app.authorityName || t("common:nA")}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : t("common:nA")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <Link to={`/verification/${app.id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm">
                            <Eye size={14} className="mr-1" />
                            {t("review")}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: React.ElementType; value: number; label: string; color: string }) {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
  };
  const colors = colorMap[color] || colorMap.blue;

  return (
    <Card className={`border ${colors.border} shadow-sm`}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon size={22} className={colors.icon} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation("common");
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    submitted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    under_review: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    correction_requested: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  };
  const s = styles[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {t(`status.${status}` as any)}
    </span>
  );
}
