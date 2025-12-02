<p align="center">
  <img src="https://img.shields.io/badge/CARESYNC-Hospital%20Management%20System-blue?style=for-the-badge&logo=hospital&logoColor=white" alt="CARESYNC"/>
</p>

<h1 align="center">🏥 CARESYNC - Hospital Management System</h1>

<p align="center">
  <em>A comprehensive full-stack hospital management solution with role-based access control</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.1.5-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=json-web-tokens&logoColor=white" alt="JWT"/>
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📖 About

**CARESYNC** is a full-stack Hospital Management System designed to streamline healthcare operations. It provides a comprehensive solution for managing patients, doctors, appointments, prescriptions, billing, laboratory tests, and pharmacy inventory with a robust role-based access control system.

The system supports **7 different user roles**, each with their own dedicated dashboard and specific permissions, ensuring secure and efficient hospital management.

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Token Authentication** - Secure stateless authentication
- **Role-Based Access Control (RBAC)** - 7 different user roles with specific permissions
- **OTP Verification** - Email-based OTP for enhanced security
- **Protected Routes** - Unauthorized access prevention
- **Password Encryption** - Secure password hashing

### 👥 User Management
- Multi-role user registration and management
- Automatic dashboard routing based on role
- Session management with token expiry handling

### 🏥 Hospital Operations
- **Patient Management** - Registration, records, history
- **Doctor Management** - Schedules, appointments, prescriptions
- **Appointment System** - Booking, scheduling, reminders
- **Billing & Invoicing** - Generate bills, payment tracking
- **Bed Management** - Availability, assignments
- **Pharmacy** - Prescription dispensing, inventory management
- **Laboratory** - Test requests, results, reports

### 📊 Dashboards
- Role-specific dashboards with relevant statistics
- Real-time data visualization
- Quick action buttons for common tasks

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Description |
|------------|---------|-------------|
| ![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | 21 | Programming Language |
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-6DB33F?style=flat-square&logo=spring-boot&logoColor=white) | 3.1.5 | Application Framework |
| ![Spring Security](https://img.shields.io/badge/Spring%20Security-Latest-6DB33F?style=flat-square&logo=spring-security&logoColor=white) | Latest | Security Framework |
| ![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-Latest-6DB33F?style=flat-square&logo=spring&logoColor=white) | Latest | Data Persistence |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=flat-square&logo=postgresql&logoColor=white) | 15+ | Database |
| ![JWT](https://img.shields.io/badge/JJWT-0.13.0-000000?style=flat-square&logo=json-web-tokens&logoColor=white) | 0.13.0 | JWT Authentication |
| ![Maven](https://img.shields.io/badge/Maven-3.8+-C71A36?style=flat-square&logo=apache-maven&logoColor=white) | 3.8+ | Build Tool |
| ![Lombok](https://img.shields.io/badge/Lombok-1.18.34-red?style=flat-square) | 1.18.34 | Code Generation |
| ![ModelMapper](https://img.shields.io/badge/ModelMapper-3.1.1-blue?style=flat-square) | 3.1.1 | Object Mapping |

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| ![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black) | 18.2.0 | UI Library |
| ![React Router](https://img.shields.io/badge/React%20Router-6.20-CA4245?style=flat-square&logo=react-router&logoColor=white) | 6.20.0 | Routing |
| ![Axios](https://img.shields.io/badge/Axios-1.6.2-5A29E4?style=flat-square&logo=axios&logoColor=white) | 1.6.2 | HTTP Client |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.5-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | 3.3.5 | CSS Framework |
| ![React Icons](https://img.shields.io/badge/React%20Icons-4.12-red?style=flat-square&logo=react&logoColor=white) | 4.12.0 | Icon Library |
| ![Recharts](https://img.shields.io/badge/Recharts-2.10.3-22B5BF?style=flat-square) | 2.10.3 | Charts Library |

---

## 📁 Project Structure

```
CARESYNC/
├── 📄 pom.xml                          # Maven configuration
├── 📄 CARESYNC struc.sql               # Database schema
├── 📂 src/
│   ├── 📂 main/
│   │   ├── 📂 java/DATAJPA/
│   │   │   ├── 📄 DataJPA_Application.java    # Main application
│   │   │   ├── 📂 Controller/                 # REST Controllers
│   │   │   ├── 📂 Service/                    # Business Logic
│   │   │   ├── 📂 Repository/                 # Data Access
│   │   │   ├── 📂 Entity/                     # JPA Entities
│   │   │   ├── 📂 Dto/                        # Data Transfer Objects
│   │   │   ├── 📂 Exception/                  # Custom Exceptions
│   │   │   ├── 📂 config/                     # Configuration Classes
│   │   │   └── 📂 security/                   # Security Configuration
│   │   └── 📂 resources/
│   │       └── 📄 application-DataJPA.properties
│   └── 📂 test/                               # Test files
└── 📂 frontend/
    ├── 📄 package.json
    ├── 📂 public/
    └── 📂 src/
        ├── 📂 components/
        │   ├── 📂 Auth/                       # Login, PrivateRoute
        │   ├── 📂 Dashboards/                 # Role-specific dashboards
        │   └── 📂 Layout/                     # Shared layouts
        ├── 📂 services/                       # API services
        ├── 📂 utils/                          # Utility functions
        ├── 📄 App.js
        └── 📄 index.js
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| Java JDK | 21+ | [Download](https://adoptium.net/) |
| Node.js | 14+ | [Download](https://nodejs.org/) |
| PostgreSQL | 15+ | [Download](https://www.postgresql.org/download/) |
| Maven | 3.8+ | [Download](https://maven.apache.org/download.cgi) |
| npm | 6+ | Comes with Node.js |

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sriramanenivikas/CARESYNC.git
cd CARESYNC
```

### 2️⃣ Database Setup

1. **Create PostgreSQL Database:**
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE CARESYNC;
   
   # Connect to database
   \c CARESYNC
   ```

2. **Run the Schema File:**
   ```bash
   # Import the database schema
   psql -U postgres -d CARESYNC -f "CARESYNC struc.sql"
   ```

### 3️⃣ Backend Setup

1. **Configure Database Connection:**
   
   Edit `src/main/resources/application-DataJPA.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/CARESYNC
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. **Build and Run:**
   ```bash
   # Install dependencies and build
   ./mvnw clean install
   
   # Run the application
   ./mvnw spring-boot:run
   ```
   
   The backend will start at `http://localhost:2222`

### 4️⃣ Frontend Setup

1. **Navigate to Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL:**
   
   Create/Edit `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:2222
   REACT_APP_API_BASE_URL=http://localhost:2222/api
   ```

4. **Start Development Server:**
   ```bash
   npm start
   ```
   
   The frontend will open at `http://localhost:3000`

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | PostgreSQL connection URL | `jdbc:postgresql://localhost:5432/CARESYNC` |
| `spring.datasource.username` | Database username | `vikas` |
| `spring.datasource.password` | Database password | `vikas123` |
| `server.port` | Server port | `2222` |
| `jwt.secretKey` | JWT signing key | (configured in properties) |
| `spring.mail.username` | Email for OTP | (configure your email) |
| `spring.mail.password` | Email app password | (configure app password) |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:2222` |
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:2222/api` |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | User login |
| `POST` | `/auth/logout` | User logout |
| `POST` | `/auth/register` | User registration |
| `POST` | `/auth/verify-otp` | Verify OTP |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Auto-detect role dashboard |
| `GET` | `/api/dashboard/admin` | Admin dashboard data |
| `GET` | `/api/dashboard/doctor` | Doctor dashboard data |
| `GET` | `/api/dashboard/patient` | Patient dashboard data |
| `GET` | `/api/dashboard/receptionist` | Receptionist dashboard data |
| `GET` | `/api/dashboard/nurse` | Nurse dashboard data |
| `GET` | `/api/dashboard/pharmacist` | Pharmacist dashboard data |
| `GET` | `/api/dashboard/lab-technician` | Lab technician dashboard data |

### Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patients` | Get all patients |
| `GET` | `/api/patients/{id}` | Get patient by ID |
| `POST` | `/api/patients` | Create new patient |
| `PUT` | `/api/patients/{id}` | Update patient |
| `DELETE` | `/api/patients/{id}` | Delete patient |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/appointments` | Get all appointments |
| `POST` | `/api/appointments` | Create appointment |
| `PUT` | `/api/appointments/{id}` | Update appointment |
| `DELETE` | `/api/appointments/{id}` | Cancel appointment |

---

## 👥 User Roles

CARESYNC supports **7 user roles**, each with specific permissions and dedicated dashboards:

| Role | Icon | Permissions |
|------|------|-------------|
| **Admin** | 👑 | Full system access, user management, reports, settings |
| **Doctor** | 👨‍⚕️ | Manage appointments, patients, prescriptions, medical records |
| **Patient** | 🏃 | View appointments, prescriptions, bills, find doctors |
| **Receptionist** | 📋 | Patient registration, appointment booking, billing, bed management |
| **Nurse** | 👩‍⚕️ | Patient care, bed management, task management |
| **Pharmacist** | 💊 | Prescription management, medicine dispensing, inventory |
| **Lab Technician** | 🔬 | Lab test management, results upload, report generation |

### Role-Specific Dashboards

Each role has access to a customized dashboard with relevant:
- 📊 **Statistics** - Key metrics and counts
- ⚡ **Quick Actions** - Frequently used operations
- 📋 **Recent Activity** - Latest updates and tasks

---

## 📸 Screenshots

> 🚧 **Coming Soon**
> 
> Screenshots of the application will be added here, including:
> - Login Page
> - Admin Dashboard
> - Doctor Dashboard
> - Patient Dashboard
> - Appointment Management
> - Prescription Management
> - Billing System

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features

---

## 📄 License

This project is part of the **CARESYNC Hospital Management System**.

---

## 👤 Author

<p align="center">
  <strong>Vikas Sriramaneni</strong>
</p>

<p align="center">
  <a href="https://github.com/Sriramanenivikas">
    <img src="https://img.shields.io/badge/GitHub-Sriramanenivikas-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
</p>

---

<p align="center">
  <em>For detailed frontend documentation, see <a href="./frontend/README.md">frontend/README.md</a></em>
</p>

<p align="center">
  ⭐ Star this repository if you find it helpful!
</p>
