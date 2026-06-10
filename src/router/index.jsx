import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

// Auth
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Dashboard
import DashboardPage from '../pages/dashboard/DashboardPage'

// Jobs
import JobsPage from '../pages/jobs/JobsPage'
import JobDetailPage from '../pages/jobs/JobDetailPage'
import CreateJobPage from '../pages/jobs/CreateJobPage'

// Proposals
import ProposalsPage from '../pages/proposals/ProposalsPage'

// Contracts
import ContractPage from '../pages/contracts/ContractPage'

// Chat
import ChatPage from '../pages/chat/ChatPage'

// Profile
import MyProfilePage from '../pages/profile/MyProfilePage'
import FreelancerProfilePage from '../pages/profile/FreelancerProfilePage'

// Freelancers
import FreelancersPage from '../pages/freelancers/FreelancersPage'

// Disputes
import DisputePage from '../pages/disputes/DisputePage'

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminJobs from '../pages/admin/AdminJobs'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
        <Route path="/jobs/create" element={<PrivateRoute><CreateJobPage /></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute><JobDetailPage /></PrivateRoute>} />
        <Route path="/proposals" element={<PrivateRoute><ProposalsPage /></PrivateRoute>} />
        <Route path="/contracts/:id" element={<PrivateRoute><ContractPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><MyProfilePage /></PrivateRoute>} />
        <Route path="/freelancers" element={<PrivateRoute><FreelancersPage /></PrivateRoute>} />
        <Route path="/freelancers/:id" element={<PrivateRoute><FreelancerProfilePage /></PrivateRoute>} />
        <Route path="/disputes/:id" element={<PrivateRoute><DisputePage /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/jobs" element={<AdminRoute><AdminJobs /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter