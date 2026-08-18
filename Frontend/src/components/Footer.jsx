import { Link } from 'react-router-dom'
import { Ship, Phone, Mail, MapPin, ChevronRight, Globe, Share2, Rss, Video } from 'lucide-react'

export default function Footer() {
    const year = new Date().getFullYear()

    const destinations = [
        'Mediterranean Cruises',
        'Norwegian Fjords',
        'Caribbean Islands',
        'Alaska Wilderness',
        'Arabian Gulf',
        'Baltic Sea',
    ]

    const quickLinks = [
        { to: '/', label: 'Home' },
        { to: '/cruises', label: 'Browse Cruises' },
        { to: '/about', label: 'About Odysseus' },
        { to: '/contact', label: 'Contact Us' },
    ]

    const legal = [
        'Terms & Conditions',
        'Privacy Policy',
        'Cookie Policy',
        'ATOL Protection',
    ]

    return (
        <footer style={{ background: 'var(--ocean-900)', color: 'rgba(255,255,255,0.75)' }}>
            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand column */}
                <div className="space-y-5">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, var(--gold-500), var(--gold-300))' }}>
                            <Ship size={20} style={{ color: 'var(--ocean-900)' }} />
                        </div>
                        <div>
                            <span className="font-display text-xl font-bold text-white block leading-tight">Odysseus</span>
                            <span className="text-xs tracking-[3px] uppercase font-medium" style={{ color: 'var(--gold-400)' }}>Cruises</span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed">
                        Sailing the world's most breathtaking seas since 1998. Award-winning luxury cruises for discerning travellers.
                    </p>
                    {/* Social */}
                    <div className="flex items-center gap-3 pt-1">
                        {[Globe, Share2, Rss, Video].map((Icon, i) => (
                            <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold-400)' }}>
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Destinations */}
                <div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
                        style={{ color: 'var(--gold-400)' }}>Destinations</h3>
                    <ul className="space-y-2.5">
                        {destinations.map((d) => (
                            <li key={d}>
                                <Link to="/cruises"
                                    className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-150 group">
                                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" style={{ color: 'var(--gold-500)' }} />
                                    {d}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick links */}
                <div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
                        style={{ color: 'var(--gold-400)' }}>Quick Links</h3>
                    <ul className="space-y-2.5">
                        {quickLinks.map(({ to, label }) => (
                            <li key={to}>
                                <Link to={to}
                                    className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-150 group">
                                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" style={{ color: 'var(--gold-500)' }} />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-5"
                        style={{ color: 'var(--gold-400)' }}>Get In Touch</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-sm">
                            <Phone size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--gold-400)' }} />
                            <div>
                                <p className="text-white font-medium">0800 123 4567</p>
                                <p className="text-xs">Mon–Fri 8am–8pm, Sat–Sun 9am–5pm</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <Mail size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--gold-400)' }} />
                            <div>
                                <p className="text-white font-medium">ahoy@odysseuscruises.com</p>
                                <p className="text-xs">We reply within 24 hours</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <MapPin size={15} className="shrink-0 mt-0.5" style={{ color: 'var(--gold-400)' }} />
                            <div>
                                <p className="text-white font-medium">Odysseus House</p>
                                <p className="text-xs">12 Harbour View, Southampton SO14 3TL</p>
                            </div>
                        </li>
                    </ul>
                    {/* ATOL badge */}
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(212,168,67,0.15)', color: 'var(--gold-400)', border: '1px solid rgba(212,168,67,0.3)' }}>
                        ✈ ATOL Protected – No. 12345
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t px-6 py-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                    <p>© {year} Odysseus Cruises Ltd. All rights reserved. Registered in England & Wales No. 987654.</p>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        {legal.map((l) => (
                            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
