import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { getCruises } from '../api/client'
import CruiseCard from '../components/CruiseCard'

export default function CruisesPage() {
    const [cruises, setCruises] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')

    useEffect(() => {
        getCruises()
            .then(r => setCruises(r.data.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const filtered = cruises
        .filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.destination.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.baseAdultPrice - b.baseAdultPrice
            if (sortBy === 'price-desc') return b.baseAdultPrice - a.baseAdultPrice
            if (sortBy === 'duration') return a.durationNights - b.durationNights
            return 0
        })

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            {/* Page header */}
            <div className="pt-36 pb-14 px-6 text-center"
                style={{ background: 'linear-gradient(160deg, var(--ocean-900), var(--ocean-700))' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-400)' }}>
                    ✦ Our Fleet
                </p>
                <h1 className="font-display text-5xl font-bold text-white mb-4">
                    Available Cruises
                </h1>
                <p className="text-white/65 max-w-xl mx-auto">
                    Browse our full fleet of luxury cruise itineraries. Select one to get a full price breakdown and book your voyage.
                </p>
            </div>

            {/* Filter bar */}
            <div className="max-w-5xl mx-auto px-6 -mt-6 mb-10">
                <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by cruise or destination…"
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            className="pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer bg-white appearance-none"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="default">Sort: Featured</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="duration">Duration: Shortest</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="rounded-2xl shimmer h-80" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4">⚓</p>
                        <p className="text-gray-400 text-lg">No cruises match your search.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-400 mb-6">{filtered.length} cruise{filtered.length !== 1 ? 's' : ''} found</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(c => <CruiseCard key={c.id} cruise={c} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
