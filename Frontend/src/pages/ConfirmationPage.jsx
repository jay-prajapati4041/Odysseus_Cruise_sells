import { useParams, useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CheckCircle, Ship, Calendar, MapPin, Clock, Users, Tag, Download, Home } from 'lucide-react'
import { getBooking } from '../api/client'

export default function ConfirmationPage() {
    const { bookingId } = useParams()
    const { state } = useLocation()
    const [booking, setBooking] = useState(state?.booking || null)
    const [cruise, setCruise] = useState(state?.cruise || null)

    // Fallback: fetch if navigated directly
    useEffect(() => {
        if (!booking && bookingId) {
            getBooking(bookingId)
                .then(r => setBooking(r.data.data || r.data))
                .catch(() => { })
        }
    }, [bookingId, booking])

    const fmt = (n) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n ?? 0)

    const depDate = cruise?.departureDate
        ? new Date(cruise.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—'

    const ref = booking?.id?.toString().padStart(8, '0').toUpperCase() || bookingId || '—'

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            {/* Header */}
            <div className="pt-32 pb-16 px-6 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, var(--ocean-900), var(--ocean-700))' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                <div className="relative z-10">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                        <CheckCircle size={40} className="text-white" />
                    </div>
                    <h1 className="font-display text-5xl font-bold text-white mb-3">Booking Confirmed!</h1>
                    <p className="text-white/70 text-lg">Your voyage awaits. Bon voyage! 🚢</p>
                    <div className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full text-sm font-semibold"
                        style={{ background: 'rgba(212,168,67,0.2)', color: 'var(--gold-300)', border: '1px solid rgba(212,168,67,0.35)' }}>
                        Booking Reference: <strong className="ml-1 tracking-widest">OD-{ref}</strong>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

                {/* Cruise details */}
                {cruise && (
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden"
                        style={{ border: '1px solid rgba(10,22,40,0.08)' }}>
                        <div className="px-6 py-4 flex items-center gap-3 text-white"
                            style={{ background: 'linear-gradient(135deg, var(--ocean-800), var(--ocean-600))' }}>
                            <Ship size={20} />
                            <div>
                                <p className="font-display text-xl font-bold">{cruise.name}</p>
                                <p className="text-white/65 text-xs">{cruise.ship}</p>
                            </div>
                        </div>
                        <div className="px-6 py-5 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={14} style={{ color: 'var(--ocean-500)' }} />
                                {cruise.destination}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={14} style={{ color: 'var(--ocean-500)' }} />
                                {depDate}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={14} style={{ color: 'var(--ocean-500)' }} />
                                {cruise.durationNights} nights
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={14} style={{ color: 'var(--ocean-500)' }} />
                                From {cruise.departurePort}
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking summary */}
                {booking && (
                    <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4"
                        style={{ border: '1px solid rgba(10,22,40,0.08)' }}>
                        <h2 className="font-semibold text-lg" style={{ color: 'var(--ocean-900)' }}>
                            Booking Summary
                        </h2>

                        {/* Passengers */}
                        {(booking.passengers || []).map((p, i) => {
                            const band = p.band || (p.age <= 4 ? 'infant' : p.age <= 11 ? 'child' : p.age <= 17 ? 'teen' : 'adult')
                            const emoji = { infant: '🍼', child: '👧', teen: '🧑', adult: '🧑‍💼' }[band] || '👤'
                            const pct = { infant: '0% — FREE', child: '50%', teen: '75%', adult: '100%' }[band] || '—'
                            return (
                                <div key={i} className="flex items-center justify-between py-2"
                                    style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>{emoji}</span>
                                        <span className="text-gray-700 capitalize">{band}</span>
                                        {p.age !== undefined && <span className="text-gray-400 text-xs">(Age {p.age} · {pct})</span>}
                                    </div>
                                    <span className={`font-semibold text-sm ${p.fare === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                        {p.fare === 0 ? 'FREE' : fmt(p.fare)}
                                    </span>
                                </div>
                            )
                        })}

                        {/* Total */}
                        {booking.total !== undefined && (
                            <div className="flex items-center justify-between pt-2">
                                <span className="font-bold text-gray-800">Total Paid</span>
                                <span className="font-display text-2xl font-bold" style={{ color: 'var(--ocean-800)' }}>
                                    {fmt(booking.total)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* What happens next */}
                <div className="bg-white rounded-3xl shadow-sm p-6"
                    style={{ border: '1px solid rgba(10,22,40,0.08)' }}>
                    <h2 className="font-semibold text-lg mb-4" style={{ color: 'var(--ocean-900)' }}>
                        What happens next?
                    </h2>
                    <ul className="space-y-3">
                        {[
                            { icon: '📧', text: 'A confirmation email will be sent within 15 minutes.' },
                            { icon: '📄', text: 'Your e-ticket and cruise pack will follow 4 weeks before departure.' },
                            { icon: '💬', text: 'Our crew team will call you to discuss any special requirements.' },
                            { icon: '🛡️', text: 'Your booking is fully ATOL protected — reference OD-' + ref },
                        ].map(({ icon, text }) => (
                            <li key={text} className="flex items-start gap-3 text-sm text-gray-600">
                                <span className="text-lg shrink-0">{icon}</span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold border-2 transition hover:bg-gray-50"
                        style={{ borderColor: 'var(--ocean-400)', color: 'var(--ocean-700)' }}>
                        <Home size={16} /> Back to Home
                    </Link>
                    <Link to="/cruises"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))' }}>
                        <Ship size={16} /> Browse More Cruises
                    </Link>
                </div>

            </div>
        </div>
    )
}
