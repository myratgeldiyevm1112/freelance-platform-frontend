import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Briefcase, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { register } from '../../api/auth.api'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

function RegisterPage() {
  const [role, setRole] = useState('freelancer')
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      const { user, access_token, refresh_token } = res.data
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      setAuth(user, access_token)
      toast.success('Welcome to FreelanceHub!')
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Registration failed')
    },
  })

  const onSubmit = (data) => {
    mutation.mutate({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      role,
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Briefcase className="text-indigo-500" size={28} />
          <span className="text-white font-bold text-2xl">FreelanceHub</span>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8">
          <h1 className="text-white text-2xl font-bold mb-1">Create account</h1>
          <p className="text-[#a1a1aa] text-sm mb-6">Join FreelanceHub today</p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole('freelancer')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                role === 'freelancer'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#2a2a2a] text-[#a1a1aa] hover:text-white'
              }`}
            >
              I'm a Freelancer
            </button>
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                role === 'client'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#2a2a2a] text-[#a1a1aa] hover:text-white'
              }`}
            >
              I'm a Client
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Full Name</Label>
              <Input
                {...formRegister('full_name')}
                placeholder="John Doe"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
              />
              {errors.full_name && (
                <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Email</Label>
              <Input
                {...formRegister('email')}
                type="email"
                placeholder="john@example.com"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Password</Label>
              <Input
                {...formRegister('password')}
                type="password"
                placeholder="Min 8 characters"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Confirm Password</Label>
              <Input
                {...formRegister('confirmPassword')}
                type="password"
                placeholder="Repeat password"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            >
              {mutation.isPending ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-[#a1a1aa] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage