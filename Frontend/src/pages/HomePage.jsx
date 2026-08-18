import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Award, Users, Ship, Anchor, ChevronDown } from 'lucide-react'
import { getCruises } from '../api/client'
import CruiseCard from '../components/CruiseCard'

/* ─── Hero wave SVG ─────────────────────────────────────────────────────── */
function WaveHero() {
    return (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none" style={{ height: 100 }}>
            <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,40 C300,100 900,0 1200,60 L1200,100 L0,100 Z" fill="#faf8f4" />
            </svg>
        </div>
    )
}

/* ─── Stats bar ─────────────────────────────────────────────────────────── */
const stats = [
    { icon: Ship, value: '5+', label: 'Luxury Ships' },
    { icon: Users, value: '50K+', label: 'Happy Passengers' },
    { icon: Anchor, value: '40+', label: 'Destinations' },
    { icon: Award, value: '25yr', label: 'Award-winning' },
]

/* ─── Why choose us ─────────────────────────────────────────────────────── */
const whyUs = [
    {
        icon: '🌊',
        title: 'World-Class Itineraries',
        desc: 'Hand-crafted routes to the Mediterranean, Fjords, Caribbean, and beyond – curated by expert navigators.',
    },
    {
        icon: '🍽️',
        title: 'Fine Dining at Sea',
        desc: 'Award-winning chefs, fresh local produce, and menus that change with every port of call.',
    },
    {
        icon: '🛡️',
        title: 'ATOL Protected',
        desc: 'Every booking is fully ATOL protected for complete financial peace of mind.',
    },
    {
        icon: '⭐',
        title: 'Five-Star Service',
        desc: 'Our crew-to-passenger ratio is the highest in the industry. Your comfort is our obsession.',
    },
    {
        icon: '👨‍👩‍👧‍👦',
        title: 'Family Friendly',
        desc: 'Kids sail free (0–4), with dedicated children\'s programmes and family suites.',
    },
    {
        icon: '💰',
        title: 'Transparent Pricing',
        desc: 'Full itemised breakdown before you pay. No hidden fees, no surprises at checkout.',
    },
]

/* ─── Testimonials ──────────────────────────────────────────────────────── */
const testimonials = [
    { name: 'Sarah & James T.', location: 'London', stars: 5, text: "The Mediterranean itinerary was absolutely flawless. We've sailed with many operators but Odysseus stands apart for sheer professionalism and warmth." },
    { name: 'Robert K.', location: 'Edinburgh', stars: 5, text: "Norwegian Fjords was a bucket-list tick. The scenery was unreal and the on-board food was genuinely Michelin-worthy. Can't wait to book again." },
    { name: 'The Patel Family', location: 'Birmingham', stars: 5, text: "Travelling with three children – the kids club kept them busy while we had adult time. The transparent pricing made budgeting so easy." },
]

export default function HomePage() {
    const [featuredCruises, setFeaturedCruises] = useState([])

    useEffect(() => {
        getCruises()
            .then(r => setFeaturedCruises(r.data.data.slice(0, 3)))
            .catch(() => { })
    }, [])

    return (
        <div>
            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(160deg, var(--ocean-900) 0%, var(--ocean-700) 50%, var(--ocean-600) 100%)' }}>

                {/* Animated star field */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-white/20"
                            style={{
                                width: Math.random() * 3 + 1,
                                height: Math.random() * 3 + 1,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animation: `fadeUp ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
                            }} />
                    ))}
                </div>

                {/* Gradient orbs */}
                <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ background: 'var(--gold-500)' }} />
                <div className="absolute bottom-24 left-10 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
                    style={{ background: 'var(--ocean-400)' }} />

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-28 pb-32">
                    <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                        style={{ background: 'rgba(212,168,67,0.2)', color: 'var(--gold-300)', border: '1px solid rgba(212,168,67,0.35)' }}>
                        ⚓ Award-Winning Cruise Holidays
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6 fade-up-delay-1">
                        Sail Into Your <br />
                        <span style={{ color: 'var(--gold-400)' }}>Greatest Adventure</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl mx-auto fade-up-delay-2">
                        Discover 5 luxury cruise routes spanning the Mediterranean, Norwegian Fjords, Caribbean, Alaska and the Arabian Gulf.
                        Transparent pricing, no hidden fees, children under 5 sail free.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center fade-up-delay-3">
                        <Link to="/cruises"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))', color: 'var(--ocean-900)' }}>
                            Explore Cruises <ArrowRight size={18} />
                        </Link>
                        <Link to="/about"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold border text-white transition-all duration-300 hover:bg-white/10"
                            style={{ borderColor: 'rgba(255,255,255,0.35)' }}>
                            Our Story
                        </Link>
                    </div>

                    {/* Scroll cue */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
                        <ChevronDown size={24} />
                    </div>
                </div>

                <WaveHero />
            </section>

            {/* ── STATS ─────────────────────────────────────────────────────────── */}
            <section className="py-10" style={{ background: 'var(--ocean-900)' }}>
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="py-4 border-r last:border-r-0 border-white/10">
                            <Icon size={22} className="mx-auto mb-2" style={{ color: 'var(--gold-400)' }} />
                            <p className="font-display text-3xl font-bold text-white">{value}</p>
                            <p className="text-xs text-white/60 mt-1 uppercase tracking-widest">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURED CRUISES ──────────────────────────────────────────────── */}
            <section className="py-20 px-6" style={{ background: 'var(--cream)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-500)' }}>
                            ✦ Featured Voyages
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--ocean-900)' }}>
                            Handpicked Itineraries
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Our most beloved routes, each crafted to deliver once-in-a-lifetime moments at sea.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCruises.length > 0
                            ? featuredCruises.map(c => <CruiseCard key={c.id} cruise={c} />)
                            : Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="rounded-2xl overflow-hidden shadow shimmer h-72" />
                            ))
                        }
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/cruises"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border-2 transition-all duration-300 hover:text-white hover:scale-105"
                            style={{ borderColor: 'var(--ocean-700)', color: 'var(--ocean-700)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ocean-700)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '' }}
                        >
                            View All Cruises <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── WHY ODYSSEUS ──────────────────────────────────────────────────── */}
            <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #f0f6ff 0%, var(--cream) 100%)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-500)' }}>
                            ✦ Why Sail With Us
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--ocean-900)' }}>
                            The Odysseus Difference
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whyUs.map(({ icon, title, desc }) => (
                            <div key={title}
                                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-blue-100">
                                <span className="text-3xl mb-4 block">{icon}</span>
                                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--ocean-800)' }}>{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FARE GUIDE ────────────────────────────────────────────────────── */}
            <section className="py-20 px-6" style={{ background: 'var(--ocean-900)' }}>
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-400)' }}>
                            ✦ Transparent Pricing
                        </p>
                        <h2 className="font-display text-4xl font-bold text-white mb-3">Cruise Fare Guide</h2>
                        <p className="text-white/55 text-sm">
                            All child fares are a <strong className="text-white/80">percentage of the adult base fare</strong> for the selected cruise.
                            The example below uses an adult fare of <strong className="text-white/80">£1,499</strong>.
                        </p>
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                        {/* Header */}
                        <div className="grid grid-cols-4 text-xs font-semibold uppercase tracking-widest px-5 py-3"
                            style={{ background: 'rgba(212,168,67,0.18)', color: 'var(--gold-300)' }}>
                            <span>Passenger</span>
                            <span className="text-center">Age Band</span>
                            <span className="text-center">% of Adult Fare</span>
                            <span className="text-right">Example (£1,499)</span>
                        </div>

                        {/* Rows */}
                        {[
                            { label: '🍼 Infant', age: '0 – 4', pct: '0%', example: '£0.00', badge: '#22c55e', note: 'FREE' },
                            { label: '👧 Child', age: '5 – 11', pct: '50%', example: '£749.50', badge: 'var(--gold-400)', note: 'Half fare' },
                            { label: '🧑 Teen', age: '12 – 17', pct: '75%', example: '£1,124.25', badge: 'var(--ocean-300)', note: '¾ fare' },
                            { label: '🧑‍💼 Adult', age: '18+', pct: '100%', example: '£1,499.00', badge: '#f472b6', note: 'Full fare' },
                        ].map(({ label, age, pct, example, badge, note }, i) => (
                            <div
                                key={age}
                                className="grid grid-cols-4 items-center px-5 py-4 transition-colors duration-150 hover:bg-white/5"
                                style={{
                                    borderTop: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                    background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                                }}
                            >
                                <span className="text-white font-medium text-sm">{label}</span>
                                <span className="text-center text-white/70 text-sm">{age}</span>
                                <span className="text-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                                        style={{ background: `${badge}22`, color: badge, border: `1px solid ${badge}44` }}>
                                        {pct} <span className="font-normal opacity-70">· {note}</span>
                                    </span>
                                </span>
                                <span className="text-right font-display text-base font-bold" style={{ color: badge }}>
                                    {example}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-white/40 text-xs mt-5">
                        Prices shown are per person. Services &amp; optional extras are additional.
                    </p>
                </div>
            </section>

            {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
            <section className="py-20 px-6" style={{ background: 'var(--cream)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-500)' }}>
                            ✦ Passenger Stories
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--ocean-900)' }}>
                            What Our Guests Say
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map(({ name, location, stars, text }) => (
                            <div key={name} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex mb-4">
                                    {Array.from({ length: stars }).map((_, i) => (
                                        <Star key={i} size={15} fill="var(--gold-400)" stroke="none" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                        style={{ background: 'linear-gradient(135deg, var(--ocean-600), var(--ocean-400))' }}>
                                        {name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: 'var(--ocean-800)' }}>{name}</p>
                                        <p className="text-xs text-gray-400">{location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
            <section className="py-20 px-6 text-center"
                style={{ background: 'linear-gradient(135deg, var(--ocean-800), var(--ocean-600))' }}>
                <Shield size={40} className="mx-auto mb-6" style={{ color: 'var(--gold-400)' }} />
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                    Ready to Set Sail?
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
                    Browse our cruises, get a full price breakdown, and book in minutes. No hidden fees guaranteed.
                </p>
                <Link to="/cruises"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))', color: 'var(--ocean-900)' }}>
                    Browse All Cruises <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    )
}
