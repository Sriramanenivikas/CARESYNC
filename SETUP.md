# CareSync - Setup Guide

This guide will help you set up CareSync Hospital Management System on your local machine.

## Prerequisites

Ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| Java JDK | 17+ | [Download](https://adoptium.net/) |
| Node.js | 18+ | [Download](https://nodejs.org/) |
| PostgreSQL | 14+ | [Download](https://www.postgresql.org/download/) |
| Maven | 3.8+ | [Download](https://maven.apache.org/download.cgi) |
| Git | Latest | [Download](https://git-scm.com/) |

## Quick Setup (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/Sriramanenivikas/CARESYNC.git
cd CARESYNC
```

### 2. Database Setup
```bash
# Create database
createdb CARESYNC

# Or using psql
psql -U postgres -c "CREATE DATABASE CARESYNC;"

# Run schema
psql -U postgres -d CARESYNC -f database/schema.sql

# Seed data (Indian names)
psql -U postgres -d CARESYNC -f database/indian_seed_data.sql
```

### 3. Backend Setup
```bash
# Update database credentials in src/main/resources/application.properties
# spring.datasource.password=your_password

# Build and run
./mvnw spring-boot:run
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Docs**: http://localhost:8080/swagger-ui.html

---

## Detailed Setup

### Database Configuration

#### Option A: Using PostgreSQL CLI
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE CARESYNC;
CREATE USER caresync_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE CARESYNC TO caresync_user;

# Exit and run migrations
\q
psql -U caresync_user -d CARESYNC -f database/schema.sql
psql -U caresync_user -d CARESYNC -f database/indian_seed_data.sql
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `CARESYNC`
4. Open Query Tool
5. Run `database/schema.sql`
6. Run `database/indian_seed_data.sql`

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/CARESYNC
spring.datasource.username=postgres
spring.datasource.password=your_password

# JWT Settings
jwt.secret=your-256-bit-secret-key-here-make-it-long-and-random
jwt.expiration=86400000

# Server
server.port=8080

# JPA Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
```

### Environment Variables (Recommended)

Instead of hardcoding, use environment variables:

```bash
# Linux/Mac
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/CARESYNC
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret-key

# Windows PowerShell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/CARESYNC"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
```

### Frontend Configuration

Create `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_NAME=CareSync
```

---

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | test | Test@123$ |
| Doctor | dr.smith | Doctor@123 |
| Nurse | nurse.lisa | Nurse@123 |
| Receptionist | reception.mary | Recept@123 |
| Patient | patient.robert | Patient@123 |

---

## Running Tests

### Backend Tests
```bash
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Tests (Postman)
1. Import `postman/CareSync_Auth_Tests.json`
2. Set environment variable `baseUrl` = `http://localhost:8080/api`
3. Run collection

---

## Docker Setup

### Build Docker Image
```bash
docker build -t caresync:latest .
```

### Run with Docker
```bash
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/CARESYNC \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  -e JWT_SECRET=your-secret-key \
  --name caresync \
  caresync:latest
```

### Docker Compose (Full Stack)
```bash
docker-compose up -d
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```
Error: Connection refused to localhost:5432
```
**Solution**: 
- Ensure PostgreSQL is running: `sudo service postgresql start`
- Check credentials in application.properties

#### 2. Port Already in Use
```
Error: Port 8080 already in use
```
**Solution**:
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

#### 3. Node Modules Error
```
Error: Module not found
```
**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. JWT Token Invalid
```
Error: JWT signature does not match
```
**Solution**: Ensure `jwt.secret` is the same across all instances

#### 5. CORS Error
```
Error: Access-Control-Allow-Origin
```
**Solution**: Backend CORS is configured for `http://localhost:3000`. Update if using different port.

---

## Production Deployment

### Render Deployment

1. Create Web Service on Render
2. Connect GitHub repository
3. Set Build Command: `./mvnw clean package -DskipTests`
4. Set Start Command: `java -jar target/*.jar`
5. Add environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`

### Frontend Deployment (Vercel/Netlify)

1. Connect `frontend/` folder
2. Build Command: `npm run build`
3. Publish Directory: `build`
4. Set `REACT_APP_API_URL` to your backend URL

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Sriramanenivikas/CARESYNC/issues)
- **Author**: [Vikas Sriramaneni](https://www.linkedin.com/in/sriramanenivikas/)

---

*Happy coding! 🏥*
