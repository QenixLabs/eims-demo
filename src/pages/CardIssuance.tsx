import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  CreditCard,
  CheckCircle2,
  Eye,
  Printer,
  Download,
  IdCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function CardIssuance() {
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();

  const { data: approvedApps, isLoading } = trpc.enrollment.list.useQuery({
    status: "approved",
    search: search || undefined,
  });

  const { data: issuedCards } = trpc.card.list.useQuery();

  const issueMutation = trpc.card.issue.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Identity card issued: ${data.identityNumber}`);
        utils.enrollment.list.invalidate();
        utils.card.list.invalidate();
      } else {
        toast.error(data.error || "Failed to issue card");
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to issue card");
    },
  });

  const handleIssue = (applicationId: number) => {
    if (window.confirm("Issue identity card for this application?")) {
      issueMutation.mutate({ applicationId });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-blue-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <CreditCard size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{approvedApps?.length || 0}</p>
              <p className="text-xs text-slate-500">Ready to Issue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{issuedCards?.length || 0}</p>
              <p className="text-xs text-slate-500">Cards Issued</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approved Applications */}
      <div data-tour="issuance-table" className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <IdCard size={18} className="text-blue-600" />
            Approved Applications - Ready for Issuance
          </h3>
        </div>
        <div className="p-5">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search approved applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 border-slate-200"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Applicant</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Authority</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Approved Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center">
                      <Loader2 size={24} className="mx-auto text-slate-300 animate-spin mb-2" />
                      <p className="text-slate-400 text-sm">Loading...</p>
                    </td>
                  </tr>
                ) : approvedApps?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <CreditCard size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium">No approved applications</p>
                      <p className="text-sm text-slate-400 mt-1">Approved applications will appear here</p>
                    </td>
                  </tr>
                ) : (
                  approvedApps?.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                            {app.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{app.fullName}</p>
                            <p className="text-xs text-slate-500">{app.mobileNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{app.authorityName || "N/A"}</td>
                      <td className="px-4 py-3 text-slate-500 text-sm">
                        {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm"
                            onClick={() => handleIssue(app.id)}
                            disabled={issueMutation.isPending}
                          >
                            {issueMutation.isPending ? (
                              <Loader2 size={14} className="mr-1 animate-spin" />
                            ) : (
                              <CreditCard size={14} className="mr-1" />
                            )}
                            Issue Card
                          </Button>
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

      {/* Issued Cards */}
      {issuedCards && issuedCards.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Issued Identity Cards
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Card Number</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Issue Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issuedCards.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        {card.identityNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 text-[10px] font-semibold">
                          {card.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">{card.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">
                      {card.issuedAt ? new Date(card.issuedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        card.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${card.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link to={`/card-issuance/${card.applicationId}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600">
                            <Eye size={14} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <Printer size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <Download size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
