-- ============================================
-- CareSync Hospital Management System
-- Sample Data v1.0
-- ============================================
-- Run after schema.sql
-- psql -U postgres -d CARESYNC -f database/seed_data.sql
-- ============================================

-- ============================================
-- USERS - Role-based passwords (BCrypt hashed)
-- ============================================
-- Password Policy: 1 Uppercase, 1 Number, 1 Symbol required
-- 
-- | Role         | Password       |
-- |--------------|----------------|
-- | ADMIN        | Admin@123      |
-- | DOCTOR       | Doctor@123     |
-- | PATIENT      | Patient@123    |
-- | NURSE        | Nurse@123      |
-- | RECEPTIONIST | Reception@123  |
-- | TEST (Demo)  | Test@123$      |
-- ============================================

-- Admin Users (Password: Admin@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('admin', 'admin@caresync.com', '$2b$10$BrXiJWW97UUCgcGVhP2f.OKSZ1n00DHdb0LznBozX4gydbCkANtjy', 'ADMIN', true),
('superadmin', 'superadmin@caresync.com', '$2b$10$BrXiJWW97UUCgcGVhP2f.OKSZ1n00DHdb0LznBozX4gydbCkANtjy', 'ADMIN', true);

-- Test/Demo User - Read-only for recruiters (Password: Test@123$)
INSERT INTO users (username, email, password, role, is_active) VALUES
('demo', 'demo@caresync.com', '$2b$10$kZ8Q3rZzWilweIy2HhDfIuGJx2gWTywSkc136yPQbNZyNsr72y/eu', 'TEST', true);

-- Doctor Users (Password: Doctor@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('dr.smith', 'john.smith@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.patel', 'priya.patel@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.wilson', 'michael.wilson@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.garcia', 'maria.garcia@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.chen', 'david.chen@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.johnson', 'sarah.johnson@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.kumar', 'rahul.kumar@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.brown', 'emily.brown@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true);

-- Patient Users (Password: Patient@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('patient.robert', 'robert.miller@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.jennifer', 'jennifer.davis@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.james', 'james.taylor@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.amanda', 'amanda.white@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.daniel', 'daniel.martin@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.emily', 'emily.thompson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.matthew', 'matthew.anderson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.ashley', 'ashley.jackson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.christopher', 'christopher.harris@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.jessica', 'jessica.clark@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.andrew', 'andrew.lewis@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.nicole', 'nicole.walker@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.joshua', 'joshua.hall@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.stephanie', 'stephanie.allen@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.ryan', 'ryan.young@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true);

-- Nurse Users (Password: Nurse@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('nurse.lisa', 'lisa.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.karen', 'karen.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.tom', 'tom.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true);

-- Receptionist Users (Password: Reception@123)
INSERT INTO users (username, email, password, role, is_active) VALUES
('receptionist.mary', 'mary.reception@caresync.com', '$2b$10$TVdFMATTlqeVs2s6kZMLbuUVNFS4wYjfzwqq5L8BFoq8jSrb/QuIS', 'RECEPTIONIST', true),
('receptionist.john', 'john.reception@caresync.com', '$2b$10$TVdFMATTlqeVs2s6kZMLbuUVNFS4wYjfzwqq5L8BFoq8jSrb/QuIS', 'RECEPTIONIST', true);

-- ============================================
-- DEPARTMENTS
-- ============================================
INSERT INTO departments (name, description, floor_number, phone, is_active) VALUES
('Cardiology', 'Heart and cardiovascular system specialists', 2, '+1-555-0201', true),
('Neurology', 'Brain and nervous system specialists', 3, '+1-555-0202', true),
('Orthopedics', 'Bone, joint, and muscle specialists', 2, '+1-555-0203', true),
('Pediatrics', 'Child healthcare specialists', 1, '+1-555-0204', true),
('General Medicine', 'Primary care and internal medicine', 1, '+1-555-0205', true),
('Dermatology', 'Skin, hair, and nail specialists', 3, '+1-555-0206', true),
('Gynecology', 'Women health specialists', 4, '+1-555-0207', true),
('Ophthalmology', 'Eye care specialists', 2, '+1-555-0208', true);

-- ============================================
-- DOCTORS (linked to users and departments)
-- ============================================
INSERT INTO doctors (user_id, department_id, first_name, last_name, email, phone, specialization, qualification, license_number, experience_years, consultation_fee, bio, is_available) VALUES
((SELECT id FROM users WHERE email = 'john.smith@caresync.com'), 1, 'John', 'Smith', 'john.smith@caresync.com', '+1-555-1001', 'Cardiology', 'MD, DM Cardiology', 'MED-2024-001', 15, 200.00, 'Experienced cardiologist specializing in interventional procedures and heart failure management.', true),
((SELECT id FROM users WHERE email = 'priya.patel@caresync.com'), 2, 'Priya', 'Patel', 'priya.patel@caresync.com', '+1-555-1002', 'Neurology', 'MD, DM Neurology', 'MED-2024-002', 12, 180.00, 'Expert in treating neurological disorders including epilepsy and stroke.', true),
((SELECT id FROM users WHERE email = 'michael.wilson@caresync.com'), 3, 'Michael', 'Wilson', 'michael.wilson@caresync.com', '+1-555-1003', 'Orthopedics', 'MS Orthopedics', 'MED-2024-003', 18, 175.00, 'Specialist in joint replacement surgery and sports medicine.', true),
((SELECT id FROM users WHERE email = 'maria.garcia@caresync.com'), 4, 'Maria', 'Garcia', 'maria.garcia@caresync.com', '+1-555-1004', 'Pediatrics', 'MD Pediatrics', 'MED-2024-004', 10, 150.00, 'Dedicated pediatrician with expertise in childhood development and vaccination.', true),
((SELECT id FROM users WHERE email = 'david.chen@caresync.com'), 5, 'David', 'Chen', 'david.chen@caresync.com', '+1-555-1005', 'General Medicine', 'MD Internal Medicine', 'MED-2024-005', 8, 120.00, 'Primary care physician focused on preventive medicine and chronic disease management.', true),
((SELECT id FROM users WHERE email = 'sarah.johnson@caresync.com'), 6, 'Sarah', 'Johnson', 'sarah.johnson@caresync.com', '+1-555-1006', 'Dermatology', 'MD Dermatology', 'MED-2024-006', 9, 160.00, 'Dermatologist specializing in cosmetic procedures and skin cancer treatment.', true),
((SELECT id FROM users WHERE email = 'rahul.kumar@caresync.com'), 7, 'Rahul', 'Kumar', 'rahul.kumar@caresync.com', '+1-555-1007', 'Gynecology', 'MD, MS Obstetrics & Gynecology', 'MED-2024-007', 14, 170.00, 'Experienced gynecologist and obstetrician with focus on high-risk pregnancies.', true),
((SELECT id FROM users WHERE email = 'emily.brown@caresync.com'), 8, 'Emily', 'Brown', 'emily.brown@caresync.com', '+1-555-1008', 'Ophthalmology', 'MD Ophthalmology', 'MED-2024-008', 11, 165.00, 'Eye surgeon specializing in cataract and LASIK procedures.', true);

-- ============================================
-- DOCTOR SCHEDULES
-- ============================================
-- Dr. John Smith (Cardiology)
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

-- Dr. Michael Wilson (Orthopedics)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(3, 'MONDAY', '08:00', '16:00', 30, true),
(3, 'TUESDAY', '08:00', '16:00', 30, true),
(3, 'WEDNESDAY', '08:00', '16:00', 30, true),
(3, 'THURSDAY', '08:00', '16:00', 30, true),
(3, 'SATURDAY', '09:00', '13:00', 30, true);

-- Dr. Maria Garcia (Pediatrics)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(4, 'MONDAY', '09:00', '17:00', 20, true),
(4, 'TUESDAY', '09:00', '17:00', 20, true),
(4, 'WEDNESDAY', '09:00', '17:00', 20, true),
(4, 'THURSDAY', '09:00', '17:00', 20, true),
(4, 'FRIDAY', '09:00', '17:00', 20, true),
(4, 'SATURDAY', '10:00', '14:00', 20, true);

-- Dr. David Chen (General Medicine)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(5, 'MONDAY', '08:00', '18:00', 20, true),
(5, 'TUESDAY', '08:00', '18:00', 20, true),
(5, 'WEDNESDAY', '08:00', '18:00', 20, true),
(5, 'THURSDAY', '08:00', '18:00', 20, true),
(5, 'FRIDAY', '08:00', '18:00', 20, true);

-- Dr. Sarah Johnson (Dermatology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(6, 'MONDAY', '10:00', '16:00', 30, true),
(6, 'WEDNESDAY', '10:00', '16:00', 30, true),
(6, 'FRIDAY', '10:00', '16:00', 30, true);

-- Dr. Rahul Kumar (Gynecology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(7, 'MONDAY', '09:00', '17:00', 30, true),
(7, 'TUESDAY', '09:00', '17:00', 30, true),
(7, 'THURSDAY', '09:00', '17:00', 30, true),
(7, 'FRIDAY', '09:00', '17:00', 30, true);

-- Dr. Emily Brown (Ophthalmology)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(8, 'TUESDAY', '09:00', '17:00', 30, true),
(8, 'WEDNESDAY', '09:00', '17:00', 30, true),
(8, 'THURSDAY', '09:00', '17:00', 30, true),
(8, 'SATURDAY', '09:00', '13:00', 30, true);

-- ============================================
-- PATIENTS (linked to users)
-- ============================================
INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, city, state, pincode, emergency_contact_name, emergency_contact_phone, medical_history, allergies) VALUES
((SELECT id FROM users WHERE email = 'robert.miller@email.com'), 'Robert', 'Miller', '1985-03-15', 'MALE', 'O+', '+1-555-2001', 'robert.miller@email.com', '123 Oak Street', 'New York', 'NY', '10001', 'Susan Miller', '+1-555-2002', 'Hypertension diagnosed in 2020, Type 2 Diabetes', 'Penicillin'),
((SELECT id FROM users WHERE email = 'jennifer.davis@email.com'), 'Jennifer', 'Davis', '1990-07-22', 'FEMALE', 'A+', '+1-555-2003', 'jennifer.davis@email.com', '456 Maple Avenue', 'Los Angeles', 'CA', '90001', 'Mark Davis', '+1-555-2004', 'Asthma since childhood', 'Sulfa drugs'),
((SELECT id FROM users WHERE email = 'james.taylor@email.com'), 'James', 'Taylor', '1978-11-08', 'MALE', 'B+', '+1-555-2005', 'james.taylor@email.com', '789 Pine Road', 'Chicago', 'IL', '60601', 'Lisa Taylor', '+1-555-2006', 'Previous knee surgery in 2019', 'None'),
((SELECT id FROM users WHERE email = 'amanda.white@email.com'), 'Amanda', 'White', '1995-02-28', 'FEMALE', 'AB+', '+1-555-2007', 'amanda.white@email.com', '321 Cedar Lane', 'Houston', 'TX', '77001', 'John White', '+1-555-2008', 'No significant medical history', 'Latex'),
((SELECT id FROM users WHERE email = 'daniel.martin@email.com'), 'Daniel', 'Martin', '1982-09-14', 'MALE', 'A-', '+1-555-2009', 'daniel.martin@email.com', '654 Birch Street', 'Phoenix', 'AZ', '85001', 'Emily Martin', '+1-555-2010', 'High cholesterol, Family history of heart disease', 'Aspirin'),
((SELECT id FROM users WHERE email = 'emily.thompson@email.com'), 'Emily', 'Thompson', '1988-05-19', 'FEMALE', 'O-', '+1-555-2011', 'emily.thompson@email.com', '987 Elm Drive', 'Philadelphia', 'PA', '19101', 'David Thompson', '+1-555-2012', 'Migraine headaches', 'Codeine'),
((SELECT id FROM users WHERE email = 'matthew.anderson@email.com'), 'Matthew', 'Anderson', '1975-12-03', 'MALE', 'B-', '+1-555-2013', 'matthew.anderson@email.com', '147 Willow Way', 'San Antonio', 'TX', '78201', 'Sarah Anderson', '+1-555-2014', 'Back pain, Herniated disc L4-L5', 'None'),
((SELECT id FROM users WHERE email = 'ashley.jackson@email.com'), 'Ashley', 'Jackson', '1992-08-25', 'FEMALE', 'AB-', '+1-555-2015', 'ashley.jackson@email.com', '258 Spruce Court', 'San Diego', 'CA', '92101', 'Michael Jackson', '+1-555-2016', 'Anxiety disorder', 'Shellfish'),
((SELECT id FROM users WHERE email = 'christopher.harris@email.com'), 'Christopher', 'Harris', '1980-04-10', 'MALE', 'O+', '+1-555-2017', 'christopher.harris@email.com', '369 Redwood Blvd', 'Dallas', 'TX', '75201', 'Jennifer Harris', '+1-555-2018', 'Kidney stones (2018), Gout', 'Ibuprofen'),
((SELECT id FROM users WHERE email = 'jessica.clark@email.com'), 'Jessica', 'Clark', '1993-01-17', 'FEMALE', 'A+', '+1-555-2019', 'jessica.clark@email.com', '741 Sequoia Street', 'San Jose', 'CA', '95101', 'Robert Clark', '+1-555-2020', 'PCOS diagnosed in 2021', 'None'),
((SELECT id FROM users WHERE email = 'andrew.lewis@email.com'), 'Andrew', 'Lewis', '1987-06-30', 'MALE', 'B+', '+1-555-2021', 'andrew.lewis@email.com', '852 Aspen Circle', 'Austin', 'TX', '78701', 'Michelle Lewis', '+1-555-2022', 'Sleep apnea', 'Morphine'),
((SELECT id FROM users WHERE email = 'nicole.walker@email.com'), 'Nicole', 'Walker', '1991-10-05', 'FEMALE', 'O-', '+1-555-2023', 'nicole.walker@email.com', '963 Cypress Lane', 'Jacksonville', 'FL', '32099', 'Daniel Walker', '+1-555-2024', 'Hypothyroidism', 'Contrast dye'),
((SELECT id FROM users WHERE email = 'joshua.hall@email.com'), 'Joshua', 'Hall', '1983-07-12', 'MALE', 'A-', '+1-555-2025', 'joshua.hall@email.com', '159 Magnolia Drive', 'Fort Worth', 'TX', '76101', 'Amanda Hall', '+1-555-2026', 'Gastric reflux (GERD)', 'None'),
((SELECT id FROM users WHERE email = 'stephanie.allen@email.com'), 'Stephanie', 'Allen', '1996-03-28', 'FEMALE', 'B-', '+1-555-2027', 'stephanie.allen@email.com', '357 Hickory Road', 'Columbus', 'OH', '43085', 'James Allen', '+1-555-2028', 'No significant medical history', 'Peanuts'),
((SELECT id FROM users WHERE email = 'ryan.young@email.com'), 'Ryan', 'Young', '1979-11-22', 'MALE', 'AB+', '+1-555-2029', 'ryan.young@email.com', '468 Chestnut Avenue', 'Charlotte', 'NC', '28201', 'Laura Young', '+1-555-2030', 'Atrial fibrillation, On blood thinners', 'Warfarin alternatives');

-- ============================================
-- APPOINTMENTS (mix of past, today, and future)
-- ============================================

-- Past appointments (completed)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(1, 1, CURRENT_DATE - INTERVAL '30 days', '09:00', '09:30', 'COMPLETED', 'Routine cardiac checkup', 'Occasional chest discomfort', 'Mild hypertension, ECG normal', 'Continue current medications, follow up in 3 months'),
(2, 4, CURRENT_DATE - INTERVAL '28 days', '10:00', '10:20', 'COMPLETED', 'Child vaccination', 'None', 'Healthy child, vaccinations administered', 'Next vaccination due in 6 months'),
(3, 3, CURRENT_DATE - INTERVAL '25 days', '11:00', '11:30', 'COMPLETED', 'Knee pain follow-up', 'Pain while climbing stairs', 'Post-surgical recovery on track', 'Physical therapy recommended'),
(4, 5, CURRENT_DATE - INTERVAL '22 days', '14:00', '14:20', 'COMPLETED', 'General checkup', 'Fatigue', 'Vitamin D deficiency', 'Supplements prescribed'),
(5, 1, CURRENT_DATE - INTERVAL '20 days', '10:00', '10:30', 'COMPLETED', 'Chest pain evaluation', 'Sharp chest pain on exertion', 'Angina, stress test ordered', 'Avoid strenuous activity'),
(6, 2, CURRENT_DATE - INTERVAL '18 days', '15:00', '15:30', 'COMPLETED', 'Migraine consultation', 'Severe headaches, light sensitivity', 'Chronic migraine', 'Preventive medication started'),
(7, 3, CURRENT_DATE - INTERVAL '15 days', '09:30', '10:00', 'COMPLETED', 'Back pain assessment', 'Lower back pain radiating to leg', 'Herniated disc confirmed', 'MRI ordered, pain management started'),
(8, 5, CURRENT_DATE - INTERVAL '12 days', '11:00', '11:20', 'COMPLETED', 'Anxiety symptoms', 'Panic attacks, insomnia', 'Generalized anxiety disorder', 'Referred to psychiatrist'),
(9, 1, CURRENT_DATE - INTERVAL '10 days', '16:00', '16:30', 'COMPLETED', 'Gout flare-up', 'Severe pain in big toe', 'Acute gout attack', 'Colchicine prescribed'),
(10, 7, CURRENT_DATE - INTERVAL '8 days', '10:00', '10:30', 'COMPLETED', 'PCOS follow-up', 'Irregular periods', 'PCOS management review', 'Continue current treatment'),

-- Cancelled appointments
(11, 5, CURRENT_DATE - INTERVAL '5 days', '14:00', '14:20', 'CANCELLED', 'Sleep study review', NULL, NULL, 'Patient cancelled due to travel'),
(12, 6, CURRENT_DATE - INTERVAL '3 days', '11:00', '11:30', 'NO_SHOW', 'Skin rash evaluation', NULL, NULL, 'Patient did not show up');

-- Today's appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(1, 1, CURRENT_DATE, '09:00', '09:30', 'SCHEDULED', 'Blood pressure check', 'Headaches, dizziness'),
(3, 3, CURRENT_DATE, '09:30', '10:00', 'SCHEDULED', 'Post-therapy evaluation', 'Reduced knee pain'),
(5, 1, CURRENT_DATE, '10:00', '10:30', 'SCHEDULED', 'Stress test results', 'Shortness of breath'),
(6, 2, CURRENT_DATE, '10:30', '11:00', 'SCHEDULED', 'Migraine follow-up', 'Medication side effects'),
(8, 5, CURRENT_DATE, '11:00', '11:20', 'SCHEDULED', 'Mental health check', 'Improved sleep'),
(10, 7, CURRENT_DATE, '11:00', '11:30', 'SCHEDULED', 'Hormone therapy review', 'Weight changes'),
(2, 4, CURRENT_DATE, '14:00', '14:20', 'SCHEDULED', 'Child fever', 'High temperature, cough'),
(4, 6, CURRENT_DATE, '14:30', '15:00', 'SCHEDULED', 'Skin allergy', 'Rash on arms'),
(9, 5, CURRENT_DATE, '15:00', '15:20', 'SCHEDULED', 'Kidney function test', 'Routine follow-up'),
(15, 1, CURRENT_DATE, '16:00', '16:30', 'SCHEDULED', 'AFib management', 'Palpitations');

-- Future appointments (next 2 weeks)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(7, 3, CURRENT_DATE + INTERVAL '1 day', '09:00', '09:30', 'SCHEDULED', 'MRI results discussion', 'Persistent back pain'),
(11, 5, CURRENT_DATE + INTERVAL '1 day', '10:00', '10:20', 'SCHEDULED', 'CPAP machine follow-up', 'Better sleep quality'),
(12, 8, CURRENT_DATE + INTERVAL '2 days', '09:30', '10:00', 'SCHEDULED', 'Eye examination', 'Blurry vision'),
(13, 5, CURRENT_DATE + INTERVAL '2 days', '11:00', '11:20', 'SCHEDULED', 'Acid reflux review', 'Heartburn'),
(14, 4, CURRENT_DATE + INTERVAL '3 days', '10:00', '10:20', 'SCHEDULED', 'Allergy consultation', 'Seasonal allergies'),
(1, 1, CURRENT_DATE + INTERVAL '5 days', '09:00', '09:30', 'SCHEDULED', 'ECG follow-up', 'Routine cardiac monitoring'),
(2, 4, CURRENT_DATE + INTERVAL '5 days', '14:00', '14:20', 'SCHEDULED', 'Growth assessment', 'Child development check'),
(5, 1, CURRENT_DATE + INTERVAL '7 days', '10:00', '10:30', 'SCHEDULED', 'Angiogram discussion', 'Pre-procedure consultation'),
(6, 2, CURRENT_DATE + INTERVAL '7 days', '15:00', '15:30', 'SCHEDULED', 'Neurology review', 'Medication adjustment'),
(3, 3, CURRENT_DATE + INTERVAL '10 days', '09:00', '09:30', 'SCHEDULED', 'Physical therapy review', 'Knee mobility check'),
(8, 5, CURRENT_DATE + INTERVAL '10 days', '11:00', '11:20', 'SCHEDULED', 'Mental wellness check', 'Therapy progress'),
(15, 1, CURRENT_DATE + INTERVAL '14 days', '16:00', '16:30', 'SCHEDULED', 'Cardiology follow-up', 'Blood thinner review');

-- ============================================
-- PRESCRIPTIONS (for completed appointments)
-- ============================================
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) VALUES
(1, 1, 1, 'Essential Hypertension (Stage 1)', 'Blood pressure slightly elevated. Lifestyle modifications recommended along with medication.', CURRENT_DATE + INTERVAL '90 days'),
(3, 3, 3, 'Post-operative knee rehabilitation', 'Good progress after ACL reconstruction. Continue physical therapy.', CURRENT_DATE + INTERVAL '30 days'),
(4, 4, 5, 'Vitamin D Deficiency', 'Serum Vitamin D level at 15 ng/mL. Supplement therapy initiated.', CURRENT_DATE + INTERVAL '60 days'),
(5, 5, 1, 'Stable Angina Pectoris', 'Positive stress test. Anti-anginal medication started. Angiography recommended.', CURRENT_DATE + INTERVAL '14 days'),
(6, 6, 2, 'Chronic Migraine without Aura', 'More than 15 headache days per month. Preventive therapy initiated.', CURRENT_DATE + INTERVAL '30 days'),
(7, 7, 3, 'Lumbar Disc Herniation L4-L5', 'MRI confirms herniation. Conservative management first, surgery if no improvement.', CURRENT_DATE + INTERVAL '45 days'),
(8, 8, 5, 'Generalized Anxiety Disorder', 'Moderate severity. Combination of medication and therapy recommended.', CURRENT_DATE + INTERVAL '14 days'),
(9, 9, 1, 'Acute Gouty Arthritis', 'Elevated uric acid levels. Acute treatment followed by long-term management.', CURRENT_DATE + INTERVAL '30 days'),
(10, 10, 7, 'Polycystic Ovary Syndrome', 'Well-controlled with current regimen. Continue monitoring.', CURRENT_DATE + INTERVAL '90 days');

-- ============================================
-- PRESCRIPTION ITEMS (medicines for each prescription)
-- ============================================
-- Prescription 1: Hypertension
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(1, 'Amlodipine', '5mg', 'Once daily', '90 days', 90, 'Take in the morning with water'),
(1, 'Losartan', '50mg', 'Once daily', '90 days', 90, 'Take in the evening'),
(1, 'Aspirin', '75mg', 'Once daily', '90 days', 90, 'Take after breakfast');

-- Prescription 2: Post knee surgery
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(2, 'Acetaminophen', '500mg', 'Twice daily', '14 days', 28, 'Take for pain relief as needed'),
(2, 'Glucosamine Sulfate', '1500mg', 'Once daily', '60 days', 60, 'For joint health');

-- Prescription 3: Vitamin D deficiency
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(3, 'Cholecalciferol (Vitamin D3)', '60000 IU', 'Once weekly', '8 weeks', 8, 'Take with fatty meal for better absorption'),
(3, 'Calcium Carbonate', '500mg', 'Twice daily', '60 days', 120, 'Take with meals');

-- Prescription 4: Angina
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(4, 'Isosorbide Mononitrate', '30mg', 'Once daily', '30 days', 30, 'Take in the morning'),
(4, 'Atorvastatin', '20mg', 'Once daily', '30 days', 30, 'Take at bedtime'),
(4, 'Metoprolol', '25mg', 'Twice daily', '30 days', 60, 'Do not stop abruptly'),
(4, 'Nitroglycerin SL', '0.5mg', 'As needed', '30 days', 30, 'Place under tongue for chest pain');

-- Prescription 5: Migraine
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(5, 'Topiramate', '25mg', 'Twice daily', '30 days', 60, 'Increase to 50mg after 2 weeks'),
(5, 'Sumatriptan', '50mg', 'As needed', '30 days', 9, 'Take at onset of migraine, max 2 per day'),
(5, 'Riboflavin (Vitamin B2)', '400mg', 'Once daily', '90 days', 90, 'For migraine prevention');

-- Prescription 6: Herniated disc
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(6, 'Pregabalin', '75mg', 'Twice daily', '30 days', 60, 'May cause drowsiness'),
(6, 'Diclofenac', '50mg', 'Twice daily', '14 days', 28, 'Take after food'),
(6, 'Methocarbamol', '500mg', 'Three times daily', '14 days', 42, 'Muscle relaxant, avoid driving');

-- Prescription 7: Anxiety
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(7, 'Escitalopram', '10mg', 'Once daily', '30 days', 30, 'Take in the morning, effects may take 2-4 weeks'),
(7, 'Clonazepam', '0.25mg', 'As needed', '14 days', 14, 'For acute anxiety, max 2 per day');

-- Prescription 8: Gout
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(8, 'Colchicine', '0.5mg', 'Twice daily', '7 days', 14, 'For acute attack, then once daily'),
(8, 'Febuxostat', '40mg', 'Once daily', '30 days', 30, 'Long-term uric acid control'),
(8, 'Naproxen', '500mg', 'Twice daily', '7 days', 14, 'For pain and inflammation');

-- Prescription 9: PCOS
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions) VALUES
(9, 'Metformin', '500mg', 'Twice daily', '90 days', 180, 'Take with meals to reduce GI upset'),
(9, 'Myo-Inositol', '2g', 'Twice daily', '90 days', 180, 'For hormonal balance'),
(9, 'Folic Acid', '5mg', 'Once daily', '90 days', 90, 'Take daily');

-- ============================================
-- BILLS (for completed appointments)
-- ============================================
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) VALUES
(1, 1, 'BILL-20241103-00001', 200.00, 0.00, 0.00, 200.00, 200.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_DATE - INTERVAL '23 days', 'Consultation fee paid'),
(2, 2, 'BILL-20241105-00002', 150.00, 15.00, 0.00, 135.00, 135.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_DATE - INTERVAL '21 days', 'Vaccination charges with 10% family discount'),
(3, 3, 'BILL-20241108-00003', 175.00, 0.00, 0.00, 175.00, 175.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_DATE - INTERVAL '18 days', 'Follow-up consultation'),
(4, 4, 'BILL-20241111-00004', 120.00, 0.00, 0.00, 120.00, 120.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '22 days', CURRENT_DATE - INTERVAL '15 days', 'General checkup'),
(5, 5, 'BILL-20241113-00005', 450.00, 0.00, 0.00, 450.00, 450.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_DATE - INTERVAL '13 days', 'Consultation + Stress test'),
(6, 6, 'BILL-20241115-00006', 180.00, 0.00, 0.00, 180.00, 180.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_DATE - INTERVAL '11 days', 'Neurology consultation'),
(7, 7, 'BILL-20241118-00007', 675.00, 0.00, 0.00, 675.00, 400.00, 'PARTIAL', 'CASH', NULL, CURRENT_DATE + INTERVAL '7 days', 'MRI + Consultation, partial payment received'),
(8, 8, 'BILL-20241121-00008', 120.00, 0.00, 0.00, 120.00, 0.00, 'PENDING', NULL, NULL, CURRENT_DATE + INTERVAL '14 days', 'Awaiting payment'),
(9, 9, 'BILL-20241123-00009', 200.00, 20.00, 0.00, 180.00, 180.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'Senior citizen discount applied'),
(10, 10, 'BILL-20241125-00010', 170.00, 0.00, 0.00, 170.00, 0.00, 'PENDING', NULL, NULL, CURRENT_DATE + INTERVAL '21 days', 'Follow-up billing');

-- ============================================
-- BILL ITEMS (breakdown for each bill)
-- ============================================
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price) VALUES
-- Bill 1
(1, 'Cardiology Consultation', 1, 200.00, 200.00),
-- Bill 2
(2, 'Pediatric Consultation', 1, 100.00, 100.00),
(2, 'Vaccination (MMR)', 1, 50.00, 50.00),
-- Bill 3
(3, 'Orthopedic Follow-up', 1, 175.00, 175.00),
-- Bill 4
(4, 'General Medicine Consultation', 1, 120.00, 120.00),
-- Bill 5
(5, 'Cardiology Consultation', 1, 200.00, 200.00),
(5, 'Stress Test (TMT)', 1, 250.00, 250.00),
-- Bill 6
(6, 'Neurology Consultation', 1, 180.00, 180.00),
-- Bill 7
(7, 'Orthopedic Consultation', 1, 175.00, 175.00),
(7, 'MRI Lumbar Spine', 1, 500.00, 500.00),
-- Bill 8
(8, 'General Medicine Consultation', 1, 120.00, 120.00),
-- Bill 9
(9, 'Cardiology Consultation', 1, 200.00, 200.00),
-- Bill 10
(10, 'Gynecology Consultation', 1, 170.00, 170.00);

-- ============================================
-- DATA LOAD COMPLETE
-- ============================================
SELECT 'Sample Data Loaded Successfully!' as status;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Departments: ' || COUNT(*) FROM departments;
SELECT 'Doctors: ' || COUNT(*) FROM doctors;
SELECT 'Patients: ' || COUNT(*) FROM patients;
SELECT 'Appointments: ' || COUNT(*) FROM appointments;
SELECT 'Prescriptions: ' || COUNT(*) FROM prescriptions;
SELECT 'Bills: ' || COUNT(*) FROM bills;
-- ============================================
-- CareSync Hospital Management System
-- Large Scale Sample Data v1.0
-- ============================================
-- This creates realistic hospital data:
-- - 50+ Patients
-- - 15+ Doctors across departments
-- - 200+ Appointments (past, today, future)
-- - 100+ Prescriptions with medicines
-- - 150+ Bills with items
-- ============================================

-- ============================================
-- ADDITIONAL DEPARTMENTS (total 12)
-- ============================================
INSERT INTO departments (name, description, floor_number, phone, is_active) VALUES
('Emergency Medicine', 'Emergency and trauma care unit', 1, '+1-555-0209', true),
('Radiology', 'X-ray, MRI, CT scan imaging services', 2, '+1-555-0210', true),
('Psychiatry', 'Mental health and behavioral services', 4, '+1-555-0211', true),
('Urology', 'Urinary tract and male reproductive specialists', 3, '+1-555-0212', true);

-- ============================================
-- ADDITIONAL DOCTORS (15 more = 23 total)
-- Password: Doctor@123
-- ============================================
INSERT INTO users (username, email, password, role, is_active) VALUES
('dr.anderson', 'james.anderson@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.thomas', 'lisa.thomas@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.martinez', 'carlos.martinez@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.lee', 'jennifer.lee@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.wong', 'kevin.wong@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.rodriguez', 'maria.rodriguez@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.kim', 'susan.kim@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.nguyen', 'david.nguyen@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.jackson', 'michelle.jackson@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.white', 'robert.white@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.harris', 'amanda.harris@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.clark', 'william.clark@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.lewis', 'patricia.lewis@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.walker', 'daniel.walker@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true),
('dr.hall', 'elizabeth.hall@caresync.com', '$2b$10$vaGo87k7jQ0c.JRNdO.H9uvthQx9bROZFwlw0c0D1JfnqVYjCK4Ci', 'DOCTOR', true);

INSERT INTO doctors (user_id, department_id, first_name, last_name, email, phone, specialization, qualification, license_number, experience_years, consultation_fee, bio, is_available) VALUES
((SELECT id FROM users WHERE email = 'james.anderson@caresync.com'), 9, 'James', 'Anderson', 'james.anderson@caresync.com', '+1-555-1009', 'Emergency Medicine', 'MD Emergency Medicine', 'MED-2024-009', 12, 250.00, 'Emergency physician with expertise in trauma care and critical interventions.', true),
((SELECT id FROM users WHERE email = 'lisa.thomas@caresync.com'), 10, 'Lisa', 'Thomas', 'lisa.thomas@caresync.com', '+1-555-1010', 'Radiology', 'MD Radiology', 'MED-2024-010', 14, 180.00, 'Interventional radiologist specializing in diagnostic imaging.', true),
((SELECT id FROM users WHERE email = 'carlos.martinez@caresync.com'), 11, 'Carlos', 'Martinez', 'carlos.martinez@caresync.com', '+1-555-1011', 'Psychiatry', 'MD Psychiatry', 'MED-2024-011', 16, 200.00, 'Psychiatrist specializing in mood disorders and anxiety.', true),
((SELECT id FROM users WHERE email = 'jennifer.lee@caresync.com'), 12, 'Jennifer', 'Lee', 'jennifer.lee@caresync.com', '+1-555-1012', 'Urology', 'MD, MS Urology', 'MED-2024-012', 11, 175.00, 'Urologist with expertise in minimally invasive surgery.', true),
((SELECT id FROM users WHERE email = 'kevin.wong@caresync.com'), 1, 'Kevin', 'Wong', 'kevin.wong@caresync.com', '+1-555-1013', 'Cardiology', 'MD, DM Cardiology', 'MED-2024-013', 9, 190.00, 'Cardiologist specializing in cardiac electrophysiology.', true),
((SELECT id FROM users WHERE email = 'maria.rodriguez@caresync.com'), 2, 'Maria', 'Rodriguez', 'maria.rodriguez@caresync.com', '+1-555-1014', 'Neurology', 'MD Neurology', 'MED-2024-014', 13, 185.00, 'Neurologist with focus on movement disorders.', true),
((SELECT id FROM users WHERE email = 'susan.kim@caresync.com'), 3, 'Susan', 'Kim', 'susan.kim@caresync.com', '+1-555-1015', 'Orthopedics', 'MS Orthopedics', 'MED-2024-015', 17, 180.00, 'Orthopedic surgeon specializing in spine surgery.', true),
((SELECT id FROM users WHERE email = 'david.nguyen@caresync.com'), 4, 'David', 'Nguyen', 'david.nguyen@caresync.com', '+1-555-1016', 'Pediatrics', 'MD Pediatrics', 'MED-2024-016', 8, 140.00, 'Pediatrician with focus on neonatal care.', true),
((SELECT id FROM users WHERE email = 'michelle.jackson@caresync.com'), 5, 'Michelle', 'Jackson', 'michelle.jackson@caresync.com', '+1-555-1017', 'General Medicine', 'MD Internal Medicine', 'MED-2024-017', 7, 110.00, 'Internal medicine specialist with preventive care focus.', true),
((SELECT id FROM users WHERE email = 'robert.white@caresync.com'), 6, 'Robert', 'White', 'robert.white@caresync.com', '+1-555-1018', 'Dermatology', 'MD Dermatology', 'MED-2024-018', 10, 155.00, 'Dermatologist specializing in skin cancer screening.', true),
((SELECT id FROM users WHERE email = 'amanda.harris@caresync.com'), 7, 'Amanda', 'Harris', 'amanda.harris@caresync.com', '+1-555-1019', 'Gynecology', 'MD Obstetrics & Gynecology', 'MED-2024-019', 12, 165.00, 'OB-GYN with expertise in fertility treatments.', true),
((SELECT id FROM users WHERE email = 'william.clark@caresync.com'), 8, 'William', 'Clark', 'william.clark@caresync.com', '+1-555-1020', 'Ophthalmology', 'MD Ophthalmology', 'MED-2024-020', 15, 170.00, 'Ophthalmologist specializing in retinal disorders.', true),
((SELECT id FROM users WHERE email = 'patricia.lewis@caresync.com'), 9, 'Patricia', 'Lewis', 'patricia.lewis@caresync.com', '+1-555-1021', 'Emergency Medicine', 'MD Emergency Medicine', 'MED-2024-021', 9, 240.00, 'Emergency physician with pediatric emergency expertise.', true),
((SELECT id FROM users WHERE email = 'daniel.walker@caresync.com'), 10, 'Daniel', 'Walker', 'daniel.walker@caresync.com', '+1-555-1022', 'Radiology', 'MD Radiology', 'MED-2024-022', 11, 175.00, 'Radiologist with neuroradiology subspecialty.', true),
((SELECT id FROM users WHERE email = 'elizabeth.hall@caresync.com'), 11, 'Elizabeth', 'Hall', 'elizabeth.hall@caresync.com', '+1-555-1023', 'Psychiatry', 'MD Psychiatry', 'MED-2024-023', 14, 195.00, 'Child and adolescent psychiatrist.', true);

-- Doctor schedules for new doctors
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available) VALUES
(9, 'MONDAY', '08:00', '20:00', 30, true), (9, 'TUESDAY', '08:00', '20:00', 30, true), (9, 'WEDNESDAY', '08:00', '20:00', 30, true),
(10, 'MONDAY', '09:00', '17:00', 30, true), (10, 'WEDNESDAY', '09:00', '17:00', 30, true), (10, 'FRIDAY', '09:00', '17:00', 30, true),
(11, 'MONDAY', '10:00', '18:00', 45, true), (11, 'TUESDAY', '10:00', '18:00', 45, true), (11, 'THURSDAY', '10:00', '18:00', 45, true),
(12, 'TUESDAY', '09:00', '17:00', 30, true), (12, 'THURSDAY', '09:00', '17:00', 30, true), (12, 'SATURDAY', '09:00', '13:00', 30, true),
(13, 'MONDAY', '09:00', '17:00', 30, true), (13, 'WEDNESDAY', '09:00', '17:00', 30, true), (13, 'FRIDAY', '09:00', '17:00', 30, true),
(14, 'TUESDAY', '10:00', '18:00', 30, true), (14, 'THURSDAY', '10:00', '18:00', 30, true),
(15, 'MONDAY', '08:00', '16:00', 30, true), (15, 'WEDNESDAY', '08:00', '16:00', 30, true), (15, 'FRIDAY', '08:00', '16:00', 30, true),
(16, 'MONDAY', '09:00', '17:00', 20, true), (16, 'TUESDAY', '09:00', '17:00', 20, true), (16, 'THURSDAY', '09:00', '17:00', 20, true),
(17, 'MONDAY', '08:00', '18:00', 20, true), (17, 'TUESDAY', '08:00', '18:00', 20, true), (17, 'WEDNESDAY', '08:00', '18:00', 20, true),
(18, 'TUESDAY', '10:00', '16:00', 30, true), (18, 'THURSDAY', '10:00', '16:00', 30, true),
(19, 'MONDAY', '09:00', '17:00', 30, true), (19, 'WEDNESDAY', '09:00', '17:00', 30, true), (19, 'FRIDAY', '09:00', '17:00', 30, true),
(20, 'TUESDAY', '09:00', '17:00', 30, true), (20, 'THURSDAY', '09:00', '17:00', 30, true),
(21, 'MONDAY', '08:00', '20:00', 30, true), (21, 'THURSDAY', '08:00', '20:00', 30, true), (21, 'SATURDAY', '08:00', '14:00', 30, true),
(22, 'MONDAY', '09:00', '17:00', 30, true), (22, 'WEDNESDAY', '09:00', '17:00', 30, true),
(23, 'TUESDAY', '10:00', '18:00', 45, true), (23, 'FRIDAY', '10:00', '18:00', 45, true);

-- ============================================
-- ADDITIONAL PATIENTS (40 more = 55 total)
-- Password: Patient@123
-- ============================================
INSERT INTO users (username, email, password, role, is_active) VALUES
('patient.william', 'william.jones@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.sarah', 'sarah.brown@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.michael', 'michael.wilson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.elizabeth', 'elizabeth.moore@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.david', 'david.taylor@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.mary', 'mary.anderson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.richard', 'richard.thomas@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.patricia', 'patricia.jackson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.charles', 'charles.white@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.linda', 'linda.harris@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.joseph', 'joseph.martin@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.barbara', 'barbara.garcia@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.thomas', 'thomas.martinez@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.susan', 'susan.robinson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.mark', 'mark.clark@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.dorothy', 'dorothy.rodriguez@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.steven', 'steven.lewis@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.margaret', 'margaret.lee@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.paul', 'paul.walker@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.betty', 'betty.hall@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.george', 'george.allen@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.helen', 'helen.young@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.edward', 'edward.hernandez@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.sandra', 'sandra.king@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.brian', 'brian.wright@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.donna', 'donna.lopez@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.ronald', 'ronald.hill@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.carol', 'carol.scott@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.kevin', 'kevin.green@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.sharon', 'sharon.adams@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.jason', 'jason.baker@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.kathleen', 'kathleen.gonzalez@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.frank', 'frank.nelson@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.nancy', 'nancy.carter@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.raymond', 'raymond.mitchell@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.janet', 'janet.perez@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.henry', 'henry.roberts@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.catherine', 'catherine.turner@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.dennis', 'dennis.phillips@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true),
('patient.samantha', 'samantha.campbell@email.com', '$2b$10$xu.2BCHO4IKyb29luD3FLeL7ZE4CJpqTaU39nXjp/.yZxsbwBkPfG', 'PATIENT', true);

-- Patient profiles with diverse medical histories
INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, city, state, pincode, emergency_contact_name, emergency_contact_phone, medical_history, allergies) VALUES
((SELECT id FROM users WHERE email = 'william.jones@email.com'), 'William', 'Jones', '1970-05-12', 'MALE', 'A+', '+1-555-3001', 'william.jones@email.com', '100 First Avenue', 'Boston', 'MA', '02101', 'Martha Jones', '+1-555-3002', 'Coronary artery disease, Previous MI in 2018, Stent placed', 'None'),
((SELECT id FROM users WHERE email = 'sarah.brown@email.com'), 'Sarah', 'Brown', '1985-08-23', 'FEMALE', 'O-', '+1-555-3003', 'sarah.brown@email.com', '200 Second Street', 'Seattle', 'WA', '98101', 'John Brown', '+1-555-3004', 'Multiple sclerosis diagnosed 2019', 'Latex'),
((SELECT id FROM users WHERE email = 'michael.wilson@email.com'), 'Michael', 'Wilson', '1992-03-14', 'MALE', 'B+', '+1-555-3005', 'michael.wilson@email.com', '300 Third Boulevard', 'Denver', 'CO', '80201', 'Lisa Wilson', '+1-555-3006', 'Type 1 Diabetes since age 12', 'Sulfa'),
((SELECT id FROM users WHERE email = 'elizabeth.moore@email.com'), 'Elizabeth', 'Moore', '1978-11-30', 'FEMALE', 'AB+', '+1-555-3007', 'elizabeth.moore@email.com', '400 Fourth Drive', 'Portland', 'OR', '97201', 'James Moore', '+1-555-3008', 'Rheumatoid arthritis, Hypothyroidism', 'Penicillin'),
((SELECT id FROM users WHERE email = 'david.taylor@email.com'), 'David', 'Taylor', '1965-07-08', 'MALE', 'O+', '+1-555-3009', 'david.taylor@email.com', '500 Fifth Lane', 'Miami', 'FL', '33101', 'Carol Taylor', '+1-555-3010', 'Prostate cancer survivor (2020), BPH', 'Iodine'),
((SELECT id FROM users WHERE email = 'mary.anderson@email.com'), 'Mary', 'Anderson', '1988-02-19', 'FEMALE', 'A-', '+1-555-3011', 'mary.anderson@email.com', '600 Sixth Court', 'Atlanta', 'GA', '30301', 'Robert Anderson', '+1-555-3012', 'Endometriosis, Iron deficiency anemia', 'None'),
((SELECT id FROM users WHERE email = 'richard.thomas@email.com'), 'Richard', 'Thomas', '1955-09-25', 'MALE', 'B-', '+1-555-3013', 'richard.thomas@email.com', '700 Seventh Way', 'Chicago', 'IL', '60601', 'Dorothy Thomas', '+1-555-3014', 'COPD, Former smoker 40 pack-years, Emphysema', 'Aspirin'),
((SELECT id FROM users WHERE email = 'patricia.jackson@email.com'), 'Patricia', 'Jackson', '1972-06-03', 'FEMALE', 'AB-', '+1-555-3015', 'patricia.jackson@email.com', '800 Eighth Place', 'Houston', 'TX', '77001', 'Michael Jackson', '+1-555-3016', 'Breast cancer survivor (2017), Annual mammograms', 'Morphine'),
((SELECT id FROM users WHERE email = 'charles.white@email.com'), 'Charles', 'White', '1960-12-17', 'MALE', 'O-', '+1-555-3017', 'charles.white@email.com', '900 Ninth Road', 'Phoenix', 'AZ', '85001', 'Nancy White', '+1-555-3018', 'Chronic kidney disease stage 3, Hypertension', 'NSAIDs'),
((SELECT id FROM users WHERE email = 'linda.harris@email.com'), 'Linda', 'Harris', '1983-04-28', 'FEMALE', 'A+', '+1-555-3019', 'linda.harris@email.com', '1000 Tenth Street', 'Philadelphia', 'PA', '19101', 'Steven Harris', '+1-555-3020', 'Bipolar disorder, Well controlled on medications', 'Lithium alternatives'),
((SELECT id FROM users WHERE email = 'joseph.martin@email.com'), 'Joseph', 'Martin', '1975-10-11', 'MALE', 'B+', '+1-555-3021', 'joseph.martin@email.com', '1100 Oak Avenue', 'San Francisco', 'CA', '94101', 'Barbara Martin', '+1-555-3022', 'Herniated disc L5-S1, Sciatica', 'Codeine'),
((SELECT id FROM users WHERE email = 'barbara.garcia@email.com'), 'Barbara', 'Garcia', '1990-01-05', 'FEMALE', 'O+', '+1-555-3023', 'barbara.garcia@email.com', '1200 Pine Street', 'San Diego', 'CA', '92101', 'Thomas Garcia', '+1-555-3024', 'Gestational diabetes in 2022, Currently monitoring', 'None'),
((SELECT id FROM users WHERE email = 'thomas.martinez@email.com'), 'Thomas', 'Martinez', '1968-08-20', 'MALE', 'AB+', '+1-555-3025', 'thomas.martinez@email.com', '1300 Maple Drive', 'Dallas', 'TX', '75201', 'Susan Martinez', '+1-555-3026', 'Atrial fibrillation, On anticoagulation', 'Warfarin alternatives'),
((SELECT id FROM users WHERE email = 'susan.robinson@email.com'), 'Susan', 'Robinson', '1982-05-16', 'FEMALE', 'A-', '+1-555-3027', 'susan.robinson@email.com', '1400 Elm Court', 'Austin', 'TX', '78701', 'Mark Robinson', '+1-555-3028', 'Hypothyroidism, Hashimoto thyroiditis', 'Shellfish'),
((SELECT id FROM users WHERE email = 'mark.clark@email.com'), 'Mark', 'Clark', '1958-03-02', 'MALE', 'B-', '+1-555-3029', 'mark.clark@email.com', '1500 Cedar Lane', 'San Jose', 'CA', '95101', 'Dorothy Clark', '+1-555-3030', 'Parkinsons disease early stage, Tremor dominant', 'None'),
((SELECT id FROM users WHERE email = 'dorothy.rodriguez@email.com'), 'Dorothy', 'Rodriguez', '1995-11-28', 'FEMALE', 'O-', '+1-555-3031', 'dorothy.rodriguez@email.com', '1600 Birch Road', 'Jacksonville', 'FL', '32099', 'Edward Rodriguez', '+1-555-3032', 'Severe eczema, Food allergies', 'Peanuts, Tree nuts, Eggs'),
((SELECT id FROM users WHERE email = 'steven.lewis@email.com'), 'Steven', 'Lewis', '1977-07-14', 'MALE', 'A+', '+1-555-3033', 'steven.lewis@email.com', '1700 Walnut Way', 'Indianapolis', 'IN', '46201', 'Margaret Lewis', '+1-555-3034', 'Gout, Hyperuricemia', 'Allopurinol'),
((SELECT id FROM users WHERE email = 'margaret.lee@email.com'), 'Margaret', 'Lee', '1963-09-07', 'FEMALE', 'AB-', '+1-555-3035', 'margaret.lee@email.com', '1800 Cherry Place', 'Columbus', 'OH', '43085', 'Paul Lee', '+1-555-3036', 'Glaucoma both eyes, Cataract surgery 2021', 'Sulfa'),
((SELECT id FROM users WHERE email = 'paul.walker@email.com'), 'Paul', 'Walker', '1986-12-22', 'MALE', 'B+', '+1-555-3037', 'paul.walker@email.com', '1900 Peach Drive', 'Fort Worth', 'TX', '76101', 'Betty Walker', '+1-555-3038', 'Crohns disease, On biologics', 'None'),
((SELECT id FROM users WHERE email = 'betty.hall@email.com'), 'Betty', 'Hall', '1971-04-09', 'FEMALE', 'O+', '+1-555-3039', 'betty.hall@email.com', '2000 Apple Avenue', 'Charlotte', 'NC', '28201', 'George Hall', '+1-555-3040', 'Fibromyalgia, Chronic fatigue syndrome', 'Tramadol'),
((SELECT id FROM users WHERE email = 'george.allen@email.com'), 'George', 'Allen', '1952-06-30', 'MALE', 'A-', '+1-555-3041', 'george.allen@email.com', '2100 Orange Street', 'Detroit', 'MI', '48201', 'Helen Allen', '+1-555-3042', 'Aortic stenosis moderate, CHF NYHA II', 'ACE inhibitors'),
((SELECT id FROM users WHERE email = 'helen.young@email.com'), 'Helen', 'Young', '1980-02-14', 'FEMALE', 'B-', '+1-555-3043', 'helen.young@email.com', '2200 Lemon Lane', 'El Paso', 'TX', '79901', 'Edward Young', '+1-555-3044', 'Lupus SLE, Antiphospholipid syndrome', 'Sulfa'),
((SELECT id FROM users WHERE email = 'edward.hernandez@email.com'), 'Edward', 'Hernandez', '1973-08-18', 'MALE', 'AB+', '+1-555-3045', 'edward.hernandez@email.com', '2300 Grape Court', 'Memphis', 'TN', '38101', 'Sandra Hernandez', '+1-555-3046', 'Sleep apnea severe, On CPAP', 'None'),
((SELECT id FROM users WHERE email = 'sandra.king@email.com'), 'Sandra', 'King', '1967-05-25', 'FEMALE', 'O-', '+1-555-3047', 'sandra.king@email.com', '2400 Berry Road', 'Baltimore', 'MD', '21201', 'Brian King', '+1-555-3048', 'Osteoporosis, Previous hip fracture 2020', 'Bisphosphonates'),
((SELECT id FROM users WHERE email = 'brian.wright@email.com'), 'Brian', 'Wright', '1989-10-03', 'MALE', 'A+', '+1-555-3049', 'brian.wright@email.com', '2500 Melon Place', 'Oklahoma City', 'OK', '73101', 'Donna Wright', '+1-555-3050', 'Ulcerative colitis, In remission', 'Mesalamine'),
((SELECT id FROM users WHERE email = 'donna.lopez@email.com'), 'Donna', 'Lopez', '1984-07-12', 'FEMALE', 'B+', '+1-555-3051', 'donna.lopez@email.com', '2600 Fig Way', 'Louisville', 'KY', '40201', 'Ronald Lopez', '+1-555-3052', 'Interstitial cystitis, Pelvic pain syndrome', 'None'),
((SELECT id FROM users WHERE email = 'ronald.hill@email.com'), 'Ronald', 'Hill', '1956-01-29', 'MALE', 'O+', '+1-555-3053', 'ronald.hill@email.com', '2700 Plum Drive', 'Portland', 'ME', '04101', 'Carol Hill', '+1-555-3054', 'Diabetic neuropathy, CKD stage 2', 'Metformin'),
((SELECT id FROM users WHERE email = 'carol.scott@email.com'), 'Carol', 'Scott', '1979-11-08', 'FEMALE', 'AB-', '+1-555-3055', 'carol.scott@email.com', '2800 Date Avenue', 'Las Vegas', 'NV', '89101', 'Kevin Scott', '+1-555-3056', 'Migraine with aura, Vertigo', 'Triptans'),
((SELECT id FROM users WHERE email = 'kevin.green@email.com'), 'Kevin', 'Green', '1993-03-21', 'MALE', 'A-', '+1-555-3057', 'kevin.green@email.com', '2900 Kiwi Street', 'Milwaukee', 'WI', '53201', 'Sharon Green', '+1-555-3058', 'Anxiety disorder, Depression', 'SSRIs'),
((SELECT id FROM users WHERE email = 'sharon.adams@email.com'), 'Sharon', 'Adams', '1962-09-15', 'FEMALE', 'B-', '+1-555-3059', 'sharon.adams@email.com', '3000 Mango Lane', 'Albuquerque', 'NM', '87101', 'Jason Adams', '+1-555-3060', 'Chronic sinusitis, Nasal polyps', 'Aspirin'),
((SELECT id FROM users WHERE email = 'jason.baker@email.com'), 'Jason', 'Baker', '1981-06-04', 'MALE', 'O-', '+1-555-3061', 'jason.baker@email.com', '3100 Papaya Road', 'Tucson', 'AZ', '85701', 'Kathleen Baker', '+1-555-3062', 'Testicular cancer survivor (2019), Surveillance', 'None'),
((SELECT id FROM users WHERE email = 'kathleen.gonzalez@email.com'), 'Kathleen', 'Gonzalez', '1976-12-27', 'FEMALE', 'A+', '+1-555-3063', 'kathleen.gonzalez@email.com', '3200 Guava Court', 'Fresno', 'CA', '93701', 'Frank Gonzalez', '+1-555-3064', 'Celiac disease, Vitamin B12 deficiency', 'Gluten'),
((SELECT id FROM users WHERE email = 'frank.nelson@email.com'), 'Frank', 'Nelson', '1969-04-16', 'MALE', 'AB+', '+1-555-3065', 'frank.nelson@email.com', '3300 Coconut Way', 'Sacramento', 'CA', '95814', 'Nancy Nelson', '+1-555-3066', 'Peripheral artery disease, Claudication', 'None'),
((SELECT id FROM users WHERE email = 'nancy.carter@email.com'), 'Nancy', 'Carter', '1987-08-09', 'FEMALE', 'B+', '+1-555-3067', 'nancy.carter@email.com', '3400 Banana Place', 'Kansas City', 'MO', '64101', 'Raymond Carter', '+1-555-3068', 'Polycystic kidney disease, Monitored annually', 'Contrast dye'),
((SELECT id FROM users WHERE email = 'raymond.mitchell@email.com'), 'Raymond', 'Mitchell', '1954-02-23', 'MALE', 'O+', '+1-555-3069', 'raymond.mitchell@email.com', '3500 Avocado Drive', 'Mesa', 'AZ', '85201', 'Janet Mitchell', '+1-555-3070', 'Benign prostatic hyperplasia, Urinary retention', 'Alpha blockers'),
((SELECT id FROM users WHERE email = 'janet.perez@email.com'), 'Janet', 'Perez', '1991-05-31', 'FEMALE', 'A-', '+1-555-3071', 'janet.perez@email.com', '3600 Olive Avenue', 'Virginia Beach', 'VA', '23451', 'Henry Perez', '+1-555-3072', 'PCOS, Infertility treatment', 'None'),
((SELECT id FROM users WHERE email = 'henry.roberts@email.com'), 'Henry', 'Roberts', '1966-10-14', 'MALE', 'B-', '+1-555-3073', 'henry.roberts@email.com', '3700 Almond Street', 'Atlanta', 'GA', '30301', 'Catherine Roberts', '+1-555-3074', 'Hepatitis C cured 2021, Liver monitoring', 'Ribavirin'),
((SELECT id FROM users WHERE email = 'catherine.turner@email.com'), 'Catherine', 'Turner', '1974-07-07', 'FEMALE', 'AB-', '+1-555-3075', 'catherine.turner@email.com', '3800 Cashew Lane', 'Colorado Springs', 'CO', '80901', 'Dennis Turner', '+1-555-3076', 'Sjogrens syndrome, Dry eyes and mouth', 'None'),
((SELECT id FROM users WHERE email = 'dennis.phillips@email.com'), 'Dennis', 'Phillips', '1959-01-19', 'MALE', 'O-', '+1-555-3077', 'dennis.phillips@email.com', '3900 Pistachio Road', 'Omaha', 'NE', '68101', 'Samantha Phillips', '+1-555-3078', 'Bladder cancer stage 1, BCG therapy completed', 'BCG'),
((SELECT id FROM users WHERE email = 'samantha.campbell@email.com'), 'Samantha', 'Campbell', '1996-11-02', 'FEMALE', 'A+', '+1-555-3079', 'samantha.campbell@email.com', '4000 Hazelnut Court', 'Raleigh', 'NC', '27601', 'Jason Campbell', '+1-555-3080', 'Asthma moderate persistent, Exercise induced', 'Aspirin');

-- ============================================
-- MORE NURSES AND RECEPTIONISTS
-- ============================================
INSERT INTO users (username, email, password, role, is_active) VALUES
('nurse.jessica', 'jessica.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.david', 'david.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.emily', 'emily.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('nurse.michael', 'michael.nurse@caresync.com', '$2b$10$xYKBuFsYi.FaGWsHi/YymebM/53Qp5xiVub0qmbirDMD/6jD8kO/u', 'NURSE', true),
('receptionist.sarah', 'sarah.reception@caresync.com', '$2b$10$TVdFMATTlqeVs2s6kZMLbuUVNFS4wYjfzwqq5L8BFoq8jSrb/QuIS', 'RECEPTIONIST', true),
('receptionist.james', 'james.reception@caresync.com', '$2b$10$TVdFMATTlqeVs2s6kZMLbuUVNFS4wYjfzwqq5L8BFoq8jSrb/QuIS', 'RECEPTIONIST', true);
-- ============================================
-- CareSync - Large Scale Appointments Data
-- 200+ appointments across different dates
-- ============================================

-- ============================================
-- PAST APPOINTMENTS (Last 60 days) - COMPLETED
-- ============================================

-- 60 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(1, 1, CURRENT_DATE - INTERVAL '60 days', '09:00', '09:30', 'COMPLETED', 'Cardiac evaluation', 'Chest tightness', 'Stable angina', 'Continue medications'),
(2, 4, CURRENT_DATE - INTERVAL '60 days', '10:00', '10:20', 'COMPLETED', 'Routine checkup', 'None', 'Healthy', 'Annual vaccination done'),
(16, 5, CURRENT_DATE - INTERVAL '60 days', '11:00', '11:20', 'COMPLETED', 'General consultation', 'Fatigue, weakness', 'Iron deficiency anemia', 'Iron supplements prescribed'),
(17, 2, CURRENT_DATE - INTERVAL '60 days', '14:00', '14:30', 'COMPLETED', 'Headache evaluation', 'Chronic headaches', 'Tension headache', 'Stress management advised');

-- 55 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(3, 3, CURRENT_DATE - INTERVAL '55 days', '09:00', '09:30', 'COMPLETED', 'Knee pain', 'Pain climbing stairs', 'Osteoarthritis knee', 'Physical therapy ordered'),
(18, 6, CURRENT_DATE - INTERVAL '55 days', '10:00', '10:30', 'COMPLETED', 'Skin rash', 'Itchy red patches', 'Contact dermatitis', 'Topical steroids prescribed'),
(19, 7, CURRENT_DATE - INTERVAL '55 days', '11:00', '11:30', 'COMPLETED', 'Irregular periods', 'Heavy bleeding', 'Menorrhagia', 'Ultrasound ordered'),
(20, 8, CURRENT_DATE - INTERVAL '55 days', '14:00', '14:30', 'COMPLETED', 'Vision problems', 'Blurry vision', 'Presbyopia', 'Reading glasses prescribed');

-- 50 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(4, 5, CURRENT_DATE - INTERVAL '50 days', '09:00', '09:20', 'COMPLETED', 'Follow-up visit', 'Improved energy', 'Anemia improving', 'Continue supplements'),
(21, 1, CURRENT_DATE - INTERVAL '50 days', '10:00', '10:30', 'COMPLETED', 'Heart palpitations', 'Racing heart', 'Sinus tachycardia', 'Holter monitor ordered'),
(22, 9, CURRENT_DATE - INTERVAL '50 days', '11:00', '11:30', 'COMPLETED', 'Chest injury', 'Trauma after fall', 'Rib contusion', 'Pain management, rest'),
(5, 12, CURRENT_DATE - INTERVAL '50 days', '14:00', '14:30', 'COMPLETED', 'Urinary issues', 'Frequent urination', 'BPH', 'Alpha blocker started');

-- 45 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(6, 2, CURRENT_DATE - INTERVAL '45 days', '09:00', '09:30', 'COMPLETED', 'Numbness in hands', 'Tingling fingers', 'Carpal tunnel syndrome', 'Nerve conduction study ordered'),
(23, 11, CURRENT_DATE - INTERVAL '45 days', '10:00', '10:45', 'COMPLETED', 'Anxiety attacks', 'Panic, sweating', 'Panic disorder', 'CBT referral, medication started'),
(24, 3, CURRENT_DATE - INTERVAL '45 days', '11:00', '11:30', 'COMPLETED', 'Hip pain', 'Difficulty walking', 'Hip osteoarthritis', 'Consider hip replacement'),
(7, 5, CURRENT_DATE - INTERVAL '45 days', '14:00', '14:20', 'COMPLETED', 'COPD follow-up', 'Shortness of breath', 'COPD exacerbation', 'Inhaler adjusted');

-- 40 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(8, 7, CURRENT_DATE - INTERVAL '40 days', '09:00', '09:30', 'COMPLETED', 'Annual gynecology exam', 'None', 'Normal exam', 'Pap smear collected'),
(25, 4, CURRENT_DATE - INTERVAL '40 days', '10:00', '10:20', 'COMPLETED', 'Child ear pain', 'Fever, ear tugging', 'Acute otitis media', 'Antibiotics prescribed'),
(26, 6, CURRENT_DATE - INTERVAL '40 days', '11:00', '11:30', 'COMPLETED', 'Acne treatment', 'Severe acne', 'Acne vulgaris', 'Isotretinoin considered'),
(9, 1, CURRENT_DATE - INTERVAL '40 days', '14:00', '14:30', 'COMPLETED', 'Gout management', 'Toe pain reduced', 'Gout controlled', 'Continue febuxostat');

-- 35 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(10, 7, CURRENT_DATE - INTERVAL '35 days', '09:00', '09:30', 'COMPLETED', 'PCOS review', 'Weight gain', 'PCOS with insulin resistance', 'Metformin dose increased'),
(27, 10, CURRENT_DATE - INTERVAL '35 days', '10:00', '10:30', 'COMPLETED', 'Chest X-ray review', 'Cough', 'Bronchitis', 'Antibiotics if no improvement'),
(28, 8, CURRENT_DATE - INTERVAL '35 days', '11:00', '11:30', 'COMPLETED', 'Eye pressure check', 'Eye discomfort', 'Elevated IOP', 'Glaucoma drops started'),
(11, 3, CURRENT_DATE - INTERVAL '35 days', '14:00', '14:30', 'COMPLETED', 'Back pain follow-up', 'Persistent pain', 'Chronic low back pain', 'MRI ordered');

-- 30 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(12, 5, CURRENT_DATE - INTERVAL '30 days', '09:00', '09:20', 'COMPLETED', 'Diabetes screening', 'Thirst, urination', 'Prediabetes', 'Lifestyle modifications'),
(29, 11, CURRENT_DATE - INTERVAL '30 days', '10:00', '10:45', 'COMPLETED', 'Depression evaluation', 'Sadness, hopelessness', 'Major depressive disorder', 'SSRI started'),
(30, 2, CURRENT_DATE - INTERVAL '30 days', '11:00', '11:30', 'COMPLETED', 'Tremor evaluation', 'Hand shaking', 'Essential tremor', 'Beta blocker trial'),
(13, 1, CURRENT_DATE - INTERVAL '30 days', '14:00', '14:30', 'COMPLETED', 'AFib follow-up', 'Palpitations', 'AFib rate controlled', 'Continue anticoagulation');

-- 25 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(14, 5, CURRENT_DATE - INTERVAL '25 days', '09:00', '09:20', 'COMPLETED', 'Thyroid check', 'Weight changes', 'Hypothyroidism stable', 'Continue levothyroxine'),
(31, 12, CURRENT_DATE - INTERVAL '25 days', '10:00', '10:30', 'COMPLETED', 'Kidney stone follow-up', 'No pain', 'Stone passed', 'Increase fluid intake'),
(32, 6, CURRENT_DATE - INTERVAL '25 days', '11:00', '11:30', 'COMPLETED', 'Psoriasis treatment', 'Scaly patches', 'Psoriasis mild', 'Topical treatment'),
(15, 1, CURRENT_DATE - INTERVAL '25 days', '14:00', '14:30', 'COMPLETED', 'AFib management', 'Stable', 'AFib well controlled', 'Cardiology follow-up 3 months');

-- 20 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(33, 4, CURRENT_DATE - INTERVAL '20 days', '09:00', '09:20', 'COMPLETED', 'Childhood asthma', 'Wheezing', 'Asthma moderate', 'Inhaler technique reviewed'),
(34, 9, CURRENT_DATE - INTERVAL '20 days', '10:00', '10:30', 'COMPLETED', 'Ankle sprain', 'Swelling, pain', 'Grade 2 sprain', 'RICE protocol, PT referral'),
(35, 7, CURRENT_DATE - INTERVAL '20 days', '11:00', '11:30', 'COMPLETED', 'Menopause symptoms', 'Hot flashes', 'Perimenopause', 'HRT discussed'),
(36, 5, CURRENT_DATE - INTERVAL '20 days', '14:00', '14:20', 'COMPLETED', 'Annual physical', 'None', 'Healthy adult', 'Labs ordered');

-- 15 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(37, 3, CURRENT_DATE - INTERVAL '15 days', '09:00', '09:30', 'COMPLETED', 'Shoulder pain', 'Cannot raise arm', 'Rotator cuff tear', 'Orthopedic surgery consult'),
(38, 11, CURRENT_DATE - INTERVAL '15 days', '10:00', '10:45', 'COMPLETED', 'Insomnia', 'Cannot sleep', 'Primary insomnia', 'Sleep hygiene, short-term medication'),
(39, 8, CURRENT_DATE - INTERVAL '15 days', '11:00', '11:30', 'COMPLETED', 'Cataract evaluation', 'Cloudy vision', 'Bilateral cataracts', 'Surgery scheduled'),
(40, 2, CURRENT_DATE - INTERVAL '15 days', '14:00', '14:30', 'COMPLETED', 'Seizure follow-up', 'No seizures', 'Epilepsy controlled', 'Continue current meds');

-- 10 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(41, 5, CURRENT_DATE - INTERVAL '10 days', '09:00', '09:20', 'COMPLETED', 'Blood pressure check', 'Headache', 'Hypertension stage 1', 'Lifestyle changes first'),
(42, 6, CURRENT_DATE - INTERVAL '10 days', '10:00', '10:30', 'COMPLETED', 'Mole check', 'Changed mole', 'Dysplastic nevus', 'Biopsy performed'),
(43, 1, CURRENT_DATE - INTERVAL '10 days', '11:00', '11:30', 'COMPLETED', 'Heart failure review', 'Leg swelling', 'CHF decompensation', 'Diuretic increased'),
(44, 4, CURRENT_DATE - INTERVAL '10 days', '14:00', '14:20', 'COMPLETED', 'Growth check', 'Short stature', 'Constitutional delay', 'Monitor growth');

-- 5 days ago
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms, diagnosis, notes) VALUES
(45, 12, CURRENT_DATE - INTERVAL '5 days', '09:00', '09:30', 'COMPLETED', 'PSA follow-up', 'No symptoms', 'BPH stable', 'Continue medications'),
(46, 7, CURRENT_DATE - INTERVAL '5 days', '10:00', '10:30', 'COMPLETED', 'Prenatal visit', 'Morning sickness', 'Normal pregnancy 12 weeks', 'First trimester screening done'),
(47, 3, CURRENT_DATE - INTERVAL '5 days', '11:00', '11:30', 'COMPLETED', 'Post-surgery follow-up', 'Healing well', 'Post knee replacement', 'Continue PT'),
(48, 5, CURRENT_DATE - INTERVAL '5 days', '14:00', '14:20', 'COMPLETED', 'Diabetes management', 'Good control', 'Type 2 DM controlled', 'A1C improved to 6.8');

-- 3 days ago - some cancelled/no-show
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, notes) VALUES
(49, 11, CURRENT_DATE - INTERVAL '3 days', '10:00', '10:45', 'CANCELLED', 'Therapy session', 'Patient rescheduled'),
(50, 9, CURRENT_DATE - INTERVAL '3 days', '14:00', '14:30', 'NO_SHOW', 'Injury follow-up', 'Patient did not show, called to reschedule'),
(51, 2, CURRENT_DATE - INTERVAL '3 days', '15:00', '15:30', 'COMPLETED', 'Migraine review', 'Medication working well'),
(52, 6, CURRENT_DATE - INTERVAL '3 days', '16:00', '16:30', 'COMPLETED', 'Skin allergy', 'Rash resolved');

-- ============================================
-- TODAY'S APPOINTMENTS (15 appointments)
-- ============================================
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(1, 1, CURRENT_DATE, '08:30', '09:00', 'SCHEDULED', 'Cardiac stress test review', 'None, follow-up'),
(16, 5, CURRENT_DATE, '09:00', '09:20', 'SCHEDULED', 'Lab results review', 'Fatigue'),
(3, 3, CURRENT_DATE, '09:30', '10:00', 'SCHEDULED', 'Physical therapy progress', 'Knee stiffness'),
(17, 2, CURRENT_DATE, '10:00', '10:30', 'SCHEDULED', 'Neurology follow-up', 'Occasional headaches'),
(20, 8, CURRENT_DATE, '10:00', '10:30', 'SCHEDULED', 'Vision check', 'Eye strain'),
(21, 1, CURRENT_DATE, '10:30', '11:00', 'SCHEDULED', 'Holter monitor results', 'Palpitations resolved'),
(22, 9, CURRENT_DATE, '11:00', '11:30', 'SCHEDULED', 'Follow-up after injury', 'Healing well'),
(25, 4, CURRENT_DATE, '11:00', '11:20', 'SCHEDULED', 'Ear infection follow-up', 'Ear pain gone'),
(29, 11, CURRENT_DATE, '11:00', '11:45', 'SCHEDULED', 'Depression follow-up', 'Mood improved'),
(33, 4, CURRENT_DATE, '14:00', '14:20', 'SCHEDULED', 'Asthma review', 'Better breathing'),
(35, 7, CURRENT_DATE, '14:00', '14:30', 'SCHEDULED', 'HRT follow-up', 'Hot flashes reduced'),
(40, 2, CURRENT_DATE, '14:30', '15:00', 'SCHEDULED', 'Epilepsy management', 'Seizure free'),
(43, 1, CURRENT_DATE, '15:00', '15:30', 'SCHEDULED', 'Heart failure check', 'Swelling reduced'),
(46, 7, CURRENT_DATE, '15:00', '15:30', 'SCHEDULED', 'Prenatal visit 16 weeks', 'Feeling baby move'),
(48, 5, CURRENT_DATE, '16:00', '16:20', 'SCHEDULED', 'Diabetes follow-up', 'Stable');

-- ============================================
-- FUTURE APPOINTMENTS (Next 30 days)
-- ============================================

-- Tomorrow
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(2, 4, CURRENT_DATE + INTERVAL '1 day', '09:00', '09:20', 'SCHEDULED', 'Child vaccination', 'None'),
(5, 12, CURRENT_DATE + INTERVAL '1 day', '10:00', '10:30', 'SCHEDULED', 'Urology follow-up', 'Improved urination'),
(7, 5, CURRENT_DATE + INTERVAL '1 day', '11:00', '11:20', 'SCHEDULED', 'COPD review', 'Breathing better'),
(10, 7, CURRENT_DATE + INTERVAL '1 day', '14:00', '14:30', 'SCHEDULED', 'PCOS management', 'Weight stable');

-- Day after tomorrow
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(12, 5, CURRENT_DATE + INTERVAL '2 days', '09:00', '09:20', 'SCHEDULED', 'Prediabetes follow-up', 'Diet changes made'),
(14, 5, CURRENT_DATE + INTERVAL '2 days', '10:00', '10:20', 'SCHEDULED', 'Thyroid recheck', 'Energy improved'),
(23, 11, CURRENT_DATE + INTERVAL '2 days', '11:00', '11:45', 'SCHEDULED', 'Anxiety therapy', 'Less panic attacks'),
(27, 10, CURRENT_DATE + INTERVAL '2 days', '14:00', '14:30', 'SCHEDULED', 'CT scan review', 'Cough resolved');

-- 3 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(30, 2, CURRENT_DATE + INTERVAL '3 days', '09:00', '09:30', 'SCHEDULED', 'Tremor evaluation', 'Beta blocker helping'),
(31, 12, CURRENT_DATE + INTERVAL '3 days', '10:00', '10:30', 'SCHEDULED', 'Annual urology check', 'No issues'),
(34, 3, CURRENT_DATE + INTERVAL '3 days', '11:00', '11:30', 'SCHEDULED', 'Ankle rehabilitation', 'Swelling down'),
(38, 11, CURRENT_DATE + INTERVAL '3 days', '14:00', '14:45', 'SCHEDULED', 'Sleep therapy', 'Sleeping better');

-- 5 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(4, 5, CURRENT_DATE + INTERVAL '5 days', '09:00', '09:20', 'SCHEDULED', 'Iron levels recheck', 'Energy increased'),
(6, 2, CURRENT_DATE + INTERVAL '5 days', '10:00', '10:30', 'SCHEDULED', 'Carpal tunnel follow-up', 'Numbness reduced'),
(8, 7, CURRENT_DATE + INTERVAL '5 days', '11:00', '11:30', 'SCHEDULED', 'Pap smear results', 'None'),
(9, 1, CURRENT_DATE + INTERVAL '5 days', '14:00', '14:30', 'SCHEDULED', 'Gout prevention', 'No flares');

-- 7 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(11, 3, CURRENT_DATE + INTERVAL '7 days', '09:00', '09:30', 'SCHEDULED', 'MRI results review', 'Back pain persists'),
(13, 1, CURRENT_DATE + INTERVAL '7 days', '10:00', '10:30', 'SCHEDULED', 'AFib monitoring', 'Feeling well'),
(15, 1, CURRENT_DATE + INTERVAL '7 days', '11:00', '11:30', 'SCHEDULED', 'Cardiology annual', 'Stable'),
(18, 6, CURRENT_DATE + INTERVAL '7 days', '14:00', '14:30', 'SCHEDULED', 'Eczema follow-up', 'Skin improved');

-- 10 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(19, 7, CURRENT_DATE + INTERVAL '10 days', '09:00', '09:30', 'SCHEDULED', 'Ultrasound review', 'Bleeding stopped'),
(24, 3, CURRENT_DATE + INTERVAL '10 days', '10:00', '10:30', 'SCHEDULED', 'Hip replacement consult', 'Pain increasing'),
(26, 6, CURRENT_DATE + INTERVAL '10 days', '11:00', '11:30', 'SCHEDULED', 'Acne treatment review', 'Skin clearing'),
(28, 8, CURRENT_DATE + INTERVAL '10 days', '14:00', '14:30', 'SCHEDULED', 'Glaucoma check', 'Eye pressure down');

-- 14 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(32, 6, CURRENT_DATE + INTERVAL '14 days', '09:00', '09:30', 'SCHEDULED', 'Psoriasis management', 'New patches'),
(36, 5, CURRENT_DATE + INTERVAL '14 days', '10:00', '10:20', 'SCHEDULED', 'Lab results review', 'Cholesterol check'),
(37, 3, CURRENT_DATE + INTERVAL '14 days', '11:00', '11:30', 'SCHEDULED', 'Surgery pre-op', 'Shoulder repair'),
(39, 8, CURRENT_DATE + INTERVAL '14 days', '14:00', '14:30', 'SCHEDULED', 'Cataract surgery pre-op', 'Vision declining');

-- 21 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(41, 5, CURRENT_DATE + INTERVAL '21 days', '09:00', '09:20', 'SCHEDULED', 'BP follow-up', 'Lifestyle changes'),
(42, 6, CURRENT_DATE + INTERVAL '21 days', '10:00', '10:30', 'SCHEDULED', 'Biopsy results', 'Anxious'),
(44, 4, CURRENT_DATE + INTERVAL '21 days', '11:00', '11:20', 'SCHEDULED', 'Growth monitoring', 'Doing well'),
(45, 12, CURRENT_DATE + INTERVAL '21 days', '14:00', '14:30', 'SCHEDULED', 'PSA recheck', 'Annual monitoring');

-- 28 days from now
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, end_time, status, reason, symptoms) VALUES
(47, 3, CURRENT_DATE + INTERVAL '28 days', '09:00', '09:30', 'SCHEDULED', 'Post-surgery 6 weeks', 'Walking better'),
(49, 11, CURRENT_DATE + INTERVAL '28 days', '10:00', '10:45', 'SCHEDULED', 'Therapy continuation', 'Good progress'),
(50, 9, CURRENT_DATE + INTERVAL '28 days', '11:00', '11:30', 'SCHEDULED', 'Injury assessment', 'Rescheduled'),
(51, 2, CURRENT_DATE + INTERVAL '28 days', '14:00', '14:30', 'SCHEDULED', 'Migraine prevention', 'Working well');
-- ============================================
-- CareSync - Large Scale Prescriptions & Bills
-- 100+ prescriptions, 150+ bills
-- ============================================

-- ============================================
-- PRESCRIPTIONS (for completed appointments)
-- Link prescriptions to their corresponding appointments using subqueries
-- ============================================

-- Cardiology prescriptions (linked to completed appointments)
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 1, 1, 'Stable Angina Pectoris', 'Continue current regimen. Stress test shows improvement.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 1 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 21, 1, 'Sinus Tachycardia', 'Holter showed occasional PVCs. Benign. Reduce caffeine.', CURRENT_DATE + INTERVAL '60 days'
FROM appointments a WHERE a.patient_id = 21 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 43, 1, 'Congestive Heart Failure NYHA II', 'Diuretic dose increased. Salt restriction emphasized.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 43 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 13, 1, 'Atrial Fibrillation - Rate Controlled', 'INR stable at 2.5. Continue warfarin.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 13 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 15, 1, 'Atrial Fibrillation with RVR history', 'Now well controlled on metoprolol.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 15 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

-- Neurology prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 17, 2, 'Chronic Tension Headache', 'Stress management recommended. Trial of preventive medication.', CURRENT_DATE + INTERVAL '45 days'
FROM appointments a WHERE a.patient_id = 17 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 6, 2, 'Carpal Tunnel Syndrome bilateral', 'EMG confirms moderate CTS. Night splints prescribed.', CURRENT_DATE + INTERVAL '60 days'
FROM appointments a WHERE a.patient_id = 6 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 30, 2, 'Essential Tremor', 'Good response to propranolol. Continue current dose.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 30 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 40, 2, 'Epilepsy - Generalized', 'Seizure free 2 years. Continue current medications.', CURRENT_DATE + INTERVAL '180 days'
FROM appointments a WHERE a.patient_id = 40 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 51, 2, 'Migraine with Aura', 'Topiramate helping. Avoid known triggers.', CURRENT_DATE + INTERVAL '60 days'
FROM appointments a WHERE a.patient_id = 51 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

-- Orthopedics prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 3, 3, 'Knee Osteoarthritis bilateral', 'Physical therapy 3x/week. Consider injections if no improvement.', CURRENT_DATE + INTERVAL '45 days'
FROM appointments a WHERE a.patient_id = 3 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 24, 3, 'Hip Osteoarthritis severe', 'Total hip replacement discussed. Patient considering options.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 24 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 11, 3, 'Lumbar Disc Herniation L4-L5', 'MRI confirms herniation. Conservative management trial.', CURRENT_DATE + INTERVAL '45 days'
FROM appointments a WHERE a.patient_id = 11 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 37, 3, 'Rotator Cuff Tear complete', 'Surgery scheduled. Pre-op clearance obtained.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 37 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 47, 3, 'S/P Total Knee Replacement', 'Excellent progress. Continue PT, full weight bearing.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 47 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 34, 9, 'Grade 2 Ankle Sprain', 'RICE protocol. Gradual return to activity in 4 weeks.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 34 AND a.doctor_id = 9 AND a.status = 'COMPLETED' LIMIT 1;

-- Pediatrics prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 2, 4, 'Well Child Visit - 5 years', 'All vaccinations up to date. Normal development.', CURRENT_DATE + INTERVAL '365 days'
FROM appointments a WHERE a.patient_id = 2 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 25, 4, 'Acute Otitis Media right ear', 'Amoxicillin x 10 days. Pain relief with acetaminophen.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 25 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 33, 4, 'Moderate Persistent Asthma', 'Flovent increased. Albuterol rescue PRN. Peak flow monitoring.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 33 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 44, 4, 'Constitutional Growth Delay', 'Normal variant. Continue to monitor. Reassurance given.', CURRENT_DATE + INTERVAL '180 days'
FROM appointments a WHERE a.patient_id = 44 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

-- General Medicine prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 16, 5, 'Iron Deficiency Anemia', 'Ferrous sulfate 325mg daily. Recheck CBC in 6 weeks.', CURRENT_DATE + INTERVAL '45 days'
FROM appointments a WHERE a.patient_id = 16 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 4, 5, 'Iron Deficiency Anemia - Improving', 'Hemoglobin improved from 9.5 to 11.2. Continue supplements.', CURRENT_DATE + INTERVAL '60 days'
FROM appointments a WHERE a.patient_id = 4 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 7, 5, 'COPD Gold Stage 2', 'Inhaler technique reviewed. Pulmonary rehab referral.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 7 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 12, 5, 'Prediabetes', 'A1C 5.9%. Lifestyle modifications - diet, exercise. Metformin if no improvement.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 12 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 14, 5, 'Hypothyroidism - Stable', 'TSH 2.1, within goal. Continue current levothyroxine dose.', CURRENT_DATE + INTERVAL '180 days'
FROM appointments a WHERE a.patient_id = 14 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 36, 5, 'Hyperlipidemia', 'LDL 145. Start atorvastatin 10mg. Diet counseling.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 36 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 41, 5, 'Essential Hypertension Stage 1', 'BP 145/92. 3 months lifestyle trial before medication.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 41 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 48, 5, 'Type 2 Diabetes Mellitus - Well Controlled', 'A1C 6.8% (goal <7%). Continue metformin.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 48 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

-- Dermatology prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 18, 6, 'Allergic Contact Dermatitis', 'Avoid nickel jewelry. Triamcinolone cream BID x 2 weeks.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 18 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 26, 6, 'Acne Vulgaris - Severe', 'Failed topicals. Starting isotretinoin after counseling.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 26 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 32, 6, 'Plaque Psoriasis - Mild', 'Clobetasol for plaques. Moisturize liberally.', CURRENT_DATE + INTERVAL '60 days'
FROM appointments a WHERE a.patient_id = 32 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 42, 6, 'Dysplastic Nevus', 'Biopsy results pending. F/U for pathology results.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 42 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 52, 6, 'Urticaria - Chronic', 'Antihistamine trial. H2 blocker added.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 52 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

-- Gynecology prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 8, 7, 'Routine Gynecologic Exam', 'Pap smear and mammogram done. Results pending.', CURRENT_DATE + INTERVAL '365 days'
FROM appointments a WHERE a.patient_id = 8 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 10, 7, 'Polycystic Ovary Syndrome with IR', 'Metformin increased to 1000mg BID. Weight loss encouraged.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 10 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 19, 7, 'Menorrhagia', 'Ultrasound shows fibroids. Hormonal management trial.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 19 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 35, 7, 'Perimenopause with vasomotor symptoms', 'Low dose HRT started. Follow-up for symptom assessment.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 35 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 46, 7, 'Pregnancy 16 weeks - Normal', 'Anatomy scan scheduled. First trimester screen low risk.', CURRENT_DATE + INTERVAL '28 days'
FROM appointments a WHERE a.patient_id = 46 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

-- Ophthalmology prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 20, 8, 'Presbyopia', 'Reading glasses +2.00 prescribed.', CURRENT_DATE + INTERVAL '365 days'
FROM appointments a WHERE a.patient_id = 20 AND a.doctor_id = 8 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 28, 8, 'Primary Open Angle Glaucoma', 'Latanoprost 0.005% QHS initiated. Target IOP <16.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 28 AND a.doctor_id = 8 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 39, 8, 'Age-related Cataract bilateral', 'Surgery scheduled. Right eye first. Pre-op testing done.', CURRENT_DATE + INTERVAL '7 days'
FROM appointments a WHERE a.patient_id = 39 AND a.doctor_id = 8 AND a.status = 'COMPLETED' LIMIT 1;

-- Emergency Medicine prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 22, 9, 'Rib Contusion after fall', 'Pain management with acetaminophen. Avoid NSAIDs. Follow up with PCP.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 22 AND a.doctor_id = 9 AND a.status = 'COMPLETED' LIMIT 1;

-- Radiology prescriptions (reports)
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 27, 10, 'Acute Bronchitis', 'Chest X-ray clear. Supportive care. Antibiotics not indicated.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 27 AND a.doctor_id = 10 AND a.status = 'COMPLETED' LIMIT 1;

-- Psychiatry prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 23, 11, 'Panic Disorder with Agoraphobia', 'Sertraline 50mg started. CBT referral made. Crisis plan reviewed.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 23 AND a.doctor_id = 11 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 29, 11, 'Major Depressive Disorder - Moderate', 'Escitalopram 10mg started. Suicide screening negative. Safety plan.', CURRENT_DATE + INTERVAL '14 days'
FROM appointments a WHERE a.patient_id = 29 AND a.doctor_id = 11 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 38, 11, 'Primary Insomnia', 'Sleep hygiene education. Short-term zolpidem. No driving after taking.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 38 AND a.doctor_id = 11 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (patient_id, doctor_id, diagnosis, notes, follow_up_date) VALUES
(49, 11, 'Generalized Anxiety Disorder', 'Buspirone titrating. Therapy sessions weekly.', CURRENT_DATE + INTERVAL '14 days');

-- Urology prescriptions
INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 5, 12, 'Benign Prostatic Hyperplasia', 'Tamsulosin 0.4mg QHS. Avoid alpha-blockers with sildenafil.', CURRENT_DATE + INTERVAL '90 days'
FROM appointments a WHERE a.patient_id = 5 AND a.doctor_id = 12 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 31, 12, 'Nephrolithiasis - Resolved', 'Stone passed. 24-hour urine ordered to prevent recurrence.', CURRENT_DATE + INTERVAL '30 days'
FROM appointments a WHERE a.patient_id = 31 AND a.doctor_id = 12 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, diagnosis, notes, follow_up_date) 
SELECT a.id, 45, 12, 'BPH with elevated PSA', 'PSA stable at 4.2. Continue surveillance. Repeat in 6 months.', CURRENT_DATE + INTERVAL '180 days'
FROM appointments a WHERE a.patient_id = 45 AND a.doctor_id = 12 AND a.status = 'COMPLETED' LIMIT 1;

-- ============================================
-- PRESCRIPTION ITEMS (medicines)
-- ============================================

-- Get prescription IDs and add medicines
-- Cardiology medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Aspirin', '81mg', 'Once daily', '90 days', 90, 'Take with food' FROM prescriptions WHERE diagnosis LIKE '%Angina%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Atorvastatin', '40mg', 'Once daily at bedtime', '90 days', 90, 'For cholesterol control' FROM prescriptions WHERE diagnosis LIKE '%Angina%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Metoprolol', '50mg', 'Twice daily', '90 days', 180, 'For heart rate control' FROM prescriptions WHERE diagnosis LIKE '%Angina%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Nitroglycerin SL', '0.4mg', 'As needed', '90 days', 25, 'Under tongue for chest pain' FROM prescriptions WHERE diagnosis LIKE '%Angina%' LIMIT 1;

-- CHF medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Furosemide', '40mg', 'Twice daily', '30 days', 60, 'Take in morning and afternoon' FROM prescriptions WHERE diagnosis LIKE '%Heart Failure%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Lisinopril', '10mg', 'Once daily', '30 days', 30, 'Monitor for cough' FROM prescriptions WHERE diagnosis LIKE '%Heart Failure%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Carvedilol', '12.5mg', 'Twice daily', '30 days', 60, 'Take with food' FROM prescriptions WHERE diagnosis LIKE '%Heart Failure%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Spironolactone', '25mg', 'Once daily', '30 days', 30, 'Monitor potassium levels' FROM prescriptions WHERE diagnosis LIKE '%Heart Failure%' LIMIT 1;

-- AFib medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Warfarin', '5mg', 'Once daily', '30 days', 30, 'Take same time each day. Monitor INR.' FROM prescriptions WHERE diagnosis LIKE '%Atrial Fibrillation%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Metoprolol Succinate', '100mg', 'Once daily', '30 days', 30, 'Extended release. Do not crush.' FROM prescriptions WHERE diagnosis LIKE '%Atrial Fibrillation%' LIMIT 1;

-- Neurology medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Amitriptyline', '25mg', 'At bedtime', '45 days', 45, 'For headache prevention' FROM prescriptions WHERE diagnosis LIKE '%Tension Headache%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Propranolol', '40mg', 'Twice daily', '90 days', 180, 'For tremor control' FROM prescriptions WHERE diagnosis LIKE '%Essential Tremor%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Levetiracetam', '500mg', 'Twice daily', '180 days', 360, 'Anti-seizure medication' FROM prescriptions WHERE diagnosis LIKE '%Epilepsy%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Topiramate', '50mg', 'Twice daily', '60 days', 120, 'For migraine prevention' FROM prescriptions WHERE diagnosis LIKE '%Migraine%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Sumatriptan', '100mg', 'As needed for migraine', '60 days', 9, 'Max 2 tablets per 24 hours' FROM prescriptions WHERE diagnosis LIKE '%Migraine%' LIMIT 1;

-- Orthopedics medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Celecoxib', '200mg', 'Once daily', '45 days', 45, 'Take with food. For arthritis.' FROM prescriptions WHERE diagnosis LIKE '%Knee Osteoarthritis%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Glucosamine', '1500mg', 'Once daily', '90 days', 90, 'Joint supplement' FROM prescriptions WHERE diagnosis LIKE '%Knee Osteoarthritis%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Gabapentin', '300mg', 'Three times daily', '45 days', 135, 'For nerve pain' FROM prescriptions WHERE diagnosis LIKE '%Disc Herniation%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Cyclobenzaprine', '10mg', 'Three times daily', '14 days', 42, 'Muscle relaxant. May cause drowsiness.' FROM prescriptions WHERE diagnosis LIKE '%Disc Herniation%' LIMIT 1;

-- Pediatric medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Amoxicillin', '400mg/5ml', 'Twice daily', '10 days', 150, 'Complete full course' FROM prescriptions WHERE diagnosis LIKE '%Otitis Media%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Fluticasone Propionate', '44mcg', '2 puffs twice daily', '30 days', 1, 'Rinse mouth after use' FROM prescriptions WHERE diagnosis LIKE '%Persistent Asthma%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Albuterol', '90mcg', '2 puffs every 4-6 hours PRN', '30 days', 1, 'Rescue inhaler' FROM prescriptions WHERE diagnosis LIKE '%Persistent Asthma%' LIMIT 1;

-- General Medicine medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Ferrous Sulfate', '325mg', 'Once daily', '90 days', 90, 'Take on empty stomach with vitamin C' FROM prescriptions WHERE diagnosis LIKE '%Iron Deficiency%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Levothyroxine', '75mcg', 'Once daily', '180 days', 180, 'Take 30 min before breakfast' FROM prescriptions WHERE diagnosis LIKE '%Hypothyroidism%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Metformin', '500mg', 'Twice daily', '90 days', 180, 'Take with meals' FROM prescriptions WHERE diagnosis LIKE '%Type 2 Diabetes%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Tiotropium', '18mcg', 'Once daily', '90 days', 90, 'Maintenance inhaler for COPD' FROM prescriptions WHERE diagnosis LIKE '%COPD%' LIMIT 1;

-- Psychiatry medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Sertraline', '50mg', 'Once daily', '30 days', 30, 'May take 2-4 weeks for effect' FROM prescriptions WHERE diagnosis LIKE '%Panic Disorder%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Escitalopram', '10mg', 'Once daily', '30 days', 30, 'Take in morning' FROM prescriptions WHERE diagnosis LIKE '%Major Depressive%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Zolpidem', '5mg', 'At bedtime PRN', '14 days', 14, 'Short term use only. No driving.' FROM prescriptions WHERE diagnosis LIKE '%Insomnia%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Buspirone', '10mg', 'Three times daily', '30 days', 90, 'Titrate up slowly' FROM prescriptions WHERE diagnosis LIKE '%Generalized Anxiety%' LIMIT 1;

-- Dermatology medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Triamcinolone cream', '0.1%', 'Apply twice daily', '14 days', 30, 'Apply thin layer to affected area' FROM prescriptions WHERE diagnosis LIKE '%Contact Dermatitis%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Isotretinoin', '40mg', 'Once daily with food', '30 days', 30, 'iPLEDGE program required' FROM prescriptions WHERE diagnosis LIKE '%Acne Vulgaris%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Clobetasol cream', '0.05%', 'Apply twice daily', '14 days', 30, 'High potency steroid. Limit use.' FROM prescriptions WHERE diagnosis LIKE '%Psoriasis%' LIMIT 1;

-- Ophthalmology medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Latanoprost', '0.005%', 'One drop QHS', '30 days', 1, 'Instill in evening. May darken eyelashes.' FROM prescriptions WHERE diagnosis LIKE '%Glaucoma%' LIMIT 1;

-- Urology medications
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Tamsulosin', '0.4mg', 'Once daily at bedtime', '90 days', 90, 'Take 30 min after same meal daily' FROM prescriptions WHERE diagnosis LIKE '%Prostatic Hyperplasia%' LIMIT 1;
INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, quantity, instructions)
SELECT id, 'Finasteride', '5mg', 'Once daily', '90 days', 90, 'May take 6 months for effect' FROM prescriptions WHERE diagnosis LIKE '%Prostatic Hyperplasia%' LIMIT 1;

-- ============================================
-- BILLS (for completed appointments)
-- Link bills to their corresponding appointments using subqueries
-- ============================================

-- Cardiology bills (linked to completed appointments)
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 1, a.id, 'BILL-2024-0001', 450.00, 0.00, 0.00, 450.00, 450.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_DATE - INTERVAL '53 days', 'Cardiac evaluation + ECG'
FROM appointments a WHERE a.patient_id = 1 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 21, a.id, 'BILL-2024-0002', 380.00, 0.00, 0.00, 380.00, 380.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_DATE - INTERVAL '43 days', 'Holter monitor + Consultation'
FROM appointments a WHERE a.patient_id = 21 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 43, a.id, 'BILL-2024-0003', 520.00, 52.00, 0.00, 468.00, 468.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'CHF management - 10% insurance discount'
FROM appointments a WHERE a.patient_id = 43 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 13, a.id, 'BILL-2024-0004', 300.00, 0.00, 0.00, 300.00, 300.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_DATE - INTERVAL '23 days', 'AFib follow-up + INR check'
FROM appointments a WHERE a.patient_id = 13 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 15, a.id, 'BILL-2024-0005', 250.00, 0.00, 0.00, 250.00, 0.00, 'PENDING', NULL, CURRENT_DATE + INTERVAL '14 days', 'Cardiology annual visit'
FROM appointments a WHERE a.patient_id = 15 AND a.doctor_id = 1 AND a.status = 'COMPLETED' LIMIT 1;

-- Neurology bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 17, a.id, 'BILL-2024-0006', 280.00, 0.00, 0.00, 280.00, 280.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_DATE - INTERVAL '53 days', 'Headache evaluation'
FROM appointments a WHERE a.patient_id = 17 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 6, a.id, 'BILL-2024-0007', 450.00, 0.00, 0.00, 450.00, 450.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_DATE - INTERVAL '38 days', 'Nerve conduction study + Consultation'
FROM appointments a WHERE a.patient_id = 6 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 30, a.id, 'BILL-2024-0008', 220.00, 0.00, 0.00, 220.00, 220.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_DATE - INTERVAL '23 days', 'Tremor evaluation'
FROM appointments a WHERE a.patient_id = 30 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 40, a.id, 'BILL-2024-0009', 200.00, 0.00, 0.00, 200.00, 200.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_DATE - INTERVAL '8 days', 'Epilepsy follow-up'
FROM appointments a WHERE a.patient_id = 40 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 51, a.id, 'BILL-2024-0010', 280.00, 0.00, 0.00, 280.00, 280.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', 'Migraine management'
FROM appointments a WHERE a.patient_id = 51 AND a.doctor_id = 2 AND a.status = 'COMPLETED' LIMIT 1;

-- Orthopedics bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 3, a.id, 'BILL-2024-0011', 350.00, 0.00, 0.00, 350.00, 350.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_DATE - INTERVAL '48 days', 'Knee evaluation + X-ray'
FROM appointments a WHERE a.patient_id = 3 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 24, a.id, 'BILL-2024-0012', 1200.00, 0.00, 0.00, 1200.00, 600.00, 'PARTIAL', 'CASH', CURRENT_DATE + INTERVAL '7 days', 'Hip replacement consultation - Partial payment'
FROM appointments a WHERE a.patient_id = 24 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 11, a.id, 'BILL-2024-0013', 850.00, 0.00, 0.00, 850.00, 850.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_DATE - INTERVAL '28 days', 'MRI + Consultation'
FROM appointments a WHERE a.patient_id = 11 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 37, a.id, 'BILL-2024-0014', 420.00, 0.00, 0.00, 420.00, 420.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_DATE - INTERVAL '8 days', 'Shoulder evaluation'
FROM appointments a WHERE a.patient_id = 37 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 47, a.id, 'BILL-2024-0015', 300.00, 30.00, 0.00, 270.00, 270.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', 'Post-surgery follow-up - 10% senior discount'
FROM appointments a WHERE a.patient_id = 47 AND a.doctor_id = 3 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 34, a.id, 'BILL-2024-0016', 280.00, 0.00, 0.00, 280.00, 0.00, 'PENDING', NULL, CURRENT_DATE + INTERVAL '21 days', 'Ankle sprain follow-up'
FROM appointments a WHERE a.patient_id = 34 AND a.doctor_id = 9 AND a.status = 'COMPLETED' LIMIT 1;

-- Pediatrics bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 2, a.id, 'BILL-2024-0017', 250.00, 0.00, 0.00, 250.00, 250.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_DATE - INTERVAL '53 days', 'Well child + Vaccinations'
FROM appointments a WHERE a.patient_id = 2 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 25, a.id, 'BILL-2024-0018', 180.00, 0.00, 0.00, 180.00, 180.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_DATE - INTERVAL '33 days', 'Ear infection treatment'
FROM appointments a WHERE a.patient_id = 25 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 33, a.id, 'BILL-2024-0019', 200.00, 0.00, 0.00, 200.00, 200.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_DATE - INTERVAL '13 days', 'Asthma management'
FROM appointments a WHERE a.patient_id = 33 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 44, a.id, 'BILL-2024-0020', 180.00, 0.00, 0.00, 180.00, 180.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_DATE - INTERVAL '3 days', 'Growth evaluation'
FROM appointments a WHERE a.patient_id = 44 AND a.doctor_id = 4 AND a.status = 'COMPLETED' LIMIT 1;

-- General Medicine bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 16, a.id, 'BILL-2024-0021', 350.00, 0.00, 0.00, 350.00, 350.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_DATE - INTERVAL '53 days', 'Anemia workup + Labs'
FROM appointments a WHERE a.patient_id = 16 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 4, a.id, 'BILL-2024-0022', 150.00, 0.00, 0.00, 150.00, 150.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_DATE - INTERVAL '43 days', 'Follow-up visit'
FROM appointments a WHERE a.patient_id = 4 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 7, a.id, 'BILL-2024-0023', 380.00, 0.00, 0.00, 380.00, 380.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_DATE - INTERVAL '38 days', 'COPD management + Spirometry'
FROM appointments a WHERE a.patient_id = 7 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 12, a.id, 'BILL-2024-0024', 280.00, 0.00, 0.00, 280.00, 0.00, 'PENDING', NULL, CURRENT_DATE + INTERVAL '14 days', 'Prediabetes screening'
FROM appointments a WHERE a.patient_id = 12 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 14, a.id, 'BILL-2024-0025', 220.00, 0.00, 0.00, 220.00, 220.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_DATE - INTERVAL '18 days', 'Thyroid follow-up'
FROM appointments a WHERE a.patient_id = 14 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 36, a.id, 'BILL-2024-0026', 320.00, 0.00, 0.00, 320.00, 320.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_DATE - INTERVAL '13 days', 'Annual physical + Labs'
FROM appointments a WHERE a.patient_id = 36 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 41, a.id, 'BILL-2024-0027', 180.00, 0.00, 0.00, 180.00, 0.00, 'PENDING', NULL, CURRENT_DATE + INTERVAL '21 days', 'Hypertension evaluation'
FROM appointments a WHERE a.patient_id = 41 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 48, a.id, 'BILL-2024-0028', 250.00, 25.00, 0.00, 225.00, 225.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', 'Diabetes management - Regular patient discount'
FROM appointments a WHERE a.patient_id = 48 AND a.doctor_id = 5 AND a.status = 'COMPLETED' LIMIT 1;

-- Dermatology bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 18, a.id, 'BILL-2024-0029', 220.00, 0.00, 0.00, 220.00, 220.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_DATE - INTERVAL '48 days', 'Dermatitis treatment'
FROM appointments a WHERE a.patient_id = 18 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 26, a.id, 'BILL-2024-0030', 380.00, 0.00, 0.00, 380.00, 380.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_DATE - INTERVAL '33 days', 'Acne consultation + Labs'
FROM appointments a WHERE a.patient_id = 26 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 32, a.id, 'BILL-2024-0031', 250.00, 0.00, 0.00, 250.00, 250.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_DATE - INTERVAL '18 days', 'Psoriasis treatment'
FROM appointments a WHERE a.patient_id = 32 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 42, a.id, 'BILL-2024-0032', 450.00, 0.00, 0.00, 450.00, 200.00, 'PARTIAL', 'CASH', CURRENT_DATE + INTERVAL '14 days', 'Biopsy procedure - Balance pending'
FROM appointments a WHERE a.patient_id = 42 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 52, a.id, 'BILL-2024-0033', 200.00, 0.00, 0.00, 200.00, 200.00, 'PAID', 'ONLINE', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', 'Allergy treatment'
FROM appointments a WHERE a.patient_id = 52 AND a.doctor_id = 6 AND a.status = 'COMPLETED' LIMIT 1;

-- Gynecology bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 8, a.id, 'BILL-2024-0034', 350.00, 0.00, 0.00, 350.00, 350.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_DATE - INTERVAL '33 days', 'Annual exam + Pap + Mammogram'
FROM appointments a WHERE a.patient_id = 8 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 10, a.id, 'BILL-2024-0035', 280.00, 0.00, 0.00, 280.00, 280.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_DATE - INTERVAL '28 days', 'PCOS management'
FROM appointments a WHERE a.patient_id = 10 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 19, a.id, 'BILL-2024-0036', 420.00, 0.00, 0.00, 420.00, 420.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_DATE - INTERVAL '48 days', 'Ultrasound + Consultation'
FROM appointments a WHERE a.patient_id = 19 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 35, a.id, 'BILL-2024-0037', 300.00, 0.00, 0.00, 300.00, 300.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_DATE - INTERVAL '13 days', 'Menopause consultation'
FROM appointments a WHERE a.patient_id = 35 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 46, a.id, 'BILL-2024-0038', 550.00, 0.00, 0.00, 550.00, 550.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', 'Prenatal visit + Labs'
FROM appointments a WHERE a.patient_id = 46 AND a.doctor_id = 7 AND a.status = 'COMPLETED' LIMIT 1;

-- Ophthalmology bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 20, a.id, 'BILL-2024-0039', 180.00, 0.00, 0.00, 180.00, 180.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '55 days', CURRENT_DATE - INTERVAL '48 days', 'Vision exam + Prescription'
FROM appointments a WHERE a.patient_id = 20 AND a.doctor_id = 8 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 28, a.id, 'BILL-2024-0040', 250.00, 0.00, 0.00, 250.00, 250.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_DATE - INTERVAL '28 days', 'Glaucoma screening + Treatment'
FROM appointments a WHERE a.patient_id = 28 AND a.doctor_id = 8 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) 
SELECT 39, a.id, 'BILL-2024-0041', 2500.00, 250.00, 0.00, 2250.00, 1500.00, 'PARTIAL', 'INSURANCE', CURRENT_DATE + INTERVAL '21 days', 'Cataract surgery - Insurance partial coverage'
FROM appointments a WHERE a.patient_id = 39 AND a.doctor_id = 8 AND a.status = 'COMPLETED' LIMIT 1;

-- Emergency bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 22, a.id, 'BILL-2024-0042', 650.00, 0.00, 0.00, 650.00, 650.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_DATE - INTERVAL '43 days', 'Emergency visit + X-ray'
FROM appointments a WHERE a.patient_id = 22 AND a.doctor_id = 9 AND a.status = 'COMPLETED' LIMIT 1;

-- Psychiatry bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 23, a.id, 'BILL-2024-0043', 280.00, 0.00, 0.00, 280.00, 280.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_DATE - INTERVAL '38 days', 'Psychiatric evaluation'
FROM appointments a WHERE a.patient_id = 23 AND a.doctor_id = 11 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 29, a.id, 'BILL-2024-0044', 250.00, 0.00, 0.00, 250.00, 250.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_DATE - INTERVAL '23 days', 'Depression treatment'
FROM appointments a WHERE a.patient_id = 29 AND a.doctor_id = 11 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 38, a.id, 'BILL-2024-0045', 200.00, 0.00, 0.00, 200.00, 200.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_DATE - INTERVAL '8 days', 'Sleep disorder consultation'
FROM appointments a WHERE a.patient_id = 38 AND a.doctor_id = 11 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, due_date, notes) VALUES
(49, 'BILL-2024-0046', 280.00, 0.00, 0.00, 280.00, 0.00, 'PENDING', NULL, CURRENT_DATE + INTERVAL '28 days', 'Anxiety therapy session');

-- Urology bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 5, a.id, 'BILL-2024-0047', 320.00, 0.00, 0.00, 320.00, 320.00, 'PAID', 'INSURANCE', CURRENT_TIMESTAMP - INTERVAL '50 days', CURRENT_DATE - INTERVAL '43 days', 'BPH evaluation + Labs'
FROM appointments a WHERE a.patient_id = 5 AND a.doctor_id = 12 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 31, a.id, 'BILL-2024-0048', 480.00, 0.00, 0.00, 480.00, 480.00, 'PAID', 'CARD', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_DATE - INTERVAL '18 days', 'Kidney stone workup + CT'
FROM appointments a WHERE a.patient_id = 31 AND a.doctor_id = 12 AND a.status = 'COMPLETED' LIMIT 1;

INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 45, a.id, 'BILL-2024-0049', 280.00, 0.00, 0.00, 280.00, 280.00, 'PAID', 'UPI', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', 'PSA monitoring'
FROM appointments a WHERE a.patient_id = 45 AND a.doctor_id = 12 AND a.status = 'COMPLETED' LIMIT 1;

-- Radiology bills
INSERT INTO bills (patient_id, appointment_id, bill_number, total_amount, discount_amount, tax_amount, final_amount, paid_amount, status, payment_method, payment_date, due_date, notes) 
SELECT 27, a.id, 'BILL-2024-0050', 150.00, 0.00, 0.00, 150.00, 150.00, 'PAID', 'CASH', CURRENT_TIMESTAMP - INTERVAL '35 days', CURRENT_DATE - INTERVAL '28 days', 'Chest X-ray'
FROM appointments a WHERE a.patient_id = 27 AND a.doctor_id = 10 AND a.status = 'COMPLETED' LIMIT 1;

-- ============================================
-- BILL ITEMS
-- ============================================

-- Add items for cardiology bills
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Cardiology Consultation', 1, 200.00, 200.00 FROM bills WHERE bill_number = 'BILL-2024-0001';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'ECG - 12 Lead', 1, 100.00, 100.00 FROM bills WHERE bill_number = 'BILL-2024-0001';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Cardiac Enzymes Panel', 1, 150.00, 150.00 FROM bills WHERE bill_number = 'BILL-2024-0001';

INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Cardiology Consultation', 1, 200.00, 200.00 FROM bills WHERE bill_number = 'BILL-2024-0002';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Holter Monitor - 24 Hour', 1, 180.00, 180.00 FROM bills WHERE bill_number = 'BILL-2024-0002';

INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Heart Failure Management', 1, 250.00, 250.00 FROM bills WHERE bill_number = 'BILL-2024-0003';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'BNP Test', 1, 120.00, 120.00 FROM bills WHERE bill_number = 'BILL-2024-0003';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Chest X-ray', 1, 150.00, 150.00 FROM bills WHERE bill_number = 'BILL-2024-0003';

-- Add items for neurology bills
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Neurology Consultation', 1, 180.00, 180.00 FROM bills WHERE bill_number = 'BILL-2024-0006';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Neurological Examination', 1, 100.00, 100.00 FROM bills WHERE bill_number = 'BILL-2024-0006';

INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Neurology Consultation', 1, 180.00, 180.00 FROM bills WHERE bill_number = 'BILL-2024-0007';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Nerve Conduction Study', 1, 270.00, 270.00 FROM bills WHERE bill_number = 'BILL-2024-0007';

-- Add items for orthopedics bills
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Orthopedic Consultation', 1, 175.00, 175.00 FROM bills WHERE bill_number = 'BILL-2024-0011';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'X-ray Knee (Both)', 1, 175.00, 175.00 FROM bills WHERE bill_number = 'BILL-2024-0011';

INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Hip Replacement Consultation', 1, 250.00, 250.00 FROM bills WHERE bill_number = 'BILL-2024-0012';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'X-ray Hip', 1, 150.00, 150.00 FROM bills WHERE bill_number = 'BILL-2024-0012';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Pre-operative Assessment', 1, 800.00, 800.00 FROM bills WHERE bill_number = 'BILL-2024-0012';

INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Orthopedic Consultation', 1, 175.00, 175.00 FROM bills WHERE bill_number = 'BILL-2024-0013';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'MRI Lumbar Spine', 1, 675.00, 675.00 FROM bills WHERE bill_number = 'BILL-2024-0013';

-- Add items for pediatrics bills
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Pediatric Consultation', 1, 150.00, 150.00 FROM bills WHERE bill_number = 'BILL-2024-0017';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Vaccinations (DTaP, IPV, MMR)', 1, 100.00, 100.00 FROM bills WHERE bill_number = 'BILL-2024-0017';

-- Add items for general medicine bills
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'General Medicine Consultation', 1, 120.00, 120.00 FROM bills WHERE bill_number = 'BILL-2024-0021';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Complete Blood Count', 1, 80.00, 80.00 FROM bills WHERE bill_number = 'BILL-2024-0021';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Iron Studies Panel', 1, 150.00, 150.00 FROM bills WHERE bill_number = 'BILL-2024-0021';

-- Add items for surgery bills
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Cataract Surgery - Right Eye', 1, 2000.00, 2000.00 FROM bills WHERE bill_number = 'BILL-2024-0041';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Intraocular Lens', 1, 350.00, 350.00 FROM bills WHERE bill_number = 'BILL-2024-0041';
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total_price)
SELECT id, 'Anesthesia', 1, 150.00, 150.00 FROM bills WHERE bill_number = 'BILL-2024-0041';

-- ============================================
-- SUMMARY STATISTICS
-- ============================================
SELECT 'Large Scale Data Loaded Successfully!' as status;
