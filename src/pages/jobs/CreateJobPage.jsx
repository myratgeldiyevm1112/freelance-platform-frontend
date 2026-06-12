import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createJob } from '../../api/jobs.api'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const schema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  budget: z.coerce.number().min(1, 'Budget must be at least 1'),
})

function CreateJobPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job posted successfully!')
      navigate(`/jobs/${res.data.id}`)
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to create job')
    },
  })

  const onSubmit = (data) => mutation.mutate({
    ...data,
    required_skills: [],
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Post a Job</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">
          Find the perfect freelancer for your project
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Title */}
          <div>
            <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Job Title</Label>
            <Input
              {...register('title')}
              placeholder="e.g. Build a React dashboard with Tailwind CSS"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Description</Label>
            <textarea
              {...register('description')}
              rows={6}
              placeholder="Describe the project in detail — requirements, goals, deliverables..."
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-[#52525b] rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Budget */}
          <div>
            <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Budget ($)</Label>
            <Input
              {...register('budget')}
              type="number"
              placeholder="e.g. 1000"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
            />
            {errors.budget && (
              <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/jobs')}
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
                <><Loader2 size={16} className="mr-2 animate-spin" /> Posting...</>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateJobPage