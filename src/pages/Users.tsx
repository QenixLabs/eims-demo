import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Pencil,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "operator" as string,
  });
  const { t } = useTranslation(["users", "common"]);

  const platformUser = useAuthStore((s) => s.platformUser);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin());

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.platformUser.list.useQuery({
    search: search || undefined,
    authorityId: isSuperAdmin ? undefined : platformUser?.authorityId || undefined,
  });

  const createMutation = trpc.platformUser.create.useMutation({
    onSuccess: () => {
      toast.success(t("users:createSuccess"));
      setIsDialogOpen(false);
      resetForm();
      utils.platformUser.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t("users:createError"));
    },
  });

  const updateMutation = trpc.platformUser.update.useMutation({
    onSuccess: () => {
      toast.success(t("users:updateSuccess"));
      setIsDialogOpen(false);
      setEditingId(null);
      resetForm();
      utils.platformUser.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t("users:updateError"));
    },
  });

  const toggleMutation = trpc.platformUser.toggleStatus.useMutation({
    onSuccess: () => {
      toast.success(t("users:statusUpdated"));
      utils.platformUser.list.invalidate();
    },
  });

  const deleteMutation = trpc.platformUser.delete.useMutation({
    onSuccess: () => {
      toast.success(t("users:deleteSuccess"));
      utils.platformUser.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "operator" });
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updateData: any = {
        id: editingId,
        name: formData.name,
        email: formData.email,
        role: formData.role as any,
      };
      updateMutation.mutate(updateData);
    } else {
      if (!formData.password) {
        toast.error(t("users:passwordRequired"));
        return;
      }
      createMutation.mutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as any,
        authorityId: platformUser?.authorityId || undefined,
      });
    }
  };

  const roleOptions = [
    { value: "operator", label: t("users:enrollmentOperator") },
    { value: "verification_officer", label: t("users:verificationOfficer") },
    { value: "authority_admin", label: t("users:authorityAdmin") },
    { value: "super_admin", label: t("users:superAdmin") },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder={t("users:searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingId(null);
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-1" />
              {t("users:addUser")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? t("users:editUser") : t("users:createUser")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {t("users:name")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {t("users:email")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <Label>
                    {t("users:password")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                    required={!editingId}
                    minLength={6}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>{t("users:role")}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, role: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.filter((r) =>
                      isSuperAdmin ? true : r.value !== "super_admin"
                    ).map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? t("users:updateUser") : t("users:create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div data-tour="users-table" className="bg-white rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>{t("users:name")}</TableHead>
              <TableHead>{t("users:email")}</TableHead>
              <TableHead>{t("users:role")}</TableHead>
              <TableHead>{t("common:status")}</TableHead>
              <TableHead className="text-right">{t("common:actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-400 py-8"
                >
                  {t("common:loading")}
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-400 py-8"
                >
                  {t("users:noUsers")}
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                        {user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {user.role.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.isActive ? t("common:active") : t("common:inactive")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil size={14} className="text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          toggleMutation.mutate({ id: user.id })
                        }
                      >
                        {user.isActive ? (
                          <PowerOff size={14} className="text-amber-500" />
                        ) : (
                          <Power size={14} className="text-emerald-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (window.confirm(t("users:confirmDelete")))
                            deleteMutation.mutate({ id: user.id });
                        }}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
