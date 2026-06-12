import api from './axios'

export const getContract = (id) => api.get(`/contracts/${id}`)
export const updateContractStatus = (id, status) =>
  api.patch(`/contracts/${id}/status`, { status })