import { Link } from 'react-router-dom'
import { MapPin, Clock, Calendar, ArrowRight, Ship } from 'lucide-react'

// Colour per destination
const destColor = {
    'Mediterranean': { bg: '#0ea5e9', light: '#e0f2fe' },
    'Norwegian': { bg: '#6366f1', light: '#ede9fe' },
    'Caribbean': { bg: '#10b981', light: '#d1fae5' },
    'Alaska': { bg: '#3b82f6', light: '#dbeafe' },
    'Arabian': { bg: '#f59e0b', light: '#fef3c7' },
}

function getBadge(cruise) {
    for (const key of Object.keys(destColor)) {
        if (cruise.destination.includes(key) || cruise.name.includes(key))
            return destColor[key]
    }
    return { bg: 'var(--ocean-600)', light: '#e0f2fe' }
}

// Destination emoji
const destEmoji = { 'Mediterranean': '🌊', 'Norwegian': '🏔️', 'Caribbean': '🌴', 'Alaska': '🦅', 'Arabian': '☀️' }
function getEmoji(cruise) {
    for (const key of Object.keys(destEmoji))
        if (cruise.destination.includes(key) || cruise.name.includes(key)) return destEmoji[key]
    return '⚓'
}

export default function CruiseCard({ cruise }) {
    const badge = getBadge(cruise)
    const emoji = getEmoji(cruise)
    const dep = new Date(cruise.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 group border border-gray-100">
            {/* Card top banner */}
            <div className="h-44 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, var(--ocean-800), ${badge.bg})` }}>
                <span className="text-6xl">{emoji}</span>
                {/* Ship name pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium glass text-white">
                    <Ship size={11} /> {cruise.ship}
                </div>
                {/* Duration pill */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: badge.bg, color: '#fff' }}>
                    <Clock size={11} /> {cruise.durationNights} nights
                </div>
            </div>

            {/* Card body */}
            <div className="p-5 space-y-3">
                <div>
                    <h3 className="font-display text-xl font-bold leading-tight group-hover:text-blue-700 transition-colors"
                        style={{ color: 'var(--ocean-900)' }}>
                        {cruise.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <MapPin size={11} /> {cruise.destination}
                    </p>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{cruise.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={11} /> Departs {dep} from {cruise.departurePort}
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">From</p>
                        <p className="font-display text-2xl font-bold" style={{ color: 'var(--ocean-800)' }}>
                            £{cruise.baseAdultPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">per adult</p>
                    </div>
                    <Link to={`/book/${cruise.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))', color: '#fff' }}>
                        Book <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
