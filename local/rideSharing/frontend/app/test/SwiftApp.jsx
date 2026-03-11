"use client"
import { useState, useEffect } from "react";

/* ── Shared ───────────────────────────────────────────────────────────────── */
import { injectFonts, ANIM_CSS, Navbar, Footer, CTASection, Btn, Badge, SectionHead, RIDE_TYPES, TESTIMONIALS } from "./SwiftShared";

/* ── Pages ────────────────────────────────────────────────────────────────── */
import FeaturesPage from "./FeaturesPage";
import HowItWorksPage from "./HowItWorksPage";
import CitiesPage from "./CitiesPage";
import PricingPage from "./PricingPage";
import SafetyPage from "./SafetyPage";

/* ══════════════════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════════════════ */
const STATS = [
    { value: "4.9★", label: "Average Rating", sub: "from 800K+ reviews" },
    { value: "2.4M+", label: "Rides Completed", sub: "this month alone" },
    { value: "12 min", label: "Avg Pickup", sub: "across all cities" },
    { value: "180+", label: "Cities Covered", sub: "and growing fast" },
];

const ALL_CITIES_MARQUEE = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco", "Seattle", "Miami", "Boston", "Austin", "Denver", "Atlanta"];

const HOW_IT_WORKS_HOME = [
    { step: "01", icon: "📍", title: "Set Your Destination", desc: "Type your destination and our smart autocomplete finds it instantly. Add stops, schedule ahead, or ride now." },
    { step: "02", icon: "🤝", title: "Get Matched Instantly", desc: "Our dispatch pairs you with the closest verified, highest-rated driver in under 5 seconds." },
    { step: "03", icon: "🚗", title: "Ride in Comfort", desc: "Track your driver live, message them, share your trip — and arrive safely every time." },
    { step: "04", icon: "💳", title: "Pay Seamlessly", desc: "Auto-charged at trip end. Exact upfront price, always. Digital receipt in seconds." },
];

const FEATURES_HOME = [
    { icon: "🛡️", title: "Safety First", desc: "Background-checked drivers, SOS button, live monitoring & $1M insurance on every trip." },
    { icon: "📡", title: "Live Tracking", desc: "Watch your ride arrive in real-time. Share progress with friends and family." },
    { icon: "💬", title: "In-app Messaging", desc: "Coordinate with your driver without sharing personal numbers." },
    { icon: "🌍", title: "Eco Rides", desc: "Filter for EV/hybrid vehicles. We plant a tree for every 10 Eco rides." },
    { icon: "💰", title: "No Surge Pricing", desc: "Prices capped at 2× base fare. Always see the final price before booking." },
    { icon: "⚡", title: "Book in 10 Seconds", desc: "Fastest booking flow in the industry — works even on low-connectivity." },
];

/* ── Hero Section ─────────────────────────────────────────────────────────── */
function Hero({ onNavigate }) {
    const [activeType, setActiveType] = useState("express");
    const [pickup, setPickup] = useState("");
    const [dest, setDest] = useState("");
    const sel = RIDE_TYPES.find(r => r.id === activeType);

    const drivers = [
        { x: "28%", y: "38%", delay: "0s" }, { x: "55%", y: "52%", delay: "0.8s" },
        { x: "70%", y: "30%", delay: "1.4s" }, { x: "42%", y: "66%", delay: "0.4s" },
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 pt-16">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.04) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-500 rounded-full opacity-8 blur-3xl pointer-events-none" />
            <div className="absolute top-20 -right-24 w-80 h-80 bg-teal-400 rounded-full opacity-10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500 rounded-full opacity-5 blur-3xl pointer-events-none" />
            <div className="anim-carDrive text-4xl opacity-10 pointer-events-none">🚗</div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left */}
                <div className="order-2 lg:order-1">
                    <div className="fade-up flex items-center gap-2 mb-5">
                        <div className="w-2 h-2 rounded-full bg-teal-500 anim-pulseDot" />
                        <span className="text-xs font-semibold text-teal-600 tracking-widest uppercase font-body">Live drivers near you</span>
                    </div>
                    <h1 className="fade-up1 font-display font-bold leading-none tracking-tight text-slate-900 mb-5 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                        Your ride,<br /><em className="text-blue-600 not-italic">when you</em><br />need it most.
                    </h1>
                    <p className="fade-up2 text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-md font-body">
                        Book a ride in seconds, track it live, and arrive safely. Swift connects you with trusted, vetted drivers across 180+ cities — 24 hours a day.
                    </p>

                    {/* Booking Card */}
                    <div className="fade-up3 bg-white rounded-3xl p-5 sm:p-6 shadow-2xl shadow-blue-100 border border-blue-50 max-w-lg">
                        {/* Ride type tabs */}
                        <div className="flex gap-1.5 mb-5 bg-slate-100 rounded-xl p-1">
                            {RIDE_TYPES.map(r => (
                                <button key={r.id} onClick={() => setActiveType(r.id)}
                                    className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold font-body transition-all duration-200 cursor-pointer border-none ${activeType === r.id ? "bg-white text-slate-900 shadow-md" : "bg-transparent text-slate-400 hover:text-slate-600"}`}>
                                    <span className="hidden sm:inline">{r.icon} </span>{r.name}
                                </button>
                            ))}
                        </div>
                        {sel && (
                            <div className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2.5 mb-4">
                                <span className="text-xs text-slate-500 font-body"><span className="font-semibold text-slate-800">{sel.name}</span> · {sel.desc}</span>
                                <div className="text-right shrink-0 ml-2">
                                    <div className="text-xs font-bold text-slate-900 font-body">{sel.price}</div>
                                    <div className="text-xs text-teal-600 font-semibold font-body">ETA {sel.eta}</div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-2.5 mb-4">
                            {[{ color: "#1a56ff", ph: "Pickup location", val: pickup, set: setPickup },
                            { color: "#00c4a7", ph: "Where to?", val: dest, set: setDest }].map(f => (
                                <div key={f.ph} className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: f.color }} />
                                    <input className="ride-input font-body w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-800 bg-slate-50 border border-slate-200 transition-all duration-200" placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} />
                                </div>
                            ))}
                        </div>
                        <Btn variant="primary" full cls="!py-3.5 !text-base">
                            <span>Find My Ride</span><span className="text-xl">→</span>
                        </Btn>
                        <p className="text-center text-xs text-slate-400 mt-3 font-body">
                            No account needed · <span className="text-blue-500 cursor-pointer">Cancel anytime, free</span>
                        </p>
                    </div>

                    <div className="fade-up4 flex items-center gap-4 sm:gap-6 mt-6 flex-wrap">
                        {[["⭐", "4.9/5 rating"], ["🛡️", "Fully insured"], ["⚡", "Avg 3min pickup"]].map(([ic, t]) => (
                            <div key={t} className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-body font-medium"><span>{ic}</span><span>{t}</span></div>
                        ))}
                    </div>
                </div>

                {/* Right — Map Card */}
                <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-blue-400/20 blur-2xl rounded-full" />
                        <div className="anim-float bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-blue-50">
                            <div className="relative h-52 sm:h-72 overflow-hidden" style={{ background: "linear-gradient(160deg,#deeaff,#eef5ff)" }}>
                                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.06) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 320" preserveAspectRatio="none">
                                    <path d="M 0 160 Q 120 140 250 155 Q 380 170 500 145" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="22" strokeLinecap="round" />
                                    <path d="M 0 160 Q 120 140 250 155 Q 380 170 500 145" fill="none" stroke="rgba(26,86,255,.4)" strokeWidth="1.5" strokeDasharray="8,10" />
                                    <path d="M 180 0 Q 200 80 195 160 Q 190 240 210 320" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="16" strokeLinecap="round" />
                                </svg>
                                {drivers.map((d, i) => (
                                    <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: d.x, top: d.y }}>
                                        <div className="absolute -inset-2 rounded-full bg-blue-500/15 anim-ripple" style={{ animationDelay: d.delay }} />
                                        <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-xs">🚗</div>
                                    </div>
                                ))}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="absolute -inset-3 rounded-full bg-teal-500/20 anim-ripple2" />
                                    <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-lg" />
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap font-body">You</div>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
                                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-body">Arriving in</div>
                                    <div className="font-display text-xl font-bold text-slate-900">2 min</div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shrink-0 flex items-center justify-center text-lg">👨</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-slate-900 font-body">Marcus T. <span className="text-amber-400">★</span> <span className="text-slate-400 font-normal">4.97</span></div>
                                        <div className="text-xs text-slate-400 font-body truncate">Toyota Camry · Silver · <strong className="text-slate-700">ABX 4821</strong></div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {["💬", "📞"].map(ic => <div key={ic} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-base cursor-pointer hover:bg-blue-50 transition-colors">{ic}</div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-5 -left-4 sm:-left-8 bg-white rounded-2xl px-3 py-2.5 shadow-xl border border-blue-50 anim-floatB hidden sm:block">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-body">Drivers nearby</div>
                            <div className="font-display text-xl font-bold text-slate-900">12 <span className="text-sm text-teal-500 font-medium">active</span></div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 sm:-right-8 bg-slate-900 rounded-2xl px-3 py-2.5 shadow-xl anim-floatC hidden sm:block">
                            <div className="text-xs text-white/40 font-semibold uppercase tracking-wider font-body">Your fare</div>
                            <div className="font-display text-xl font-bold text-white">$14.50</div>
                            <div className="text-xs text-teal-400 font-semibold font-body">Fixed · No surges</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Stats Bar ────────────────────────────────────────────────────────────── */
function StatsBar() {
    return (
        <section className="bg-slate-900 py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
                {STATS.map((s, i) => (
                    <div key={i} className={`text-center px-4 ${i < 3 ? "lg:border-r border-white/10" : ""}`}>
                        <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{s.value}</div>
                        <div className="text-sm sm:text-base font-semibold text-white/80 font-body mb-0.5">{s.label}</div>
                        <div className="text-xs text-white/35 font-body">{s.sub}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ── Ride Types Preview ───────────────────────────────────────────────────── */
function RideTypesPreview({ onNavigate }) {
    const [active, setActive] = useState("express");
    const sel = RIDE_TYPES.find(r => r.id === active);
    return (
        <section className="py-20 sm:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Choose Your Ride" title="One app, every" highlight="journey" sub="From a quick solo trip to a group airport transfer — pick the ride that fits." center />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {RIDE_TYPES.map(r => (
                        <div key={r.id} onClick={() => setActive(r.id)} className="lift rounded-2xl p-4 sm:p-6 cursor-pointer relative overflow-hidden border-2 transition-all duration-250"
                            style={{ background: active === r.id ? r.accent : "#f8faff", borderColor: active === r.id ? r.accent : "transparent" }}>
                            {r.badge && <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full font-body">{r.badge}</div>}
                            <div className="text-3xl sm:text-4xl mb-3">{r.icon}</div>
                            <div className={`font-display text-lg sm:text-xl font-bold mb-1.5 ${active === r.id ? "text-white" : "text-slate-900"}`}>{r.name}</div>
                            <div className={`text-xs sm:text-sm leading-relaxed mb-3 ${active === r.id ? "text-white/75" : "text-slate-500"}`}>{r.desc}</div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className={`text-lg sm:text-xl font-bold font-display ${active === r.id ? "text-white" : "text-slate-900"}`}>{r.price}</div>
                                    <div className={`text-xs font-body ${active === r.id ? "text-white/60" : "text-slate-400"}`}>ETA {r.eta}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {sel && (
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-blue-100">
                        <div className="flex flex-wrap gap-6 sm:gap-10">
                            {[["Capacity", sel.capacity], ["Price", sel.price], ["ETA", sel.eta], ["Cancel", "Free < 2min"]].map(([l, v]) => (
                                <div key={l}>
                                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 font-body">{l}</div>
                                    <div className="text-lg font-bold text-slate-900 font-body">{v}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Btn variant="primary">Book Now →</Btn>
                            <Btn variant="ghost" onClick={() => onNavigate("pricing")}>See Pricing</Btn>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ── How It Works Preview ─────────────────────────────────────────────────── */
function HowItWorksPreview({ onNavigate }) {
    return (
        <section className="py-20 sm:py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Simple Process" title="Booked in under" highlight="10 seconds" center sub="Four steps from open to on your way — the fastest booking experience in the industry." />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative mb-10">
                    <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 opacity-25 rounded-full" />
                    {HOW_IT_WORKS_HOME.map((s, i) => (
                        <div key={i} className="lift bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-blue-50 relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl mb-4 border border-blue-100">{s.icon}</div>
                            <div className="absolute top-5 right-5 font-display text-4xl font-bold text-blue-600/5 leading-none">{s.step}</div>
                            <div className="font-display text-lg font-bold text-slate-900 mb-2">{s.title}</div>
                            <div className="text-sm text-slate-500 leading-relaxed font-body">{s.desc}</div>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Btn variant="ghost" onClick={() => onNavigate("how-it-works")}>See the full walkthrough →</Btn>
                </div>
            </div>
        </section>
    );
}

/* ── Features Preview ─────────────────────────────────────────────────────── */
function FeaturesPreview({ onNavigate }) {
    return (
        <section className="py-20 sm:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Why Swift" badgeColor="teal" title="Designed around" highlight="your trust" sub="Every feature in Swift was built answering one question: what does the rider actually need to feel safe, comfortable, and in control?" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {FEATURES_HOME.map((f, i) => (
                        <div key={i} className="lift bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <div className="text-2xl mb-2.5">{f.icon}</div>
                            <div className="font-semibold text-sm text-slate-900 mb-1.5 font-body">{f.title}</div>
                            <div className="text-xs text-slate-500 leading-relaxed font-body">{f.desc}</div>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Btn variant="primary" onClick={() => onNavigate("features")}>Explore all 50+ features →</Btn>
                </div>
            </div>
        </section>
    );
}

/* ── Testimonials Preview ─────────────────────────────────────────────────── */
function TestimonialsPreview() {
    const [activeIdx, setActiveIdx] = useState(0);
    const t = TESTIMONIALS[activeIdx];
    return (
        <section className="py-20 sm:py-24 bg-slate-900 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Real Stories" title="Loved by" highlight="millions" sub="Don't take our word for it — here's what our riders say." center light />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 mb-6 border border-white/5 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: t.gradient }} />
                    <p className="font-display italic text-white/90 leading-relaxed mb-6 text-lg sm:text-2xl">"{t.text}"</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: t.gradient }}>{t.avatar}</div>
                            <div>
                                <div className="font-semibold text-white text-sm font-body">{t.name}</div>
                                <div className="text-xs text-white/40 font-body">{t.role} · {t.city}</div>
                            </div>
                        </div>
                        <div className="text-amber-400 text-base">★★★★★</div>
                    </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                    {TESTIMONIALS.map((tm, i) => (
                        <button key={i} onClick={() => setActiveIdx(i)}
                            className={`rounded-xl py-2 px-1 text-xs font-semibold font-body cursor-pointer border transition-all duration-200 truncate ${i === activeIdx ? "bg-blue-600 border-blue-600 text-white" : "bg-white/4 border-white/8 text-white/50 hover:border-white/20"}`}>
                            {tm.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Cities Marquee ───────────────────────────────────────────────────────── */
function CitiesMarquee({ onNavigate }) {
    return (
        <section className="py-16 sm:py-20 bg-slate-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 text-center">
                <SectionHead badge="180+ Cities" badgeColor="teal" title="Available" highlight="everywhere" center />
            </div>
            {[
                { items: [...ALL_CITIES_MARQUEE, ...ALL_CITIES_MARQUEE], cls: "anim-marquee", bg: "bg-white border-blue-100 text-slate-800", pfx: "📍" },
                { items: [...ALL_CITIES_MARQUEE.slice(6), ...ALL_CITIES_MARQUEE, ...ALL_CITIES_MARQUEE.slice(0, 6)], cls: "anim-marqueeR", bg: "bg-blue-50 border-blue-200 text-blue-700", pfx: "🌆" },
            ].map((row, ri) => (
                <div key={ri} className={`overflow-hidden ${ri === 0 ? "mb-3" : ""}`}>
                    <div className={`flex ${row.cls} w-max`}>
                        {row.items.map((c, i) => <div key={i} className={`shrink-0 ${row.bg} border rounded-full px-5 py-2.5 mx-2 text-sm font-semibold whitespace-nowrap font-body shadow-sm`}>{row.pfx} {c}</div>)}
                    </div>
                </div>
            ))}
            <div className="text-center mt-8">
                <Btn variant="ghost" onClick={() => onNavigate("cities")}>View all 180+ cities →</Btn>
            </div>
        </section>
    );
}

/* ── Home Page ────────────────────────────────────────────────────────────── */
function HomePage({ onNavigate }) {
    return (
        <>
            <Hero onNavigate={onNavigate} />
            <StatsBar />
            <RideTypesPreview onNavigate={onNavigate} />
            <HowItWorksPreview onNavigate={onNavigate} />
            <FeaturesPreview onNavigate={onNavigate} />
            <TestimonialsPreview />
            <CitiesMarquee onNavigate={onNavigate} />
            <CTASection onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </>
    );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════════════ */
export default function SwiftApp() {
    const [page, setPage] = useState("home");

    useEffect(() => { injectFonts(); }, []);

    // Scroll to top on page change
    useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

    const navigate = (p) => setPage(p);

    const pages = {
        home: <HomePage onNavigate={navigate} />,
        features: <FeaturesPage onNavigate={navigate} />,
        "how-it-works": <HowItWorksPage onNavigate={navigate} />,
        cities: <CitiesPage onNavigate={navigate} />,
        pricing: <PricingPage onNavigate={navigate} />,
        safety: <SafetyPage onNavigate={navigate} />,
    };

    return (
        <>
            <style>{ANIM_CSS}</style>
            <div className="font-body text-slate-900 antialiased">
                <Navbar activePage={page} onNavigate={navigate} />
                <div className="anim-fadeIn" key={page}>
                    {pages[page] || pages.home}
                </div>
            </div>
        </>
    );
}