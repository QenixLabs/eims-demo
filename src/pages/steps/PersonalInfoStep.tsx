import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { FormState } from "../NewApplication";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

interface Props {
  formData: FormState;
  updateField: (field: string, value: string) => void;
}

export function PersonalInfoStep({ formData, updateField }: Props) {
  const { t } = useTranslation("personalInfo");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nationalityMode, setNationalityMode] = useState<"Congolis" | "Others">(
    formData.nationality === "Congolis" ? "Congolis" : formData.nationality ? "Others" : "Congolis"
  );
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("uploadFailed"));
        return;
      }
      updateField("photoUrl", data.url);
    } catch {
      toast.error(t("uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const handleNationalityChange = (mode: "Congolis" | "Others") => {
    setNationalityMode(mode);
    if (mode === "Congolis") {
      updateField("nationality", "Congolis");
    } else {
      updateField("nationality", "");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <CardTitle className="text-base">{t("title")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm">
                  {t("firstName")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder={t("enterFirstName")}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-sm">
                  {t("middleName")}
                </Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                  placeholder={t("enterMiddleName")}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm">
                  {t("lastName")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder={t("enterLastName")}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm">
                  {t("dateOfBirth")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  {t("sex")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v) => updateField("gender", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">{t("male")}</SelectItem>
                    <SelectItem value="Female">{t("female")}</SelectItem>
                    <SelectItem value="Other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="text-sm">{t("bloodGroup")}</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(v) => updateField("bloodGroup", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  {t("maritalStatus")}
                </Label>
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(v) => updateField("maritalStatus", v)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUSES.map((ms) => (
                      <SelectItem key={ms} value={ms}>{t(ms.toLowerCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  {t("nationality")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={nationalityMode}
                  onValueChange={(v) => handleNationalityChange(v as "Congolis" | "Others")}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Congolis">{t("congolis")}</SelectItem>
                    <SelectItem value="Others">{t("others")}</SelectItem>
                  </SelectContent>
                </Select>
                {nationalityMode === "Others" && (
                  <Input
                    value={formData.nationality === "Congolis" ? "" : formData.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                    placeholder={t("enterNationality")}
                    className="h-10 mt-2"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="educationLevel" className="text-sm">{t("educationLevel")}</Label>
                <Input
                  id="educationLevel"
                  value={formData.educationLevel}
                  onChange={(e) => updateField("educationLevel", e.target.value)}
                  placeholder={t("enterEducation")}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-sm">{t("profession")}</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => updateField("profession", e.target.value)}
                  placeholder={t("enterProfession")}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalAddress" className="text-sm">{t("professionalAddress")}</Label>
              <Input
                id="professionalAddress"
                value={formData.professionalAddress}
                onChange={(e) => updateField("professionalAddress", e.target.value)}
                placeholder={t("enterProfessionalAddress")}
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Camera size={16} className="text-blue-600" />
              </div>
              <CardTitle className="text-base">{t("photo")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {uploading ? (
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                <Loader2 size={32} className="text-blue-500 animate-spin" />
                <span className="text-sm font-medium text-slate-600">{t("uploading")}</span>
              </div>
            ) : formData.photoUrl ? (
              <div className="relative group">
                <img
                  src={formData.photoUrl}
                  alt="Applicant"
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"
                >
                  <span className="text-white text-sm font-medium">{t("changePhoto")}</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User size={28} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                    {t("clickToUpload")}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{t("photoFormat")}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function validatePersonalInfo(formData: FormState): boolean {
  return !!(formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender && formData.nationality);
}
