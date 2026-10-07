import { useState } from "react";
import { MailCheck, RefreshCcw } from "lucide-react";
import api, { getApiErrorMessage } from "../utils/api";
import useCooldownTimer from "../hooks/useCooldownTimer";
import { AuthLayout, Banner, Button } from "./ui";

// Shown to accounts whose email has not been confirmed yet. The email contains a link that
// opens /:role/verify-email?token=..., handled by EmailVerificationConfirmation.
export default function VerifyEmail({ account, role, onVerified }) {
  const { isActive, timeLeft, startCooldown } = useCooldownTimer(60000, "verify-email-cooldown");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post(`/mail/verify-${role}-email`);
      setSent(true);
      startCooldown();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="qr-auth-card" style={{ textAlign: "center" }}>
        <span className="qr-empty-icon" style={{ justifySelf: "center", width: 64, height: 64 }}>
          <MailCheck size={30} aria-hidden="true" />
        </span>
        <div>
          <h1>Verify your email</h1>
          <p className="qr-auth-lede">
            We will send a confirmation link to <strong>{account?.email}</strong>. Open it on this device to continue.
          </p>
        </div>
        {sent && <Banner tone="success">Link sent. Check your inbox and spam folder.</Banner>}
        {error && <Banner tone="danger">{error}</Banner>}
        <Button onClick={send} loading={loading} loadingText="Sending" disabled={isActive}>
          {isActive ? `Resend in ${timeLeft}s` : sent ? "Send another link" : "Send verification link"}
        </Button>
        <Button variant="secondary" icon={<RefreshCcw size={17} />} onClick={onVerified}>
          I have verified my email
        </Button>
      </div>
    </AuthLayout>
  );
}
