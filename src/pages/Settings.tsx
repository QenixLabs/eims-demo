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

export default function Settings() {
  const platformUser = useAuthStore((s) => s.platformUser);
  const { startTour } = useTour();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            Profile Information
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
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Email Notifications
              </p>
              <p className="text-xs text-slate-500">
                Receive email alerts for application updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                New Application Alerts
              </p>
              <p className="text-xs text-slate-500">
                Get notified when new applications are submitted
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Verification Reminders
              </p>
              <p className="text-xs text-slate-500">
                Reminders for pending verifications
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
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-slate-500">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Lock size={14} className="mr-1" />
              Enable
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Change Password
              </p>
              <p className="text-xs text-slate-500">
                Update your account password
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Session Management
              </p>
              <p className="text-xs text-slate-500">
                Manage your active sessions
              </p>
            </div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor size={16} className="text-blue-600" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Compact Mode
              </p>
              <p className="text-xs text-slate-500">
                Reduce spacing for more content
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Show ID Numbers
              </p>
              <p className="text-xs text-slate-500">
                Display identity numbers in lists
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Guided Tour
              </p>
              <p className="text-xs text-slate-500">
                Restart the interactive platform tour
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => startTour()}>
              <HelpCircle size={14} className="mr-1" />
              Restart Tour
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
