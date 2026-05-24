import { useState, useReducer, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Stepper, type Step } from "@/components/ui/stepper";
import {
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Contact,
  Upload,
  Fingerprint,
  CreditCard,
  FileCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { PersonalInfoStep, validatePersonalInfo } from "./steps/PersonalInfoStep";
import { ContactDetailsStep, validateContactDetails } from "./steps/ContactDetailsStep";
import { DocumentUploadStep } from "./steps/DocumentUploadStep";
import { BiometricStep } from "./steps/BiometricStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ReviewStep } from "./steps/ReviewStep";

const STEPS: Step[] = [
  { number: 1, label: "Personal Info", icon: UserPlus },
  { number: 2, label: "Contact", icon: Contact },
  { number: 3, label: "Documents", icon: Upload },
  { number: 4, label: "Biometrics", icon: Fingerprint },
  { number: 5, label: "Payment", icon: CreditCard },
  { number: 6, label: "Review", icon: FileCheck },
];

export interface DocumentEntry {
  id?: number;
  fileName: string;
  documentType: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  isExisting: boolean;
}

export interface FormState {
  fullName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  nationality: string;
  photoUrl: string;
  mobileNumber: string;
  email: string;
  address: string;
  documents: DocumentEntry[];
  biometrics: {
    fingerprints: string[];
    leftIris: string;
    rightIris: string;
    facePhotoUrl: string;
    livenessCheck: boolean;
    livenessScore: number;
    captureQuality: "low" | "medium" | "high" | "excellent";
    isCaptured: boolean;
    isVerified: boolean;
    dedupResult: "pass" | "fail" | null;
  };
  payment: {
    amount: string;
    receiptNumber: string;
    paymentMethod: string;
    paymentId?: number;
    status?: string;
  };
}

const INITIAL_FORM_STATE: FormState = {
  fullName: "",
  dateOfBirth: "",
  gender: "Male",
  bloodGroup: "",
  nationality: "",
  photoUrl: "",
  mobileNumber: "",
  email: "",
  address: "",
  documents: [],
  biometrics: {
    fingerprints: [],
    leftIris: "",
    rightIris: "",
    facePhotoUrl: "",
    livenessCheck: false,
    livenessScore: 0,
    captureQuality: "high",
    isCaptured: false,
    isVerified: false,
    dedupResult: null,
  },
  payment: {
    amount: "50.00",
    receiptNumber: "",
    paymentMethod: "cash",
    paymentId: undefined,
    status: undefined,
  },
};

type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_BIOMETRICS"; data: Partial<FormState["biometrics"]> }
  | { type: "SET_PAYMENT"; data: Partial<FormState["payment"]> }
  | { type: "ADD_DOCUMENT"; doc: DocumentEntry }
  | { type: "REMOVE_DOCUMENT"; index: number }
  | { type: "LOAD_EXISTING"; data: Partial<FormState> };

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_BIOMETRICS":
      return { ...state, biometrics: { ...state.biometrics, ...action.data } };
    case "SET_PAYMENT":
      return { ...state, payment: { ...state.payment, ...action.data } };
    case "ADD_DOCUMENT":
      return { ...state, documents: [...state.documents, action.doc] };
    case "REMOVE_DOCUMENT":
      return { ...state, documents: state.documents.filter((_, i) => i !== action.index) };
    case "LOAD_EXISTING":
      return { ...state, ...action.data };
    default:
      return state;
  }
}

export default function NewApplication() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id && location.pathname.includes("/edit");
  const platformUser = useAuthStore((s) => s.platformUser);
  const utils = trpc.useUtils();

  const [step, setStep] = useState(1);
  const [formData, dispatch] = useReducer(formReducer, INITIAL_FORM_STATE);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedApplicationId, setSavedApplicationId] = useState<number | undefined>(
    isEditMode ? Number(id) : undefined
  );

  const updateField = useCallback((field: string, value: string) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const updateBiometrics = useCallback((data: Partial<FormState["biometrics"]>) => {
    dispatch({ type: "SET_BIOMETRICS", data });
  }, []);

  const updatePayment = useCallback((data: Partial<FormState["payment"]>) => {
    dispatch({ type: "SET_PAYMENT", data });
  }, []);

  const addDocument = useCallback((doc: DocumentEntry) => {
    dispatch({ type: "ADD_DOCUMENT", doc });
  }, []);

  const removeDocument = useCallback((index: number) => {
    dispatch({ type: "REMOVE_DOCUMENT", index });
  }, []);

  // Load existing data for edit mode
  const { data: existing } = trpc.enrollment.getById.useQuery(
    { id: Number(id) },
    { enabled: isEditMode }
  );

  const { data: existingBiometrics } = trpc.biometric.getByApplicationId.useQuery(
    { applicationId: Number(id) },
    { enabled: isEditMode }
  );

  const { data: existingPayment } = trpc.payment.getByApplicationId.useQuery(
    { applicationId: Number(id) },
    { enabled: isEditMode }
  );

  useEffect(() => {
    if (isEditMode && existing) {
      dispatch({
        type: "LOAD_EXISTING",
        data: {
          fullName: existing.fullName,
          dateOfBirth: existing.dateOfBirth,
          gender: existing.gender as "Male" | "Female" | "Other",
          bloodGroup: existing.bloodGroup || "",
          nationality: existing.nationality,
          photoUrl: existing.photoUrl || "",
          mobileNumber: existing.mobileNumber,
          email: existing.email || "",
          address: existing.address,
          documents: (existing.documents || []).map((doc: any) => ({
            id: doc.id,
            fileName: doc.fileName,
            documentType: doc.documentType,
            fileUrl: doc.fileUrl,
            fileSize: doc.fileSize || 0,
            mimeType: doc.mimeType || "",
            isExisting: true,
          })),
        },
      });
    }
  }, [isEditMode, existing]);

  useEffect(() => {
    if (isEditMode && existingBiometrics) {
      let fingerprints: string[] = [];
      try {
        fingerprints = JSON.parse(existingBiometrics.fingerprints || "[]");
      } catch {
        fingerprints = [];
      }
      dispatch({
        type: "SET_BIOMETRICS",
        data: {
          fingerprints,
          leftIris: existingBiometrics.leftIris || "",
          rightIris: existingBiometrics.rightIris || "",
          facePhotoUrl: existingBiometrics.facePhotoUrl || "",
          livenessCheck: !!existingBiometrics.livenessCheck,
          livenessScore: existingBiometrics.livenessScore || 0,
          captureQuality: existingBiometrics.captureQuality || "high",
          isCaptured: true,
          isVerified: !!existingBiometrics.verifiedAt,
          dedupResult: existingBiometrics.deduplicationResult || null,
        },
      });
    }
  }, [isEditMode, existingBiometrics]);

  useEffect(() => {
    if (isEditMode && existingPayment) {
      dispatch({
        type: "SET_PAYMENT",
        data: {
          amount: existingPayment.amount || "50.00",
          receiptNumber: existingPayment.transactionId || "",
          paymentMethod: existingPayment.paymentMethod || "cash",
          paymentId: existingPayment.id,
          status: existingPayment.status || "pending",
        },
      });
    }
  }, [isEditMode, existingPayment]);

  // Mutations
  const createMutation = trpc.enrollment.create.useMutation({
    onSuccess: (data) => {
      setSavedApplicationId(data.id);
      toast.success("Application saved as draft");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save application");
      setIsSubmitting(false);
    },
  });

  const updateMutation = trpc.enrollment.update.useMutation({
    onSuccess: () => {
      toast.success("Application updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update application");
      setIsSubmitting(false);
    },
  });

  const submitMutation = trpc.enrollment.submit.useMutation({
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      utils.enrollment.list.invalidate();
      navigate("/applications");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit application");
      setIsSubmitting(false);
    },
  });

  const biometricCaptureMutation = trpc.biometric.capture.useMutation({
    onSuccess: () => {
      toast.success("Biometric data submitted");
      dispatch({ type: "SET_BIOMETRICS", data: { isCaptured: true } });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit biometric data");
    },
  });

  const biometricVerifyMutation = trpc.biometric.verify.useMutation({
    onSuccess: () => {
      toast.success("Biometrics verified");
      dispatch({ type: "SET_BIOMETRICS", data: { isVerified: true } });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to verify biometrics");
    },
  });

  const biometricDedupMutation = trpc.biometric.runDeduplicationCheck.useMutation({
    onSuccess: (data) => {
      dispatch({
        type: "SET_BIOMETRICS",
        data: { dedupResult: data.isDuplicate ? "fail" : "pass" },
      });
      toast[data.isDuplicate ? "warning" : "success"](
        data.isDuplicate ? "Duplicate biometric data detected!" : "No duplicates found - biometric data is unique"
      );
    },
    onError: (err) => {
      toast.error(err.message || "Failed to run deduplication check");
    },
  });

  const paymentCreateMutation = trpc.payment.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Payment recorded: ${data.invoiceNumber}`);
      utils.payment.getByApplicationId.invalidate({ applicationId: savedApplicationId! });
      dispatch({
        type: "SET_PAYMENT",
        data: { paymentId: data.id, status: "pending" },
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create payment");
    },
  });

  const documentCreateMutation = trpc.document.create.useMutation();

  // Step validation
  const isStepValid = useCallback(
    (stepNum: number): boolean => {
      switch (stepNum) {
        case 1:
          return validatePersonalInfo(formData);
        case 2:
          return validateContactDetails(formData);
        case 3:
          return true;
        case 4:
          return true;
        case 5:
          return true;
        case 6:
          return validatePersonalInfo(formData) && validateContactDetails(formData);
        default:
          return false;
      }
    },
    [formData]
  );

  const handleNext = () => {
    if (step < 6 && isStepValid(step)) {
      setCompletedSteps((prev) => new Set([...prev, step]));
      setStep(step + 1);
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (completedSteps.has(targetStep)) {
      setStep(targetStep);
    }
  };

  const getEnrollmentPayload = () => {
    if (!platformUser) return null;
    return {
      fullName: formData.fullName || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup || undefined,
      nationality: formData.nationality || undefined,
      mobileNumber: formData.mobileNumber || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      photoUrl: formData.photoUrl || undefined,
    };
  };

  const handleSaveDraft = async () => {
    if (!platformUser) {
      toast.error("Please login first");
      return;
    }

    if (!validatePersonalInfo(formData) || !validateContactDetails(formData)) {
      toast.error("Please complete all required fields (steps 1 & 2) before saving");
      return;
    }

    setIsSubmitting(true);
    const payload = getEnrollmentPayload();
    if (!payload) return;

    try {
      if (savedApplicationId) {
        await updateMutation.mutateAsync({ id: savedApplicationId, ...payload });
      } else {
        await createMutation.mutateAsync({
          ...payload,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationality: formData.nationality,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          authorityId: platformUser.authorityId || 1,
          createdBy: platformUser.id,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!platformUser) {
      toast.error("Please login first");
      return;
    }

    if (!isStepValid(6)) {
      toast.error("Please complete all required fields before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      let appId = savedApplicationId;

      // Create or update enrollment
      if (!appId) {
        const created = await createMutation.mutateAsync({
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationality: formData.nationality,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          bloodGroup: formData.bloodGroup || undefined,
          email: formData.email || undefined,
          photoUrl: formData.photoUrl || undefined,
          authorityId: platformUser.authorityId || 1,
          createdBy: platformUser.id,
        });
        appId = created.id;
        setSavedApplicationId(appId);
      } else {
        const payload = getEnrollmentPayload();
        if (payload) {
          await updateMutation.mutateAsync({ id: appId, ...payload });
        }
      }

      // Upload new documents
      for (const doc of formData.documents) {
        if (!doc.isExisting) {
          await documentCreateMutation.mutateAsync({
            applicationId: appId,
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            documentType: doc.documentType as any,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
          });
        }
      }

      // Submit biometrics if captured locally
      const { biometrics } = formData;
      if (biometrics.fingerprints.length === 10 && biometrics.leftIris && biometrics.rightIris && !biometrics.isCaptured) {
        const livenessScore = 90 + Math.random() * 10;
        await biometricCaptureMutation.mutateAsync({
          applicationId: appId,
          capturedBy: platformUser.id,
          deviceId: "BIO-DEV-001",
          deviceName: "SecuGen Hamster Pro 20 (Simulated)",
          deviceCertified: true,
          fingerprints: biometrics.fingerprints,
          leftIris: biometrics.leftIris,
          rightIris: biometrics.rightIris,
          facePhotoUrl: `/photos/face_${appId}.jpg`,
          livenessCheck: livenessScore > 85,
          livenessScore,
          captureQuality: livenessScore > 95 ? "excellent" : "high",
        });
      }

      // Create payment if receipt entered and not yet created
      const { payment } = formData;
      if (payment.receiptNumber && !payment.paymentId) {
        await paymentCreateMutation.mutateAsync({
          applicationId: appId,
          amount: parseFloat(payment.amount) || 50,
          paymentMethod: payment.paymentMethod as any,
          transactionId: payment.receiptNumber,
        });
      }

      // Submit
      await submitMutation.mutateAsync({ id: appId });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricCapture = (
    fingerprints: string[],
    leftIris: string,
    rightIris: string,
    livenessScore: number,
    facePhotoUrl: string
  ) => {
    if (!platformUser || !savedApplicationId) return;
    biometricCaptureMutation.mutate({
      applicationId: savedApplicationId,
      capturedBy: platformUser.id,
      deviceId: "BIO-DEV-001",
      deviceName: "SecuGen Hamster Pro 20 (Simulated)",
      deviceCertified: true,
      fingerprints,
      leftIris,
      rightIris,
      facePhotoUrl,
      livenessCheck: livenessScore > 85,
      livenessScore,
      captureQuality: livenessScore > 95 ? "excellent" : "high",
    });
  };

  const handleBiometricVerify = () => {
    if (!platformUser || !savedApplicationId) return;
    biometricVerifyMutation.mutate({
      applicationId: savedApplicationId,
      verifiedBy: platformUser.id,
    });
  };

  const handleBiometricDedup = () => {
    if (!savedApplicationId) return;
    biometricDedupMutation.mutate({ applicationId: savedApplicationId });
  };

  const handlePaymentCreate = () => {
    if (!platformUser || !savedApplicationId) return;
    paymentCreateMutation.mutate({
      applicationId: savedApplicationId,
      amount: parseFloat(formData.payment.amount) || 50,
      paymentMethod: formData.payment.paymentMethod as any,
      transactionId: formData.payment.receiptNumber,
    });
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        className="mb-6 -ml-2 text-slate-500 hover:text-slate-700"
        onClick={() => navigate("/applications")}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Applications
      </Button>

      <div className="mb-8">
        <Stepper
          steps={STEPS}
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {step === 1 && (
        <PersonalInfoStep formData={formData} updateField={updateField} />
      )}
      {step === 2 && (
        <ContactDetailsStep formData={formData} updateField={updateField} />
      )}
      {step === 3 && (
        <DocumentUploadStep
          formData={formData}
          addDocument={addDocument}
          removeDocument={removeDocument}
        />
      )}
      {step === 4 && (
        <BiometricStep
          formData={formData}
          updateBiometrics={updateBiometrics}
          applicationId={savedApplicationId}
          isSaved={!!savedApplicationId}
          onCapture={handleBiometricCapture}
          onVerify={handleBiometricVerify}
          onDedup={handleBiometricDedup}
          captureLoading={biometricCaptureMutation.isPending}
          verifyLoading={biometricVerifyMutation.isPending}
          dedupLoading={biometricDedupMutation.isPending}
        />
      )}
      {step === 5 && (
        <PaymentStep
          formData={formData}
          updatePayment={updatePayment}
          applicationId={savedApplicationId}
          isSaved={!!savedApplicationId}
          onCreatePayment={handlePaymentCreate}
          isCreatingPayment={paymentCreateMutation.isPending}
        />
      )}
      {step === 6 && <ReviewStep formData={formData} />}

      {/* Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <div>
          {step > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              <ArrowLeft size={16} className="mr-1" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={16} className="mr-1 animate-spin" />
            ) : (
              <Save size={16} className="mr-1" />
            )}
            Save Draft
          </Button>

          {step < 6 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(step)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20"
            >
              Next Step
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="mr-1 animate-spin" />
              ) : (
                <Send size={16} className="mr-1" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
