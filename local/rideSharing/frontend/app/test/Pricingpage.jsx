import { useState } from "react";
import { Btn, Badge, SectionHead, CTASection, Footer, RIDE_TYPES } from "./SwiftShared";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const MEMBERSHIP_PLANS = [
    {
        id: "free",
        name: "Swift Free",
        price: "$0",
        period: "/mo",
        badge: null,
        accent: "#64748b",
        bg: "bg-white",
        border: "border-slate-200",
        desc: "Everything you need for occasional rides with no commitment.",
        features: [
            { text: "Book Standard, Express, XL & Premium rides", included: true },
            { text: "Real-time GPS driver tracking", included: true },
            { text: "In-app messaging with driver", included: true },
            { text: "Digital receipts & trip history", included: true },
            { text: "5% discount on rides", included: false },
            { text: "Priority driver matching", included: false },
            { text: "Free cancellation window (5 min)", included: false },
            { text: "Monthly ride analytics report", included: false },
        ],
    },
    {
        id: "plus",
        name: "Swift Plus",
        price: "$9.99",
        period: "/mo",
        badge: "Most Popular",
        accent: "#1a56ff",
        bg: "bg-blue-600",
        border: "border-blue-600",
        desc: "For frequent riders who want savings and priority service every day.",
        features: [
            { text: "Book Standard, Express, XL & Premium rides", included: true },
            { text: "Real-time GPS driver tracking", included: true },
            { text: "In-app messaging with driver", included: true },
            { text: "Digital receipts & trip history", included: true },
            { text: "10% discount on all rides", included: true },
            { text: "Priority driver matching", included: true },
            { text: "Free cancellation window (5 min)", included: true },
            { text: "Monthly ride analytics report", included: true },
        ],
    },
    {
        id: "pro",
        name: "Swift Pro",
        price: "$24.99",
        period: "/mo",
        badge: "Best Value",
        accent: "#9333ea",
        bg: "bg-white",
        border: "border-purple-200",
        desc: "Unlimited rides with maximum discounts — built for daily power users.",
        features: [
            { text: "Book Standard, Express, XL & Premium rides", included: true },
            { text: "Real-time GPS driver tracking", included: true },
            { text: "In-app messaging with driver", included: true },
            { text: "Digital receipts & trip history", included: true },
            { text: "20% discount on all rides", included: true },
            { text: "Top-priority driver matching", included: true },
            { text: "Free cancellation window (10 min)", included: true },
            { text: "Weekly analytics + spend reports", included: true },
        ],
    },
];

const FAQS_PRICING = [
    { q: "How is the per-ride price calculated?", a: "Swift calculates fares based on base fare + (per-minute rate × trip time) + (per-mile rate × distance) + any applicable tolls or airport surcharges. The full price is shown upfront — you'll never pay more than what's displayed before you confirm." },
    { q: "Is there a cancellation fee?", a: "You can cancel for free within 2 minutes of booking or before your driver starts heading to you. After that, a $2–5 cancellation fee applies to compensate the driver for their time and fuel." },
    { q: "Does Swift have surge pricing?", a: "Swift uses a soft cap on pricing — prices may vary with demand, but we limit increases to a maximum of 2x the base fare. You'll always see the exact total before confirming, and Plus/Pro members get priority access during high-demand periods." },
    { q: "Can I get a refund on a bad ride?", a: "Yes. Open Your Trips, select the ride, and tap 'Report an Issue'. Legitimate complaints — wrong route, safety concern, unprofessional driver — receive a full or partial refund within 24 hours." },
    { q: "How does Swift Plus/Pro save me money?", a: "On average, a daily commuter spending $15/ride takes ~22 rides/month ($330). Swift Plus saves 10% ($33/mo) — that's a net $23 savings after the $9.99 fee. Pro saves 20% ($66/mo) — net $41 savings after the $24.99 fee." },
    { q: "Is there a corporate/business pricing plan?", a: "Yes. Swift for Business starts at $49/month per admin seat and offers centralised billing, travel policies, integrations with Expensify and Concur, and volume discounts for teams of 10+. Contact our sales team for a custom quote." },
];

/* ─── Components ──────────────────────────────────────────────────────────── */
function PageHero({ onNavigate }) {
    return (
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-white pt-16">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(147,51,234,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(147,51,234,.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="absolute -top-20 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-10 blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center w-full relative">
                <div className="fade-up mb-4"><Badge color="purple">Transparent Pricing</Badge></div>
                <h1 className="fade-up1 font-display font-bold leading-tight tracking-tight text-slate-900 text-4xl sm:text-5xl lg:text-7xl mb-5">
                    No surprises.<br /><em className="text-blue-600 not-italic">Ever.</em>
                </h1>
                <p className="fade-up2 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8 font-body">
                    See the full price before you book. Pick the membership that matches how often you ride. Save more the more you use Swift.
                </p>
                <div className="fade-up3 flex flex-wrap justify-center gap-4">
                    {[["🚫", "No hidden fees"], ["🔒", "Upfront pricing always"], ["💰", "Surge capped at 2×"], ["✅", "Cancel free (2 min)"]].map(([ic, t]) => (
                        <div key={t} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-100 shadow-sm">
                            <span>{ic}</span><span className="text-sm font-semibold text-slate-700 font-body">{t}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function RidePricing() {
    const [activeRide, setActiveRide] = useState("express");
    const sel = RIDE_TYPES.find(r => r.id === activeRide);
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Per-Ride Pricing" title="Pay only for" highlight="what you ride" sub="All fares are calculated upfront. Select a ride type to see full pricing breakdown." center />

                {/* Ride type selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {RIDE_TYPES.map(r => (
                        <button key={r.id} onClick={() => setActiveRide(r.id)}
                            className={`relative rounded-2xl p-4 sm:p-5 border-2 cursor-pointer text-left transition-all duration-200 font-body ${activeRide === r.id ? "shadow-lg" : "bg-white border-slate-100 hover:border-slate-200"}`}
                            style={activeRide === r.id ? { background: r.accent, borderColor: r.accent } : {}}>
                            {r.badge && <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">{r.badge}</div>}
                            <div className="text-2xl mb-2">{r.icon}</div>
                            <div className={`font-display font-bold text-lg mb-0.5 ${activeRide === r.id ? "text-white" : "text-slate-900"}`}>{r.name}</div>
                            <div className={`font-bold text-base font-body ${activeRide === r.id ? "text-white/90" : "text-slate-800"}`}>{r.price}</div>
                            <div className={`text-xs font-body mt-1 ${activeRide === r.id ? "text-white/65" : "text-slate-400"}`}>ETA {r.eta}</div>
                        </button>
                    ))}
                </div>

                {/* Fare breakdown */}
                {sel && (
                    <div className="anim-scaleIn bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="text-4xl">{sel.icon}</div>
                                <div>
                                    <h3 className="font-display text-2xl font-bold text-slate-900">{sel.name}</h3>
                                    <p className="text-sm text-slate-500 font-body">{sel.desc}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {[
                                    ["Base fare", sel.id === "standard" ? "$2.50" : sel.id === "express" ? "$3.50" : sel.id === "xl" ? "$4.00" : "$6.00"],
                                    ["Per mile rate", sel.id === "standard" ? "$0.90" : sel.id === "express" ? "$1.20" : sel.id === "xl" ? "$1.40" : "$2.00"],
                                    ["Per minute rate", sel.id === "standard" ? "$0.18" : sel.id === "express" ? "$0.25" : sel.id === "xl" ? "$0.28" : "$0.40"],
                                    ["Booking fee", "$1.50"],
                                    ["Minimum fare", sel.id === "standard" ? "$5.00" : sel.id === "express" ? "$7.00" : sel.id === "xl" ? "$9.00" : "$14.00"],
                                    ["Max surge multiplier", "2.0×"],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between items-center bg-white rounded-xl px-4 py-3 border border-slate-100">
                                        <span className="text-sm text-slate-500 font-body">{label}</span>
                                        <span className="text-sm font-bold text-slate-900 font-body">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="font-display text-lg font-bold text-slate-900 mb-4">Example Trip: Airport (12 miles, 25 min)</div>
                            <div className="bg-white rounded-2xl p-5 border border-slate-100">
                                {[
                                    ["Base fare", sel.id === "standard" ? "$2.50" : sel.id === "express" ? "$3.50" : sel.id === "xl" ? "$4.00" : "$6.00"],
                                    ["Distance (12 mi)", sel.id === "standard" ? "$10.80" : sel.id === "express" ? "$14.40" : sel.id === "xl" ? "$16.80" : "$24.00"],
                                    ["Time (25 min)", sel.id === "standard" ? "$4.50" : sel.id === "express" ? "$6.25" : sel.id === "xl" ? "$7.00" : "$10.00"],
                                    ["Booking fee", "$1.50"],
                                ].map(([l, v]) => (
                                    <div key={l} className="flex justify-between py-2 border-b border-slate-50 last:border-0">
                                        <span className="text-sm text-slate-500 font-body">{l}</span>
                                        <span className="text-sm font-semibold text-slate-800 font-body">{v}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-3 mt-1 border-t border-slate-200">
                                    <span className="font-bold text-slate-900 font-body">Total Fare</span>
                                    <span className="font-display text-xl font-bold text-blue-600">
                                        {sel.id === "standard" ? "$19.30" : sel.id === "express" ? "$25.65" : sel.id === "xl" ? "$29.30" : "$41.50"}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-body mt-2">* This is an estimate. Final fare shown before confirmation.</p>
                            </div>
                            <div className="mt-4 bg-teal-50 rounded-xl px-4 py-3 border border-teal-100">
                                <p className="text-sm text-teal-700 font-body font-semibold">✓ Capacity: {sel.capacity}</p>
                                <p className="text-xs text-teal-600 font-body mt-0.5">Free cancellation within 2 minutes of booking</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function MembershipPlans() {
    const [billing, setBilling] = useState("monthly");
    return (
        <section className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Membership Plans" title="Ride more," highlight="save more" sub="Our membership plans unlock discounts, priority matching, and exclusive perks for regular riders." center />

                {/* Billing toggle */}
                <div className="flex justify-center mb-10">
                    <div className="bg-slate-200 rounded-full p-1 flex gap-1">
                        {["monthly", "annual"].map(b => (
                            <button key={b} onClick={() => setBilling(b)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold font-body cursor-pointer transition-all duration-200 border-none ${billing === b ? "bg-white text-slate-900 shadow-md" : "bg-transparent text-slate-500"}`}>
                                {b === "monthly" ? "Monthly" : "Annual (save 20%)"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-start">
                    {MEMBERSHIP_PLANS.map((plan, i) => {
                        const isPopular = plan.id === "plus";
                        const price = billing === "annual" ? (plan.id === "plus" ? "$7.99" : plan.id === "pro" ? "$19.99" : "$0") : plan.price;
                        return (
                            <div key={plan.id} className={`rounded-3xl overflow-hidden border-2 relative ${plan.border} ${isPopular ? "shadow-2xl shadow-blue-200 scale-105" : "shadow-sm"}`}>
                                {plan.badge && (
                                    <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full font-body"
                                        style={{ background: isPopular ? "rgba(255,255,255,0.25)" : "#9333ea20", color: isPopular ? "white" : "#9333ea" }}>
                                        {plan.badge}
                                    </div>
                                )}

                                {/* Header */}
                                <div className={`p-6 sm:p-7 ${isPopular ? "bg-blue-600 text-white" : "bg-white text-slate-900"}`}>
                                    <div className={`text-sm font-bold uppercase tracking-widest mb-2 font-body ${isPopular ? "text-blue-200" : "text-slate-400"}`}>{plan.name}</div>
                                    <div className="flex items-end gap-1 mb-3">
                                        <span className={`font-display text-4xl sm:text-5xl font-bold`}>{price}</span>
                                        <span className={`text-sm mb-2 font-body ${isPopular ? "text-blue-200" : "text-slate-400"}`}>{plan.period}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed font-body ${isPopular ? "text-blue-100" : "text-slate-500"}`}>{plan.desc}</p>
                                    <Btn variant={isPopular ? "white" : "primary"} full cls="mt-5">
                                        {plan.id === "free" ? "Get Started Free" : `Get ${plan.name} →`}
                                    </Btn>
                                </div>

                                {/* Features */}
                                <div className="bg-white p-6">
                                    <div className="flex flex-col gap-3">
                                        {plan.features.map((f, j) => (
                                            <div key={j} className={`flex items-start gap-2.5 ${f.included ? "" : "opacity-40"}`}>
                                                <span className={`text-sm mt-0.5 shrink-0 font-bold ${f.included ? "text-teal-500" : "text-slate-300"}`}>{f.included ? "✓" : "✕"}</span>
                                                <span className="text-sm text-slate-600 font-body">{f.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function CorporatePricing({ onNavigate }) {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <Badge color="purple">Swift for Business</Badge>
                        <h2 className="font-display font-bold text-slate-900 text-3xl sm:text-4xl mt-3 mb-4 leading-tight">
                            Enterprise pricing for<br /><em className="text-blue-600 not-italic">teams that move fast.</em>
                        </h2>
                        <p className="text-slate-500 font-body text-base leading-relaxed mb-6">Custom pricing for organisations with 5+ regular riders. Centralised billing, policy controls, and a dedicated account manager from day one.</p>
                        <div className="flex flex-col gap-3 mb-8">
                            {[
                                ["💳", "Single monthly invoice for all rides"],
                                ["📊", "Real-time spend analytics dashboard"],
                                ["🔐", "Travel policy & spending limits per employee"],
                                ["📋", "Integrations with Expensify, Concur, SAP, Xero"],
                                ["🤝", "Dedicated account manager (10+ users)"],
                                ["📈", "Volume discounts from 20–40% for large teams"],
                            ].map(([ic, t]) => (
                                <div key={t} className="flex items-center gap-3">
                                    <span className="text-xl">{ic}</span>
                                    <span className="text-sm text-slate-600 font-body">{t}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Btn variant="primary">Contact Sales →</Btn>
                            <Btn variant="ghost">View Business Demo</Btn>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 sm:p-9 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
                        <div className="relative">
                            <div className="font-display text-xl font-bold text-white mb-6">Business Plans</div>
                            {[
                                { name: "Starter", seats: "Up to 10 users", price: "$49", period: "/mo", perks: ["Centralised billing", "Basic analytics", "Email support"] },
                                { name: "Growth", seats: "Up to 50 users", price: "$149", period: "/mo", perks: ["All Starter features", "Policy controls", "Priority support"] },
                                { name: "Enterprise", seats: "Unlimited users", price: "Custom", period: "", perks: ["All Growth features", "Account manager", "Volume discounts"] },
                            ].map((plan, i) => (
                                <div key={i} className={`rounded-2xl p-4 mb-3 last:mb-0 border ${i === 1 ? "bg-blue-600 border-blue-400" : "bg-white/5 border-white/8"}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-bold font-body text-sm ${i === 1 ? "text-white" : "text-white/80"}`}>{plan.name}</span>
                                        <span className={`font-display text-lg font-bold ${i === 1 ? "text-white" : "text-white"}`}>{plan.price}<span className={`text-xs font-body ${i === 1 ? "text-blue-200" : "text-white/40"}`}>{plan.period}</span></span>
                                    </div>
                                    <div className={`text-xs mb-2 font-body ${i === 1 ? "text-blue-200" : "text-white/45"}`}>{plan.seats}</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {plan.perks.map(p => (
                                            <span key={p} className={`text-xs px-2 py-0.5 rounded-full font-body ${i === 1 ? "bg-white/20 text-white" : "bg-white/8 text-white/55"}`}>{p}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PricingFAQ() {
    const [open, setOpen] = useState(null);
    return (
        <section className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Pricing FAQ" title="Questions about" highlight="pricing?" center />
                <div className="flex flex-col gap-3">
                    {FAQS_PRICING.map((faq, i) => (
                        <div key={i} className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${open === i ? "border-blue-200 shadow-md" : "border-slate-100"}`}>
                            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer border-none bg-transparent">
                                <span className={`font-semibold text-sm sm:text-base font-body ${open === i ? "text-blue-600" : "text-slate-800"}`}>{faq.q}</span>
                                <span className={`text-xl font-bold shrink-0 ml-3 transition-transform duration-300 ${open === i ? "rotate-45 text-blue-500" : "text-slate-400"}`}>+</span>
                            </button>
                            <div className={`accordion-content ${open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="px-5 pb-4 text-sm text-slate-500 font-body leading-relaxed">{faq.a}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Page Export ─────────────────────────────────────────────────────────── */
export default function PricingPage({ onNavigate }) {
    return (
        <div className="font-body">
            <PageHero onNavigate={onNavigate} />
            <RidePricing />
            <MembershipPlans />
            <CorporatePricing onNavigate={onNavigate} />
            <PricingFAQ />
            <CTASection onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </div>
    );
}