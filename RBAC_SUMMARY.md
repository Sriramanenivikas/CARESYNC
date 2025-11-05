# 🔐 CareSync Role-Based Access Control (RBAC) Summary

## 5 System Roles
1. **ADMIN** - Full system access
2. **DOCTOR** - Medical staff
3. **PATIENT** - Hospital patients
4. **RECEPTIONIST** - Front desk staff
5. **NURSE** - Nursing staff

---

## 📊 Complete Access Control Matrix

### 🔐 Authentication & Authorization (`/auth`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| POST /auth/login | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /auth/register | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /auth/otp/request | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /auth/otp/verify | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /auth/logout | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /auth/me | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 👥 Patient Management (`/Patients`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| POST /Patients | ✅ | ❌ | ❌ | ✅ | ❌ |
| GET /Patients | ✅ | ✅ | ❌ | ✅ | ✅ |
| GET /Patients/list | ✅ | ✅ | ❌ | ✅ | ✅ |
| GET /Patients/paginated | ✅ | ✅ | ❌ | ✅ | ✅ |
| GET /Patients/{id} | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /Patients/{id}/details | ✅ | ✅ | ✅ | ✅ | ✅ |
| PUT /Patients/{id} | ✅ | ❌ | ❌ | ✅ | ❌ |
| DELETE /Patients/{id} | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 👨‍⚕️ Doctor Management (`/Doctors`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| POST /Doctors | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /Doctors | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /Doctors/{id} | ✅ | ✅ | ✅ | ✅ | ✅ |
| PUT /Doctors/{id} | ✅ | ✅* | ❌ | ❌ | ❌ |
| DELETE /Doctors/{id} | ✅ | ❌ | ❌ | ❌ | ❌ |

*Doctor can update own profile

---

### 📅 Appointment Management (`/api/appointments`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| POST /api/appointments | ✅ | ❌ | ✅ | ✅ | ❌ |
| GET /api/appointments | ✅ | ✅ | ❌ | ✅ | ❌ |
| GET /api/appointments/{id} | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/appointments/patient/{id} | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/appointments/doctor/{id} | ✅ | ✅ | ❌ | ✅ | ❌ |
| GET /api/appointments/status/{status} | ✅ | ✅ | ❌ | ✅ | ❌ |
| PUT /api/appointments/{id} | ✅ | ✅ | ❌ | ✅ | ❌ |
| PUT /api/appointments/{id}/cancel | ✅ | ❌ | ✅ | ✅ | ❌ |
| DELETE /api/appointments/{id} | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 💰 Billing & Payments (`/api/billing`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| POST /api/billing/bills | ✅ | ✅ | ❌ | ✅ | ❌ |
| GET /api/billing/bills/{billId} | ✅ | ✅ | ✅* | ✅ | ❌ |
| GET /api/billing/bills/patient/{patientId} | ✅ | ❌ | ✅* | ✅ | ❌ |
| POST /api/billing/bills/{billId}/items | ✅ | ❌ | ❌ | ✅ | ❌ |
| POST /api/billing/payments | ✅ | ❌ | ❌ | ✅ | ❌ |

*Patient can only view own bills

---

### 💊 Prescription Management (`/api/prescriptions`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE | PHARMACIST |
|----------|-------|--------|---------|--------------|-------|------------|
| POST /api/prescriptions | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/prescriptions/{id} | ✅ | ✅ | ✅* | ❌ | ❌ | ✅ |
| GET /api/prescriptions/patient/{id} | ✅ | ✅ | ✅* | ❌ | ❌ | ❌ |
| GET /api/prescriptions/doctor/{id} | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PUT /api/prescriptions/{id}/dispense | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

*Patient can only view own prescriptions

---

### 🔔 Notifications (`/api/notifications`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| GET /api/notifications/user/{userId} | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/notifications/user/{userId}/unread | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/notifications/user/{userId}/unread/count | ✅ | ✅ | ✅ | ✅ | ✅ |
| PUT /api/notifications/{id}/read | ✅ | ✅ | ✅ | ✅ | ✅ |
| PUT /api/notifications/user/{userId}/read-all | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 📊 Dashboards (`/api/dashboard`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| GET /api/dashboard/admin | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/dashboard/doctor | ❌ | ✅ | ❌ | ❌ | ❌ |
| GET /api/dashboard/patient | ❌ | ❌ | ✅ | ❌ | ❌ |
| GET /api/dashboard/receptionist | ❌ | ❌ | ❌ | ✅ | ❌ |
| GET /api/dashboard/nurse | ❌ | ❌ | ❌ | ❌ | ✅ |
| GET /api/dashboard/me | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 🔧 Admin Functions (`/api/admin`)
| Endpoint | ADMIN | DOCTOR | PATIENT | RECEPTIONIST | NURSE |
|----------|-------|--------|---------|--------------|-------|
| GET /api/admin/stats | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/admin/activity-logs | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/admin/activity-logs/date-range | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/admin/users | ✅ | ❌ | ❌ | ❌ | ❌ |
| PUT /api/admin/users/{userId}/status | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/admin/reports/revenue | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/admin/reports/appointments | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/admin/reports/bed-occupancy | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🎯 Role-Based Feature Summary

### 👑 ADMIN
**Full System Access**
- ✅ Create/Update/Delete all entities
- ✅ View all data and reports
- ✅ Manage users and roles
- ✅ Access activity logs
- ✅ Generate reports
- ✅ System configuration

### 👨‍⚕️ DOCTOR
**Medical Operations**
- ✅ View patient lists and details
- ✅ Create prescriptions
- ✅ Update appointment status
- ✅ View medical records
- ✅ Update own profile
- ✅ View own appointments
- ❌ Cannot manage billing
- ❌ Cannot delete records

### 👤 PATIENT
**Personal Access**
- ✅ View own appointments
- ✅ Create new appointments
- ✅ Cancel own appointments
- ✅ View own prescriptions
- ✅ View own medical records
- ✅ View own bills
- ✅ View doctor list
- ❌ Cannot view other patients
- ❌ Cannot modify medical data

### 💁 RECEPTIONIST
**Front Desk Operations**
- ✅ Create/Update patient records
- ✅ Create appointments
- ✅ Manage billing
- ✅ Record payments
- ✅ View patient lists
- ✅ Cancel appointments
- ❌ Cannot create prescriptions
- ❌ Cannot access medical records

### 🩺 NURSE
**Nursing Operations**
- ✅ View patient lists
- ✅ View patient details
- ✅ View appointments
- ✅ Access patient vitals (when implemented)
- ✅ View nursing notes (when implemented)
- ❌ Cannot create prescriptions
- ❌ Cannot manage billing
- ❌ Cannot create appointments

---

## 🔒 Security Implementation

### Spring Security Configuration
```java
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
```

### Authorization Annotations Used
- `@PreAuthorize("hasRole('ADMIN')")` - Single role
- `@PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")` - Multiple roles
- `@Secured("ROLE_ADMIN")` - Alternative annotation

### JWT Token Claims
- User ID
- Username
- Email
- **Role** (ADMIN, DOCTOR, PATIENT, RECEPTIONIST, NURSE)
- Expiry time

---

## 🧪 Testing Role-Based Access

### 1. Create Test Users
```sql
-- Admin User
INSERT INTO users (username, password, email, role, is_active) 
VALUES ('admin', '$2a$10$...', 'admin@caresync.com', 'ADMIN', true);

-- Doctor User
INSERT INTO users (username, password, email, role, is_active) 
VALUES ('dr_sharma', '$2a$10$...', 'sharma@caresync.com', 'DOCTOR', true);

-- Patient User
INSERT INTO users (username, password, email, role, is_active) 
VALUES ('patient123', '$2a$10$...', 'patient@email.com', 'PATIENT', true);

-- Receptionist User
INSERT INTO users (username, password, email, role, is_active) 
VALUES ('receptionist', '$2a$10$...', 'reception@caresync.com', 'RECEPTIONIST', true);

-- Nurse User
INSERT INTO users (username, password, email, role, is_active) 
VALUES ('nurse_mary', '$2a$10$...', 'nurse@caresync.com', 'NURSE', true);
```

### 2. Test Access
```bash
# Login as different users
curl -X POST http://localhost:2222/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "password123"}'

# Use token in subsequent requests
curl -X GET http://localhost:2222/api/dashboard/admin \
-H "Authorization: Bearer <TOKEN>"
```

---

## 📝 Frontend Integration

### Conditional Rendering by Role
```javascript
const userRole = localStorage.getItem('userRole');

// Show menu based on role
if (userRole === 'ADMIN') {
  showAdminMenu();
} else if (userRole === 'DOCTOR') {
  showDoctorMenu();
} else if (userRole === 'PATIENT') {
  showPatientMenu();
} else if (userRole === 'RECEPTIONIST') {
  showReceptionistMenu();
} else if (userRole === 'NURSE') {
  showNurseMenu();
}
```

### Route Protection
```javascript
const ProtectedRoute = ({ role, allowedRoles }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};
```

---

## ✅ All Controllers Updated

1. ✅ **AuthController** - Public + All roles
2. ✅ **PatientController** - Role-based CRUD
3. ✅ **DoctorController** - Role-based CRUD
4. ✅ **AppointmentController** - Full RBAC implementation
5. ✅ **BillingController** - Financial access control
6. ✅ **PrescriptionController** - Medical access control
7. ✅ **NotificationController** - User-specific access
8. ✅ **DashboardController** - Role-specific dashboards
9. ✅ **AdminController** - Admin-only operations

---

## 🎉 Summary

- ✅ **5 distinct roles** implemented
- ✅ **9 controllers** with proper RBAC
- ✅ **50+ endpoints** secured
- ✅ **Method-level security** enabled
- ✅ **JWT token** with role claims
- ✅ **Production-ready** access control

All role-based access control is now properly configured and ready for use!

