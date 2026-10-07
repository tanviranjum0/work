import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Home, KeyRound, MapPin, Phone, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import api, { getApiErrorMessage, getStoredAccount, getToken, saveSession } from "../utils/api";
import { ROLES } from "../utils/roles";
import { useUser } from "../contexts/UserContext";
import { useCaptain } from "../contexts/CaptainContext";
import usePlaceSuggestions from "../hooks/usePlaceSuggestions";
import { Badge, Banner, Button, Input, PageShell, Select, useToast } from "../components/ui";
import { RecoveryCodes, TwoFactorSetup } from "../components/auth/TwoFactor";
import "../components/ride/ride.css";

/* ------------------------------------------------------------- shared helpers */

function useAccountSync(role) {
  const { user, setUser } = useUser();
  const { captain, setCaptain } = useCaptain();
  const account = role === "user" ? user : captain;
  const update = (patch) => {
    const next = { ...account, ...patch };
    (role === "user" ? setUser : setCaptain)(next);
    saveSession({ token: getToken(), type: role, data: { ...(getStoredAccount()?.data || {}), ...next } });
  };
  return { account, update };
}

function Section({ id, icon, title, children, description }) {
  return (
    <section id={id} className="qr-card" style={{ display: "grid", gap: 14, scrollMarginTop: 16 }} aria-labelledby={`${id}-title`}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span className="qr-list-item-icon">{icon}</span>
        <div>
          <h2 id={`${id}-title`} style={{ fontSize: "var(--text-lg)" }}>{title}</h2>
          {description && <p className="qr-hint">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------- personal */

function PersonalForm({ role, account, update }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      firstname: account?.fullname?.firstname || "",
      lastname: account?.fullname?.lastname || "",
      phone: account?.phone || "",
      color: account?.vehicle?.color || "",
      number: account?.vehicle?.number || "",
      capacity: account?.vehicle?.capacity || "",
      type: account?.vehicle?.type || "car",
    },
  });

  useEffect(() => {
    reset({
      firstname: account?.fullname?.firstname || "",
      lastname: account?.fullname?.lastname || "",
      phone: account?.phone || "",
      color: account?.vehicle?.color || "",
      number: account?.vehicle?.number || "",
      capacity: account?.vehicle?.capacity || "",
      type: account?.vehicle?.type || "car",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?._id]);

  const onSubmit = async (values) => {
    setSaving(true);
    const fullname = { firstname: values.firstname.trim(), lastname: values.lastname.trim() };
    try {
      if (role === "user") {
        await api.post("/user/update", { fullname, phone: values.phone });
        update({ fullname, phone: values.phone });
      } else {
        const vehicle = {
          color: values.color.trim(),
          number: values.number.trim().toUpperCase(),
          capacity: Number(values.capacity),
          type: values.type,
        };
        await api.post("/captain/update", { captainData: { fullname, phone: values.phone, vehicle } });
        update({ fullname, phone: values.phone, vehicle });
      }
      reset(values);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="qr-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="First name" error={errors.firstname} {...register("firstname", { required: "Required", minLength: { value: 2, message: "At least 2 letters" } })} />
        <Input label="Last name" error={errors.lastname} {...register("lastname", { required: "Required" })} />
      </div>
      <Input
        label="Mobile number"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        icon={<Phone size={18} />}
        error={errors.phone}
        {...register("phone", { required: "Required", pattern: { value: /^\d{10}$/, message: "Use exactly 10 digits" } })}
      />
      <Input label="Email" value={account?.email || ""} disabled readOnly hint="Your email is how you sign in and cannot be changed here." />

      {role === "captain" && (
        <>
          <Select label="Vehicle type" options={[{ value: "car", label: "Car" }, { value: "bike", label: "Bike" }, { value: "auto", label: "Auto" }]} {...register("type")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Colour" error={errors.color} {...register("color", { required: "Required", minLength: { value: 3, message: "At least 3 letters" } })} />
            <Input label="Seats" type="number" min={1} max={20} error={errors.capacity} {...register("capacity", { required: "Required", min: { value: 1, message: "At least 1" }, max: { value: 20, message: "At most 20" } })} />
          </div>
          <Input label="Licence plate" autoCapitalize="characters" error={errors.number} {...register("number", { required: "Required", minLength: { value: 3, message: "At least 3 characters" } })} />
        </>
      )}

      <Button type="submit" loading={saving} loadingText="Saving" disabled={!isDirty}>
        Save changes
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------- security */

function SecuritySection({ role, account, update }) {
  const [enrollment, setEnrollment] = useState(null);
  const [codes, setCodes] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const enabled = Boolean(account?.twoFactorEnabled);

  const begin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/${role}/2fa/setup`);
      setEnrollment(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (codes) {
    return (
      <Section id="security" icon={<ShieldCheck size={19} />} title="Two-factor sign-in">
        <RecoveryCodes
          codes={codes}
          onContinue={() => {
            setCodes(null);
            setEnrollment(null);
            update({ twoFactorEnabled: true });
            toast.success("Two-factor sign-in is on.");
          }}
        />
      </Section>
    );
  }

  if (enrollment) {
    return (
      <Section id="security" icon={<ShieldCheck size={19} />} title="Two-factor sign-in">
        <TwoFactorSetup
          role={role}
          enrollment={enrollment}
          onRestart={(message) => {
            setEnrollment(null);
            toast.error(message);
          }}
          onActivated={(data) => setCodes(data.recoveryCodes)}
        />
        <Button variant="ghost" onClick={() => setEnrollment(null)}>
          Cancel
        </Button>
      </Section>
    );
  }

  return (
    <Section
      id="security"
      icon={<ShieldCheck size={19} />}
      title="Security"
      description="Protect your account and your trips."
    >
      <div className="online-card" style={{ background: enabled ? "var(--brand-50)" : "var(--warning-50)", borderColor: enabled ? "var(--brand-200)" : "#f1d9a6" }}>
        <div className="online-card-body">
          <strong>Two-factor sign-in</strong>
          <span>{enabled ? "On. A code from your authenticator app is needed to sign in." : "Off. Add a second step to keep your account safe."}</span>
        </div>
        <Badge tone={enabled ? "brand" : "warning"}>{enabled ? "On" : "Off"}</Badge>
      </div>
      {!enabled && (
        <Button onClick={begin} loading={loading} loadingText="Preparing" icon={<ShieldCheck size={18} />}>
          Turn on two-factor
        </Button>
      )}
      <Button variant="secondary" to={`/${role}/forgot-password`} icon={<KeyRound size={18} />}>
        Change password
      </Button>
    </Section>
  );
}

/* ---------------------------------------------------------------- saved places */

function AddressInput({ value, onChange, label }) {
  const [focused, setFocused] = useState(false);
  const { items } = usePlaceSuggestions(value, { enabled: focused });
  return (
    <div style={{ position: "relative" }}>
      <Input
        label={label}
        placeholder="Search an address"
        value={value}
        autoComplete="off"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onChange={(event) => onChange(event.target.value)}
      />
      {focused && items.length > 0 && (
        <div className="suggestions qr-card" style={{ position: "absolute", zIndex: 5, left: 0, right: 0, top: "100%", marginTop: 4, padding: 6 }} role="listbox">
          {items.slice(0, 4).map((text) => (
            <button key={text} type="button" className="suggestion" onMouseDown={(event) => event.preventDefault()} onClick={() => { onChange(text); setFocused(false); }}>
              <span className="suggestion-icon"><MapPin size={16} /></span>
              <span className="suggestion-text"><strong>{text.split(", ")[0]}</strong><span>{text.split(", ").slice(1).join(", ")}</span></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedPlaces({ account, update }) {
  const toast = useToast();
  const [places, setPlaces] = useState(account?.savedPlaces || []);
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) setPlaces(account?.savedPlaces || []);
  }, [account?.savedPlaces]);

  const change = (index, patch) => {
    dirty.current = true;
    setPlaces((current) => current.map((place, i) => (i === index ? { ...place, ...patch } : place)));
  };

  const save = async () => {
    const cleaned = places.map((place) => ({ label: place.label.trim(), address: place.address.trim() })).filter((place) => place.label && place.address);
    setSaving(true);
    try {
      const { data } = await api.put("/user/saved-places", { places: cleaned });
      setPlaces(data.savedPlaces);
      update({ savedPlaces: data.savedPlaces });
      dirty.current = false;
      toast.success("Saved places updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section id="places" icon={<Home size={19} />} title="Saved places" description="One tap from the booking screen.">
      {places.map((place, index) => (
        <div key={index} className="qr-card qr-card--flat" style={{ display: "grid", gap: 10 }}>
          <Input label="Label" placeholder="Home, Work, Gym" value={place.label} maxLength={30} onChange={(event) => change(index, { label: event.target.value })} />
          <AddressInput label="Address" value={place.address} onChange={(address) => change(index, { address })} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => { dirty.current = true; setPlaces((current) => current.filter((_, i) => i !== index)); }}>
            Remove
          </Button>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Button variant="secondary" icon={<Plus size={18} />} disabled={places.length >= 8} onClick={() => { dirty.current = true; setPlaces((current) => [...current, { label: current.length === 0 ? "Home" : "", address: "" }]); }}>
          Add place
        </Button>
        <Button onClick={save} loading={saving} loadingText="Saving">
          Save places
        </Button>
      </div>
    </Section>
  );
}

function EmergencyContacts({ account, update }) {
  const toast = useToast();
  const [contacts, setContacts] = useState(account?.emergencyContacts || []);
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current) setContacts(account?.emergencyContacts || []);
  }, [account?.emergencyContacts]);

  const change = (index, patch) => {
    dirty.current = true;
    setContacts((current) => current.map((contact, i) => (i === index ? { ...contact, ...patch } : contact)));
  };

  const save = async () => {
    const cleaned = contacts.map((contact) => ({ name: contact.name.trim(), phone: contact.phone.trim() })).filter((contact) => contact.name || contact.phone);
    if (cleaned.some((contact) => !contact.name || !/^\d{10}$/.test(contact.phone))) {
      toast.error("Each contact needs a name and a 10-digit phone number.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put("/user/emergency-contacts", { contacts: cleaned });
      setContacts(data.emergencyContacts);
      update({ emergencyContacts: data.emergencyContacts });
      dirty.current = false;
      toast.success("Emergency contacts updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section id="contacts" icon={<Phone size={19} />} title="Emergency contacts" description="Shown in the safety toolkit during a trip, one tap to call.">
      {contacts.map((contact, index) => (
        <div key={index} className="qr-card qr-card--flat" style={{ display: "grid", gap: 10 }}>
          <Input label="Name" value={contact.name} maxLength={60} onChange={(event) => change(index, { name: event.target.value })} />
          <Input label="Phone" type="tel" inputMode="numeric" maxLength={10} value={contact.phone} onChange={(event) => change(index, { phone: event.target.value.replace(/\D/g, "") })} />
          <Button variant="ghost" size="sm" icon={<Trash2 size={16} />} onClick={() => { dirty.current = true; setContacts((current) => current.filter((_, i) => i !== index)); }}>
            Remove
          </Button>
        </div>
      ))}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Button variant="secondary" icon={<Plus size={18} />} disabled={contacts.length >= 3} onClick={() => { dirty.current = true; setContacts((current) => [...current, { name: "", phone: "" }]); }}>
          Add contact
        </Button>
        <Button onClick={save} loading={saving} loadingText="Saving">
          Save contacts
        </Button>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------------- screen */

export default function Profile({ role }) {
  const config = ROLES[role];
  const { account, update } = useAccountSync(role);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <PageShell title="Profile & safety" backTo={config.home}>
      {account?.twoFactorEnabled === false && (
        <Banner tone="warning">Your account is not protected by two-factor sign-in yet. Turn it on below.</Banner>
      )}
      <Section id="personal" icon={<UserRound size={19} />} title="Personal details">
        <PersonalForm role={role} account={account} update={update} />
      </Section>
      <SecuritySection role={role} account={account} update={update} />
      {role === "user" && <SavedPlaces account={account} update={update} />}
      {role === "user" && <EmergencyContacts account={account} update={update} />}
    </PageShell>
  );
}
