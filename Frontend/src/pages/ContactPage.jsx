import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!form.name.trim()) e.name = 'Name is required'
        if (!form.email.trim()) e.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
        if (!form.message.trim()) e.message = 'Message is required'
        return e
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setErrors({})
        setSent(true)
    }

    const field = (id, label, type = 'text', required = false) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ocean-800)' }}>
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
                id={id} type={type} placeholder={`Your ${label.toLowerCase()}`}
                value={form[id]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${errors[id] ? 'border-red-400' : 'border-gray-200'
                    }`}
            />
            {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
        </div>
    )

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            {/* Header */}
            <div className="pt-36 pb-20 px-6 text-center"
                style={{ background: 'linear-gradient(160deg, var(--ocean-900), var(--ocean-700))' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-400)' }}>✦ Say Hello</p>
                <h1 className="font-display text-5xl font-bold text-white mb-4">Contact Us</h1>
                <p className="text-white/65 max-w-xl mx-auto">
                    Our friendly team is ready to help with any questions about your upcoming voyage.
                </p>
            </div>

            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Info column */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-display text-3xl font-bold mb-3" style={{ color: 'var(--ocean-900)' }}>
                                We'd Love To Hear From You
                            </h2>
                            <p className="text-gray-500 leading-relaxed">
                                Whether you have a question about a cruise itinerary, need help with your booking, or just want to say hello — we're here.
                            </p>
                        </div>

                        {[
                            { icon: Phone, title: 'Phone', lines: ['0800 123 4567', '(Calls from UK mobiles are free)'] },
                            { icon: Mail, title: 'Email', lines: ['ahoy@odysseuscruises.com', 'We reply within 24 hours'] },
                            { icon: MapPin, title: 'Address', lines: ['Odysseus House, 12 Harbour View,', 'Southampton SO14 3TL, United Kingdom'] },
                            { icon: Clock, title: 'Opening Hours', lines: ['Monday–Friday: 8am–8pm', 'Saturday–Sunday: 9am–5pm'] },
                        ].map(({ icon: Icon, title, lines }) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                    style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))' }}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold mb-1" style={{ color: 'var(--ocean-800)' }}>{title}</p>
                                    {lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form column */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        {sent ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                <CheckCircle size={56} className="mb-4" style={{ color: 'var(--ocean-600)' }} />
                                <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--ocean-900)' }}>Message Sent!</h3>
                                <p className="text-gray-500">Thanks {form.name}. We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <h3 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--ocean-900)' }}>
                                    Send Us A Message
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {field('name', 'Name', 'text', true)}
                                    {field('email', 'Email', 'email', true)}
                                </div>
                                {field('phone', 'Phone number', 'tel')}

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ocean-800)' }}>
                                        Subject
                                    </label>
                                    <select id="subject" value={form.subject}
                                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                                        <option value="">Select a topic…</option>
                                        <option>Booking enquiry</option>
                                        <option>Cruise information</option>
                                        <option>Promotional code</option>
                                        <option>Accessibility needs</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ocean-800)' }}>
                                        Message<span className="text-red-400 ml-0.5">*</span>
                                    </label>
                                    <textarea id="message" rows={5} placeholder="How can we help you?"
                                        value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition ${errors.message ? 'border-red-400' : 'border-gray-200'
                                            }`} />
                                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                                </div>

                                <button type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, var(--ocean-700), var(--ocean-600))', color: '#fff' }}>
                                    <Send size={16} /> Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
