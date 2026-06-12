import api from './axios'

export const createPayment = (data) => api.post('/payments', data)
export const releasePayment = (id) => api.post(`/payments/${id}/release`)
export const refundPayment = (id) => api.post(`/payments/${id}/refund`)