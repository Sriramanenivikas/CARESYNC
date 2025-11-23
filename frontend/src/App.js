import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { ToastProvider } from './components/Common/Toast';
import { PageLoading } from './components/Common/Loading';
import { isAuthenticated, getDashboardRoute, getUserRole } from './utils/authUtils';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./components/Auth/Login'));
const AdminDashboard = lazy(() => import('./components/Dashboards/AdminDashboard'));
const TestDashboard = lazy(() => import('./components/Dashboards/TestDashboard'));
const DoctorDashboard = lazy(() => import('./components/Dashboards/DoctorDashboard'));
const PatientDashboard = lazy(() => import('./components/Dashboards/PatientDashboard'));
const ReceptionistDashboard = lazy(() => import('./components/Dashboards/ReceptionistDashboard'));
const NurseDashboard = lazy(() => import('./components/Dashboards/NurseDashboard'));
const PharmacistDashboard = lazy(() => import('./components/Dashboards/PharmacistDashboard'));
const LabTechnicianDashboard = lazy(() => import('./components/Dashboards/LabTechnicianDashboard'));
const PlaceholderPage = lazy(() => import('./components/Layout/PlaceholderPage'));

// Import PrivateRoute normally as it's a wrapper component
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  const HomeRedirect = () => {
    if (isAuthenticated()) {
      // Prefer dashboardUrl stored from login if present
      const storedUrl = localStorage.getItem('dashboardUrl');
      if (storedUrl) {
        // Normalize stored url to frontend route (remove leading /api if present)
        const normalized = storedUrl.replace(/^\/api/, '');
        return <Navigate to={normalized} replace />;
      }

      const role = getUserRole();
      const dashboardRoute = getDashboardRoute(role);
      return <Navigate to={dashboardRoute} replace />;
    }
    return <Navigate to="/" replace />;
  };

  return (
    <ErrorBoundary>
      <ToastProvider position="top-right" maxToasts={5}>
        <Router>
          <div className="App">
            <Suspense fallback={<PageLoading message="Loading application..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />

                {/* Home Route - Auto redirect based on auth status and role */}
                <Route path="/home" element={
                  isAuthenticated() ? (
                    <Navigate to={getDashboardRoute(getUserRole())} replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard/admin"
                  element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                {/* Test dashboard route (for debugging) */}
                <Route
                  path="/dashboard/test"
                  element={
                    <PrivateRoute allowedRoles={["ADMIN"]}>
                      <TestDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/doctor"
                  element={
                    <PrivateRoute allowedRoles={["DOCTOR"]}>
                      <DoctorDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/patient"
                  element={
                    <PrivateRoute allowedRoles={["PATIENT"]}>
                      <PatientDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/receptionist"
                  element={
                    <PrivateRoute allowedRoles={["RECEPTIONIST"]}>
                      <ReceptionistDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/nurse"
                  element={
                    <PrivateRoute allowedRoles={["NURSE"]}>
                      <NurseDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/pharmacist"
                  element={
                    <PrivateRoute allowedRoles={["PHARMACIST"]}>
                      <PharmacistDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/dashboard/lab-technician"
                  element={
                    <PrivateRoute allowedRoles={["LAB_TECHNICIAN"]}>
                      <LabTechnicianDashboard />
                    </PrivateRoute>
                  }
                />

                {/* Dashboard base route */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <HomeRedirect />
                    </PrivateRoute>
                  }
                />

                {/* Placeholder routes for sidebar pages to keep navigation moving */}
                <Route path="/patients" element={<PrivateRoute><PlaceholderPage title="Patients" /></PrivateRoute>} />
                <Route path="/doctors" element={<PrivateRoute><PlaceholderPage title="Doctors" /></PrivateRoute>} />
                <Route path="/appointments" element={<PrivateRoute><PlaceholderPage title="Appointments" /></PrivateRoute>} />
                <Route path="/departments" element={<PrivateRoute><PlaceholderPage title="Departments" /></PrivateRoute>} />
                <Route path="/reports" element={<PrivateRoute><PlaceholderPage title="Reports" /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><PlaceholderPage title="Settings" /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><PlaceholderPage title="Profile" /></PrivateRoute>} />

                {/* Role-based wildcard routes to allow subpaths like /nurse/patients etc. */}
                <Route path="/nurse/*" element={<PrivateRoute allowedRoles={["NURSE"]}><PlaceholderPage title="Nurse Module" /></PrivateRoute>} />
                <Route path="/doctor/*" element={<PrivateRoute allowedRoles={["DOCTOR"]}><PlaceholderPage title="Doctor Module" /></PrivateRoute>} />
                <Route path="/patient/*" element={<PrivateRoute allowedRoles={["PATIENT"]}><PlaceholderPage title="Patient Module" /></PrivateRoute>} />
                <Route path="/receptionist/*" element={<PrivateRoute allowedRoles={["RECEPTIONIST"]}><PlaceholderPage title="Receptionist Module" /></PrivateRoute>} />
                <Route path="/pharmacist/*" element={<PrivateRoute allowedRoles={["PHARMACIST"]}><PlaceholderPage title="Pharmacist Module" /></PrivateRoute>} />
                <Route path="/lab/*" element={<PrivateRoute allowedRoles={["LAB_TECHNICIAN"]}><PlaceholderPage title="Lab Module" /></PrivateRoute>} />

                {/* 404 - Not Found */}
                <Route path="/404" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">Page not found</p>
                      <a href="/" className="mt-6 inline-block text-teal-600 hover:text-teal-700">Go to Home</a>
                    </div>
                  </div>
                } />

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
