# CareSync Frontend - Hospital Management System

A comprehensive role-based dashboard system built with React.js and Tailwind CSS.

## ✨ Features

### 🔐 Role-Based Authentication
- **Automatic Dashboard Routing**: Users are automatically redirected to their role-specific dashboard after login
- **JWT Token Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control for all routes

### 👥 Supported Roles
1. **Admin** - Full system access, manage users, view reports
2. **Doctor** - Manage appointments, patients, prescriptions, medical records
3. **Patient** - View appointments, prescriptions, bills, find doctors
4. **Receptionist** - Patient registration, appointments, billing, bed management
5. **Nurse** - Patient care, bed management, tasks
6. **Pharmacist** - Prescription management, inventory
7. **Lab Technician** - Lab tests and results (coming soon)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── Dashboards/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── ReceptionistDashboard.jsx
│   │   │   ├── NurseDashboard.jsx
│   │   │   ├── PharmacistDashboard.jsx
│   │   │   └── LabTechnicianDashboard.jsx
│   │   └── Layout/
│   │       ├── DashboardLayout.jsx
│   │       └── StatCard.jsx
│   ├── services/
│   │   ├── apiService.js
│   │   ├── authService.js
│   │   └── dashboardService.js
│   ├── utils/
│   │   └── authUtils.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔑 Authentication Flow

1. **Login**: User enters username and password
2. **API Call**: Credentials sent to `/auth/login`
3. **Response**: Backend returns JWT token, user info, role, and dashboard URL
4. **Storage**: Token and user data stored in localStorage
5. **Auto-Redirect**: User automatically redirected to role-specific dashboard
6. **Protected Routes**: All dashboard routes protected by role-based guards

## 🎨 Dashboard Features by Role

### Admin Dashboard
- Total Patients, Doctors, Appointments statistics
- Revenue overview
- Quick actions: Add Patient, Add Doctor, View Reports

### Doctor Dashboard
- Today's appointments
- Total appointments (pending/completed)
- Patient count
- Quick actions: View Appointments, Add Prescription, Patient History

### Patient Dashboard
- Upcoming appointments
- Prescriptions
- Billing summary
- Quick actions: Book Appointment, Find Doctors, View Prescriptions

### Receptionist Dashboard
- Today's appointments
- Patient registration
- Billing management
- Quick actions: Register Patient, Book Appointment, Generate Bill

### Nurse Dashboard
- Patient assignments
- Bed management
- Pending tasks
- Quick actions: View Patients, Update Bed Status, View Tasks

### Pharmacist Dashboard
- Prescriptions (pending/dispensed)
- Inventory management
- Quick actions: View Prescriptions, Dispense Medicine, Check Inventory

### Lab Technician Dashboard
- Pending tests
- Completed tests
- Quick actions: View Tests, Upload Results, Generate Report

## 🔧 Configuration

### Environment Variables (.env)

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### API Endpoints

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /api/dashboard` - Auto-detect role and return dashboard
- `GET /api/dashboard/admin` - Admin dashboard data
- `GET /api/dashboard/doctor` - Doctor dashboard data
- `GET /api/dashboard/patient` - Patient dashboard data
- `GET /api/dashboard/receptionist` - Receptionist dashboard data
- `GET /api/dashboard/nurse` - Nurse dashboard data
- `GET /api/dashboard/pharmacist` - Pharmacist dashboard data
- `GET /api/dashboard/lab-technician` - Lab technician dashboard data

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom Components** for reusable UI elements
- **Responsive Design** works on mobile, tablet, and desktop
- **Color Scheme**: Primary blue theme with role-specific accent colors

## 🔐 Security Features

- JWT token stored in localStorage
- Automatic token injection in API requests
- Token expiry handling with auto-redirect to login
- Role-based route protection
- Unauthorized access redirects to appropriate dashboard

## 🚧 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Adding New Routes

1. Create component in `src/components/`
2. Add route in `src/App.js`
3. Protect with `<PrivateRoute allowedRoles={['ROLE']}>` if needed
4. Update menu items in dashboard layout

## 📦 Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **axios**: ^1.6.2
- **react-icons**: ^4.12.0
- **tailwindcss**: ^3.3.5

## 🐛 Troubleshooting

### Login Issues
- Ensure backend is running on http://localhost:8080
- Check browser console for API errors
- Verify credentials are correct

### Dashboard Not Loading
- Check JWT token in localStorage
- Verify role is set correctly
- Check network tab for API responses

### Styling Issues
- Run `npm install` to ensure Tailwind is installed
- Check that tailwind.config.js is properly configured
- Clear browser cache

## 🔮 Future Enhancements

- [ ] OTP verification integration
- [ ] CAPTCHA implementation
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Appointment booking UI
- [ ] Patient management interface
- [ ] Doctor management interface
- [ ] Billing module UI
- [ ] Lab module integration
- [ ] Dark mode support

## 📝 License

This project is part of the CareSync Hospital Management System.

## 🤝 Support

For issues or questions, please contact the development team.

