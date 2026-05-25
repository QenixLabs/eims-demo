import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Globe,
  Droplets,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function VerificationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const platformUser = useAuthStore((s) => s.platformUser);
  const [remarks, setRemarks] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | "correction" | null>(null);
  const { t } = useTranslation(["verificationDetail", "common"]);

  const utils = trpc.useUtils();
  const { data: application, isLoading } =
    trpc.verification.getForReview.useQuery({
      id: Number(id),
    });

  const approveMutation = trpc.verification.approve.useMutation({
    onSuccess: () => {
      toast.success(t("verificationDetail:approveSuccess"));
      utils.verification.listPending.invalidate();
      navigate("/verification");
    },
    onError: (err) => {
      toast.error(err.message || t("verificationDetail:approveError"));
    },
  });

  const rejectMutation = trpc.verification.reject.useMutation({
    onSuccess: () => {
      toast.success(t("verificationDetail:rejectSuccess"));
      utils.verification.listPending.invalidate();
      navigate("/verification");
    },
    onError: (err) => {
      toast.error(err.message || t("verificationDetail:rejectError"));
    },
  });

  const correctionMutation = trpc.verification.requestCorrection.useMutation({
    onSuccess: () => {
      toast.success(t("verificationDetail:correctionSuccess"));
      utils.verification.listPending.invalidate();
      navigate("/verification");
    },
    onError: (err) => {
      toast.error(err.message || t("verificationDetail:correctionError"));
    },
  });

  const handleAction = () => {
    if (!platformUser || !action) return;

    const baseParams = {
      id: Number(id),
      verifiedBy: platformUser.id,
      remarks: remarks || undefined,
    };

    if (action === "approve") {
      approveMutation.mutate(baseParams);
    } else if (action === "reject") {
      if (!remarks) {
        toast.error(t("verificationDetail:remarksRequired"));
        return;
      }
      rejectMutation.mutate({ ...baseParams, remarks });
    } else if (action === "correction") {
      if (!remarks) {
        toast.error(t("verificationDetail:correctionRequired"));
        return;
      }
      correctionMutation.mutate({ ...baseParams, remarks });
    }
  };

  const isMutating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    correctionMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">{t("verificationDetail:loading")}</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={32} className="mx-auto mb-2 text-slate-300" />
        <p className="text-slate-500">{t("verificationDetail:notFound")}</p>
        <Link to="/verification">
          <Button variant="outline" className="mt-4">
            <ArrowLeft size={16} className="mr-1" />
            {t("verificationDetail:backToVerification")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="-ml-2 text-slate-500"
          onClick={() => navigate("/verification")}
        >
          <ArrowLeft size={16} className="mr-1" />
          {t("common:back")}
        </Button>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
              application.status
            )}`}
          >
            {t(`common:status.${application.status}` as any)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Applicant Details */}
        <div className="lg:col-span-2 space-y-4">
          <Card data-tour="applicant-info">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                {t("verificationDetail:applicantInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium shrink-0">
                  {(application.firstName?.[0] || "") + (application.lastName?.[0] || "")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {application.firstName} {application.lastName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t("verificationDetail:id")} {application.id.toString().padStart(4, "0")}
                  </p>
                  {application.identityNumber && (
                    <p className="text-sm text-blue-600 font-medium">
                      {application.identityNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={Calendar}
                  label={t("applicationDetail:dateOfBirth")}
                  value={application.dateOfBirth}
                />
                <InfoItem
                  icon={User}
                  label={t("applicationDetail:sex")}
                  value={application.gender}
                />
                <InfoItem
                  icon={Globe}
                  label={t("applicationDetail:nationality")}
                  value={application.nationality}
                />
                <InfoItem
                  icon={Droplets}
                  label={t("applicationDetail:bloodGroup")}
                  value={application.bloodGroup || t("common:nA")}
                />
                <InfoItem
                  icon={Phone}
                  label={t("contactDetails:mobileNumber")}
                  value={application.mobileNumber}
                />
                <InfoItem
                  icon={Mail}
                  label={t("contactDetails:email")}
                  value={application.email || t("common:nA")}
                />
                <InfoItem
                  icon={MapPin}
                  label={t("contactDetails:address")}
                  value={application.address}
                  fullWidth
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card data-tour="documents">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                {t("verificationDetail:uploadedDocuments")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents?.length === 0 ? (
                <p className="text-sm text-slate-400">{t("verificationDetail:noDocuments")}</p>
              ) : (
                <div className="space-y-2">
                  {application.documents?.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-slate-400 capitalize">
                            {doc.documentType.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {doc.fileSize
                          ? `${(doc.fileSize / 1024).toFixed(0)} KB`
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <Card data-tour="review-actions">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("verificationDetail:reviewActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Authority info */}
              <div className="p-3 bg-slate-50 rounded-md">
                <p className="text-xs text-slate-500">{t("common:authority")}</p>
                <p className="text-sm font-medium text-slate-700">
                  {application.authorityName || t("common:nA")}
                </p>
              </div>

              {/* Current remarks */}
              {application.remarks && (
                <div className="p-3 bg-amber-50 rounded-md">
                  <p className="text-xs text-amber-600 font-medium">
                    {t("verificationDetail:previousRemarks")}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {application.remarks}
                  </p>
                </div>
              )}

              {/* Remarks input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  {t("verificationDetail:remarks")}
                </label>
                <Textarea
                  placeholder={t("verificationDetail:remarksPlaceholder")}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setAction("approve")}
                  disabled={isMutating}
                >
                  <CheckCircle size={16} className="mr-1" />
                  {t("verificationDetail:approve")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                  onClick={() => setAction("correction")}
                  disabled={isMutating}
                >
                  <AlertCircle size={16} className="mr-1" />
                  {t("verificationDetail:requestCorrection")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setAction("reject")}
                  disabled={isMutating}
                >
                  <XCircle size={16} className="mr-1" />
                  {t("verificationDetail:reject")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {action && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">
                {action === "approve" && t("verificationDetail:approveTitle")}
                {action === "reject" && t("verificationDetail:rejectTitle")}
                {action === "correction" && t("verificationDetail:correctionTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                {action === "approve" && t("verificationDetail:approveConfirm")}
                {action === "reject" && t("verificationDetail:rejectConfirm")}
                {action === "correction" && t("verificationDetail:correctionConfirm")}
              </p>
              {remarks && (
                <div className="p-3 bg-slate-50 rounded-md">
                  <p className="text-xs text-slate-500">{t("verificationDetail:yourRemarks")}</p>
                  <p className="text-sm text-slate-700 mt-1">{remarks}</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setAction(null)}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  className={`flex-1 ${
                    action === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : action === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                  onClick={handleAction}
                  disabled={isMutating}
                >
                  {isMutating
                    ? t("verificationDetail:processing")
                    : action === "approve"
                    ? t("verificationDetail:confirmApprove")
                    : action === "reject"
                    ? t("verificationDetail:confirmReject")
                    : t("verificationDetail:sendRequest")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex items-start gap-2 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <Icon size={14} className="text-slate-400 mt-1 shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function getStatusStyle(status: string): string {
  const styles: Record<string, string> = {
    submitted: "bg-blue-50 text-blue-700",
    under_review: "bg-amber-50 text-amber-700",
    correction_requested: "bg-purple-50 text-purple-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    issued: "bg-teal-50 text-teal-700",
  };
  return styles[status] || "bg-slate-100 text-slate-600";
}
