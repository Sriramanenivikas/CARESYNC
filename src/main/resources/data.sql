-- CareSync Demo Users
-- This file is automatically executed by Spring Boot on startup
-- Password for all users is: password123

-- Only insert if users table is empty
INSERT INTO users (username, email, password, role, is_active)
SELECT 'admin', 'admin@caresync.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3jEhnLqT/FqULWqNMH0m', 'ADMIN', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, email, password, role, is_active)
SELECT 'test', 'test@caresync.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3jEhnLqT/FqULWqNMH0m', 'TEST', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'test');

INSERT INTO users (username, email, password, role, is_active)
SELECT 'dr.smith', 'dr.smith@caresync.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3jEhnLqT/FqULWqNMH0m', 'DOCTOR', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'dr.smith');

INSERT INTO users (username, email, password, role, is_active)
SELECT 'nurse.lisa', 'nurse.lisa@caresync.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3jEhnLqT/FqULWqNMH0m', 'NURSE', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'nurse.lisa');

INSERT INTO users (username, email, password, role, is_active)
SELECT 'reception.mary', 'reception.mary@caresync.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3jEhnLqT/FqULWqNMH0m', 'RECEPTIONIST', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'reception.mary');

INSERT INTO users (username, email, password, role, is_active)
SELECT 'patient.robert', 'patient.robert@caresync.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3jEhnLqT/FqULWqNMH0m', 'PATIENT', true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'patient.robert');

