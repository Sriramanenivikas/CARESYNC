-- ============================================
-- CareSync Hospital Management System
-- Indian Sample Data v2.0
-- ============================================
-- All names, addresses, and phone numbers are Indian
-- Currency: INR (₹)
-- Run after schema.sql
-- psql -U postgres -d CARESYNC -f database/indian_seed_data.sql
-- ============================================

-- Clear existing data (in correct order)
TRUNCATE TABLE bill_items CASCADE;
TRUNCATE TABLE bills CASCADE;
TRUNCATE TABLE prescription_items CASCADE;
TRUNCATE TABLE prescriptions CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE doctor_schedules CASCADE;
TRUNCATE TABLE doctors CASCADE;
TRUNCATE TABLE patients CASCADE;
TRUNCATE TABLE departments CASCADE;
TRUNCATE TABLE users CASCADE;

-- ============================================
-- USERS - Role-based passwords (BCrypt hashed)
-- ============================================
-- | Role         | Username         | Password       |
-- |--------------|------------------|----------------|
-- | ADMIN        | admin            | Admin@123      |
-- | TEST (Demo)  | test             | Test@123$      |
-- | DOCTOR       | dr.smith         | Doctor@123     |
-- | PATIENT      | patient.robert   | Patient@123    |
-- | NURSE        | nurse.lisa       | Nurse@123      |
-- | RECEPTIONIST | reception.mary   | Recept@123     |
-- ============================================

-- Admin Users (Password: Admin@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('admin', 'admin@caresync.com', '$2b$10$BrXiJWW97UUCgcGVhP2f.OKSZ1n00DHdb0LznBozX4gydbCkANtjy', 'ADMIN', true),
('superadmin', 'superadmin@caresync.com', '$2b$10$BrXiJWW97UUCgcGVhP2f.OKSZ1n00DHdb0LznBozX4gydbCkANtjy', 'ADMIN', true);

-- Test/Demo User - READ-ONLY access for recruiters (Password: Test@123$)
INSERT INTO users (username, email, password, role, is_active) VALUES
('test', 'test@caresync.com', '$2b$10$kZ8Q3rZzWilweIy2HhDfIuGJx2gWTywSkc136yPQbNZyNsr72y/eu', 'TEST', true);

-- Doctor Users (Password: Doctor@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('dr.smith', 'rajesh.sharma@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.patel', 'priya.patel@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.kumar', 'anil.kumar@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.gupta', 'sunita.gupta@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.singh', 'vikram.singh@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.reddy', 'kavitha.reddy@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.iyer', 'suresh.iyer@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.nair', 'lakshmi.nair@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true);

-- Patient Users (Password: Patient@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('patient.robert', 'rahul.mehta@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.anita', 'anita.desai@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.sunil', 'sunil.verma@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.meera', 'meera.joshi@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.arjun', 'arjun.nair@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.kavita', 'kavita.rao@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.ravi', 'ravi.krishnan@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.priya', 'priya.malhotra@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.vijay', 'vijay.menon@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.sunita', 'sunita.choudhary@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.manoj', 'manoj.pillai@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.deepa', 'deepa.krishnamurthy@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.karthik', 'karthik.subramanian@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.neha', 'neha.agarwal@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.ashok', 'ashok.bhat@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true);

-- Nurse Users (Password: Nurse@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('nurse.lisa', 'lakshmi.sundaram@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.priya', 'priya.nanda@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.raju', 'raju.kumar@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true);

-- Receptionist Users (Password: Reception@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('reception.mary', 'mary.fernandes@caresync.com', '$2b$10$TVdFMATTlqeVs2s6kZMLbuUVNFS4wYjfzwqq5L8BFoq8jSrb/QuIS', 'RECEPTIONIST', true),
('reception.john', 'john.dcosta@caresync.com', '$2b$10$TVdFMATTlqeVs2s6kZMLbuUVNFS4wYjfzwqq5L8BFoq8jSrb/QuIS', 'RECEPTIONIST', true);

-- ============================================
-- DEPARTMENTS
-- ============================================
INSERT INTO departments (name, description, floor_number, phone, is_active) VALUES
('Cardiology', 'Heart and cardiovascular system specialists', 2, '+91-80-4001-0201', true),
('Neurology', 'Brain and nervous system specialists', 3, '+91-80-4001-0202', true),
('Orthopedics', 'Bone, joint, and muscle specialists', 2, '+91-80-4001-0203', true),
('Pediatrics', 'Child healthcare specialists', 1, '+91-80-4001-0204', true),
('General Medicine', 'Primary care and internal medicine', 1, '+91-80-4001-0205', true),
('Dermatology', 'Skin, hair, and nail specialists', 3, '+91-80-4001-0206', true),
('Gynecology', 'Women health specialists', 4, '+91-80-4001-0207', true),
('Ophthalmology', 'Eye care specialists', 2, '+91-80-4001-0208', true);

-- ============================================
-- DOCTORS (linked to users and departments)
-- ============================================
INSERT INTO doctors (user_id, department_id, first_name, last_name, email, phone, specialization, qualification, license_number, experience_years, consultation_fee, bio, is_available) VALUES
((SELECT id FROM users WHERE email = 'rajesh.sharma@caresync.com'), 1, 'Rajesh', 'Sharma', 'rajesh.sharma@caresync.com', '+91-98765-43210', 'Cardiology', 'MD, DM Cardiology (AIIMS Delhi)', 'KMC-2024-001', 15, 1500.00, 'Senior cardiologist specializing in interventional procedures and heart failure management. Former consultant at Narayana Health.', true),
((SELECT id FROM users WHERE email = 'priya.patel@caresync.com'), 2, 'Priya', 'Patel', 'priya.patel@caresync.com', '+91-98765-43211', 'Neurology', 'MD, DM Neurology (NIMHANS)', 'KMC-2024-002', 12, 1200.00, 'Expert in treating neurological disorders including epilepsy and stroke. Published researcher in movement disorders.', true),
((SELECT id FROM users WHERE email = 'anil.kumar@caresync.com'), 3, 'Anil', 'Kumar', 'anil.kumar@caresync.com', '+91-98765-43212', 'Orthopedics', 'MS Orthopedics (CMC Vellore)', 'KMC-2024-003', 18, 1000.00, 'Specialist in joint replacement surgery and sports medicine. Team doctor for Karnataka Cricket Association.', true),
((SELECT id FROM users WHERE email = 'sunita.gupta@caresync.com'), 4, 'Sunita', 'Gupta', 'sunita.gupta@caresync.com', '+91-98765-43213', 'Pediatrics', 'MD Pediatrics (KEM Mumbai)', 'KMC-2024-004', 10, 800.00, 'Dedicated pediatrician with expertise in childhood development and vaccination. Child-friendly approach.', true),
((SELECT id FROM users WHERE email = 'vikram.singh@caresync.com'), 5, 'Vikram', 'Singh', 'vikram.singh@caresync.com', '+91-98765-43214', 'General Medicine', 'MD Internal Medicine (Maulana Azad)', 'KMC-2024-005', 8, 600.00, 'Primary care physician focused on preventive medicine and chronic disease management.', true),
((SELECT id FROM users WHERE email = 'kavitha.reddy@caresync.com'), 6, 'Kavitha', 'Reddy', 'kavitha.reddy@caresync.com', '+91-98765-43215', 'Dermatology', 'MD Dermatology (JIPMER)', 'KMC-2024-006', 9, 1000.00, 'Dermatologist specializing in cosmetic procedures and skin cancer treatment. Expert in laser treatments.', true),
((SELECT id FROM users WHERE email = 'suresh.iyer@caresync.com'), 7, 'Suresh', 'Iyer', 'suresh.iyer@caresync.com', '+91-98765-43216', 'Gynecology', 'MD, MS Obstetrics & Gynecology (AIIMS)', 'KMC-2024-007', 14, 1200.00, 'Experienced gynecologist and obstetrician with focus on high-risk pregnancies and fertility treatments.', true),
((SELECT id FROM users WHERE email = 'lakshmi.nair@caresync.com'), 8, 'Lakshmi', 'Nair', 'lakshmi.nair@caresync.com', '+91-98765-43217', 'Ophthalmology', 'MD Ophthalmology (Sankara Nethralaya)', 'KMC-2024-008', 11, 900.00, 'Eye surgeon specializing in cataract and LASIK procedures. Pioneer in minimally invasive techniques.', true);

-- ============================================
-- DOCTOR SCHEDULES
-- ============================================
-- Dr. Rajesh Sharma (Cardiology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(1, 'MONDAY', '09:00', '17:00', 30, true),
(1, 'TUESDAY', '09:00', '17:00', 30, true),
(1, 'WEDNESDAY', '09:00', '13:00', 30, true),
(1, 'THURSDAY', '09:00', '17:00', 30, true),
(1, 'FRIDAY', '09:00', '15:00', 30, true);

-- Dr. Priya Patel (Neurology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(2, 'MONDAY', '10:00', '18:00', 30, true),
(2, 'TUESDAY', '10:00', '18:00', 30, true),
(2, 'WEDNESDAY', '10:00', '18:00', 30, true),
(2, 'THURSDAY', '10:00', '14:00', 30, true),
(2, 'FRIDAY', '10:00', '18:00', 30, true);

-- Dr. Anil Kumar (Orthopedics)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(3, 'MONDAY', '08:00', '16:00', 30, true),
(3, 'TUESDAY', '08:00', '16:00', 30, true),
(3, 'WEDNESDAY', '08:00', '16:00', 30, true),
(3, 'THURSDAY', '08:00', '16:00', 30, true),
(3, 'SATURDAY', '09:00', '13:00', 30, true);

-- Dr. Sunita Gupta (Pediatrics)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(4, 'MONDAY', '09:00', '17:00', 20, true),
(4, 'TUESDAY', '09:00', '17:00', 20, true),
(4, 'WEDNESDAY', '09:00', '17:00', 20, true),
(4, 'THURSDAY', '09:00', '17:00', 20, true),
(4, 'FRIDAY', '09:00', '17:00', 20, true),
(4, 'SATURDAY', '10:00', '14:00', 20, true);

-- Dr. Vikram Singh (General Medicine)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(5, 'MONDAY', '08:00', '18:00', 20, true),
(5, 'TUESDAY', '08:00', '18:00', 20, true),
(5, 'WEDNESDAY', '08:00', '18:00', 20, true),
(5, 'THURSDAY', '08:00', '18:00', 20, true),
(5, 'FRIDAY', '08:00', '18:00', 20, true);

-- Dr. Kavitha Reddy (Dermatology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(6, 'MONDAY', '10:00', '16:00', 30, true),
(6, 'WEDNESDAY', '10:00', '16:00', 30, true),
(6, 'FRIDAY', '10:00', '16:00', 30, true);

-- Dr. Suresh Iyer (Gynecology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(7, 'MONDAY', '09:00', '17:00', 30, true),
(7, 'TUESDAY', '09:00', '17:00', 30, true),
(7, 'THURSDAY', '09:00', '17:00', 30, true),
(7, 'FRIDAY', '09:00', '17:00', 30, true);

-- Dr. Lakshmi Nair (Ophthalmology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(8, 'TUESDAY', '09:00', '17:00', 30, true),
(8, 'WEDNESDAY', '09:00', '17:00', 30, true),
(8, 'THURSDAY', '09:00', '17:00', 30, true),
(8, 'SATURDAY', '09:00', '13:00', 30, true);

-- ============================================
-- PATIENTS (linked to users)
-- ============================================
INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, city, state, pincode, emergency_contact_name, emergency_contact_phone, medical_history, allergies) VALUES
((SELECT id FROM users WHERE email = 'rahul.mehta@email.com'), 'Rahul', 'Mehta', '1985-03-15', 'MALE', 'O+', '+91-98450-12345', 'rahul.mehta@email.com', '42, MG Road, Indiranagar', 'Bangalore', 'Karnataka', '560038', 'Sunita Mehta', '+91-98450-12346', 'Hypertension diagnosed in 2020, Type 2 Diabetes', 'Penicillin'),
((SELECT id FROM users WHERE email = 'anita.desai@email.com'), 'Anita', 'Desai', '1990-07-22', 'FEMALE', 'A+', '+91-98450-12347', 'anita.desai@email.com', '15, Koramangala 4th Block', 'Bangalore', 'Karnataka', '560034', 'Rajesh Desai', '+91-98450-12348', 'Asthma since childhood', 'Sulfa drugs'),
((SELECT id FROM users WHERE email = 'sunil.verma@email.com'), 'Sunil', 'Verma', '1978-11-08', 'MALE', 'B+', '+91-98450-12349', 'sunil.verma@email.com', '78, HSR Layout Sector 2', 'Bangalore', 'Karnataka', '560102', 'Geeta Verma', '+91-98450-12350', 'Previous knee surgery in 2019', 'None'),
((SELECT id FROM users WHERE email = 'meera.joshi@email.com'), 'Meera', 'Joshi', '1995-02-28', 'FEMALE', 'AB+', '+91-98450-12351', 'meera.joshi@email.com', '23, Whitefield Main Road', 'Bangalore', 'Karnataka', '560066', 'Prakash Joshi', '+91-98450-12352', 'No significant medical history', 'Latex'),
((SELECT id FROM users WHERE email = 'arjun.nair@email.com'), 'Arjun', 'Nair', '1982-09-14', 'MALE', 'A-', '+91-98450-12353', 'arjun.nair@email.com', '56, Jayanagar 4th T Block', 'Bangalore', 'Karnataka', '560041', 'Latha Nair', '+91-98450-12354', 'High cholesterol, Family history of heart disease', 'Aspirin'),
((SELECT id FROM users WHERE email = 'kavita.rao@email.com'), 'Kavita', 'Rao', '1988-05-19', 'FEMALE', 'O-', '+91-98450-12355', 'kavita.rao@email.com', '89, Marathahalli Bridge Road', 'Bangalore', 'Karnataka', '560037', 'Venkat Rao', '+91-98450-12356', 'Migraine headaches', 'Codeine'),
((SELECT id FROM users WHERE email = 'ravi.krishnan@email.com'), 'Ravi', 'Krishnan', '1975-12-03', 'MALE', 'B-', '+91-98450-12357', 'ravi.krishnan@email.com', '34, Basavanagudi 4th Main', 'Bangalore', 'Karnataka', '560004', 'Padma Krishnan', '+91-98450-12358', 'Back pain, Herniated disc L4-L5', 'None'),
((SELECT id FROM users WHERE email = 'priya.malhotra@email.com'), 'Priya', 'Malhotra', '1992-08-25', 'FEMALE', 'AB-', '+91-98450-12359', 'priya.malhotra@email.com', '67, Electronic City Phase 1', 'Bangalore', 'Karnataka', '560100', 'Amit Malhotra', '+91-98450-12360', 'Anxiety disorder', 'Shellfish'),
((SELECT id FROM users WHERE email = 'vijay.menon@email.com'), 'Vijay', 'Menon', '1980-04-10', 'MALE', 'O+', '+91-98450-12361', 'vijay.menon@email.com', '12, Sadashivanagar', 'Bangalore', 'Karnataka', '560080', 'Usha Menon', '+91-98450-12362', 'Kidney stones (2018), Gout', 'Ibuprofen'),
((SELECT id FROM users WHERE email = 'sunita.choudhary@email.com'), 'Sunita', 'Choudhary', '1993-01-17', 'FEMALE', 'A+', '+91-98450-12363', 'sunita.choudhary@email.com', '45, BTM Layout 2nd Stage', 'Bangalore', 'Karnataka', '560076', 'Ramesh Choudhary', '+91-98450-12364', 'PCOS diagnosed in 2021', 'None'),
((SELECT id FROM users WHERE email = 'manoj.pillai@email.com'), 'Manoj', 'Pillai', '1987-06-30', 'MALE', 'B+', '+91-98450-12365', 'manoj.pillai@email.com', '90, Yelahanka New Town', 'Bangalore', 'Karnataka', '560064', 'Radha Pillai', '+91-98450-12366', 'Sleep apnea', 'Morphine'),
((SELECT id FROM users WHERE email = 'deepa.krishnamurthy@email.com'), 'Deepa', 'Krishnamurthy', '1991-10-05', 'FEMALE', 'O-', '+91-98450-12367', 'deepa.krishnamurthy@email.com', '28, Malleswaram 8th Cross', 'Bangalore', 'Karnataka', '560003', 'Murthy K', '+91-98450-12368', 'Hypothyroidism', 'Contrast dye'),
((SELECT id FROM users WHERE email = 'karthik.subramanian@email.com'), 'Karthik', 'Subramanian', '1983-07-12', 'MALE', 'A-', '+91-98450-12369', 'karthik.subramanian@email.com', '51, JP Nagar 6th Phase', 'Bangalore', 'Karnataka', '560078', 'Shanti Subramanian', '+91-98450-12370', 'Gastric reflux (GERD)', 'None'),
((SELECT id FROM users WHERE email = 'neha.agarwal@email.com'), 'Neha', 'Agarwal', '1996-03-28', 'FEMALE', 'B-', '+91-98450-12371', 'neha.agarwal@email.com', '73, Rajajinagar 3rd Block', 'Bangalore', 'Karnataka', '560010', 'Suresh Agarwal', '+91-98450-12372', 'No significant medical history', 'Peanuts'),
((SELECT id FROM users WHERE email = 'ashok.bhat@email.com'), 'Ashok', 'Bhat', '1979-11-22', 'MALE', 'AB+', '+91-98450-12373', 'ashok.bhat@email.com', '36, Vijayanagar 2nd Stage', 'Bangalore', 'Karnataka', '560040', 'Manjula Bhat', '+91-98450-12374', 'Atrial fibrillation, On blood thinners', 'Warfarin alternatives');

-- ============================================
-- APPOINTMENTS (comprehensive data - past, today, future)
-- ============================================

-- Past appointments - 3 months history (COMPLETED)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
-- 90 days ago
(1, 1, CURRENT_DATE - INTERVAL '90 days', '09:00', '09:30', 'COMPLETED', 'Initial cardiac screening', 'Fatigue on exertion', 'Mild hypertension detected', 'Start BP monitoring, lifestyle changes'),
(2, 4, CURRENT_DATE - INTERVAL '88 days', '10:00', '10:20', 'COMPLETED', 'Routine pediatric checkup', 'None', 'Healthy child development', 'All milestones on track'),
(3, 3, CURRENT_DATE - INTERVAL '85 days', '11:00', '11:30', 'COMPLETED', 'ACL surgery consultation', 'Knee instability', 'ACL tear confirmed', 'Surgery scheduled'),
-- 80 days ago
(4, 5, CURRENT_DATE - INTERVAL '80 days', '09:00', '09:20', 'COMPLETED', 'General health checkup', 'Tiredness', 'Low vitamin levels', 'Blood tests ordered'),
(5, 1, CURRENT_DATE - INTERVAL '78 days', '10:00', '10:30', 'COMPLETED', 'Cardiac evaluation', 'Chest tightness', 'Coronary artery disease risk', 'Echo ordered'),
(6, 2, CURRENT_DATE - INTERVAL '75 days', '14:00', '14:30', 'COMPLETED', 'Headache evaluation', 'Recurring headaches', 'Tension headaches', 'Stress management advised'),
-- 70 days ago
(7, 3, CURRENT_DATE - INTERVAL '70 days', '09:00', '09:30', 'COMPLETED', 'Back pain consultation', 'Chronic lower back pain', 'Lumbar strain', 'Physical therapy started'),
(8, 5, CURRENT_DATE - INTERVAL '68 days', '11:00', '11:20', 'COMPLETED', 'Stress assessment', 'Work-related anxiety', 'Adjustment disorder', 'Counseling recommended'),
(9, 1, CURRENT_DATE - INTERVAL '65 days', '15:00', '15:30', 'COMPLETED', 'Hypertension follow-up', 'Occasional dizziness', 'BP controlled', 'Continue medications'),
(10, 7, CURRENT_DATE - INTERVAL '62 days', '10:00', '10:30', 'COMPLETED', 'PCOS initial consultation', 'Irregular cycles', 'PCOS diagnosed', 'Hormonal therapy started'),
-- 60 days ago
(11, 5, CURRENT_DATE - INTERVAL '60 days', '14:00', '14:20', 'COMPLETED', 'Sleep issues', 'Daytime sleepiness', 'Possible sleep apnea', 'Sleep study ordered'),
(12, 6, CURRENT_DATE - INTERVAL '58 days', '11:00', '11:30', 'COMPLETED', 'Skin consultation', 'Dry patches', 'Eczema', 'Topical steroids prescribed'),
(13, 5, CURRENT_DATE - INTERVAL '55 days', '09:00', '09:20', 'COMPLETED', 'Digestive issues', 'Acidity', 'GERD diagnosed', 'Antacids prescribed'),
(14, 4, CURRENT_DATE - INTERVAL '52 days', '10:00', '10:20', 'COMPLETED', 'Child immunization', 'None', 'Vaccines administered', 'Next dose in 3 months'),
(15, 1, CURRENT_DATE - INTERVAL '50 days', '16:00', '16:30', 'COMPLETED', 'Cardiac checkup', 'Irregular heartbeat', 'AFib suspected', 'Holter monitor ordered'),
-- 45 days ago
(1, 1, CURRENT_DATE - INTERVAL '45 days', '09:00', '09:30', 'COMPLETED', 'BP medication review', 'Stable readings', 'Good BP control', 'Continue current regimen'),
(2, 4, CURRENT_DATE - INTERVAL '43 days', '14:00', '14:20', 'COMPLETED', 'Child growth monitoring', 'None', 'Normal growth', 'Next checkup in 3 months'),
(3, 3, CURRENT_DATE - INTERVAL '40 days', '11:00', '11:30', 'COMPLETED', 'Post-surgery follow-up', 'Minimal pain', 'Healing well', 'Begin physiotherapy'),
(5, 1, CURRENT_DATE - INTERVAL '38 days', '10:00', '10:30', 'COMPLETED', 'Echo results review', 'Mild breathlessness', 'Mild LV dysfunction', 'Medications adjusted'),
(6, 2, CURRENT_DATE - INTERVAL '35 days', '15:00', '15:30', 'COMPLETED', 'Migraine follow-up', 'Fewer episodes', 'Improving', 'Continue preventive meds'),
-- 30 days ago
(1, 1, CURRENT_DATE - INTERVAL '30 days', '09:00', '09:30', 'COMPLETED', 'Routine cardiac checkup', 'Occasional chest discomfort', 'Mild hypertension, ECG normal', 'Continue current medications'),
(2, 4, CURRENT_DATE - INTERVAL '28 days', '10:00', '10:20', 'COMPLETED', 'Child vaccination', 'None', 'Healthy child', 'Next vaccination in 6 months'),
(3, 3, CURRENT_DATE - INTERVAL '25 days', '11:00', '11:30', 'COMPLETED', 'Knee pain follow-up', 'Pain while climbing stairs', 'Post-surgical recovery on track', 'Physical therapy recommended'),
(4, 5, CURRENT_DATE - INTERVAL '22 days', '14:00', '14:20', 'COMPLETED', 'General checkup', 'Fatigue', 'Vitamin D deficiency', 'Supplements prescribed'),
(5, 1, CURRENT_DATE - INTERVAL '20 days', '10:00', '10:30', 'COMPLETED', 'Chest pain evaluation', 'Sharp chest pain on exertion', 'Angina, stress test ordered', 'Avoid strenuous activity'),
(6, 2, CURRENT_DATE - INTERVAL '18 days', '15:00', '15:30', 'COMPLETED', 'Migraine consultation', 'Severe headaches, light sensitivity', 'Chronic migraine', 'Preventive medication started'),
(7, 3, CURRENT_DATE - INTERVAL '15 days', '09:30', '10:00', 'COMPLETED', 'Back pain assessment', 'Lower back pain radiating to leg', 'Herniated disc confirmed', 'MRI ordered'),
(8, 5, CURRENT_DATE - INTERVAL '12 days', '11:00', '11:20', 'COMPLETED', 'Anxiety symptoms', 'Panic attacks, insomnia', 'Generalized anxiety disorder', 'Referred to psychiatrist'),
(9, 1, CURRENT_DATE - INTERVAL '10 days', '16:00', '16:30', 'COMPLETED', 'Gout flare-up', 'Severe pain in big toe', 'Acute gout attack', 'Colchicine prescribed'),
(10, 7, CURRENT_DATE - INTERVAL '8 days', '10:00', '10:30', 'COMPLETED', 'PCOS follow-up', 'Irregular periods', 'PCOS management review', 'Continue current treatment'),
(11, 8, CURRENT_DATE - INTERVAL '7 days', '09:00', '09:30', 'COMPLETED', 'Eye checkup', 'Blurry vision', 'Mild myopia', 'Glasses prescribed'),
(12, 6, CURRENT_DATE - INTERVAL '6 days', '11:00', '11:30', 'COMPLETED', 'Eczema follow-up', 'Reduced itching', 'Improving', 'Continue treatment'),
(13, 5, CURRENT_DATE - INTERVAL '5 days', '14:00', '14:20', 'COMPLETED', 'GERD review', 'Less acidity', 'Controlled', 'Maintain diet'),
(14, 4, CURRENT_DATE - INTERVAL '4 days', '10:00', '10:20', 'COMPLETED', 'Child cold', 'Runny nose', 'Viral infection', 'Symptomatic treatment'),
(15, 1, CURRENT_DATE - INTERVAL '3 days', '16:00', '16:30', 'COMPLETED', 'AFib results review', 'Palpitations', 'Confirmed AFib', 'Blood thinners started'),

-- Cancelled/No-show appointments
(11, 5, CURRENT_DATE - INTERVAL '5 days', '14:00', '14:20', 'CANCELLED', 'Sleep study review', NULL, NULL, 'Patient cancelled due to travel'),
(12, 6, CURRENT_DATE - INTERVAL '3 days', '11:00', '11:30', 'NO_SHOW', 'Skin rash evaluation', NULL, NULL, 'Patient did not show up');

-- Today's appointments (15 appointments)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(1, 1, CURRENT_DATE, '09:00', '09:30', 'SCHEDULED', 'Blood pressure check', 'Headaches, dizziness'),
(3, 3, CURRENT_DATE, '09:30', '10:00', 'SCHEDULED', 'Post-therapy evaluation', 'Reduced knee pain'),
(5, 1, CURRENT_DATE, '10:00', '10:30', 'SCHEDULED', 'Stress test results', 'Shortness of breath'),
(6, 2, CURRENT_DATE, '10:30', '11:00', 'SCHEDULED', 'Migraine follow-up', 'Medication side effects'),
(7, 3, CURRENT_DATE, '11:00', '11:30', 'SCHEDULED', 'Physiotherapy review', 'Back improving'),
(8, 5, CURRENT_DATE, '11:00', '11:20', 'SCHEDULED', 'Mental health check', 'Improved sleep'),
(10, 7, CURRENT_DATE, '11:00', '11:30', 'SCHEDULED', 'Hormone therapy review', 'Weight changes'),
(11, 8, CURRENT_DATE, '11:30', '12:00', 'SCHEDULED', 'Vision checkup', 'Eye strain'),
(2, 4, CURRENT_DATE, '14:00', '14:20', 'SCHEDULED', 'Child fever', 'High temperature, cough'),
(4, 6, CURRENT_DATE, '14:30', '15:00', 'SCHEDULED', 'Skin allergy', 'Rash on arms'),
(9, 5, CURRENT_DATE, '15:00', '15:20', 'SCHEDULED', 'Kidney function test', 'Routine follow-up'),
(12, 6, CURRENT_DATE, '15:30', '16:00', 'SCHEDULED', 'Skin checkup', 'Acne concerns'),
(13, 5, CURRENT_DATE, '15:30', '15:50', 'SCHEDULED', 'Digestion review', 'Bloating'),
(14, 4, CURRENT_DATE, '16:00', '16:20', 'SCHEDULED', 'Allergy check', 'Seasonal symptoms'),
(15, 1, CURRENT_DATE, '16:00', '16:30', 'SCHEDULED', 'AFib management', 'Palpitations');

-- Tomorrow's appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(7, 3, CURRENT_DATE + INTERVAL '1 day', '09:00', '09:30', 'SCHEDULED', 'MRI results discussion', 'Persistent back pain'),
(11, 5, CURRENT_DATE + INTERVAL '1 day', '10:00', '10:20', 'SCHEDULED', 'CPAP machine follow-up', 'Better sleep quality'),
(1, 1, CURRENT_DATE + INTERVAL '1 day', '11:00', '11:30', 'SCHEDULED', 'Cardiac monitoring', 'Routine check'),
(2, 4, CURRENT_DATE + INTERVAL '1 day', '14:00', '14:20', 'SCHEDULED', 'Child wellness visit', 'Preventive care'),
(10, 7, CURRENT_DATE + INTERVAL '1 day', '15:00', '15:30', 'SCHEDULED', 'PCOS review', 'Cycle tracking');

-- Future appointments (next 2 weeks)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(12, 8, CURRENT_DATE + INTERVAL '2 days', '09:30', '10:00', 'SCHEDULED', 'Eye examination', 'Blurry vision'),
(13, 5, CURRENT_DATE + INTERVAL '2 days', '11:00', '11:20', 'SCHEDULED', 'Acid reflux review', 'Heartburn'),
(14, 4, CURRENT_DATE + INTERVAL '3 days', '10:00', '10:20', 'SCHEDULED', 'Allergy consultation', 'Seasonal allergies'),
(3, 3, CURRENT_DATE + INTERVAL '3 days', '14:00', '14:30', 'SCHEDULED', 'Knee rehab check', 'Mobility assessment'),
(6, 2, CURRENT_DATE + INTERVAL '4 days', '10:00', '10:30', 'SCHEDULED', 'Neurology follow-up', 'Migraine patterns'),
(1, 1, CURRENT_DATE + INTERVAL '5 days', '09:00', '09:30', 'SCHEDULED', 'ECG follow-up', 'Routine cardiac monitoring'),
(2, 4, CURRENT_DATE + INTERVAL '5 days', '14:00', '14:20', 'SCHEDULED', 'Growth assessment', 'Child development check'),
(5, 1, CURRENT_DATE + INTERVAL '7 days', '10:00', '10:30', 'SCHEDULED', 'Angiogram discussion', 'Pre-procedure consultation'),
(6, 2, CURRENT_DATE + INTERVAL '7 days', '15:00', '15:30', 'SCHEDULED', 'Neurology review', 'Medication adjustment'),
(8, 5, CURRENT_DATE + INTERVAL '7 days', '11:00', '11:20', 'SCHEDULED', 'Therapy progress', 'Mental wellness'),
(9, 1, CURRENT_DATE + INTERVAL '8 days', '16:00', '16:30', 'SCHEDULED', 'Gout management', 'Preventive care'),
(3, 3, CURRENT_DATE + INTERVAL '10 days', '09:00', '09:30', 'SCHEDULED', 'Physical therapy review', 'Knee mobility check'),
(8, 5, CURRENT_DATE + INTERVAL '10 days', '11:00', '11:20', 'SCHEDULED', 'Mental wellness check', 'Therapy progress'),
(10, 7, CURRENT_DATE + INTERVAL '12 days', '10:00', '10:30', 'SCHEDULED', 'Hormonal balance check', 'PCOS management'),
(15, 1, CURRENT_DATE + INTERVAL '14 days', '16:00', '16:30', 'SCHEDULED', 'Cardiology follow-up', 'Blood thinner review'),
(4, 5, CURRENT_DATE + INTERVAL '14 days', '09:00', '09:20', 'SCHEDULED', 'General wellness', 'Annual checkup');

-- ============================================
-- PRESCRIPTIONS (comprehensive - for all completed appointments)
-- ============================================
-- Prescriptions for early historical appointments (90-60 days ago)
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) VALUES
(1, 1, 1, 'Stage 1 Hypertension - Initial Diagnosis', 'Blood pressure 145/92 mmHg. Lifestyle modifications strongly recommended. Start low-dose medication.', CURRENT_DATE + INTERVAL '60 days'),
(2, 2, 4, 'Well Child Visit - Age Appropriate', 'All developmental milestones achieved. Growth on 75th percentile. Continue current diet.', CURRENT_DATE + INTERVAL '90 days'),
(3, 3, 3, 'ACL Tear - Pre-surgical Assessment', 'Complete ACL tear confirmed by MRI. Scheduled for arthroscopic reconstruction.', CURRENT_DATE + INTERVAL '14 days'),
(4, 4, 5, 'Fatigue - Nutritional Deficiency', 'Low hemoglobin (10.2 g/dL), Vitamin B12 deficiency suspected. Dietary assessment needed.', CURRENT_DATE + INTERVAL '45 days'),
(5, 5, 1, 'Coronary Artery Disease Risk Assessment', 'Family history positive. Lipid panel abnormal. Stress test scheduled.', CURRENT_DATE + INTERVAL '30 days'),
(6, 6, 2, 'Tension-type Headache', 'Episodic tension headaches 3-4 times per week. Stress-related triggers identified.', CURRENT_DATE + INTERVAL '30 days'),
(7, 7, 3, 'Chronic Lumbar Strain', 'Poor posture, desk job contributing factors. Core strengthening exercises prescribed.', CURRENT_DATE + INTERVAL '21 days'),
(8, 8, 5, 'Adjustment Disorder with Anxiety', 'Work-related stress. Short-term therapy and relaxation techniques recommended.', CURRENT_DATE + INTERVAL '14 days'),
(9, 9, 1, 'Essential Hypertension with Hyperuricemia', 'Elevated uric acid 8.2 mg/dL. At risk for gout. Diet modifications essential.', CURRENT_DATE + INTERVAL '60 days'),
(10, 10, 7, 'PCOS - New Diagnosis', 'Ultrasound confirms polycystic ovaries. Insulin resistance present. Weight management crucial.', CURRENT_DATE + INTERVAL '45 days'),
(11, 11, 5, 'Obstructive Sleep Apnea Suspected', 'Excessive daytime somnolence, snoring. BMI 32. Sleep study recommended.', CURRENT_DATE + INTERVAL '30 days'),
(12, 12, 6, 'Atopic Dermatitis', 'Chronic eczema with acute flare. Moisturization and trigger avoidance essential.', CURRENT_DATE + INTERVAL '21 days'),
(13, 13, 5, 'Gastroesophageal Reflux Disease', 'Chronic heartburn, regurgitation. Lifestyle modifications and PPI therapy started.', CURRENT_DATE + INTERVAL '45 days'),
(14, 14, 4, 'Routine Immunization - DPT Booster', 'Vaccination given as per National Immunization Schedule. No adverse reactions.', CURRENT_DATE + INTERVAL '180 days'),
(15, 15, 1, 'Atrial Fibrillation Screening', 'Irregular pulse detected. ECG shows occasional PVCs. Holter monitoring ordered.', CURRENT_DATE + INTERVAL '14 days');

-- Prescriptions for 45-30 days ago appointments
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) VALUES
(16, 1, 1, 'Hypertension - Controlled on Medication', 'BP now 128/84 mmHg. Good medication compliance. Continue current regimen.', CURRENT_DATE + INTERVAL '90 days'),
(17, 2, 4, 'Normal Growth and Development', 'Height and weight appropriate for age. Nutrition counseling provided.', CURRENT_DATE + INTERVAL '120 days'),
(18, 3, 3, 'Post ACL Reconstruction - Week 2', 'Healing well. Range of motion improving. Started supervised physiotherapy.', CURRENT_DATE + INTERVAL '14 days'),
(19, 5, 1, 'Stable Angina - Echo Results', 'LVEF 55%, mild LV diastolic dysfunction. Medical management optimized.', CURRENT_DATE + INTERVAL '30 days'),
(20, 6, 2, 'Chronic Migraine - Response to Prevention', 'Headache frequency reduced by 40%. Continue preventive therapy.', CURRENT_DATE + INTERVAL '30 days');

-- Prescriptions for recent appointments (30-3 days ago)
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) VALUES
(21, 1, 1, 'Essential Hypertension - Well Controlled', 'Blood pressure stable. Continue medications. Annual cardiac review recommended.', CURRENT_DATE + INTERVAL '90 days'),
(22, 2, 4, 'Healthy Child - Vaccinations Complete', 'All scheduled vaccinations administered. Growth tracking normal.', CURRENT_DATE + INTERVAL '180 days'),
(23, 3, 3, 'Post-operative Knee - Rehabilitation Phase', 'Good ROM recovery. Pain minimal. Continue physiotherapy protocol.', CURRENT_DATE + INTERVAL '30 days'),
(24, 4, 5, 'Vitamin D Deficiency - Follow-up', 'Vitamin D levels improving (28 ng/mL). Continue supplementation.', CURRENT_DATE + INTERVAL '60 days'),
(25, 5, 1, 'Stable Angina Pectoris', 'Stress test positive. Anti-anginal medication started. Angiography recommended.', CURRENT_DATE + INTERVAL '14 days'),
(26, 6, 2, 'Chronic Migraine without Aura', 'More than 15 headache days per month. Preventive therapy initiated.', CURRENT_DATE + INTERVAL '30 days'),
(27, 7, 3, 'Lumbar Disc Herniation L4-L5', 'MRI confirms herniation. Conservative management first.', CURRENT_DATE + INTERVAL '45 days'),
(28, 8, 5, 'Generalized Anxiety Disorder', 'Moderate severity. Combination of medication and therapy recommended.', CURRENT_DATE + INTERVAL '14 days'),
(29, 9, 1, 'Acute Gouty Arthritis', 'Elevated uric acid levels. Acute treatment followed by prevention.', CURRENT_DATE + INTERVAL '30 days'),
(30, 10, 7, 'PCOS - Management Review', 'Well-controlled with current regimen. Continue monitoring.', CURRENT_DATE + INTERVAL '90 days'),
(31, 11, 8, 'Myopia - New Prescription', 'Refraction: OD -1.50, OS -1.25. New glasses prescribed.', CURRENT_DATE + INTERVAL '365 days'),
(32, 12, 6, 'Atopic Dermatitis - Improving', 'Flare resolving with treatment. Maintenance therapy advised.', CURRENT_DATE + INTERVAL '30 days'),
(33, 13, 5, 'GERD - Well Controlled', 'Symptoms improved with PPI. Continue lifestyle modifications.', CURRENT_DATE + INTERVAL '90 days'),
(34, 14, 4, 'Viral Upper Respiratory Infection', 'Common cold. Symptomatic treatment. Hydration important.', NULL),
(35, 15, 1, 'Atrial Fibrillation - Confirmed', 'Holter confirms PAF. Anticoagulation started. Rate control achieved.', CURRENT_DATE + INTERVAL '30 days');

-- ============================================
-- PRESCRIPTION ITEMS (medicines for each prescription)
-- ============================================
-- Prescription 1: Initial Hypertension
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(1, 'Amlodipine (Amlod)', '2.5mg', 'Once daily', '30 days', 30, 'Take in the morning'),
(1, 'Ecosprin', '75mg', 'Once daily', '30 days', 30, 'Take after breakfast');

-- Prescription 2: Child wellness
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(2, 'Cecon Drops (Vitamin C)', '0.5ml', 'Once daily', '30 days', 1, 'Give with food');

-- Prescription 3: Pre-surgery
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(3, 'Pantoprazole', '40mg', 'Once daily', '14 days', 14, 'Take before breakfast'),
(3, 'Vitamin C', '500mg', 'Once daily', '14 days', 14, 'For wound healing');

-- Prescription 4: Fatigue/Anemia
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(4, 'Fefol-Z', '1 capsule', 'Once daily', '60 days', 60, 'Take with orange juice for better absorption'),
(4, 'Methylcobalamin', '1500mcg', 'Once daily', '30 days', 30, 'Take after food');

-- Prescription 5: CAD Risk
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(5, 'Atorvastatin', '10mg', 'Once daily', '30 days', 30, 'Take at bedtime'),
(5, 'Ecosprin', '75mg', 'Once daily', '30 days', 30, 'Take after breakfast');

-- Prescription 6: Tension headache
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(6, 'Paracetamol', '650mg', 'As needed', '14 days', 20, 'Take for headache, max 4 per day'),
(6, 'Amitriptyline', '10mg', 'Once daily', '30 days', 30, 'Take at bedtime');

-- Prescription 7: Lumbar strain
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(7, 'Thiocolchicoside', '4mg', 'Twice daily', '7 days', 14, 'Take after food'),
(7, 'Diclofenac Gel', 'Apply locally', 'Three times daily', '14 days', 1, 'Apply on affected area');

-- Prescription 8: Adjustment disorder
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(8, 'Alprazolam', '0.25mg', 'As needed', '14 days', 14, 'Take for acute anxiety only');

-- Prescription 9: Hypertension with hyperuricemia
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(9, 'Losartan', '50mg', 'Once daily', '30 days', 30, 'Also helps with uric acid'),
(9, 'Allopurinol', '100mg', 'Once daily', '30 days', 30, 'Take after food');

-- Prescription 10: PCOS initial
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(10, 'Metformin', '500mg', 'Twice daily', '90 days', 180, 'Start with one, increase gradually'),
(10, 'Myo-inositol', '2g', 'Twice daily', '90 days', 180, 'For insulin sensitization'),
(10, 'Folic Acid', '5mg', 'Once daily', '90 days', 90, 'For general health');

-- Prescription 11: Sleep apnea
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(11, 'Modafinil', '100mg', 'Once daily', '14 days', 14, 'Take in morning for daytime sleepiness');

-- Prescription 12: Eczema
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(12, 'Mometasone Cream', 'Apply thin layer', 'Twice daily', '14 days', 1, 'Apply on affected areas only'),
(12, 'Cetaphil Moisturizer', 'Apply liberally', 'Three times daily', '30 days', 1, 'Apply after bath and frequently');

-- Prescription 13: GERD
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(13, 'Pantoprazole', '40mg', 'Once daily', '30 days', 30, 'Take 30 min before breakfast'),
(13, 'Domperidone', '10mg', 'Three times daily', '14 days', 42, 'Take before meals');

-- Prescription 14: Child vaccination
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(14, 'Paracetamol Drops', '1ml', 'Every 6 hours', '2 days', 1, 'If fever occurs after vaccination');

-- Prescription 15: AFib screening
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(15, 'Metoprolol', '25mg', 'Twice daily', '14 days', 28, 'For rate control');

-- Prescriptions 16-20 (Follow-ups)
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(16, 'Amlodipine', '5mg', 'Once daily', '90 days', 90, 'Increased dose for better control'),
(16, 'Telmisartan', '40mg', 'Once daily', '90 days', 90, 'Added for additional BP control'),
(17, 'Multivitamin Syrup', '5ml', 'Once daily', '60 days', 1, 'General nutrition support'),
(18, 'Dolo 650', '650mg', 'As needed', '14 days', 20, 'For post-operative pain'),
(18, 'Chymoral Forte', '1 tablet', 'Twice daily', '7 days', 14, 'For reducing swelling'),
(19, 'Isosorbide Mononitrate', '30mg', 'Once daily', '30 days', 30, 'For angina prevention'),
(19, 'Atorvastatin', '20mg', 'Once daily', '30 days', 30, 'Increased for lipid control'),
(20, 'Topiramate', '25mg', 'Twice daily', '30 days', 60, 'Migraine prevention');

-- Prescriptions 21-35 (Recent consultations)
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(21, 'Amlodipine', '5mg', 'Once daily', '90 days', 90, 'Continue current regimen'),
(21, 'Telmisartan', '40mg', 'Once daily', '90 days', 90, 'Maintain therapy'),
(21, 'Ecosprin', '75mg', 'Once daily', '90 days', 90, 'Cardioprotective'),
(22, 'Multivitamin Drops', '1ml', 'Once daily', '30 days', 1, 'Nutritional support'),
(23, 'Glucosamine', '1500mg', 'Once daily', '60 days', 60, 'Joint support'),
(23, 'Dolo 650', '650mg', 'As needed', '14 days', 20, 'Pain relief'),
(24, 'Calcirol D3', '60000IU', 'Once weekly', '8 weeks', 8, 'Continue supplementation'),
(24, 'Shelcal', '500mg', 'Twice daily', '60 days', 120, 'Calcium supplement'),
(25, 'Isosorbide Mononitrate', '30mg', 'Once daily', '30 days', 30, 'Anti-anginal'),
(25, 'Atorvastatin', '20mg', 'Once daily', '30 days', 30, 'Lipid control'),
(25, 'Metoprolol', '25mg', 'Twice daily', '30 days', 60, 'Rate control'),
(25, 'Sorbitrate SL', '5mg', 'As needed', '30 days', 30, 'For acute chest pain'),
(26, 'Topiramate', '25mg', 'Twice daily', '30 days', 60, 'Increase to 50mg after 2 weeks'),
(26, 'Sumatriptan', '50mg', 'As needed', '30 days', 9, 'For acute migraine'),
(26, 'Neurobion Forte', '1 tablet', 'Once daily', '90 days', 90, 'Nerve health'),
(27, 'Pregabalin', '75mg', 'Twice daily', '30 days', 60, 'For neuropathic pain'),
(27, 'Diclofenac', '50mg', 'Twice daily', '14 days', 28, 'Anti-inflammatory'),
(27, 'Thiocolchicoside', '4mg', 'Three times daily', '14 days', 42, 'Muscle relaxant'),
(28, 'Escitalopram', '10mg', 'Once daily', '30 days', 30, 'Take in morning'),
(28, 'Clonazepam', '0.25mg', 'As needed', '14 days', 14, 'For acute anxiety'),
(29, 'Colchicine', '0.5mg', 'Twice daily', '7 days', 14, 'Acute gout attack'),
(29, 'Febuxostat', '40mg', 'Once daily', '30 days', 30, 'Uric acid control'),
(29, 'Naproxen', '500mg', 'Twice daily', '7 days', 14, 'For pain and inflammation'),
(30, 'Metformin', '500mg', 'Twice daily', '90 days', 180, 'Insulin sensitizer'),
(30, 'Myo-inositol', '2g', 'Twice daily', '90 days', 180, 'Hormonal balance'),
(30, 'Folic Acid', '5mg', 'Once daily', '90 days', 90, 'Continue supplementation'),
(31, 'Artificial Tears', '1 drop', 'Four times daily', '30 days', 1, 'For eye lubrication'),
(32, 'Mometasone Cream', 'Apply thin layer', 'Once daily', '14 days', 1, 'Reducing strength gradually'),
(32, 'Cetaphil Moisturizer', 'Apply liberally', 'Three times daily', '30 days', 1, 'Maintenance moisturization'),
(33, 'Pantoprazole', '40mg', 'Once daily', '90 days', 90, 'Continue maintenance therapy'),
(34, 'Cetirizine', '10mg', 'Once daily', '5 days', 5, 'For runny nose'),
(34, 'Paracetamol Drops', '1ml', 'Every 6 hours', '3 days', 1, 'For fever'),
(35, 'Dabigatran', '150mg', 'Twice daily', '30 days', 60, 'Blood thinner for AFib'),
(35, 'Metoprolol', '50mg', 'Twice daily', '30 days', 60, 'Rate control');

-- ============================================
-- BILLS (comprehensive billing data) - in INR
-- ============================================
-- Historical bills (90-60 days ago)
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) VALUES
(1, 1, 'BILL-20240905-00001', 2500.00, 0.00, 0.00, 2500.00, 2500.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_DATE - INTERVAL '83 days', 'Initial cardiac consultation + ECG'),
(2, 2, 'BILL-20240907-00002', 1200.00, 120.00, 0.00, 1080.00, 1080.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '88 days', CURRENT_DATE - INTERVAL '81 days', 'Pediatric checkup with 10% discount'),
(3, 3, 'BILL-20240910-00003', 8500.00, 0.00, 0.00, 8500.00, 8500.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '85 days', CURRENT_DATE - INTERVAL '78 days', 'ACL surgery consultation + MRI'),
(4, 4, 'BILL-20240915-00004', 2200.00, 0.00, 0.00, 2200.00, 2200.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '80 days', CURRENT_DATE - INTERVAL '73 days', 'Consultation + Blood tests'),
(5, 5, 'BILL-20240917-00005', 4500.00, 0.00, 0.00, 4500.00, 4500.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '78 days', CURRENT_DATE - INTERVAL '71 days', 'Cardiac evaluation + Echo'),
(6, 6, 'BILL-20240920-00006', 1400.00, 0.00, 0.00, 1400.00, 1400.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '75 days', CURRENT_DATE - INTERVAL '68 days', 'Neurology consultation'),
(7, 7, 'BILL-20240925-00007', 1200.00, 0.00, 0.00, 1200.00, 1200.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '70 days', CURRENT_DATE - INTERVAL '63 days', 'Orthopedic consultation'),
(8, 8, 'BILL-20240927-00008', 900.00, 0.00, 0.00, 900.00, 900.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '68 days', CURRENT_DATE - INTERVAL '61 days', 'General medicine consultation'),
(9, 9, 'BILL-20240930-00009', 1800.00, 180.00, 0.00, 1620.00, 1620.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_DATE - INTERVAL '58 days', 'Cardiology follow-up - Senior discount'),
(10, 10, 'BILL-20241003-00010', 3500.00, 0.00, 0.00, 3500.00, 3500.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '62 days', CURRENT_DATE - INTERVAL '55 days', 'Gynecology consultation + Ultrasound'),
(11, 11, 'BILL-20241005-00011', 6500.00, 0.00, 0.00, 6500.00, 6500.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_DATE - INTERVAL '53 days', 'Sleep study assessment'),
(12, 12, 'BILL-20241007-00012', 1200.00, 0.00, 0.00, 1200.00, 1200.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '58 days', CURRENT_DATE - INTERVAL '51 days', 'Dermatology consultation'),
(13, 13, 'BILL-20241010-00013', 1500.00, 0.00, 0.00, 1500.00, 1500.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_DATE - INTERVAL '48 days', 'GI consultation + endoscopy'),
(14, 14, 'BILL-20241013-00014', 800.00, 0.00, 0.00, 800.00, 800.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '52 days', CURRENT_DATE - INTERVAL '45 days', 'Vaccination charges'),
(15, 15, 'BILL-20241015-00015', 3200.00, 0.00, 0.00, 3200.00, 3200.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_DATE - INTERVAL '43 days', 'Cardiology + Holter monitor');

-- Bills from 45-30 days ago
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) VALUES
(1, 16, 'BILL-20241020-00016', 1500.00, 0.00, 0.00, 1500.00, 1500.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_DATE - INTERVAL '38 days', 'BP medication review'),
(2, 17, 'BILL-20241022-00017', 900.00, 90.00, 0.00, 810.00, 810.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '43 days', CURRENT_DATE - INTERVAL '36 days', 'Child growth monitoring'),
(3, 18, 'BILL-20241025-00018', 1500.00, 0.00, 0.00, 1500.00, 1500.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_DATE - INTERVAL '33 days', 'Post-surgery follow-up'),
(5, 19, 'BILL-20241027-00019', 1500.00, 0.00, 0.00, 1500.00, 1500.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '38 days', CURRENT_DATE - INTERVAL '31 days', 'Echo results review'),
(6, 20, 'BILL-20241030-00020', 1400.00, 0.00, 0.00, 1400.00, 1400.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_DATE - INTERVAL '28 days', 'Migraine follow-up');

-- Recent bills (30-3 days ago) - Mix of PAID, PENDING, PARTIAL
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) VALUES
(1, 21, 'BILL-20241103-00021', 1500.00, 0.00, 0.00, 1500.00, 1500.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_DATE - INTERVAL '23 days', 'Consultation fee paid'),
(2, 22, 'BILL-20241105-00022', 1000.00, 100.00, 0.00, 900.00, 900.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_DATE - INTERVAL '21 days', 'Vaccination with family discount'),
(3, 23, 'BILL-20241108-00023', 1200.00, 0.00, 0.00, 1200.00, 1200.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_DATE - INTERVAL '18 days', 'Follow-up consultation'),
(4, 24, 'BILL-20241111-00024', 800.00, 0.00, 0.00, 800.00, 800.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_DATE - INTERVAL '15 days', 'General checkup'),
(5, 25, 'BILL-20241113-00025', 3500.00, 0.00, 0.00, 3500.00, 3500.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_DATE - INTERVAL '13 days', 'Consultation + Stress test'),
(6, 26, 'BILL-20241115-00026', 1400.00, 0.00, 0.00, 1400.00, 1400.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_DATE - INTERVAL '11 days', 'Neurology consultation'),
(7, 27, 'BILL-20241118-00027', 5500.00, 0.00, 0.00, 5500.00, 3000.00, 'PARTIAL', 'CASH', NULL, CURRENT_DATE + INTERVAL '7 days', 'MRI + Consultation, partial payment'),
(8, 28, 'BILL-20241121-00028', 800.00, 0.00, 0.00, 800.00, 0.00, 'PENDING', NULL, NULL, CURRENT_DATE + INTERVAL '14 days', 'Awaiting payment'),
(9, 29, 'BILL-20241123-00029', 1600.00, 160.00, 0.00, 1440.00, 1440.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'Senior citizen discount'),
(10, 30, 'BILL-20241125-00030', 1400.00, 0.00, 0.00, 1400.00, 0.00, 'PENDING', NULL, NULL, CURRENT_DATE + INTERVAL '21 days', 'Follow-up billing'),
(11, 31, 'BILL-20241127-00031', 1200.00, 0.00, 0.00, 1200.00, 1200.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_DATE, 'Eye checkup paid'),
(12, 32, 'BILL-20241128-00032', 1000.00, 0.00, 0.00, 1000.00, 500.00, 'PARTIAL', 'UPI', NULL, CURRENT_DATE + INTERVAL '10 days', 'Partial payment received'),
(13, 33, 'BILL-20241129-00033', 800.00, 0.00, 0.00, 800.00, 0.00, 'PENDING', NULL, NULL, CURRENT_DATE + INTERVAL '15 days', 'Payment pending'),
(14, 34, 'BILL-20241130-00034', 600.00, 0.00, 0.00, 600.00, 600.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_DATE - INTERVAL '1 day', 'Pediatric consultation'),
(15, 35, 'BILL-20241201-00035', 2800.00, 0.00, 0.00, 2800.00, 0.00, 'PENDING', NULL, NULL, CURRENT_DATE + INTERVAL '28 days', 'Cardiology + Blood thinners');

-- ============================================
-- BILL ITEMS (breakdown for each bill) - in INR
-- ============================================
-- Historical bill items (Bills 1-15)
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price) VALUES
(1, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(1, 'ECG', 1, 500.00, 500.00),
(1, 'Blood Pressure Monitoring', 1, 500.00, 500.00),
(2, 'Pediatric Consultation', 1, 800.00, 800.00),
(2, 'Growth Assessment', 1, 400.00, 400.00),
(3, 'Orthopedic Consultation', 1, 1200.00, 1200.00),
(3, 'MRI Knee', 1, 5500.00, 5500.00),
(3, 'X-Ray', 2, 900.00, 1800.00),
(4, 'General Medicine Consultation', 1, 800.00, 800.00),
(4, 'Complete Blood Count', 1, 600.00, 600.00),
(4, 'Vitamin Profile', 1, 800.00, 800.00),
(5, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(5, 'Echocardiogram', 1, 2500.00, 2500.00),
(5, 'Lipid Profile', 1, 500.00, 500.00),
(6, 'Neurology Consultation', 1, 1400.00, 1400.00),
(7, 'Orthopedic Consultation', 1, 1200.00, 1200.00),
(8, 'General Medicine Consultation', 1, 900.00, 900.00),
(9, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(9, 'Uric Acid Test', 1, 300.00, 300.00),
(10, 'Gynecology Consultation', 1, 1200.00, 1200.00),
(10, 'Pelvic Ultrasound', 1, 1800.00, 1800.00),
(10, 'Hormonal Panel', 1, 500.00, 500.00),
(11, 'General Medicine Consultation', 1, 900.00, 900.00),
(11, 'Sleep Study (Polysomnography)', 1, 5600.00, 5600.00),
(12, 'Dermatology Consultation', 1, 1200.00, 1200.00),
(13, 'Gastroenterology Consultation', 1, 1000.00, 1000.00),
(13, 'Upper GI Endoscopy', 1, 500.00, 500.00),
(14, 'Pediatric Consultation', 1, 600.00, 600.00),
(14, 'DPT Booster Vaccine', 1, 200.00, 200.00),
(15, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(15, 'Holter Monitor (24hr)', 1, 1700.00, 1700.00);

-- Bill items for Bills 16-20 (45-30 days ago)
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price) VALUES
(16, 'Cardiology Follow-up', 1, 1500.00, 1500.00),
(17, 'Pediatric Consultation', 1, 600.00, 600.00),
(17, 'Nutritional Assessment', 1, 300.00, 300.00),
(18, 'Orthopedic Follow-up', 1, 1200.00, 1200.00),
(18, 'Physiotherapy Session', 1, 300.00, 300.00),
(19, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(20, 'Neurology Follow-up', 1, 1400.00, 1400.00);

-- Bill items for Bills 21-35 (Recent)
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price) VALUES
(21, 'Cardiology Follow-up', 1, 1500.00, 1500.00),
(22, 'Pediatric Consultation', 1, 600.00, 600.00),
(22, 'MMR Vaccine', 1, 400.00, 400.00),
(23, 'Orthopedic Follow-up', 1, 1200.00, 1200.00),
(24, 'General Medicine Consultation', 1, 800.00, 800.00),
(25, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(25, 'Treadmill Test (TMT)', 1, 2000.00, 2000.00),
(26, 'Neurology Consultation', 1, 1400.00, 1400.00),
(27, 'Orthopedic Consultation', 1, 1200.00, 1200.00),
(27, 'MRI Lumbar Spine', 1, 4300.00, 4300.00),
(28, 'General Medicine Consultation', 1, 800.00, 800.00),
(29, 'Cardiology Consultation', 1, 1600.00, 1600.00),
(30, 'Gynecology Consultation', 1, 1400.00, 1400.00),
(31, 'Ophthalmology Consultation', 1, 900.00, 900.00),
(31, 'Refraction Test', 1, 300.00, 300.00),
(32, 'Dermatology Follow-up', 1, 1000.00, 1000.00),
(33, 'General Medicine Follow-up', 1, 800.00, 800.00),
(34, 'Pediatric Emergency Consultation', 1, 600.00, 600.00),
(35, 'Cardiology Consultation', 1, 1500.00, 1500.00),
(35, 'INR Test', 1, 300.00, 300.00),
(35, 'Anticoagulant (Dabigatran 30 tabs)', 1, 1000.00, 1000.00);

-- ============================================
-- DATA LOAD COMPLETE
-- ============================================
SELECT 'Indian Sample Data Loaded Successfully!' as status;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Departments: ' || COUNT(*) FROM departments;
SELECT 'Doctors: ' || COUNT(*) FROM doctors;
SELECT 'Patients: ' || COUNT(*) FROM patients;
SELECT 'Appointments: ' || COUNT(*) FROM appointments;
SELECT 'Prescriptions: ' || COUNT(*) FROM prescriptions;
SELECT 'Bills: ' || COUNT(*) FROM bills;
