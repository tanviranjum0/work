import { useState, useMemo } from "react";
import { Btn, Badge, SectionHead, CTASection, Footer, ALL_CITIES } from "./SwiftShared";

const REGIONS = ["All", "Northeast", "West", "South", "Midwest", "International"];

const CITY_HIGHLIGHTS = [
    { city: "New York", tagline: "Our biggest market", desc: "180+ pickup zones, dedicated airport lanes at JFK, LGA & EWR, and an average 2-min pickup in Manhattan.", stat: "2 min avg pickup", icon: "🗽", gradient: "linear-gradient(135deg,#667eea,#764ba2)" },
    { city: "Los Angeles", tagline: "Where it all began", desc: "From Venice Beach to Hollywood Hills — Swift covers all 88 LA cities with surge-free pricing, even on event nights.", stat: "88 cities covered", icon: "🌴", gradient: "linear-gradient(135deg,#f093fb,#f5576c)" },
    { city: "San Francisco", tagline: "Tech capital rides", desc: "Sub-5-minute pickups in SoMa, SOMA, and the Financial District. Dedicated airport service to SFO and OAK.", stat: "4 min avg pickup", icon: "🌉", gradient: "linear-gradient(135deg,#4facfe,#00f2fe)" },
];

const COMING_SOON = [
    { name: "Toronto", timeline: "Q2 2025", flag: "🇨🇦" },
    { name: "London", timeline: "Q3 2025", flag: "🇬🇧" },
    { name: "Dubai", timeline: "Q4 2025", flag: "🇦🇪" },
    { name: "Sydney", timeline: "Q1 2026", flag: "🇦🇺" },
    { name: "Singapore", timeline: "Q2 2026", flag: "🇸🇬" },
    { name: "Paris", timeline: "Q3 2026", flag: "🇫🇷" },
];

/* ─── Components ──────────────────────────────────────────────────────────── */
function PageHero({ onNavigate }) {
    return (
        <section className="relative min-h-[55vh] flex items-center overflow-hidden pt-16" style={{ background: "linear-gradient(135deg,#0b0f1a,#0f1e3d)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.06) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle,#1a56ff,transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle,#00c4a7,transparent 70%)" }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full text-center relative">
                <div className="fade-up mb-4"><Badge color="teal">Coverage</Badge></div>
                <h1 className="fade-up1 font-display font-bold leading-tight tracking-tight text-white text-4xl sm:text-5xl lg:text-7xl mb-5">
                    180+ cities,<br /><em className="text-blue-400 not-italic">one app.</em>
                </h1>
                <p className="fade-up2 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 font-body">
                    Swift is live across 180 US cities and expanding globally. Find your city below, or request we launch in yours.
                </p>

                {/* Quick coverage numbers */}
                <div className="fade-up3 grid grid-cols-3 gap-4 max-w-xl mx-auto">
                    {[["180+", "Cities Live"], ["46", "US States"], ["6", "Countries by 2026"]].map(([v, l]) => (
                        <div key={l} className="bg-white/6 backdrop-blur-sm rounded-2xl p-4 border border-white/8">
                            <div className="font-display text-2xl sm:text-3xl font-bold text-white">{v}</div>
                            <div className="text-xs text-white/45 font-body mt-1">{l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CityHighlights({ onNavigate }) {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Featured Cities" title="Our biggest" highlight="markets" sub="These cities set the standard for what Swift can do — reliable, fast, and always improving." />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {CITY_HIGHLIGHTS.map((c, i) => (
                        <div key={i} className="lift rounded-3xl overflow-hidden border border-slate-100">
                            {/* Card header */}
                            <div className="h-32 flex items-center justify-center text-6xl relative" style={{ background: c.gradient }}>
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white, transparent 60%)" }} />
                                <span className="relative z-10">{c.icon}</span>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-display text-xl font-bold text-slate-900">{c.city}</h3>
                                    <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full font-body">{c.stat}</span>
                                </div>
                                <div className="text-xs text-blue-500 font-semibold uppercase tracking-wider font-body mb-2">{c.tagline}</div>
                                <p className="text-sm text-slate-500 leading-relaxed font-body mb-4">{c.desc}</p>
                                <Btn variant="ghost" cls="!px-4 !py-2 !text-xs" onClick={() => onNavigate("home")}>Book in {c.city.split(" ")[0]} →</Btn>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CityDirectory({ onNavigate }) {
    const [region, setRegion] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => ALL_CITIES.filter(c => {
        const regionMatch = region === "All" || c.region === region;
        const searchMatch = c.name.toLowerCase().includes(search.toLowerCase());
        const statusMatch = c.status === "live";
        return regionMatch && searchMatch && statusMatch;
    }), [region, search]);

    return (
        <section className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="All Cities" title="Find your" highlight="city" sub="Browse all live cities or search by name. Click any city to book a ride right away." center />

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cities..." className="ride-input w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-body text-slate-800 transition-all duration-200" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {REGIONS.map(r => (
                            <button key={r} onClick={() => setRegion(r)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200 border cursor-pointer ${region === r ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* City grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((city, i) => (
                            <div key={i} className="lift bg-white rounded-2xl p-5 border border-slate-100 cursor-pointer group" onClick={() => onNavigate("home")}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{city.name}</h3>
                                        <span className="text-xs text-slate-400 font-body">{city.region}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[["Rides/mo", city.rides], ["Rating", city.rating + "★"], ["Drivers", city.drivers]].map(([l, v]) => (
                                        <div key={l} className="bg-slate-50 rounded-lg px-2 py-1.5 text-center">
                                            <div className="text-xs font-bold text-slate-800 font-body">{v}</div>
                                            <div className="text-xs text-slate-400 font-body">{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-4xl mb-4">🗺️</div>
                        <div className="font-display text-xl font-bold text-slate-900 mb-2">No cities found</div>
                        <p className="text-slate-500 text-sm font-body">Try a different search term or region filter.</p>
                    </div>
                )}

                <p className="text-center text-sm text-slate-400 font-body mt-6">Showing {filtered.length} active cities</p>
            </div>
        </section>
    );
}

function ComingSoonSection() {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Expansion" title="Coming to your" highlight="city soon" sub="We're expanding globally. Here's where Swift launches next — be the first to ride." center />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {COMING_SOON.map((c, i) => (
                        <div key={i} className="lift bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                            <div className="text-3xl mb-2">{c.flag}</div>
                            <div className="font-display text-base font-bold text-slate-900 mb-1">{c.name}</div>
                            <div className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full font-body inline-block">{c.timeline}</div>
                        </div>
                    ))}
                </div>

                {/* Request a city */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                    <div className="relative">
                        <div className="text-4xl mb-4">📍</div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Don't see your city?</h3>
                        <p className="text-white/55 font-body text-base mb-6 max-w-md mx-auto leading-relaxed">Request Swift in your city. When we hit 500 requests, our expansion team fast-tracks the launch.</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                            <input className="ride-input flex-1 px-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white text-sm font-body placeholder-white/35" placeholder="Your city name..." />
                            <Btn variant="primary">Request It →</Btn>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CityCoverage() {
    return (
        <section className="py-14 bg-blue-600">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Available where you are, when you need it.</div>
                <p className="text-white/70 font-body text-base mb-6 max-w-lg mx-auto">Over 60,000 active drivers ready across the country, 24 hours a day, 365 days a year.</p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                    {[["46", "US States covered"], ["24/7", "Service hours"], ["60K+", "Active drivers"], ["3 min", "Avg wait time"]].map(([v, l]) => (
                        <div key={l} className="text-center">
                            <div className="font-display text-3xl font-bold text-white">{v}</div>
                            <div className="text-sm text-white/60 font-body">{l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Page Export ─────────────────────────────────────────────────────────── */
export default function CitiesPage({ onNavigate }) {
    return (
        <div className="font-body">
            <PageHero onNavigate={onNavigate} />
            <CityHighlights onNavigate={onNavigate} />
            <CityDirectory onNavigate={onNavigate} />
            <ComingSoonSection />
            <CityCoverage />
            <CTASection onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </div>
    );
}