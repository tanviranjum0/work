import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import api, { getApiErrorMessage, saveSession } from "../../utils/api";
import { ROLES } from "../../utils/roles";
import { useUser } from "../../contexts/UserContext";
import { useCaptain } from "../../contexts/CaptainContext";
import { AuthLayout, Banner, Button, Input } from "../../components/ui";
import { RecoveryCodes, TwoFactorChallenge, TwoFactorSetup } from "../../components/auth/TwoFactor";
import RoleTabs from "./RoleTabs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login({ role = "user" }) {
  const config = ROLES[role];
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  const { setCaptain } = useCaptain();

  // credentials -> (challenge | setup -> recovery)
  const [step, setStep] = useState("credentials");
  const [challenge, setChallenge] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [pendingSession, setPendingSession] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const finish = (data) => {
    const account = data[role];
    saveSession({ token: data.token, type: role, data: account });
    (role === "user" ? setUser : setCaptain)(account);
    // Accounts created before two-factor existed are nudged from the home screen.
    const next = location.state?.from && location.state.from.startsWith("/") ? location.state.from : config.home;
    navigate(next, { replace: true, state: account.twoFactorEnabled === false ? { suggestTwoFactor: true } : undefined });
  };

  const restart = (message) => {
    setStep("credentials");
    setChallenge(null);
    setEnrollment(null);
    setNotice(message || "");
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post(`/${role}/login`, values);
      if (data.requiresTwoFactor) {
        setChallenge(data.challengeToken);
        setStep("challenge");
      } else if (data.requiresTwoFactorSetup) {
        setEnrollment(data);
        setStep("setup");
      } else finish(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (step === "challenge") {
    return (
      <AuthLayout>
        <div className="qr-auth-card">
          <TwoFactorChallenge role={role} challengeToken={challenge} onVerified={finish} onRestart={restart} />
          <Button variant="ghost" icon={<ArrowLeft size={17} />} onClick={() => restart()}>
            Back to sign in
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (step === "setup") {
    return (
      <AuthLayout>
        <div className="qr-auth-card">
          <TwoFactorSetup
            role={role}
            enrollment={enrollment}
            onRestart={restart}
            onActivated={(data) => {
              setPendingSession(data);
              setRecoveryCodes(data.recoveryCodes);
              setStep("recovery");
            }}
          />
        </div>
      </AuthLayout>
    );
  }

  if (step === "recovery") {
    return (
      <AuthLayout>
        <div className="qr-auth-card">
          <RecoveryCodes codes={recoveryCodes} onContinue={() => finish(pendingSession)} />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="qr-auth-card">
        <RoleTabs active={role} to="login" />
        <div>
          <h1>Welcome back</h1>
          <p className="qr-auth-lede">
            Sign in to {role === "captain" ? "start earning" : "book your next ride"}. You will stay signed in on this device.
          </p>
        </div>

        {notice && <Banner tone="info">{notice}</Banner>}
        {error && <Banner tone="danger">{error}</Banner>}

        <form className="qr-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            error={errors.email}
            {...register("email", {
              required: "Enter your email address",
              pattern: { value: EMAIL, message: "That does not look like an email address" },
              setValueAs: (value) => value.trim().toLowerCase(),
            })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password}
            {...register("password", {
              required: "Enter your password",
              minLength: { value: 8, message: "Passwords are at least 8 characters" },
            })}
          />
          <Link to={`/${role}/forgot-password`} style={{ justifySelf: "end", fontSize: "var(--text-sm)", fontWeight: 600 }}>
            Forgot password?
          </Link>
          <Button type="submit" loading={loading} loadingText="Signing in">
            Sign in
          </Button>
        </form>

        <p className="qr-auth-switch">
          New to QuickRide? <Link to={config.signup}>Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
