/**
 * Automated API Test Script for CareSync
 * Tests all role-based dashboards and API endpoints
 */

const API_BASE = 'http://localhost:8080/api';

// Test credentials for each role
const CREDENTIALS = {
  ADMIN: { username: 'admin', password: 'Admin@123' },
  DOCTOR: { username: 'dr.smith', password: 'Doctor@123' },
  NURSE: { username: 'nurse.jane', password: 'Nurse@123' },
  RECEPTIONIST: { username: 'receptionist', password: 'Recept@123' },
  PATIENT: { username: 'patient.robert', password: 'Patient@123' },
};

// Results tracking
const results = {
  passed: [],
  failed: [],
  skipped: [],
};

async function login(role) {
  const creds = CREDENTIALS[role];
  if (!creds) {
    console.log(`⚠️ No credentials for role: ${role}`);
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });

    if (!response.ok) {
      console.log(`❌ Login failed for ${role}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (data.success && data.data?.token) {
      console.log(`✅ Login successful for ${role}`);
      return { token: data.data.token, user: data.data };
    }
    console.log(`❌ Login failed for ${role}: No token`);
    return null;
  } catch (error) {
    console.log(`❌ Login error for ${role}: ${error.message}`);
    return null;
  }
}

async function testEndpoint(token, endpoint, expectedStatus = 200, description = '') {
  const testName = `${description || endpoint}`;
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const success = response.status === expectedStatus;
    
    if (success) {
      results.passed.push(testName);
      console.log(`  ✅ ${testName} (${response.status})`);
    } else {
      results.failed.push(`${testName} (expected ${expectedStatus}, got ${response.status})`);
      console.log(`  ❌ ${testName} (expected ${expectedStatus}, got ${response.status})`);
    }

    try {
      const data = await response.json();
      return { success, data, status: response.status };
    } catch {
      return { success, data: null, status: response.status };
    }
  } catch (error) {
    results.failed.push(`${testName}: ${error.message}`);
    console.log(`  ❌ ${testName}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAdminDashboard(auth) {
  console.log('\n📊 Testing ADMIN Dashboard APIs:');
  
  await testEndpoint(auth.token, '/dashboard/admin', 200, 'Admin Dashboard');
  await testEndpoint(auth.token, '/appointments?size=10', 200, 'All Appointments');
  await testEndpoint(auth.token, '/appointments/today', 200, "Today's Appointments");
  await testEndpoint(auth.token, '/patients?size=10', 200, 'Patients List');
  await testEndpoint(auth.token, '/doctors?size=10', 200, 'Doctors List');
  await testEndpoint(auth.token, '/bills?size=10', 200, 'Bills List');
  await testEndpoint(auth.token, '/bills/pending', 200, 'Pending Bills');
  await testEndpoint(auth.token, '/prescriptions?size=10', 200, 'All Prescriptions');
}

async function testDoctorDashboard(auth) {
  console.log('\n👨‍⚕️ Testing DOCTOR Dashboard APIs:');
  
  const doctorId = auth.user?.doctorId || 1;
  
  // Doctor should NOT access admin dashboard
  await testEndpoint(auth.token, '/dashboard/admin', 403, 'Admin Dashboard (should fail)');
  
  // Doctor CAN access today's appointments
  await testEndpoint(auth.token, '/appointments/today', 200, "Today's Appointments");
  
  // Doctor CAN access patients
  await testEndpoint(auth.token, '/patients?size=10', 200, 'Patients List');
  
  // Doctor CAN access their own prescriptions (if doctorId is known)
  if (doctorId) {
    await testEndpoint(auth.token, `/prescriptions/doctor/${doctorId}`, 200, 'My Prescriptions');
  }
  
  // Doctor should NOT access all bills
  await testEndpoint(auth.token, '/bills?size=10', 403, 'All Bills (should fail)');
}

async function testNurseDashboard(auth) {
  console.log('\n👩‍⚕️ Testing NURSE Dashboard APIs:');
  
  // Nurse should NOT access admin dashboard
  await testEndpoint(auth.token, '/dashboard/admin', 403, 'Admin Dashboard (should fail)');
  
  // Nurse CAN access today's appointments
  await testEndpoint(auth.token, '/appointments/today', 200, "Today's Appointments");
  
  // Nurse CAN access patients
  await testEndpoint(auth.token, '/patients?size=10', 200, 'Patients List');
  
  // Nurse should NOT access all bills
  await testEndpoint(auth.token, '/bills?size=10', 403, 'All Bills (should fail)');
}

async function testPatientDashboard(auth) {
  console.log('\n🧑 Testing PATIENT Dashboard APIs:');
  
  const patientId = auth.user?.patientId || 1;
  
  // Patient should NOT access admin dashboard
  await testEndpoint(auth.token, '/dashboard/admin', 403, 'Admin Dashboard (should fail)');
  
  // Patient should NOT access all appointments
  await testEndpoint(auth.token, '/appointments?size=10', 403, 'All Appointments (should fail)');
  
  // Patient CAN access their own appointments
  if (patientId) {
    await testEndpoint(auth.token, `/appointments/patient/${patientId}`, 200, 'My Appointments');
    await testEndpoint(auth.token, `/prescriptions/patient/${patientId}`, 200, 'My Prescriptions');
    await testEndpoint(auth.token, `/bills/patient/${patientId}`, 200, 'My Bills');
  }
  
  // Patient CAN access doctors list
  await testEndpoint(auth.token, '/doctors?size=10', 200, 'Doctors List');
  
  // Patient should NOT access all patients
  await testEndpoint(auth.token, '/patients?size=10', 403, 'All Patients (should fail)');
}

async function testReceptionistDashboard(auth) {
  console.log('\n💁 Testing RECEPTIONIST Dashboard APIs:');
  
  // Receptionist should NOT access admin dashboard
  await testEndpoint(auth.token, '/dashboard/admin', 403, 'Admin Dashboard (should fail)');
  
  // Receptionist CAN access appointments
  await testEndpoint(auth.token, '/appointments?size=10', 200, 'All Appointments');
  
  // Receptionist CAN access patients
  await testEndpoint(auth.token, '/patients?size=10', 200, 'Patients List');
  
  // Receptionist CAN access doctors
  await testEndpoint(auth.token, '/doctors?size=10', 200, 'Doctors List');
  
  // Receptionist CAN access bills
  await testEndpoint(auth.token, '/bills?size=10', 200, 'Bills');
  
  // Receptionist should NOT access all prescriptions
  await testEndpoint(auth.token, '/prescriptions?size=10', 403, 'All Prescriptions (should fail)');
}

async function runAllTests() {
  console.log('🏥 CareSync API Test Suite\n');
  console.log('=' .repeat(50));

  // Test ADMIN
  console.log('\n🔐 Testing ADMIN role...');
  const adminAuth = await login('ADMIN');
  if (adminAuth) {
    await testAdminDashboard(adminAuth);
  } else {
    results.skipped.push('ADMIN tests - login failed');
  }

  // Test DOCTOR
  console.log('\n🔐 Testing DOCTOR role...');
  const doctorAuth = await login('DOCTOR');
  if (doctorAuth) {
    await testDoctorDashboard(doctorAuth);
  } else {
    results.skipped.push('DOCTOR tests - login failed');
  }

  // Test NURSE
  console.log('\n🔐 Testing NURSE role...');
  const nurseAuth = await login('NURSE');
  if (nurseAuth) {
    await testNurseDashboard(nurseAuth);
  } else {
    results.skipped.push('NURSE tests - login failed');
  }

  // Test PATIENT
  console.log('\n🔐 Testing PATIENT role...');
  const patientAuth = await login('PATIENT');
  if (patientAuth) {
    await testPatientDashboard(patientAuth);
  } else {
    results.skipped.push('PATIENT tests - login failed');
  }

  // Test RECEPTIONIST
  console.log('\n🔐 Testing RECEPTIONIST role...');
  const receptionistAuth = await login('RECEPTIONIST');
  if (receptionistAuth) {
    await testReceptionistDashboard(receptionistAuth);
  } else {
    results.skipped.push('RECEPTIONIST tests - login failed');
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 TEST SUMMARY\n');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⏭️ Skipped: ${results.skipped.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(f => console.log(`   - ${f}`));
  }

  if (results.skipped.length > 0) {
    console.log('\n⏭️ Skipped:');
    results.skipped.forEach(s => console.log(`   - ${s}`));
  }

  console.log('\n' + '='.repeat(50));
}

// Run tests
runAllTests().catch(console.error);
