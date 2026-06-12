import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Camera, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { getMe, updateMe, uploadAvatar, getMySkills, removeSkill } from '../../api/users.api'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

function MyProfilePage() {
  const { user, updateUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('info')

  const { data: meData, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await getMe()
      updateUser(res.data)
      return res.data
    },
  })

  const { data: skillsData } = useQuery({
    queryKey: ['my-skills'],
    queryFn: getMySkills,
  })

  const skills = Array.isArray(skillsData?.data) ? skillsData.data : skillsData?.data?.items ?? []
  const me = meData ?? user

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: {
      full_name: me?.full_name ?? '',
      bio: me?.bio ?? '',
      hourly_rate: me?.hourly_rate ?? '',
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (res) => {
      updateUser(res.data)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profile updated!')
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (res) => {
      updateUser(res.data)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Avatar updated!')
    },
    onError: () => toast.error('Failed to upload avatar'),
  })

  const removeSkillMutation = useMutation({
    mutationFn: removeSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-skills'] })
      toast.success('Skill removed!')
    },
    onError: () => toast.error('Failed to remove skill'),
  })

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) avatarMutation.mutate(file)
  }

  const onSubmit = (data) => updateMutation.mutate(data)

  const tabs = [
    { id: 'info', label: 'Profile Info' },
    { id: 'skills', label: 'Skills' },
  ]

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="text-indigo-500 animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">My Profile</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
            {me?.avatar_url
              ? <img src={me.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              : me?.full_name?.[0]?.toUpperCase()
            }
          </div>
          <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
            <Camera size={12} className="text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div>
          <p className="text-white font-semibold">{me?.full_name}</p>
          <p className="text-[#a1a1aa] text-sm">{me?.email}</p>
          <span className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full mt-1 inline-block">
            {me?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'info' && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Full Name</Label>
              <Input
                {...register('full_name', { required: 'Name is required' })}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
              />
              {errors.full_name && (
                <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Bio</Label>
              <textarea
                {...register('bio')}
                rows={4}
                placeholder="Tell clients about yourself..."
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-[#52525b] rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            {me?.role === 'freelancer' && (
              <div>
                <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Hourly Rate ($)</Label>
                <Input
                  {...register('hourly_rate')}
                  type="number"
                  placeholder="e.g. 50"
                  className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {updateMutation.isPending
                ? <><Loader2 size={16} className="mr-2 animate-spin" /> Saving...</>
                : 'Save Changes'}
            </Button>
          </form>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">My Skills</h2>
          {skills.length === 0 ? (
            <p className="text-[#a1a1aa] text-sm">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
                >
                  <span className="text-indigo-400 text-sm">{skill.name}</span>
                  <button
                    onClick={() => removeSkillMutation.mutate(skill.id)}
                    className="text-indigo-400 hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyProfilePage