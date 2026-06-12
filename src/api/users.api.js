import api from './axios'

export const getMe = () => api.get('/users/me')
export const updateMe = (data) => api.patch('/users/me', data)
export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const getMySkills = () => api.get('/users/me/skills')
export const addSkill = (skillId) => api.post('/users/me/skills', { skill_id: skillId })
export const removeSkill = (skillId) => api.delete(`/users/me/skills/${skillId}`)