import { useEffect, useState } from "react";
import { Check, Copy, Download, KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import api, { getApiErrorMessage } from "../../utils/api";
import { Banner, Button, Input, OtpInput, Spinner } from "../ui";
import { useToast } from "../ui/Toast";

const RESTART_CODES = new Set(["TWO_FACTOR_SESSION_EXPIRED", "TWO_FACTOR_SESSION_INVALID", "ACCOUNT_UNAVAILABLE"]);

function useCopy() {
  const toast = useToast();
  return async (text, message = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Copy is not available here. Select the text and copy it manually.");
    }
  };
}

const groupSecret = (secret = "") => secret.replace(/(.{4})/g, "$1 ").trim();

/**
 * Step shown right after sign-up (and on sign-in for an unfinished sign-up): scan the QR
 * code in an authenticator app, then prove it works by entering the first code.
 */
export function TwoFactorSetup({ role, enrollment, onActivated, onRestart, activatePath }) {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const copy = useCopy();
  const { setup, enrollmentToken } = enrollment;

  useEffect(() => {
    let cancelled = false;
    // The QR library is only needed on this step, so it is fetched on demand.
    import("qrcode")
      .then((QRCode) => QRCode.toDataURL(setup.otpauthUri, { margin: 1, width: 232, errorCorrectionLevel: "M" }))
      .then((url) => !cancelled && setQr(url))
      .catch(() => !cancelled && setShowKey(true));
    return () => {
      cancelled = true;
    };
  }, [setup.otpauthUri]);

  const submit = async (value = code) => {
    if (value.length !== 6 || loading) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(activatePath || `/${role}/2fa/activate`, { enrollmentToken, code: value });
      onActivated(data);
    } catch (err) {
      if (RESTART_CODES.has(err.code)) {
        onRestart?.(getApiErrorMessage(err));
        return;
      }
      setError(getApiErrorMessage(err));
      setCode("");
      setLoading(false);
    }
  };

  return (
    <div className="qr-form">
      <div>
        <h1>Secure your account</h1>
        <p className="qr-auth-lede">
          Two-factor authentication protects your {role === "captain" ? "driver" : "rider"} account even if your password is stolen.
        </p>
      </div>

      <ol style={{ margin: 0, paddingLeft: 20, color: "var(--ink-600)", fontSize: "var(--text-sm)", display: "grid", gap: 4 }}>
        <li>
          Install an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy).
        </li>
        <li>Scan this code, or enter the key by hand.</li>
        <li>Type the 6-digit code the app shows.</li>
      </ol>

      <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
        {qr ? (
          <img
            src={qr}
            alt="QR code for your authenticator app"
            width={232}
            height={232}
            style={{ borderRadius: 16, border: "1px solid var(--line)", padding: 8, background: "#fff" }}
          />
        ) : !showKey ? (
          <div style={{ height: 232, display: "grid", placeItems: "center" }}>
            <Spinner />
          </div>
        ) : null}
        <button type="button" className="qr-chip" onClick={() => setShowKey((value) => !value)} aria-expanded={showKey}>
          <KeyRound size={15} aria-hidden="true" />
          {showKey ? "Hide setup key" : "Can't scan? Enter a key"}
        </button>
        {showKey && (
          <div className="qr-card qr-card--flat" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
            <code style={{ flex: 1, fontSize: "var(--text-sm)", letterSpacing: "0.08em", wordBreak: "break-all" }}>
              {groupSecret(setup.secret)}
            </code>
            <Button variant="secondary" size="sm" auto icon={<Copy size={15} />} onClick={() => copy(setup.secret, "Key copied")}>
              Copy
            </Button>
          </div>
        )}
      </div>

      <div className="qr-field" style={{ gap: 10 }}>
        <span className="qr-label" style={{ textAlign: "center" }}>
          Enter the 6-digit code
        </span>
        <OtpInput value={code} onChange={setCode} onComplete={submit} invalid={Boolean(error)} />
        {error && (
          <p className="qr-error" role="alert" style={{ justifyContent: "center" }}>
            {error}
          </p>
        )}
      </div>

      <Button onClick={() => submit()} loading={loading} loadingText="Checking code" disabled={code.length !== 6} icon={<ShieldCheck size={18} />}>
        Turn on two-factor
      </Button>
    </div>
  );
}

/** Sign-in step for accounts that have two-factor on. */
export function TwoFactorChallenge({ role, challengeToken, onVerified, onRestart }) {
  const [code, setCode] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (value) => {
    const body = recovery ? { challengeToken, recoveryCode: recoveryCode.trim() } : { challengeToken, code: value ?? code };
    if (recovery ? body.recoveryCode.length < 8 : body.code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/${role}/login/2fa`, body);
      onVerified(data);
    } catch (err) {
      if (RESTART_CODES.has(err.code)) {
        onRestart?.(getApiErrorMessage(err));
        return;
      }
      setError(getApiErrorMessage(err));
      setCode("");
      setLoading(false);
    }
  };

  return (
    <form
      className="qr-form"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div>
        <h1>Two-step verification</h1>
        <p className="qr-auth-lede">
          {recovery
            ? "Enter one of the recovery codes you saved when you set up your account. Each works once."
            : "Open your authenticator app and enter the 6-digit code for QuickRide."}
        </p>
      </div>

      {recovery ? (
        <Input
          label="Recovery code"
          placeholder="xxxx-xxxx"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          value={recoveryCode}
          onChange={(event) => setRecoveryCode(event.target.value)}
          error={error}
        />
      ) : (
        <div className="qr-field" style={{ gap: 10 }}>
          <OtpInput value={code} onChange={setCode} onComplete={submit} invalid={Boolean(error)} />
          {error && (
            <p className="qr-error" role="alert" style={{ justifyContent: "center" }}>
              {error}
            </p>
          )}
        </div>
      )}

      <Button type="submit" loading={loading} loadingText="Verifying" icon={<Smartphone size={18} />}>
        Verify and sign in
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setRecovery((value) => !value);
          setError("");
        }}
      >
        {recovery ? "Use my authenticator app" : "I lost my phone: use a recovery code"}
      </Button>
    </form>
  );
}

/** Shown once, right after two-factor is switched on. */
export function RecoveryCodes({ codes, onContinue }) {
  const [saved, setSaved] = useState(false);
  const copy = useCopy();

  const download = () => {
    const blob = new Blob(
      [`QuickRide recovery codes\nKeep these somewhere safe. Each code works once.\n\n${codes.join("\n")}\n`],
      { type: "text/plain" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "quickride-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="qr-form">
      <div>
        <h1>Save your recovery codes</h1>
        <p className="qr-auth-lede">
          If you ever lose your phone, these codes are the only way back into your account. We cannot show them again.
        </p>
      </div>

      <div
        className="qr-card qr-card--flat"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", fontFamily: "ui-monospace, monospace" }}
      >
        {codes.map((code) => (
          <code key={code} style={{ fontSize: "var(--text-base)", fontWeight: 700, letterSpacing: "0.04em" }}>
            {code}
          </code>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Button variant="secondary" icon={<Copy size={17} />} onClick={() => copy(codes.join("\n"), "Recovery codes copied")}>
          Copy
        </Button>
        <Button variant="secondary" icon={<Download size={17} />} onClick={download}>
          Download
        </Button>
      </div>

      <Banner tone="warning">Store them in a password manager or print them. Anyone with a code can sign in.</Banner>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: "var(--text-sm)", color: "var(--ink-700)" }}>
        <input
          type="checkbox"
          checked={saved}
          onChange={(event) => setSaved(event.target.checked)}
          style={{ width: 20, height: 20, marginTop: 1, accentColor: "var(--brand-600)" }}
        />
        I have saved my recovery codes somewhere safe.
      </label>

      <Button onClick={onContinue} disabled={!saved} icon={<Check size={18} />}>
        Continue to QuickRide
      </Button>
    </div>
  );
}
