import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardHome from './pages/DashboardHome'
import HotelsPage from './pages/HotelsPage'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <HotelsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App