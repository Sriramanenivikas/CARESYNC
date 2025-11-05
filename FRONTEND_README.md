# CareSync Frontend

A comprehensive Hospital Management System frontend built with React.js and Tailwind CSS.

## Features

- **Role-Based Authentication**: Automatic dashboard routing based on user role
- **OTP Verification**: Secure login with OTP sent to email/mobile
- **Multi-Role Dashboards**:
  - Admin Dashboard
  - Doctor Dashboard
  - Patient Dashboard
  - Receptionist Dashboard
  - Nurse Dashboard
  - Pharmacist Dashboard
  - Lab Technician Dashboard

## Tech Stack

- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- JWT Authentication

## Installation

```bash
cd caresync-frontend
npm install
```

## Environment Setup

Create a `.env` file in the root:

```
REACT_APP_API_URL=http://localhost:8080
```

## Running the Application

```bash
npm start
```

## Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   ├── Auth/
│   └── Dashboards/
├── services/
│   ├── authService.js
│   ├── apiService.js
│   └── dashboardService.js
├── utils/
│   └── authUtils.js
├── App.js
└── index.js
```

## Authentication Flow

1. User logs in with credentials + CAPTCHA
2. OTP is sent to registered email/mobile
3. User verifies OTP
4. JWT token is issued with role claim
5. User is automatically redirected to their role-specific dashboard

## API Endpoints

- `POST /auth/login` - Login with credentials
- `POST /auth/otp/request` - Request OTP
- `POST /auth/otp/verify` - Verify OTP
- `GET /api/dashboard` - Auto-redirect to role-based dashboard
- `GET /api/dashboard/{role}` - Get specific role dashboard

