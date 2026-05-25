import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, LogIn, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";

interface FloatingShape {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function Login() {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const setPlatformUser = useAuthStore((s) => s.setPlatformUser);
  const [email, setEmail] = useState("superadmin@eims.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    const newShapes: FloatingShape[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.15 + 0.05,
    }));
    setShapes(newShapes);
  }, []);

  const loginMutation = trpc.platformUser.login.useMutation({
    onSuccess: (data) => {
      if (data.success && data.user) {
        setPlatformUser(data.user as any);
        navigate("/");
      } else {
        setError(data.error || t("loginFailed"));
      }
    },
    onError: (err) => {
      setError(err.message || t("loginFailed"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("fillAllFields"));
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Floating geometric shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-lg border border-white/10"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            opacity: shape.opacity,
            animation: `float ${shape.duration}s ease-in-out ${shape.delay}s infinite`,
            background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:flex flex-col items-center text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Sparkles size={14} className="text-blue-400" />
                <span className="text-sm text-slate-300">{t("enterprisePlatform")}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <ShieldCheck size={32} className="text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  {t("title")}
                </h1>
                <p className="text-lg text-slate-400 max-w-md">
                  {t("subtitle")}
                </p>
              </div>

              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {[
                { icon: "🔐", label: t("secureAuth") },
                { icon: "📋", label: t("docVerification") },
                { icon: "🪪", label: t("cardGeneration") },
                { icon: "📱", label: t("qrVerification") },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-xs text-slate-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">{t("title")}</h1>
                    <p className="text-xs text-slate-400">{t("subtitle")}</p>
                  </div>
                </div>
                <CardTitle className="text-xl text-white">{t("welcomeBack")}</CardTitle>
                <p className="text-sm text-slate-400 mt-1">
                  {t("signInSubtitle")}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in slide-in-from-top-2">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("emailPlaceholder")}
                      className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                      {t("password")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("passwordPlaceholder")}
                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-200"
                    disabled={loginMutation.isPending}
                  >
                    <LogIn size={16} className="mr-2" />
                    {loginMutation.isPending ? t("signingIn") : t("signIn")}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-3 text-slate-500">
                      {t("orQuickLogin")}
                    </span>
                  </div>
                </div>

                {/* Quick login buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    onClick={() => quickLogin("superadmin@eims.com", "password123")}
                  >
                    {t("superAdmin")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    onClick={() => quickLogin("operator@nia.gov", "password123")}
                  >
                    {t("operator")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    onClick={() => quickLogin("verifier@nia.gov", "password123")}
                  >
                    {t("verifier")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={12} />
              <span>{t("encryption")}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(10px) rotate(-3deg);
          }
        }
      `}</style>
    </div>
  );
}
