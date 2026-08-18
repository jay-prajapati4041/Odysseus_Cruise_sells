import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
    Users, Baby, User, ChevronRight, ChevronLeft,
    Tag, CheckCircle, XCircle, Loader2, Ship, MapPin, Clock, Calendar
} from 'lucide-react'
import { getCruise, getPrice, validatePromo, createBooking } from '../api/client'
import PriceBreakdown from '../components/PriceBreakdown'

/* ─── Step indicator ─────────────────────────────────────────────────────── */
function StepBar({ current }) {
    const steps = ['Travellers', 'Ages', 'Extras', 'Review & Pay']
    return (
        <div className="flex items-center justify-center gap-0 mb-10">
            {steps.map((label, i) => {
                const done = i < current
                const active = i === current
                return (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${done ? 'text-white' :
                                active ? 'text-white scale-110' :
                                    'text-gray-400 border-2 border-gray-200'
                                }`}
                                style={done ? { background: '#22c55e' } :
                                    active ? { background: 'var(--ocean-700)' } : {}}>
                                {done ? <CheckCircle size={18} /> : i + 1}
                            </div>
                            <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${active ? 'text-ocean' : 'text-gray-400'}`}
                                style={active ? { color: 'var(--ocean-700)' } : {}}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="mx-2 mb-5 h-0.5 w-10 md:w-16 rounded transition-all duration-300"
                                style={{ background: i < current ? '#22c55e' : '#e5e7eb' }} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

/* ─── Age band helper ────────────────────────────────────────────────────── */
function getBand(age) {
    if (age <= 4) return { label: 'Infant', pct: '0% — FREE', emoji: '🍼', color: '#22c55e' }
    if (age <= 11) return { label: 'Child', pct: '50% of adult fare', emoji: '👧', color: '#f59e0b' }
    if (age <= 17) return { label: 'Teen', pct: '75% of adult fare', emoji: '🧑', color: '#6366f1' }
    return { label: 'Adult', pct: '100% of adult fare', emoji: '🧑‍💼', color: '#3b82f6' }
}

/* ─── Cruise summary card ────────────────────────────────────────────────── */
function CruiseSummaryCard({ cruise }) {
    if (!cruise) return <div className="rounded-2xl shimmer h-28" />
    const dep = new Date(cruise.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    return (
        <div className="rounded-2xl overflow-hidden shadow-sm"
            style={{ border: '1px solid rgba(10,22,40,0.1)' }}>
            <div className="px-5 py-4 text-white flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, var(--ocean-800), var(--ocean-600))' }}>
                <Ship size={20} />
                <div>
                    <p className="font-display text-lg font-bold leading-tight">{cruise.name}</p>
                    <p className="text-white/70 text-xs">{cruise.ship}</p>
                </div>
            </div>
            <div className="px-5 py-3 flex flex-wrap gap-4 text-xs text-gray-500 bg-gray-50">
                <span className="flex items-center gap-1.5"><MapPin size={12} />{cruise.destination}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} />{dep}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} />{cruise.durationNights} nights</span>
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--ocean-700)' }}>
                    From £{cruise.baseAdultPrice?.toLocaleString()} per adult
                </span>
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function BookingPage() {
    const { cruiseId } = useParams()
    const navigate = useNavigate()

    const [step, setStep] = useState(0)
    const [cruise, setCruise] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
    const [bookingError, setBookingError] = useState('')

    // Step 1 – traveller counts
    const [numAdults, setNumAdults] = useState(2)
    const [numChildren, setNumChildren] = useState(0)

    // Step 2 – children ages
    const [childAges, setChildAges] = useState([])

    // Step 3 – services
    const [availableServices, setAvailableServices] = useState([])
    const [selectedServices, setSelectedServices] = useState([])

    // Step 4 – promo
    const [promoInput, setPromoInput] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [promoStatus, setPromoStatus] = useState(null) // { valid, message }
    const [promoLoading, setPromoLoading] = useState(false)

    // Price breakdown
    const [breakdown, setBreakdown] = useState(null)
    const [priceLoading, setPriceLoading] = useState(false)

    // ── Load cruise ─────────────────────────────────────────────────────────
    useEffect(() => {
        getCruise(cruiseId)
            .then(r => {
                const c = r.data.data || r.data
                setCruise(c)
                setAvailableServices(c.services || [])
            })
            .catch(() => navigate('/cruises'))
            .finally(() => setLoading(false))
    }, [cruiseId, navigate])

    // ── Sync child age slots ──────────────────────────────────────────────
    useEffect(() => {
        setChildAges(prev => {
            const next = Array.from({ length: numChildren }, (_, i) =>
                prev[i] !== undefined ? prev[i] : ''
            )
            return next
        })
    }, [numChildren])

    // ── Build price payload ───────────────────────────────────────────────
    const buildPayload = useCallback(() => {
        return {
            cruiseId,
            adults: numAdults,
            children: childAges.filter(a => a !== '').map(a => ({ age: Number(a) })),
            serviceIds: selectedServices,
            promoCode: promoCode || undefined,
        }
    }, [cruiseId, numAdults, childAges, selectedServices, promoCode])

    // ── Fetch price breakdown ─────────────────────────────────────────────
    const fetchPrice = useCallback(async () => {
        if (!cruise) return
        const allAgesSet = childAges.every(a => a !== '' && !isNaN(Number(a)))
        if (numChildren > 0 && !allAgesSet) return
        setPriceLoading(true)
        try {
            const r = await getPrice(buildPayload())
            setBreakdown(r.data.data || r.data)
        } catch { /* silent */ }
        finally { setPriceLoading(false) }
    }, [buildPayload, cruise, childAges, numChildren])

    useEffect(() => {
        if (step >= 3) fetchPrice()
    }, [step, fetchPrice, selectedServices, promoCode])

    // ── Validate promo ───────────────────────────────────────────────────
    const handleValidatePromo = async () => {
        if (!promoInput.trim()) return
        setPromoLoading(true)
        setPromoStatus(null)
        try {
            const r = await validatePromo({ ...buildPayload(), promoCode: promoInput.trim().toUpperCase() })
            const d = r.data
            setPromoCode(promoInput.trim().toUpperCase())
            setPromoStatus({ valid: true, message: `✓ ${d.message || 'Promo applied!'}` })
        } catch (err) {
            setPromoCode('')
            const msg = err?.response?.data?.promoError?.message || 'Invalid promo code.'
            setPromoStatus({ valid: false, message: msg })
        } finally {
            setPromoLoading(false)
        }
    }

    // ── Confirm booking ──────────────────────────────────────────────────
    const handleConfirm = async () => {
        setSubmitting(true)
        setBookingError('')
        try {
            const payload = {
                ...buildPayload(),
                leadPassenger: { firstName: 'Guest', lastName: 'Booking', email: 'guest@odysseuscruises.com' },
            }
            const r = await createBooking(payload)
            setShowSuccessOverlay(true)
            setTimeout(() => {
                navigate('/')
            }, 2500)
        } catch (err) {
            setBookingError(err?.response?.data?.message || 'Booking failed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Navigation guards ────────────────────────────────────────────────
    const MAX_PAX = 6
    const totalPax = numAdults + numChildren
    const remaining = MAX_PAX - totalPax
    const canNextStep1 = numAdults >= 1
    // Children must be 0–17; any age ≥ 18 entered should warn
    const canNextStep2 = numChildren === 0 || childAges.every(a => {
        const n = Number(a)
        return a !== '' && !isNaN(n) && n >= 0 && n <= 17
    })

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)', paddingTop: 100 }}>
            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--ocean-600)' }} />
        </div>
    )

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            {/* Page header */}
            <div className="pt-32 pb-10 px-6 text-center"
                style={{ background: 'linear-gradient(160deg, var(--ocean-900), var(--ocean-700))' }}>
                <h1 className="font-display text-4xl font-bold text-white mb-2">Book Your Cruise</h1>
                <p className="text-white/60 text-sm">Secure online booking · Transparent pricing · No hidden fees</p>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-12">
                <StepBar current={step} />

                {/* ── STEP 0: TRAVELLERS ────────────────────────────────────────── */}
                {step === 0 && (
                    <div className="bg-white rounded-3xl shadow-md p-8 space-y-6">
                        <CruiseSummaryCard cruise={cruise} />
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ocean-900)' }}>
                                Who's travelling?
                            </h2>
                            {/* Pax counter badge */}
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${totalPax >= MAX_PAX ? 'text-red-600 bg-red-50' : 'text-white'
                                }`} style={totalPax < MAX_PAX ? { background: 'var(--ocean-700)' } : {}}>
                                {totalPax}/{MAX_PAX} passengers
                            </div>
                        </div>

                        {totalPax >= MAX_PAX && (
                            <div className="text-xs text-red-600 bg-red-50 px-4 py-2 rounded-xl font-medium">
                                ⚠ Maximum 6 passengers per booking reached.
                            </div>
                        )}

                        {/* Adults */}
                        <div className="flex items-center justify-between p-4 rounded-2xl"
                            style={{ background: 'rgba(10,22,40,0.04)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                    style={{ background: 'rgba(59,130,246,0.15)' }}>🧑‍💼</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Adults</p>
                                    <p className="text-xs text-gray-500">Age 18+ · Full adult fare</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
                                    className="w-9 h-9 rounded-full border-2 font-bold text-lg flex items-center justify-center transition hover:bg-gray-100"
                                    style={{ borderColor: 'var(--ocean-500)', color: 'var(--ocean-700)' }}>−</button>
                                <span className="w-6 text-center font-bold text-lg">{numAdults}</span>
                                <button
                                    onClick={() => setNumAdults(Math.min(numAdults + 1, MAX_PAX - numChildren))}
                                    disabled={totalPax >= MAX_PAX}
                                    className="w-9 h-9 rounded-full font-bold text-lg flex items-center justify-center text-white transition hover:opacity-90 disabled:opacity-30"
                                    style={{ background: 'var(--ocean-700)' }}>+</button>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between p-4 rounded-2xl"
                            style={{ background: 'rgba(10,22,40,0.04)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                                    style={{ background: 'rgba(245,158,11,0.15)' }}>👧</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Children</p>
                                    <p className="text-xs text-gray-500">Age 0–17 · Percentage-based fare</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setNumChildren(Math.max(0, numChildren - 1))}
                                    className="w-9 h-9 rounded-full border-2 font-bold text-lg flex items-center justify-center transition hover:bg-gray-100"
                                    style={{ borderColor: 'var(--ocean-500)', color: 'var(--ocean-700)' }}>−</button>
                                <span className="w-6 text-center font-bold text-lg">{numChildren}</span>
                                <button
                                    onClick={() => setNumChildren(Math.min(numChildren + 1, MAX_PAX - numAdults))}
                                    disabled={totalPax >= MAX_PAX}
                                    className="w-9 h-9 rounded-full font-bold text-lg flex items-center justify-center text-white transition hover:opacity-90 disabled:opacity-30"
                                    style={{ background: 'var(--ocean-700)' }}>+</button>
                            </div>
                        </div>

                        {/* Fare legend */}
                        <div className="rounded-2xl p-4 space-y-2"
                            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-600)' }}>
                                Age-Based Fare Rules
                            </p>
                            {[
                                { age: '0 – 4', label: 'Infant', pct: '0% — FREE', color: '#22c55e', emoji: '🍼' },
                                { age: '5 – 11', label: 'Child', pct: '50% of adult fare', color: '#f59e0b', emoji: '👧' },
                                { age: '12 – 17', label: 'Teen', pct: '75% of adult fare', color: '#6366f1', emoji: '🧑' },
                                { age: '18+', label: 'Adult', pct: '100% — Full fare', color: '#3b82f6', emoji: '🧑‍💼' },
                            ].map(({ age, label, pct, color, emoji }) => (
                                <div key={age} className="flex items-center justify-between text-xs">
                                    <span>{emoji} <strong>{label}</strong> <span className="text-gray-400">Age {age}</span></span>
                                    <span className="font-semibold px-2 py-0.5 rounded-full text-white text-[10px]"
                                        style={{ background: color }}>{pct}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setStep(numChildren > 0 ? 1 : 2)} disabled={!canNextStep1}
                            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
                            style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))' }}>
                            Continue <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {/* ── STEP 1: CHILD AGES ──────────────────────────────────────────── */}
                {step === 1 && (
                    <div className="bg-white rounded-3xl shadow-md p-8 space-y-6">
                        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ocean-900)' }}>
                            Children's ages
                        </h2>
                        <p className="text-sm text-gray-500">
                            Enter each child's age (must be <strong className="text-gray-700">0–17</strong>).
                            Ages 0–4 travel free · 5–11 pay 50% · 12–17 pay 75% of adult fare.
                        </p>
                        <div className="space-y-3">
                            {childAges.map((age, i) => {
                                const band = age !== '' && !isNaN(Number(age)) ? getBand(Number(age)) : null
                                return (
                                    <div key={i}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Child {i + 1}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number" min="0" max="17" placeholder="Age (0–17)"
                                                value={age}
                                                onChange={e => {
                                                    const next = [...childAges]
                                                    // Clamp to 0-17 — if 18+ entered, show warning
                                                    next[i] = e.target.value
                                                    setChildAges(next)
                                                }}
                                                className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${age !== '' && Number(age) > 17 ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                                    }`}
                                            />
                                            {age !== '' && Number(age) > 17 && (
                                                <span className="text-xs text-red-500 shrink-0">Age must be 0–17</span>
                                            )}
                                            {band && (
                                                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shrink-0"
                                                    style={{ background: band.color }}>
                                                    {band.emoji} {band.label} · {band.pct}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep(0)}
                                className="flex-1 py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition hover:bg-gray-50"
                                style={{ borderColor: 'var(--ocean-300)', color: 'var(--ocean-700)' }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button onClick={() => setStep(2)} disabled={!canNextStep2}
                                className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))' }}>
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 2: OPTIONAL SERVICES ───────────────────────────────────── */}
                {step === 2 && (
                    <div className="bg-white rounded-3xl shadow-md p-8 space-y-6">
                        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ocean-900)' }}>
                            Optional extras
                        </h2>
                        <p className="text-sm text-gray-500">Enhance your voyage with these optional services.</p>
                        {availableServices.length === 0 ? (
                            <p className="text-gray-400 text-sm">No extras available for this cruise.</p>
                        ) : (
                            <div className="space-y-3">
                                {availableServices.map(svc => {
                                    const selected = selectedServices.includes(svc.id)
                                    return (
                                        <button key={svc.id}
                                            onClick={() => setSelectedServices(prev =>
                                                selected ? prev.filter(id => id !== svc.id) : [...prev, svc.id]
                                            )}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-200"
                                            style={{
                                                borderColor: selected ? 'var(--ocean-500)' : '#e5e7eb',
                                                background: selected ? 'rgba(10,22,40,0.04)' : 'white',
                                            }}>
                                            <div>
                                                <p className="font-semibold text-gray-800">{svc.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{svc.description}</p>
                                                <p className="text-xs mt-1 font-medium" style={{ color: 'var(--ocean-600)' }}>
                                                    £{svc.price} · {svc.pricingType === 'per_person' ? 'per person' : svc.pricingType === 'per_person_per_night' ? 'per person, per night' : 'per booking'}
                                                </p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 transition-all ${selected ? 'text-white' : 'border-gray-300'
                                                }`}
                                                style={selected ? { background: 'var(--ocean-600)', borderColor: 'var(--ocean-600)' } : {}}>
                                                {selected && <CheckCircle size={14} />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button onClick={() => setStep(numChildren > 0 ? 1 : 0)}
                                className="flex-1 py-3 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition hover:bg-gray-50"
                                style={{ borderColor: 'var(--ocean-300)', color: 'var(--ocean-700)' }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button onClick={() => setStep(3)}
                                className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))' }}>
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: REVIEW & PAY ────────────────────────────────────────── */}
                {step === 3 && (
                    <div className="space-y-5">
                        <div className="bg-white rounded-3xl shadow-md p-8 space-y-5">
                            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--ocean-900)' }}>
                                Review & Pay
                            </h2>

                            {/* Promo code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                                    Promotional code (optional)
                                </label>
                                <p className="text-xs text-gray-400 mb-2">
                                    Hint: Try <strong>SUMMER20</strong> (20% off) or <strong>SAVE100</strong> (£100 off)
                                </p>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="e.g. SUMMER25"
                                        value={promoInput}
                                        onChange={e => { setPromoInput(e.target.value); setPromoStatus(null) }}
                                        onKeyDown={e => e.key === 'Enter' && handleValidatePromo()}
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button onClick={handleValidatePromo} disabled={promoLoading || !promoInput.trim()}
                                        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                                        style={{ background: 'var(--ocean-700)' }}>
                                        {promoLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                                {promoStatus && (
                                    <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${promoStatus.valid ? 'text-green-600' : 'text-red-500'}`}>
                                        {promoStatus.valid ? <CheckCircle size={15} /> : <XCircle size={15} />}
                                        {promoStatus.message}
                                    </div>
                                )}
                                {promoCode && (
                                    <button onClick={() => { setPromoCode(''); setPromoInput(''); setPromoStatus(null) }}
                                        className="text-xs text-gray-400 mt-1 hover:text-red-400 transition">
                                        × Remove promo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price breakdown */}
                        {priceLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--ocean-600)' }} />
                            </div>
                        ) : (
                            <PriceBreakdown breakdown={breakdown} />
                        )}

                        {bookingError && (
                            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                                <XCircle size={16} /> {bookingError}
                            </div>
                        )}

                        {/* ── Total price banner ── */}
                        {breakdown && !priceLoading && (
                            <div className="rounded-2xl px-6 py-5 flex items-center justify-between"
                                style={{ background: 'linear-gradient(135deg, var(--ocean-900), var(--ocean-800))' }}>
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">
                                        Total for {numAdults + numChildren} passenger{numAdults + numChildren !== 1 ? 's' : ''}
                                    </p>
                                    <p className="font-display text-3xl font-bold text-white">
                                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(breakdown.grandTotal ?? breakdown.total ?? 0)}
                                    </p>
                                    {breakdown.groupDiscount && (
                                        <p className="text-green-400 text-xs mt-1">
                                            Includes group saving of {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Math.abs(breakdown.groupDiscount.amount))}
                                        </p>
                                    )}
                                    {breakdown.discount && (
                                        <p className="text-green-400 text-xs mt-0.5">
                                            Includes promo saving of {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Math.abs(breakdown.discount.amount))}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl">🛳️</span>
                                    <p className="text-xs text-white/50 mt-1">ATOL Protected</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => setStep(2)}
                                className="flex-1 py-3.5 rounded-xl border-2 font-semibold flex items-center justify-center gap-2 transition hover:bg-gray-50"
                                style={{ borderColor: 'var(--ocean-300)', color: 'var(--ocean-700)' }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button onClick={handleConfirm} disabled={submitting || !breakdown}
                                className="flex-1 py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))', color: 'var(--ocean-900)' }}>
                                {submitting ? <><Loader2 size={16} className="animate-spin" />Processing…</> : <>Confirm Booking ✓</>}
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400">
                            🔒 Secure booking · ATOL Protected · No payment taken now
                        </p>
                    </div>
                )}
            </div>

            {/* Success Overlay Animation */}
            {showSuccessOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
                    <div className="bg-white px-10 py-10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-auto"
                        style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-green-500 shadow-[0_10px_20px_rgba(34,197,94,0.3)]">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center tracking-tight">Booking Confirmed!</h2>
                        <p className="text-gray-500 text-sm text-center">Letting the captain know... Redirecting to home.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
