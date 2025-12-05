# 🏥 CareSync - Hospital Management System

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack hospital management system with role-based access control for admins, doctors, nurses, receptionists, and patients. Built with modern technologies and production-ready practices.

![CareSync Dashboard](docs/images/dashboard-preview.png)

## 🌟 Features

### Role-Based Access Control (RBAC)
| Role | Capabilities |
|------|--------------|
| **Admin** | Full system access, revenue analytics, user management, system configuration |
| **Doctor** | Patient appointments, prescriptions, medical records, consultation management |
| **Nurse** | Patient vitals, assigned appointments, prescription viewing, care coordination |
| **Receptionist** | Appointment scheduling, patient registration, billing, check-in/check-out |
| **Patient** | View appointments, prescriptions, bills, medical history |

### Core Modules
- 📅 **Appointment Management** - Schedule, reschedule, cancel appointments
- 💊 **Prescription System** - Create and manage prescriptions with medications
- 💰 **Billing & Payments** - Generate bills, track payments (₹ INR format)
- 👥 **Patient Records** - Complete medical history and demographics
- 📊 **Dashboard Analytics** - Role-specific KPIs and real-time charts
- 🔍 **Global Search** - Search patients, doctors, appointments across system

## 🛠️ Tech Stack

### Backend
- **Java 17** - Core language
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Database

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Maven** - Build tool
- **GitHub Actions** - CI/CD (optional)

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.8+

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Sriramanenivikas/CARESYNC.git
cd CARESYNC
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb CARESYNC

# Run schema migration
psql -U postgres -d CARESYNC -f database/schema.sql

# Seed Indian demo data
psql -U postgres -d CARESYNC -f database/indian_seed_data.sql
```

### 3. Backend Setup
```bash
# Configure database connection
# Edit src/main/resources/application.properties

# Build and run
./mvnw spring-boot:run
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## 🔐 Demo Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Test (Demo)** | test | Test@123$ | Read-only admin access for recruiters |
| **Doctor** | dr.smith | Doctor@123 | Full doctor capabilities |
| **Nurse** | nurse.lisa | Nurse@123 | Nursing staff access |
| **Receptionist** | reception.mary | Reception@123 | Front desk operations |
| **Patient** | patient.robert | Patient@123 | Patient self-service |

> **Note**: The Test/Demo account has admin-level view access but cannot create, update, or delete any data. This is designed for recruiters to explore the full system safely.

## 📁 Project Structure

```
CARESYNC/
├── src/
│   └── main/
│       ├── java/com/caresync/
│       │   ├── controller/     # REST API endpoints
│       │   ├── service/        # Business logic
│       │   ├── repository/     # Data access layer
│       │   ├── model/          # Entity classes
│       │   ├── dto/            # Data transfer objects
│       │   ├── security/       # JWT & Spring Security
│       │   └── exception/      # Custom exceptions
│       └── resources/
│           └── application.properties
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Page components
│       ├── services/           # API services
│       ├── context/            # React context providers
│       └── utils/              # Utility functions
├── database/
│   ├── schema.sql              # Database schema
│   └── indian_seed_data.sql    # Sample data (Indian names)
├── postman/                    # API test collections
├── Dockerfile                  # Docker configuration
└── pom.xml                     # Maven dependencies
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | Database connection URL | `jdbc:postgresql://localhost:5432/CARESYNC` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRATION` | Token expiration (ms) | `86400000` |

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/CARESYNC
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000

# Server
server.port=8080
```

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the image
docker build -t caresync:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/CARESYNC \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=yourpassword \
  --name caresync \
  caresync:latest
```

### Docker Compose (Full Stack)
```bash
docker-compose up -d
```

## 🧪 Testing

### Backend Tests
```bash
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing with Postman
1. Import collection from `postman/` folder
2. Set environment variables (base_url, token)
3. Run collection

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh` | Refresh token |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patients |
| GET | `/api/patients/{id}` | Get patient by ID |
| POST | `/api/patients` | Create patient |
| PUT | `/api/patients/{id}` | Update patient |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments |
| GET | `/api/appointments/today` | Today's appointments |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/{id}/status` | Update status |

### Bills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bills` | List all bills |
| GET | `/api/bills/pending` | Pending bills |
| POST | `/api/bills` | Create bill |
| PUT | `/api/bills/{id}/pay` | Process payment |

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Granular permissions
- **Input Validation** - XSS and SQL injection prevention
- **CORS Configuration** - Controlled cross-origin requests
- **Password Hashing** - BCrypt encryption
- **Rate Limiting** - API abuse prevention

## 🌐 Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
4. Deploy!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikas Sriramaneni**
- LinkedIn: [linkedin.com/in/sriramanenivikas](https://www.linkedin.com/in/sriramanenivikas/)
- GitHub: [github.com/Sriramanenivikas](https://github.com/Sriramanenivikas)

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- React community for the excellent ecosystem
- All contributors and testers

---

⭐ **Star this repository if you find it helpful!**

*Built with ❤️ for learning and demonstration purposes.*
