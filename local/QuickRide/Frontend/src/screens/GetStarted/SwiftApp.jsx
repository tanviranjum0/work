/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import "./swiftapp.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
/* ── Shared ───────────────────────────────────────────────────────────────── */
import { injectFonts, ANIM_CSS, Navbar, Footer, CTASection, Btn, SectionHead, RIDE_TYPES, TESTIMONIALS } from "./SwiftShared";

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
    const [activeType, setActiveType] = useState("Bike");
    const [pickup, setPickup] = useState("");
    const [dest, setDest] = useState("");
    const sel = RIDE_TYPES.find(r => r.id === activeType);
    const navigate = useNavigate();
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
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#1a56ff" }} />
                                <input className="ride-input font-body w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-800 bg-slate-50 border border-slate-200 transition-all duration-200" placeholder="Pickup location" />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: "#00c4a7" }} />
                                <input className="ride-input font-body w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-800 bg-slate-50 border border-slate-200 transition-all duration-200" placeholder="Where to?" />
                            </div>
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
                        <div onClick={() => onNavigate("login")} className="w-full my-10 cursor-pointer ">
                            <button
                                className="bg-white text-center w-full rounded-2xl h-14 relative text-black text-xl font-semibold group"
                                type="button"
                            >
                                <div
                                    className="bg-[rgb(37_99_235)]  rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[calc(100%-8px)] z-10 duration-500"
                                >
                                    <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="translate-x-2">Get Started</p>
                            </button>
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
                            <Btn variant="primary" onClick={() => onNavigate("login")}>Book Now →</Btn>
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
                <SectionHead badge="Why Swift" badgeColor="teal" title="Designed around" highlight="your trust" sub="Every feature in Swift was built answering one question: what does the user actually need to feel safe, comfortable, and in control?" />
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
                <SectionHead badge="Real Stories" title="Loved by" highlight="millions" sub="Don't take our word for it — here's what our users say." center light />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 mb-6 border border-white/5 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: t.gradient }} />
                    <p className="font-display italic text-white/90 leading-relaxed mb-6 text-lg sm:text-2xl">&quot;{t.text}&quot;</p>
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
   LOGIN PAGE — user & Captain
══════════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════════
   LOGIN PAGE — user & Captain (full-page section)
══════════════════════════════════════════════════════════════════════════════ */
const LOGIN_PAGE_CSS = `
  @keyframes spin       { to { transform: rotate(360deg); } }
  @keyframes slideRight { from { transform:translateX(-12px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  .login-input:focus    { outline:none; border-color:#1a56ff !important; box-shadow:0 0 0 3px rgba(26,86,255,.12) !important; }
  .cap-input:focus      { outline:none; border-color:#00c4a7 !important; box-shadow:0 0 0 3px rgba(0,196,167,.12) !important; }
  .form-slide           { animation: slideRight .35s ease both; }
  .tab-pill             { transition: transform .28s cubic-bezier(.34,1.2,.64,1); }
  .pass-strength-bar    { transition: width .3s ease, background .3s ease; }
`;

/* ── Data for panels ───────────────────────────────────────────────────────── */
const user_HIGHLIGHTS = [
    { icon: "⭐", title: "4.9★ rated service", sub: "from 800K+ verified reviews" },
    { icon: "🛡️", title: "Fully insured rides", sub: "$1M coverage, every trip" },
    { icon: "⚡", title: "Average 3-min pickup", sub: "Real-time GPS tracking" },
    { icon: "💰", title: "No surge surprises", sub: "Upfront fare, always guaranteed" },
];

const CAPTAIN_HIGHLIGHTS = [
    { icon: "💰", title: "Earn on your schedule", sub: "Set your own hours, every week" },
    { icon: "⚡", title: "Instant weekly payouts", sub: "Cash out early, any day" },
    { icon: "🛡️", title: "$1M insurance coverage", sub: "Protected from pickup to drop-off" },
    { icon: "📈", title: "Bonuses & rewards", sub: "Trip targets unlock extra earnings" },
];

const user_STATS = [["2.4M+", "Rides/month"], ["180+", "Cities"]];
const CAPTAIN_STATS = [["60K+", "Active captains"], ["$28/hr", "Avg earnings"]];

/* ── Sub-components ─────────────────────────────────────────────────────────── */

/** Reusable labelled text input */
function LInput({ label, type = "text", placeholder, value, onChange, extra, accent = "login" }) {
    return (
        <div>
            {label && <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body my-2 block">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${accent === "captain" ? "cap-input" : "login-input"} w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400`}
            />
            {extra}
        </div>
    );
}

/** Password strength bar */
function StrengthBar({ password }) {
    if (!password) return null;
    const score = Math.min(4, Math.floor(password.length / 2));
    const colors = ["bg-red-400", "bg-amber-400", "bg-amber-400", "bg-teal-500", "bg-teal-500"];
    const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
    return (
        <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${score >= i ? colors[score] : "bg-slate-200"}`} />
            ))}
            <span className="text-xs text-slate-400 font-body shrink-0">{labels[score]}</span>
        </div>
    );
}



/** Left branding panel */
function BrandPanel({ isuser }) {
    const highlights = isuser ? user_HIGHLIGHTS : CAPTAIN_HIGHLIGHTS;
    const stats = isuser ? user_STATS : CAPTAIN_STATS;
    const accentHex = isuser ? "#93c5fd" : "#6ee7b7";
    const bg = isuser
        ? "linear-gradient(145deg,#0b0f1a 0%,#0f2055 55%,#1a56ff 100%)"
        : "linear-gradient(145deg,#021a10 0%,#064e3b 55%,#00c4a7 100%)";

    return (
        <div className="relative flex-shrink-0 lg:w-[42%] rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden flex flex-col justify-between p-8 sm:p-10"
            style={{ background: bg, minHeight: "320px" }}>

            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ background: isuser ? "#3b82f6" : "#34d399" }} />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-15"
                style={{ background: isuser ? "#818cf8" : "#6ee7b7" }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)", backgroundSize: "36px 36px" }} />

            <div className="relative z-10 flex flex-col h-full gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl border border-white/20 bg-white/10 flex items-center justify-center text-lg">🚗</div>
                    <span className="font-display text-xl font-bold text-white tracking-tight">
                        Swif<em className="not-italic" style={{ color: accentHex }}>t</em>
                    </span>
                </div>

                {/* Headline */}
                <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-3 font-body" style={{ color: accentHex }}>
                        {isuser ? "For users" : "For Captains"}
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
                        {isuser ? <>Your city,<br />your way.</> : <>Drive more.<br />Earn more.</>}
                    </h2>
                    <p className="text-sm text-white/55 font-body leading-relaxed max-w-xs">
                        {isuser
                            ? "Safe, affordable rides in 180+ cities. Booked in 10 seconds, tracked live, door-to-door."
                            : "Join 60,000+ Swift Captains. Flexible hours, instant payouts, and the best support in the business."}
                    </p>
                </div>

                {/* Perks list — hidden on mobile, shown on lg */}
                <div className="hidden lg:flex flex-col gap-4">
                    {highlights.map((h) => (
                        <div key={h.title} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/12 flex items-center justify-center text-lg shrink-0">{h.icon}</div>
                            <div>
                                <div className="text-sm font-semibold text-white font-body">{h.title}</div>
                                <div className="text-xs text-white/45 font-body">{h.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stat chips */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    {stats.map(([v, l]) => (
                        <div key={l} className="bg-white/8 border border-white/10 rounded-2xl px-4 py-3 text-center">
                            <div className="font-display text-2xl font-bold text-white">{v}</div>
                            <div className="text-xs text-white/45 font-body mt-0.5">{l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── LoginForm (used by LoginPage) ─────────────────────────────────────────── */
function LoginForm({ role, authMode, setAuthMode, onNavigate, }) {
    const navigation = useNavigate();
    const [responseError, setResponseError] = useState("")
    useEffect(() => {
        setTimeout(() => {
            setResponseError("");
        }, 5000);
    }, [responseError]);
    const [form, setFormState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        vehicleColour: "",
        vehicleCapacity: "",
        vehicleNumber: "",
        vehicleType: ""
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [captainStep, setCaptainStep] = useState(1);
    const [done, setDone] = useState(false);

    const isuser = role === "user";
    const isLogin = authMode === "login";
    const isSignup = authMode === "signup";
    const isForgot = authMode === "forgot";
    const accent = isuser ? "login" : "captain";
    const btnBg = isuser
        ? "linear-gradient(135deg,#1a56ff,#0f3fd4)"
        : "linear-gradient(135deg,#00c4a7,#00a38d)";
    const btnShadow = isuser
        ? "0 8px 24px rgba(26,86,255,.3)"
        : "0 8px 24px rgba(0,196,167,.3)";

    const set = (k) => (e) => setFormState(f => ({ ...f, [k]: e.target.value }));




    const token = localStorage.getItem("token");
    useEffect(() => {
        async function checkAuth() {

            const userCheck = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/profile`, {
                headers: {
                    token: token,
                },
            })
            const result = await userCheck.json();

            if (result.message == "Unauthorized User") {
                console.log("Not a user, checking captain...");
                await checkCaptain()

            } else {
                console.log("User authenticated, redirecting to user home...");
                navigation("/home")
                return;
            }

            async function checkCaptain() {
                const captainCheck = await fetch(`${import.meta.env.VITE_SERVER_URL}/captain/profile`, {
                    headers: {
                        token: token,
                    },
                })
                const result = await captainCheck.json();

                if (result.message == "Unauthorized User") {
                    console.log("Not authenticated, redirecting to login...");
                } else {
                    console.log("Captain authenticated, redirecting to user home...");
                    navigation("/captain/home");
                    return;

                }
            }
        }

        if (token) checkAuth();
    }, [])
    const handleSubmit = () => {
        if (role === "user" && authMode === "signup") {
            const signupUser = async (data) => {
                if (!data.firstName || !data.lastName || !data.email || !data.password || !data.phone) {
                    setResponseError("All input fields are required.");
                    return;
                }
                const userData = {
                    fullname: {
                        firstname: data.firstName,
                        lastname: data.lastName,
                    },
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                };

                try {
                    setLoading(true);
                    const response = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/user/register`,
                        userData
                    );
                    localStorage.setItem("token", response.data.token);
                    navigation("/home");
                } catch (error) {
                    console.log(error.response)
                    setResponseError(error.response.data[0]?.msg || error.response.data.message);
                } finally {
                    setLoading(false);
                }
            };
            signupUser(form);
        } else if (role === "captain" && authMode === "signup") {
            const signupCaptain = async (data) => {
                // console.log(data);
                if (!data.firstName || !data.lastName || !data.email || !data.password || !data.phone || !data.vehicleColour || !data.vehicleCapacity || !data.vehicleNumber || !data.vehicleType) {
                    setResponseError("All input fields are required.");
                    return;
                }
                const captainData = {
                    fullname: {
                        firstname: data.firstName,
                        lastname: data.lastName,
                    },
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                    vehicle: {
                        color: data.vehicleColour,
                        number: data.vehicleNumber,
                        capacity: data.vehicleCapacity,
                        type: data.vehicleType,
                    },
                };

                try {
                    setLoading(true);
                    const response = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/captain/register`,
                        captainData
                    );
                    localStorage.setItem("token", response.data.token);
                    navigation("/captain/home");
                } catch (error) {
                    setResponseError(error.response.data[0]?.msg || error.response.data.message
                    );
                } finally {
                    setLoading(false);
                }

            };

            signupCaptain(form)
        }
        if (authMode == "login") {
            if (role === "user") {
                function validateEmail(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                }
                if (!validateEmail(form.email)) {
                    setResponseError("Please enter a valid email address.");
                    return;
                }
                if (form.password.trim() == "") {
                    setResponseError("Please enter a valid password.");
                    return;
                }
                const loginUser = async (data) => {
                    try {
                        setLoading(true);
                        const response = await axios.post(
                            `${import.meta.env.VITE_SERVER_URL}/user/login`,
                            { email: data.email, password: data.password }
                        );
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("userData", JSON.stringify({
                            type: "user",
                            data: response.data.user,
                        }));
                        navigation("/home");
                    } catch (error) {
                        setResponseError(error.response.data[0]?.msg || error.response.data.message);

                    } finally {
                        setLoading(false);
                    }
                };
                loginUser(form);
            } else if (role === "captain") {
                function validateEmail(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                }
                if (!validateEmail(form.email)) {
                    setResponseError("Please enter a valid email address.");
                    return;
                }
                if (form.password.trim() == "") {
                    setResponseError("Please enter a valid password.");
                    return;
                }
                const loginCaptain = async (data) => {
                    try {
                        setLoading(true)
                        const response = await axios.post(
                            `${import.meta.env.VITE_SERVER_URL}/captain/login`,
                            data
                        );
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("userData", JSON.stringify({
                            type: "captain",
                            data: response.data.captain,
                        }));
                        navigation("/captain/home");
                    } catch (error) {
                        setResponseError(error.response.data[0]?.msg || error.response.data.message);

                    } finally {
                        setLoading(false);
                    }

                };
                loginCaptain(form);
            }

        }

    };

    /* ── Success screen ── */
    if (done) {
        return (
            <div className="flex flex-col items-center justify-center text-center gap-5 py-10 px-2 form-slide">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
                    style={{ background: isuser ? "linear-gradient(135deg,#dbeafe,#bfdbfe)" : "linear-gradient(135deg,#d1fae5,#a7f3d0)" }}>
                    ✅
                </div>
                <div>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mb-1">
                        {isLogin ? "Welcome back!" : isuser ? "Account created!" : "Application submitted!"}
                    </h3>
                    <p className="text-sm text-slate-500 font-body max-w-xs leading-relaxed">
                        {isLogin
                            ? `You're signed in as a ${isuser ? "user" : "captain"}. Redirecting you now…`
                            : isuser
                                ? "Your Swift user account is ready. Book your first ride in 10 seconds."
                                : "Our team will review your application within 24 hours. You'll get an email once approved."}
                    </p>
                </div>
                <button onClick={() => onNavigate("home")}
                    className="px-8 py-3 rounded-xl font-bold text-white font-body border-none cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
                    style={{ background: btnBg, boxShadow: btnShadow }}>
                    {isuser ? "Book a Ride →" : "Go to Dashboard →"}
                </button>
                <button onClick={() => { setDone(false); setFormState({ firstName: "", lastName: "", email: "", phone: "", password: "", vehicleColour: "", vehicleCapacity: "", vehicleNumber: "", vehicleType: "" }); }}
                    className="text-xs text-slate-400 font-body hover:text-slate-600 border-none bg-transparent cursor-pointer">
                    Back to sign in
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 form-slide" key={`${role}-${authMode}-${captainStep}`}>

            {/* ── Login form ── */}
            {isLogin && (
                <>
                    <LInput label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} accent={accent} />
                    <LInput label="Password" type={showPass ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={set("password")} accent={accent}
                        extra={
                            <button onClick={() => setShowPass(!showPass)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer text-lg">
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        }
                    />
                    {/* Remember / forgot row */}
                    <div className="flex justify-between items-center -mt-2">
                        {/* <label className="flex items-center gap-2 text-xs text-slate-500 font-body cursor-pointer select-none">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded" style={{ accentColor: isuser ? "#1a56ff" : "#00c4a7" }} />
                            Remember me
                        </label> */}
                        <button onClick={() => navigation(`/${role}/forgot-password`)}
                            className="text-xs font-semibold hover:underline border-none bg-transparent cursor-pointer font-body"
                            style={{ color: isuser ? "#1a56ff" : "#00c4a7" }}>
                            Forgot password?
                        </button>
                    </div>
                    <p className="text-sm text-center my-2 text-red-500">
                        {responseError && responseError}
                    </p>
                    <ActionBtn loading={loading} onClick={handleSubmit} bg={btnBg} shadow={btnShadow}
                        label={`Sign In as ${isuser ? "User" : "Captain"} →`} loadingLabel="Signing in…" />

                    {/* <Divider /> */}
                    {/* <SocialButtons /> */}
                    <p className="text-center text-xs text-slate-500 font-body">
                        Don&apos;t have an account?{" "}
                        <button onClick={() => setAuthMode("signup")} className="font-semibold border-none bg-transparent cursor-pointer font-body" style={{ color: isuser ? "#1a56ff" : "#00c4a7" }}>
                            Sign up free
                        </button>
                    </p>
                </>
            )}

            {/* ── Sign-up form ── */}
            {isSignup && (
                <>
                    {/* Captain step indicator */}
                    {!isuser && (
                        <div className="flex items-center gap-2 mb-1">
                            {[1, 2].map(s => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-body transition-all duration-300 ${captainStep >= s ? "text-white shadow-sm" : "bg-slate-100 text-slate-400"}`}
                                        style={captainStep >= s ? { background: "linear-gradient(135deg,#00c4a7,#00a38d)" } : {}}>
                                        {captainStep > s ? "✓" : s}
                                    </div>
                                    {s < 2 && <div className={`w-10 h-0.5 rounded-full transition-all duration-500 ${captainStep > s ? "bg-teal-400" : "bg-slate-200"}`} />}
                                </div>
                            ))}
                            <span className="text-xs text-slate-400 font-body ml-1">
                                {captainStep === 1 ? "Personal info" : "Vehicle details"}
                            </span>
                        </div>
                    )}

                    {/* ── Step 1: Personal info ── */}
                    {(isuser || captainStep === 1) && (
                        <>
                            {/* user keeps: full name + phone + email + password + confirm */}
                            {isuser && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <LInput label="First name" placeholder="Alex" value={form.firstName} onChange={set("firstName")} accent={accent} />
                                        <LInput label="Last name" placeholder="Johnson" value={form.lastName} onChange={set("lastName")} accent={accent} />
                                    </div>
                                    <LInput label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} accent={accent} />
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-1.5 block">Phone number</label>
                                        <input
                                            type="tel"
                                            placeholder="e.g. 9876543210"
                                            maxLength={10}
                                            value={form.phone}
                                            onChange={e => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 10) setFormState(f => ({ ...f, phone: v })); }}
                                            className={`login-input w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400 ${form.phone.length > 0 && form.phone.length < 10 ? "border-amber-300" : "border-slate-200"}`}
                                        />
                                        {form.phone.length > 0 && form.phone.length < 10 && (
                                            <p className="text-xs text-amber-500 font-body mt-1.5">{10 - form.phone.length} more digit{10 - form.phone.length !== 1 ? "s" : ""} needed</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-1.5 block">Password</label>
                                        <div className="relative">
                                            <input type={showPass ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={set("password")}
                                                className="login-input w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400" />
                                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer text-lg">{showPass ? "🙈" : "👁️"}</button>
                                        </div>
                                        <StrengthBar password={form.password} />
                                    </div>
                                </>
                            )}

                            {/* Captain Step 1: First name, Last name, Phone (10-digit), Password */}
                            {!isuser && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <LInput label="First name" placeholder="Marcus" value={form.firstName} onChange={set("firstName")} accent="captain" />
                                        <LInput label="Last name" placeholder="Thompson" value={form.lastName} onChange={set("lastName")} accent="captain" />
                                    </div>

                                    {/* Phone — 10 digit only */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-1.5 block">Phone number</label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                placeholder="Enter 10-digit number"
                                                maxLength={10}
                                                value={form.phone}
                                                onChange={e => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 10) setFormState(f => ({ ...f, phone: v })); }}
                                                className={`cap-input w-full px-4 pr-16 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400 ${form.phone.length > 0 && form.phone.length < 10 ? "border-amber-300" : form.phone.length === 10 ? "border-teal-400 bg-teal-50/40" : "border-slate-200"}`}
                                            />
                                            {/* Digit counter badge */}
                                            <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold font-body tabular-nums ${form.phone.length === 10 ? "text-teal-500" : form.phone.length > 0 ? "text-amber-500" : "text-slate-300"}`}>
                                                {form.phone.length}/10
                                            </span>
                                        </div>
                                        {form.phone.length > 0 && form.phone.length < 10 && (
                                            <p className="text-xs text-amber-500 font-body mt-1.5">{10 - form.phone.length} more digit{10 - form.phone.length !== 1 ? "s" : ""} needed</p>
                                        )}
                                        {form.phone.length === 10 && (
                                            <p className="text-xs text-teal-500 font-body mt-1.5 font-semibold">✓ Valid phone number</p>
                                        )}
                                    </div>
                                    <LInput label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} accent={accent} />
                                    {/* Single password input */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-1.5 block">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPass ? "text" : "password"}
                                                placeholder="Create a strong password"
                                                value={form.password}
                                                onChange={set("password")}
                                                className="cap-input w-full px-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400"
                                            />
                                            <button onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer text-lg">
                                                {showPass ? "🙈" : "👁️"}
                                            </button>
                                        </div>
                                        <StrengthBar password={form.password} />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* ── Step 2: Captain vehicle details ── */}
                    {!isuser && captainStep === 2 && (
                        <>
                            {/* Vehicle colour */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-2 block">Vehicle colour</label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {[
                                        { name: "White", hex: "#f8fafc", border: "#cbd5e1" },
                                        { name: "Black", hex: "#0f172a", border: "#0f172a" },
                                        { name: "Silver", hex: "#94a3b8", border: "#94a3b8" },
                                        { name: "Red", hex: "#ef4444", border: "#ef4444" },
                                        { name: "Blue", hex: "#3b82f6", border: "#3b82f6" },
                                        { name: "Green", hex: "#22c55e", border: "#22c55e" },
                                        { name: "Yellow", hex: "#eab308", border: "#eab308" },
                                    ].map(c => (
                                        <button key={c.name} onClick={() => setFormState(f => ({ ...f, vehicleColour: c.name }))}
                                            title={c.name}
                                            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${form.vehicleColour === c.name ? "border-teal-400 bg-teal-50 scale-105" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                                            <div className="w-7 h-7 rounded-full border border-slate-200 shadow-sm" style={{ background: c.hex, borderColor: c.border }} />
                                            <span className="text-xs font-semibold font-body text-slate-600 leading-tight">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                                {form.vehicleColour && (
                                    <p className="text-xs text-teal-600 font-semibold font-body mt-2">✓ {form.vehicleColour} selected</p>
                                )}
                            </div>

                            {/* Vehicle number */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-1.5 block">Vehicle number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. MH 02 AB 1234"
                                    value={form.vehicleNumber}
                                    onChange={e => setFormState(f => ({ ...f, vehicleNumber: e.target.value.toUpperCase() }))}
                                    className="cap-input w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400 tracking-widest uppercase"
                                />
                            </div>

                            {/* Vehicle CC */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-1.5 block">Engine capacity (CC)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="e.g. 1200"
                                        min="50"
                                        max="9999"
                                        value={form.vehicleCapacity}
                                        onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setFormState(f => ({ ...f, vehicleCapacity: v })); }}
                                        className="cap-input w-full px-4 pr-14 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 font-body transition-all duration-200 placeholder-slate-400"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-body pointer-events-none">CC</span>
                                </div>
                                {/* Common CC quick-picks */}
                                <div className="flex flex-wrap gap-2 mt-2.5">
                                    {["100", "125", "150", "200", "350", "500", "1000", "1200", "1500", "2000"].map(cc => (
                                        <button key={cc} onClick={() => setFormState(f => ({ ...f, vehicleCapacity: cc }))}
                                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-body cursor-pointer transition-all duration-200 ${form.vehicleCapacity === cc ? "border-teal-400 bg-teal-500 text-white shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-teal-300 hover:text-teal-600"}`}>
                                            {cc} cc
                                        </button>
                                    ))}
                                </div>
                                {form.vehicleCapacity && (
                                    <p className="text-xs text-teal-600 font-semibold font-body mt-2">✓ {form.vehicleCapacity} CC engine</p>
                                )}
                            </div>

                            {/* Vehicle type */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-body mb-2 block">Vehicle type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: "🚗", label: "car", desc: "4-wheeler, standard" },
                                        { icon: "🏍️", label: "bike", desc: "2-wheeler, solo" },
                                        { icon: "🛺", label: "auto", desc: "3-wheeler, compact" },
                                    ].map(t => (
                                        <button key={t.label} onClick={() => setFormState(f => ({ ...f, vehicleType: t.label }))}
                                            className={`flex flex-col uppercase items-center gap-2 py-4 px-2 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${form.vehicleType === t.label ? "border-teal-400 bg-teal-50 shadow-md" : "border-slate-200 bg-white hover:border-teal-300"}`}>
                                            <span className="text-3xl">{t.icon}</span>
                                            <div className="text-center">
                                                <div className={`text-sm font-bold font-body ${form.vehicleType === t.label ? "text-teal-700" : "text-slate-700"}`}>{t.label}</div>
                                                <div className="text-xs text-slate-400 font-body mt-0.5 leading-tight">{t.desc}</div>
                                            </div>
                                            {form.vehicleType === t.label && (
                                                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">✓</span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── CTA ── */}
                    {isuser || captainStep === 2 ? (
                        <>
                            <p className="text-sm text-center my-2 text-red-500">
                                {responseError && responseError}
                            </p>
                            <ActionBtn loading={loading}
                                onClick={handleSubmit}
                                bg={btnBg} shadow={btnShadow}
                                label={isuser ? "Create user Account →" : "Submit Application →"}
                                loadingLabel="Creating account…"
                            />
                        </>
                    ) : (
                        <button onClick={() => setCaptainStep(2)}
                            className="w-full py-3.5 rounded-xl font-bold text-base text-white font-body border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                            style={{ background: btnBg, boxShadow: btnShadow }}>
                            Continue to Vehicle Details →
                        </button>
                    )}

                    <p className="text-center text-xs text-slate-400 font-body leading-relaxed -mt-1">
                        By signing up you agree to Swift&apos;s{" "}
                        <span className="cursor-pointer hover:underline" style={{ color: isuser ? "#1a56ff" : "#00c4a7" }}>Terms</span>{" & "}
                        <span className="cursor-pointer hover:underline" style={{ color: isuser ? "#1a56ff" : "#00c4a7" }}>Privacy Policy</span>
                    </p>
                    <p className="text-center text-xs text-slate-500 font-body">
                        Already have an account?{" "}
                        <button onClick={() => { setAuthMode("login"); setCaptainStep(1); }}
                            className="font-semibold border-none bg-transparent cursor-pointer font-body"
                            style={{ color: isuser ? "#1a56ff" : "#00c4a7" }}>
                            Sign in
                        </button>
                    </p>
                </>
            )}
        </div>
    );
}

/* ── Tiny shared helpers ──────────────────────────────────────────────────── */
function ActionBtn({ loading, onClick, bg, shadow, label, loadingLabel, disabled = false }) {
    return (
        <button onClick={onClick} disabled={loading || disabled}
            className={`w-full py-3.5 rounded-xl font-bold text-base text-white font-body border-none transition-all duration-200 flex items-center justify-center gap-2 ${loading || disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5"}`}
            style={{ background: bg, boxShadow: shadow }}>
            {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full inline-block" style={{ animation: "spin 1s linear infinite" }} />{loadingLabel}</>
                : label}
        </button>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-body px-1">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
        </div>
    );
}

/* ══ Main LoginPage ══════════════════════════════════════════════════════════ */
function LoginPage({ onNavigate }) {
    const [role, setRole] = useState("user");    // "user" | "captain"
    const [authMode, setAuthMode] = useState("login");    // "login" | "signup" | "forgot"
    const isuser = role === "user";
    const switchRole = (r) => { setRole(r); setAuthMode("login"); };

    return (
        <>
            <style>{LOGIN_PAGE_CSS}</style>

            {/* ── Full-page wrapper ── */}
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col pt-16">

                {/* ── Page header ── */}
                <div className="text-center pt-10 pb-6 px-4">
                    <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-1.5 mb-4 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 anim-pulseDot" />
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-600 font-body">Swift Account</span>
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-2">
                        Sign in to your<br />
                        <em className="not-italic" style={{ color: isuser ? "#1a56ff" : "#00c4a7" }}>
                            {isuser ? "user" : "captain"} account
                        </em>
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base font-body max-w-md mx-auto leading-relaxed">
                        {isuser
                            ? "Book, track, and pay for rides across 180+ cities — all in one place."
                            : "Manage your trips, track earnings, and access captain-only tools."}
                    </p>
                </div>

                {/* ── Role toggle — pill switcher ── */}
                <div className="flex justify-center px-4 mb-8">
                    <div className="relative bg-white rounded-2xl shadow-md p-1.5 flex gap-1 border border-slate-200 w-full max-w-xs sm:max-w-sm">
                        {/* Sliding background pill */}
                        <div className="tab-pill absolute top-1.5 bottom-1.5 rounded-xl shadow-md pointer-events-none"
                            style={{
                                width: "calc(50% - 6px)",
                                left: 6,
                                background: isuser ? "linear-gradient(135deg,#1a56ff,#0f3fd4)" : "linear-gradient(135deg,#00c4a7,#00a38d)",
                                transform: isuser ? "translateX(0)" : "translateX(calc(100% + 3px))",
                            }} />
                        {[["🚗  User", "user"], ["🧢  Captain", "captain"]].map(([label, val]) => (
                            <button key={val} onClick={() => switchRole(val)}
                                className={`relative z-10 flex-1 py-3 text-sm font-bold font-body rounded-xl border-none cursor-pointer transition-colors duration-200 ${role === val ? "text-white" : "text-slate-500 hover:text-slate-700 bg-transparent"}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Main card ── */}
                <div className="flex-1 flex items-start justify-center px-4 pb-16">
                    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-blue-100/60 overflow-hidden flex flex-col lg:flex-row border border-blue-50">

                        {/* Brand panel */}
                        <BrandPanel isuser={isuser} />

                        {/* Form panel */}
                        <div className="flex-1 p-6 sm:p-10 flex flex-col">

                            {/* Auth mode tabs */}
                            {!authMode.includes("forgot") && (
                                <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-7">
                                    {[["Sign In", "login"], ["Create Account", "signup"]].map(([label, mode]) => (
                                        <button key={mode} onClick={() => setAuthMode(mode)}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-body border-none cursor-pointer transition-all duration-200 ${authMode === mode ? "bg-white text-slate-900 shadow-md" : "bg-transparent text-slate-400 hover:text-slate-600"}`}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Form heading */}
                            <div className="mb-6">
                                <h2 className="font-display text-2xl font-bold text-slate-900">
                                    {authMode === "login" ? (isuser ? "Welcome back 👋" : "Good to see you 🧢")
                                        : authMode === "signup" ? (isuser ? "Join Swift as a User" : "Become a Swift Captain")
                                            : "Reset your password"}
                                </h2>
                                <p className="text-sm text-slate-500 font-body mt-1">
                                    {authMode === "login" ? `Sign in to your Swift ${isuser ? "user" : "captain"} account`
                                        : authMode === "signup" ? (isuser ? "Get your first ride in under 2 minutes" : "Apply in 2 minutes — start earning this week")
                                            : "We'll email you a secure reset link"}
                                </p>
                            </div>

                            {/* The form */}
                            <LoginForm
                                key={`${role}-${authMode}`}
                                role={role}
                                authMode={authMode}
                                setAuthMode={setAuthMode}
                                onNavigate={onNavigate}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Bottom trust strip ── */}
                <div className="border-t border-slate-200/60 bg-white/60 backdrop-blur-sm py-5 px-4">
                    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-10">
                        {[["🔒", "256-bit SSL encryption"], ["🛡️", "GDPR & SOC 2 compliant"], ["🌍", "Used in 180+ cities"], ["⭐", "4.9★ rated app"]].map(([ic, t]) => (
                            <div key={t} className="flex items-center gap-2 text-xs text-slate-500 font-body font-medium">
                                <span>{ic}</span><span>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════════════ */
export default function SwiftApp() {
    const [page, setPage] = useState("home");
    useEffect(() => { injectFonts(); }, []);
    // Scroll to top on every page change
    useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
    const token = localStorage.getItem("token");

    const navigate = (p) => setPage(p);

    useEffect(() => {
        if (token) {
            navigate("login")
        }
    }, [])
    const pages = {
        home: <HomePage onNavigate={navigate} />,
        features: <FeaturesPage onNavigate={navigate} />,
        "how-it-works": <HowItWorksPage onNavigate={navigate} />,
        cities: <CitiesPage onNavigate={navigate} />,
        pricing: <PricingPage onNavigate={navigate} />,
        safety: <SafetyPage onNavigate={navigate} />,
        login: <LoginPage onNavigate={navigate} />,
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