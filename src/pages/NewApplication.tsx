import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  User,
  Check,
  UserPlus,
  Contact,
  Camera,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function NewApplication() {
  const navigate = useNavigate();
  const platformUser = useAuthStore((s) => s.platformUser);
  const utils = trpc.useUtils();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "Male" as "Male" | "Female" | "Other",
    bloodGroup: "",
    nationality: "",
    mobileNumber: "",
    email: "",
    address: "",
    photoUrl: "",
  });

  const createMutation = trpc.enrollment.create.useMutation({
    onSuccess: () => {
      toast.success(
        step === 2
          ? "Application submitted successfully!"
          : "Application saved as draft"
      );
      navigate("/applications");
      utils.enrollment.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save application");
      setIsSubmitting(false);
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!platformUser) {
      toast.error("Please login first");
      return;
    }

    if (!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.nationality || !formData.mobileNumber || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    createMutation.mutate({
      ...formData,
      authorityId: platformUser.authorityId || 1,
      createdBy: platformUser.id,
    });
  };

  const steps = [
    { number: 1, label: "Personal Info", icon: UserPlus },
    { number: 2, label: "Contact Details", icon: Contact },
    { number: 3, label: "Review & Submit", icon: FileCheck },
  ];

  const isStepComplete = (stepNum: number) => {
    if (stepNum === 1) {
      return formData.fullName && formData.dateOfBirth && formData.gender && formData.nationality;
    }
    if (stepNum === 2) {
      return formData.mobileNumber && formData.address;
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6 -ml-2 text-slate-500 hover:text-slate-700"
        onClick={() => navigate("/applications")}
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Applications
      </Button>

      {/* Step indicator */}
      <div data-tour="step-indicator" className="mb-8">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step > s.number
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : step === s.number
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-110"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > s.number ? (
                    <Check size={20} />
                  ) : (
                    <s.icon size={20} />
                  )}
                </div>
                <span
                  className={`text-xs font-medium mt-2 text-center ${
                    step >= s.number ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-3">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${
                      step > s.number ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div data-tour="personal-info" className="lg:col-span-2 space-y-5">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      placeholder="Enter full name"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v: any) => handleChange("gender", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-sm">Blood Group</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(v) => handleChange("bloodGroup", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-sm">
                      Nationality <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleChange("nationality", e.target.value)}
                      placeholder="Enter nationality"
                      className="h-11"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo Upload Preview */}
          <div data-tour="photo-upload">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Camera size={16} className="text-blue-600" />
                  </div>
                  <CardTitle className="text-base">Photo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User size={28} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                      Click to upload photo
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG, PNG format. Max 5MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Contact size={16} className="text-blue-600" />
              </div>
              <CardTitle className="text-base">Contact Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-sm">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange("mobileNumber", e.target.value)}
                  placeholder="+1-555-0000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Full address"
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileCheck size={16} className="text-emerald-600" />
              </div>
              <CardTitle className="text-base">Review Application</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReviewItem label="Full Name" value={formData.fullName} />
              <ReviewItem label="Date of Birth" value={formData.dateOfBirth} />
              <ReviewItem label="Gender" value={formData.gender} />
              <ReviewItem label="Blood Group" value={formData.bloodGroup || "N/A"} />
              <ReviewItem label="Nationality" value={formData.nationality} />
              <ReviewItem label="Mobile" value={formData.mobileNumber} />
              <ReviewItem label="Email" value={formData.email || "N/A"} />
              <ReviewItem label="Address" value={formData.address} className="sm:col-span-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div data-tour="form-actions" className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
        <div>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} className="mr-1" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {step === 1 && (
            <Button
              variant="outline"
              onClick={() => handleSave()}
              disabled={isSubmitting}
            >
              <Save size={16} className="mr-1" />
              Save Draft
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20"
              disabled={!isStepComplete(step)}
            >
              Next Step
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => handleSave()}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-500/20"
            >
              <Send size={16} className="mr-1" />
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`p-4 bg-slate-50 rounded-xl border border-slate-100 ${className || ""}`}>
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
