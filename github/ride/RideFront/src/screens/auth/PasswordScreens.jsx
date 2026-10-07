import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Mail, MailCheck, XCircle } from "lucide-react";
import api, { getApiErrorMessage } from "../../utils/api";
import useCooldownTimer from "../../hooks/useCooldownTimer";
import { ROLES } from "../../utils/roles";
import { AuthLayout, Banner, Button, Input, Spinner } from "../../components/ui";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function useRoleParam() {
  const { userType } = useParams();
  return ROLES[userType] ? userType : null;
}

export function ForgotPassword() {
  const role = useRoleParam();
  const { isActive, timeLeft, startCooldown } = useCooldownTimer(60000, "forgot-password-cooldown");
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!role) return <Navigate to="/not-found" replace />;

  const onSubmit = async ({ email }) => {
    setLoading(true);
    setError("");
    try {
      await api.post(`/mail/${role}/reset-password`, { email });
      setSent(email);
      startCooldown();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="qr-auth-card">
        <div>
          <h1>Reset your password</h1>
          <p className="qr-auth-lede">Enter the email you signed up with and we will send you a reset link.</p>
        </div>
        {sent && (
          <Banner tone="success">
            If an account exists for {sent}, a reset link is on its way. It is valid for 15 minutes.
          </Banner>
        )}
        {error && <Banner tone="danger">{error}</Banner>}
        <form className="qr-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            icon={<Mail size={18} />}
            error={errors.email}
            {...register("email", {
              required: "Enter your email address",
              pattern: { value: EMAIL, message: "That does not look like an email address" },
              setValueAs: (value) => value.trim().toLowerCase(),
            })}
          />
          <Button type="submit" loading={loading} loadingText="Sending" disabled={isActive}>
            {isActive ? `Resend in ${timeLeft}s` : "Send reset link"}
          </Button>
        </form>
        <p className="qr-auth-switch">
          Remembered it? <Link to={ROLES[role].login}>Back to sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export function ResetPassword() {
  const role = useRoleParam();
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  if (!role) return <Navigate to="/not-found" replace />;

  const onSubmit = async ({ password }) => {
    setLoading(true);
    setError("");
    try {
      await api.post(`/${role}/reset-password`, { token, password });
      navigate(ROLES[role].login, { replace: true, state: { notice: "Password updated. Sign in with your new password." } });
    } catch (err) {
      setError(getApiErrorMessage(err));
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="qr-auth-card">
          <Banner tone="danger">This reset link is missing its token. Request a new one.</Banner>
          <Button to={`/${role}/forgot-password`}>Request a new link</Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="qr-auth-card">
        <div>
          <h1>Choose a new password</h1>
          <p className="qr-auth-lede">Pick something you have not used elsewhere. At least 8 characters.</p>
        </div>
        {error && <Banner tone="danger">{error}</Banner>}
        <form className="qr-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.password}
            {...register("password", {
              required: "Choose a password",
              minLength: { value: 8, message: "At least 8 characters" },
              maxLength: { value: 72, message: "At most 72 characters" },
            })}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirm}
            {...register("confirm", {
              required: "Confirm your password",
              validate: (value) => value === getValues("password") || "The passwords do not match",
            })}
          />
          <Button type="submit" loading={loading} loadingText="Saving">
            Update password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

// Landing page for the link inside the verification email.
export function VerifyEmailLink() {
  const role = useRoleParam();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState({ status: "loading", message: "" });

  useEffect(() => {
    if (!role || !token) {
      setState({ status: "error", message: "This verification link is incomplete." });
      return undefined;
    }
    let cancelled = false;
    api
      .post(`/${role}/verify-email`, { token })
      .then(() => !cancelled && setState({ status: "done", message: "" }))
      .catch((err) => !cancelled && setState({ status: "error", message: getApiErrorMessage(err) }));
    return () => {
      cancelled = true;
    };
  }, [role, token]);

  if (!role) return <Navigate to="/not-found" replace />;

  return (
    <AuthLayout>
      <div className="qr-auth-card" style={{ textAlign: "center", justifyItems: "center" }}>
        {state.status === "loading" && (
          <>
            <Spinner size={34} />
            <h1>Verifying your email</h1>
          </>
        )}
        {state.status === "done" && (
          <>
            <CheckCircle2 size={56} color="var(--brand-600)" aria-hidden="true" />
            <h1>Email verified</h1>
            <p className="qr-auth-lede">You are all set. Head back to QuickRide to continue.</p>
            <Button to={ROLES[role].home}>Continue</Button>
          </>
        )}
        {state.status === "error" && (
          <>
            <XCircle size={56} color="var(--danger-500)" aria-hidden="true" />
            <h1>Link did not work</h1>
            <p className="qr-auth-lede">{state.message}</p>
            <Button to={ROLES[role].home} icon={<MailCheck size={18} />}>
              Request a new link
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
