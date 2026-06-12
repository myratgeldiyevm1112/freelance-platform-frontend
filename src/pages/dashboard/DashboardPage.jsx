import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Briefcase, FileText, Users, Star, Plus, ArrowRight } from 'lucide-react'
import { getMe } from '../../api/users.api'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/button'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#a1a1aa] text-sm">{label}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  )
}

function ClientDashboard({ user }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">
            Welcome back, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-[#a1a1aa] text-sm mt-1">
            Here's what's happening with your projects
          </p>
        </div>
        <Button
          onClick={() => navigate('/jobs/create')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Post a Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Briefcase} label="Active Jobs" value="0" color="bg-indigo-600" />
        <StatCard icon={FileText} label="Proposals" value="0" color="bg-blue-600" />
        <StatCard icon={Users} label="Active Contracts" value="0" color="bg-green-600" />
        <StatCard icon={Star} label="Completed" value="0" color="bg-yellow-600" />
      </div>

      {/* Quick actions */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/jobs/create')}
            className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-indigo-500 transition-colors text-left"
          >
            <Plus size={18} className="text-indigo-400" />
            <div>
              <p className="text-white text-sm font-medium">Post a Job</p>
              <p className="text-[#a1a1aa] text-xs">Find the right freelancer</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/freelancers')}
            className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-indigo-500 transition-colors text-left"
          >
            <Users size={18} className="text-blue-400" />
            <div>
              <p className="text-white text-sm font-medium">Browse Freelancers</p>
              <p className="text-[#a1a1aa] text-xs">Find talented people</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-indigo-500 transition-colors text-left"
          >
            <ArrowRight size={18} className="text-green-400" />
            <div>
              <p className="text-white text-sm font-medium">My Jobs</p>
              <p className="text-[#a1a1aa] text-xs">Manage your postings</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function FreelancerDashboard({ user }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[#a1a1aa] text-sm mt-1">
          Find your next opportunity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Proposals Sent" value="0" color="bg-indigo-600" />
        <StatCard icon={Briefcase} label="Active Contracts" value="0" color="bg-green-600" />
        <StatCard icon={Star} label="Avg Rating" value="—" color="bg-yellow-600" />
        <StatCard icon={Users} label="Completed Jobs" value="0" color="bg-blue-600" />
      </div>

      {/* Quick actions */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-indigo-500 transition-colors text-left"
          >
            <Briefcase size={18} className="text-indigo-400" />
            <div>
              <p className="text-white text-sm font-medium">Browse Jobs</p>
              <p className="text-[#a1a1aa] text-xs">Find your next project</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/proposals')}
            className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-indigo-500 transition-colors text-left"
          >
            <FileText size={18} className="text-blue-400" />
            <div>
              <p className="text-white text-sm font-medium">My Proposals</p>
              <p className="text-[#a1a1aa] text-xs">Track your applications</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-indigo-500 transition-colors text-left"
          >
            <Users size={18} className="text-green-400" />
            <div>
              <p className="text-white text-sm font-medium">My Profile</p>
              <p className="text-[#a1a1aa] text-xs">Update your skills</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { user, updateUser } = useAuthStore()

  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await getMe()
      updateUser(res.data)
      return res.data
    },
  })

  if (!user) return null

  return user.role === 'client'
    ? <ClientDashboard user={user} />
    : <FreelancerDashboard user={user} />
}

export default DashboardPage