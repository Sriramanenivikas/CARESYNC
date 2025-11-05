import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import TestDashboard from './components/Dashboards/TestDashboard';
import DoctorDashboard from './components/Dashboards/DoctorDashboard';
import PatientDashboard from './components/Dashboards/PatientDashboard';
import ReceptionistDashboard from './components/Dashboards/ReceptionistDashboard';
import NurseDashboard from './components/Dashboards/NurseDashboard';
import PharmacistDashboard from './components/Dashboards/PharmacistDashboard';
import LabTechnicianDashboard from './components/Dashboards/LabTechnicianDashboard';
import { isAuthenticated, getDashboardRoute, getUserRole } from './utils/authUtils';
import PlaceholderPage from './components/Layout/PlaceholderPage';

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
    return <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Home Route - Auto redirect based on auth status and role */}
          <Route path="/" element={<HomeRedirect />} />

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

          {/* Role-based wildcard routes to allow subpaths like /nurse/patients etc. */}
          <Route path="/nurse/*" element={<PrivateRoute allowedRoles={["NURSE"]}><PlaceholderPage title="Nurse Module" /></PrivateRoute>} />
          <Route path="/doctor/*" element={<PrivateRoute allowedRoles={["DOCTOR"]}><PlaceholderPage title="Doctor Module" /></PrivateRoute>} />
          <Route path="/patient/*" element={<PrivateRoute allowedRoles={["PATIENT"]}><PlaceholderPage title="Patient Module" /></PrivateRoute>} />
          <Route path="/receptionist/*" element={<PrivateRoute allowedRoles={["RECEPTIONIST"]}><PlaceholderPage title="Receptionist Module" /></PrivateRoute>} />
          <Route path="/pharmacist/*" element={<PrivateRoute allowedRoles={["PHARMACIST"]}><PlaceholderPage title="Pharmacist Module" /></PrivateRoute>} />
          <Route path="/lab/*" element={<PrivateRoute allowedRoles={["LAB_TECHNICIAN"]}><PlaceholderPage title="Lab Module" /></PrivateRoute>} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

