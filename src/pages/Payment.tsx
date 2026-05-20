import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  TrendingUp,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const platformUser = useAuthStore((s) => s.platformUser);
  const [paymentAmount, setPaymentAmount] = useState("50.00");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const applicationId = Number(id);

  const { data: application } = trpc.enrollment.getById.useQuery({
    id: applicationId,
  });

  const { data: existingPayment } = trpc.payment.getByApplicationId.useQuery({
    applicationId,
  });

  const { data: paymentStats } = trpc.payment.stats.useQuery();

  const createPaymentMutation = trpc.payment.create.useMutation({
    onSuccess: (data) => {
      toast.success(`Payment invoice created: ${data.invoiceNumber}`);
      utils.payment.getByApplicationId.invalidate({ applicationId });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create payment");
    },
  });

  const processPaymentMutation = trpc.payment.processPayment.useMutation({
    onSuccess: () => {
      toast.success("Payment processed successfully!");
      utils.payment.getByApplicationId.invalidate({ applicationId });
      utils.enrollment.getById.invalidate({ id: applicationId });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to process payment");
    },
  });

  const simulatePaymentMutation = trpc.payment.simulatePayment.useMutation({
    onSuccess: () => {
      toast.success("Payment simulation completed!");
      utils.payment.getByApplicationId.invalidate({ applicationId });
      utils.enrollment.getById.invalidate({ id: applicationId });
    },
    onError: (err) => {
      toast.error(err.message || "Payment simulation failed");
    },
  });

  const generateReceiptMutation = trpc.payment.generateReceipt.useMutation({
    onSuccess: () => {
      toast.success("Receipt generated!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to generate receipt");
    },
  });

  const utils = trpc.useUtils();

  const handleCreatePayment = () => {
    createPaymentMutation.mutate({
      applicationId,
      amount: parseFloat(paymentAmount),
      paymentMethod: paymentMethod as any,
    });
  };

  const handleProcessPayment = () => {
    if (!existingPayment) return;
    processPaymentMutation.mutate({
      paymentId: existingPayment.id,
      transactionId: `TXN-${Date.now()}`,
    });
  };

  const handleSimulatePayment = (success: boolean) => {
    if (!existingPayment) return;
    simulatePaymentMutation.mutate({
      paymentId: existingPayment.id,
      success,
      failureReason: success ? undefined : "Insufficient funds",
    });
  };

  const handleGenerateReceipt = () => {
    if (!existingPayment) return;
    generateReceiptMutation.mutate({ paymentId: existingPayment.id });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 size={14} className="text-emerald-600" />;
      case "pending": return <Clock size={14} className="text-amber-600" />;
      case "failed": return <XCircle size={14} className="text-red-600" />;
      case "processing": return <Loader2 size={14} className="text-blue-600 animate-spin" />;
      case "refunded": return <AlertTriangle size={14} className="text-purple-600" />;
      default: return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      failed: "bg-red-100 text-red-700",
      processing: "bg-blue-100 text-blue-700",
      refunded: "bg-purple-100 text-purple-700",
      cancelled: "bg-slate-100 text-slate-700",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="-ml-2 text-slate-500" onClick={() => navigate(`/applications/${id}`)}>
          <ArrowLeft size={16} className="mr-1" />
          Back to Application
        </Button>
      </div>

      {/* Payment Stats */}
      {paymentStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-emerald-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{paymentStats.completed}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{paymentStats.pending}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{paymentStats.failed}</p>
                <p className="text-xs text-slate-500">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">${paymentStats.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-slate-500">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applicant Info */}
      {application && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                {application.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{application.fullName}</h3>
                <p className="text-sm text-slate-500">
                  Application #{application.id.toString().padStart(4, "0")} | {application.applicationRef}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Payment Status</p>
                <Badge className={getStatusBadge(application.paymentStatus || "pending")}>
                  {(application.paymentStatus || "pending").replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign size={18} className="text-blue-600" />
              Payment Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!existingPayment ? (
              <>
                <div className="space-y-2">
                  <Label>Payment Amount (USD)</Label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pl-9 h-11"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
                  onClick={handleCreatePayment}
                  disabled={createPaymentMutation.isPending}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                >
                  <Receipt size={16} className="mr-2" />
                  Create Payment Invoice
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-slate-900">Invoice Details</h5>
                    <Badge className={getStatusBadge(existingPayment.status)}>
                      {getStatusIcon(existingPayment.status)}
                      <span className="ml-1">{existingPayment.status}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Invoice Number</p>
                      <p className="font-mono font-medium text-slate-700">{existingPayment.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Amount</p>
                      <p className="font-bold text-slate-900">${existingPayment.amount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Method</p>
                      <p className="font-medium text-slate-700 capitalize">{existingPayment.paymentMethod?.replace("_", " ")}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Transaction ID</p>
                      <p className="font-mono text-xs text-slate-600">{existingPayment.transactionId || "Pending"}</p>
                    </div>
                  </div>
                </div>

                {existingPayment.status === "pending" && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSimulatePayment(true)}
                      disabled={simulatePaymentMutation.isPending}
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600"
                    >
                      <CheckCircle2 size={16} className="mr-2" />
                      Simulate Successful Payment
                    </Button>
                    <Button
                      onClick={() => handleSimulatePayment(false)}
                      disabled={simulatePaymentMutation.isPending}
                      variant="outline"
                      className="w-full h-11 border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle size={16} className="mr-2" />
                      Simulate Failed Payment
                    </Button>
                  </div>
                )}

                {existingPayment.status === "completed" && (
                  <Button
                    onClick={handleGenerateReceipt}
                    disabled={generateReceiptMutation.isPending}
                    variant="outline"
                    className="w-full h-11"
                  >
                    <FileText size={16} className="mr-2" />
                    Generate Receipt
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h5 className="text-sm font-semibold text-blue-900 mb-3">Fee Structure</h5>
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
              <h5 className="text-sm font-semibold text-slate-900 mb-3">Accepted Payment Methods</h5>
              <div className="grid grid-cols-2 gap-2">
                {["Cash", "Credit Card", "Debit Card", "UPI", "Bank Transfer", "Govt Voucher"].map((method) => (
                  <div key={method} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    {method}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-900">Payment Required</p>
                <p className="text-[10px] text-amber-700 mt-0.5">
                  Identity card will be issued only after successful payment completion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
