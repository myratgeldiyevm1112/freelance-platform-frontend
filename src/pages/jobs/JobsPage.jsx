import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Loader2 } from 'lucide-react'
import { getJobs } from '../../api/jobs.api'
import JobCard from '../../components/jobs/JobCard'
import { Input } from '../../components/ui/input'

function JobsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', search, status, page],
    queryFn: () => getJobs({ search, status: status || undefined, page, limit: 10 }),
  })

  const jobs = data?.data?.items ?? data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Browse Jobs</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">Find your next project</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-indigo-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-400">Failed to load jobs. Please try again.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#a1a1aa]">No jobs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {jobs.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#a1a1aa] rounded-lg text-sm disabled:opacity-50 hover:border-indigo-500 transition-colors"
          >
            Previous
          </button>
          <span className="text-[#a1a1aa] text-sm">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={jobs.length < 10}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-[#a1a1aa] rounded-lg text-sm disabled:opacity-50 hover:border-indigo-500 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default JobsPage