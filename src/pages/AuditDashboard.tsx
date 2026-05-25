import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Download,
  RefreshCw,
  Clock,
  User,
  FileText,
  CreditCard,
  Fingerprint,
  Building2,
  Settings,
  Key,
  Eye,
  Lock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  authentication: Lock,
  authority_management: Building2,
  user_management: User,
  enrollment: FileText,
  document: FileText,
  verification: Eye,
  biometric: Fingerprint,
  card_issuance: CreditCard,
  payment: CreditCard,
  system: Settings,
  api_access: Key,
};

const SEVERITY_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  info: { bg: "bg-blue-100", text: "text-blue-700", icon: Info },
  warning: { bg: "bg-amber-100", text: "text-amber-700", icon: AlertTriangle },
  error: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
  critical: { bg: "bg-red-200", text: "text-red-800", icon: XCircle },
};

export default function AuditDashboard() {
  const platformUser = useAuthStore((s) => s.platformUser);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [successFilter, setSuccessFilter] = useState("all");
  const { t } = useTranslation(["audit", "common"]);

  const { data: auditLogs, isLoading, refetch } = trpc.audit.list.useQuery({
    limit: 50,
    search: search || undefined,
    actionCategory: categoryFilter !== "all" ? categoryFilter : undefined,
    severity: severityFilter !== "all" ? severityFilter : undefined,
    success: successFilter === "success" ? true : successFilter === "failed" ? false : undefined,
  });

  const { data: auditStats } = trpc.audit.stats.useQuery();
  const { data: integrityCheck } = trpc.audit.verifyIntegrity.useQuery();
  const { data: recentActivity } = trpc.audit.recentActivity.useQuery({ limit: 10 });

  const { data: exportData, refetch: refetchExport } = trpc.audit.export.useQuery(
    { format: "json" },
    { enabled: false }
  );

  const handleExport = async (format: "json" | "csv") => {
    const result = await refetchExport({ format });
    if (result.data) {
      const blob = new Blob([result.data.content], { type: format === "csv" ? "text/csv" : "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split("T")[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const categories = [
    { value: "all", label: t("audit:allCategories") },
    { value: "authentication", label: t("audit:authentication") },
    { value: "authority_management", label: t("audit:authorityManagement") },
    { value: "user_management", label: t("audit:userManagement") },
    { value: "enrollment", label: t("audit:enrollment") },
    { value: "document", label: t("audit:documents") },
    { value: "verification", label: t("audit:verification") },
    { value: "biometric", label: t("audit:biometric") },
    { value: "card_issuance", label: t("audit:cardIssuance") },
    { value: "payment", label: t("audit:payment") },
    { value: "system", label: t("audit:system") },
    { value: "api_access", label: t("audit:apiAccess") },
  ];

  const severityOptions = [
    { value: "all", label: t("audit:allSeverity") },
    { value: "info", label: t("audit:info") },
    { value: "warning", label: t("audit:warning") },
    { value: "error", label: t("audit:error") },
    { value: "critical", label: t("audit:critical") },
  ];

  const statusOptions = [
    { value: "all", label: t("audit:allStatus") },
    { value: "success", label: t("audit:success") },
    { value: "failed", label: t("audit:failed") },
  ];

  const getCategoryLabel = (value: string) => {
    const cat = categories.find((c) => c.value === value);
    return cat?.label || value;
  };

  const getSeverityLabel = (value: string) => {
    const sev = severityOptions.find((s) => s.value === value);
    return sev?.label || value;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Integrity Check Banner */}
      {integrityCheck && (
        <Card className={`border-2 shadow-sm ${
          integrityCheck.isValid ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/50"
        }`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${integrityCheck.isValid ? "bg-emerald-100" : "bg-red-100"}`}>
                {integrityCheck.isValid ? (
                  <Shield size={20} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={20} className="text-red-600" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${integrityCheck.isValid ? "text-emerald-900" : "text-red-900"}`}>
                  {integrityCheck.isValid ? t("audit:integrityVerified") : t("audit:integrityCompromised")}
                </p>
                <p className={`text-xs ${integrityCheck.isValid ? "text-emerald-700" : "text-red-700"}`}>
                  {integrityCheck.isValid
                    ? t("audit:integrityDetail", { count: integrityCheck.totalLogs })
                    : t("audit:integrityBroken", { id: integrityCheck.brokenChainAt })}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw size={14} className="mr-1" />
              {t("audit:reverify")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {auditStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{auditStats.total}</p>
                <p className="text-xs text-slate-500">{t("audit:totalLogs")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{auditStats.total - auditStats.failedActions}</p>
                <p className="text-xs text-slate-500">{t("audit:successful")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{auditStats.failedActions}</p>
                <p className="text-xs text-slate-500">{t("audit:failedActions")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{auditStats.bySeverity?.find((s: any) => s.severity === "warning")?.count || 0}</p>
                <p className="text-xs text-slate-500">{t("audit:warnings")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t("audit:searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-slate-200"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px] h-10 border-slate-200">
            <SelectValue placeholder={t("audit:allCategories")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px] h-10 border-slate-200">
            <SelectValue placeholder={t("audit:allSeverity")} />
          </SelectTrigger>
          <SelectContent>
            {severityOptions.map((sev) => (
              <SelectItem key={sev.value} value={sev.value}>{sev.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={successFilter} onValueChange={setSuccessFilter}>
          <SelectTrigger className="w-[140px] h-10 border-slate-200">
            <SelectValue placeholder={t("audit:allStatus")} />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((st) => (
              <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport("csv")} className="h-10">
            <Download size={14} className="mr-1" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport("json")} className="h-10">
            <Download size={14} className="mr-1" />
            JSON
          </Button>
        </div>
      </div>

      {/* Activity Timeline */}
      {recentActivity && recentActivity.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              {t("audit:recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((log: any) => {
                const Icon = CATEGORY_ICONS[log.actionCategory] || FileText;
                const severityStyle = SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.info;
                const SeverityIcon = severityStyle.icon;
                return (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${severityStyle.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={14} className={severityStyle.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900">{log.action}</p>
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                          {getCategoryLabel(log.actionCategory)}
                        </Badge>
                        {!log.success && (
                          <Badge variant="destructive" className="text-[10px] h-5 px-1.5">{t("audit:failed")}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {log.userName} ({log.userRole?.replace("_", " ")})
                        {log.entityRef && ` • ${log.entityRef}`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ""}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Log Table */}
      <Card data-tour="audit-table" className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            {t("audit:auditLog")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("audit:timestamp")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("audit:user")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("audit:action")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("audit:category")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("audit:severity")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("audit:status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">{t("audit:loading")}</td>
                  </tr>
                ) : auditLogs?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      <Shield size={32} className="mx-auto text-slate-300 mb-2" />
                      {t("audit:noLogs")}
                    </td>
                  </tr>
                ) : (
                  auditLogs?.map((log: any) => {
                    const severityStyle = SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.info;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{log.userName}</p>
                            <p className="text-xs text-slate-500">{log.userRole?.replace("_", " ")}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700">{log.action}</p>
                          {log.details && <p className="text-xs text-slate-400 truncate max-w-xs">{log.details}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px]">
                            {getCategoryLabel(log.actionCategory)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${severityStyle.bg} ${severityStyle.text}`}>
                            <severityStyle.icon size={10} />
                            {getSeverityLabel(log.severity)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {log.success ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2 size={12} />
                              {t("audit:success")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600">
                              <XCircle size={12} />
                              {t("audit:failed")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
