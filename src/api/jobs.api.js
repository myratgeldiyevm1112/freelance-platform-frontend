import api from './axios'

export const getJobs = (params) => api.get('/jobs/', { params })
export const getJobById = (id) => api.get(`/jobs/${id}`)
export const createJob = (data) => api.post('/jobs/', data)