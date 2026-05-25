import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Power,
  PowerOff,
  Trash2,
  Loader2,
  Key,
  FileSignature,
  Shield,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Authorities() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    authorityName: "",
    authorityCode: "",
    registrationNumber: "",
    address: "",
    contactNumber: "",
    email: "",
    digitalSignature: "",
    signatureImageUrl: "",
    signingCertificate: "",
  });
  const { t } = useTranslation(["authorities", "common"]);

  const utils = trpc.useUtils();
  const { data: authorities, isLoading } = trpc.authority.list.useQuery({
    search: search || undefined,
  });

  const createMutation = trpc.authority.create.useMutation({
    onSuccess: (data) => {
      toast.success(t("authorities:createSuccess", { id: data.uniqueAuthorityId }));
      setIsDialogOpen(false);
      resetForm();
      utils.authority.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t("authorities:createError"));
    },
  });

  const updateMutation = trpc.authority.update.useMutation({
    onSuccess: () => {
      toast.success(t("authorities:updateSuccess"));
      setIsDialogOpen(false);
      setEditingId(null);
      resetForm();
      utils.authority.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t("authorities:updateError"));
    },
  });

  const toggleMutation = trpc.authority.toggleStatus.useMutation({
    onSuccess: () => {
      toast.success(t("authorities:statusUpdated"));
      utils.authority.list.invalidate();
    },
  });

  const deleteMutation = trpc.authority.delete.useMutation({
    onSuccess: () => {
      toast.success(t("authorities:deleteSuccess"));
      utils.authority.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({
      authorityName: "",
      authorityCode: "",
      registrationNumber: "",
      address: "",
      contactNumber: "",
      email: "",
      digitalSignature: "",
      signatureImageUrl: "",
      signingCertificate: "",
    });
  };

  const handleEdit = (authority: any) => {
    setEditingId(authority.id);
    setFormData({
      authorityName: authority.authorityName,
      authorityCode: authority.authorityCode,
      registrationNumber: authority.registrationNumber || "",
      address: authority.address || "",
      contactNumber: authority.contactNumber || "",
      email: authority.email || "",
      digitalSignature: authority.digitalSignature || "",
      signatureImageUrl: authority.signatureImageUrl || "",
      signingCertificate: authority.signingCertificate || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t("authorities:searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-slate-200"
          />
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) { setEditingId(null); resetForm(); }
          }}
        >
          <DialogTrigger asChild>
            <Button data-tour="create-auth" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20">
              <Plus size={16} className="mr-1" />
              {t("authorities:addAuthority")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? t("authorities:editAuthority") : t("authorities:createAuthority")}</DialogTitle>
              <DialogDescription>
                {editingId ? t("authorities:editDescription") : t("authorities:createDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("authorities:authorityName")} <span className="text-red-500">*</span></Label>
                  <Input value={formData.authorityName} onChange={(e) => setFormData((p) => ({ ...p, authorityName: e.target.value }))} required className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>{t("authorities:authorityCode")} <span className="text-red-500">*</span></Label>
                  <Input value={formData.authorityCode} onChange={(e) => setFormData((p) => ({ ...p, authorityCode: e.target.value }))} required className="h-10" placeholder="NIA-001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Hash size={14} />
                  {t("authorities:registrationNumber")}
                </Label>
                <Input value={formData.registrationNumber} onChange={(e) => setFormData((p) => ({ ...p, registrationNumber: e.target.value }))} className="h-10" placeholder="GOV-REG-2024-001234" />
              </div>
              <div className="space-y-2">
                <Label>{t("authorities:address")}</Label>
                <Textarea value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("authorities:contactNumber")}</Label>
                  <Input value={formData.contactNumber} onChange={(e) => setFormData((p) => ({ ...p, contactNumber: e.target.value }))} className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label>{t("authorities:email")}</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="h-10" />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={14} className="text-blue-600" />
                  {t("authorities:digitalSignatureConfig")}
                </h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileSignature size={14} />
                      {t("authorities:digitalSignature")}
                    </Label>
                    <Textarea
                      value={formData.digitalSignature}
                      onChange={(e) => setFormData((p) => ({ ...p, digitalSignature: e.target.value }))}
                      rows={3}
                      className="font-mono text-xs"
                      placeholder="-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("authorities:signatureImageUrl")}</Label>
                      <Input value={formData.signatureImageUrl} onChange={(e) => setFormData((p) => ({ ...p, signatureImageUrl: e.target.value }))} className="h-10" placeholder="/signatures/authority.png" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Key size={14} />
                        {t("authorities:signingCertificate")}
                      </Label>
                      <Input value={formData.signingCertificate} onChange={(e) => setFormData((p) => ({ ...p, signingCertificate: e.target.value }))} className="h-10" placeholder="CERT-2026-001" />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? t("authorities:updateAuthority") : t("authorities:create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div data-tour="auth-table" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("authorities:authority")}</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("authorities:uniqueId")}</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("authorities:registration")}</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("authorities:digitalSignatureLabel")}</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("common:status")}</th>
                <th className="text-right px-5 py-3.5 font-semibold text-slate-600 text-xs uppercase tracking-wider">{t("common:actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center">
                    <Loader2 size={24} className="mx-auto text-slate-300 animate-spin mb-2" />
                    <p className="text-slate-400 text-sm">{t("common:loading")}</p>
                  </td>
                </tr>
              ) : authorities?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Building2 size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-500 font-medium">{t("common:noData")}</p>
                  </td>
                </tr>
              ) : (
                authorities?.map((auth) => (
                  <tr key={auth.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Building2 size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{auth.authorityName}</p>
                          <p className="text-xs text-slate-500">{auth.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">{auth.uniqueAuthorityId}</span>
                        <p className="text-[10px] text-slate-400 mt-1">Code: {auth.authorityCode}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-600">{auth.registrationNumber || t("common:nA")}</span>
                    </td>
                    <td className="px-5 py-4">
                      {auth.digitalSignature ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          <Shield size={10} />
                          {t("authorities:configured")}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">{t("authorities:notConfigured")}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        auth.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${auth.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {auth.isActive ? t("common:active") : t("common:inactive")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600" onClick={() => handleEdit(auth)}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-600" onClick={() => toggleMutation.mutate({ id: auth.id })}>
                          {auth.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600" onClick={() => { if (window.confirm(t("authorities:confirmDelete"))) deleteMutation.mutate({ id: auth.id }); }}>
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
      </div>
    </div>
  );
}
