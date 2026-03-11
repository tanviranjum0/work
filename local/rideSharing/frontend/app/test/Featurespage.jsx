import { useState } from "react";
import { Btn, Badge, SectionHead, CTASection, Footer, RIDE_TYPES, TESTIMONIALS } from "./SwiftShared";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const FEATURE_CATEGORIES = [
    {
        id: "convenience",
        label: "Convenience",
        icon: "⚡",
        color: "blue",
        accent: "#1a56ff",
        headline: "Built for speed, designed for your life",
        sub: "Every interaction in Swift is optimised to save you time — from booking to drop-off.",
        features: [
            { icon: "📅", title: "Schedule Rides", desc: "Book up to 7 days in advance. Set it, forget it — your driver will be there exactly when you need them.", stat: "7 days ahead" },
            { icon: "🔄", title: "Multi-Stop Trips", desc: "Add multiple stops in one booking. Perfect for school runs, errand days, or picking up friends on the way.", stat: "Up to 5 stops" },
            { icon: "👥", title: "Shared Rides", desc: "Split your fare with friends heading the same way. Save up to 40% on your usual routes with smart ride-pooling.", stat: "Save 40%" },
            { icon: "❤️", title: "Favourite Drivers", desc: "Request your favourite driver every time. Build a trusted relationship with someone you know and love.", stat: "1-tap rebooking" },
            { icon: "💳", title: "In-App Wallet", desc: "Top up your Swift Wallet and pay instantly with no card friction. Set auto-top-up so you're never out of balance.", stat: "Instant payments" },
            { icon: "🔔", title: "Smart Notifications", desc: "Real-time push alerts for driver arrival, route updates, and trip completion — all beautifully timed, never spammy.", stat: "Zero lag alerts" },
        ],
    },
    {
        id: "safety",
        label: "Safety",
        icon: "🛡️",
        color: "teal",
        accent: "#00c4a7",
        headline: "Your safety is non-negotiable",
        sub: "We engineered a multi-layered safety system so you can ride with total confidence, day or night.",
        features: [
            { icon: "🆘", title: "One-Tap SOS", desc: "Press once to alert emergency services and share your exact GPS location with trusted contacts instantly.", stat: "< 1 sec response" },
            { icon: "📡", title: "Live Trip Sharing", desc: "Share your trip progress with anyone in real-time — they don't even need the app to track you.", stat: "Real-time updates" },
            { icon: "🔍", title: "Verified Drivers", desc: "Every driver passes criminal background checks, driving history review, and identity verification before their first ride.", stat: "100% verified" },
            { icon: "📸", title: "Driver Photo ID", desc: "Confirm your driver matches their photo ID before getting in. No match? Report instantly and we'll act immediately.", stat: "Always visible" },
            { icon: "⭐", title: "Two-Way Ratings", desc: "Both riders and drivers are rated after every trip. Low-rated drivers are reviewed and suspended immediately.", stat: "Post-trip review" },
            { icon: "🎙️", title: "Audio Recording", desc: "Optional in-trip audio recording is stored encrypted for 7 days. Only accessible if a safety incident is reported.", stat: "Encrypted & secure" },
        ],
    },
    {
        id: "eco",
        label: "Eco",
        icon: "🌿",
        color: "green",
        accent: "#22c55e",
        headline: "Ride smarter, live greener",
        sub: "Swift is committed to reducing urban carbon emissions through technology and incentives.",
        features: [
            { icon: "🌱", title: "Green Ride Filter", desc: "Filter for electric or hybrid vehicles only. See the exact CO₂ savings for each trip before you book.", stat: "Up to 0kg CO₂" },
            { icon: "🌳", title: "Tree Planting", desc: "We plant one tree for every 10 Eco rides completed — automatically, on your behalf, with no extra cost.", stat: "1 tree / 10 rides" },
            { icon: "📊", title: "Carbon Dashboard", desc: "Track your personal carbon footprint reduction over time. Share your impact on social media and earn badges.", stat: "Monthly report" },
            { icon: "🔋", title: "EV Fleet Priority", desc: "Our driver incentive programme accelerates EV adoption. 40% of our fleet will be electric by end of 2025.", stat: "40% EV target" },
            { icon: "♻️", title: "Offset Credits", desc: "Purchase carbon offset credits directly in-app to neutralise rides you can't make green.", stat: "Verified offsets" },
            { icon: "🏅", title: "Eco Rewards", desc: "Earn bonus Swift Points for every green ride. Redeem for discounts, merchandise, or charity donations.", stat: "2x points earned" },
        ],
    },
    {
        id: "business",
        label: "Business",
        icon: "💼",
        color: "purple",
        accent: "#9333ea",
        headline: "Your team moves, your business grows",
        sub: "Centralised billing, policy controls, and real-time reporting — Swift for Business is the enterprise-grade solution.",
        features: [
            { icon: "🏢", title: "Centralised Billing", desc: "One monthly invoice for your entire organisation. No more chasing receipts or reimbursing employees individually.", stat: "Single invoice" },
            { icon: "📋", title: "Expense Integration", desc: "Auto-sync with Expensify, Concur, QuickBooks, and Xero. Categorise rides by project, client, or department.", stat: "10+ integrations" },
            { icon: "🔐", title: "Travel Policies", desc: "Set ride type restrictions, spending limits, and approved hours by employee role or department.", stat: "Granular control" },
            { icon: "📈", title: "Usage Analytics", desc: "Real-time dashboard with ride volume, spend by team, CO₂ impact, and peak usage patterns.", stat: "Live dashboard" },
            { icon: "🆔", title: "Employee Profiles", desc: "Manage your entire team from one admin panel. Add, remove, and set permissions in seconds.", stat: "Unlimited seats" },
            { icon: "🤝", title: "Dedicated Account Manager", desc: "Every Business account over 50 employees gets a dedicated Swift account manager for onboarding and support.", stat: "Personal support" },
        ],
    },
];

const APP_COMPARISON = [
    { feature: "Transparent upfront pricing", swift: true, uber: true, lyft: false },
    { feature: "No surge pricing cap", swift: true, uber: false, lyft: false },
    { feature: "Scheduled rides (7-day)", swift: true, uber: true, lyft: true },
    { feature: "Multi-stop trips", swift: true, uber: true, lyft: false },
    { feature: "Eco/EV ride filter", swift: true, uber: true, lyft: false },
    { feature: "In-trip audio safety option", swift: true, uber: false, lyft: false },
    { feature: "Driver favourites", swift: true, uber: false, lyft: false },
    { feature: "Carbon dashboard", swift: true, uber: false, lyft: false },
    { feature: "Corporate central billing", swift: true, uber: true, lyft: true },
    { feature: "24/7 live safety support", swift: true, uber: false, lyft: false },
];

/* ─── Components ──────────────────────────────────────────────────────────── */
function PageHero({ onNavigate }) {
    return (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white pt-16">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.04) 1px,transparent 1px)", backgroundSize: "72px 72px" }} />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-8 blur-3xl pointer-events-none" />
            <div className="absolute top-10 right-0 w-72 h-72 bg-teal-400 rounded-full opacity-8 blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
                <div className="fade-up mb-4"><Badge color="blue">Everything You Need</Badge></div>
                <h1 className="fade-up1 font-display font-bold leading-tight tracking-tight text-slate-900 text-4xl sm:text-5xl lg:text-7xl mb-5">
                    Features built for<br /><em className="text-blue-600 not-italic">real riders.</em>
                </h1>
                <p className="fade-up2 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8 font-body">
                    From solo commuters to corporate teams, Swift packs every feature you need into one beautifully simple app. Here's what makes us different.
                </p>
                <div className="fade-up3 flex flex-wrap justify-center gap-3">
                    <Btn variant="primary" onClick={() => onNavigate("home")}>Book a Ride Now →</Btn>
                    <Btn variant="ghost">View Pricing</Btn>
                </div>

                {/* Quick stats */}
                <div className="fade-up4 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
                    {[["50+", "App Features"], ["4.9★", "App Rating"], ["10s", "To Book"], ["2.4M+", "Monthly Riders"]].map(([v, l]) => (
                        <div key={l} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-50 shadow-sm">
                            <div className="font-display text-2xl font-bold text-slate-900">{v}</div>
                            <div className="text-xs text-slate-400 font-body mt-0.5">{l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoryTabs({ active, setActive }) {
    return (
        <div className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                    {FEATURE_CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setActive(cat.id)}
                            className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold font-body whitespace-nowrap border-none cursor-pointer transition-all duration-200 border-b-2 ${active === cat.id ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-800 bg-transparent"}`}>
                            <span>{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeatureGrid({ category }) {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-12 anim-fadeIn">
                    <Badge color={category.color}>{category.label} Features</Badge>
                    <h2 className="font-display font-bold text-slate-900 text-3xl sm:text-4xl mt-3 mb-3 leading-tight">{category.headline}</h2>
                    <p className="text-slate-500 text-base font-body max-w-xl leading-relaxed">{category.sub}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 anim-scaleIn">
                    {category.features.map((f, i) => (
                        <div key={i} className="lift group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-100 transition-all duration-250">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border" style={{ background: `${category.accent}15`, borderColor: `${category.accent}25` }}>{f.icon}</div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full font-body" style={{ background: `${category.accent}12`, color: category.accent }}>{f.stat}</span>
                            </div>
                            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-body">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ComparisonTable() {
    return (
        <section className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <SectionHead badge="How We Compare" title="Swift vs the" highlight="competition" sub="See why millions of riders switched to Swift and never looked back." center />

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                    {/* Header */}
                    <div className="grid grid-cols-4 bg-slate-900 text-white">
                        <div className="col-span-1 p-4 text-sm font-semibold font-body text-white/60">Feature</div>
                        {[["Swift", "text-blue-400"], ["Uber", "text-white/70"], ["Lyft", "text-white/70"]].map(([n, c]) => (
                            <div key={n} className={`p-4 text-center text-sm font-bold font-body ${c}`}>{n}</div>
                        ))}
                    </div>
                    {APP_COMPARISON.map((row, i) => (
                        <div key={i} className={`grid grid-cols-4 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                            <div className="col-span-1 p-3 sm:p-4 text-xs sm:text-sm text-slate-600 font-body flex items-center">{row.feature}</div>
                            {[row.swift, row.uber, row.lyft].map((val, j) => (
                                <div key={j} className="p-3 sm:p-4 flex items-center justify-center">
                                    {val
                                        ? <span className="text-teal-500 text-base sm:text-lg font-bold">✓</span>
                                        : <span className="text-slate-300 text-base sm:text-lg">✕</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MiniTestimonials() {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Rider Stories" title="Features that make a" highlight="difference" center />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="lift bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-5 font-body italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: t.gradient }}>{t.avatar}</div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 font-body">{t.name}</div>
                                    <div className="text-xs text-slate-400 font-body">{t.role} · {t.city}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Page Export ─────────────────────────────────────────────────────────── */
export default function FeaturesPage({ onNavigate }) {
    const [activeCategory, setActiveCategory] = useState("convenience");
    const category = FEATURE_CATEGORIES.find(c => c.id === activeCategory);

    return (
        <div className="font-body">
            <PageHero onNavigate={onNavigate} />
            <CategoryTabs active={activeCategory} setActive={setActiveCategory} />
            <FeatureGrid key={activeCategory} category={category} />
            <ComparisonTable />
            <MiniTestimonials />
            <CTASection onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </div>
    );
}