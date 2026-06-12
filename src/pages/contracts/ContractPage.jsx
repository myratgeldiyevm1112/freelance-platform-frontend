import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, DollarSign, Clock, User, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { getContract, updateContractStatus } from '../../api/contracts.api'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/button'

const STATUS_COLORS = {
  active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function ContractPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => getContract(id),
  })

  const mutation = useMutation({
    mutationFn: (status) => updateContractStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      toast.success('Contract updated!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to update contract')
    },
  })

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="text-indigo-500 animate-spin" />
    </div>
  )

  if (isError) return (
    <div className="text-center py-20">
      <p className="text-red-400">Contract not found.</p>
      <Button onClick={() => navigate('/dashboard')} className="mt-4" variant="outline">
        Go to Dashboard
      </Button>
    </div>
  )

  const contract = data?.data
  const statusColor = STATUS_COLORS[contract?.status] ?? STATUS_COLORS.active

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Main card */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Contract</h1>
            <p className="text-[#a1a1aa] text-sm">
              {contract?.job?.title ?? 'Job'}
            </p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full border ${statusColor}`}>
            {contract?.status}
          </span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-[#0a0a0a] rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-green-400" />
              <span className="text-[#a1a1aa] text-xs">Amount</span>
            </div>
            <p className="text-white font-semibold">${contract?.amount ?? 0}</p>
          </div>
          <div className="p-4 bg-[#0a0a0a] rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-blue-400" />
              <span className="text-[#a1a1aa] text-xs">Created</span>
            </div>
            <p className="text-white font-semibold text-sm">
              {contract?.created_at
                ? formatDistanceToNow(new Date(contract.created_at), { addSuffix: true })
                : '—'}
            </p>
          </div>
          <div className="p-4 bg-[#0a0a0a] rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={14} className="text-indigo-400" />
              <span className="text-[#a1a1aa] text-xs">Status</span>
            </div>
            <p className="text-white font-semibold capitalize">{contract?.status}</p>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {contract?.client && (
            <div className="p-4 bg-[#0a0a0a] rounded-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {contract.client.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{contract.client.full_name}</p>
                <p className="text-[#a1a1aa] text-xs">Client</p>
              </div>
            </div>
          )}
          {contract?.freelancer && (
            <div className="p-4 bg-[#0a0a0a] rounded-lg flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
                {contract.freelancer.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{contract.freelancer.full_name}</p>
                <p className="text-[#a1a1aa] text-xs">Freelancer</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {contract?.status === 'active' && (
          <div className="flex gap-3 pt-4 border-t border-[#2a2a2a]">
            {user?.role === 'client' && (
              <Button
                onClick={() => mutation.mutate('completed')}
                disabled={mutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {mutation.isPending
                  ? <Loader2 size={16} className="animate-spin" />
                  : 'Mark as Completed'}
              </Button>
            )}
            <Button
              onClick={() => mutation.mutate('cancelled')}
              disabled={mutation.isPending}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Cancel Contract
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContractPage