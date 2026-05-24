import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Fingerprint,
  Eye,
  Camera,
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Activity,
  HardDrive,
  AlertCircle,
} from "lucide-react";
import type { FormState } from "../NewApplication";

interface Props {
  formData: FormState;
  updateBiometrics: (data: Partial<FormState["biometrics"]>) => void;
  applicationId?: number;
  isSaved: boolean;
  onCapture: (
    fingerprints: string[],
    leftIris: string,
    rightIris: string,
    livenessScore: number,
    facePhotoUrl: string
  ) => void;
  onVerify: () => void;
  onDedup: () => void;
  captureLoading: boolean;
  verifyLoading: boolean;
  dedupLoading: boolean;
}

function randomFingerprintString(finger: string) {
  return `FP-${finger}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function randomIrisString() {
  return Math.random().toString(36).substring(2, 34);
}

export function BiometricStep({
  formData,
  updateBiometrics,
  applicationId,
  isSaved,
  onCapture,
  onVerify,
  onDedup,
  captureLoading,
  verifyLoading,
  dedupLoading,
}: Props) {
  const [capturingFingerprints, setCapturingFingerprints] = useState(false);
  const [capturingIris, setCapturingIris] = useState(false);
  const { biometrics } = formData;

  const handleCaptureFingerprints = async () => {
    setCapturingFingerprints(true);
    await new Promise((r) => setTimeout(r, 2000));
    const fingers = ["RIGHT-THUMB", "RIGHT-INDEX", "RIGHT-MIDDLE", "RIGHT-RING", "RIGHT-PINKY",
      "LEFT-THUMB", "LEFT-INDEX", "LEFT-MIDDLE", "LEFT-RING", "LEFT-PINKY"];
    const fingerprints = fingers.map(randomFingerprintString);
    updateBiometrics({ fingerprints });
    setCapturingFingerprints(false);
  };

  const handleCaptureIris = async () => {
    setCapturingIris(true);
    await new Promise((r) => setTimeout(r, 2000));
    const leftIris = `IRIS-L-${randomIrisString()}`;
    const rightIris = `IRIS-R-${randomIrisString()}`;
    updateBiometrics({ leftIris, rightIris });
    setCapturingIris(false);
  };

  const hasFingerprints = biometrics.fingerprints.length === 10;
  const hasIris = !!(biometrics.leftIris && biometrics.rightIris);
  const bothCaptured = hasFingerprints && hasIris;
  const showSubmitToBackend = bothCaptured && !biometrics.isCaptured && isSaved && !!applicationId;
  const isVerified = biometrics.isVerified;
  const dedupResult = biometrics.dedupResult;

  return (
    <div className="space-y-5">
      {!isSaved && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Save the application as a draft first before submitting biometric data to the server.
            You can still simulate captures below.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                  <p className="text-slate-500">Fingerprint Scanner</p>
                  <p className="font-medium text-slate-700">SecuGen Hamster Pro 20</p>
                </div>
                <div>
                  <p className="text-slate-500">Iris Scanner</p>
                  <p className="font-medium text-slate-700">IrisGuard IG-100</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="font-medium text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Connected (Simulated)
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
                onClick={handleCaptureFingerprints}
                disabled={capturingFingerprints || capturingIris}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              >
                {capturingFingerprints ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" />Capturing...</>
                ) : hasFingerprints ? (
                  <><CheckCircle2 size={16} className="mr-2" />Re-capture Fingerprints</>
                ) : (
                  <><Fingerprint size={16} className="mr-2" />Capture Fingerprints</>
                )}
              </Button>

              <Button
                onClick={handleCaptureIris}
                disabled={capturingIris || capturingFingerprints}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
              >
                {capturingIris ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" />Scanning...</>
                ) : hasIris ? (
                  <><CheckCircle2 size={16} className="mr-2" />Re-scan Iris</>
                ) : (
                  <><Eye size={16} className="mr-2" />Scan Iris</>
                )}
              </Button>

              {showSubmitToBackend && (
                <Button
                  onClick={() => {
                    if (!applicationId) return;
                    const livenessScore = 90 + Math.random() * 10;
                    const facePhotoUrl = `/photos/face_${applicationId}.jpg`;
                    onCapture(
                      biometrics.fingerprints,
                      biometrics.leftIris,
                      biometrics.rightIris,
                      livenessScore,
                      facePhotoUrl
                    );
                  }}
                  disabled={captureLoading}
                  className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600"
                >
                  {captureLoading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" />Submitting...</>
                  ) : (
                    <><HardDrive size={16} className="mr-2" />Submit Biometric Data</>
                  )}
                </Button>
              )}

              {biometrics.isCaptured && !isVerified && isSaved && (
                <Button
                  onClick={onVerify}
                  disabled={verifyLoading}
                  variant="outline"
                  className="w-full h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  {verifyLoading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" />Verifying...</>
                  ) : (
                    <><CheckCircle2 size={16} className="mr-2" />Verify Biometrics</>
                  )}
                </Button>
              )}

              {biometrics.isCaptured && isSaved && (
                <Button
                  onClick={onDedup}
                  disabled={dedupLoading}
                  variant="outline"
                  className="w-full h-11"
                >
                  {dedupLoading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" />Checking...</>
                  ) : (
                    <><Activity size={16} className="mr-2" />Run Deduplication Check</>
                  )}
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
            {hasFingerprints || hasIris ? (
              <>
                {hasFingerprints && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Fingerprint size={14} className="text-blue-600" />
                      Fingerprints (10)
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {biometrics.fingerprints.map((fp, i) => (
                        <div key={i} className="text-xs font-mono bg-white px-2 py-1.5 rounded border border-slate-200 truncate">
                          {fp.substring(0, 20)}...
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasIris && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Eye size={12} /> Left Iris
                      </p>
                      <p className="text-xs font-mono text-slate-700 truncate">
                        {biometrics.leftIris}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                        <Eye size={12} /> Right Iris
                      </p>
                      <p className="text-xs font-mono text-slate-700 truncate">
                        {biometrics.rightIris}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status badges */}
                <div className="flex flex-wrap gap-2">
                  {biometrics.isCaptured && (
                    <Badge className="bg-blue-100 text-blue-700">Captured</Badge>
                  )}
                  {isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>
                  )}
                  {!isVerified && biometrics.isCaptured && (
                    <Badge className="bg-amber-100 text-amber-700">Pending Verification</Badge>
                  )}
                  {dedupResult === "pass" && (
                    <Badge className="bg-emerald-100 text-emerald-700">Unique</Badge>
                  )}
                  {dedupResult === "fail" && (
                    <Badge className="bg-red-100 text-red-700">Duplicate Detected</Badge>
                  )}
                </div>

                {/* Liveness */}
                {biometrics.livenessScore > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Camera size={14} className="text-blue-600" />
                        Liveness Detection
                      </h5>
                      {biometrics.livenessCheck ? (
                        <Badge className="bg-emerald-100 text-emerald-700">Passed</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">Failed</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${Math.min(biometrics.livenessScore, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {biometrics.livenessScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

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
                  Use the capture buttons to begin enrollment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
