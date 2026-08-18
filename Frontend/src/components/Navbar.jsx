import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Ship, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setMenuOpen(false) }, [location])

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/cruises', label: 'Cruises' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ]

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
            <div
                className="pointer-events-auto mt-5 mx-5 w-full max-w-5xl transition-all duration-500"
                style={{
                    borderRadius: '999px',
                    background: scrolled
                        ? 'rgba(10, 22, 40, 0.80)'
                        : 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: scrolled
                        ? '1px solid rgba(255,255,255,0.14)'
                        : '1px solid rgba(255,255,255,0.25)',
                    boxShadow: scrolled
                        ? '0 10px 50px rgba(0,0,0,0.40)'
                        : '0 4px 28px rgba(0,0,0,0.18)',
                }}
            >
                <div className="flex items-center justify-between px-7 py-3.5">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div
                            className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, var(--gold-500), var(--gold-300))' }}
                        >
                            <Ship size={20} style={{ color: 'var(--ocean-900)' }} />
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <span className="font-display text-xl font-bold text-white block">Odysseus</span>
                            <span className="text-[10px] tracking-[3px] uppercase font-semibold" style={{ color: 'var(--gold-400)' }}>
                                Cruises
                            </span>
                        </div>
                    </Link>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={to === '/'}
                                    className={({ isActive }) =>
                                        `px-5 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-200 ${isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`
                                    }
                                    style={({ isActive }) => isActive ? { color: 'var(--gold-300)' } : {}}
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* CTA + hamburger */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/cruises"
                            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            style={{
                                background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
                                color: 'var(--ocean-900)',
                            }}
                        >
                            Book Now
                        </Link>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-white p-2.5 rounded-full transition hover:bg-white/15"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {menuOpen && (
                    <div className="md:hidden px-5 pb-5 pt-2 space-y-1.5"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                        {navLinks.map(({ to, label }) => (
                            <NavLink key={to} to={to} end={to === '/'}
                                className={({ isActive }) =>
                                    `block px-5 py-3 rounded-full text-[15px] font-semibold transition-all ${isActive ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white hover:bg-white/10'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                        <Link to="/cruises"
                            className="block text-center px-5 py-3 mt-2 rounded-full text-[15px] font-bold"
                            style={{ background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))', color: 'var(--ocean-900)' }}
                        >
                            Book a Cruise
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
