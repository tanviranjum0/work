/* eslint-disable react/prop-types */
import { useState } from "react";

// ─── Google Fonts injected once ───────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Syne:wght@400;600;700;800&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

// ─── Inline keyframe styles ────────────────────────────────────────────────────
const globalStyles = `
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const PALETTES = [
  {
    name: "✦ Arctic Blue",
    tag: "Current",
    tagColor: "#2d5be3",
    desc: "Clean, trustworthy, corporate-lite. Works perfectly with white/gray backdrop blur.",
    colors: ["#1c2b4a", "#2d5be3", "#6b9ff5", "#c2d4f5", "#f0f4fd"],
  },
  {
    name: "Slate & Teal",
    desc: "Fresh, eco-forward, modern. Great for brands emphasising sustainability & green travel.",
    colors: ["#1a2535", "#00b8a0", "#4dd9c6", "#c0f0ea", "#f0faf9"],
  },
  {
    name: "Warm Amber",
    desc: "Friendly, approachable, energetic. Stands out from typical transport apps; great for casual or budget services.",
    colors: ["#2a1f14", "#e07b39", "#f5a96e", "#fde0c5", "#fdf6f0"],
  },
  {
    name: "Midnight Dark",
    desc: "Premium, bold, tech-forward. Backdrop blur looks stunning on deep dark backgrounds. Perfect for a luxury tier.",
    colors: ["#0d0f18", "#1a1f35", "#3d5afe", "#7c9cfc", "#e8eeff"],
  },
  {
    name: "Soft Violet",
    desc: "Sophisticated, youthful, innovative. Appeals well to urban tech-savvy riders and pairs beautifully with frosted glass UI.",
    colors: ["#1e1535", "#7c3aed", "#a78bfa", "#ddd6fe", "#f5f3ff"],
  },
  {
    name: "Charcoal & Coral",
    desc: "Bold, modern, high-contrast. Makes CTAs pop dramatically. Strong brand recall; great for a safety-first image.",
    colors: ["#232323", "#ff5757", "#ff8c8c", "#ffe5e5", "#fafafa"],
  },
];

const IDEAS = [
  { icon: "🗺️", bg: "#eef3fd", title: "Live Map Hero Background", desc: "Replace static background with a blurred live map (Mapbox/Google Maps). Cars move in real-time. Creates instant trust and excitement at first glance." },
  { icon: "✨", bg: "#e8faf7", title: "Glassmorphism Booking Widget", desc: "A floating frosted-glass panel with pickup & drop-off fields, overlaid directly on the hero. Feels premium and modern without heavy UI weight." },
  { icon: "🚗", bg: "#fff4ec", title: "Animated Car Path", desc: "A subtle CSS-animated car that drives along the road curve in the background. Adds life without distraction. Loop at ~12s for a polished effect." },
  { icon: "⭐", bg: "#f3eeff", title: "Trust Indicators Strip", desc: 'A thin horizontal ticker below the hero: "4.9★ avg rating · 2M+ rides · Insured drivers · 24/7 support." Builds credibility instantly.' },
  { icon: "🎯", bg: "#fff0f0", title: "Micro-interaction Pins", desc: "Location pins on the map that pulse gently on hover. Clicking a city zooms in and pre-fills the booking field — delightful and practical." },
  { icon: "🌗", bg: "#eef3fd", title: "Auto Dark / Light Mode", desc: "Detect system preference and swap to a rich dark palette at night. The background blobs shift to deeper purples and blues — ambient and immersive." },
  { icon: "💳", bg: "#e8faf7", title: "Price Estimate Widget", desc: "An inline fare estimator card in the hero. User enters pickup + destination and sees an instant price range — reduces friction and boosts conversion." },
  { icon: "🏙️", bg: "#fff4ec", title: "City Silhouette Illustration", desc: "A minimalist SVG city skyline layered over the road curve — semi-transparent, specific to your city. Adds local personality and warmth to the abstract background." },
  { icon: "📱", bg: "#f3eeff", title: "App Download Hero Split", desc: "Split hero layout: left side has the headline & CTA, right side shows a floating phone mockup with the app UI. Classic, but works extremely well for app-first products." },
];

const RIDE_TYPES = [
  { icon: "🚗", label: "Standard", price: "$10–14" },
  { icon: "⚡", label: "Express", price: "$16–20" },
  { icon: "👑", label: "Premium", price: "$28–35" },
];

const TYPE_SCALE = [
  { meta: "Syne 800 · 3rem\nDisplay / Hero", sample: "Get there with ease.", style: { fontFamily: "'Syne', sans-serif", fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 } },
  { meta: "Syne 700 · 2rem\nSection Title", sample: "Book your ride today", style: { fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" } },
  { meta: "Syne 600 · 1.3rem\nCard Heading", sample: "Your Driver is Nearby", style: { fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 600 } },
  { meta: "DM Sans 500 · 1rem\nBody Text", sample: "Affordable, reliable rides available 24/7 across the city.", style: { fontSize: "1rem", fontWeight: 500 } },
  { meta: "DM Sans 300 · 0.875rem\nCaption", sample: "Trip confirmed · ETA 4 minutes · Toyota Camry · Silver", style: { fontSize: "0.875rem", fontWeight: 300, color: "#6b7fa3" } },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#f4f7fd 0%,#e8edf8 55%,#dce4f2 100%)" }}>
        {/* Blobs */}
        {[
          { w: 700, h: 560, color: "#c2d4f5", op: 0.55, top: -120, left: -140 },
          { w: 600, h: 500, color: "#b5ccf2", op: 0.45, bottom: -100, right: -100 },
          { w: 400, h: 360, color: "#d8e9fb", op: 0.5, top: 60, right: 200 },
          { w: 320, h: 280, color: "#e0d3f5", op: 0.3, bottom: 80, left: 200 },
        ].map((b, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none", width: b.w, height: b.h, background: b.color, opacity: b.op, top: b.top, left: b.left, bottom: b.bottom, right: b.right }} />
        ))}

        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(160,180,215,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(160,180,215,0.18) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Roads SVG */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M -20 780 Q 400 680 720 660 Q 1040 640 1460 570" fill="none" stroke="white" strokeWidth="60" strokeLinecap="round" opacity="0.35" />
          <path d="M -20 780 Q 400 680 720 660 Q 1040 640 1460 570" fill="none" stroke="rgba(200,220,240,0.8)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M -20 780 Q 400 680 720 660 Q 1040 640 1460 570" fill="none" stroke="white" strokeWidth="2" strokeDasharray="20,25" strokeLinecap="round" opacity="0.8" />
          <path d="M 1460 900 Q 1080 800 780 785 Q 480 770 60 860" fill="none" stroke="white" strokeWidth="40" strokeLinecap="round" opacity="0.2" />
        </svg>
      </div>

      {/* Floating glass cards */}
      <FloatingCard style={{ bottom: "18%", left: "7%", width: 210, animationDelay: "0s" }}>
        <CardLabel>Trip details</CardLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <Pin color="#00b8a0" /><span style={{ fontSize: 12, fontWeight: 500, color: "#1c2b4a" }}>Home</span>
        </div>
        <div style={{ margin: "3px 0 3px 3px", width: 1.5, height: 14, background: "#e0e8f5" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Pin color="#2d5be3" /><span style={{ fontSize: 12, fontWeight: 500, color: "#1c2b4a" }}>Airport T2</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "#1c2b4a" }}>$14.50 · 22 min</div>
      </FloatingCard>

      <FloatingCard style={{ top: "12%", left: "10%", width: 170, animationDelay: "0.9s" }}>
        <CardLabel>Rides today</CardLabel>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#1c2b4a" }}>2,481</div>
        <div style={{ fontSize: 12, color: "#00b8a0", fontWeight: 600, marginTop: 3 }}>↑ 12% vs yesterday</div>
      </FloatingCard>

      <FloatingCard style={{ top: "15%", right: "8%", width: 190, animationDelay: "1.8s" }}>
        <CardLabel>Your driver</CardLabel>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#1c2b4a" }}>3 min away</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <Pin color="#00b8a0" /><span style={{ fontSize: 12, fontWeight: 500, color: "#1c2b4a" }}>En route to you</span>
        </div>
      </FloatingCard>

      {/* Hero copy */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 700, padding: "0 24px" }}>
        <div style={{ display: "inline-block", background: "rgba(45,91,227,0.1)", border: "1px solid rgba(45,91,227,0.25)", color: "#2d5be3", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 24, backdropFilter: "blur(8px)" }}>
          Your City, Your Ride
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.8rem,5vw,4.5rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#1c2b4a", marginBottom: 20 }}>
          Get there<br />with <span style={{ color: "#2d5be3" }}>ease</span>
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#6b7fa3", marginBottom: 36, fontWeight: 300 }}>
          Affordable, reliable rides at your fingertips.<br />Available 24/7 across the city.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <PrimaryBtn>Book a Ride</PrimaryBtn>
          <GhostBtn>Become a Driver</GhostBtn>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ children, style }) {
  return (
    <div style={{
      position: "absolute",
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1.5px solid rgba(255,255,255,0.85)",
      borderRadius: 20,
      padding: "18px 22px",
      boxShadow: "0 8px 32px rgba(80,110,180,0.1)",
      animation: "floatCard 5s ease-in-out infinite",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7fa3", marginBottom: 6 }}>{children}</div>;
}

function Pin({ color }) {
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

function PrimaryBtn({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#2d5be3", color: "white", border: "none", padding: "14px 32px", borderRadius: 100, fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: hovered ? "0 12px 36px rgba(45,91,227,0.38)" : "0 8px 30px rgba(45,91,227,0.3)", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "transform 0.2s, box-shadow 0.2s", ...style }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "rgba(255,255,255,0.55)", border: "1.5px solid rgba(255,255,255,0.85)", color: "#1c2b4a", padding: "14px 32px", borderRadius: 100, fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", backdropFilter: "blur(12px)", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "transform 0.2s" }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ label, title, sub }) {
  return (
    <>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#2d5be3", marginBottom: 10 }}>{label}</div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#1c2b4a", marginBottom: 12 }}>{title}</h2>
      <p style={{ fontSize: "1rem", color: "#6b7fa3", maxWidth: 540, marginBottom: 48 }}>{sub}</p>
    </>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid rgba(180,195,225,0.5)", margin: 0 }} />;
}

// ─── Palettes Section ─────────────────────────────────────────────────────────
function PalettesSection() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
      <SectionHeader label="Design System" title="Colour Palette Options" sub="Five curated palettes — each suited to a different brand personality for your ride-sharing platform." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }}>
        {PALETTES.map((p) => <PaletteCard key={p.name} palette={p} />)}
      </div>
    </div>
  );
}

function PaletteCard({ palette }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(180,195,225,0.5)", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? "0 16px 48px rgba(80,110,180,0.12)" : "none", transition: "transform 0.25s, box-shadow 0.25s" }}
    >
      <div style={{ display: "flex", height: 100 }}>
        {palette.colors.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
      </div>
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: 6 }}>
          {palette.name}
          {palette.tag && <span style={{ fontSize: 11, color: palette.tagColor, fontWeight: 400, marginLeft: 6 }}>({palette.tag})</span>}
        </div>
        <div style={{ fontSize: 13, color: "#6b7fa3", lineHeight: 1.5 }}>{palette.desc}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {palette.colors.map((c) => (
            <span key={c} style={{ fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6, background: "#f0f3f9", color: "#6b7fa3", fontFamily: "monospace" }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Ideas Section ────────────────────────────────────────────────────────────
function IdeasSection() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
      <SectionHeader label="Creative Direction" title="Design Ideas for Your Homepage" sub="Actionable suggestions to elevate your ride-sharing platform beyond the competition." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
        {IDEAS.map((idea) => <IdeaCard key={idea.title} idea={idea} />)}
      </div>
    </div>
  );
}

function IdeaCard({ idea }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid rgba(180,195,225,0.5)", position: "relative", overflow: "hidden", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? "0 16px 48px rgba(80,110,180,0.1)" : "none", transition: "transform 0.25s, box-shadow 0.25s" }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 16, background: idea.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>{idea.icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: 8, color: "#1c2b4a" }}>{idea.title}</div>
      <div style={{ fontSize: "0.875rem", color: "#6b7fa3", lineHeight: 1.6 }}>{idea.desc}</div>
    </div>
  );
}

// ─── Typography Section ───────────────────────────────────────────────────────
function TypographySection() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
      <SectionHeader label="Typography" title="Recommended Type Scale" sub="Syne for headings (distinctive, geometric, confident) + DM Sans for body (warm, legible, modern)." />
      <div style={{ background: "white", borderRadius: 20, padding: 40, border: "1px solid rgba(180,195,225,0.5)" }}>
        {TYPE_SCALE.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: i < TYPE_SCALE.length - 1 ? "1px solid rgba(180,195,225,0.5)" : "none" }}>
            <div style={{ minWidth: 140, fontSize: 11, color: "#6b7fa3", fontFamily: "monospace", whiteSpace: "pre-line" }}>{t.meta}</div>
            <div style={{ color: "#1c2b4a", ...t.style }}>{t.sample}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Components Section ───────────────────────────────────────────────────────
function ComponentsSection() {
  const [activeRide, setActiveRide] = useState(0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
      <SectionHeader label="Components" title="UI Component Previews" sub="Key building blocks for your ride-sharing interface." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>

        {/* Booking Input */}
        <CompCard label="Search / Booking Input">
          <SearchBar dotColor="#2d5be3" placeholder="Enter pickup location…" />
          <div style={{ margin: "10px 0 0", height: 1, background: "rgba(180,195,225,0.5)" }} />
          <SearchBar dotColor="#00b8a0" placeholder="Enter destination…" style={{ marginTop: 10 }} />
          <PrimaryBtn style={{ width: "100%", marginTop: 16 }}>Find Rides</PrimaryBtn>
        </CompCard>

        {/* Trip Route */}
        <CompCard label="Trip Route Card">
          <div style={{ background: "#f0f3f9", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2d5be3", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>123 Main Street</span>
            </div>
            <div style={{ paddingLeft: 4 }}><div style={{ width: 1.5, height: 20, background: "rgba(180,195,225,0.5)" }} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00b8a0", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Airport Terminal 2</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, fontSize: 13 }}>
            <span style={{ color: "#6b7fa3" }}>Est. 22 min</span>
            <span style={{ fontWeight: 700, color: "#1c2b4a" }}>$14.50</span>
          </div>
        </CompCard>

        {/* Driver Profile */}
        <CompCard label="Driver Profile">
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#f0f3f9", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#b5ccf2,#2d5be3)", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Marcus T.</div>
              <div style={{ color: "#f5a623", fontSize: 13 }}>★★★★★</div>
              <div style={{ fontSize: 12, color: "#6b7fa3" }}>4.97 · 1,240 trips</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", fontSize: 12, color: "#6b7fa3" }}>
              Toyota Camry<br /><strong style={{ color: "#1c2b4a" }}>ABX 4821</strong>
            </div>
          </div>
        </CompCard>

        {/* Ride Type Selector */}
        <CompCard label="Ride Type Selector">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {RIDE_TYPES.map((r, i) => (
              <div
                key={r.label}
                onClick={() => setActiveRide(i)}
                style={{ borderRadius: 14, padding: "10px 18px", fontSize: 13, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, border: "1.5px solid", borderColor: activeRide === i ? "#2d5be3" : "rgba(180,195,225,0.5)", background: activeRide === i ? "#2d5be3" : "transparent", color: activeRide === i ? "white" : "#1c2b4a", cursor: "pointer", transition: "all 0.2s" }}
              >
                {r.icon} {r.label}
                <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{r.price}</span>
              </div>
            ))}
          </div>
        </CompCard>

      </div>
    </div>
  );
}

function CompCard({ label, children }) {
  return (
    <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid rgba(180,195,225,0.5)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7fa3", marginBottom: 20 }}>{label}</div>
      {children}
    </div>
  );
}

function SearchBar({ dotColor, placeholder, style = {} }) {
  return (
    <div style={{ background: "#f0f3f9", border: "1.5px solid rgba(180,195,225,0.5)", borderRadius: 100, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "#6b7fa3", ...style }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
      {placeholder}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function RideShareDesignSystem() {
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#f0f3f9", color: "#1c2b4a", lineHeight: 1.6 }}>
        <Hero />
        <Divider />
        <PalettesSection />
        <Divider />
        <IdeasSection />
        <Divider />
        <TypographySection />
        <Divider />
        <ComponentsSection />
        <footer style={{ textAlign: "center", padding: "40px 32px", fontSize: 13, color: "#6b7fa3", borderTop: "1px solid rgba(180,195,225,0.5)" }}>
          Design System · RideShare · Crafted with ♥ for a minimalist, glass-forward aesthetic
        </footer>
      </div>
    </>
  );
}
