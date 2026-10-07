import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import api, { getApiErrorMessage, saveSession } from "../../utils/api";
import { ROLES } from "../../utils/roles";
import { useUser } from "../../contexts/UserContext";
import { useCaptain } from "../../contexts/CaptainContext";
import { AuthLayout, Banner, Button, Input, Select } from "../../components/ui";
import { RecoveryCodes, TwoFactorSetup } from "../../components/auth/TwoFactor";
import RoleTabs from "./RoleTabs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Steps({ current, total }) {
  return (
    <div className="qr-steps" role="img" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < current ? "is-done" : ""} />
      ))}
    </div>
  );
}

function passwordStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function Signup({ role = "user" }) {
  const config = ROLES[role];
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCaptain } = useCaptain();
  const isCaptain = role === "captain";

  // details -> (vehicle) -> setup -> recovery
  const [step, setStep] = useState("details");
  const [enrollment, setEnrollment] = useState(null);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const totalSteps = isCaptain ? 4 : 3;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { vehicleType: "car" }, mode: "onTouched" });
  const strength = passwordStrength(watch("password"));

  const goToVehicle = async () => {
    const valid = await trigger(["firstname", "lastname", "phone", "email", "password"]);
    if (valid) setStep("vehicle");
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    const body = {
      fullname: { firstname: values.firstname.trim(), lastname: values.lastname.trim() },
      email: values.email,
      password: values.password,
      phone: values.phone,
      ...(isCaptain && {
        vehicle: {
          color: values.color.trim(),
          number: values.number.trim().toUpperCase(),
          capacity: Number(values.capacity),
          type: values.vehicleType,
        },
      }),
    };
    try {
      const { data } = await api.post(`/${role}/register`, body);
      if (data.requiresTwoFactorSetup) {
        setEnrollment(data);
        setStep("setup");
      } else finishAuth(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setStep("details");
    } finally {
      setLoading(false);
    }
  };

  const finishAuth = (data) => {
    const account = data[role];
    saveSession({ token: data.token, type: role, data: account });
    (role === "user" ? setUser : setCaptain)(account);
    navigate(config.home, { replace: true });
  };

  if (step === "setup") {
    return (
      <AuthLayout>
        <div className="qr-auth-card">
          <Steps current={totalSteps - 1} total={totalSteps} />
          <TwoFactorSetup
            role={role}
            enrollment={enrollment}
            onRestart={(message) => {
              setError(message);
              setStep("details");
            }}
            onActivated={(data) => {
              setSession(data);
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
          <Steps current={totalSteps} total={totalSteps} />
          <RecoveryCodes codes={session.recoveryCodes} onContinue={() => finishAuth(session)} />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="qr-auth-card">
        <RoleTabs active={role} to="signup" />
        <Steps current={step === "details" ? 1 : 2} total={totalSteps} />
        <div>
          <h1>{step === "vehicle" ? "Tell us about your vehicle" : isCaptain ? "Drive with QuickRide" : "Create your account"}</h1>
          <p className="qr-auth-lede">
            {step === "vehicle"
              ? "Riders see these details so they can recognise you at pickup."
              : "It takes about two minutes. You will set up two-factor sign-in at the end."}
          </p>
        </div>

        {error && <Banner tone="danger">{error}</Banner>}

        <form className="qr-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === "details" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input
                  label="First name"
                  autoComplete="given-name"
                  error={errors.firstname}
                  {...register("firstname", {
                    required: "Enter your first name",
                    minLength: { value: 2, message: "At least 2 letters" },
                  })}
                />
                <Input
                  label="Last name"
                  autoComplete="family-name"
                  error={errors.lastname}
                  {...register("lastname", { required: "Enter your last name" })}
                />
              </div>
              <Input
                label="Mobile number"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10 digits"
                maxLength={10}
                icon={<Phone size={18} />}
                error={errors.phone}
                {...register("phone", {
                  required: "Enter your mobile number",
                  pattern: { value: /^\d{10}$/, message: "Use exactly 10 digits" },
                })}
              />
              <Input
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                icon={<Mail size={18} />}
                error={errors.email}
                {...register("email", {
                  required: "Enter your email address",
                  pattern: { value: EMAIL, message: "That does not look like an email address" },
                  setValueAs: (value) => value.trim().toLowerCase(),
                })}
              />
              <div className="qr-field">
                <Input
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  error={errors.password}
                  {...register("password", {
                    required: "Choose a password",
                    minLength: { value: 8, message: "At least 8 characters" },
                    maxLength: { value: 72, message: "At most 72 characters" },
                  })}
                />
                <div className="qr-steps" aria-hidden="true">
                  {[1, 2, 3, 4].map((level) => (
                    <span key={level} className={strength >= level ? "is-done" : ""} />
                  ))}
                </div>
              </div>
              {isCaptain ? (
                <Button onClick={goToVehicle}>Continue</Button>
              ) : (
                <Button type="submit" loading={loading} loadingText="Creating account">
                  Create account
                </Button>
              )}
            </>
          )}

          {step === "vehicle" && (
            <>
              <Select
                label="Vehicle type"
                options={[
                  { value: "car", label: "Car" },
                  { value: "bike", label: "Bike" },
                  { value: "auto", label: "Auto" },
                ]}
                {...register("vehicleType")}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input
                  label="Colour"
                  placeholder="White"
                  error={errors.color}
                  {...register("color", {
                    required: "Enter the colour",
                    minLength: { value: 3, message: "At least 3 letters" },
                  })}
                />
                <Input
                  label="Seats"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  placeholder="4"
                  error={errors.capacity}
                  {...register("capacity", {
                    required: "How many seats?",
                    min: { value: 1, message: "At least 1" },
                    max: { value: 20, message: "At most 20" },
                  })}
                />
              </div>
              <Input
                label="Licence plate"
                autoCapitalize="characters"
                placeholder="DL 01 AB 1234"
                error={errors.number}
                {...register("number", {
                  required: "Enter the plate number",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
              />
              <Button type="submit" loading={loading} loadingText="Creating account">
                Create account
              </Button>
              <Button variant="ghost" icon={<ArrowLeft size={17} />} onClick={() => setStep("details")}>
                Back
              </Button>
            </>
          )}
        </form>

        <p className="qr-auth-switch">
          Already have an account? <Link to={config.login}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
