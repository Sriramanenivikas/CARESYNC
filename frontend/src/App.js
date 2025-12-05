import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth';
import { DashboardLayout } from './components/layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import {
  LoginPage,
  DashboardPage,
  PatientsPage,
  DoctorsPage,
  AppointmentsPage,
  PrescriptionsPage,
  BillsPage,
  AnalyticsPage,
  UsersPage,
  UnauthorizedPage,
  NotFoundPage,
  LandingPage,
} from './pages';
import AccessCodeAdminPage from './pages/AccessCodeAdminPage';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Access Code Admin (separate from main app) */}
              <Route path="/admin/access-codes" element={<AccessCodeAdminPage />} />

            {/* Protected Routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              
              <Route
                path="patients"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST']}>
                    <PatientsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="doctors"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'TEST']}>
                    <DoctorsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="appointments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT', 'TEST']}>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="prescriptions"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'TEST']}>
                    <PrescriptionsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="bills"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'PATIENT', 'TEST']}>
                    <BillsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TEST']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'TEST']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Legacy routes redirect to /app */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
            <Route path="/doctors" element={<Navigate to="/app/doctors" replace />} />
            <Route path="/appointments" element={<Navigate to="/app/appointments" replace />} />
            <Route path="/prescriptions" element={<Navigate to="/app/prescriptions" replace />} />
            <Route path="/bills" element={<Navigate to="/app/bills" replace />} />
            <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
            <Route path="/users" element={<Navigate to="/app/users" replace />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
              </ToastProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
