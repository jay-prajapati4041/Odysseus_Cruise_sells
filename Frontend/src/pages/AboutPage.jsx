import { Ship, Anchor, Heart, Globe, Users, Award } from 'lucide-react'

const timeline = [
    { year: '1998', event: 'Odysseus Cruises founded in Southampton with a single 800-passenger ship.' },
    { year: '2003', event: 'Fleet expands to 3 ships. First Mediterranean routes launched.' },
    { year: '2009', event: 'Launched online booking — one of the first cruise operators to do so.' },
    { year: '2015', event: 'Norwegian Fjords and Caribbean routes added. Reached 10,000 bookings.' },
    { year: '2019', event: 'Odysseus Horizon sets sail — our most luxurious ship, with 2,000 cabins.' },
    { year: '2024', event: 'Launched transparent pricing engine. Industry award for best booking experience.' },
]

const team = [
    { name: 'Capt. Eleanor Marsh', role: 'Fleet Commodore', emoji: '👩‍✈️' },
    { name: 'David Osei-Bonsu', role: 'Chief Experience Officer', emoji: '🧑‍💼' },
    { name: 'Priya Santhanam', role: 'Head of Digital', emoji: '👩‍💻' },
    { name: 'Marco Ferretti', role: 'Executive Chef', emoji: '👨‍🍳' },
]

export default function AboutPage() {
    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            {/* Header */}
            <div className="pt-36 pb-20 px-6 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, var(--ocean-900), var(--ocean-700))' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-400)' }}>✦ Our Story</p>
                <h1 className="font-display text-5xl font-bold text-white mb-4">About Odysseus</h1>
                <p className="text-white/65 max-w-xl mx-auto">
                    Over 25 years of exceptional cruising. Born in Southampton, sailing the world.
                </p>
            </div>

            {/* Mission */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Ship size={48} className="mx-auto mb-6" style={{ color: 'var(--ocean-600)' }} />
                    <h2 className="font-display text-4xl font-bold mb-6" style={{ color: 'var(--ocean-900)' }}>
                        Our Mission
                    </h2>
                    <p className="text-gray-600 text-xl leading-relaxed">
                        To make luxury cruising accessible, transparent, and unforgettable — for every generation. Whether you're celebrating a milestone, exploring with family, or seeking solo adventure, we craft voyages that stay with you for life.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 px-6" style={{ background: 'linear-gradient(180deg, #f0f6ff, var(--cream))' }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-display text-3xl font-bold text-center mb-12" style={{ color: 'var(--ocean-900)' }}>
                        What We Stand For
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Heart, title: 'Passenger First', desc: 'Every decision starts with the question: does this delight our guest?' },
                            { icon: Globe, title: 'World-Class Routes', desc: 'Five stunning itineraries crafted by experienced navigators and travel experts.' },
                            { icon: Award, title: 'Award-Winning', desc: '14 industry awards including Best Cruise Operator 2023 & 2024.' },
                            { icon: Users, title: 'Family at Heart', desc: 'Children under 5 sail free. Family cabins, kids clubs, and all-ages entertainment.' },
                            { icon: Anchor, title: 'ATOL Protected', desc: 'All bookings are ATOL protected — your money is always safe with us.' },
                            { icon: Ship, title: 'Modern Fleet', desc: 'Five contemporary ships, each designed for comfort, sustainability, and style.' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <Icon size={28} className="mb-4" style={{ color: 'var(--ocean-600)' }} />
                                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--ocean-800)' }}>{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 px-6" style={{ background: 'var(--ocean-900)' }}>
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl font-bold text-white text-center mb-14">Our Journey</h2>
                    <div className="relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: 'rgba(212,168,67,0.3)' }} />
                        <div className="space-y-8">
                            {timeline.map(({ year, event }) => (
                                <div key={year} className="flex gap-6 items-start pl-2">
                                    <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                                        style={{ background: 'var(--gold-500)', color: 'var(--ocean-900)' }}>
                                        {year}
                                    </div>
                                    <div className="pt-3">
                                        <p className="text-white/80 text-sm leading-relaxed">{event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl font-bold mb-12" style={{ color: 'var(--ocean-900)' }}>Meet The Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map(({ name, role, emoji }) => (
                            <div key={name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="text-4xl mb-3">{emoji}</div>
                                <p className="font-semibold text-sm" style={{ color: 'var(--ocean-800)' }}>{name}</p>
                                <p className="text-xs text-gray-400 mt-1">{role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
