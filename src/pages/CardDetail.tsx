import { useParams, useNavigate, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Droplets,
  CreditCard,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const { data: application, isLoading } = trpc.enrollment.getById.useQuery({
    id: Number(id),
  });

  const card = application?.identityCard;

  useEffect(() => {
    if (card?.qrCodeUrl && canvasRef.current) {
      const verifyUrl = `${window.location.origin}/verify/${card.identityNumber}`;
      QRCode.toCanvas(canvasRef.current, verifyUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
      }).catch(console.error);

      QRCode.toDataURL(verifyUrl, { width: 400, margin: 2 })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [card]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading card details...</p>
        </div>
      </div>
    );
  }

  if (!application || !card) {
    return (
      <div className="text-center py-12">
        <XCircle size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">Card not found</p>
        <Link to="/card-issuance">
          <Button variant="outline" className="mt-4">
            <ArrowLeft size={16} className="mr-1" />
            Back to Cards
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="-ml-2 text-slate-500 hover:text-slate-700"
          onClick={() => navigate("/card-issuance")}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Cards
        </Button>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              card.isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {card.isActive ? (
              <CheckCircle2 size={12} />
            ) : (
              <XCircle size={12} />
            )}
            {card.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Card Preview - Takes 3 columns */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              {/* Premium Card Design */}
              <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white overflow-hidden">
                {/* Holographic overlay effect */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent" />
                </div>

                {/* Card pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)`,
                }} />

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-wider">EARTH CARD</p>
                        <p className="text-[10px] text-blue-300 tracking-widest uppercase">
                          Identity Management System
                        </p>
                      </div>
                    </div>
                    {/* Chip */}
                    <div className="relative">
                      <div className="w-12 h-10 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-lg shadow-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-6 border border-yellow-600/30 rounded-sm">
                            <div className="w-full h-px bg-yellow-600/30 absolute top-1/2" />
                            <div className="h-full w-px bg-yellow-600/30 absolute left-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex gap-6 mb-8">
                    {/* Photo */}
                    <div className="relative">
                      <div className="w-28 h-32 bg-white/10 rounded-xl border-2 border-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                        {application.photoUrl ? (
                          <img
                            src={application.photoUrl}
                            alt={application.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-white/40" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-[10px] text-blue-300 uppercase tracking-widest font-medium">
                          Full Name
                        </p>
                        <p className="text-lg font-bold tracking-wide">
                          {application.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-300 uppercase tracking-widest font-medium">
                          Identity Number
                        </p>
                        <p className="text-sm font-mono bg-white/10 px-3 py-1.5 rounded-lg inline-block tracking-wider border border-white/10">
                          {card.identityNumber}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-blue-300 uppercase tracking-wider">Date of Birth</p>
                          <p className="text-sm font-medium">{application.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-300 uppercase tracking-wider">Gender</p>
                          <p className="text-sm font-medium">{application.gender}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-end justify-between pt-4 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] text-blue-300 uppercase tracking-wider">Nationality</p>
                        <p className="text-xs font-medium">{application.nationality}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-300 uppercase tracking-wider">Blood Group</p>
                        <p className="text-xs font-medium">{application.bloodGroup || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-blue-300 uppercase tracking-wider">Issued</p>
                        <p className="text-xs font-medium">
                          {card.issuedAt ? new Date(card.issuedAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                    {/* QR Code */}
                    <div className="bg-white rounded-xl p-2 shadow-lg">
                      <canvas ref={canvasRef} className="w-16 h-16" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Bottom */}
              <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Expires: {card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : "N/A"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    Secure Identity Card
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Details - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600" />
                Card Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={CreditCard} label="Identity Number" value={card.identityNumber} highlighted />
              <InfoRow icon={User} label="Full Name" value={application.fullName} />
              <InfoRow icon={Calendar} label="Date of Birth" value={application.dateOfBirth} />
              <InfoRow icon={User} label="Gender" value={application.gender} />
              <InfoRow icon={Globe} label="Nationality" value={application.nationality} />
              <InfoRow icon={Droplets} label="Blood Group" value={application.bloodGroup || "N/A"} />
              <InfoRow icon={Phone} label="Mobile" value={application.mobileNumber} />
              <InfoRow icon={Mail} label="Email" value={application.email || "N/A"} />
              <InfoRow icon={MapPin} label="Address" value={application.address} />
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                <InfoRow
                  icon={Calendar}
                  label="Issued Date"
                  value={card.issuedAt ? new Date(card.issuedAt).toLocaleDateString() : "N/A"}
                />
                <InfoRow
                  icon={Calendar}
                  label="Expiry Date"
                  value={card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : "N/A"}
                />
                <InfoRow
                  icon={CheckCircle2}
                  label="Status"
                  value={card.isActive ? "Active" : "Inactive"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full h-11">
              <Printer size={16} className="mr-2" />
              Print Card
            </Button>
            <Button variant="outline" className="w-full h-11">
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          </div>

          {qrDataUrl && (
            <a href={qrDataUrl} download={`qr-${card.identityNumber}.png`} className="block">
              <Button variant="outline" className="w-full h-11">
                <Share2 size={16} className="mr-2" />
                Download QR Code
              </Button>
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlighted,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-sm ${highlighted ? "font-mono font-semibold text-blue-700" : "font-medium text-slate-900"} truncate`}>
          {value}
        </p>
      </div>
    </div>
  );
}
