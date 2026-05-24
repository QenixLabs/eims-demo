import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Globe,
  Droplets,
  FileText,
  CreditCard,
  ShieldCheck,
  Clock,
  Pencil,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: application, isLoading } = trpc.enrollment.getById.useQuery({
    id: Number(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-16">
        <FileText size={40} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">Application not found</p>
        <Link to="/applications">
          <Button variant="outline" className="mt-4">
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
        </Link>
      </div>
    );
  }

  const card = application.identityCard;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="-ml-2 text-slate-500 hover:text-slate-700" asChild>
          <Link to="/applications">
            <ArrowLeft size={16} className="mr-1" />
            Back to Applications
          </Link>
        </Button>
        <StatusBadge status={application.status} />
      </div>

      {/* Title Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
            {application.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{application.fullName}</h2>
            <p className="text-sm text-slate-500">
              Application #{application.id.toString().padStart(4, "0")}
            </p>
            {application.identityNumber && (
              <p className="text-sm font-mono font-semibold text-blue-700 mt-1">
                {application.identityNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link to={`/applications/${id}/edit`} className="block">
          <Button variant="outline" className="w-full h-12 border-blue-200 hover:bg-blue-50">
            <Pencil size={18} className="mr-2 text-blue-600" />
            <div className="text-left">
              <p className="text-sm font-medium">Continue / Edit</p>
              <p className="text-[10px] text-slate-500">
                Resume stepper form
              </p>
            </div>
          </Button>
        </Link>
        <div className="block">
          <Button variant="outline" disabled className="w-full h-12 border-emerald-200 bg-emerald-50/50">
            <DollarSign size={18} className="mr-2 text-emerald-600" />
            <div className="text-left">
              <p className="text-sm font-medium">Payment</p>
              <p className="text-[10px] text-slate-500">
                {application.paymentStatus === "completed" ? "Paid" : application.paymentStatus === "pending" ? "Pending" : "N/A"}
              </p>
            </div>
          </Button>
        </div>
        <Link to={`/verification/${id}`} className="block">
          <Button variant="outline" className="w-full h-12 border-amber-200 hover:bg-amber-50">
            <CheckCircle2 size={18} className="mr-2 text-amber-600" />
            <div className="text-left">
              <p className="text-sm font-medium">Verify & Approve</p>
              <p className="text-[10px] text-slate-500">Review application</p>
            </div>
          </Button>
        </Link>
      </div>

      {/* Workflow Progress */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            Application Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {[
              { label: "Enrolled", done: true },
              { label: "Documents", done: true },
              { label: "Biometrics", done: application.biometricStatus === "verified" || application.biometricStatus === "captured" },
              { label: "Verified", done: ["approved", "issued", "active"].includes(application.status) },
              { label: "Payment", done: application.paymentStatus === "completed" },
              { label: "Issued", done: ["issued", "active"].includes(application.status) },
            ].map((step, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    {step.done ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 ${step.done ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                    {step.label}
                  </span>
                </div>
                {i < 5 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${step.done ? "bg-emerald-500" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Personal Info */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <User size={14} className="text-blue-600" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Calendar} label="Date of Birth" value={application.dateOfBirth} />
            <InfoRow icon={User} label="Gender" value={application.gender} />
            <InfoRow icon={Globe} label="Nationality" value={application.nationality} />
            <InfoRow icon={Droplets} label="Blood Group" value={application.bloodGroup || "N/A"} />
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Phone size={14} className="text-blue-600" />
              </div>
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Phone} label="Mobile Number" value={application.mobileNumber} />
            <InfoRow icon={Mail} label="Email" value={application.email || "N/A"} />
            <InfoRow icon={MapPin} label="Address" value={application.address} />
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText size={14} className="text-blue-600" />
              </div>
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {application.documents?.length === 0 ? (
              <div className="text-center py-6">
                <FileText size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No documents uploaded</p>
              </div>
            ) : (
              <div className="space-y-2">
                {application.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText size={14} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{doc.fileName}</span>
                    </div>
                    <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-1 rounded">
                      {doc.documentType.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Identity Card */}
        {card && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CreditCard size={14} className="text-blue-600" />
                </div>
                Identity Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl text-white">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-blue-300" />
                    <span className="text-xs font-medium text-blue-300 uppercase tracking-wider">Earth Card</span>
                  </div>
                  <p className="text-[10px] text-blue-300 uppercase tracking-widest mb-1">Identity Number</p>
                  <p className="text-lg font-mono font-bold tracking-wider">{card.identityNumber}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-blue-300">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      Issued: {card.issuedAt ? new Date(card.issuedAt).toLocaleDateString() : "N/A"}
                    </span>
                    <span>Expires: {card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
              </div>
              <Link to={`/card-issuance/${application.id}`} className="block">
                <Button variant="outline" className="w-full h-11">
                  <CreditCard size={16} className="mr-2" />
                  View Full Card
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Remarks */}
      {application.remarks && (
        <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                <FileText size={12} className="text-amber-600" />
              </div>
              Remarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-800">{application.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    draft: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    submitted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    under_review: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    correction_requested: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    issued: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  };
  const s = styles[status] || styles.draft;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status.replace("_", " ")}
    </span>
  );
}
