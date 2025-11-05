export const isAuthenticated = () => {
  return !!localStorage.getItem('jwtToken');
};

export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  // Normalize like 'ROLE_ADMIN' -> 'ADMIN'
  return role ? role.replace(/^ROLE_/i, '').toUpperCase() : null;
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const getUsername = () => {
  return localStorage.getItem('username');
};

export const clearAuthData = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('dashboardUrl');
};

export const getDashboardRoute = (role) => {
  const normalized = role ? role.replace(/^ROLE_/i, '').toUpperCase() : '';
  const routes = {
    ADMIN: '/dashboard/admin',
    DOCTOR: '/dashboard/doctor',
    PATIENT: '/dashboard/patient',
    RECEPTIONIST: '/dashboard/receptionist',
    NURSE: '/dashboard/nurse',
    PHARMACIST: '/dashboard/pharmacist',
    LAB_TECHNICIAN: '/dashboard/lab-technician',
  };
  return routes[normalized] || '/dashboard';
};
