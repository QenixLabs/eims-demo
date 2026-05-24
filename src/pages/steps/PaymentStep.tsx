import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  CreditCard,
  Receipt,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import type { FormState } from "../NewApplication";

interface Props {
  formData: FormState;
  updatePayment: (data: Partial<FormState["payment"]>) => void;
  applicationId?: number;
  isSaved: boolean;
  onCreatePayment: () => void;
  isCreatingPayment: boolean;
}

export function PaymentStep({
  formData,
  updatePayment,
  applicationId,
  isSaved,
  onCreatePayment,
  isCreatingPayment,
}: Props) {
  const { payment } = formData;
  const paymentExists = !!payment.paymentId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Form */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign size={18} className="text-blue-600" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!paymentExists ? (
            <>
              {!isSaved && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Save the application as a draft before recording payment.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Payment Amount (USD)</Label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => updatePayment({ amount: e.target.value })}
                    className="pl-9 h-11"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Receipt Number</Label>
                <div className="relative">
                  <Receipt size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={payment.receiptNumber}
                    onChange={(e) => updatePayment({ receiptNumber: e.target.value })}
                    placeholder="Enter receipt number"
                    className="pl-9 h-11"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Enter the receipt number from the bank deposit slip
                </p>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={payment.paymentMethod}
                  onValueChange={(v) => updatePayment({ paymentMethod: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="government_voucher">Government Voucher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={onCreatePayment}
                disabled={isCreatingPayment || !payment.receiptNumber || !isSaved}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              >
                {isCreatingPayment ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" />Creating...</>
                ) : (
                  <><Receipt size={16} className="mr-2" />Record Payment</>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-semibold text-slate-900">Payment Recorded</h5>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={12} className="mr-1" />
                    Paid
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Amount</p>
                    <p className="font-bold text-slate-900">${payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Method</p>
                    <p className="font-medium text-slate-700 capitalize">
                      {payment.paymentMethod.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Receipt Number</p>
                    <p className="font-mono text-xs text-slate-600">{payment.receiptNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Status</p>
                    <p className="font-medium text-emerald-600">Completed</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-700">
                  Payment recorded successfully. Proceed to submit the application.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Info */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h5 className="text-sm font-semibold text-blue-900 mb-3">Breakdown</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Identity Card Fee</span>
                <span className="font-medium text-blue-900">$35.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Biometric Enrollment</span>
                <span className="font-medium text-blue-900">$10.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Processing Fee</span>
                <span className="font-medium text-blue-900">$5.00</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="font-semibold text-blue-900">Total</span>
                <span className="font-bold text-blue-900">$50.00</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Instructions</h5>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600 w-4">1.</span>
                <span>Visit the nearest designated bank branch</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600 w-4">2.</span>
                <span>Deposit the exact amount and collect the receipt</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600 w-4">3.</span>
                <span>Enter the receipt number in the form</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-emerald-900">Important</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Identity card will be issued after application submission.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
