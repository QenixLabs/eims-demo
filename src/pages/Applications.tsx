import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Filter,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "correction_requested", label: "Correction Requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "issued", label: "Issued" },
];

export default function Applications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isOperator = useAuthStore((s) => s.isOperator());
  const isAdmin = useAuthStore((s) => s.isSuperAdmin() || s.isAuthorityAdmin());
  const canCreate = isOperator || isAdmin;

  const utils = trpc.useUtils();
  const { data: applications, isLoading } = trpc.enrollment.list.useQuery({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const deleteMutation = trpc.enrollment.delete.useMutation({
    onSuccess: () => {
      toast.success("Application deleted successfully");
      utils.enrollment.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete application");
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <FileText size={12} />;
      case "submitted": return <Clock size={12} />;
      case "under_review": return <AlertCircle size={12} />;
      case "correction_requested": return <AlertCircle size={12} />;
      case "approved": return <CheckCircle2 size={12} />;
      case "rejected": return <XCircle size={12} />;
      case "issued": return <CheckCircle2 size={12} />;
      default: return <FileText size={12} />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search by name, ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-10 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {canCreate && (
          <Link to="/applications/new">
            <Button className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20">
              <Plus size={16} className="mr-1" />
              New Application
            </Button>
          </Link>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  ID
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Applicant
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Authority
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-slate-200 rounded" />
                          <div className="h-3 w-24 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-8 w-24 bg-slate-200 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : applications?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">No applications found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {search || statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Create your first application to get started"}
                    </p>
                    {canCreate && !search && statusFilter === "all" && (
                      <Link to="/applications/new">
                        <Button variant="outline" className="mt-4">
                          <Plus size={14} className="mr-1" />
                          New Application
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                applications?.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <span className="text-slate-400 font-mono text-xs">
                        #{app.id.toString().padStart(4, "0")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/applications/${app.id}`} className="flex items-center gap-3 group/link">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 text-xs font-semibold group-hover/link:scale-110 transition-transform">
                          {app.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 group-hover/link:text-blue-600 transition-colors">
                            {app.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {app.mobileNumber}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} icon={getStatusIcon(app.status)} />
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm">
                      {app.authorityName || "N/A"}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link to={`/applications/${app.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                            <Eye size={14} />
                          </Button>
                        </Link>
                        {app.status === "draft" && (
                          <Link to={`/applications/${app.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600">
                              <Pencil size={14} />
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && applications && applications.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {applications.length} application{applications.length !== 1 ? "s" : ""}</span>
            <Link to="/applications/new" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
              <Plus size={12} />
              Add new
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, icon }: { status: string; icon: React.ReactNode }) {
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
      {icon}
      {status.replace("_", " ")}
    </span>
  );
}
