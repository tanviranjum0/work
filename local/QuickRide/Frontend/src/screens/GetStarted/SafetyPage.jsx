/* eslint-disable react/prop-types */
import { useState } from "react";
import { Btn, Badge, SectionHead, CTASection, Footer } from "./SwiftShared";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const SAFETY_PILLARS = [
    { icon: "🔍", title: "Deep Background Checks", accent: "#1a56ff", desc: "Criminal history, sex offender registry, global watchlist screening, motor vehicle records, and identity verification — all completed before a driver takes their first trip. Re-screened every 6 months automatically.", stat: "100% of drivers screened" },
    { icon: "📱", title: "Continuous Trip Monitoring", accent: "#00c4a7", desc: "Every trip is GPS-tracked second by second. Our AI system detects route deviations, unexpected stops, sudden acceleration, and hard braking. Any anomaly triggers an automatic alert to our 24/7 safety operations team.", stat: "24/7 AI monitoring" },
    { icon: "🆘", title: "One-Tap SOS", accent: "#ef4444", desc: "One tap on the SOS button sends your exact GPS coordinates to local emergency services, alerts three of your trusted emergency contacts, and simultaneously notifies our dedicated safety response team.", stat: "< 1 second response" },
    { icon: "👥", title: "Live Trip Sharing", accent: "#9333ea", desc: "Share your live trip progress — including driver details, GPS route, and ETA — with any contact. They receive a live tracking link with no app download required. Update who you're sharing with at any time.", stat: "No app needed to track" },
    { icon: "🎙️", title: "Optional Audio Recording", accent: "#f59e0b", desc: "Riders can opt in to audio recording for any trip. Recordings are AES-256 encrypted, stored for 7 days, and are only accessible if a safety report is filed within that window. Your privacy is paramount.", stat: "AES-256 encrypted" },
    { icon: "⭐", title: "Two-Way Accountability", accent: "#1a56ff", desc: "Drivers and riders rate each other after every trip. Drivers below 4.5 stars are automatically enrolled in coaching. Below 4.2, they're suspended and reviewed. Riders with patterns of complaints are flagged and investigated.", stat: "Avg driver rating 4.87" },
    { icon: "📸", title: "Real-Time ID Verification", accent: "#00c4a7", desc: "Before each shift, drivers complete a selfie ID check using facial recognition. This prevents account sharing and ensures the driver you see in the app is exactly who shows up to your pickup.", stat: "Every single shift" },
    { icon: "🛡️", title: "$1M Insurance Coverage", accent: "#ef4444", desc: "Every Swift trip is covered by a $1 million liability insurance policy from the moment a driver accepts your request to when they complete your drop-off. This covers injury, property damage, and third-party claims.", stat: "$1M per-incident coverage" },
    { icon: "🌙", title: "Night Ride Safety Mode", accent: "#9333ea", desc: "Rides between 10 PM and 5 AM automatically activate enhanced safety mode: mandatory driver ID re-check, stricter route monitoring tolerances, and guaranteed response within 90 seconds if SOS is triggered.", stat: "Enhanced 10PM–5AM" },
];

const DRIVER_VERIFICATION_STEPS = [
    { step: "01", icon: "📝", title: "Application Review", desc: "Applicants submit driving history, personal info, and vehicle details. Our system cross-references 14 national and regional databases in under 60 seconds." },
    { step: "02", icon: "🔍", title: "Background Check", desc: "We run full criminal history, sex offender registry, global watchlist, and county-level court records. 100% of applicants, every 6 months." },
    { step: "03", icon: "🚗", title: "Vehicle Inspection", desc: "All vehicles must pass a 19-point inspection by a certified mechanic. Vehicles over 8 years old or 150,000 miles are not eligible." },
    { step: "04", icon: "📸", title: "Identity Verification", desc: "Government-issued ID is cross-matched with a live selfie using facial recognition software. No impersonation is possible." },
    { step: "05", icon: "🎓", title: "Safety Training", desc: "All drivers complete Swift's 4-hour online safety and conduct certification before their first trip. Re-certified annually." },
    { step: "06", icon: "✅", title: "Ongoing Monitoring", desc: "Driver activity is continuously analysed: route patterns, acceleration data, rating trends, and incident reports — all feeding into a live Driver Trust Score." },
];

const SAFETY_STATS = [
    { value: "100%", label: "Background check rate", icon: "🔍" },
    { value: "0.001%", label: "Serious incident rate", icon: "🛡️" },
    { value: "< 90s", label: "SOS response time", icon: "🆘" },
    { value: "24/7", label: "Safety team availability", icon: "📞" },
    { value: "$1M", label: "Insurance per trip", icon: "💰" },
    { value: "4.87", label: "Avg driver safety score", icon: "⭐" },
];

const SAFETY_TESTIMONIALS = [
    { name: "Aisha B.", city: "Los Angeles", avatar: "AB", gradient: "linear-gradient(135deg,#fa709a,#fee140)", text: "Working night shifts as a nurse, I need to know I'll get home safely at 3am. The live trip sharing and constant monitoring means my family always knows I'm safe. Swift is the only app I trust for late rides." },
    { name: "Priya R.", city: "San Francisco", avatar: "PR", gradient: "linear-gradient(135deg,#4facfe,#00f2fe)", text: "My mum was worried about me taking rides alone as a student. Now she tracks every trip on the live share link. She says Swift gives her more peace of mind than any other app — and that means everything to me." },
    { name: "Daniel K.", city: "Chicago", avatar: "DK", gradient: "linear-gradient(135deg,#43e97b,#38f9d7)", text: "I had an incident on another platform and switched to Swift specifically for the safety features. The driver ID check before every shift is the detail that sold me. You know exactly who's in that car." },
];

const EMERGENCY_FEATURES = [
    { icon: "🆘", title: "SOS Button", desc: "Visible on the main trip screen throughout your entire ride. One tap triggers emergency services + safety team + trusted contact alerts simultaneously.", highlight: "Always visible during trips" },
    { icon: "📍", title: "Precise GPS Sharing", desc: "Your exact coordinates — accurate to 3 metres — are shared with emergency services when SOS is triggered. No 'approximate location' delays.", highlight: "3-metre GPS accuracy" },
    { icon: "👤", title: "Trusted Contacts", desc: "Set up to 5 trusted contacts who can track any of your trips live. They receive instant push notifications if you trigger SOS.", highlight: "Up to 5 emergency contacts" },
    { icon: "🔇", title: "Silent Mode SOS", desc: "Worried about triggering SOS openly? Tap and hold the button for 3 seconds to activate a silent SOS that alerts services without any sound or screen indication.", highlight: "Discreet emergency activation" },
];

/* ─── Components ──────────────────────────────────────────────────────────── */
function PageHero({ onNavigate }) {
    return (
        <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-16" style={{ background: "linear-gradient(135deg,#0b0f1a 0%,#0f1e3d 100%)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(26,86,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,255,.06) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle,#1a56ff,transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle,#00c4a7,transparent 70%)" }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="fade-up mb-4"><Badge color="teal">Safety Promise</Badge></div>
                        <h1 className="fade-up1 font-display font-bold leading-tight tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl mb-5">
                            Safety isn&apos;t a feature.<br /><em className="text-blue-400 not-italic">It&apos;s our foundation.</em>
                        </h1>
                        <p className="fade-up2 text-lg text-white/60 leading-relaxed mb-8 font-body max-w-lg">
                            Every decision we make — from how we vet drivers to how we monitor trips — starts with one question: is this the safest it can possibly be?
                        </p>
                        <div className="fade-up3 flex flex-wrap gap-3">
                            <Btn variant="primary" onClick={() => onNavigate("home")}>Book a Safe Ride →</Btn>
                            <Btn variant="ghost" cls="!text-white !border-white/30 hover:!bg-white/10">View Safety Report</Btn>
                        </div>
                    </div>

                    {/* Safety score card */}
                    <div className="fade-up2 bg-white/5 backdrop-blur-sm rounded-3xl p-7 border border-white/8">
                        <div className="text-center mb-6">
                            <div className="inline-block bg-teal-500/20 border border-teal-400/30 rounded-full px-4 py-1.5 mb-3">
                                <span className="text-teal-400 text-xs font-bold uppercase tracking-wider font-body">Live Safety Score</span>
                            </div>
                            <div className="font-display text-6xl font-bold text-white mb-1">98.7</div>
                            <div className="text-white/45 text-sm font-body">Out of 100 · Updated daily</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {SAFETY_STATS.map((s, i) => (
                                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/6">
                                    <div className="text-xl mb-1.5">{s.icon}</div>
                                    <div className="font-display text-lg font-bold text-white">{s.value}</div>
                                    <div className="text-xs text-white/40 font-body mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SafetyPillars() {
    const [active, setActive] = useState(0);
    const pillar = SAFETY_PILLARS[active];
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="9 Safety Layers" title="Protection at" highlight="every level" sub="We don't rely on one safety measure. We've built nine overlapping systems that together make every Swift ride the safest ride available." center />

                {/* Top 3 highlight cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                    {SAFETY_PILLARS.slice(0, 3).map((p, i) => (
                        <div key={i} className="lift rounded-2xl p-6 border text-center" style={{ background: `${p.accent}08`, borderColor: `${p.accent}20` }}>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border-2" style={{ background: `${p.accent}15`, borderColor: `${p.accent}30` }}>{p.icon}</div>
                            <div className="font-display text-lg font-bold text-slate-900 mb-1.5">{p.title}</div>
                            <div className="text-xs font-bold px-3 py-1 rounded-full inline-block font-body mb-3" style={{ background: `${p.accent}15`, color: p.accent }}>{p.stat}</div>
                            <p className="text-sm text-slate-500 leading-relaxed font-body">{p.desc.slice(0, 120)}…</p>
                        </div>
                    ))}
                </div>

                {/* Interactive remaining pillars */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        {SAFETY_PILLARS.slice(3).map((p, i) => (
                            <button key={i} onClick={() => setActive(i + 3)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 w-full font-body ${active === i + 3 ? "text-white shadow-lg" : "bg-white border-slate-100 text-slate-700 hover:border-slate-200"}`}
                                style={active === i + 3 ? { background: p.accent, borderColor: p.accent } : {}}>
                                <span className="text-2xl">{p.icon}</span>
                                <div>
                                    <div className={`font-semibold text-sm ${active === i + 3 ? "text-white" : "text-slate-800"}`}>{p.title}</div>
                                    <div className={`text-xs ${active === i + 3 ? "text-white/65" : "text-slate-400"} font-body`}>{p.stat}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Detail */}
                    {active >= 3 && (
                        <div className="lg:col-span-2 anim-fadeIn">
                            <div className="bg-slate-50 rounded-3xl p-7 border border-slate-100 h-full flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2" style={{ background: `${pillar.accent}15`, borderColor: `${pillar.accent}30` }}>{pillar.icon}</div>
                                    <div>
                                        <h3 className="font-display text-2xl font-bold text-slate-900">{pillar.title}</h3>
                                        <span className="text-sm font-bold font-body px-3 py-0.5 rounded-full inline-block mt-1" style={{ background: `${pillar.accent}15`, color: pillar.accent }}>{pillar.stat}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-body text-base">{pillar.desc}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function DriverVerification() {
    return (
        <section className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Driver Vetting" title="How we screen" highlight="every driver" sub="Our 6-stage driver verification process is the most rigorous in the industry — and it never stops." center />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {DRIVER_VERIFICATION_STEPS.map((s, i) => (
                        <div key={i} className="lift bg-white rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-4 right-4 font-display text-5xl font-bold text-blue-500/5 leading-none">{s.step}</div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl border border-blue-100 mb-4">{s.icon}</div>
                            <div className="font-display text-lg font-bold text-slate-900 mb-2">{s.title}</div>
                            <p className="text-sm text-slate-500 leading-relaxed font-body">{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-teal-50 border border-teal-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white text-xl shrink-0">✓</div>
                    <div>
                        <div className="font-bold text-teal-800 font-body mb-1">Ongoing monitoring never stops</div>
                        <p className="text-sm text-teal-700 font-body leading-relaxed">Even after approval, every driver&apos;s rating, route patterns, complaint history, and incident reports are analysed daily by our Trust & Safety AI. A driver can be suspended within minutes if our system detects a concern.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function EmergencyFeatures() {
    return (
        <section className="py-16 sm:py-20" style={{ background: "linear-gradient(135deg,#0b0f1a,#0f1e3d)" }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Emergency Features" title="When seconds" highlight="matter most" sub="Our emergency toolkit was designed with law enforcement and safety experts to ensure you're never alone in a crisis." center light />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {EMERGENCY_FEATURES.map((f, i) => (
                        <div key={i} className="lift rounded-2xl p-6 sm:p-7 border border-white/6" style={{ background: "rgba(255,255,255,.04)", backdropFilter: "blur(12px)" }}>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-400/25 flex items-center justify-center text-2xl shrink-0">{f.icon}</div>
                                <div>
                                    <div className="inline-block text-xs font-bold bg-red-500/15 text-red-400 border border-red-400/20 px-2.5 py-0.5 rounded-full font-body mb-2">{f.highlight}</div>
                                    <h3 className="font-display text-xl font-bold text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed font-body">{f.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SafetyTestimonials() {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Real Experiences" title="Safety stories from" highlight="real riders" sub="The features that matter most — told by the people who rely on them every day." center />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {SAFETY_TESTIMONIALS.map((t, i) => (
                        <div key={i} className="lift rounded-2xl overflow-hidden border border-slate-100">
                            <div className="h-20 flex items-center justify-center text-3xl" style={{ background: t.gradient }} />
                            <div className="p-6">
                                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                                <p className="text-slate-600 leading-relaxed mb-5 text-sm font-body italic">&quot;{t.text}&quot;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: t.gradient }}>{t.avatar}</div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm font-body">{t.name}</div>
                                        <div className="text-xs text-slate-400 font-body">{t.city}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust certifications */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { icon: "🏛️", title: "NHTSA Compliant", sub: "National Highway Traffic Safety" },
                        { icon: "🔒", title: "SOC 2 Type II", sub: "Data security certified" },
                        { icon: "🛡️", title: "ISO 27001", sub: "Information security" },
                        { icon: "🏆", title: "SafeRide Award 2024", sub: "Industry safety recognition" },
                    ].map((c, i) => (
                        <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                            <div className="text-2xl mb-2">{c.icon}</div>
                            <div className="font-bold text-sm text-slate-900 font-body">{c.title}</div>
                            <div className="text-xs text-slate-400 font-body mt-1">{c.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Page Export ─────────────────────────────────────────────────────────── */
export default function SafetyPage({ onNavigate }) {
    return (
        <div className="font-body">
            <PageHero onNavigate={onNavigate} />
            <SafetyPillars />
            <DriverVerification />
            <EmergencyFeatures />
            <SafetyTestimonials />
            <CTASection onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </div>
    );
}