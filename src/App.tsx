import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';

// Pages
import Dashboard from './views/Dashboard';
import Members from './views/Members';
import Fees from './views/Fees';
import Attendance from './views/Attendance';
import Trainers from './views/Trainers';
import Classes from './views/Classes';
import WorkoutGen from './views/WorkoutGen';
import Reports from './views/Reports';
import Settings from './views/Settings';
import Login from './views/Login';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </PrivateRoute>
          } />
          
          <Route path="/members" element={
            <PrivateRoute>
              <AppLayout>
                <Members />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/fees" element={
            <PrivateRoute>
              <AppLayout>
                <Fees />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/attendance" element={
            <PrivateRoute>
              <AppLayout>
                <Attendance />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/trainers" element={
            <PrivateRoute>
              <AppLayout>
                <Trainers />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/classes" element={
            <PrivateRoute>
              <AppLayout>
                <Classes />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/workout-gen" element={
            <PrivateRoute>
              <AppLayout>
                <WorkoutGen />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/reports" element={
            <PrivateRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
