import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
})

export const getCruises = () => api.get('/cruises')
export const getCruise = (id) => api.get(`/cruises/${id}`)
export const getPrice = (payload) => api.post('/bookings/price', payload)
export const validatePromo = (payload) => api.post('/bookings/validate-promo', payload)
export const createBooking = (payload) => api.post('/bookings', payload)
export const getBooking = (id) => api.get(`/bookings/${id}`)

export default api
