import { useNavigate } from 'react-router-dom'
import { Briefcase, DollarSign, Clock, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const STATUS_COLORS = {
  open: 'bg-green-500/10 text-green-400 border-green-500/20',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function JobCard({ job }) {
  const navigate = useNavigate()

  const statusColor = STATUS_COLORS[job.status] || STATUS_COLORS.open

  return (
    <div
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-base group-hover:text-indigo-400 transition-colors line-clamp-1 flex-1 mr-3">
          {job.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${statusColor}`}>
          {job.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-[#a1a1aa] text-sm line-clamp-2 mb-4">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill.id}
              className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full"
            >
              {skill.name}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs px-2 py-1 bg-[#2a2a2a] text-[#a1a1aa] rounded-full">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-[#a1a1aa] text-xs">
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>${job.budget_min} — ${job.budget_max}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>{job.proposals_count ?? 0} proposals</span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={12} />
          <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  )
}

export default JobCard