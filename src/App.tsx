import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Loading } from './components/ui/loading';
import { Debug } from './components/Debug';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { Courses } from './pages/Courses';
import { CreateCourse } from './pages/CreateCourse';
import { Modules } from './pages/Modules';
import { Lessons } from './pages/Lessons';
import { Wiki } from './pages/Wiki';
import { Social } from './pages/Social';
import { Support } from './pages/Support';
import { Admin } from './pages/Admin';
import { Users } from './pages/Users';
import { Profile } from './pages/Profile';
import { UserForm } from './pages/UserForm';
import { Plans } from './pages/Plans';
import { PlanForm } from './pages/PlanForm';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.user_metadata?.role !== 'admin') {
    console.log('Acesso negado: usuário não é admin', user);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading className="min-h-screen" />
        <Debug />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Sidebar />}
        <div className={user ? "lg:pl-64" : ""}>
          {user && <Navbar />}
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth/callback"
                element={<AuthCallback />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users/new" 
                element={
                  <ProtectedRoute requireAdmin>
                    <UserForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users/:id" 
                element={
                  <ProtectedRoute requireAdmin>
                    <UserForm />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/new"
                element={
                  <ProtectedRoute>
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/modules"
                element={
                  <ProtectedRoute>
                    <Modules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/modules/:moduleId/lessons"
                element={
                  <ProtectedRoute>
                    <Lessons />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wiki"
                element={
                  <ProtectedRoute>
                    <Wiki />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <Social />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
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
                path="/plans" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Plans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/plans/new" 
                element={
                  <ProtectedRoute requireAdmin>
                    <PlanForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/plans/:id" 
                element={
                  <ProtectedRoute requireAdmin>
                    <PlanForm />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Debug />
        </div>
      </div>
    </Router>
  );
}