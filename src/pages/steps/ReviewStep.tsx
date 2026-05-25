import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Contact,
  FileText,
  Fingerprint,
  CreditCard,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FormState } from "../NewApplication";

interface Props {
  formData: FormState;
}

export function ReviewStep({ formData }: Props) {
  const { t } = useTranslation(["review", "common"]);

  return (
    <div className="space-y-5">
      {/* Personal Info */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            {t("personalInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <ReviewItem label={t("firstName")} value={formData.firstName} />
            <ReviewItem label={t("middleName")} value={formData.middleName || t("common:nA")} />
            <ReviewItem label={t("lastName")} value={formData.lastName} />
            <ReviewItem label={t("dateOfBirth")} value={formData.dateOfBirth} />
            <ReviewItem label={t("sex")} value={formData.gender} />
            <ReviewItem label={t("bloodGroup")} value={formData.bloodGroup || t("common:nA")} />
            <ReviewItem label={t("nationality")} value={formData.nationality} />
            <ReviewItem label={t("maritalStatus")} value={formData.maritalStatus || t("common:nA")} />
            <ReviewItem label={t("educationLevel")} value={formData.educationLevel || t("common:nA")} />
            <ReviewItem label={t("profession")} value={formData.profession || t("common:nA")} />
            <ReviewItem label={t("professionalAddress")} value={formData.professionalAddress || t("common:nA")} className="col-span-2" />
          </div>
          {formData.photoUrl && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Camera size={16} className="text-slate-400" />
              <img
                src={formData.photoUrl}
                alt="Photo"
                className="w-12 h-16 object-cover rounded border"
              />
              <span className="text-xs text-slate-500">{t("photoAttached")}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Contact size={14} className="text-blue-600" />
            </div>
            {t("contactDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ReviewItem label={t("mobileNumber")} value={formData.mobileNumber} />
            <ReviewItem label={t("email")} value={formData.email || t("common:nA")} />
            <ReviewItem label={t("address")} value={formData.address} className="col-span-2 sm:col-span-1" />
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText size={14} className="text-blue-600" />
            </div>
            {t("documents")}
            <Badge variant="secondary" className="ml-2">
              {formData.documents.length} {formData.documents.length === 1 ? t("files") : t("files_plural")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.documents.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">{t("noDocuments")}</p>
          ) : (
            <div className="space-y-2">
              {formData.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{doc.fileName}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {doc.documentType.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Biometrics */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Fingerprint size={14} className="text-blue-600" />
            </div>
            {t("biometrics")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.biometrics.isCaptured ? (
              <>
                <Badge className="bg-blue-100 text-blue-700">{t("common:status.captured")}</Badge>
                {formData.biometrics.isVerified ? (
                  <Badge className="bg-emerald-100 text-emerald-700">{t("common:status.verified")}</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700">{t("pendingVerification")}</Badge>
                )}
                {formData.biometrics.dedupResult === "pass" && (
                  <Badge className="bg-emerald-100 text-emerald-700">{t("unique")}</Badge>
                )}
                {formData.biometrics.dedupResult === "fail" && (
                  <Badge className="bg-red-100 text-red-700">{t("duplicateDetected")}</Badge>
                )}
              </>
            ) : formData.biometrics.fingerprints.length > 0 ? (
              <Badge className="bg-amber-100 text-amber-700">{t("locallyCaptured")}</Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-500">{t("notCaptured")}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <CreditCard size={14} className="text-blue-600" />
            </div>
            {t("payment")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.payment.paymentId ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ReviewItem label={t("amountLabel")} value={`$${formData.payment.amount}`} />
              <ReviewItem label={t("methodLabel")} value={formData.payment.paymentMethod.replace("_", " ")} />
              <ReviewItem label={t("receiptNo")} value={formData.payment.receiptNumber} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge className="bg-slate-100 text-slate-500">{t("notRecorded")}</Badge>
              {formData.payment.receiptNumber && (
                <span className="text-xs text-slate-500">
                  {t("receiptEntered", { receipt: formData.payment.receiptNumber })}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Identity Card Preview */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShieldCheck size={14} className="text-blue-600" />
            </div>
            {t("cardPreview")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl text-white max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-blue-300" />
              <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Earth Card</span>
            </div>
            <p className="text-lg font-bold">{`${formData.firstName} ${formData.lastName}` || t("applicantName")}</p>
            <p className="text-xs text-blue-300 mt-1">
              DOB: {formData.dateOfBirth || t("common:nA")} | {formData.gender || t("common:nA")}
            </p>
            <p className="text-[10px] text-blue-300 uppercase tracking-widest mt-3">{t("identityNumber")}</p>
            <p className="text-sm font-mono font-bold tracking-wider">PENDING-ISSUANCE</p>
            <div className="mt-3 flex items-center justify-between text-xs text-blue-300">
              <span>{t("statusPending")}</span>
              <span>{t("expires")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`p-3 bg-slate-50 rounded-xl border border-slate-100 ${className || ""}`}>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
