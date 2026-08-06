import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import StudentDashboard from './pages/Student/StudentDashboard';
import Logbook from './pages/Student/Logbook';
import NewLogEntry from './pages/Student/NewLogEntry';
import CheckIn from './pages/Student/CheckIn';
import LogEntryDetail from './pages/Student/LogEntryDetail';
import EditLogEntry from './pages/Student/EditLogEntry';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Supervisor Pages
import SupervisorDashboard from './pages/Supervisor/SupervisorDashboard';
import Students from './pages/Supervisor/Students';
import LogReview from './pages/Supervisor/LogReview';
import Reports from './pages/Supervisor/Reports';
import StudentProgress from './pages/Supervisor/StudentProgress';
import LocationTracker from './pages/Supervisor/LocationTracker';
import SupervisorLogEntryDetail from './pages/Supervisor/SupervisorLogEntryDetail';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import SystemSettings from './pages/Admin/SystemSettings';
import AssignmentPage from './pages/Admin/AssignmentPage';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import BackupPage from './pages/Admin/BackupPage';
import AdminLogDetailPage from './pages/Admin/AdminLogDetailPage';

// Industrial Supervisor Pages
import IndustrialDashboard from './pages/IndustrialSupervisor/IndustrialDashboard';
import Confirmations from './pages/IndustrialSupervisor/Confirmations';
import IndustrialStudents from './pages/IndustrialSupervisor/IndustrialStudents';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/logbook"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Logbook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/logbook/new"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <NewLogEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/checkin"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <CheckIn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/logbook/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <LogEntryDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/logbook/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <EditLogEntry />
                  </ProtectedRoute>
                }
              />

              {/* Supervisor Routes */}
              <Route
                path="/supervisor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <SupervisorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supervisor/students"
                element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supervisor/students/:studentId/progress"
                element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <StudentProgress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supervisor/logs"
                element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <LogReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supervisor/reports"
                element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/supervisor/location-tracker"
                element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <LocationTracker />
                  </ProtectedRoute>
                }
              />
              <Route path="/supervisor/logs/:id" 
              element={
                  <ProtectedRoute allowedRoles={['supervisor']}>
                    <SupervisorLogEntryDetail />
                  </ProtectedRoute>
                } 
              />



              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SystemSettings />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/assignments" 
              element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AssignmentPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin/logs/:id" 
              element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLogDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin/analytics" 
              element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin/backup" 
              element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <BackupPage />
                  </ProtectedRoute>
                } 
              />

              {/* Industrial Supervisor Routes */}
              <Route
                path="/industrial/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['industrial_supervisor']}>
                    <IndustrialDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/industrial/confirmations"
                element={
                  <ProtectedRoute allowedRoles={['industrial_supervisor']}>
                    <Confirmations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/industrial/students"
                element={
                  <ProtectedRoute allowedRoles={['industrial_supervisor']}>
                    <IndustrialStudents />
                  </ProtectedRoute>
                }
              />
        


              {/* Default redirect based on role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RoleBasedRedirect />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

// Component to redirect users to their role-specific dashboard
const RoleBasedRedirect: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  switch (user?.role) {
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'supervisor':
      return <Navigate to="/supervisor/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
       case 'industrial_supervisor':
      return <Navigate to="/industrial/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default App;