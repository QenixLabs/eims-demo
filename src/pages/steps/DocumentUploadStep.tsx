import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Trash2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FormState, DocumentEntry } from "../NewApplication";

interface Props {
  formData: FormState;
  addDocument: (doc: DocumentEntry) => void;
  removeDocument: (index: number) => void;
}

export function DocumentUploadStep({ formData, addDocument, removeDocument }: Props) {
  const { t } = useTranslation("documentUpload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("driver_license");
  const [dragOver, setDragOver] = useState(false);

  const documentTypes = [
    { value: "driver_license", label: t("driverLicense") },
    { value: "voter_id", label: t("voterId") },
    { value: "passport", label: t("passport") },
    { value: "address_proof", label: t("addressProof") },
    { value: "utility_bill", label: t("utilityBill") },
    { value: "photo", label: t("photo") },
    { value: "other", label: t("other") },
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        addDocument({
          fileName: file.name,
          documentType: docType,
          fileUrl: reader.result as string,
          fileSize: file.size,
          mimeType: file.type,
          isExisting: false,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Upload size={16} className="text-blue-600" />
            </div>
            <CardTitle className="text-base">{t("title")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label className="text-sm">{t("documentType")}</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
            }`}
          >
            <Upload size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-600">
              {t("dragDrop")}
            </p>
            <p className="text-xs text-slate-400 mt-1">{t("fileFormat")}</p>
          </div>
        </CardContent>
      </Card>

      {formData.documents.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">{t("noDocuments")}</p>
            <p className="text-sm text-slate-400 mt-1">
              {t("uploadOneDoc")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              {t("uploadedDocuments")} ({formData.documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-[250px]">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-slate-400">{formatFileSize(doc.fileSize)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {doc.documentType.replace("_", " ")}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      onClick={() => removeDocument(index)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {formData.documents.length === 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            {t("skipNote")}
          </p>
        </div>
      )}
    </div>
  );
}
