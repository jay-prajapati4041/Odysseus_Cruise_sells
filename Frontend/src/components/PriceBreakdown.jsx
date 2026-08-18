import { Users, Tag, Percent, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

/*
  PriceBreakdown – renders itemised fare from the /api/bookings/price response
  Props:
    breakdown: object returned by POST /api/bookings/price
    compact: bool – show condensed version (no per-passenger rows)
*/
export default function PriceBreakdown({ breakdown, compact = false }) {
    if (!breakdown) return null

    const {
        passengers = [],
        services = [],
        subtotal,
        promoDiscount,
        total,
        promoCode,
        currency = 'GBP',
    } = breakdown

    const fmt = (n) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(n)

    const ageBandLabel = (band) => {
        const map = {
            infant: { label: 'Infant (0–4)', emoji: '🍼', pct: '0%' },
            child: { label: 'Child (5–11)', emoji: '👧', pct: '50%' },
            teen: { label: 'Teen (12–17)', emoji: '🧑', pct: '75%' },
            adult: { label: 'Adult (18+)', emoji: '🧑‍💼', pct: '100%' },
        }
        return map[band] || { label: band, emoji: '👤', pct: '—' }
    }

    return (
        <div className="rounded-2xl overflow-hidden text-sm"
            style={{ border: '1px solid rgba(10,22,40,0.12)' }}>

            {/* Header */}
            <div className="px-5 py-3 flex items-center gap-2 font-semibold text-white"
                style={{ background: 'var(--ocean-800)' }}>
                <Tag size={15} /> Price Breakdown
            </div>

            {/* Passengers */}
            {!compact && passengers.length > 0 && (
                <div>
                    <div className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-gray-50"
                        style={{ color: 'var(--ocean-600)', borderBottom: '1px solid #e5e7eb' }}>
                        <Users size={12} className="inline mr-1.5" />Passengers
                    </div>
                    {passengers.map((p, i) => {
                        const band = ageBandLabel(p.band)
                        return (
                            <div key={i}
                                className="flex items-center justify-between px-5 py-3"
                                style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <div className="flex items-center gap-2">
                                    <span>{band.emoji}</span>
                                    <div>
                                        <p className="font-medium text-gray-800">{band.label}</p>
                                        {p.age !== undefined && (
                                            <p className="text-xs text-gray-400">Age {p.age} · {band.pct} of adult fare</p>
                                        )}
                                    </div>
                                </div>
                                <span className={`font-semibold ${p.fare === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                                    {p.fare === 0 ? 'FREE' : fmt(p.fare)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Services */}
            {services.length > 0 && (
                <div>
                    <div className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-gray-50"
                        style={{ color: 'var(--ocean-600)', borderBottom: '1px solid #e5e7eb' }}>
                        ✦ Optional Services
                    </div>
                    {services.map((s, i) => (
                        <div key={i}
                            className="flex items-center justify-between px-5 py-3"
                            style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <div>
                                <p className="font-medium text-gray-800">{s.name}</p>
                                <p className="text-xs text-gray-400">
                                    {s.type === 'per_person' ? 'Per person' : 'Per booking'}
                                </p>
                            </div>
                            <span className="font-semibold text-gray-800">{fmt(s.total)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Subtotal / promo / total */}
            <div className="px-5 py-4 space-y-2 bg-gray-50">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{fmt(subtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span className="flex items-center gap-1">
                            <Percent size={13} /> Promo ({promoCode})
                        </span>
                        <span>− {fmt(promoDiscount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2"
                    style={{ borderTop: '1px solid #e5e7eb', color: 'var(--ocean-900)' }}>
                    <span>Total</span>
                    <span>{fmt(total)}</span>
                </div>
            </div>
        </div>
    )
}
