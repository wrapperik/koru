import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import GoogleAuthButton from "../components/UI/googleAuthButton";
import { Alert, Button, Input, Select } from "../components/UI";
import AuthLayout, { AuthDivider, AuthHeading } from "../components/auth/AuthLayout";
import RoleIcon from "../components/auth/RoleIcon";
import { AUTH_ROLE_LIST } from "../components/auth/authRoles";
import { cn } from "../utils/cn";
import {
  loginUser,
  loginWithGoogle,
  registerUser,
} from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

// Placeholder institutions – lets the user identify where they are studying
const institutions = [
  "Open Window",
  "University of Pretoria",
  "University of Johannesburg",
  "University of Cape Town",
  "University of the Witwatersrand",
  "Stellenbosch University",
  "North-West University",
  "University of South Africa",
  "Rhodes University",
];

// Default form state – keeps all sign-up values in one place
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "student",
  institution: "",
};

// Sign-up page – registers new users with profile, role, and institution details
export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Update the form state whenever the user changes an input or dropdown
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  // Validate and submit the sign-up form, then log the new user in automatically
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role,
        institution: form.institution,
      });

      const loginData = await loginUser({
        email: form.email,
        password: form.password,
      });

      login({
        ...loginData,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        institution: form.institution,
      });
      setSuccess("Account created successfully. Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Complete registration by using the Google credential returned by the auth button
  async function handleGoogleSignup(credential) {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await loginWithGoogle(credential, form.role);
      login({ ...data, institution: form.institution });
      setSuccess("Google account connected. Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      panelTitle="Start growing with Koru."
      panelBody="Create your account to join your institution's courses, classes and community."
      contentClassName="max-w-[520px]"
    >
      <AuthHeading
        eyebrow={
          <Link
            to="/"
            className="-ml-3 inline-flex items-center gap-1.5 rounded-koru-pill px-3 py-1.5 text-sm font-medium text-koru-on-surface-variant transition-colors hover:bg-koru-on-surface/8 hover:text-koru-primary"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </Link>
        }
        title="Create your account"
        subtitle="New here? It only takes a minute."
      />

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {/* Role – tonal choice chips using the same role icons as onboarding */}
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 text-koru-label text-koru-on-surface-variant">I am a</legend>
          <div className="grid grid-cols-3 gap-2">
            {AUTH_ROLE_LIST.map((role) => {
              const selected = form.role === role.key;
              return (
                <label
                  key={role.key}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-koru-lg px-2 py-3 text-koru-label transition duration-150 ease-koru-out",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-koru-focus",
                    selected
                      ? "bg-koru-surface-container-lowest text-koru-on-surface shadow-koru-sm ring-2 ring-inset ring-koru-primary"
                      : "bg-koru-surface-container text-koru-on-surface-variant hover:bg-koru-surface-container-high",
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.key}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <RoleIcon role={role} size="md" />
                  {role.key === "admin" ? "Admin" : role.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Input
          label="First name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Jane"
          autoComplete="given-name"
          required
        />

        <Input
          label="Last name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Doe"
          autoComplete="family-name"
          required
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          startIcon={<Mail size={16} />}
          containerClassName="sm:col-span-2"
          required
        />

        <Select
          label="Institution"
          name="institution"
          value={form.institution}
          onChange={handleChange}
          autoComplete="organization"
          containerClassName="sm:col-span-2"
          required
        >
          <option value="" disabled>
            Select your institution
          </option>
          {institutions.map((institution) => (
            <option key={institution} value={institution}>
              {institution}
            </option>
          ))}
        </Select>

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
          startIcon={<LockKeyhole size={16} />}
          required
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          startIcon={<LockKeyhole size={16} />}
          required
        />

        {error ? (
          <Alert variant="error" className="sm:col-span-2">
            {error}
          </Alert>
        ) : null}

        {success ? (
          <Alert variant="success" className="sm:col-span-2">
            {success}
          </Alert>
        ) : null}

        <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2 sm:col-span-2">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="my-5">
        <AuthDivider />
      </div>

      <GoogleAuthButton
        text="signup_with"
        onCredential={handleGoogleSignup}
        onError={(err) => setError(err.message || "Google sign-up failed.")}
      />

      <p className="mt-6 text-center text-sm text-koru-on-surface-variant">
        Already have an account?{" "}
        <Link to={`/${form.role}/login`} className="font-medium text-koru-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
