import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Loader2, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import useAuthStore from '../../store/authStore'
import { getJobs } from '../../api/jobs.api'
import { getProposals, updateProposal } from '../../api/proposals.api'
import { Button } from '../../components/ui/button'

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  accepted: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function ProposalsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Для клиента — берём его вакансии, потом пропозалы к ним
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => getJobs({ limit: 50 }),
    enabled: user?.role === 'client',
  })

  const jobs = jobsData?.data?.items ?? jobsData?.data ?? []

  const mutation = useMutation({
    mutationFn: ({ proposalId, status }) => updateProposal(proposalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] })
      queryClient.invalidateQueries({ queryKey: ['proposals'] })
      toast.success('Proposal updated!')
    },
    onError: () => toast.error('Failed to update proposal'),
  })

  if (jobsLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="text-indigo-500 animate-spin" />
    </div>
  )

  // Фрилансер — направляем на jobs
  if (user?.role === 'freelancer') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-white text-2xl font-bold">My Proposals</h1>
          <p className="text-[#a1a1aa] text-sm mt-1">Track your submitted proposals</p>
        </div>
        <div className="text-center py-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
          <p className="text-[#a1a1aa] mb-4">Browse jobs and submit proposals to see them here.</p>
          <Button
            onClick={() => navigate('/jobs')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Browse Jobs
          </Button>
        </div>
      </div>
    )
  }

  // Клиент — показываем его вакансии с пропозалами
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Received Proposals</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">Manage proposals from freelancers</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#a1a1aa]">No jobs posted yet.</p>
          <Button
            onClick={() => navigate('/jobs/create')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Post a Job
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <JobProposals
              key={job.id}
              job={job}
              mutation={mutation}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function JobProposals({ job, mutation, navigate }) {
  const { data } = useQuery({
    queryKey: ['proposals', job.id],
    queryFn: () => getProposals(job.id),
  })

  const proposals = data?.data ?? []

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => navigate(`/jobs/${job.id}`)}
      >
        <h2 className="text-white font-semibold hover:text-indigo-400 transition-colors">
          {job.title}
        </h2>
        <span className="text-[#a1a1aa] text-xs">{proposals.length} proposals</span>
      </div>

      {proposals.length === 0 ? (
        <p className="text-[#a1a1aa] text-sm">No proposals yet.</p>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-medium">
                  {proposal.freelancer?.full_name ?? 'Freelancer'}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[proposal.status] ?? STATUS_COLORS.pending}`}>
                  {proposal.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#a1a1aa] text-xs mb-2">
                <div className="flex items-center gap-1">
                  <DollarSign size={12} />
                  <span>${proposal.proposed_rate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{proposal.delivery_days} days</span>
                </div>
                <span className="ml-auto">
                  {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-[#a1a1aa] text-sm line-clamp-2 mb-3">
                {proposal.cover_letter}
              </p>
              {proposal.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => mutation.mutate({ proposalId: proposal.id, status: 'accepted' })}
                    disabled={mutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => mutation.mutate({ proposalId: proposal.id, status: 'rejected' })}
                    disabled={mutation.isPending}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProposalsPage