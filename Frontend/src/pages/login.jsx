import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import GoogleAuthButton from "../components/UI/googleAuthButton";
import TwoFactorSetupModal from "../components/UI/TwoFactorSetupModal";
import { Alert, Badge, Button, Card, Input } from "../components/UI";
import AuthLayout, { AuthDivider, AuthHeading } from "../components/auth/AuthLayout";
import RoleIcon from "../components/auth/RoleIcon";
import { AUTH_ROLES } from "../components/auth/authRoles";
import { loginUser, loginWithGoogle, validate2FA } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const stepMotion = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.18, ease: [0.2, 0, 0, 1] },
};

// Login page – authenticates users with email/password or Google,
// then handles the 2FA challenge and the first-login 2FA setup offer.
export default function Login({ role = "student" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const config = AUTH_ROLES[role] || AUTH_ROLES.student;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // "twoFactor" = showing TOTP code input after credentials accepted
  // "firstLoginPrompt" = offering to enable 2FA after first ever login
  const [step, setStep] = useState("credentials");
  const [pendingUserId, setPendingUserId] = useState(null);
  const [pendingUserData, setPendingUserData] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((c) => ({ ...c, [name]: value }));
    if (error) setError("");
  }

  // After credentials or 2FA are validated, check if this is the user's
  // first login. If so, offer 2FA setup before entering the app.
  function afterAuth(userData) {
    const alreadyPrompted = localStorage.getItem(
      `twoFactorPrompted_${userData.userId}`,
    );
    if (!alreadyPrompted && !userData.twoFactorEnabled) {
      setPendingUserData(userData);
      setStep("firstLoginPrompt");
    } else {
      finalizeLogin(userData);
    }
  }

  function finalizeLogin(userData) {
    login({
      userId: userData.userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      profileImageUrl: userData.profileImageUrl,
      twoFactorEnabled: userData.twoFactorEnabled ?? false,
    });
    navigate("/dashboard");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
        expectedRole: role,
      });

      if (data.requiresTwoFactor) {
        setPendingUserId(data.pendingUserId);
        setStep("twoFactor");
        return;
      }

      afterAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(credential) {
    setError("");
    setLoading(true);

    try {
      const data = await loginWithGoogle(credential, role);

      if (data.requiresTwoFactor) {
        setPendingUserId(data.pendingUserId);
        setStep("twoFactor");
        return;
      }

      afterAuth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactorSubmit(event) {
    event.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const data = await validate2FA(pendingUserId, twoFactorCode.trim());
      afterAuth(data);
    } catch (err) {
      setError(err.message);
      setTwoFactorCode("");
    } finally {
      setVerifying(false);
    }
  }

  function handleTwoFactorCodeInput(e) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setTwoFactorCode(val);
    if (error) setError("");
  }

  function dismissFirstLoginPrompt() {
    localStorage.setItem(
      `twoFactorPrompted_${pendingUserData.userId}`,
      "1",
    );
    finalizeLogin(pendingUserData);
  }

  function handleSetupComplete() {
    setShowSetupModal(false);
    localStorage.setItem(
      `twoFactorPrompted_${pendingUserData.userId}`,
      "1",
    );
    finalizeLogin({ ...pendingUserData, twoFactorEnabled: true });
  }

  const headings = {
    credentials: {
      title: "Welcome back",
      subtitle: `Sign in to your ${config.label.toLowerCase()} account.`,
    },
    twoFactor: {
      title: "Check your phone",
      subtitle: "Enter the 6-digit code from your authenticator app.",
    },
    firstLoginPrompt: {
      title: "Secure your account",
      subtitle: "Add a second sign-in step to keep your account protected.",
    },
  };
  const heading = headings[step];

  return (
    <AuthLayout panelTitle={config.panelTitle} panelBody={config.panelBody}>
      <AuthHeading
        eyebrow={
          <div className="flex items-center justify-between gap-3">
            <Badge variant={config.badgeVariant} size="md" className="pl-1">
              <RoleIcon role={config} size="sm" className="bg-koru-surface-container-lowest/70" />
              {config.portal}
            </Badge>
            {step === "credentials" ? (
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-koru-pill px-3 py-1.5 text-sm font-medium text-koru-on-surface-variant transition-colors hover:bg-koru-on-surface/8 hover:text-koru-primary"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Change role
              </Link>
            ) : null}
          </div>
        }
        title={heading.title}
        subtitle={heading.subtitle}
      />

      <AnimatePresence mode="wait" initial={false}>
        {step === "credentials" && (
          <Motion.form key="credentials" {...stepMotion} onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              id="login-email"
              autoComplete="email"
              startIcon={<Mail size={16} />}
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              id="login-password"
              autoComplete="current-password"
              startIcon={<LockKeyhole size={16} />}
              endAdornment={
                <Button
                  type="button"
                  variant="text"
                  size="icon"
                  className="h-8 w-8 text-koru-on-surface-variant"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              }
            />

            {error ? <Alert variant="error">{error}</Alert> : null}

            <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <AuthDivider />

            <GoogleAuthButton
              text="signin_with"
              onCredential={handleGoogleLogin}
              onError={(err) => setError(err.message || "Google sign-in failed.")}
            />

            <p className="mt-2 text-center text-sm text-koru-on-surface-variant">
              New to Koru?{" "}
              <Link to="/signup" className="font-medium text-koru-primary hover:underline">
                Create an account
              </Link>
            </p>
          </Motion.form>
        )}

        {step === "twoFactor" && (
          <Motion.form key="twoFactor" {...stepMotion} onSubmit={handleTwoFactorSubmit} className="flex flex-col gap-4">
            <Input
              label="Authentication code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              value={twoFactorCode}
              onChange={handleTwoFactorCodeInput}
              placeholder="000000"
              autoFocus
              size="lg"
              className="text-center font-mono text-2xl tracking-[0.5em]"
            />

            {error ? <Alert variant="error">{error}</Alert> : null}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={verifying}
              disabled={twoFactorCode.length < 6}
              startIcon={<ShieldCheck size={18} />}
            >
              Verify code
            </Button>

            <Button
              type="button"
              variant="text"
              fullWidth
              onClick={() => {
                setStep("credentials");
                setError("");
                setTwoFactorCode("");
              }}
            >
              Back to sign in
            </Button>
          </Motion.form>
        )}

        {step === "firstLoginPrompt" && (
          <Motion.div key="firstLoginPrompt" {...stepMotion} className="flex flex-col gap-4">
            <Card tone="tertiary" radius="xl" padding="sm" className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-koru-md bg-koru-surface-container-lowest/70 text-koru-on-tertiary-container">
                <ShieldCheck size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="text-sm leading-relaxed text-koru-on-tertiary-container">
                Two-factor authentication asks for a one-time code from your phone when
                you sign in, so your account stays safe even if your password is
                compromised.
              </p>
            </Card>

            <Button
              type="button"
              size="lg"
              fullWidth
              startIcon={<ShieldCheck size={18} />}
              onClick={() => setShowSetupModal(true)}
              className="mt-2"
            >
              Turn on 2FA
            </Button>

            <Button type="button" size="lg" fullWidth variant="text" onClick={dismissFirstLoginPrompt}>
              Maybe later
            </Button>

            <p className="text-center text-koru-caption text-koru-on-surface-variant">
              You can turn this on any time in Settings → Password &amp; Security.
            </p>
          </Motion.div>
        )}
      </AnimatePresence>

      {showSetupModal && pendingUserData ? (
        <TwoFactorSetupModal
          userId={pendingUserData.userId}
          onSuccess={handleSetupComplete}
          onClose={() => setShowSetupModal(false)}
        />
      ) : null}
    </AuthLayout>
  );
}
