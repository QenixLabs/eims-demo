import { Routes, Route } from "react-router";
import { useAuthStore } from "@/store/authStore";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Applications from "@/pages/Applications";
import NewApplication from "@/pages/NewApplication";
import ApplicationDetail from "@/pages/ApplicationDetail";
import Verification from "@/pages/Verification";
import VerificationDetail from "@/pages/VerificationDetail";
import CardIssuance from "@/pages/CardIssuance";
import CardDetail from "@/pages/CardDetail";
import Authorities from "@/pages/Authorities";
import UsersPage from "@/pages/Users";
import VerifyCard from "@/pages/VerifyCard";
import Settings from "@/pages/Settings";
import BiometricCapture from "@/pages/BiometricCapture";
import Payment from "@/pages/Payment";
import AuditDashboard from "@/pages/AuditDashboard";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const platformUser = useAuthStore((s) => s.platformUser);

  if (!platformUser || !allowedRoles.includes(platformUser.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-slate-500">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<VerifyCard />} />
      <Route path="/verify/:identityNumber" element={<VerifyCard />} />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<NewApplication />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />
                <Route path="/applications/:id/biometrics" element={<BiometricCapture />} />
                <Route path="/applications/:id/payment" element={<Payment />} />
                <Route
                  path="/verification"
                  element={
                    <RoleGuard
                      allowedRoles={[
                        "super_admin",
                        "authority_admin",
                        "verification_officer",
                      ]}
                    >
                      <Verification />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/verification/:id"
                  element={
                    <RoleGuard
                      allowedRoles={[
                        "super_admin",
                        "authority_admin",
                        "verification_officer",
                      ]}
                    >
                      <VerificationDetail />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/card-issuance"
                  element={
                    <RoleGuard
                      allowedRoles={["super_admin", "authority_admin"]}
                    >
                      <CardIssuance />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/card-issuance/:id"
                  element={
                    <RoleGuard
                      allowedRoles={["super_admin", "authority_admin"]}
                    >
                      <CardDetail />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/authorities"
                  element={
                    <RoleGuard allowedRoles={["super_admin"]}>
                      <Authorities />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <RoleGuard
                      allowedRoles={["super_admin", "authority_admin"]}
                    >
                      <UsersPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <RoleGuard allowedRoles={["super_admin", "authority_admin"]}>
                      <AuditDashboard />
                    </RoleGuard>
                  }
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </AuthGuard>
        }
      />
    </Routes>
  );
}
