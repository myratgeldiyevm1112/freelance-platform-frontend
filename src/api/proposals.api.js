import api from './axios'

export const submitProposal = (jobId, data) =>
  api.post(`/proposals/jobs/${jobId}/proposals`, data)

export const getProposals = (jobId) =>
  api.get(`/proposals/jobs/${jobId}/proposals`)

export const updateProposal = (proposalId, status) =>
  api.patch(`/proposals/${proposalId}`, { status })