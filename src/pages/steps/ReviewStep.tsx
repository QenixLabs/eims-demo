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
import type { FormState } from "../NewApplication";

interface Props {
  formData: FormState;
}

export function ReviewStep({ formData }: Props) {
  return (
    <div className="space-y-5">
      {/* Personal Info */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <ReviewItem label="Full Name" value={formData.fullName} />
            <ReviewItem label="Date of Birth" value={formData.dateOfBirth} />
            <ReviewItem label="Gender" value={formData.gender} />
            <ReviewItem label="Blood Group" value={formData.bloodGroup || "N/A"} />
            <ReviewItem label="Nationality" value={formData.nationality} />
          </div>
          {formData.photoUrl && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Camera size={16} className="text-slate-400" />
              <img
                src={formData.photoUrl}
                alt="Photo"
                className="w-12 h-16 object-cover rounded border"
              />
              <span className="text-xs text-slate-500">Photo attached</span>
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
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ReviewItem label="Mobile Number" value={formData.mobileNumber} />
            <ReviewItem label="Email" value={formData.email || "N/A"} />
            <ReviewItem label="Address" value={formData.address} className="col-span-2 sm:col-span-1" />
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
            Documents
            <Badge variant="secondary" className="ml-2">
              {formData.documents.length} file{formData.documents.length !== 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.documents.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No documents uploaded</p>
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
            Biometrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {formData.biometrics.isCaptured ? (
              <>
                <Badge className="bg-blue-100 text-blue-700">Captured</Badge>
                {formData.biometrics.isVerified ? (
                  <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700">Pending Verification</Badge>
                )}
                {formData.biometrics.dedupResult === "pass" && (
                  <Badge className="bg-emerald-100 text-emerald-700">Unique</Badge>
                )}
                {formData.biometrics.dedupResult === "fail" && (
                  <Badge className="bg-red-100 text-red-700">Duplicate Detected</Badge>
                )}
              </>
            ) : formData.biometrics.fingerprints.length > 0 ? (
              <Badge className="bg-amber-100 text-amber-700">Locally Captured - Not Saved</Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-500">Not Captured</Badge>
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
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.payment.paymentId ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ReviewItem label="Amount" value={`$${formData.payment.amount}`} />
              <ReviewItem label="Method" value={formData.payment.paymentMethod.replace("_", " ")} />
              <ReviewItem label="Receipt No." value={formData.payment.receiptNumber} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge className="bg-slate-100 text-slate-500">Not Recorded</Badge>
              {formData.payment.receiptNumber && (
                <span className="text-xs text-slate-500">
                  Receipt #{formData.payment.receiptNumber} entered but not saved
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
            Identity Card Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl text-white max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={16} className="text-blue-300" />
              <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Earth Card</span>
            </div>
            <p className="text-lg font-bold">{formData.fullName || "Applicant Name"}</p>
            <p className="text-xs text-blue-300 mt-1">
              DOB: {formData.dateOfBirth || "N/A"} | {formData.gender || "N/A"}
            </p>
            <p className="text-[10px] text-blue-300 uppercase tracking-widest mt-3">Identity Number</p>
            <p className="text-sm font-mono font-bold tracking-wider">PENDING-ISSUANCE</p>
            <div className="mt-3 flex items-center justify-between text-xs text-blue-300">
              <span>Status: Pending</span>
              <span>Expires: 5 years from issue</span>
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
