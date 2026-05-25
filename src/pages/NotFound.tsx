import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <ShieldCheck size={48} className="text-slate-300 mb-4" />
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-500 mb-6">{t("pageNotFound")}</p>
      <Link to="/">
        <Button variant="outline">
          <ArrowLeft size={16} className="mr-1" />
          {t("backToDashboard")}
        </Button>
      </Link>
    </div>
  );
}
