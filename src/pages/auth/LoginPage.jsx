import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Briefcase, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { login } from '../../api/auth.api'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const { user, access_token, refresh_token } = res.data
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      setAuth(user, access_token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    },
  })

  const onSubmit = (data) => mutation.mutate(data)

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
          <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-[#a1a1aa] text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="text-[#a1a1aa] text-sm mb-1.5 block">Email</Label>
              <Input
                {...register('email')}
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
                {...register('password')}
                type="password"
                placeholder="Your password"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-[#52525b]"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            >
              {mutation.isPending ? (
                <><Loader2 size={16} className="mr-2 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-[#a1a1aa] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage