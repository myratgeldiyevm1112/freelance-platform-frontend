import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { submitProposal } from '../../api/proposals.api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

const schema = z.object({
  cover_letter: z.string().min(100, 'Cover letter must be at least 100 characters'),
  proposed_rate: z.coerce.number().min(1, 'Rate must be at least 1'),
  delivery_days: z.coerce.number().min(1, 'Must be at least 1 day'),
})

function ProposalForm({ jobId, open, onClose }) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data) => submitProposal(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals', jobId] })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      toast.success('Proposal submitted successfully!')
      reset()
      onClose()
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to submit proposal')
    },
  })

  const onSubmit = (data) => mutation.mutate(data)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">
            Submit Proposal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Proposed Rate */}
          <div>
            <Label className="text-[#a1a1aa] text-sm mb-1.5 block">
              Your Rate ($)
            </Label>
            <Input
              {...register('proposed_rate')}
              type="number"
              placeholder="e.g. 800"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
            />
            {errors.proposed_rate && (
              <p className="text-red-400 text-xs mt-1">{errors.proposed_rate.message}</p>
            )}
          </div>

          {/* Delivery Days */}
          <div>
            <Label className="text-[#a1a1aa] text-sm mb-1.5 block">
              Delivery Time (days)
            </Label>
            <Input
              {...register('delivery_days')}
              type="number"
              placeholder="e.g. 14"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
            />
            {errors.delivery_days && (
              <p className="text-red-400 text-xs mt-1">{errors.delivery_days.message}</p>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <Label className="text-[#a1a1aa] text-sm mb-1.5 block">
              Cover Letter
            </Label>
            <textarea
              {...register('cover_letter')}
              rows={5}
              placeholder="Describe why you're the best fit for this project..."
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-[#52525b] rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            {errors.cover_letter && (
              <p className="text-red-400 text-xs mt-1">{errors.cover_letter.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2a2a2a] text-[#a1a1aa] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {mutation.isPending ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Submitting...</>
              ) : (
                'Submit Proposal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProposalForm