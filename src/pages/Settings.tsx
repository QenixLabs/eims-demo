import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  ShieldCheck,
  Monitor,
  Lock,
  HelpCircle,
} from "lucide-react";
import { useTour } from "@/components/tour/TourProvider";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const platformUser = useAuthStore((s) => s.platformUser);
  const { startTour } = useTour();
  const { t } = useTranslation("settings");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            {t("profileInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium">
              {platformUser?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {platformUser?.name}
              </p>
              <p className="text-sm text-slate-500">
                {platformUser?.email}
              </p>
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                {platformUser?.role.replace("_", " ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell size={16} className="text-blue-600" />
            {t("notifications")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("emailNotifications")}
              </p>
              <p className="text-xs text-slate-500">
                {t("emailNotificationsDesc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("newAppAlerts")}
              </p>
              <p className="text-xs text-slate-500">
                {t("newAppAlertsDesc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("verificationReminders")}
              </p>
              <p className="text-xs text-slate-500">
                {t("verificationRemindersDesc")}
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" />
            {t("security")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("twoFactor")}
              </p>
              <p className="text-xs text-slate-500">
                {t("twoFactorDesc")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Lock size={14} className="mr-1" />
              {t("enable")}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("changePassword")}
              </p>
              <p className="text-xs text-slate-500">
                {t("changePasswordDesc")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t("update")}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("sessionManagement")}
              </p>
              <p className="text-xs text-slate-500">
                {t("sessionManagementDesc")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t("view")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor size={16} className="text-blue-600" />
            {t("display")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("compactMode")}
              </p>
              <p className="text-xs text-slate-500">
                {t("compactModeDesc")}
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("showIdNumbers")}
              </p>
              <p className="text-xs text-slate-500">
                {t("showIdNumbersDesc")}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {t("guidedTour")}
              </p>
              <p className="text-xs text-slate-500">
                {t("guidedTourDesc")}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => startTour()}>
              <HelpCircle size={14} className="mr-1" />
              {t("restartTour")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
