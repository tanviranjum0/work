/* eslint-disable react/prop-types */
import { useState } from "react";
import { Btn, Badge, SectionHead, CTASection, Footer } from "./SwiftShared";

/* ─── Data ────────────────────────────────────────────────────────────────── */
const STEPS = [
    {
        step: "01", icon: "📱", color: "#1a56ff",
        title: "Download the App",
        sub: "Available free on iOS & Android",
        desc: "Get Swift from the App Store or Google Play in seconds. No account required to browse prices. Sign up takes less than 2 minutes with just your name, email, and phone number.",
        bullets: ["Available on iOS 14+ and Android 9+", "Sign up with email, Google, or Apple ID", "No credit card required to browse", "Works on low-bandwidth connections"],
        tip: "💡 Pro tip: Enable location permissions for the fastest booking experience.",
    },
    {
        step: "02", icon: "📍", color: "#00c4a7",
        title: "Enter Your Destination",
        sub: "Smart autocomplete finds it instantly",
        desc: "Type your destination and our smart search completes the address automatically. Add multiple stops, set a pickup time, or let Swift suggest the most popular nearby destinations for you.",
        bullets: ["Voice-to-text destination entry", "Multi-stop trip builder", "Schedule up to 7 days in advance", "Saved home & work locations"],
        tip: "💡 Pro tip: Save your home and office for 1-tap booking on your daily commute.",
    },
    {
        step: "03", icon: "🚗", color: "#f59e0b",
        title: "Choose Your Ride Type",
        sub: "Four tiers for every need & budget",
        desc: "Pick from Standard, Express, XL, or Premium. See the exact upfront fare before you confirm — no surge pricing surprises. Compare ETAs and prices side-by-side to make the best choice.",
        bullets: ["Guaranteed upfront pricing", "Side-by-side ride comparison", "No surge pricing beyond a cap", "Eco filter for electric vehicles"],
        tip: "💡 Pro tip: Express is fastest but Standard offers the best value for non-urgent trips.",
    },
    {
        step: "04", icon: "🤝", color: "#9333ea",
        title: "Get Matched Instantly",
        sub: "Nearest driver confirmed in seconds",
        desc: "Our dispatch algorithm matches you with the closest available, highest-rated driver in real-time. You'll see their name, photo, vehicle details, and 5-year rating history immediately.",
        bullets: ["Sub-5-second driver matching", "Driver photo & ID verification", "View live driver location on map", "Message driver before pickup"],
        tip: "💡 Pro tip: Check the driver's car plate number before getting in — always shown prominently.",
    },
    {
        step: "05", icon: "⏱️", color: "#1a56ff",
        title: "Track Your Driver Live",
        sub: "Real-time GPS, every second",
        desc: "Watch your driver navigate to you on a live map. Get precise countdown timers, push notifications when they're 1 minute away, and a pin-point 'driver has arrived' alert so you're never waiting by the door.",
        bullets: ["Live map with driver position", "Arrival countdown to the second", "'Driver arrived' push notification", "Share live ETA with contacts"],
        tip: "💡 Pro tip: Share your trip ETA with friends or family from the tracking screen with one tap.",
    },
    {
        step: "06", icon: "🛡️", color: "#00c4a7",
        title: "Ride Safely",
        sub: "Protected every mile",
        desc: "Once you're in the car, your trip is continuously monitored. Our safety system detects route deviations, unusual stops, and speed anomalies. You have one-tap SOS access throughout the entire journey.",
        bullets: ["Continuous route monitoring", "In-trip SOS button always visible", "Optional audio recording feature", "Live-share trip with trusted contact"],
        tip: "💡 Pro tip: Use the 'Share Trip' button to let a friend track your ride from door to door.",
    },
    {
        step: "07", icon: "💳", color: "#f59e0b",
        title: "Pay Automatically",
        sub: "Zero friction, zero cash needed",
        desc: "Payment happens automatically when your trip ends using your saved payment method. You're charged the exact upfront price you saw — never a penny more. A digital receipt arrives instantly via email and in-app.",
        bullets: ["Auto-charged on arrival", "Exact upfront fare always honoured", "Digital receipt emailed instantly", "Dispute any charge in-app in 1 tap"],
        tip: "💡 Pro tip: Use Swift Wallet for the fastest checkout and earn 1.5x rewards on every ride.",
    },
    {
        step: "08", icon: "⭐", color: "#9333ea",
        title: "Rate & Review",
        sub: "Your feedback shapes the platform",
        desc: "Rate your driver 1–5 stars and leave a quick note. Your feedback is anonymous, actioned within 24 hours, and directly influences driver rankings. Great drivers get bonuses; poor ones get reviewed.",
        bullets: ["Post-trip rating (takes 5 seconds)", "Detailed feedback categories", "Report safety issues privately", "Earn Swift Points for every review"],
        tip: "💡 Pro tip: Recognised great service? Tip your driver directly from the rating screen.",
    },
];

const FAQS = [
    { q: "How is the upfront price calculated?", a: "Swift uses real-time data — distance, estimated time, local demand, and vehicle type — to calculate a fare before you book. This price is guaranteed unless you significantly change your destination mid-trip." },
    { q: "What happens if my driver cancels?", a: "If a driver cancels after accepting your ride, we instantly rematch you with the next available driver and apply a 10% discount to your next trip as an apology for the inconvenience." },
    { q: "Can I request the same driver again?", a: "Yes! After a ride, you can mark any driver as a 'Favourite'. On your next booking, you'll see an option to request them specifically — if they're available and nearby, they'll be prioritised for your trip." },
    { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, PayPal, and Swift Wallet. Corporate accounts can pay via invoice. Cash is not accepted." },
    { q: "Is there a cancellation fee?", a: "You can cancel for free within 2 minutes of booking or before your driver begins heading to you. After that, a small cancellation fee (usually $2–5) applies to compensate the driver for their time." },
    { q: "How do I report a safety issue?", a: "Open the app, go to Your Trips → select the trip → Report an Issue. For emergencies, use the in-trip SOS button which contacts emergency services and our 24/7 safety team simultaneously." },
    { q: "Can I use Swift for corporate travel?", a: "Absolutely. Swift for Business offers centralised billing, travel policy controls, expense integrations (Expensify, Concur, SAP), and a dedicated account manager for teams of any size." },
    { q: "What if I left something in the car?", a: "Go to Your Trips → Lost & Found → Contact Driver. We'll connect you with your driver to arrange a return. If the item is valuable, our team can coordinate a safe handoff." },
];

/* ─── Components ──────────────────────────────────────────────────────────── */
function PageHero({ onNavigate }) {
    return (
        <section className="relative min-h-[55vh] flex items-center overflow-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-white pt-16">
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,196,167,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,196,167,.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-400 rounded-full opacity-10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400 rounded-full opacity-8 blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="fade-up mb-4"><Badge color="teal">Simple Process</Badge></div>
                        <h1 className="fade-up1 font-display font-bold leading-tight tracking-tight text-slate-900 text-4xl sm:text-5xl lg:text-6xl mb-5">
                            From open to<br /><em className="text-blue-600 not-italic">booked</em> in 10s.
                        </h1>
                        <p className="fade-up2 text-lg text-slate-500 leading-relaxed mb-8 font-body max-w-md">
                            We stripped every unnecessary step out of the booking process. Eight stages from app download to door-to-door — each designed to be effortless.
                        </p>
                        <div className="fade-up3 flex flex-wrap gap-3">
                            <Btn variant="primary" onClick={() => onNavigate("home")}>Try It Now →</Btn>
                            <Btn variant="ghost">Download App</Btn>
                        </div>
                    </div>

                    {/* Step count visual */}
                    <div className="fade-up2 grid grid-cols-4 gap-3">
                        {STEPS.map((s, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 text-center border border-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-xl mb-1">{s.icon}</div>
                                <div className="font-display text-xs font-bold text-slate-900">{s.step}</div>
                                <div className="text-xs text-slate-400 font-body mt-0.5 hidden sm:block leading-tight">{s.title.split(" ")[0]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function StepTimeline() {
    const [activeStep, setActiveStep] = useState(0);
    const step = STEPS[activeStep];
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <SectionHead badge="Step by Step" title="Every step," highlight="explained" sub="Tap any step to see the full detail — from download to drop-off, nothing is left to chance." center />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Step list */}
                    <div className="lg:col-span-2 flex flex-col gap-2">
                        {STEPS.map((s, i) => (
                            <button key={i} onClick={() => setActiveStep(i)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 w-full font-body ${activeStep === i ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-100 text-slate-700 hover:border-blue-200 hover:bg-blue-50"}`}>
                                <div className={`text-2xl`}>{s.icon}</div>
                                <div>
                                    <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${activeStep === i ? "text-blue-200" : "text-slate-400"}`}>{s.step}</div>
                                    <div className={`font-semibold text-sm ${activeStep === i ? "text-white" : "text-slate-800"}`}>{s.title}</div>
                                    <div className={`text-xs mt-0.5 ${activeStep === i ? "text-blue-200" : "text-slate-400"}`}>{s.sub}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Detail panel */}
                    <div className="lg:col-span-3 anim-fadeIn" key={activeStep}>
                        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 h-full">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 border-white shadow-md" style={{ background: `${step.color}15`, borderColor: `${step.color}30` }}>{step.icon}</div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider font-body mb-1" style={{ color: step.color }}>Step {step.step}</div>
                                    <h3 className="font-display text-2xl font-bold text-slate-900">{step.title}</h3>
                                    <p className="text-sm text-slate-500 font-body">{step.sub}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed mb-6 font-body">{step.desc}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {step.bullets.map((b, i) => (
                                    <div key={i} className="flex items-start gap-2.5 bg-white rounded-xl px-3 py-2.5 border border-slate-100">
                                        <span className="text-teal-500 font-bold text-sm mt-0.5 shrink-0">✓</span>
                                        <span className="text-sm text-slate-600 font-body">{b}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                                <p className="text-sm text-blue-700 font-body">{step.tip}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation arrows */}
                <div className="flex justify-center gap-3 mt-8">
                    <Btn variant="outline" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} cls={activeStep === 0 ? "opacity-40 cursor-not-allowed" : ""}>← Previous</Btn>
                    <span className="flex items-center text-sm text-slate-500 font-body px-4">{activeStep + 1} / {STEPS.length}</span>
                    <Btn variant="primary" onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} cls={activeStep === STEPS.length - 1 ? "opacity-40 cursor-not-allowed" : ""}>Next →</Btn>
                </div>
            </div>
        </section>
    );
}

function QuickStats() {
    return (
        <section className="py-14 bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    {[["10s", "Average booking time"], ["3 min", "Average pickup time"], ["99.4%", "Trip completion rate"], ["4.9★", "Driver satisfaction"]].map(([v, l]) => (
                        <div key={l} className="border-r border-white/10 last:border-0 px-4">
                            <div className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">{v}</div>
                            <div className="text-sm text-white/50 font-body">{l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQSection() {
    const [open, setOpen] = useState(null);
    return (
        <section className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <SectionHead badge="FAQ" title="Got questions?" highlight="We've got answers." center />
                <div className="flex flex-col gap-3">
                    {FAQS.map((faq, i) => (
                        <div key={i} className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? "border-blue-200 shadow-md" : "border-slate-100"}`}>
                            <button onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer border-none bg-transparent">
                                <span className={`font-semibold text-sm sm:text-base font-body ${open === i ? "text-blue-600" : "text-slate-800"}`}>{faq.q}</span>
                                <span className={`text-xl font-bold shrink-0 ml-3 transition-transform duration-300 ${open === i ? "rotate-45 text-blue-500" : "text-slate-400"}`}>+</span>
                            </button>
                            <div className={`accordion-content ${open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="px-5 pb-4 text-sm text-slate-500 font-body leading-relaxed">{faq.a}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-sm font-body mb-4">Still have questions?</p>
                    <Btn variant="primary">💬 Chat with Support</Btn>
                </div>
            </div>
        </section>
    );
}

/* ─── Page Export ─────────────────────────────────────────────────────────── */
export default function HowItWorksPage({ onNavigate }) {
    return (
        <div className="font-body">
            <PageHero onNavigate={onNavigate} />
            <StepTimeline />
            <QuickStats />
            <FAQSection />
            <CTASection onNavigate={onNavigate} />
            <Footer onNavigate={onNavigate} />
        </div>
    );
}