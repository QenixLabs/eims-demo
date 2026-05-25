import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  Globe,
  CreditCard,
  AlertTriangle,
  QrCode,
  Sparkles,
  Fingerprint,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function VerifyCard() {
  const { identityNumber: urlIdentityNumber } = useParams<{
    identityNumber?: string;
  }>();
  const [inputNumber, setInputNumber] = useState(urlIdentityNumber || "");
  const [searched, setSearched] = useState(!!urlIdentityNumber);
  const [isVerifying, setIsVerifying] = useState(false);
  const { t } = useTranslation(["verifyCard", "common"]);

  const { data: verificationResult, isLoading } =
    trpc.card.getByIdentityNumber.useQuery(
      { identityNumber: urlIdentityNumber || inputNumber },
      { enabled: searched && !!inputNumber }
    );

  useEffect(() => {
    if (searched && !!inputNumber) {
      setIsVerifying(true);
      const timer = setTimeout(() => setIsVerifying(false), 500);
      return () => clearTimeout(timer);
    }
  }, [searched, inputNumber]);

  const handleSearch = () => {
    if (inputNumber.trim()) {
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const isValid = verificationResult?.card?.isActive;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">{t("verifyCard:earthCard")}</h1>
            <p className="text-[10px] text-slate-500">
              {t("verifyCard:identityVerificationPortal")}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Search Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <QrCode size={14} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">{t("verifyCard:officialVerificationSystem")}</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              {t("verifyCard:verifyIdentityCard")}
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              {t("verifyCard:enterCardNumberDesc")}
            </p>
          </div>

          <div className="flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder={t("verifyCard:placeholder")}
                value={inputNumber}
                onChange={(e) => {
                  setInputNumber(e.target.value.toUpperCase());
                  setSearched(false);
                }}
                onKeyDown={handleKeyDown}
                className="h-12 pl-11 text-center font-mono text-lg tracking-wider border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20"
            >
              <Search size={18} className="mr-2" />
              {t("verifyCard:verify")}
            </Button>
          </div>

          {/* Quick tips */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Fingerprint size={12} />
              {t("verifyCard:secureVerification")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {t("verifyCard:instantResults")}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} />
              {t("verifyCard:officialDatabase")}
            </span>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading || isVerifying ? (
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {t("verifyCard:verifyingIdentity")}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {t("verifyCard:pleaseWaitVerify")}
                  </p>
                </CardContent>
              </Card>
            ) : !verificationResult ? (
              <Card className="border-red-200 shadow-lg bg-red-50/50">
                <CardContent className="p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <XCircle size={32} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">
                    {t("verifyCard:cardNotFound")}
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    {t("verifyCard:cardNotFoundDesc", { number: inputNumber })}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Status Banner */}
                <Card
                  className={`shadow-lg overflow-hidden ${
                    isValid ? "border-emerald-200" : "border-red-200"
                  }`}
                >
                  <div className={`p-6 ${isValid ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"} text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          {isValid ? (
                            <CheckCircle2 size={28} className="text-white" />
                          ) : (
                            <AlertTriangle size={28} className="text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {isValid ? t("verifyCard:identityVerified") : t("verifyCard:invalidRevoked")}
                          </h3>
                          <p className="text-sm opacity-90">
                            {isValid
                              ? t("verifyCard:validActive")
                              : t("verifyCard:invalidOrRevoked")}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <Sparkles size={40} className="opacity-20" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Identity Details */}
                <Card className="border-slate-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      {t("verifyCard:identityDetails")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Identity Number */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wider">
                        {t("verifyCard:identityNumber")}
                      </p>
                      <p className="text-xl font-mono font-bold text-blue-800 tracking-wider">
                        {verificationResult.card.identityNumber}
                      </p>
                    </div>

                    {/* Applicant Info Grid */}
                    {verificationResult.application && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem
                          icon={User}
                          label={t("verifyCard:name")}
                          value={`${verificationResult.application.firstName || ""} ${verificationResult.application.lastName || ""}`}
                        />
                        <InfoItem
                          icon={Calendar}
                          label={t("verifyCard:dateOfBirth")}
                          value={verificationResult.application.dateOfBirth}
                        />
                        <InfoItem
                          icon={Globe}
                          label={t("verifyCard:nationality")}
                          value={verificationResult.application.nationality}
                        />
                        <InfoItem
                          icon={CreditCard}
                          label={t("verifyCard:sex")}
                          value={verificationResult.application.gender}
                        />
                      </div>
                    )}

                    {/* Authority */}
                    {verificationResult.application?.authorityName && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                          {t("verifyCard:issuingAuthority")}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {verificationResult.application.authorityName}
                        </p>
                      </div>
                    )}

                    {/* Issue/Expiry */}
                    <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {t("verifyCard:issued")}: {verificationResult.card.issuedAt
                          ? new Date(verificationResult.card.issuedAt).toLocaleDateString()
                          : t("common:nA")}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={14} />
                        {t("verifyCard:expires")}: {verificationResult.card.expiresAt
                          ? new Date(verificationResult.card.expiresAt).toLocaleDateString()
                          : t("common:nA")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification timestamp */}
                <p className="text-center text-xs text-slate-400">
                  {t("verifyCard:verifiedOn", { date: new Date().toLocaleString() })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
          <p className="font-medium text-slate-500">{t("verifyCard:footerTitle")}</p>
          <p className="mt-1">
            {t("verifyCard:footerAssistance")}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
        <Icon size={16} className="text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
