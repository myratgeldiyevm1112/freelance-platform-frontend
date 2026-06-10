import { Link, useNavigate } from 'react-router-dom'
import { Bell, Menu, Briefcase, LogOut, User, Settings } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const navLinks = [
    { label: 'Jobs', href: '/jobs' },
    { label: 'Freelancers', href: '/freelancers' },
    ...(user?.role === 'client' ? [{ label: 'Post a Job', href: '/jobs/create' }] : []),
    ...(user?.role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
  ]

  return (
    <header className="border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-white text-lg">
          <Briefcase className="text-indigo-500" size={22} />
          <span>FreelanceHub</span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-[#a1a1aa] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#a1a1aa] hover:text-white"
                onClick={() => navigate('/notifications')}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none">
                    <Avatar className="w-8 h-8 cursor-pointer">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-indigo-600 text-white text-xs">
                        {getInitials(user?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-[#2a2a2a]">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user?.full_name}</p>
                    <p className="text-xs text-[#a1a1aa]">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="text-[#a1a1aa] hover:text-white cursor-pointer"
                  >
                    <User size={14} className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="text-[#a1a1aa] hover:text-white cursor-pointer"
                  >
                    <Settings size={14} className="mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile burger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-[#a1a1aa]">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#111111] border-[#2a2a2a] w-64">
                <span className="sr-only">Navigation Menu</span>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-[#a1a1aa] hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 text-sm text-left transition-colors"
                  >
                    Logout
                  </button>
                </nav>
              </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-[#a1a1aa]" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar