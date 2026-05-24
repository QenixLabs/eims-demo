import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "lucide-react";
import type { FormState } from "../NewApplication";

interface Props {
  formData: FormState;
  updateField: (field: string, value: string) => void;
}

export function ContactDetailsStep({ formData, updateField }: Props) {
  return (
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
              onChange={(e) => updateField("mobileNumber", e.target.value)}
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
              onChange={(e) => updateField("email", e.target.value)}
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
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Full address"
            rows={3}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function validateContactDetails(formData: FormState): boolean {
  return !!(formData.mobileNumber && formData.address);
}
