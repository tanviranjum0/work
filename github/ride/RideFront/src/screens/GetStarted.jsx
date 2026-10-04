import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── Google Fonts ─────────────────────────────────────────────────────────── */
const injectFonts = () => {
  const id = "swift-fonts";
  if (document.getElementById(id)) return;
  const l = document.createElement("link");
  l.id = id;
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&display=swap";
  document.head.appendChild(l);
};

/* ── Keyframe CSS (only what Tailwind can't do) ───────────────────────────── */
const ANIM_CSS = `
  @keyframes float    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-14px) rotate(1deg)} 66%{transform:translateY(-6px) rotate(-1deg)} }
  @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:.4} }
  @keyframes marquee  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ripple   { 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(2.4);opacity:0} }
  @keyframes carDrive { 0%{left:-120px} 100%{left:calc(100% + 120px)} }
  @keyframes gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#f1f5fb} ::-webkit-scrollbar-thumb{background:#c0cce8;border-radius:99px}

  .font-display  { font-family: 'Fraunces', serif; }
  .font-body     { font-family: 'Outfit', sans-serif; }

  .anim-float    { animation: float 7s ease-in-out infinite; }
  .anim-floatB   { animation: floatB 4s ease-in-out infinite; }
  .anim-floatC   { animation: floatB 4s 2s ease-in-out infinite; }
  .anim-pulseDot { animation: pulseDot 2s ease infinite; }
  .anim-marquee  { animation: marquee 22s linear infinite; }
  .anim-marqueeR { animation: marquee 28s linear infinite reverse; }
  .anim-gradShift{ animation: gradShift 8s ease infinite; background-size: 200% 200%; }
  .anim-carDrive { animation: carDrive 18s linear infinite; position:absolute; bottom:22%; }
  .anim-ripple   { animation: ripple 2s ease-out infinite; }
  .anim-ripple2  { animation: ripple 1.5s ease-out infinite; }

  .fade-up  { animation: fadeUp .7s ease both; }
  .fade-up1 { animation: fadeUp .7s .1s ease both; }
  .fade-up2 { animation: fadeUp .7s .2s ease both; }
  .fade-up3 { animation: fadeUp .7s .35s ease both; }
  .fade-up4 { animation: fadeUp .7s .5s ease both; }

  .nav-link { position:relative; transition:color .2s; }
  .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:#1a56ff; border-radius:99px; transition:width .3s ease; }
  .nav-link:hover { color:#1a56ff !important; }
  .nav-link:hover::after { width:100%; }

  .ride-input:focus { outline:none; border-color:#1a56ff !important; box-shadow:0 0 0 3px rgba(26,86,255,.12) !important; }

  .lift { transition:transform .25s ease, box-shadow .25s ease; }
  .lift:hover { transform:translateY(-5px); box-shadow:0 24px 64px rgba(26,86,255,.16) !important; }

  .tcard:hover .tcard-quote { color:#1a56ff; }

  .screen-slide { transition: opacity .4s ease, transform .4s ease; }
`;

/* ── Data ─────────────────────────────────────────────────────────────────── */
const STATS = [
  { value: "4.9★", label: "Average Rating", sub: "from 800K+ reviews" },
  { value: "2.4M+", label: "Rides Completed", sub: "this month alone" },
  { value: "12 min", label: "Avg Pickup Time", sub: "across all cities" },
  { value: "180+", label: "Cities Covered", sub: "and growing fast" },
];

const RIDE_TYPES = [
  {
    id: "standard",
    icon: "🚗",
    name: "Standard",
    eta: "3–5 min",
    price: "$8–12",
    desc: "Comfortable everyday rides",
    capacity: "1–4 passengers",
    accent: "#1a56ff",
  },
  {
    id: "express",
    icon: "⚡",
    name: "Express",
    eta: "1–2 min",
    price: "$14–18",
    desc: "Priority pickup, fastest route",
    capacity: "1–4 passengers",
    accent: "#f59e0b",
    badge: "Popular",
  },
  {
    id: "xl",
    icon: "🚐",
    name: "XL",
    eta: "5–8 min",
    price: "$18–26",
    desc: "Extra space for groups & luggage",
    capacity: "1–6 passengers",
    accent: "#00c4a7",
  },
  {
    id: "premium",
    icon: "👑",
    name: "Premium",
    eta: "4–7 min",
    price: "$28–40",
    desc: "Luxury vehicles, top-rated drivers",
    capacity: "1–4 passengers",
    accent: "#9333ea",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📍",
    title: "Set Your Destination",
    desc: "Enter where you're headed. Our smart system finds the optimal route and shows real-time driver availability in your area.",
  },
  {
    step: "02",
    icon: "🤝",
    title: "Get Matched Instantly",
    desc: "We pair you with the nearest verified driver in seconds. See their rating, vehicle details, and live location on the map.",
  },
  {
    step: "03",
    icon: "🚗",
    title: "Ride in Comfort",
    desc: "Track your driver's arrival in real-time. Enjoy a safe, comfortable ride to your destination with in-app fare tracking.",
  },
  {
    step: "04",
    icon: "💳",
    title: "Pay Seamlessly",
    desc: "Automatic payment via your saved method. Rate your driver and get a digital receipt instantly — no cash, no hassle.",
  },
];

const FEATURES = [
  {
    icon: "🛡️",
    title: "Safety First",
    desc: "Every driver is background-checked, insured, and continuously monitored. In-app SOS, trip sharing, and 24/7 support.",
  },
  {
    icon: "📡",
    title: "Live Tracking",
    desc: "Watch your ride arrive in real-time on a live map. Share your trip progress with friends and family for extra peace of mind.",
  },
  {
    icon: "💬",
    title: "In-app Messaging",
    desc: "Coordinate with your driver without sharing personal numbers. Direct, private, encrypted messaging built right in.",
  },
  {
    icon: "🌍",
    title: "Eco Rides",
    desc: "Choose electric or hybrid vehicles and offset your carbon footprint. We plant a tree for every 10 rides you complete.",
  },
  {
    icon: "💰",
    title: "No Surge Pricing",
    desc: "Our predictive model caps price increases. You'll always see the final fare before you book — zero surprise charges.",
  },
  {
    icon: "⚡",
    title: "Lightning Fast App",
    desc: "Book in under 10 seconds. Our app is optimised for low-connectivity areas so you're never stuck without a ride.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Daily Commuter",
    city: "New York",
    avatar: "SK",
    rating: 5,
    text: "I've tried every ride-share app out there. The transparent pricing and the way drivers are actually vetted here is on another level. My go-to for over 2 years.",
    gradient: "linear-gradient(135deg,#667eea,#764ba2)",
  },
  {
    name: "James M.",
    role: "Business Traveller",
    city: "Chicago",
    avatar: "JM",
    rating: 5,
    text: "The Premium tier is incredible — clean cars, professional drivers, and they actually wait for you when your flight is delayed. Worth every penny.",
    gradient: "linear-gradient(135deg,#f093fb,#f5576c)",
  },
  {
    name: "Priya R.",
    role: "Student",
    city: "San Francisco",
    avatar: "PR",
    rating: 5,
    text: "As a student the Standard plan is super affordable, but what I love is the safety features. My mum can track my trips live. That's peace of mind you can't put a price on.",
    gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
  },
  {
    name: "Carlos D.",
    role: "Weekend Explorer",
    city: "Miami",
    avatar: "CD",
    rating: 5,
    text: "Booked an XL for a group trip to the airport — 6 people, tons of luggage — and it was flawless. Driver was punctual and helped with bags. Genuinely impressed.",
    gradient: "linear-gradient(135deg,#43e97b,#38f9d7)",
  },
  {
    name: "Aisha B.",
    role: "Night Nurse",
    city: "Los Angeles",
    avatar: "AB",
    rating: 5,
    text: "Working night shifts, safety is everything. The live-share feature and constant driver monitoring means I can ride home at 3am without worry. Life-changing product.",
    gradient: "linear-gradient(135deg,#fa709a,#fee140)",
  },
  {
    name: "Tom W.",
    role: "Food Blogger",
    city: "Austin",
    avatar: "TW",
    rating: 5,
    text: "I take 3–4 rides a day exploring the city for my blog. The app is stupid fast, prices are consistent, and the Eco rides option aligns with my values. Love it.",
    gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  },
];

const APP_FEATURES = [
  "Real-time GPS tracking for every trip",
  "Scheduled rides up to 7 days in advance",
  "Multi-stop trips with automatic re-routing",
  "Shared rides to split costs with friends",
  "In-app wallet with instant top-up",
  "Driver favourites & preferences saved",
  "Accessibility modes for reduced mobility",
  "Corporate accounts & expense reporting",
];

const CITIES = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "San Francisco",
  "Seattle",
  "Miami",
  "Boston",
  "Austin",
  "Denver",
  "Atlanta",
];

const SAFETY_ITEMS = [
  {
    icon: "🔍",
    title: "Deep Background Checks",
    desc: "Every driver passes criminal, driving history, and identity verification before their first ride. Re-checked every 6 months.",
    accent: "#1a56ff",
  },
  {
    icon: "📱",
    title: "Live Trip Monitoring",
    desc: "Every trip is GPS-tracked in real-time. Deviations from the planned route trigger automatic alerts to our 24/7 safety team.",
    accent: "#00c4a7",
  },
  {
    icon: "🆘",
    title: "In-App SOS Button",
    desc: "One tap sends your exact GPS location to emergency services and your trusted contacts. Discrete and instant.",
    accent: "#f59e0b",
  },
  {
    icon: "👥",
    title: "Share Your Trip",
    desc: "Easily share your live trip progress with anyone. They can track your journey without needing the app installed.",
    accent: "#9333ea",
  },
  {
    icon: "⭐",
    title: "Two-Way Rating System",
    desc: "Riders and drivers rate each other after every trip. Low-rated drivers are reviewed and removed immediately.",
    accent: "#1a56ff",
  },
  {
    icon: "🛡️",
    title: "$1M Insurance Coverage",
    desc: "Every trip is insured. Our comprehensive policy covers injury, property damage, and cancellation — so you're always protected.",
    accent: "#00c4a7",
  },
];

/* ── Reusable Components ──────────────────────────────────────────────────── */
function Btn({
  children,
  variant = "primary",
  onClick,
  cls = "",
  full = false,
}) {
  // const [hov, setHov] = useState(false);
  const base = `inline-flex items-center justify-center gap-2 border-none rounded-full cursor-pointer font-body font-semibold text-sm transition-all duration-200 select-none ${full ? "w-full" : ""} ${cls}`;
  const map = {
    primary: `bg-blue-600 text-white px-7 py-3 shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-500/40`,
    ghost: `bg-transparent text-blue-600 px-7 py-3 border border-blue-400/40 hover:bg-blue-50 hover:-translate-y-0.5`,
    white: `bg-white text-blue-600 px-7 py-3 shadow-md hover:bg-blue-50 hover:-translate-y-0.5`,
    teal: `bg-teal-500 text-white px-7 py-3 shadow-lg hover:bg-teal-600 hover:-translate-y-0.5`,
    dark: `bg-slate-900 text-white px-7 py-3 shadow-lg hover:bg-slate-800 hover:-translate-y-0.5`,
  };
  return (
    <button onClick={onClick} className={`${base} ${map[variant]}`}>
      {children}
    </button>
  );
}

function Badge({ children, color = "blue" }) {
  const map = {
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    teal: "bg-teal-100 text-teal-600 border-teal-200",
    white: "bg-white/20 text-white border-white/30",
  };
  return (
    <span
      className={`inline-block border rounded-full text-xs font-bold tracking-widest uppercase px-3 py-1 ${map[color] || map.blue}`}
    >
      {children}
    </span>
  );
}

function SectionHead({
  badge,
  badgeColor = "blue",
  title,
  highlight,
  sub,
  center = false,
  light = false,
}) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      {badge && <Badge color={badgeColor}>{badge}</Badge>}
      <h2
        className={`font-display font-bold leading-tight tracking-tight mt-3 mb-3 text-3xl md:text-4xl lg:text-5xl ${light ? "text-white" : "text-slate-900"}`}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <em className="text-blue-600 not-italic">{highlight}</em>
          </>
        )}
      </h2>
      {sub && (
        <p
          className={`text-base leading-relaxed ${light ? "text-white/60" : "text-slate-500"} ${center ? "mx-auto" : ""} max-w-xl`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Navbar ───────────────────────────────────────────────────────────────── */
function Navbar() {

  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-lg">
            🚗
          </div>
          <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
            Swif<em className="text-blue-600 not-italic">t</em>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Cities", "Pricing", "Safety"].map(
            (item) => (
              <span
                key={item}
                className="nav-link font-body text-slate-700 text-sm font-medium pb-0.5 cursor-pointer"
              >
                {item}
              </span>
            ),
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Btn onClick={() => {
            navigate("/login");
          }} variant="ghost" cls="!px-5 !py-2.5 !text-sm">
            Log In
          </Btn>
          <Btn onClick={() => {
            navigate("/signup");
          }} variant="primary" cls="!px-5 !py-2.5 !text-sm">
            Sign Up →
          </Btn>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <span
            className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {["Features", "How It Works", "Cities", "Pricing", "Safety"].map(
            (item) => (
              <span
                key={item}
                onClick={() => setMenuOpen(false)}
                className="font-body text-slate-700 font-medium py-3 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {item}
              </span>
            ),
          )}
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
            <Btn variant="ghost" full>
              Log In
            </Btn>
            <Btn variant="primary" full>
              Get the App →
            </Btn>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  const [activeType, setActiveType] = useState("express");
  const [pickup, setPickup] = useState("");
  const [dest, setDest] = useState("");
  const sel = RIDE_TYPES.find((r) => r.id === activeType);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 pt-16">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,86,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.04) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Orbs */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-24 w-80 h-80 bg-teal-400 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500 rounded-full opacity-5 blur-3xl pointer-events-none" />

      {/* Animated car */}
      <div className="anim-carDrive text-4xl opacity-10 pointer-events-none">
        🚗
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ── Left copy ── */}
        <div className="order-2 lg:order-1">
          {/* Live badge */}
          <div className="fade-up flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-teal-500 anim-pulseDot" />
            <span className="text-xs font-semibold text-teal-600 tracking-widest uppercase font-body">
              Live drivers near you
            </span>
          </div>

          <h1 className="fade-up1 font-display font-bold leading-none tracking-tight text-slate-900 mb-5 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Your ride,
            <br />
            <em className="text-blue-600 not-italic">when you</em>
            <br />
            need it most.
          </h1>

          <p className="fade-up2 text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-md font-body">
            Book a ride in seconds, track it live, and arrive safely. Swift
            connects you with trusted, vetted drivers across 180+ cities — 24
            hours a day, every day of the year.
          </p>

          {/* ── Booking card ── */}
          <div className="fade-up3 bg-white rounded-3xl p-5 sm:p-6 shadow-2xl shadow-blue-100 border border-blue-50 max-w-lg">
            {/* Ride type tabs */}
            <div className="flex gap-1.5 mb-5 bg-slate-100 rounded-xl p-1">
              {RIDE_TYPES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveType(r.id)}
                  className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold font-body transition-all duration-200 cursor-pointer border-none ${activeType === r.id ? "bg-white text-slate-900 shadow-md" : "bg-transparent text-slate-400 hover:text-slate-600"}`}
                >
                  <span className="hidden sm:inline">{r.icon} </span>
                  {r.name}
                </button>
              ))}
            </div>

            {/* Selected info bar */}
            {sel && (
              <div className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2.5 mb-4">
                <span className="text-xs text-slate-500 font-body">
                  <span className="font-semibold text-slate-800">
                    {sel.name}
                  </span>{" "}
                  · {sel.desc}
                </span>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-bold text-slate-900 font-body">
                    {sel.price}
                  </div>
                  <div className="text-xs text-teal-600 font-semibold font-body">
                    ETA {sel.eta}
                  </div>
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="flex flex-col gap-2.5 mb-4">
              {[
                {
                  color: "#1a56ff",
                  placeholder: "Pickup location",
                  val: pickup,
                  set: setPickup,
                },
                {
                  color: "#00c4a7",
                  placeholder: "Where to?",
                  val: dest,
                  set: setDest,
                },
              ].map((f) => (
                <div key={f.placeholder} className="relative">
                  <div
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{ background: f.color }}
                  />
                  <input
                    className="ride-input font-body w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-800 bg-slate-50 border border-slate-200 transition-all duration-200"
                    placeholder={f.placeholder}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                  />
                </div>
              ))}
            </div>

            <Btn variant="primary" full cls="!py-3.5 !text-base">
              <span>Find My Ride</span>
              <span className="text-xl">→</span>
            </Btn>

            <p className="text-center text-xs text-slate-400 mt-3 font-body">
              No account needed ·{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">
                Cancel anytime, free
              </span>
            </p>
          </div>

          {/* Trust row */}
          <div className="fade-up4 flex items-center gap-4 sm:gap-6 mt-6 flex-wrap">
            {[
              ["⭐", "4.9/5 rating"],
              ["🛡️", "Fully insured"],
              ["⚡", "Avg 3min pickup"],
            ].map(([ic, t]) => (
              <div
                key={t}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-body font-medium"
              >
                <span>{ic}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — map card ── */}
        <div className="order-1 lg:order-2 flex justify-center">
          <MapCard />
        </div>
      </div>
    </section>
  );
}

function MapCard() {
  const drivers = [
    { x: "28%", y: "38%", delay: "0s" },
    { x: "55%", y: "52%", delay: "0.8s" },
    { x: "70%", y: "30%", delay: "1.4s" },
    { x: "42%", y: "66%", delay: "0.4s" },
  ];
  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
      {/* Glow shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-blue-400/20 blur-2xl rounded-full" />

      {/* Main card */}
      <div className="anim-float bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-blue-50">
        {/* Map */}
        <div
          className="relative h-52 sm:h-72 overflow-hidden"
          style={{ background: "linear-gradient(160deg,#deeaff,#eef5ff)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(26,86,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.06) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 500 320"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 160 Q 120 140 250 155 Q 380 170 500 145"
              fill="none"
              stroke="rgba(255,255,255,.9)"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="M 0 160 Q 120 140 250 155 Q 380 170 500 145"
              fill="none"
              stroke="rgba(26,86,255,.4)"
              strokeWidth="1.5"
              strokeDasharray="8,10"
            />
            <path
              d="M 180 0 Q 200 80 195 160 Q 190 240 210 320"
              fill="none"
              stroke="rgba(255,255,255,.8)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 0 260 Q 150 240 300 250 Q 400 255 500 230"
              fill="none"
              stroke="rgba(255,255,255,.7)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>

          {/* Driver dots */}
          {drivers.map((d, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: d.x, top: d.y }}
            >
              <div
                className="absolute -inset-2 rounded-full bg-blue-500/15 anim-ripple"
                style={{ animationDelay: d.delay }}
              />
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-xs">
                🚗
              </div>
            </div>
          ))}

          {/* You */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute -inset-3 rounded-full bg-teal-500/20 anim-ripple2" />
            <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-lg" />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap font-body">
              You
            </div>
          </div>

          {/* Route line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 500 320"
          >
            <path
              d="M 258 176 Q 290 140 380 98"
              fill="none"
              stroke="#1a56ff"
              strokeWidth="2.5"
              strokeDasharray="8,8"
              strokeLinecap="round"
              opacity="0.7"
            />
          </svg>

          {/* ETA badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-body">
              Arriving in
            </div>
            <div className="font-display text-xl font-bold text-slate-900">
              2 min
            </div>
          </div>
        </div>

        {/* Driver info */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shrink-0 flex items-center justify-center text-lg">
              👨
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-slate-900 font-body">
                Marcus T. <span className="text-amber-400">★</span>{" "}
                <span className="text-slate-400 font-normal">4.97</span>
              </div>
              <div className="text-xs text-slate-400 font-body truncate">
                Toyota Camry · Silver ·{" "}
                <strong className="text-slate-700">ABX 4821</strong>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {["💬", "📞"].map((ic) => (
                <div
                  key={ic}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-base cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  {ic}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating stat — top left */}
      <div className="absolute -top-5 -left-4 sm:-left-8 bg-white rounded-2xl px-3 py-2.5 shadow-xl border border-blue-50 anim-floatB hidden sm:block">
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-body">
          Drivers nearby
        </div>
        <div className="font-display text-xl font-bold text-slate-900">
          12 <span className="text-sm text-teal-500 font-medium">active</span>
        </div>
      </div>

      {/* Floating stat — bottom right */}
      <div className="absolute -bottom-4 -right-4 sm:-right-8 bg-slate-900 rounded-2xl px-3 py-2.5 shadow-xl anim-floatC hidden sm:block">
        <div className="text-xs text-white/40 font-semibold uppercase tracking-wider font-body">
          Your fare
        </div>
        <div className="font-display text-xl font-bold text-white">$14.50</div>
        <div className="text-xs text-teal-400 font-semibold font-body">
          Fixed · No surges
        </div>
      </div>
    </div>
  );
}

/* ── Stats Bar ────────────────────────────────────────────────────────────── */
function StatsBar() {
  return (
    <section className="bg-slate-900 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
        {STATS.map((s, i) => (
          <div
            key={i}
            className={`text-center px-4 ${i < 3 ? "lg:border-r border-white/10" : ""}`}
          >
            <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">
              {s.value}
            </div>
            <div className="text-sm sm:text-base font-semibold text-white/80 font-body mb-0.5">
              {s.label}
            </div>
            <div className="text-xs text-white/35 font-body">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Ride Types ───────────────────────────────────────────────────────────── */
function RideTypesSection() {
  const [active, setActive] = useState("express");
  const sel = RIDE_TYPES.find((r) => r.id === active);
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          badge="Choose Your Ride"
          title="One app, every"
          highlight="journey"
          sub="From a quick solo trip to a group airport transfer — pick the ride that fits your need and budget perfectly."
          center
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {RIDE_TYPES.map((r) => (
            <div
              key={r.id}
              onClick={() => setActive(r.id)}
              className={`lift rounded-2xl p-4 sm:p-6 cursor-pointer relative overflow-hidden transition-all duration-250 border-2 ${active === r.id ? "border-transparent" : "border-transparent"}`}
              style={{
                background: active === r.id ? r.accent : "#f8faff",
                border:
                  active === r.id
                    ? `2px solid ${r.accent}`
                    : "2px solid transparent",
              }}
            >
              {r.badge && (
                <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full tracking-wide font-body">
                  {r.badge}
                </div>
              )}
              <div className="text-3xl sm:text-4xl mb-3">{r.icon}</div>
              <div
                className={`font-display text-lg sm:text-xl font-bold mb-1.5 ${active === r.id ? "text-white" : "text-slate-900"}`}
              >
                {r.name}
              </div>
              <div
                className={`text-xs sm:text-sm leading-relaxed mb-3 ${active === r.id ? "text-white/75" : "text-slate-500"}`}
              >
                {r.desc}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div
                    className={`text-lg sm:text-xl font-bold font-display ${active === r.id ? "text-white" : "text-slate-900"}`}
                  >
                    {r.price}
                  </div>
                  <div
                    className={`text-xs font-body ${active === r.id ? "text-white/60" : "text-slate-400"}`}
                  >
                    ETA {r.eta}
                  </div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${active === r.id ? "bg-white/20" : "bg-blue-100"}`}
                >
                  →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {sel && (
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-blue-100">
            <div className="flex flex-wrap gap-6 sm:gap-10">
              {[
                ["Capacity", sel.capacity],
                ["Est. Price", sel.price],
                ["ETA", sel.eta],
                ["Cancellation", "Free < 2min"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 font-body">
                    {l}
                  </div>
                  <div className="text-lg font-bold text-slate-900 font-body">
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <Btn variant="primary" cls="shrink-0">
              Book {sel.name} Now →
            </Btn>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          badge="Simple Process"
          title="Booked in under"
          highlight="10 seconds"
          sub="We stripped out every unnecessary step. From app open to confirmed booking — it's the fastest experience in the industry."
          center
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 opacity-25 rounded-full" />

          {HOW_IT_WORKS.map((s, i) => (
            <div
              key={i}
              className="lift bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-blue-50 relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl mb-4 border border-blue-100">
                {s.icon}
              </div>
              <div className="absolute top-5 right-5 font-display text-4xl font-bold text-blue-600/5 leading-none">
                {s.step}
              </div>
              <div className="font-display text-lg font-bold text-slate-900 mb-2">
                {s.title}
              </div>
              <div className="text-sm text-slate-500 leading-relaxed font-body">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <SectionHead
            badge="Why Swift"
            badgeColor="teal"
            title="Designed around"
            highlight="your trust"
            sub="Every feature in Swift was built answering one question: what does the rider actually need to feel safe, comfortable, and in control?"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="lift bg-slate-50 rounded-2xl p-5 border border-slate-100"
              >
                <div className="text-2xl mb-2.5">{f.icon}</div>
                <div className="font-semibold text-sm text-slate-900 mb-1.5 font-body">
                  {f.title}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed font-body">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  const [screen, setScreen] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScreen((s) => (s + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);
  const screens = [
    <TrackingScreen key="t" />,
    <BookingScreen key="b" />,
    <ProfileScreen key="p" />,
  ];
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent blur-3xl scale-150 pointer-events-none" />
      <div
        className="anim-float relative w-56 sm:w-64 bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl"
        style={{
          boxShadow:
            "0 40px 100px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08)",
        }}
      >
        <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto mb-2" />
        <div className="rounded-3xl overflow-hidden bg-blue-50 h-[28rem] sm:h-[32rem]">
          {screens[screen]}
        </div>
        <div className="w-16 h-1 bg-white/10 rounded-full mx-auto mt-2" />
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setScreen(i)}
            className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 ${i === screen ? "w-5 bg-blue-600" : "w-1.5 bg-slate-300"}`}
          />
        ))}
      </div>
    </div>
  );
}

function TrackingScreen() {
  return (
    <div className="h-full flex flex-col">
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#deeaff,#eef5ff)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,86,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.05) 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 236 280"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 140 Q 60 120 118 130 Q 176 140 236 118"
            fill="none"
            stroke="rgba(255,255,255,.9)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 0 140 Q 60 120 118 130 Q 176 140 236 118"
            fill="none"
            stroke="rgba(26,86,255,.4)"
            strokeWidth="1.5"
            strokeDasharray="8,10"
          />
          <circle
            cx="82"
            cy="128"
            r="9"
            fill="#1a56ff"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle
            cx="118"
            cy="133"
            r="6"
            fill="#00c4a7"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute top-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-2.5">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-body">
            Driver arriving in
          </div>
          <div className="font-display text-xl font-bold text-slate-900">
            2 min
          </div>
        </div>
      </div>
      <div className="p-3 bg-white">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shrink-0" />
          <div>
            <div className="text-xs font-bold font-body">Marcus T. ⭐ 4.97</div>
            <div className="text-xs text-slate-400 font-body">
              Toyota Camry · ABX 4821
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {["💬 Message", "📞 Call"].map((b) => (
            <button
              key={b}
              className="flex-1 py-2 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold cursor-pointer font-body"
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingScreen() {
  return (
    <div className="h-full bg-white p-4">
      <div className="font-display text-base font-bold text-slate-900 mb-4">
        Book a ride
      </div>
      {[
        ["#1a56ff", "Pickup location"],
        ["#00c4a7", "Destination"],
      ].map(([c, ph]) => (
        <div
          key={ph}
          className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5 mb-2"
        >
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: c }}
          />
          <span className="text-xs text-slate-400 font-body">{ph}</span>
        </div>
      ))}
      <div className="flex gap-1.5 my-3">
        {[
          ["🚗 Std", false],
          ["⚡ Fast", true],
          ["👑 VIP", false],
        ].map(([t, active]) => (
          <div
            key={t}
            className={`flex-1 py-2 rounded-xl text-center text-xs font-semibold font-body ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
          >
            {t}
          </div>
        ))}
      </div>
      <div className="bg-slate-50 rounded-xl p-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-body">
            Estimated fare
          </span>
          <span className="text-base font-bold font-display text-slate-900">
            $14.50
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-slate-400 font-body">ETA 2 min</span>
          <span className="text-xs text-teal-500 font-semibold font-body">
            Fixed price
          </span>
        </div>
      </div>
      <div className="bg-blue-600 text-white rounded-xl py-2.5 text-center text-xs font-bold font-body">
        Confirm Booking →
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="h-full bg-slate-50 p-4">
      <div className="text-center mb-4">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl"
          style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}
        >
          😊
        </div>
        <div className="text-sm font-bold text-slate-900 font-body">
          Alex Johnson
        </div>
        <div className="text-xs text-slate-400 font-body">
          Member since 2022 · 248 trips
        </div>
      </div>
      {[
        {
          label: "Total Saved",
          value: "$320",
          sub: "vs taxis",
          color: "#00c4a7",
        },
        {
          label: "Carbon Offset",
          value: "12kg",
          sub: "CO₂ this month",
          color: "#1a56ff",
        },
        {
          label: "Reward Points",
          value: "4,820",
          sub: "→ redeem now",
          color: "#f59e0b",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl px-3 py-2.5 mb-2 flex justify-between items-center"
        >
          <span className="text-xs text-slate-400 font-body">{s.label}</span>
          <div className="text-right">
            <div
              className="text-sm font-bold font-body"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs text-slate-400 font-body">{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Testimonials ─────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const t = TESTIMONIALS[activeIdx];
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHead
          badge="Real Stories"
          title="Loved by"
          highlight="millions"
          sub="Don't take our word for it — here's what our riders say after thousands of trips."
          center
          light
        />

        {/* Featured */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 mb-6 border border-white/5 overflow-hidden">
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: t.gradient }}
          />
          <p className="font-display italic text-white/90 leading-relaxed mb-6 text-lg sm:text-2xl">
            &quot;{t.text}&quot;
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: t.gradient }}
              >
                {t.avatar}
              </div>
              <div>
                <div className="font-semibold text-white text-sm font-body">
                  {t.name}
                </div>
                <div className="text-xs text-white/40 font-body">
                  {t.role} · {t.city}
                </div>
              </div>
            </div>
            <div className="flex gap-0.5 text-amber-400 text-base">★★★★★</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {TESTIMONIALS.map((tm, i) => (
            <div
              key={i}
              onClick={() => setActiveIdx(i)}
              className="tcard rounded-2xl p-4 sm:p-5 cursor-pointer border transition-all duration-250"
              style={{
                background:
                  i === activeIdx
                    ? "linear-gradient(135deg,#1a56ff,#0f3fd4)"
                    : "rgba(255,255,255,.04)",
                borderColor:
                  i === activeIdx ? "transparent" : "rgba(255,255,255,.06)",
              }}
            >
              <div className="text-amber-400 text-xs mb-2.5">★★★★★</div>
              <p className="tcard-quote text-xs text-white/65 leading-relaxed mb-3 font-body transition-colors">
                &quot;{tm.text.slice(0, 85)}…&quot;
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: tm.gradient }}
                >
                  {tm.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-body">
                    {tm.name}
                  </div>
                  <div className="text-xs text-white/35 font-body">
                    {tm.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
          {[
            ["⭐", "4.9/5", "App Store Rating"],
            ["🏆", "#1", "Ride App 2024"],
            ["🛡️", "100%", "Insured Rides"],
            ["💬", "800K+", "Verified Reviews"],
          ].map(([ic, v, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl mb-1.5">{ic}</div>
              <div className="font-display text-2xl font-bold text-white">
                {v}
              </div>
              <div className="text-xs text-white/35 font-body">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Cities ───────────────────────────────────────────────────────────────── */
function CitiesSection() {
  return (
    <section className="py-20 sm:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <SectionHead
          badge="Coverage"
          badgeColor="teal"
          title="Available in"
          highlight="180+ cities"
          sub="Swift is live across the US and expanding globally. Check if your city is covered."
          center
        />
      </div>
      {[
        {
          items: [...CITIES, ...CITIES],
          cls: "anim-marquee",
          bg: "bg-white border-blue-100 text-slate-800",
          prefix: "📍",
        },
        {
          items: [...CITIES.slice(6), ...CITIES, ...CITIES.slice(0, 6)],
          cls: "anim-marqueeR",
          bg: "bg-blue-50 border-blue-200 text-blue-700",
          prefix: "🌆",
        },
      ].map((row, ri) => (
        <div key={ri} className={`overflow-hidden ${ri === 0 ? "mb-3" : ""}`}>
          <div className={`flex ${row.cls} w-max`}>
            {row.items.map((c, i) => (
              <div
                key={i}
                className={`shrink-0 ${row.bg} border rounded-full px-5 py-2.5 mx-2 text-sm font-semibold whitespace-nowrap font-body shadow-sm`}
              >
                {row.prefix} {c}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ── App Section ──────────────────────────────────────────────────────────── */
function AppSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <SectionHead
            title="Everything you need,"
            highlight="always with you"
            sub="Download Swift on iOS or Android and experience the fastest, safest ride-booking experience on any device."
          />
          <div className="flex flex-col gap-2.5 mb-8">
            {APP_FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center text-xs text-blue-600 shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <span className="text-sm text-slate-500 leading-relaxed font-body">
                  {f}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            <Btn variant="dark">🍎 App Store</Btn>
            <Btn variant="dark">▶ Google Play</Btn>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex">
              {["#667eea", "#f5576c", "#4facfe", "#43e97b"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{
                    background: `linear-gradient(135deg,${c},${c}99)`,
                    marginLeft: i > 0 ? -8 : 0,
                  }}
                />
              ))}
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-900 font-body">
                2.4M+ riders this month
              </div>
              <div className="text-xs text-slate-400 font-body">
                Join them — it&apos;s free to download
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* QR card */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-teal-400/15 blur-2xl" />
            <div className="relative">
              <div className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3 font-body">
                Scan to download
              </div>
              {/* QR simulation */}
              <div
                className="w-24 h-24 bg-white rounded-xl mb-5 grid gap-0.5 p-2"
                style={{ gridTemplateColumns: "repeat(7,1fr)" }}
              >
                {Array.from({ length: 49 }, (_, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      background: [
                        0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 40,
                        41, 42, 43, 44, 45, 46, 47, 48, 8, 15, 22, 29, 36, 9,
                        16, 23, 30, 37, 10, 11, 12, 17, 24, 31, 38, 18, 25, 32,
                        39, 19, 26, 33,
                      ].includes(i)
                        ? "#0b0f1a"
                        : "transparent",
                    }}
                  />
                ))}
              </div>
              <div className="font-display text-2xl font-bold text-white mb-1.5">
                Free to download
              </div>
              <div className="text-sm text-white/50 font-body">
                No credit card required to sign up
              </div>
            </div>
          </div>

          {/* Stat mini-cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: "⭐",
                val: "4.9",
                sub: "App Store rating",
                bg: "from-amber-50 to-yellow-50",
              },
              {
                icon: "⬇️",
                val: "10M+",
                sub: "Total downloads",
                bg: "from-blue-50 to-indigo-50",
              },
              {
                icon: "🔒",
                val: "256-bit",
                sub: "SSL encryption",
                bg: "from-teal-50 to-green-50",
              },
              {
                icon: "🌍",
                val: "180+",
                sub: "Cities covered",
                bg: "from-purple-50 to-violet-50",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`lift bg-gradient-to-br ${s.bg} rounded-2xl p-4 border border-slate-100`}
              >
                <div className="text-xl mb-1.5">{s.icon}</div>
                <div className="font-display text-xl font-bold text-slate-900">
                  {s.val}
                </div>
                <div className="text-xs text-slate-400 font-body">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Safety ───────────────────────────────────────────────────────────────── */
function SafetySection() {
  return (
    <section
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0b0f1a,#0f1e3d)" }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle,#1a56ff,transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle,#00c4a7,transparent 70%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <SectionHead
          badge="Safety Promise"
          badgeColor="teal"
          title="Your safety is our"
          highlight="obsession"
          sub="We built a multi-layered safety system that monitors every trip, every driver, every second."
          center
          light
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SAFETY_ITEMS.map((f, i) => (
            <div
              key={i}
              className="lift rounded-2xl p-6 sm:p-7 border border-white/5 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,.04)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 border"
                style={{
                  background: `${f.accent}20`,
                  borderColor: `${f.accent}30`,
                }}
              >
                {f.icon}
              </div>
              <div className="font-semibold text-white mb-2 font-body">
                {f.title}
              </div>
              <div className="text-sm text-white/45 leading-relaxed font-body">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-white px-4 sm:px-6">
      <div
        className="max-w-4xl mx-auto relative rounded-3xl sm:rounded-[2rem] p-10 sm:p-14 lg:p-16 text-center overflow-hidden anim-gradShift"
        style={{
          background: "linear-gradient(135deg,#1a56ff,#0f3fd4,#00c4a7)",
          boxShadow: "0 32px 80px rgba(26,86,255,.3)",
        }}
      >
        <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-white/8 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/6 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative">
          <Badge color="white">Start Today</Badge>
          <h2 className="font-display font-bold text-white leading-tight tracking-tight mt-4 mb-4 text-3xl sm:text-4xl lg:text-5xl">
            Your first ride is on us.
            <br />
            <em className="not-italic opacity-90">Book it in 10 seconds.</em>
          </h2>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto font-body">
            Join over 2.4 million riders who chose Swift for safe, affordable,
            and effortlessly smooth rides across the city.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Btn variant="white">🍎 Download for iOS</Btn>
            <Btn variant="white">▶ Download for Android</Btn>
          </div>
          <p className="mt-5 text-xs text-white/45 font-body">
            Free to download · No signup required to browse · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        "Book a Ride",
        "Ride Types",
        "Schedule a Ride",
        "Group Rides",
        "Corporate",
        "Driver App",
      ],
    },
    {
      title: "Company",
      links: [
        "About Swift",
        "Careers",
        "Press",
        "Blog",
        "Investors",
        "Contact Us",
      ],
    },
    {
      title: "Support",
      links: [
        "Help Centre",
        "Safety",
        "Driver Support",
        "Accessibility",
        "Community Guidelines",
        "Report an Issue",
      ],
    },
    {
      title: "Legal",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "Refund Policy",
        "Insurance",
        "Compliance",
      ],
    },
  ];
  return (
    <footer className="bg-slate-950 pt-16 sm:pt-20 pb-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-14">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-lg">
                🚗
              </div>
              <span className="font-display text-xl font-bold text-white">
                Swif<em className="text-blue-400 not-italic">t</em>
              </span>
            </div>
            <p className="text-sm text-white/35 leading-relaxed mb-5 font-body max-w-[200px]">
              Fast, safe, affordable rides for everyone — 24 hours a day, 365
              days a year.
            </p>
            <div className="flex gap-2">
              {["𝕏", "in", "f", "ig"].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-white/40 cursor-pointer hover:bg-white/10 hover:text-white/70 transition-colors font-bold"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold tracking-widest uppercase text-white/25 mb-4 font-body">
                {col.title}
              </div>
              <div className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <span
                    key={l}
                    className="text-sm text-white/40 cursor-pointer hover:text-white/80 transition-colors font-body"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="text-xs text-white/20 font-body">
            © 2025 Swift Rides Inc. All rights reserved.
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <span
                key={l}
                className="text-xs text-white/25 cursor-pointer hover:text-white/60 transition-colors font-body"
              >
                {l}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500 anim-pulseDot" />
            <span className="text-xs text-white/25 font-body">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Root App ─────────────────────────────────────────────────────────────── */
export default function RideShareHomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      if (JSON.parse(userData).type == "user") {
        navigate("/home");
      } else if (JSON.parse(userData).type == "captain") {
        navigate("/captain/home");
      }
    }
  }, []);
  useEffect(() => {
    injectFonts();
  }, []);
  return (
    <>
      <style>{ANIM_CSS}</style>
      <div className="font-body text-slate-900 antialiased">
        <Navbar />
        <Hero />
        <StatsBar />
        <RideTypesSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CitiesSection />
        <AppSection />
        <SafetySection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
