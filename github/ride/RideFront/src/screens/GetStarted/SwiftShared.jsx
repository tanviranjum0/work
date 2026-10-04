/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
/* ─────────────────────────────────────────────────────────────────────────────
   SWIFT — Shared Utilities, Components & Data
   Import from this file in every page component.
───────────────────────────────────────────────────────────────────────────── */

/* ── Fonts ────────────────────────────────────────────────────────────────── */
export const injectFonts = () => {
    const id = "swift-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,600&display=swap";
    document.head.appendChild(l);
};

/* ── Global CSS / Keyframes ───────────────────────────────────────────────── */
export const ANIM_CSS = `
  @keyframes float    { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-14px) rotate(1deg)} 66%{transform:translateY(-6px) rotate(-1deg)} }
  @keyframes floatB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:.4} }
  @keyframes marquee  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes ripple   { 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(2.4);opacity:0} }
  @keyframes carDrive { 0%{left:-120px} 100%{left:calc(100% + 120px)} }
  @keyframes gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes slideIn  { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes scaleIn  { from{transform:scale(.95);opacity:0} to{transform:scale(1);opacity:1} }

  html { scroll-behavior:smooth; }
  body { overflow-x:hidden; }
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:#f1f5fb}
  ::-webkit-scrollbar-thumb{background:#c0cce8;border-radius:99px}

  .font-display  { font-family:'Fraunces',serif; }
  .font-body     { font-family:'Outfit',sans-serif; }

  .anim-float    { animation:float 7s ease-in-out infinite; }
  .anim-floatB   { animation:floatB 4s ease-in-out infinite; }
  .anim-floatC   { animation:floatB 4s 2s ease-in-out infinite; }
  .anim-pulseDot { animation:pulseDot 2s ease infinite; }
  .anim-marquee  { animation:marquee 22s linear infinite; }
  .anim-marqueeR { animation:marquee 28s linear infinite reverse; }
  .anim-gradShift{ animation:gradShift 8s ease infinite; background-size:200% 200%; }
  .anim-carDrive { animation:carDrive 18s linear infinite; position:absolute; bottom:22%; }
  .anim-ripple   { animation:ripple 2s ease-out infinite; }
  .anim-ripple2  { animation:ripple 1.5s ease-out infinite; }
  .anim-fadeIn   { animation:fadeIn .5s ease both; }
  .anim-slideIn  { animation:slideIn .4s ease both; }
  .anim-scaleIn  { animation:scaleIn .4s ease both; }

  .fade-up  { animation:fadeUp .7s ease both; }
  .fade-up1 { animation:fadeUp .7s .1s ease both; }
  .fade-up2 { animation:fadeUp .7s .2s ease both; }
  .fade-up3 { animation:fadeUp .7s .35s ease both; }
  .fade-up4 { animation:fadeUp .7s .5s ease both; }

  .nav-link { position:relative; transition:color .2s; }
  .nav-link::after { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:#1a56ff; border-radius:99px; transition:width .3s ease; }
  .nav-link:hover { color:#1a56ff !important; }
  .nav-link:hover::after { width:100%; }
  .nav-link.active-link { color:#1a56ff !important; }
  .nav-link.active-link::after { width:100%; }

  .lift { transition:transform .25s ease,box-shadow .25s ease; }
  .lift:hover { transform:translateY(-5px); box-shadow:0 24px 64px rgba(26,86,255,.16) !important; }

  .ride-input:focus { outline:none; border-color:#1a56ff !important; box-shadow:0 0 0 3px rgba(26,86,255,.12) !important; }
  .tcard:hover .tcard-quote { color:#1a56ff; }
  .accordion-content { transition:max-height .35s ease, opacity .35s ease; overflow:hidden; }
`;

/* ── Shared Data ──────────────────────────────────────────────────────────── */
export const RIDE_TYPES = [
    { id: "Bike", icon: "🏍️", name: "Bike", eta: "3–5 min", price: "$0.20–15", desc: "Comfortable everyday rides", capacity: "1 passenger", accent: "#1a56ff" },
    { id: "Car", icon: "🚗", name: "Car", eta: "1–2 min", price: "$0.80–50", desc: "Extra space for groups & luggage", capacity: "1–4 passengers", accent: "#f59e0b", badge: "Popular" },
    { id: "Auto", icon: "🛺", name: "Auto", eta: "5–8 min", price: "$0.50–25", desc: "Budget rides having more space", capacity: "1–3 passengers", accent: "#00c4a7" },
];

export const TESTIMONIALS = [
    { name: "Sarah K.", role: "Daily Commuter", city: "New York", avatar: "SK", text: "The transparent pricing and driver vetting is on another level. My go-to for over 2 years.", gradient: "linear-gradient(135deg,#667eea,#764ba2)" },
    { name: "James M.", role: "Business Traveller", city: "Chicago", avatar: "JM", text: "Premium tier is incredible — clean cars, professional drivers, they wait for you when your flight is delayed.", gradient: "linear-gradient(135deg,#f093fb,#f5576c)" },
    { name: "Priya R.", role: "Student", city: "San Francisco", avatar: "PR", text: "As a student the Standard plan is super affordable, and the safety features give my mum peace of mind.", gradient: "linear-gradient(135deg,#4facfe,#00f2fe)" },
    { name: "Carlos D.", role: "Weekend Explorer", city: "Miami", avatar: "CD", text: "Booked an XL for 6 people to the airport — flawless. Driver was punctual and helped with bags.", gradient: "linear-gradient(135deg,#43e97b,#38f9d7)" },
    { name: "Aisha B.", role: "Night Nurse", city: "Los Angeles", avatar: "AB", text: "Working night shifts, safety is everything. The live-share feature means I can ride home at 3am without worry.", gradient: "linear-gradient(135deg,#fa709a,#fee140)" },
    { name: "Tom W.", role: "Food Blogger", city: "Austin", avatar: "TW", text: "3–4 rides a day, prices always consistent, Eco rides option aligns with my values. Love it.", gradient: "linear-gradient(135deg,#a18cd1,#fbc2eb)" },
];

export const ALL_CITIES = [
    { name: "New York", region: "Northeast", rides: "840K", rating: "4.9", drivers: "12,400", status: "live" },
    { name: "Los Angeles", region: "West", rides: "720K", rating: "4.8", drivers: "10,200", status: "live" },
    { name: "Chicago", region: "Midwest", rides: "510K", rating: "4.9", drivers: "7,800", status: "live" },
    { name: "Houston", region: "South", rides: "480K", rating: "4.8", drivers: "6,900", status: "live" },
    { name: "Phoenix", region: "West", rides: "310K", rating: "4.9", drivers: "4,200", status: "live" },
    { name: "San Francisco", region: "West", rides: "390K", rating: "4.9", drivers: "5,100", status: "live" },
    { name: "Seattle", region: "West", rides: "290K", rating: "4.8", drivers: "3,800", status: "live" },
    { name: "Miami", region: "South", rides: "340K", rating: "4.9", drivers: "4,600", status: "live" },
    { name: "Boston", region: "Northeast", rides: "280K", rating: "4.9", drivers: "3,500", status: "live" },
    { name: "Austin", region: "South", rides: "260K", rating: "4.8", drivers: "3,200", status: "live" },
    { name: "Denver", region: "West", rides: "210K", rating: "4.8", drivers: "2,900", status: "live" },
    { name: "Atlanta", region: "South", rides: "320K", rating: "4.8", drivers: "4,100", status: "live" },
    { name: "Nashville", region: "South", rides: "180K", rating: "4.9", drivers: "2,400", status: "live" },
    { name: "Portland", region: "West", rides: "170K", rating: "4.8", drivers: "2,200", status: "live" },
    { name: "San Diego", region: "West", rides: "220K", rating: "4.9", drivers: "2,900", status: "live" },
    { name: "Detroit", region: "Midwest", rides: "150K", rating: "4.7", drivers: "1,900", status: "live" },
    { name: "Minneapolis", region: "Midwest", rides: "140K", rating: "4.8", drivers: "1,800", status: "live" },
    { name: "Las Vegas", region: "West", rides: "380K", rating: "4.8", drivers: "4,800", status: "live" },
    { name: "Philadelphia", region: "Northeast", rides: "270K", rating: "4.8", drivers: "3,400", status: "live" },
    { name: "Charlotte", region: "South", rides: "190K", rating: "4.9", drivers: "2,500", status: "live" },
    { name: "Toronto", region: "Northeast", rides: "120K", rating: "4.8", drivers: "1,500", status: "coming" },
    { name: "London", region: "International", rides: "–", rating: "–", drivers: "–", status: "coming" },
    { name: "Dubai", region: "International", rides: "–", rating: "–", drivers: "–", status: "coming" },
    { name: "Sydney", region: "International", rides: "–", rating: "–", drivers: "–", status: "coming" },
];

/* ── Reusable UI Primitives ───────────────────────────────────────────────── */
export function Btn({ children, variant = "primary", onClick, cls = "", full = false }) {
    const base = `inline-flex items-center justify-center gap-2 rounded-full cursor-pointer font-body font-semibold text-sm transition-all duration-200 select-none border-none ${full ? "w-full" : ""} ${cls}`;
    const map = {
        primary: "bg-blue-600 text-white px-7 py-3 shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-500/40",
        ghost: "bg-transparent text-blue-600 px-7 py-3 border border-blue-400/40 hover:bg-blue-50 hover:-translate-y-0.5",
        white: "bg-white text-blue-600 px-7 py-3 shadow-md hover:bg-blue-50 hover:-translate-y-0.5",
        teal: "bg-teal-500 text-white px-7 py-3 shadow-lg hover:bg-teal-600 hover:-translate-y-0.5",
        dark: "bg-slate-900 text-white px-7 py-3 shadow-lg hover:bg-slate-800 hover:-translate-y-0.5",
        outline: "bg-white text-slate-700 px-7 py-3 border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5",
    };
    return <button onClick={onClick} className={`${base} ${map[variant]}`}>{children}</button>;
}

export function Badge({ children, color = "blue" }) {
    const map = {
        blue: "bg-blue-100 text-blue-600 border-blue-200",
        teal: "bg-teal-100 text-teal-600 border-teal-200",
        amber: "bg-amber-100 text-amber-600 border-amber-200",
        purple: "bg-purple-100 text-purple-600 border-purple-200",
        red: "bg-red-100 text-red-600 border-red-200",
        white: "bg-white/20 text-white border-white/30",
        green: "bg-green-100 text-green-600 border-green-200",
    };
    return <span className={`inline-block border rounded-full text-xs font-bold tracking-widest uppercase px-3 py-1 font-body ${map[color] || map.blue}`}>{children}</span>;
}

export function SectionHead({ badge, badgeColor = "blue", title, highlight, sub, center = false, light = false }) {
    return (
        <div className={`mb-12 ${center ? "text-center" : ""}`}>
            {badge && <Badge color={badgeColor}>{badge}</Badge>}
            <h2 className={`font-display font-bold leading-tight tracking-tight mt-3 mb-3 text-3xl md:text-4xl lg:text-5xl ${light ? "text-white" : "text-slate-900"}`}>
                {title}{highlight && <> <em className="text-blue-600 not-italic">{highlight}</em></>}
            </h2>
            {sub && <p className={`text-base leading-relaxed font-body ${light ? "text-white/60" : "text-slate-500"} ${center ? "mx-auto" : ""} max-w-xl`}>{sub}</p>}
        </div>
    );
}

/* ── Navbar ───────────────────────────────────────────────────────────────── */
export function Navbar({ activePage, onNavigate }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);

    const navLinks = ["Features", "How It Works", "Cities", "Pricing", "Safety"];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm" : "bg-transparent"}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 cursor-pointer shrink-0 border-none bg-transparent">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-lg">🚗</div>
                    <span className="font-display text-xl font-bold text-slate-900 tracking-tight">Swif<em className="text-blue-600 not-italic">t</em></span>
                </button>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-7">
                    {navLinks.map(item => (
                        <button key={item} onClick={() => onNavigate(item.toLowerCase().replace(/ /g, "-"))}
                            className={`nav-link font-body text-slate-700 text-sm font-medium pb-0.5 cursor-pointer border-none bg-transparent ${activePage === item.toLowerCase().replace(/ /g, "-") ? "active-link" : ""}`}>
                            {item}
                        </button>
                    ))}
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    {/* <Btn variant="ghost" cls="!px-5 !py-2.5 !text-sm" onClick={() => onNavigate("login")}>Log In</Btn> */}
                    <Btn variant="primary" cls="!px-5 !py-2.5 !text-sm" onClick={() => onNavigate("login")}>Get Started →</Btn>
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer">
                    <span className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-slate-700 rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 py-4 flex flex-col gap-1">
                    {navLinks.map(item => (
                        <button key={item} onClick={() => { onNavigate(item.toLowerCase().replace(/ /g, "-")); setMenuOpen(false); }}
                            className={`font-body text-slate-700 font-medium py-3 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors text-left border-none bg-transparent ${activePage === item.toLowerCase().replace(/ /g, "-") ? "bg-blue-50 text-blue-600" : ""}`}>
                            {item}
                        </button>
                    ))}
                    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
                        <Btn variant="ghost" full onClick={() => { onNavigate("login"); setMenuOpen(false); }}>Log In</Btn>
                        <Btn variant="primary" full onClick={() => { onNavigate("home"); setMenuOpen(false); }}>Book a Ride →</Btn>
                    </div>
                </div>
            </div>
        </nav>
    );
}

/* ── CTA Section (reusable across pages) ─────────────────────────────────── */
export function CTASection({ onNavigate }) {
    return (
        <section className="py-16 sm:py-20 bg-white px-4 sm:px-6">
            <div className="max-w-4xl mx-auto relative rounded-3xl sm:rounded-[2rem] p-10 sm:p-14 lg:p-16 text-center overflow-hidden anim-gradShift"
                style={{ background: "linear-gradient(135deg,#1a56ff,#0f3fd4,#00c4a7)", boxShadow: "0 32px 80px rgba(26,86,255,.3)" }}>
                <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-white/8 pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/6 pointer-events-none" />
                <div className="relative">
                    <Badge color="white">Start Today</Badge>
                    <h2 className="font-display font-bold text-white leading-tight tracking-tight mt-4 mb-4 text-3xl sm:text-4xl lg:text-5xl">
                        Your first ride is on us.<br /><em className="not-italic opacity-90">Book it in 10 seconds.</em>
                    </h2>
                    <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto font-body">
                        Join over 2.4 million riders who chose Swift for safe, affordable, and effortlessly smooth rides across the city.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Btn onClick={() => alert("The download feature is disabled in this preview to focus on the UI/UX walkthrough.")} variant="white">🍎 Download for iOS</Btn>
                        <Btn onClick={() => alert("The download feature is disabled in this preview to focus on the UI/UX walkthrough.")} variant="white">▶ Download for Android</Btn>
                    </div>
                    <p className="mt-5 text-xs text-white/45 font-body">Free to download · No signup required · Cancel anytime</p>
                </div>
            </div>
        </section>
    );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */
export function Footer({ onNavigate }) {
    const cols = [
        { title: "Product", links: [["Book a Ride", "home"], ["Ride Types", "pricing"], ["How It Works", "how-it-works"], ["Cities", "cities"], ["Corporate", "pricing"], ["Driver App", "home"]] },
        { title: "Company", links: [["About Swift", "home"], ["Careers", "home"], ["Press", "home"], ["Blog", "home"], ["Investors", "home"], ["Contact Us", "home"]] },
        { title: "Support", links: [["Help Centre", "home"], ["Safety", "safety"], ["Driver Support", "home"], ["Accessibility", "features"], ["Community", "home"], ["Report an Issue", "home"]] },
        { title: "Legal", links: [["Privacy Policy", "home"], ["Terms of Service", "home"], ["Cookie Policy", "home"], ["Refund Policy", "pricing"], ["Insurance", "safety"], ["Compliance", "home"]] },
    ];
    return (
        <footer className="bg-slate-950 pt-16 sm:pt-20 pb-8 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-14">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                        <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 mb-4 border-none bg-transparent cursor-pointer">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-lg">🚗</div>
                            <span className="font-display text-xl font-bold text-white">Swif<em className="text-blue-400 not-italic">t</em></span>
                        </button>
                        <p className="text-sm text-white/35 leading-relaxed mb-5 font-body max-w-[200px]">Fast, safe, affordable rides for everyone — 24 hours a day, 365 days a year.</p>
                        <div className="flex gap-2">
                            {["𝕏", "in", "f", "ig"].map(s => (
                                <div key={s} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-white/40 cursor-pointer hover:bg-white/10 hover:text-white/70 transition-colors font-bold">{s}</div>
                            ))}
                        </div>
                    </div>
                    {cols.map(col => (
                        <div key={col.title}>
                            <div className="text-xs font-bold tracking-widest uppercase text-white/25 mb-4 font-body">{col.title}</div>
                            <div className="flex flex-col gap-2.5">
                                {col.links.map(([label, page]) => (
                                    <button key={label} onClick={() => onNavigate(page)} className="text-sm text-white/40 cursor-pointer hover:text-white/80 transition-colors font-body text-left border-none bg-transparent">{label}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
                    <div className="text-xs text-white/20 font-body">© 2025 Swift Rides Inc. All rights reserved.</div>
                    <div className="flex gap-5">
                        {["Privacy", "Terms", "Cookies"].map(l => <span key={l} className="text-xs text-white/25 cursor-pointer hover:text-white/60 transition-colors font-body">{l}</span>)}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 anim-pulseDot" />
                        <span className="text-xs text-white/25 font-body">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}