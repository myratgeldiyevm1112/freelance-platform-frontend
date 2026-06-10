import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import PageWrapper from '../components/layout/PageWrapper'

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
        {/* Публичные */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Приватные — все обёрнуты в PageWrapper */}
        <Route path="/dashboard" element={<PrivateRoute><PageWrapper><DashboardPage /></PageWrapper></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><PageWrapper><JobsPage /></PageWrapper></PrivateRoute>} />
        <Route path="/jobs/create" element={<PrivateRoute><PageWrapper><CreateJobPage /></PageWrapper></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute><PageWrapper><JobDetailPage /></PageWrapper></PrivateRoute>} />
        <Route path="/proposals" element={<PrivateRoute><PageWrapper><ProposalsPage /></PageWrapper></PrivateRoute>} />
        <Route path="/contracts/:id" element={<PrivateRoute><PageWrapper><ContractPage /></PageWrapper></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><PageWrapper><ChatPage /></PageWrapper></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><PageWrapper><MyProfilePage /></PageWrapper></PrivateRoute>} />
        <Route path="/freelancers" element={<PrivateRoute><PageWrapper><FreelancersPage /></PageWrapper></PrivateRoute>} />
        <Route path="/freelancers/:id" element={<PrivateRoute><PageWrapper><FreelancerProfilePage /></PageWrapper></PrivateRoute>} />
        <Route path="/disputes/:id" element={<PrivateRoute><PageWrapper><DisputePage /></PageWrapper></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><PageWrapper><AdminUsers /></PageWrapper></AdminRoute>} />
        <Route path="/admin/jobs" element={<AdminRoute><PageWrapper><AdminJobs /></PageWrapper></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter