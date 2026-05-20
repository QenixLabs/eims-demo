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

export default function VerifyCard() {
  const { identityNumber: urlIdentityNumber } = useParams<{
    identityNumber?: string;
  }>();
  const [inputNumber, setInputNumber] = useState(urlIdentityNumber || "");
  const [searched, setSearched] = useState(!!urlIdentityNumber);
  const [isVerifying, setIsVerifying] = useState(false);

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
            <h1 className="text-sm font-bold text-slate-900">Earth Card</h1>
            <p className="text-[10px] text-slate-500">
              Identity Verification Portal
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Search Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <QrCode size={14} className="text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Official Verification System</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Verify Identity Card
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter the identity card number to instantly verify its authenticity and status
            </p>
          </div>

          <div className="flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="EC-2026-8A3F21"
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
              Verify
            </Button>
          </div>

          {/* Quick tips */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Fingerprint size={12} />
              Secure verification
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              Instant results
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} />
              Official database
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
                    Verifying Identity
                  </h3>
                  <p className="text-sm text-slate-500">
                    Please wait while we verify the card number...
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
                    Card Not Found
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    The identity number <span className="font-mono font-medium text-slate-700">{inputNumber}</span> could not be found in our system. Please check the number and try again.
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
                            {isValid ? "Identity Verified" : "Invalid / Revoked"}
                          </h3>
                          <p className="text-sm opacity-90">
                            {isValid
                              ? "This identity card is valid and active"
                              : "This identity card is invalid or has been revoked"}
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
                      Identity Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Identity Number */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium mb-1 uppercase tracking-wider">
                        Identity Number
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
                          label="Full Name"
                          value={verificationResult.application.fullName}
                        />
                        <InfoItem
                          icon={Calendar}
                          label="Date of Birth"
                          value={verificationResult.application.dateOfBirth}
                        />
                        <InfoItem
                          icon={Globe}
                          label="Nationality"
                          value={verificationResult.application.nationality}
                        />
                        <InfoItem
                          icon={CreditCard}
                          label="Gender"
                          value={verificationResult.application.gender}
                        />
                      </div>
                    )}

                    {/* Authority */}
                    {verificationResult.application?.authorityName && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                          Issuing Authority
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
                        Issued: {verificationResult.card.issuedAt
                          ? new Date(verificationResult.card.issuedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={14} />
                        Expires: {verificationResult.card.expiresAt
                          ? new Date(verificationResult.card.expiresAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification timestamp */}
                <p className="text-center text-xs text-slate-400">
                  Verified on {new Date().toLocaleString()} • Earth Card Identity Management System
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
          <p className="font-medium text-slate-500">Earth Card Identity Management System</p>
          <p className="mt-1">
            This is an official verification portal. For assistance, contact your issuing authority.
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
