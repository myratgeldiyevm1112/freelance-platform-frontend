import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, DollarSign, Clock, Users, Briefcase, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getJobById } from '../../api/jobs.api'
import { getProposals } from '../../api/proposals.api'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/button'
import ProposalForm from '../../components/proposals/ProposalForm'

const STATUS_COLORS = {
  open: 'bg-green-500/10 text-green-400 border-green-500/20',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [proposalOpen, setProposalOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJobById(id),
  })

  const { data: proposalsData } = useQuery({
    queryKey: ['proposals', id],
    queryFn: () => getProposals(id),
    enabled: user?.role === 'client',
  })

  const job = data?.data
  const proposals = proposalsData?.data ?? []

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="text-indigo-500 animate-spin" />
    </div>
  )

  if (isError || !job) return (
    <div className="text-center py-20">
      <p className="text-red-400">Job not found.</p>
      <Button onClick={() => navigate('/jobs')} className="mt-4" variant="outline">
        Back to Jobs
      </Button>
    </div>
  )

  const statusColor = STATUS_COLORS[job.status] || STATUS_COLORS.open

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </button>

      {/* Main card */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 mr-4">
            <h1 className="text-white text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-3 text-[#a1a1aa] text-sm">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{job.proposals_count ?? 0} proposals</span>
              </div>
            </div>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full border shrink-0 ${statusColor}`}>
            {job.status}
          </span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3">Description</h2>
          <p className="text-[#a1a1aa] text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 mb-6 p-4 bg-[#0a0a0a] rounded-lg">
          <DollarSign size={18} className="text-green-400" />
          <div>
            <p className="text-[#a1a1aa] text-xs">Budget</p>
            <p className="text-white font-semibold">${job.budget}</p>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="text-sm px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client info */}
        {job.client && (
          <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {job.client.full_name?.[0]?.toUpperCase() ?? 'C'}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{job.client.full_name}</p>
              <p className="text-[#a1a1aa] text-xs">Client</p>
            </div>
          </div>
        )}

        {/* Freelancer action */}
        {user?.role === 'freelancer' && job.status === 'open' && (
          <Button
            onClick={() => setProposalOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Briefcase size={16} className="mr-2" />
            Submit Proposal
          </Button>
        )}

        {/* Client proposals list */}
        {user?.role === 'client' && (
          <div className="pt-6 border-t border-[#2a2a2a]">
            <h2 className="text-white font-semibold mb-4">
              Proposals ({proposals.length})
            </h2>
            {proposals.length === 0 ? (
              <p className="text-[#a1a1aa] text-sm">No proposals yet.</p>
            ) : (
              <div className="space-y-3">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white text-sm font-medium">
                        {proposal.freelancer?.full_name ?? 'Freelancer'}
                      </p>
                      <span className="text-green-400 text-sm font-semibold">
                        ${proposal.proposed_rate}
                      </span>
                    </div>
                    <p className="text-[#a1a1aa] text-xs mb-2">
                      {proposal.delivery_days} days delivery
                    </p>
                    <p className="text-[#a1a1aa] text-sm line-clamp-2">
                      {proposal.cover_letter}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      <ProposalForm
        jobId={id}
        open={proposalOpen}
        onClose={() => setProposalOpen(false)}
      />
    </div>
  )
}

export default JobDetailPage