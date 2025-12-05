# 🏥 CareSync - Hospital Management System
## Complete Project Plan & Documentation

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Database Design](#-database-design)
5. [RBAC Security Model](#-rbac-security-model)
6. [API Design](#-api-design)
7. [Frontend Structure](#-frontend-structure)
8. [Development Phases](#-development-phases)
9. [Setup Instructions](#-setup-instructions)
10. [Resume Highlights](#-resume-highlights)

---

## 🎯 Project Overview

### What is CareSync?
A **production-ready Hospital Management System** that digitizes hospital operations including patient management, doctor scheduling, appointments, prescriptions, billing, and role-based access control.

### Problem Statement
Hospitals struggle with:
- Manual patient record keeping
- Appointment scheduling conflicts
- Prescription tracking
- Billing and payment management
- Role-based access to sensitive medical data

### Solution
CareSync provides a unified platform where:
- **Patients** can book appointments, view prescriptions, pay bills
- **Doctors** can manage schedules, write prescriptions, view patient history
- **Nurses** can update patient vitals, view assignments
- **Admin** can manage all users, departments, generate reports
- **Receptionist** can handle front-desk operations

### Core Features (MVP)
| Feature | Description |
|---------|-------------|
| User Authentication | JWT-based login with role detection |
| Patient Management | CRUD operations, medical history |
| Doctor Management | Profiles, schedules, specializations |
| Appointment System | Book, reschedule, cancel appointments |
| Prescription Module | Create, view, print prescriptions |
| Billing System | Generate bills, track payments |
| Dashboard Analytics | Role-specific metrics and charts |

### Out of Scope (v1.0)
- ❌ Ambulance services
- ❌ Pharmacy inventory management
- ❌ Lab test integration
- ❌ Insurance claims processing
- ❌ Telemedicine/Video calls

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React.js Frontend (Port 3000)               │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │   │
│  │  │  Admin  │ │ Doctor  │ │ Patient │ │  Nurse  │        │   │
│  │  │Dashboard│ │Dashboard│ │Dashboard│ │Dashboard│        │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Spring Boot Backend (Port 8080)                │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Security   │  │  Controllers │  │   Services   │   │   │
│  │  │  (JWT/RBAC)  │  │  (REST APIs) │  │(Business Logic)│  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │    DTOs      │  │  Entities    │  │ Repositories │   │   │
│  │  │(Data Transfer)│ │ (JPA Models) │  │ (Data Access)│   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database (Port 5432)             │   │
│  │                                                          │   │
│  │   users │ patients │ doctors │ appointments │ bills     │   │
│  │   prescriptions │ departments │ medical_records          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 LTS | Core programming language |
| Spring Boot | 3.1.x | Application framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | Database ORM |
| JWT (jjwt) | 0.13.0 | Token-based authentication |
| PostgreSQL | 15+ | Relational database |
| Maven | 3.9+ | Build & dependency management |
| Lombok | 1.18.x | Boilerplate reduction |
| ModelMapper | 3.1.x | DTO mapping |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.x | UI framework |
| React Router | 6.x | Client-side routing |
| Axios | 1.6.x | HTTP client |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | 2.x | Dashboard charts |
| React Icons | 4.x | Icon library |

### Development Tools
| Tool | Purpose |
|------|---------|
| Postman | API testing |
| pgAdmin | Database management |
| VS Code | Frontend development |
| IntelliJ IDEA | Backend development |
| Git | Version control |

---

## 🗄 Database Design

### Entity Relationship Diagram (ERD)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    USERS     │       │   PATIENTS   │       │   DOCTORS    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ username     │       │ user_id (FK) │───────│ user_id (FK) │
│ email        │       │ first_name   │       │ first_name   │
│ password     │       │ last_name    │       │ last_name    │
│ role         │       │ dob          │       │ specialization│
│ is_active    │       │ gender       │       │ license_no   │
│ created_at   │       │ blood_group  │       │ dept_id (FK) │
│ updated_at   │       │ phone        │       │ experience   │
└──────────────┘       │ address      │       │ consultation_fee│
        │              │ emergency_contact│   │ available    │
        │              └──────────────┘       └──────────────┘
        │                     │                      │
        │                     │                      │
        ▼                     ▼                      ▼
┌──────────────────────────────────────────────────────────────┐
│                        APPOINTMENTS                           │
├──────────────────────────────────────────────────────────────┤
│ id (PK)                                                       │
│ patient_id (FK) ─────────────────────────────────────────────│
│ doctor_id (FK) ──────────────────────────────────────────────│
│ appointment_date                                              │
│ appointment_time                                              │
│ status (SCHEDULED/COMPLETED/CANCELLED)                        │
│ reason                                                        │
│ notes                                                         │
│ created_at                                                    │
└──────────────────────────────────────────────────────────────┘
        │
        │
        ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ PRESCRIPTIONS│       │PRESCRIPTION_ │       │    BILLS     │
├──────────────┤       │    ITEMS     │       ├──────────────┤
│ id (PK)      │       ├──────────────┤       │ id (PK)      │
│ appt_id (FK) │───────│ id (PK)      │       │ patient_id(FK)│
│ patient_id   │       │ presc_id(FK) │       │ appt_id (FK) │
│ doctor_id    │       │ medicine_name│       │ total_amount │
│ diagnosis    │       │ dosage       │       │ paid_amount  │
│ notes        │       │ frequency    │       │ status       │
│ created_at   │       │ duration     │       │ payment_date │
└──────────────┘       │ instructions │       │ created_at   │
                       └──────────────┘       └──────────────┘

┌──────────────┐       ┌──────────────┐
│ DEPARTMENTS  │       │DOCTOR_SCHEDULE│
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ name         │       │ doctor_id(FK)│
│ description  │       │ day_of_week  │
│ head_doctor  │       │ start_time   │
│ floor        │       │ end_time     │
│ is_active    │       │ is_available │
└──────────────┘       └──────────────┘
```

### Core Tables

#### 1. users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT', 'NURSE', 'RECEPTIONIST')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. patients
```sql
CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5),
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(15),
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. doctors
```sql
CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    department_id BIGINT REFERENCES departments(id),
    experience_years INTEGER,
    consultation_fee DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. appointments
```sql
CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id) NOT NULL,
    doctor_id BIGINT REFERENCES doctors(id) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. prescriptions
```sql
CREATE TABLE prescriptions (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT REFERENCES appointments(id),
    patient_id BIGINT REFERENCES patients(id) NOT NULL,
    doctor_id BIGINT REFERENCES doctors(id) NOT NULL,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. prescription_items
```sql
CREATE TABLE prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT REFERENCES prescriptions(id) NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    instructions TEXT
);
```

#### 7. bills
```sql
CREATE TABLE bills (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES patients(id) NOT NULL,
    appointment_id BIGINT REFERENCES appointments(id),
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PARTIAL', 'PAID', 'CANCELLED')),
    payment_method VARCHAR(20),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. departments
```sql
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    head_doctor_id BIGINT REFERENCES doctors(id),
    floor_number INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 RBAC Security Model

### Role Hierarchy
```
ADMIN (Full Access)
  │
  ├── DOCTOR (Medical Access)
  │     └── Can: View patients, Create prescriptions, Manage own schedule
  │
  ├── NURSE (Care Access)
  │     └── Can: View patients, Update vitals, View schedules
  │
  ├── RECEPTIONIST (Front-desk Access)
  │     └── Can: Manage appointments, Register patients, View schedules
  │
  ├── PATIENT (Self Access)
  │     └── Can: View own records, Book appointments, View bills
  │
  └── TEST (Read-Only Demo Access) ⭐ NEW
        └── Can: View ALL data across entire system (READ-ONLY)
        └── Purpose: For recruiters/demo to explore the application
```

---

### 🎭 TEST Role - Recruiter Demo Account

#### Purpose
When deploying to **Vercel/Production**, recruiters need to explore the full application without accidentally modifying data. The `TEST` role provides **complete read-only access** to all modules.

#### TEST Role Specifications

| Feature | Access Level |
|---------|--------------|
| **Authentication** | ✅ Login with demo credentials |
| **All Dashboards** | ✅ View Admin, Doctor, Patient, Nurse dashboards |
| **Patients** | ✅ View all patients, ❌ Cannot create/edit/delete |
| **Doctors** | ✅ View all doctors, ❌ Cannot create/edit/delete |
| **Appointments** | ✅ View all appointments, ❌ Cannot book/modify/cancel |
| **Prescriptions** | ✅ View all prescriptions, ❌ Cannot create/edit |
| **Bills** | ✅ View all bills, ❌ Cannot create/process payments |
| **Analytics** | ✅ Full access to all charts and reports |
| **Settings** | ❌ No access to system settings |

#### Demo Credentials (Production)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ROLE          EMAIL                      PASSWORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADMIN         admin@caresync.com         Admin@123
 TEST (Demo)   demo@caresync.com          Test@123$
 DOCTOR        john.smith@caresync.com    Doctor@123
 PATIENT       robert.miller@email.com    Patient@123
 NURSE         lisa.nurse@caresync.com    Nurse@123
 RECEPTIONIST  mary.reception@caresync.com Reception@123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Password Policy: 1 Uppercase + 1 Number + 1 Symbol required
```

#### Implementation Notes
```java
// Backend: Add TEST role to enum
public enum Role {
    ADMIN, DOCTOR, PATIENT, NURSE, RECEPTIONIST, TEST
}

// Security: TEST role gets read-only access to all endpoints
@PreAuthorize("hasAnyRole('ADMIN', 'TEST')")  // For view endpoints
@PreAuthorize("hasRole('ADMIN')")              // For write endpoints (excludes TEST)
```

```jsx
// Frontend: Show read-only banner for TEST users
{user.role === 'TEST' && (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
    🎭 Demo Mode: You have read-only access to explore the application
  </div>
)}

// Disable action buttons for TEST role
<button 
  disabled={user.role === 'TEST'}
  className={user.role === 'TEST' ? 'opacity-50 cursor-not-allowed' : ''}
>
  Add Patient
</button>
```

#### UI Behavior for TEST Role
1. **Dashboard Switcher**: Can toggle between all role dashboards
2. **Action Buttons**: Visible but disabled with tooltip "Demo mode - Read only"
3. **Forms**: Cannot submit, shows "Upgrade to full access" message
4. **Delete Buttons**: Hidden or disabled
5. **Navigation**: Full access to all pages

#### Landing Page Demo Section
```
┌─────────────────────────────────────────────────────┐
│  🎯 Try the Demo                                    │
│                                                     │
│  Experience CareSync without signing up!            │
│                                                     │
│  [🎭 Launch Demo Mode]                              │
│                                                     │
│  ✓ Full read-only access                           │
│  ✓ Explore all dashboards                          │
│  ✓ View sample data                                │
│  ✓ No registration required                        │
└─────────────────────────────────────────────────────┘
```

### Permission Matrix

| Resource | ADMIN | DOCTOR | NURSE | RECEPTIONIST | PATIENT | TEST 🎭 |
|----------|-------|--------|-------|--------------|---------|---------|
| **Users** |
| Create User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View All Users | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Update User | ✅ | Own | Own | Own | Own | ❌ |
| Delete User | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Patients** |
| Create Patient | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View All Patients | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View Own Profile | ✅ | N/A | N/A | N/A | ✅ | ✅ |
| Update Patient | ✅ | ❌ | ❌ | ✅ | Own | ❌ |
| Delete Patient | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Doctors** |
| Create Doctor | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Doctors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update Doctor | ✅ | Own | ❌ | ❌ | ❌ | ❌ |
| Delete Doctor | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Appointments** |
| Create Appointment | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| View All Appointments | ✅ | Own | Assigned | ✅ | Own | ✅ |
| Update Appointment | ✅ | Own | ❌ | ✅ | Own* | ❌ |
| Cancel Appointment | ✅ | Own | ❌ | ✅ | Own | ❌ |
| **Prescriptions** |
| Create Prescription | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Prescriptions | ✅ | Own | Assigned | ❌ | Own | ✅ |
| Update Prescription | ❌ | Own | ❌ | ❌ | ❌ | ❌ |
| **Bills** |
| Create Bill | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Bills | ✅ | ❌ | ❌ | ✅ | Own | ✅ |
| Update Bill | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Process Payment | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Dashboard** |
| Admin Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Doctor Dashboard | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Nurse Dashboard | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Receptionist Dashboard | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Patient Dashboard | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Analytics & Reports** |
| View Analytics | ✅ | Own | ❌ | ❌ | ❌ | ✅ |
| Export Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### JWT Token Structure
```json
{
  "sub": "user@email.com",
  "userId": 1,
  "role": "DOCTOR",
  "iat": 1701590400,
  "exp": 1701676800
}
```

### Security Flow
```
1. User Login Request
   POST /api/auth/login
   Body: { "email": "...", "password": "..." }
        │
        ▼
2. Server Validates Credentials
   - Check user exists
   - Verify password (BCrypt)
   - Check account is active
        │
        ▼
3. Generate JWT Token
   - Include userId, role, expiry
   - Sign with secret key
        │
        ▼
4. Return Token to Client
   Response: { "token": "eyJhbG...", "role": "DOCTOR", "dashboardUrl": "/dashboard/doctor" }
        │
        ▼
5. Client Stores Token
   - localStorage.setItem("token", token)
        │
        ▼
6. Subsequent API Requests
   Header: Authorization: Bearer eyJhbG...
        │
        ▼
7. Server Validates Token
   - JwtAuthenticationFilter intercepts
   - Validates signature & expiry
   - Extracts user details
   - Checks role permissions
        │
        ▼
8. Access Granted or 403 Forbidden
```

---

## 🔌 API Design

### Base URL
```
Development: http://localhost:8080/api
Production:  https://api.caresync.com/api
```

### Authentication APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Authenticated |
| POST | `/auth/refresh-token` | Refresh JWT token | Authenticated |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password | Public |

#### Login Request/Response
```json
// POST /api/auth/login
// Request
{
  "email": "doctor@hospital.com",
  "password": "securePassword123"
}

// Response (200 OK)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": 1,
    "email": "doctor@hospital.com",
    "role": "DOCTOR",
    "name": "Dr. John Smith"
  },
  "dashboardUrl": "/dashboard/doctor",
  "expiresIn": 86400
}
```

### Patient APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/patients` | Get all patients | ADMIN, DOCTOR, NURSE, RECEPTIONIST |
| GET | `/patients/{id}` | Get patient by ID | ADMIN, DOCTOR, NURSE, RECEPTIONIST, PATIENT(own) |
| POST | `/patients` | Create new patient | ADMIN, RECEPTIONIST |
| PUT | `/patients/{id}` | Update patient | ADMIN, RECEPTIONIST, PATIENT(own) |
| DELETE | `/patients/{id}` | Delete patient | ADMIN |
| GET | `/patients/{id}/appointments` | Get patient appointments | ADMIN, DOCTOR, PATIENT(own) |
| GET | `/patients/{id}/prescriptions` | Get patient prescriptions | ADMIN, DOCTOR, PATIENT(own) |
| GET | `/patients/{id}/bills` | Get patient bills | ADMIN, RECEPTIONIST, PATIENT(own) |

#### Patient Object
```json
{
  "id": 1,
  "userId": 10,
  "firstName": "Robert",
  "lastName": "Miller",
  "email": "robert@email.com",
  "dateOfBirth": "1985-03-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "phone": "+1-555-0101",
  "address": "123 Main St, New York, NY 10001",
  "emergencyContact": "+1-555-0102",
  "medicalHistory": "Hypertension, Diabetes Type 2",
  "createdAt": "2024-01-15T10:30:00"
}
```

### Doctor APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/doctors` | Get all doctors | All Authenticated |
| GET | `/doctors/{id}` | Get doctor by ID | All Authenticated |
| POST | `/doctors` | Create new doctor | ADMIN |
| PUT | `/doctors/{id}` | Update doctor | ADMIN, DOCTOR(own) |
| DELETE | `/doctors/{id}` | Delete doctor | ADMIN |
| GET | `/doctors/{id}/schedule` | Get doctor schedule | All Authenticated |
| PUT | `/doctors/{id}/schedule` | Update schedule | ADMIN, DOCTOR(own) |
| GET | `/doctors/{id}/appointments` | Get doctor appointments | ADMIN, DOCTOR(own) |
| GET | `/doctors/department/{deptId}` | Get doctors by department | All Authenticated |

#### Doctor Object
```json
{
  "id": 1,
  "userId": 5,
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@hospital.com",
  "specialization": "Cardiology",
  "licenseNumber": "MD-2024-001",
  "department": {
    "id": 1,
    "name": "Cardiology"
  },
  "experienceYears": 15,
  "consultationFee": 150.00,
  "isAvailable": true,
  "schedule": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

### Appointment APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/appointments` | Get all appointments | ADMIN, RECEPTIONIST |
| GET | `/appointments/{id}` | Get appointment by ID | ADMIN, DOCTOR(own), PATIENT(own), RECEPTIONIST |
| POST | `/appointments` | Create appointment | ADMIN, DOCTOR, RECEPTIONIST, PATIENT |
| PUT | `/appointments/{id}` | Update appointment | ADMIN, DOCTOR(own), RECEPTIONIST |
| PATCH | `/appointments/{id}/status` | Update status only | ADMIN, DOCTOR(own), RECEPTIONIST |
| DELETE | `/appointments/{id}` | Cancel appointment | ADMIN, RECEPTIONIST |
| GET | `/appointments/today` | Get today's appointments | ADMIN, DOCTOR, RECEPTIONIST |
| GET | `/appointments/doctor/{id}` | Get doctor's appointments | ADMIN, DOCTOR(own), RECEPTIONIST |
| GET | `/appointments/available-slots` | Get available time slots | All Authenticated |

#### Appointment Object
```json
{
  "id": 1,
  "patient": {
    "id": 1,
    "name": "Robert Miller"
  },
  "doctor": {
    "id": 1,
    "name": "Dr. John Smith",
    "specialization": "Cardiology"
  },
  "appointmentDate": "2024-12-15",
  "appointmentTime": "10:00",
  "status": "SCHEDULED",
  "reason": "Regular checkup",
  "notes": null,
  "createdAt": "2024-12-01T10:30:00"
}
```

### Prescription APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/prescriptions` | Get all prescriptions | ADMIN |
| GET | `/prescriptions/{id}` | Get prescription by ID | ADMIN, DOCTOR(own), PATIENT(own) |
| POST | `/prescriptions` | Create prescription | DOCTOR |
| PUT | `/prescriptions/{id}` | Update prescription | DOCTOR(own) |
| DELETE | `/prescriptions/{id}` | Delete prescription | ADMIN, DOCTOR(own) |
| GET | `/prescriptions/patient/{id}` | Get patient prescriptions | ADMIN, DOCTOR, PATIENT(own) |

#### Prescription Object
```json
{
  "id": 1,
  "appointmentId": 1,
  "patient": {
    "id": 1,
    "name": "Robert Miller"
  },
  "doctor": {
    "id": 1,
    "name": "Dr. John Smith"
  },
  "diagnosis": "Hypertension Stage 1",
  "notes": "Follow up in 2 weeks",
  "items": [
    {
      "id": 1,
      "medicineName": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take in the morning with water"
    }
  ],
  "createdAt": "2024-12-01T11:00:00"
}
```

### Billing APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/bills` | Get all bills | ADMIN, RECEPTIONIST |
| GET | `/bills/{id}` | Get bill by ID | ADMIN, RECEPTIONIST, PATIENT(own) |
| POST | `/bills` | Create bill | ADMIN, RECEPTIONIST |
| PUT | `/bills/{id}` | Update bill | ADMIN, RECEPTIONIST |
| POST | `/bills/{id}/payment` | Process payment | ADMIN, RECEPTIONIST, PATIENT(own) |
| GET | `/bills/patient/{id}` | Get patient bills | ADMIN, RECEPTIONIST, PATIENT(own) |
| GET | `/bills/pending` | Get pending bills | ADMIN, RECEPTIONIST |

#### Bill Object
```json
{
  "id": 1,
  "patient": {
    "id": 1,
    "name": "Robert Miller"
  },
  "appointmentId": 1,
  "items": [
    {
      "description": "Consultation Fee",
      "amount": 150.00
    },
    {
      "description": "ECG Test",
      "amount": 50.00
    }
  ],
  "totalAmount": 200.00,
  "paidAmount": 0.00,
  "status": "PENDING",
  "paymentMethod": null,
  "paymentDate": null,
  "createdAt": "2024-12-01T11:30:00"
}
```

### Dashboard APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/admin` | Admin dashboard stats | ADMIN |
| GET | `/dashboard/doctor` | Doctor dashboard stats | DOCTOR |
| GET | `/dashboard/patient` | Patient dashboard stats | PATIENT |
| GET | `/dashboard/nurse` | Nurse dashboard stats | NURSE |
| GET | `/dashboard/receptionist` | Receptionist dashboard stats | RECEPTIONIST |

#### Admin Dashboard Response
```json
{
  "totalPatients": 150,
  "totalDoctors": 25,
  "totalAppointments": 450,
  "todayAppointments": 32,
  "pendingBills": 45,
  "revenue": {
    "today": 5000.00,
    "thisMonth": 125000.00
  },
  "appointmentsByStatus": {
    "SCHEDULED": 120,
    "COMPLETED": 300,
    "CANCELLED": 30
  },
  "recentAppointments": [...],
  "topDoctors": [...]
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-12-01T12:00:00"
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 🎨 Frontend Structure

### Directory Structure
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── Dashboards/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── NurseDashboard.jsx
│   │   │   └── ReceptionistDashboard.jsx
│   │   ├── Common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Loading.jsx
│   │   ├── Patients/
│   │   │   ├── PatientList.jsx
│   │   │   ├── PatientForm.jsx
│   │   │   └── PatientDetails.jsx
│   │   ├── Doctors/
│   │   │   ├── DoctorList.jsx
│   │   │   ├── DoctorForm.jsx
│   │   │   └── DoctorDetails.jsx
│   │   ├── Appointments/
│   │   │   ├── AppointmentList.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── AppointmentCalendar.jsx
│   │   │   └── TimeSlotPicker.jsx
│   │   ├── Prescriptions/
│   │   │   ├── PrescriptionList.jsx
│   │   │   ├── PrescriptionForm.jsx
│   │   │   └── PrescriptionView.jsx
│   │   ├── Billing/
│   │   │   ├── BillList.jsx
│   │   │   ├── BillForm.jsx
│   │   │   └── PaymentForm.jsx
│   │   └── Charts/
│   │       ├── BarChart.jsx
│   │       ├── LineChart.jsx
│   │       └── PieChart.jsx
│   ├── services/
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── authService.js      # Auth API calls
│   │   ├── patientService.js   # Patient API calls
│   │   ├── doctorService.js    # Doctor API calls
│   │   ├── appointmentService.js
│   │   ├── prescriptionService.js
│   │   ├── billingService.js
│   │   └── dashboardService.js
│   ├── utils/
│   │   ├── authUtils.js        # Auth helper functions
│   │   ├── dateUtils.js        # Date formatting
│   │   ├── validationUtils.js  # Form validation
│   │   └── constants.js        # App constants
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useForm.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### Component Hierarchy
```
App
├── AuthContext.Provider
│   ├── PublicRoutes
│   │   ├── LandingPage
│   │   ├── Login
│   │   └── Register
│   └── PrivateRoutes
│       ├── AdminDashboard
│       │   ├── Sidebar
│       │   ├── Navbar
│       │   ├── Overview (Stats Cards + Charts)
│       │   ├── PatientList
│       │   ├── DoctorList
│       │   ├── AppointmentList
│       │   └── BillList
│       ├── DoctorDashboard
│       │   ├── Sidebar
│       │   ├── Navbar
│       │   ├── Overview
│       │   ├── AppointmentList (Today)
│       │   ├── PatientList (My Patients)
│       │   └── PrescriptionForm
│       ├── PatientDashboard
│       │   ├── Sidebar
│       │   ├── Navbar
│       │   ├── Overview
│       │   ├── AppointmentList (My Appointments)
│       │   ├── PrescriptionList
│       │   └── BillList
│       └── ... (Other Dashboards)
```

### Key Frontend Features

#### 1. Authentication Flow
```jsx
// Login.jsx - Core flow
const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    navigate(response.dashboardUrl);
  } catch (error) {
    setError(error.message);
  }
};
```

#### 2. API Service Pattern
```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Request interceptor - Add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 3. Protected Route Pattern
```jsx
// PrivateRoute.jsx
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

---

## 📅 Development Phases

### Phase 1: Foundation (Week 1-2)
**Goal: Project setup and basic authentication**

#### Backend Tasks
- [ ] Initialize Spring Boot project with dependencies
- [ ] Configure PostgreSQL connection
- [ ] Create User entity and repository
- [ ] Implement JWT authentication
- [ ] Create AuthController (login, register)
- [ ] Configure Spring Security with role-based access
- [ ] Set up CORS for frontend

#### Frontend Tasks
- [ ] Initialize React project with Tailwind CSS
- [ ] Create folder structure
- [ ] Build Login and Register pages
- [ ] Implement AuthContext and useAuth hook
- [ ] Create PrivateRoute component
- [ ] Set up Axios with interceptors
- [ ] Create basic layout (Navbar, Sidebar)

#### Deliverables
- ✅ User can register and login
- ✅ JWT tokens working
- ✅ Role-based route protection
- ✅ Basic UI layout ready

---

### Phase 2: Core Entities (Week 3-4)
**Goal: Patient, Doctor, and Department management**

#### Backend Tasks
- [ ] Create Patient, Doctor, Department entities
- [ ] Create DTOs for data transfer
- [ ] Implement repositories with custom queries
- [ ] Create service layer with business logic
- [ ] Build CRUD controllers
- [ ] Add validation with @Valid annotations
- [ ] Implement pagination and sorting

#### Frontend Tasks
- [ ] Build Admin Dashboard with tabs
- [ ] Create Patient List with search/filter
- [ ] Create Patient Form (Add/Edit modal)
- [ ] Create Doctor List with department filter
- [ ] Create Doctor Form (Add/Edit modal)
- [ ] Implement delete confirmation modal
- [ ] Add loading states and error handling

#### Deliverables
- ✅ Full CRUD for Patients
- ✅ Full CRUD for Doctors
- ✅ Department management
- ✅ Admin dashboard functional

---

### Phase 3: Appointment System (Week 5-6)
**Goal: Complete appointment booking and management**

#### Backend Tasks
- [ ] Create Appointment entity with relationships
- [ ] Create DoctorSchedule entity
- [ ] Implement appointment booking logic
- [ ] Add conflict detection (double booking)
- [ ] Create available slots API
- [ ] Implement appointment status updates
- [ ] Add appointment notifications (optional)

#### Frontend Tasks
- [ ] Create Appointment List with filters
- [ ] Build Appointment Booking Form
- [ ] Create Time Slot Picker component
- [ ] Implement Calendar view (optional)
- [ ] Add status update functionality
- [ ] Build Doctor's appointment view
- [ ] Build Patient's appointment view

#### Deliverables
- ✅ Patients can book appointments
- ✅ Doctors can view their schedule
- ✅ Admin can manage all appointments
- ✅ Conflict detection working

---

### Phase 4: Prescription & Billing (Week 7-8)
**Goal: Medical records and payment processing**

#### Backend Tasks
- [ ] Create Prescription and PrescriptionItem entities
- [ ] Create Bill and BillItem entities
- [ ] Implement prescription creation by doctors
- [ ] Build billing calculation logic
- [ ] Implement payment processing
- [ ] Add bill generation after appointments

#### Frontend Tasks
- [ ] Create Prescription Form for doctors
- [ ] Build Prescription View for patients
- [ ] Create Bill List with status filters
- [ ] Build Payment Form
- [ ] Add print prescription feature
- [ ] Add print bill/receipt feature

#### Deliverables
- ✅ Doctors can create prescriptions
- ✅ Patients can view prescriptions
- ✅ Bills generated for appointments
- ✅ Payment processing works

---

### Phase 5: Dashboards & Analytics (Week 9-10)
**Goal: Role-specific dashboards with analytics**

#### Backend Tasks
- [ ] Create Dashboard service with statistics
- [ ] Implement aggregation queries
- [ ] Build revenue reports API
- [ ] Create appointment trends API
- [ ] Implement activity logging

#### Frontend Tasks
- [ ] Build Admin Dashboard with charts
- [ ] Create Doctor Dashboard
- [ ] Create Patient Dashboard
- [ ] Create Nurse Dashboard
- [ ] Create Receptionist Dashboard
- [ ] Implement Recharts visualizations
- [ ] Add date range filters

#### Deliverables
- ✅ All role dashboards complete
- ✅ Real-time statistics
- ✅ Interactive charts
- ✅ Date-based filtering

---

### Phase 6: Polish & Deploy (Week 11-12)
**Goal: Testing, optimization, and deployment**

#### Tasks
- [ ] Write unit tests for services
- [ ] Write integration tests for APIs
- [ ] Frontend component testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] API documentation (Swagger)
- [ ] Docker containerization
- [ ] Deploy to cloud (AWS/Heroku)
- [ ] Set up CI/CD pipeline

#### Deliverables
- ✅ 80%+ test coverage
- ✅ API documentation complete
- ✅ Application deployed
- ✅ CI/CD working

---

## ⚙️ Setup Instructions

### Prerequisites
```bash
# Required software
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.9+
- Git
```

### Database Setup
```bash
# 1. Login to PostgreSQL
psql -U postgres

# 2. Create database
CREATE DATABASE caresync;

# 3. Create user (optional)
CREATE USER caresync_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE caresync TO caresync_user;

# 4. Exit
\q
```

### Backend Setup
```bash
# 1. Clone repository
git clone https://github.com/yourusername/caresync.git
cd caresync

# 2. Configure database connection
# Edit src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/caresync
spring.datasource.username=postgres
spring.datasource.password=your_password

# 3. Build project
./mvnw clean install

# 4. Run application
./mvnw spring-boot:run

# Backend will start on http://localhost:8080
```

### Frontend Setup
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Configure API URL
# Edit .env file
REACT_APP_API_URL=http://localhost:8080/api

# 4. Start development server
npm start

# Frontend will open on http://localhost:3000
```

### Quick Test
```bash
# Test backend health
curl http://localhost:8080/api/health

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@caresync.com","password":"admin123"}'
```

---

## 📝 Resume Highlights

### Project Description (for Resume)
```
CareSync - Hospital Management System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A full-stack hospital management application with role-based access control,
enabling efficient management of patients, doctors, appointments, prescriptions,
and billing. Built with Spring Boot backend and React frontend.

Key Achievements:
• Implemented JWT-based authentication with 5-role RBAC system
• Designed and normalized PostgreSQL database with 12+ tables
• Built RESTful APIs following industry standards
• Created responsive dashboards with real-time analytics
• Achieved 90%+ code coverage with unit and integration tests
```

### Technical Skills Demonstrated
```
Backend:
• Java 17, Spring Boot 3.x, Spring Security 6.x
• Spring Data JPA, Hibernate ORM
• JWT Authentication, BCrypt encryption
• PostgreSQL, HikariCP connection pooling
• RESTful API design, DTO pattern
• Maven build automation

Frontend:
• React 18, React Router 6
• Axios HTTP client
• Tailwind CSS, Responsive design
• Recharts data visualization
• Context API state management
• Protected routes implementation

DevOps:
• Git version control
• Docker containerization
• CI/CD pipeline (GitHub Actions)
• Cloud deployment (Vercel/Render)
```

### 🎭 Demo Access for Recruiters
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Live Demo: https://caresync-demo.vercel.app

📧 Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ROLE          EMAIL                      PASSWORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADMIN         admin@caresync.com         Admin@123
 TEST (Demo)   demo@caresync.com          Test@123$
 DOCTOR        john.smith@caresync.com    Doctor@123
 PATIENT       robert.miller@email.com    Patient@123
 NURSE         lisa.nurse@caresync.com    Nurse@123
 RECEPTIONIST  mary.reception@caresync.com Reception@123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ What you can explore:
   • All 5 role dashboards (Admin, Doctor, Patient, Nurse, Receptionist)
   • Patient & Doctor management views
   • Appointment scheduling interface
   • Prescription & Billing modules
   • Analytics & Charts

⚠️ Note: TEST role has READ-ONLY access. Write operations are disabled.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Talking Points for Interviews
```
1. "I implemented a comprehensive RBAC system with 5 roles and 
   granular permissions using Spring Security and JWT tokens."

2. "I designed a normalized database schema with proper foreign 
   key relationships and implemented efficient JPA queries."

3. "I built reusable React components and implemented protected 
   routes to ensure role-based access on the frontend."

4. "I used the DTO pattern to separate API responses from 
   database entities, improving security and flexibility."

5. "I implemented real-time dashboard analytics with 
   aggregation queries and interactive charts."
```

---

## 🚀 Next Steps

1. **Start with Phase 1** - Get authentication working end-to-end
2. **Use this document** as your reference throughout development
3. **Commit frequently** with meaningful messages
4. **Test each feature** before moving to the next
5. **Document your APIs** using Swagger/OpenAPI

---

**Good luck with your project! 🎉**

*Last Updated: December 2024*
