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
  RotateCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

function DrcFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 70" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="70" fill="#007FFF" />
      <polygon points="0,0 100,0 0,70" fill="#FFCD00" />
      <polygon points="0,0 100,0 0,70" fill="none" stroke="#CE1021" strokeWidth="8" />
      <polygon points="0,70 100,70 100,0" fill="none" stroke="#CE1021" strokeWidth="8" />
      <polygon points="0,0 100,70 0,70" fill="none" stroke="#007FFF" strokeWidth="3" />
      <polygon points="0,0 100,0 100,70" fill="none" stroke="#007FFF" strokeWidth="3" />
      <polygon points="0,0 100,70" stroke="#CE1021" strokeWidth="6" />
      <polygon points="100,0 0,70" stroke="#CE1021" strokeWidth="6" />
      <polygon points="0,0 100,70" stroke="#FFCD00" strokeWidth="3" />
      <polygon points="100,0 0,70" stroke="#FFCD00" strokeWidth="3" />
      <polygon points="100,0 0,70" fill="none" stroke="#CE1021" strokeWidth="8" />
      <polygon points="0,0 100,0 0,70" fill="none" stroke="#CE1021" strokeWidth="8" />
      <polygon points="0,0 100,0 0,70" fill="none" stroke="#007FFF" strokeWidth="3" />
      <polygon points="100,0 0,70 100,70" fill="none" stroke="#007FFF" strokeWidth="3" />
      <polygon points="0,0 100,70" stroke="#CE1021" strokeWidth="6" />
      <polygon points="100,0 0,70" stroke="#CE1021" strokeWidth="6" />
      <polygon points="0,0 100,70" stroke="#FFCD00" strokeWidth="3" />
      <polygon points="100,0 0,70" stroke="#FFCD00" strokeWidth="3" />
      <polygon points="15,10 20,20 30,20 22,28 25,38 15,30 5,38 8,28 0,20 10,20" fill="#FFCD00" transform="translate(8,8) scale(0.5)" />
    </svg>
  );
}

function ChipGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chipGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="100" height="80" rx="12" fill="url(#chipGold)" stroke="#B45309" strokeWidth="2" />
      <rect x="10" y="30" width="100" height="2" fill="#B45309" opacity="0.4" />
      <rect x="10" y="50" width="100" height="2" fill="#B45309" opacity="0.4" />
      <rect x="10" y="70" width="100" height="2" fill="#B45309" opacity="0.4" />
      <rect x="30" y="10" width="2" height="80" fill="#B45309" opacity="0.4" />
      <rect x="60" y="10" width="2" height="80" fill="#B45309" opacity="0.4" />
      <rect x="90" y="10" width="2" height="80" fill="#B45309" opacity="0.4" />
      <rect x="42" y="32" width="36" height="36" rx="6" fill="url(#chipGold)" stroke="#B45309" strokeWidth="1.5" />
    </svg>
  );
}

function OnipSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="75" fill="none" stroke="#1E3A5F" strokeWidth="2" />
      <circle cx="80" cy="80" r="68" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path id="circlePath" d="M 80,80 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" fill="none" />
      <text fill="#1E3A5F" fontSize="10" fontWeight="bold" letterSpacing="2">
        <textPath href="#circlePath" startOffset="5%">
          REPUBLIQUE DEMOCRATIQUE DU CONGO
        </textPath>
      </text>
      <path id="circlePath2" d="M 80,80 m -52,0 a 52,52 0 1,0 104,0 a 52,52 0 1,0 -104,0" fill="none" />
      <text fill="#1E3A5F" fontSize="8" letterSpacing="1">
        <textPath href="#circlePath2" startOffset="5%">
          OFFICE NATIONAL D'IDENTIFICATION DE LA POPULATION
        </textPath>
      </text>
      <circle cx="80" cy="82" r="28" fill="#FFF" stroke="#1E3A5F" strokeWidth="1" />
      <g transform="translate(55, 58) scale(0.5)">
        <circle cx="50" cy="40" r="30" fill="#F59E0B" />
        <circle cx="40" cy="35" r="5" fill="#000" />
        <circle cx="60" cy="35" r="5" fill="#000" />
        <ellipse cx="50" cy="50" rx="8" ry="6" fill="#000" />
        <path d="M 50,20 L 50,10" stroke="#000" strokeWidth="3" />
        <path d="M 30,50 Q 20,60 25,70" stroke="#000" strokeWidth="2" fill="none" />
        <path d="M 70,50 Q 80,60 75,70" stroke="#000" strokeWidth="2" fill="none" />
      </g>
      <rect x="60" y="112" width="40" height="14" rx="2" fill="#DC2626" />
      <text x="80" y="122" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">PAIX</text>
    </svg>
  );
}

function GovernmentSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="70" r="66" fill="none" stroke="#1E3A5F" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="60" fill="none" stroke="#1E3A5F" strokeWidth="0.5" />
      <path id="govPath" d="M 70,70 m -54,0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0" fill="none" />
      <text fill="#1E3A5F" fontSize="8.5" fontWeight="bold" letterSpacing="1">
        <textPath href="#govPath" startOffset="2%">
          REPUBLIQUE DEMOCRATIQUE DU CONGO
        </textPath>
      </text>
      <path id="govPath2" d="M 70,70 m -46,0 a 46,46 0 1,0 92,0 a 46,46 0 1,0 -92,0" fill="none" />
      <text fill="#1E3A5F" fontSize="7" letterSpacing="0.5">
        <textPath href="#govPath2" startOffset="2%">
          LE GOUVERNEMENT
        </textPath>
      </text>
      <circle cx="70" cy="72" r="26" fill="#FFF" stroke="#1E3A5F" strokeWidth="0.5" />
      <g transform="translate(48, 52) scale(0.42)">
        <circle cx="50" cy="40" r="32" fill="#F59E0B" />
        <circle cx="38" cy="34" r="6" fill="#000" />
        <circle cx="62" cy="34" r="6" fill="#000" />
        <ellipse cx="50" cy="52" rx="10" ry="7" fill="#000" />
        <path d="M 50,15 L 50,5" stroke="#000" strokeWidth="4" />
        <path d="M 28,50 Q 15,65 22,78" stroke="#000" strokeWidth="3" fill="none" />
        <path d="M 72,50 Q 85,65 78,78" stroke="#000" strokeWidth="3" fill="none" />
        <path d="M 30,20 Q 20,30 25,40" stroke="#000" strokeWidth="2" fill="none" />
        <path d="M 70,20 Q 80,30 75,40" stroke="#000" strokeWidth="2" fill="none" />
      </g>
      <text x="70" y="108" textAnchor="middle" fill="#DC2626" fontSize="7" fontWeight="bold">PAIX</text>
      <polygon points="20,70 25,65 25,75" fill="#DC2626" />
      <polygon points="120,70 115,65 115,75" fill="#DC2626" />
    </svg>
  );
}

function FingerprintPlaceholder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="65" rx="50" ry="58" fill="none" stroke="#1E3A5F" strokeWidth="1.5" />
      <ellipse cx="60" cy="65" rx="42" ry="50" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <ellipse cx="60" cy="65" rx="34" ry="42" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <ellipse cx="60" cy="65" rx="26" ry="34" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
      <ellipse cx="60" cy="65" rx="18" ry="26" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
      <path d="M 60,20 Q 75,35 72,55" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path d="M 60,20 Q 45,35 48,55" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path d="M 30,45 Q 35,65 30,85" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path d="M 90,45 Q 85,65 90,85" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path d="M 35,30 Q 40,50 38,70" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
      <path d="M 85,30 Q 80,50 82,70" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
      <path d="M 60,95 Q 45,105 50,120" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path d="M 60,95 Q 75,105 70,120" fill="none" stroke="#1E3A5F" strokeWidth="1" />
      <path d="M 45,100 Q 50,115 55,125" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
      <path d="M 75,100 Q 70,115 65,125" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
    </svg>
  );
}

export default function CardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showBack, setShowBack] = useState(false);
  const { t } = useTranslation(["cardDetail", "common"]);

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
  }, [card, showBack]);

  useEffect(() => {
    if (card?.identityNumber && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, card.identityNumber, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 14,
          margin: 0,
        });
      } catch (e) {
        console.error("Barcode error:", e);
      }
    }
  }, [card, showBack]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">{t("cardDetail:loading")}</p>
        </div>
      </div>
    );
  }

  if (!application || !card) {
    return (
      <div className="text-center py-12">
        <XCircle size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">{t("cardDetail:notFound")}</p>
        <Link to="/card-issuance">
          <Button variant="outline" className="mt-4">
            <ArrowLeft size={16} className="mr-1" />
            {t("cardDetail:backToCards")}
          </Button>
        </Link>
      </div>
    );
  }

  const displayName = `${application.firstName} ${application.middleName ? application.middleName + " " : ""}${application.lastName}`;
  const identityNum = card.identityNumber || "RDC-00000000";
  const cardNumber = identityNum.startsWith("RDC-") ? identityNum : `RDC-${identityNum}`;
  const issueDate = card.issuedAt ? new Date(card.issuedAt).toLocaleDateString("fr-FR") : t("common:nA");
  const expiryDate = card.expiresAt ? new Date(card.expiresAt).toLocaleDateString("fr-FR") : t("common:nA");
  const dob = application.dateOfBirth ? new Date(application.dateOfBirth).toLocaleDateString("fr-FR") : application.dateOfBirth;

  const mrzLine1 = `IDC<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
  const mrzLine2 = `${(application.lastName || "UNKNOWN").toUpperCase().substring(0, 10)}<<<<<${(application.firstName || "").toUpperCase().substring(0, 10)}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;

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
          {t("cardDetail:backToCards")}
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBack(!showBack)}
            className="gap-2"
          >
            <RotateCw size={14} />
            {showBack ? t("cardDetail:showFront") : t("cardDetail:showBack")}
          </Button>
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
            {card.isActive ? t("common:active") : t("common:inactive")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Card Preview - Takes 3 columns */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              {/* DRC Card Design */}
              <div className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 21px)`,
                }} />
                <div className="absolute inset-0 opacity-[0.02]" style={{
                  backgroundImage: `radial-gradient(circle at 20% 80%, #007FFF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #CE1021 0%, transparent 50%)`,
                }} />

                {!showBack ? (
                  /* ===== FRONT SIDE ===== */
                  <div className="relative z-10 p-6">
                    {/* Top Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <DrcFlag className="w-16 h-11 rounded shadow-sm" />
                        <div>
                          <p className="text-[11px] font-bold text-blue-900 leading-tight tracking-wide">
                            REPUBLIQUE DEMOCRATIQUE DU CONGO
                          </p>
                          <p className="text-[9px] text-slate-600 leading-tight mt-0.5">
                            MINISTERE DE L&apos;INTERIEUR, SECURITE,<br />
                            DECENTRALISATION ET AFFAIRES COUTUMIERES
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <svg viewBox="0 0 40 40" className="w-8 h-8">
                            <circle cx="20" cy="20" r="18" fill="none" stroke="#1E3A5F" strokeWidth="1" />
                            <circle cx="20" cy="20" r="6" fill="none" stroke="#1E3A5F" strokeWidth="1.5" />
                            <path d="M 20,4 Q 28,12 26,20" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
                            <path d="M 20,4 Q 12,12 14,20" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
                            <path d="M 8,14 Q 12,20 10,26" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
                            <path d="M 32,14 Q 28,20 30,26" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
                            <path d="M 14,32 Q 20,28 26,32" fill="none" stroke="#1E3A5F" strokeWidth="0.75" />
                          </svg>
                          <div>
                            <p className="text-xs font-black text-blue-700 tracking-wider">NIP</p>
                            <p className="text-[7px] text-slate-500 leading-tight">
                              OFFICE NATIONAL<br />D&apos;IDENTIFICATION<br />DE LA POPULATION
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Number */}
                    <p className="text-xl font-bold text-red-700 tracking-wider mb-3">
                      {cardNumber}
                    </p>

                    {/* Main Content */}
                    <div className="flex gap-5">
                      {/* Photo */}
                      <div className="shrink-0">
                        <div className="w-28 h-36 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
                          {application.photoUrl ? (
                            <img
                              src={application.photoUrl}
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                              <User size={40} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 bg-white/80 rounded px-2 py-1 border border-slate-200">
                          <p className="text-[9px] font-mono text-slate-500 text-center tracking-wider">
                            {cardNumber}
                          </p>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="flex-1 space-y-1.5">
                        <FieldRow label="PRENOM" value={application.firstName} />
                        <FieldRow label="NOM" value={application.lastName} />
                        <FieldRow label="AUTRE NOM" value={application.middleName || "-"} />
                        <FieldRow label="ADRESSE" value={application.address} />
                        <FieldRow label="GROUPE SANGUIN" value={application.bloodGroup || t("common:nA")} />
                        <FieldRow label="NATIONALITE" value={application.nationality} />
                        <FieldRow label="DATE DE DELIVRANCE" value={issueDate} />
                        <FieldRow label="DATE D'EXPIRATION" value={expiryDate} />
                        <FieldRow label="DATE DE NAISSANCE" value={dob} />
                        <FieldRow label="ETAT CIVIL" value={application.maritalStatus || t("common:nA")} />
                      </div>

                      {/* Government Seal */}
                      <div className="shrink-0 flex flex-col items-center justify-center">
                        <GovernmentSeal className="w-28 h-28" />
                        <p className="text-[9px] font-bold text-blue-900 mt-2 text-center tracking-wider">
                          SIGNATURE<br />AUTORISEE
                        </p>
                        <svg viewBox="0 0 100 30" className="w-24 h-8 mt-1">
                          <path d="M 5,20 Q 15,5 25,18 T 45,15 T 65,20 T 85,12 T 95,18" fill="none" stroke="#1E3A5F" strokeWidth="1.2" />
                          <path d="M 10,22 Q 20,10 30,20 T 50,18 T 70,22 T 90,15" fill="none" stroke="#1E3A5F" strokeWidth="0.8" opacity="0.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ===== BACK SIDE ===== */
                  <div className="relative z-10 p-6">
                    {/* Top Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <DrcFlag className="w-12 h-8 rounded shadow-sm" />
                        <div>
                          <p className="text-[11px] font-bold text-blue-900 leading-tight tracking-wide">
                            REPUBLIQUE DEMOCRATIQUE DU CONGO
                          </p>
                          <p className="text-[9px] text-slate-600 leading-tight mt-0.5">
                            Autorite emettrice :<br />
                            OFFICE NATIONAL D&apos;IDENTIFICATION<br />
                            DE LA POPULATION (ONIP)
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[9px] font-bold text-blue-900">CODE-BARRES</p>
                        <svg ref={barcodeRef} className="w-56 h-14" />
                      </div>
                    </div>

                    {/* Middle Section */}
                    <div className="flex gap-4 items-start">
                      {/* Left info */}
                      <div className="flex-1 space-y-1 text-[10px]">
                        <BackFieldRow label="Niveau d'etudes" value={application.educationLevel || t("common:nA")} />
                        <BackFieldRow label="Profession" value={application.profession || t("common:nA")} />
                        <BackFieldRow label="Adresse professionnelle" value={application.professionalAddress || t("common:nA")} />
                      </div>

                      {/* Center seal */}
                      <div className="shrink-0">
                        <OnipSeal className="w-24 h-24" />
                      </div>

                      {/* Right side - QR */}
                      <div className="shrink-0 text-right">
                        <p className="text-[9px] font-bold text-blue-900 mb-1">CODE 2D</p>
                        <div className="bg-white p-1 rounded border border-slate-200 inline-block">
                          <canvas ref={canvasRef} className="w-20 h-20" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex gap-4 mt-4 items-end">
                      {/* Chip */}
                      <div className="shrink-0">
                        <ChipGraphic className="w-20 h-16" />
                      </div>

                      {/* Fingerprint */}
                      <div className="shrink-0 text-center">
                        <p className="text-[8px] font-bold text-blue-900 mb-1">EMPREINTE DIGITALE (POUCE)</p>
                        <div className="bg-white rounded border border-slate-200 p-1">
                          <FingerprintPlaceholder className="w-16 h-20" />
                        </div>
                      </div>

                      {/* Photo du Titulaire */}
                      <div className="shrink-0 text-center">
                        <p className="text-[8px] font-bold text-blue-900 mb-1">PHOTO DU TITULAIRE</p>
                        <div className="w-16 h-20 bg-white rounded border border-slate-200 overflow-hidden">
                          {application.photoUrl ? (
                            <img src={application.photoUrl} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                              <User size={20} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* MRZ / Document References */}
                      <div className="flex-1 space-y-0.5">
                        <p className="text-[9px] font-bold text-blue-900">REFERENCES DU DOCUMENT</p>
                        <p className="text-[11px] font-mono tracking-[0.2em] leading-tight">{mrzLine1}</p>
                        <p className="text-[11px] font-mono tracking-[0.2em] leading-tight">{mrzLine2}</p>
                        <p className="text-[11px] font-mono tracking-[0.2em] leading-tight">
                          {identityNum.replace(/-/g, "") + "<".repeat(40)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Bottom */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {t("cardDetail:expires")} {card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : t("common:nA")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    {showBack ? t("cardDetail:secureBack") : t("cardDetail:secureFront")}
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
                {t("cardDetail:cardInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={CreditCard} label={t("cardDetail:identityNumber")} value={card.identityNumber} highlighted />
              <InfoRow icon={User} label={t("cardDetail:firstName")} value={application.firstName} />
              <InfoRow icon={User} label={t("cardDetail:middleName")} value={application.middleName || t("common:nA")} />
              <InfoRow icon={User} label={t("cardDetail:lastName")} value={application.lastName} />
              <InfoRow icon={Calendar} label={t("cardDetail:dateOfBirth")} value={application.dateOfBirth} />
              <InfoRow icon={User} label={t("cardDetail:sex")} value={application.gender} />
              <InfoRow icon={Globe} label={t("cardDetail:nationality")} value={application.nationality} />
              <InfoRow icon={Droplets} label={t("cardDetail:bloodGroup")} value={application.bloodGroup || t("common:nA")} />
              <InfoRow icon={Phone} label={t("cardDetail:mobile")} value={application.mobileNumber} />
              <InfoRow icon={Mail} label={t("cardDetail:email")} value={application.email || t("common:nA")} />
              <InfoRow icon={MapPin} label={t("cardDetail:address")} value={application.address} />
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                <InfoRow
                  icon={Calendar}
                  label={t("cardDetail:issuedDate")}
                  value={card.issuedAt ? new Date(card.issuedAt).toLocaleDateString() : t("common:nA")}
                />
                <InfoRow
                  icon={Calendar}
                  label={t("cardDetail:expiryDate")}
                  value={card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : t("common:nA")}
                />
                <InfoRow
                  icon={CheckCircle2}
                  label={t("cardDetail:status")}
                  value={card.isActive ? t("common:active") : t("common:inactive")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full h-11">
              <Printer size={16} className="mr-2" />
              {t("cardDetail:printCard")}
            </Button>
            <Button variant="outline" className="w-full h-11">
              <Download size={16} className="mr-2" />
              {t("cardDetail:downloadPdf")}
            </Button>
          </div>

          {qrDataUrl && (
            <a href={qrDataUrl} download={`qr-${card.identityNumber}.png`} className="block">
              <Button variant="outline" className="w-full h-11">
                <Share2 size={16} className="mr-2" />
                {t("cardDetail:downloadQr")}
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[9px] font-bold text-blue-900 uppercase tracking-wider w-28 shrink-0">
        {label}
      </span>
      <span className="text-[9px] text-slate-500">:</span>
      <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wide">
        {value}
      </span>
    </div>
  );
}

function BackFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-bold text-blue-900 uppercase tracking-wider w-36 shrink-0">{label}</span>
      <span className="text-slate-500">:</span>
      <span className="font-semibold text-slate-900 uppercase">{value}</span>
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
