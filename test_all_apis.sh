#!/bin/bash

# API Testing Script for CareSync
# Base URL and Token
BASE_URL="http://localhost:2222"
TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXdhZG1pbiIsInVzZXJJZCI6IjIwIiwiaWF0IjoxNzYxOTkyOTU2LCJleHAiOjE3NjIwNzkzNTZ9.cOWOXeG_Rhqybseif3I4nV0I2gGJu9wm_nJB_qoBPv0"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4

    echo -e "${BLUE}================================================${NC}"
    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo -e "${BLUE}Endpoint: ${method} ${endpoint}${NC}"

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X ${method} \
            "${BASE_URL}${endpoint}" \
            -H "Authorization: Bearer ${TOKEN}" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} \
            "${BASE_URL}${endpoint}" \
            -H "Authorization: Bearer ${TOKEN}" \
            -H "Content-Type: application/json" \
            -d "${data}")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ SUCCESS (HTTP ${http_code})${NC}"
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo -e "${RED}✗ CLIENT ERROR (HTTP ${http_code})${NC}"
    elif [ "$http_code" -ge 500 ]; then
        echo -e "${RED}✗ SERVER ERROR (HTTP ${http_code})${NC}"
    else
        echo -e "${YELLOW}? UNKNOWN (HTTP ${http_code})${NC}"
    fi

    echo "Response:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    echo ""
}

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     CareSync API Testing Suite                ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo ""

# ============================================
# AUTH ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  AUTHENTICATION ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/auth/me" "Get Current User Info"

test_api "POST" "/auth/logout" "Logout"

# ============================================
# DASHBOARD ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  DASHBOARD ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/api/dashboard/admin" "Admin Dashboard"

test_api "GET" "/api/dashboard/doctor" "Doctor Dashboard"

test_api "GET" "/api/dashboard/patient" "Patient Dashboard"

test_api "GET" "/api/dashboard/receptionist" "Receptionist Dashboard"

# ============================================
# ADMIN ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  ADMIN ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/api/admin/stats" "Get System Stats"

test_api "GET" "/api/admin/activity-logs" "Get All Activity Logs"

test_api "GET" "/api/admin/reports/revenue" "Get Revenue Report"

test_api "GET" "/api/admin/reports/appointments" "Get Appointment Report"

# ============================================
# PATIENT ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  PATIENT ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/Patients" "Get All Patients"

test_api "GET" "/Patients/list" "Get All Patients (Optimized)"

test_api "GET" "/Patients/paginated?page=0&size=10" "Get Paginated Patients"

test_api "GET" "/Patients/stats/blood-groups" "Get Blood Group Statistics"

# Test with specific patient if exists
test_api "GET" "/Patients/1" "Get Patient by ID (1)"

test_api "GET" "/Patients/1/details" "Get Patient Details by ID (1)"

# ============================================
# DOCTOR ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  DOCTOR ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/Doctors" "Get All Doctors"

test_api "GET" "/Doctors/1" "Get Doctor by ID (1)"

# ============================================
# APPOINTMENT ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  APPOINTMENT ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/api/appointments" "Get All Appointments"

test_api "GET" "/api/appointments/1" "Get Appointment by ID (1)"

test_api "GET" "/api/appointments/patient/1" "Get Appointments by Patient ID (1)"

test_api "GET" "/api/appointments/doctor/1" "Get Appointments by Doctor ID (1)"

test_api "GET" "/api/appointments/status/SCHEDULED" "Get Appointments by Status (SCHEDULED)"

# ============================================
# BILLING ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  BILLING ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/api/billing/bills/1" "Get Bill by ID (1)"

test_api "GET" "/api/billing/bills/patient/1" "Get Bills by Patient ID (1)"

# ============================================
# PRESCRIPTION ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  PRESCRIPTION ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/api/prescriptions/1" "Get Prescription by ID (1)"

test_api "GET" "/api/prescriptions/patient/1" "Get Prescriptions by Patient ID (1)"

test_api "GET" "/api/prescriptions/doctor/1" "Get Prescriptions by Doctor ID (1)"

# ============================================
# NOTIFICATION ENDPOINTS
# ============================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  NOTIFICATION ENDPOINTS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

test_api "GET" "/api/notifications/user/20" "Get User Notifications (User ID: 20)"

test_api "GET" "/api/notifications/user/20/unread" "Get Unread Notifications (User ID: 20)"

test_api "GET" "/api/notifications/user/20/unread/count" "Get Unread Notification Count (User ID: 20)"

# ============================================
# SUMMARY
# ============================================
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Testing Complete!                          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Note: Some endpoints may return 404 if no data exists.${NC}"
echo -e "${YELLOW}403 errors indicate the user role doesn't have permission.${NC}"
echo ""

