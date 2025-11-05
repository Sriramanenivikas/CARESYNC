# 🚀 How to Run CareSync Frontend

## ⚠️ IMPORTANT: Backend Configuration

The backend runs on **PORT 2222**, not 8080!

## Quick Start (4 Steps)

### Step 0: Ensure Prerequisites
Before starting, make sure you have:
- ✅ **PostgreSQL** running on port 5432
- ✅ **Database** named `CARESYNC` created
- ✅ **Java 21** installed
- ✅ **Maven** installed
- ✅ **Node.js** and **npm** installed

#### Check PostgreSQL:
```bash
# Check if PostgreSQL is running
psql -U vikas -d CARESYNC -c "SELECT 1;"

# If not, start PostgreSQL
brew services start postgresql
```
---

## 📝 Test Login Credentials

Once the frontend loads, you can test with these credentials:
mvn spring-boot:run -Dspring-boot.run.profiles=DataJPA
### Admin Dashboard
The backend should be running on **http://localhost:2222**
- **Password:** `admin123`
- **Auto-redirects to:** `/dashboard/admin`

### Doctor Dashboard
- **Username:** `doctor1`
- **Password:** `doctor123`
- **Auto-redirects to:** `/dashboard/doctor`

### Patient Dashboard
- **Username:** `patient1`
- **Password:** `patient123`
- **Auto-redirects to:** `/dashboard/patient`

### Receptionist Dashboard
- **Username:** `receptionist1`
- **Password:** `receptionist123`
- **Auto-redirects to:** `/dashboard/receptionist`

### Nurse Dashboard
- **Username:** `nurse1`
- **Password:** `nurse123`
- **Auto-redirects to:** `/dashboard/nurse`

---

## ✅ What Happens After Login?

1. **Login Page** - Enter username & password
2. **Authentication** - System validates credentials with backend
3. **JWT Token** - Secure token is generated and stored
4. **Auto-Redirect** - You're automatically sent to your role-specific dashboard!
   - Admin → `/dashboard/admin`
   - Doctor → `/dashboard/doctor`
   - Patient → `/dashboard/patient`
   - Receptionist → `/dashboard/receptionist`
   - Nurse → `/dashboard/nurse`
   - Pharmacist → `/dashboard/pharmacist`
   - Lab Technician → `/dashboard/lab-technician`

---

## 🛠️ Troubleshooting

### Problem: "npm: command not found"
**Solution:** Install Node.js
```bash
# On macOS with Homebrew
brew install node

# Or download from: https://nodejs.org/
```

### Problem: "Cannot connect to backend"
**Solution:** Ensure backend is running
```bash
# Check if backend is running
curl http://localhost:2222/api/dashboard/me

# If not, start it:
cd /Users/vikas/Downloads/CareSync
./mvnw spring-boot:run -Dspring-boot.run.profiles=DataJPA
```

### Problem: Port 3000 already in use
### ❌ Problem: Login Failed / Cannot connect to backend
This is the most common issue!

**Root Causes:**
1. Backend is not running
2. Backend is running on wrong port
3. Frontend is configured for wrong port
4. Database is not running

**Solution - Step by Step:**

#### 1️⃣ Verify Backend Port
The backend runs on **PORT 2222**, not 8080!
```bash
# Check if backend is running on port 2222
lsof -i :2222

# Or test the login endpoint
curl -X POST http://localhost:2222/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 2️⃣ Check Frontend Configuration
Make sure `/Users/vikas/Downloads/CareSync/frontend/.env` contains:
```env
REACT_APP_API_URL=http://localhost:2222
REACT_APP_API_BASE_URL=http://localhost:2222
```

#### 3️⃣ Restart Frontend After .env Changes
```bash
# .env changes require restart
cd /Users/vikas/Downloads/CareSync/frontend
# Kill the running frontend (Ctrl+C)
npm start
```

#### 4️⃣ Check Database Connection
```bash
# Verify PostgreSQL is running and database exists
psql -U vikas -d CARESYNC -c "\dt"

# If connection fails, start PostgreSQL
brew services start postgresql

# Create database if needed
createdb -U vikas CARESYNC
```

#### 5️⃣ Start Backend Properly
```bash
cd /Users/vikas/Downloads/CareSync

# Use Maven directly (recommended)
mvn spring-boot:run -Dspring-boot.run.profiles=DataJPA

# Wait for this message:
# "Started DataJPA_Application in X seconds"
```

#### 6️⃣ Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab** - for JavaScript errors
- **Network tab** - for failed API calls
  - Look for calls to localhost:2222
  - Check if they're returning 401, 404, or connection refused

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:2222
- **Login Page:** http://localhost:3000/login
- **Admin Dashboard:** http://localhost:3000/dashboard/admin
- **Doctor Dashboard:** http://localhost:3000/dashboard/doctor
- **Patient Dashboard:** http://localhost:3000/dashboard/patient

---

## 🎨 Technology Stack

- **React 18** - UI framework
- **React Router 6** - Navigation and routing
- **Tailwind CSS** - Styling
- **Axios** - API calls
- **React Icons** - Icon library

---

## 📱 Responsive Design

The application works on:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (below 768px)

---

## 🚀 Next Steps After Testing

1. ✅ Test all role-based dashboards
2. ✅ Verify automatic routing works
3. ✅ Test logout functionality
4. 🔄 Add OTP verification
5. 🔄 Add CAPTCHA to login
6. 🔄 Build appointment booking interface
7. 🔄 Build patient management interface
8. 🔄 Build billing module

---

**Enjoy testing CareSync! 🎉**
