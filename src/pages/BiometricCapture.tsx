import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Fingerprint,
  Eye,
  Camera,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Zap,
  Activity,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";

export default function BiometricCapture() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const platformUser = useAuthStore((s) => s.platformUser);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStep, setCaptureStep] = useState(0);
  const [capturedData, setCapturedData] = useState({
    fingerprints: [] as string[],
    leftIris: "",
    rightIris: "",
    facePhotoUrl: "",
    livenessCheck: false,
    livenessScore: 0,
  });

  const applicationId = Number(id);

  const { data: application } = trpc.enrollment.getById.useQuery({
    id: applicationId,
  });

  const { data: existingBiometrics } = trpc.biometric.getByApplicationId.useQuery({
    applicationId,
  });

  const captureMutation = trpc.biometric.capture.useMutation({
    onSuccess: () => {
      toast.success("Biometric data captured successfully!");
      utils.biometric.getByApplicationId.invalidate({ applicationId });
      utils.enrollment.getById.invalidate({ id: applicationId });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to capture biometric data");
      setIsCapturing(false);
    },
  });

  const verifyMutation = trpc.biometric.verify.useMutation({
    onSuccess: () => {
      toast.success("Biometrics verified successfully!");
      utils.biometric.getByApplicationId.invalidate({ applicationId });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to verify biometrics");
    },
  });

  const dedupMutation = trpc.biometric.runDeduplicationCheck.useMutation({
    onSuccess: (data) => {
      if (data.isDuplicate) {
        toast.warning("Duplicate biometric data detected!");
      } else {
        toast.success("No duplicates found - biometric data is unique");
      }
      utils.biometric.getByApplicationId.invalidate({ applicationId });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to run deduplication check");
    },
  });

  const utils = trpc.useUtils();

  const simulateCapture = async () => {
    if (!platformUser) {
      toast.error("Please login first");
      return;
    }

    setIsCapturing(true);
    setCaptureStep(1);

    // Simulate fingerprint capture
    await new Promise((r) => setTimeout(r, 1500));
    setCaptureStep(2);
    const fingerprints = Array.from({ length: 10 }, (_, i) => {
      const finger = ["Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Pinky",
        "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Pinky"][i];
      return `FP-${finger.toUpperCase().replace(" ", "-")}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    });
    setCapturedData((prev) => ({ ...prev, fingerprints }));

    // Simulate iris scan
    await new Promise((r) => setTimeout(r, 1500));
    setCaptureStep(3);
    setCapturedData((prev) => ({
      ...prev,
      leftIris: `IRIS-L-${Math.random().toString(36).substring(2, 34)}`,
      rightIris: `IRIS-R-${Math.random().toString(36).substring(2, 34)}`,
    }));

    // Simulate face photo & liveness
    await new Promise((r) => setTimeout(r, 1500));
    setCaptureStep(4);
    const livenessScore = 90 + Math.random() * 10;
    setCapturedData((prev) => ({
      ...prev,
      facePhotoUrl: `/photos/face_${application?.fullName?.toLowerCase().replace(" ", "_")}.jpg`,
      livenessCheck: livenessScore > 85,
      livenessScore,
    }));

    // Complete capture
    await new Promise((r) => setTimeout(r, 500));
    setCaptureStep(5);

    captureMutation.mutate({
      applicationId,
      capturedBy: platformUser.id,
      deviceId: "BIO-DEV-001",
      deviceName: "SecuGen Hamster Pro 20 (Simulated)",
      deviceCertified: true,
      fingerprints,
      leftIris: `IRIS-L-${Math.random().toString(36).substring(2, 34)}`,
      rightIris: `IRIS-R-${Math.random().toString(36).substring(2, 34)}`,
      facePhotoUrl: `/photos/face_${application?.fullName?.toLowerCase().replace(" ", "_")}.jpg`,
      livenessCheck: livenessScore > 85,
      livenessScore,
      captureQuality: livenessScore > 95 ? "excellent" : "high",
    });

    setIsCapturing(false);
    setCaptureStep(0);
  };

  const handleVerify = () => {
    if (!platformUser) return;
    verifyMutation.mutate({
      applicationId,
      verifiedBy: platformUser.id,
    });
  };

  const handleDedupCheck = () => {
    dedupMutation.mutate({ applicationId });
  };

  const captureSteps = [
    { label: "Initialize Device", icon: HardDrive },
    { label: "Capture Fingerprints", icon: Fingerprint },
    { label: "Scan Iris", icon: Eye },
    { label: "Face Photo & Liveness", icon: Camera },
    { label: "Processing", icon: Activity },
    { label: "Complete", icon: CheckCircle2 },
  ];

  const hasBiometrics = existingBiometrics && existingBiometrics.livenessCheck;
  const isVerified = existingBiometrics && existingBiometrics.verifiedAt;
  const dedupResult = existingBiometrics?.deduplicationResult;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="-ml-2 text-slate-500" onClick={() => navigate(`/applications/${id}`)}>
          <ArrowLeft size={16} className="mr-1" />
          Back to Application
        </Button>
        <div className="flex items-center gap-3">
          {hasBiometrics && (
            <Badge variant={isVerified ? "default" : "secondary"} className={isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
              {isVerified ? "Verified" : "Captured - Pending Verification"}
            </Badge>
          )}
          {dedupResult && (
            <Badge variant={dedupResult === "pass" ? "default" : "destructive"} className={dedupResult === "pass" ? "bg-emerald-100 text-emerald-700" : ""}>
              {dedupResult === "pass" ? "Unique" : "Duplicate Detected"}
            </Badge>
          )}
        </div>
      </div>

      {/* Applicant Info */}
      {application && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                {application.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{application.fullName}</h3>
                <p className="text-sm text-slate-500">
                  DOB: {application.dateOfBirth} | {application.gender} | {application.nationality}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Application #{application.id.toString().padStart(4, "0")} | {application.applicationRef}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capture Progress */}
      {isCapturing && (
        <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-blue-600" />
              Biometric Capture in Progress
            </h4>
            <div className="space-y-3">
              {captureSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === captureStep;
                const isComplete = index < captureStep;
                return (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive ? "bg-blue-100 border border-blue-200" : isComplete ? "bg-emerald-50" : "bg-white/50"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isComplete ? "bg-emerald-500 text-white" : isActive ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200 text-slate-400"
                    }`}>
                      {isComplete ? <CheckCircle2 size={16} /> : isActive ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                    </div>
                    <span className={`text-sm font-medium ${
                      isComplete ? "text-emerald-700" : isActive ? "text-blue-700" : "text-slate-400"
                    }`}>
                      {step.label}
                    </span>
                    {isActive && <Loader2 size={14} className="ml-auto text-blue-500 animate-spin" />}
                    {isComplete && <CheckCircle2 size={14} className="ml-auto text-emerald-500" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capture Controls */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Biometric Capture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="text-sm font-semibold text-slate-900 mb-3">Device Information</h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Device</p>
                  <p className="font-medium text-slate-700">SecuGen Hamster Pro 20</p>
                </div>
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium text-slate-700">Fingerprint Scanner</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="font-medium text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Connected
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Certified</p>
                  <p className="font-medium text-emerald-600">Yes</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={simulateCapture}
                disabled={isCapturing || captureMutation.isPending}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              >
                {isCapturing ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Fingerprint size={16} className="mr-2" />
                )}
                {isCapturing ? "Capturing..." : hasBiometrics ? "Re-capture Biometrics" : "Capture Biometrics"}
              </Button>

              {hasBiometrics && !isVerified && (
                <Button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  variant="outline"
                  className="w-full h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Verify Biometrics
                </Button>
              )}

              {hasBiometrics && (
                <Button
                  onClick={handleDedupCheck}
                  disabled={dedupMutation.isPending}
                  variant="outline"
                  className="w-full h-11"
                >
                  <Activity size={16} className="mr-2" />
                  Run Deduplication Check
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Captured Data Display */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive size={18} className="text-blue-600" />
              Captured Biometric Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasBiometrics ? (
              <>
                {/* Fingerprints */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Fingerprint size={14} className="text-blue-600" />
                    Fingerprints (10)
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {existingBiometrics?.fingerprints && JSON.parse(existingBiometrics.fingerprints).map((fp: string, i: number) => (
                      <div key={i} className="text-xs font-mono bg-white px-2 py-1.5 rounded border border-slate-200 truncate">
                        {fp.substring(0, 20)}...
                      </div>
                    ))}
                  </div>
                </div>

                {/* Iris */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <Eye size={12} />
                      Left Iris
                    </p>
                    <p className="text-xs font-mono text-slate-700 truncate">
                      {existingBiometrics?.leftIris || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <Eye size={12} />
                      Right Iris
                    </p>
                    <p className="text-xs font-mono text-slate-700 truncate">
                      {existingBiometrics?.rightIris || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Liveness */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Camera size={14} className="text-blue-600" />
                      Liveness Detection
                    </h5>
                    {existingBiometrics?.livenessCheck ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Passed</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (existingBiometrics?.livenessScore || 0) > 90
                            ? "bg-emerald-500"
                            : (existingBiometrics?.livenessScore || 0) > 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${existingBiometrics?.livenessScore || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {existingBiometrics?.livenessScore || 0}%
                    </span>
                  </div>
                </div>

                {/* Encryption */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
                  <Shield size={16} className="text-blue-600" />
                  <div>
                    <p className="text-xs font-medium text-blue-900">Data Encrypted</p>
                    <p className="text-[10px] text-blue-600">AES-256 encryption applied to all biometric data</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Fingerprint size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No biometric data captured</p>
                <p className="text-sm text-slate-400 mt-1">
                  Click "Capture Biometrics" to begin enrollment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
