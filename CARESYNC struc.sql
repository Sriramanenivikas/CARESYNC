-- -------------------------------------------------------------
-- TablePlus 6.7.3(640)
--
-- https://tableplus.com/
--
-- Database: CARESYNC
-- Generation Time: 2025-11-11 10:32:49.3830
-- -------------------------------------------------------------


















-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS otp_verification_otp_id_seq;

-- Table Definition
CREATE TABLE "public"."otp_verification" (
    "otp_id" int8 NOT NULL DEFAULT nextval('otp_verification_otp_id_seq'::regclass),
    "user_id" int8 NOT NULL,
    "email" varchar(255),
    "mobile" varchar(20),
    "otp_code" varchar(6) NOT NULL,
    "otp_type" varchar(20) CHECK ((otp_type)::text = ANY ((ARRAY['LOGIN'::character varying, 'REGISTRATION'::character varying, 'PASSWORD_RESET'::character varying])::text[])),
    "is_verified" bool DEFAULT false,
    "expires_at" timestamp NOT NULL,
    "verified_at" timestamp,
    "attempts" int4 DEFAULT 0,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("otp_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS role_permissions_permission_id_seq;

-- Table Definition
CREATE TABLE "public"."role_permissions" (
    "permission_id" int8 NOT NULL DEFAULT nextval('role_permissions_permission_id_seq'::regclass),
    "role" varchar(50) NOT NULL CHECK ((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'DOCTOR'::character varying, 'PATIENT'::character varying, 'RECEPTIONIST'::character varying, 'NURSE'::character varying])::text[])),
    "module" varchar(100) NOT NULL,
    "can_create" bool DEFAULT false,
    "can_read" bool DEFAULT false,
    "can_update" bool DEFAULT false,
    "can_delete" bool DEFAULT false,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("permission_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int8 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "password" varchar(255),
    "username" varchar(255),
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "created_at" timestamp,
    "email" varchar(255),
    "password_hash" varchar(255),
    "role" varchar(255) CHECK ((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'DOCTOR'::character varying, 'NURSE'::character varying, 'RECEPTIONIST'::character varying, 'PHARMACIST'::character varying, 'LAB_TECHNICIAN'::character varying, 'PATIENT'::character varying])::text[])),
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS insurance_details_id_seq;

-- Table Definition
CREATE TABLE "public"."insurance_details" (
    "id" int8 NOT NULL DEFAULT nextval('insurance_details_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "policy_number" varchar(100) NOT NULL,
    "valid_till" date NOT NULL,
    "provider" varchar(255) NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "coverage_end_date" date,
    "group_number" varchar(100),
    "plan_type" varchar(100),
    "coverage_start_date" date,
    "provider_name" varchar(200),
    "patient_id" int8,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS login_attempts_attempt_id_seq;

-- Table Definition
CREATE TABLE "public"."login_attempts" (
    "attempt_id" int8 NOT NULL DEFAULT nextval('login_attempts_attempt_id_seq'::regclass),
    "email" varchar(255),
    "mobile" varchar(20),
    "ip_address" varchar(45),
    "user_agent" text,
    "success" bool DEFAULT false,
    "failure_reason" varchar(255),
    "attempted_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("attempt_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_sessions_session_id_seq;

-- Table Definition
CREATE TABLE "public"."user_sessions" (
    "session_id" int8 NOT NULL DEFAULT nextval('user_sessions_session_id_seq'::regclass),
    "user_id" int8 NOT NULL,
    "jwt_token" text NOT NULL,
    "refresh_token" text,
    "ip_address" varchar(45),
    "user_agent" text,
    "login_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "last_activity" timestamp DEFAULT CURRENT_TIMESTAMP,
    "logout_at" timestamp,
    "is_active" bool DEFAULT true,
    PRIMARY KEY ("session_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bill_master_bill_id_seq;

-- Table Definition
CREATE TABLE "public"."bill_master" (
    "bill_id" int8 NOT NULL DEFAULT nextval('bill_master_bill_id_seq'::regclass),
    "bill_number" varchar(50) NOT NULL,
    "patient_id" int8 NOT NULL,
    "appointment_id" int8,
    "bed_assignment_id" int8,
    "bill_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "total_amount" numeric(12,2) NOT NULL DEFAULT 0,
    "discount_amount" numeric(12,2) DEFAULT 0,
    "tax_amount" numeric(12,2) DEFAULT 0,
    "net_amount" numeric(12,2) NOT NULL DEFAULT 0,
    "paid_amount" numeric(12,2) DEFAULT 0,
    "balance_amount" numeric(12,2) DEFAULT 0,
    "payment_status" varchar(20) CHECK ((payment_status)::text = ANY ((ARRAY['UNPAID'::character varying, 'PARTIAL'::character varying, 'PAID'::character varying, 'REFUNDED'::character varying])::text[])),
    "bill_type" varchar(30) CHECK ((bill_type)::text = ANY ((ARRAY['OPD'::character varying, 'IPD'::character varying, 'EMERGENCY'::character varying, 'PHARMACY'::character varying, 'LAB'::character varying])::text[])),
    "insurance_claim_amount" numeric(12,2) DEFAULT 0,
    "discharged" bool DEFAULT false,
    "discharge_date" timestamp,
    "created_by" varchar(100),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp,
    "notes" text,
    PRIMARY KEY ("bill_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bed_assignments_id_seq;

-- Table Definition
CREATE TABLE "public"."bed_assignments" (
    "id" int8 NOT NULL DEFAULT nextval('bed_assignments_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "actual_discharge_date" timestamp,
    "admission_date" timestamp NOT NULL,
    "admission_reason" text NOT NULL,
    "admission_type" varchar(50) NOT NULL CHECK ((admission_type)::text = ANY ((ARRAY['EMERGENCY'::character varying, 'SCHEDULED'::character varying, 'TRANSFER'::character varying])::text[])),
    "assignment_code" varchar(20) NOT NULL,
    "daily_charge" numeric(10,2),
    "discharge_instructions" text,
    "discharge_summary" text,
    "expected_discharge_date" date,
    "status" varchar(50) NOT NULL CHECK ((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'DISCHARGED'::character varying, 'TRANSFERRED'::character varying])::text[])),
    "total_charges" numeric(10,2),
    "assigned_by_doctor_id" int8 NOT NULL,
    "bed_id" int8 NOT NULL,
    "patient_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS ward_details_id_seq;

-- Table Definition
CREATE TABLE "public"."ward_details" (
    "id" int8 NOT NULL DEFAULT nextval('ward_details_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "available_beds" int4 NOT NULL CHECK (available_beds >= 0),
    "floor_number" int4 NOT NULL CHECK (floor_number >= 0),
    "phone" varchar(20),
    "total_beds" int4 NOT NULL CHECK (total_beds >= 1),
    "ward_code" varchar(20) NOT NULL,
    "ward_name" varchar(100) NOT NULL,
    "ward_type" varchar(50) NOT NULL CHECK ((ward_type)::text = ANY ((ARRAY['GENERAL'::character varying, 'ICU'::character varying, 'NICU'::character varying, 'PICU'::character varying, 'CCU'::character varying, 'EMERGENCY'::character varying, 'MATERNITY'::character varying])::text[])),
    "department_id" int8 NOT NULL,
    "incharge_nurse_id" int8,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS appointment_details_id_seq;

-- Table Definition
CREATE TABLE "public"."appointment_details" (
    "id" int8 NOT NULL DEFAULT nextval('appointment_details_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "appointment_code" varchar(20) NOT NULL,
    "appointment_date" date NOT NULL,
    "appointment_time" time NOT NULL,
    "appointment_type" varchar(50) NOT NULL CHECK ((appointment_type)::text = ANY ((ARRAY['CONSULTATION'::character varying, 'FOLLOW_UP'::character varying, 'EMERGENCY'::character varying, 'CHECKUP'::character varying, 'PROCEDURE'::character varying])::text[])),
    "cancellation_reason" text,
    "cancelled_at" timestamp,
    "cancelled_by" varchar(100),
    "consultation_fee" numeric(10,2),
    "notes" text,
    "priority" varchar(20) CHECK ((priority)::text = ANY ((ARRAY['LOW'::character varying, 'NORMAL'::character varying, 'HIGH'::character varying, 'EMERGENCY'::character varying])::text[])),
    "reason" text NOT NULL,
    "status" varchar(50) NOT NULL CHECK ((status)::text = ANY ((ARRAY['SCHEDULED'::character varying, 'CONFIRMED'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'NO_SHOW'::character varying])::text[])),
    "symptoms" text,
    "department_id" int8 NOT NULL,
    "doctor_id" int8 NOT NULL,
    "patient_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bed_details_id_seq;

-- Table Definition
CREATE TABLE "public"."bed_details" (
    "id" int8 NOT NULL DEFAULT nextval('bed_details_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "bed_code" varchar(20) NOT NULL,
    "bed_number" varchar(20) NOT NULL,
    "bed_type" varchar(50) NOT NULL CHECK ((bed_type)::text = ANY ((ARRAY['STANDARD'::character varying, 'DELUXE'::character varying, 'ICU'::character varying, 'VENTILATOR'::character varying])::text[])),
    "daily_charge" numeric(10,2) NOT NULL,
    "has_monitor" bool,
    "has_oxygen" bool,
    "has_ventilator" bool,
    "status" varchar(50) NOT NULL CHECK ((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'OCCUPIED'::character varying, 'MAINTENANCE'::character varying, 'RESERVED'::character varying])::text[])),
    "ward_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS emergency_contacts_id_seq;

-- Table Definition
CREATE TABLE "public"."emergency_contacts" (
    "id" int8 NOT NULL DEFAULT nextval('emergency_contacts_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "contact_name" varchar(200) NOT NULL,
    "email" varchar(255),
    "is_primary" bool,
    "phone_primary" varchar(20) NOT NULL,
    "phone_secondary" varchar(20),
    "relationship" varchar(50) NOT NULL,
    "patient_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS medical_records_id_seq;

-- Table Definition
CREATE TABLE "public"."medical_records" (
    "id" int8 NOT NULL DEFAULT nextval('medical_records_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "attachments" text,
    "diagnosis" text,
    "notes" text,
    "record_date" timestamp NOT NULL,
    "record_type" varchar(50) NOT NULL,
    "symptoms" text,
    "treatment_plan" text,
    "doctor_id" int8 NOT NULL,
    "patient_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Table Definition
CREATE TABLE "public"."doctor_departments" (
    "department_id" int8 NOT NULL,
    "doctor_id" int8 NOT NULL,
    PRIMARY KEY ("department_id","doctor_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS department_details_id_seq;

-- Table Definition
CREATE TABLE "public"."department_details" (
    "id" int8 NOT NULL DEFAULT nextval('department_details_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "department_code" varchar(20) NOT NULL,
    "department_name" varchar(100) NOT NULL,
    "description" text,
    "email" varchar(255),
    "floor_number" int4,
    "phone" varchar(20),
    "head_doctor_id" int8,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS doctor_schedules_id_seq;

-- Table Definition
CREATE TABLE "public"."doctor_schedules" (
    "id" int8 NOT NULL DEFAULT nextval('doctor_schedules_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "day_of_week" varchar(20) NOT NULL,
    "end_time" time NOT NULL,
    "is_available" bool,
    "max_appointments" int4 CHECK (max_appointments >= 1),
    "start_time" time NOT NULL,
    "doctor_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS doctor_details_id_seq;

-- Table Definition
CREATE TABLE "public"."doctor_details" (
    "id" int8 NOT NULL DEFAULT nextval('doctor_details_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "availability_status" varchar(20),
    "consultation_fee" numeric(10,2),
    "date_of_birth" date,
    "doctor_code" varchar(20) NOT NULL,
    "email" varchar(255) NOT NULL,
    "experience_years" int4 CHECK (experience_years >= 0),
    "first_name" varchar(100) NOT NULL,
    "gender" varchar(20) CHECK ((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'OTHER'::character varying])::text[])),
    "joining_date" date NOT NULL,
    "last_name" varchar(100) NOT NULL,
    "license_number" varchar(100) NOT NULL,
    "phone_primary" varchar(20) NOT NULL,
    "phone_secondary" varchar(20),
    "qualification" varchar(255) NOT NULL,
    "specialization" varchar(100) NOT NULL,
    "user_id" int8,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS patients_id_seq;

-- Table Definition
CREATE TABLE "public"."patient_details" (
    "id" int8 NOT NULL DEFAULT nextval('patients_id_seq'::regclass),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "address_line1" varchar(255),
    "address_line2" varchar(255),
    "allergies" text,
    "blood_group" varchar(20) CHECK ((blood_group)::text = ANY (ARRAY[('A_POSITIVE'::character varying)::text, ('A_NEGATIVE'::character varying)::text, ('B_POSITIVE'::character varying)::text, ('B_NEGATIVE'::character varying)::text, ('O_POSITIVE'::character varying)::text, ('O_NEGATIVE'::character varying)::text, ('AB_POSITIVE'::character varying)::text, ('AB_NEGATIVE'::character varying)::text])),
    "chronic_conditions" text,
    "city" varchar(100),
    "country" varchar(100),
    "current_medications" text,
    "date_of_birth" date NOT NULL,
    "email" varchar(255),
    "first_name" varchar(100) NOT NULL,
    "gender" varchar(20) NOT NULL CHECK ((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'OTHER'::character varying])::text[])),
    "last_name" varchar(100) NOT NULL,
    "marital_status" varchar(20) CHECK ((marital_status)::text = ANY ((ARRAY['SINGLE'::character varying, 'MARRIED'::character varying, 'DIVORCED'::character varying, 'WIDOWED'::character varying, 'SEPARATED'::character varying])::text[])),
    "occupation" varchar(100),
    "patient_code" varchar(20) NOT NULL,
    "phone_primary" varchar(20) NOT NULL,
    "phone_secondary" varchar(20),
    "postal_code" varchar(20),
    "registration_date" date NOT NULL,
    "state" varchar(100),
    "user_id" int8,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bill_items_item_id_seq;

-- Table Definition
CREATE TABLE "public"."bill_items" (
    "item_id" int8 NOT NULL DEFAULT nextval('bill_items_item_id_seq'::regclass),
    "bill_id" int8 NOT NULL,
    "item_type" varchar(50) CHECK ((item_type)::text = ANY ((ARRAY['CONSULTATION'::character varying, 'PROCEDURE'::character varying, 'MEDICINE'::character varying, 'LAB_TEST'::character varying, 'ROOM_CHARGE'::character varying, 'NURSING_CHARGE'::character varying, 'EQUIPMENT'::character varying, 'OTHER'::character varying])::text[])),
    "item_name" varchar(255) NOT NULL,
    "description" text,
    "quantity" int4 DEFAULT 1,
    "unit_price" numeric(10,2) NOT NULL,
    "total_price" numeric(12,2) NOT NULL,
    "discount_percent" numeric(5,2) DEFAULT 0,
    "tax_percent" numeric(5,2) DEFAULT 0,
    "net_price" numeric(12,2) NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("item_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS payment_transactions_transaction_id_seq;

-- Table Definition
CREATE TABLE "public"."payment_transactions" (
    "transaction_id" int8 NOT NULL DEFAULT nextval('payment_transactions_transaction_id_seq'::regclass),
    "bill_id" int8 NOT NULL,
    "transaction_number" varchar(100) NOT NULL,
    "payment_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "amount" numeric(12,2) NOT NULL,
    "payment_mode" varchar(30) CHECK ((payment_mode)::text = ANY ((ARRAY['CASH'::character varying, 'CARD'::character varying, 'UPI'::character varying, 'NET_BANKING'::character varying, 'CHEQUE'::character varying, 'INSURANCE'::character varying, 'OTHER'::character varying])::text[])),
    "payment_status" varchar(20) CHECK ((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'SUCCESS'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])),
    "reference_number" varchar(100),
    "card_type" varchar(20),
    "card_last_4" varchar(4),
    "upi_id" varchar(100),
    "bank_name" varchar(100),
    "cheque_number" varchar(50),
    "cheque_date" date,
    "received_by" varchar(100),
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("transaction_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS patient_vitals_vital_id_seq;

-- Table Definition
CREATE TABLE "public"."patient_vitals" (
    "vital_id" int8 NOT NULL DEFAULT nextval('patient_vitals_vital_id_seq'::regclass),
    "patient_id" int8 NOT NULL,
    "appointment_id" int8,
    "bed_assignment_id" int8,
    "recorded_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "temperature" numeric(4,1),
    "blood_pressure_systolic" int4,
    "blood_pressure_diastolic" int4,
    "pulse_rate" int4,
    "respiratory_rate" int4,
    "oxygen_saturation" numeric(5,2),
    "blood_sugar" numeric(6,2),
    "weight" numeric(5,2),
    "height" numeric(5,2),
    "bmi" numeric(4,2),
    "recorded_by" varchar(100),
    "notes" text,
    PRIMARY KEY ("vital_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS insurance_claims_claim_id_seq;

-- Table Definition
CREATE TABLE "public"."insurance_claims" (
    "claim_id" int8 NOT NULL DEFAULT nextval('insurance_claims_claim_id_seq'::regclass),
    "claim_number" varchar(100) NOT NULL,
    "bill_id" int8 NOT NULL,
    "insurance_id" int8 NOT NULL,
    "patient_id" int8 NOT NULL,
    "claim_amount" numeric(12,2) NOT NULL,
    "approved_amount" numeric(12,2),
    "rejected_amount" numeric(12,2),
    "claim_status" varchar(30) CHECK ((claim_status)::text = ANY ((ARRAY['SUBMITTED'::character varying, 'UNDER_REVIEW'::character varying, 'APPROVED'::character varying, 'PARTIALLY_APPROVED'::character varying, 'REJECTED'::character varying, 'SETTLED'::character varying])::text[])),
    "submitted_date" date NOT NULL,
    "approval_date" date,
    "settlement_date" date,
    "rejection_reason" text,
    "documents" text,
    "created_by" varchar(100),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp,
    PRIMARY KEY ("claim_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS ward_types_ward_type_id_seq;

-- Table Definition
CREATE TABLE "public"."ward_types" (
    "ward_type_id" int8 NOT NULL DEFAULT nextval('ward_types_ward_type_id_seq'::regclass),
    "type_code" varchar(20) NOT NULL,
    "type_name" varchar(100) NOT NULL,
    "description" text,
    "base_charge_per_day" numeric(10,2),
    "is_active" bool DEFAULT true,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("ward_type_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bed_maintenance_maintenance_id_seq;

-- Table Definition
CREATE TABLE "public"."bed_maintenance" (
    "maintenance_id" int8 NOT NULL DEFAULT nextval('bed_maintenance_maintenance_id_seq'::regclass),
    "bed_id" int8 NOT NULL,
    "maintenance_type" varchar(50) CHECK ((maintenance_type)::text = ANY ((ARRAY['CLEANING'::character varying, 'REPAIR'::character varying, 'SANITIZATION'::character varying, 'INSPECTION'::character varying])::text[])),
    "started_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "completed_at" timestamp,
    "status" varchar(20) CHECK ((status)::text = ANY ((ARRAY['IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])),
    "performed_by" varchar(100),
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("maintenance_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bed_transfer_history_transfer_id_seq;

-- Table Definition
CREATE TABLE "public"."bed_transfer_history" (
    "transfer_id" int8 NOT NULL DEFAULT nextval('bed_transfer_history_transfer_id_seq'::regclass),
    "patient_id" int8 NOT NULL,
    "from_bed_id" int8,
    "to_bed_id" int8 NOT NULL,
    "transfer_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "transfer_reason" text NOT NULL,
    "transferred_by" varchar(100),
    "approved_by" varchar(100),
    "notes" text,
    PRIMARY KEY ("transfer_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS prescriptions_prescription_id_seq;

-- Table Definition
CREATE TABLE "public"."prescriptions" (
    "prescription_id" int8 NOT NULL DEFAULT nextval('prescriptions_prescription_id_seq'::regclass),
    "prescription_number" varchar(50) NOT NULL,
    "patient_id" int8 NOT NULL,
    "doctor_id" int8 NOT NULL,
    "appointment_id" int8,
    "medical_record_id" int8,
    "prescription_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "diagnosis" text,
    "chief_complaints" text,
    "follow_up_date" date,
    "special_instructions" text,
    "is_dispensed" bool DEFAULT false,
    "dispensed_at" timestamp,
    "dispensed_by" varchar(100),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp,
    PRIMARY KEY ("prescription_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS prescription_items_item_id_seq;

-- Table Definition
CREATE TABLE "public"."prescription_items" (
    "item_id" int8 NOT NULL DEFAULT nextval('prescription_items_item_id_seq'::regclass),
    "prescription_id" int8 NOT NULL,
    "medicine_name" varchar(255) NOT NULL,
    "medicine_type" varchar(50),
    "dosage" varchar(100) NOT NULL,
    "frequency" varchar(100) NOT NULL,
    "duration" varchar(100) NOT NULL,
    "quantity" int4 NOT NULL,
    "route" varchar(50),
    "timing" varchar(100),
    "instructions" text,
    "is_dispensed" bool DEFAULT false,
    "dispensed_quantity" int4 DEFAULT 0,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("item_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS medical_record_diagnoses_record_diagnosis_id_seq;

-- Table Definition
CREATE TABLE "public"."medical_record_diagnoses" (
    "record_diagnosis_id" int8 NOT NULL DEFAULT nextval('medical_record_diagnoses_record_diagnosis_id_seq'::regclass),
    "medical_record_id" int8 NOT NULL,
    "diagnosis_code_id" int8 NOT NULL,
    "is_primary" bool DEFAULT false,
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("record_diagnosis_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS diagnosis_codes_code_id_seq;

-- Table Definition
CREATE TABLE "public"."diagnosis_codes" (
    "code_id" int8 NOT NULL DEFAULT nextval('diagnosis_codes_code_id_seq'::regclass),
    "icd_code" varchar(20) NOT NULL,
    "description" text NOT NULL,
    "category" varchar(100),
    "is_active" bool DEFAULT true,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("code_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS appointment_queue_queue_id_seq;

-- Table Definition
CREATE TABLE "public"."appointment_queue" (
    "queue_id" int8 NOT NULL DEFAULT nextval('appointment_queue_queue_id_seq'::regclass),
    "appointment_id" int8 NOT NULL,
    "token_number" varchar(20) NOT NULL,
    "queue_date" date NOT NULL,
    "estimated_time" timestamp,
    "actual_start_time" timestamp,
    "actual_end_time" timestamp,
    "queue_status" varchar(30) CHECK ((queue_status)::text = ANY ((ARRAY['WAITING'::character varying, 'IN_CONSULTATION'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'NO_SHOW'::character varying])::text[])),
    "called_at" timestamp,
    "waiting_time_minutes" int4,
    "consultation_time_minutes" int4,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("queue_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS doctor_time_slots_slot_id_seq;

-- Table Definition
CREATE TABLE "public"."doctor_time_slots" (
    "slot_id" int8 NOT NULL DEFAULT nextval('doctor_time_slots_slot_id_seq'::regclass),
    "doctor_id" int8 NOT NULL,
    "schedule_id" int8 NOT NULL,
    "slot_date" date NOT NULL,
    "slot_time" time NOT NULL,
    "duration_minutes" int4 DEFAULT 15,
    "is_available" bool DEFAULT true,
    "is_booked" bool DEFAULT false,
    "appointment_id" int8,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("slot_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS staff_profiles_staff_id_seq;

-- Table Definition
CREATE TABLE "public"."staff_profiles" (
    "staff_id" int8 NOT NULL DEFAULT nextval('staff_profiles_staff_id_seq'::regclass),
    "staff_code" varchar(20) NOT NULL,
    "user_id" int8 NOT NULL,
    "first_name" varchar(100) NOT NULL,
    "last_name" varchar(100) NOT NULL,
    "email" varchar(255) NOT NULL,
    "phone_primary" varchar(20) NOT NULL,
    "phone_secondary" varchar(20),
    "gender" varchar(20) CHECK ((gender)::text = ANY ((ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'OTHER'::character varying])::text[])),
    "date_of_birth" date,
    "staff_type" varchar(50) CHECK ((staff_type)::text = ANY ((ARRAY['NURSE'::character varying, 'RECEPTIONIST'::character varying, 'PHARMACIST'::character varying, 'LAB_TECHNICIAN'::character varying, 'RADIOLOGIST'::character varying, 'ADMIN_STAFF'::character varying, 'SUPPORT_STAFF'::character varying])::text[])),
    "qualification" varchar(255),
    "specialization" varchar(100),
    "experience_years" int4,
    "joining_date" date NOT NULL,
    "employment_status" varchar(30) CHECK ((employment_status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'ON_LEAVE'::character varying, 'SUSPENDED'::character varying, 'TERMINATED'::character varying, 'RESIGNED'::character varying])::text[])),
    "department_id" int8,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp,
    "is_active" bool DEFAULT true,
    PRIMARY KEY ("staff_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS staff_assignments_assignment_id_seq;

-- Table Definition
CREATE TABLE "public"."staff_assignments" (
    "assignment_id" int8 NOT NULL DEFAULT nextval('staff_assignments_assignment_id_seq'::regclass),
    "staff_id" int8 NOT NULL,
    "ward_id" int8,
    "department_id" int8,
    "shift_id" int8 NOT NULL,
    "assignment_date" date NOT NULL,
    "assignment_type" varchar(30) CHECK ((assignment_type)::text = ANY ((ARRAY['REGULAR'::character varying, 'EMERGENCY'::character varying, 'TEMPORARY'::character varying])::text[])),
    "status" varchar(20) CHECK ((status)::text = ANY ((ARRAY['SCHEDULED'::character varying, 'ACTIVE'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])),
    "notes" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("assignment_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS staff_shifts_shift_id_seq;

-- Table Definition
CREATE TABLE "public"."staff_shifts" (
    "shift_id" int8 NOT NULL DEFAULT nextval('staff_shifts_shift_id_seq'::regclass),
    "shift_name" varchar(50) NOT NULL,
    "start_time" time NOT NULL,
    "end_time" time NOT NULL,
    "description" text,
    "is_active" bool DEFAULT true,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("shift_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS nursing_notes_note_id_seq;

-- Table Definition
CREATE TABLE "public"."nursing_notes" (
    "note_id" int8 NOT NULL DEFAULT nextval('nursing_notes_note_id_seq'::regclass),
    "patient_id" int8 NOT NULL,
    "bed_assignment_id" int8,
    "nurse_id" int8 NOT NULL,
    "note_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "note_type" varchar(50) CHECK ((note_type)::text = ANY ((ARRAY['GENERAL'::character varying, 'MEDICATION'::character varying, 'VITAL_SIGNS'::character varying, 'PROCEDURE'::character varying, 'OBSERVATION'::character varying, 'INCIDENT'::character varying])::text[])),
    "note_text" text NOT NULL,
    "action_taken" text,
    "is_critical" bool DEFAULT false,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("note_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS discharge_summaries_summary_id_seq;

-- Table Definition
CREATE TABLE "public"."discharge_summaries" (
    "summary_id" int8 NOT NULL DEFAULT nextval('discharge_summaries_summary_id_seq'::regclass),
    "patient_id" int8 NOT NULL,
    "bed_assignment_id" int8 NOT NULL,
    "admission_date" timestamp NOT NULL,
    "discharge_date" timestamp NOT NULL,
    "total_days" int4,
    "discharge_type" varchar(50) CHECK ((discharge_type)::text = ANY ((ARRAY['NORMAL'::character varying, 'AGAINST_ADVICE'::character varying, 'TRANSFERRED'::character varying, 'ABSCONDED'::character varying, 'DEATH'::character varying])::text[])),
    "final_diagnosis" text NOT NULL,
    "treatment_summary" text,
    "surgery_procedures" text,
    "investigations_done" text,
    "condition_at_discharge" varchar(50) CHECK ((condition_at_discharge)::text = ANY ((ARRAY['STABLE'::character varying, 'CRITICAL'::character varying, 'IMPROVED'::character varying, 'UNCHANGED'::character varying, 'DETERIORATED'::character varying])::text[])),
    "follow_up_instructions" text,
    "follow_up_date" date,
    "medications_on_discharge" text,
    "diet_advice" text,
    "activity_restrictions" text,
    "doctor_id" int8 NOT NULL,
    "prepared_by" varchar(100),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp,
    PRIMARY KEY ("summary_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS activity_logs_log_id_seq;

-- Table Definition
CREATE TABLE "public"."activity_logs" (
    "log_id" int8 NOT NULL DEFAULT nextval('activity_logs_log_id_seq'::regclass),
    "user_id" int8,
    "user_role" varchar(50),
    "action_type" varchar(50) NOT NULL,
    "module" varchar(100) NOT NULL,
    "entity_type" varchar(100),
    "entity_id" int8,
    "action_description" text,
    "ip_address" varchar(45),
    "user_agent" text,
    "old_values" jsonb,
    "new_values" jsonb,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("log_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS notifications_notification_id_seq;

-- Table Definition
CREATE TABLE "public"."notifications" (
    "notification_id" int8 NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
    "user_id" int8 NOT NULL,
    "notification_type" varchar(50) CHECK ((notification_type)::text = ANY ((ARRAY['APPOINTMENT'::character varying, 'BILLING'::character varying, 'PRESCRIPTION'::character varying, 'RESULT'::character varying, 'GENERAL'::character varying])::text[])),
    "title" varchar(255) NOT NULL,
    "message" text NOT NULL,
    "priority" varchar(20) CHECK ((priority)::text = ANY ((ARRAY['LOW'::character varying, 'NORMAL'::character varying, 'HIGH'::character varying, 'URGENT'::character varying])::text[])),
    "is_read" bool DEFAULT false,
    "read_at" timestamp,
    "link" varchar(500),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("notification_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sms_email_logs_log_id_seq;

-- Table Definition
CREATE TABLE "public"."sms_email_logs" (
    "log_id" int8 NOT NULL DEFAULT nextval('sms_email_logs_log_id_seq'::regclass),
    "communication_type" varchar(20) CHECK ((communication_type)::text = ANY ((ARRAY['SMS'::character varying, 'EMAIL'::character varying])::text[])),
    "recipient" varchar(255) NOT NULL,
    "subject" varchar(500),
    "message" text NOT NULL,
    "purpose" varchar(50),
    "status" varchar(20) CHECK ((status)::text = ANY ((ARRAY['PENDING'::character varying, 'SENT'::character varying, 'FAILED'::character varying, 'DELIVERED'::character varying])::text[])),
    "provider" varchar(50),
    "provider_response" text,
    "sent_at" timestamp,
    "delivered_at" timestamp,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("log_id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bed_wards_id_seq;

-- Table Definition
CREATE TABLE "public"."bed_wards" (
    "id" int8 NOT NULL DEFAULT nextval('bed_wards_id_seq'::regclass),
    "available_beds" int4 NOT NULL CHECK (available_beds >= 0),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "floor_number" int4 NOT NULL CHECK (floor_number >= 0),
    "is_active" bool,
    "phone" varchar(20),
    "total_beds" int4 NOT NULL CHECK (total_beds >= 1),
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "ward_code" varchar(20) NOT NULL,
    "ward_name" varchar(100) NOT NULL,
    "ward_type" varchar(50) NOT NULL CHECK ((ward_type)::text = ANY ((ARRAY['GENERAL'::character varying, 'ICU'::character varying, 'NICU'::character varying, 'PICU'::character varying, 'CCU'::character varying, 'EMERGENCY'::character varying, 'MATERNITY'::character varying])::text[])),
    "department_id" int8 NOT NULL,
    "incharge_nurse_id" int8,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS beds_id_seq;

-- Table Definition
CREATE TABLE "public"."beds" (
    "id" int8 NOT NULL DEFAULT nextval('beds_id_seq'::regclass),
    "bed_code" varchar(20) NOT NULL,
    "bed_number" varchar(20) NOT NULL,
    "bed_type" varchar(50) NOT NULL CHECK ((bed_type)::text = ANY ((ARRAY['STANDARD'::character varying, 'DELUXE'::character varying, 'ICU'::character varying, 'VENTILATOR'::character varying])::text[])),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "daily_charge" numeric(10,2) NOT NULL,
    "has_monitor" bool,
    "has_oxygen" bool,
    "has_ventilator" bool,
    "is_active" bool,
    "status" varchar(50) NOT NULL CHECK ((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'OCCUPIED'::character varying, 'MAINTENANCE'::character varying, 'RESERVED'::character varying])::text[])),
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "ward_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS appointments_id_seq;

-- Table Definition
CREATE TABLE "public"."appointments" (
    "id" int8 NOT NULL DEFAULT nextval('appointments_id_seq'::regclass),
    "appointment_code" varchar(20) NOT NULL,
    "appointment_date" date NOT NULL,
    "appointment_time" time NOT NULL,
    "appointment_type" varchar(50) NOT NULL CHECK ((appointment_type)::text = ANY ((ARRAY['CONSULTATION'::character varying, 'FOLLOW_UP'::character varying, 'EMERGENCY'::character varying, 'CHECKUP'::character varying, 'PROCEDURE'::character varying])::text[])),
    "cancellation_reason" text,
    "cancelled_at" timestamp,
    "cancelled_by" varchar(100),
    "consultation_fee" numeric(10,2),
    "created_at" timestamp NOT NULL,
    "created_by" varchar(255),
    "is_active" bool,
    "notes" text,
    "priority" varchar(20) CHECK ((priority)::text = ANY ((ARRAY['LOW'::character varying, 'NORMAL'::character varying, 'HIGH'::character varying, 'EMERGENCY'::character varying])::text[])),
    "reason" text NOT NULL,
    "status" varchar(50) NOT NULL CHECK ((status)::text = ANY ((ARRAY['SCHEDULED'::character varying, 'CONFIRMED'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying, 'NO_SHOW'::character varying])::text[])),
    "symptoms" text,
    "updated_at" timestamp,
    "updated_by" varchar(255),
    "department_id" int8 NOT NULL,
    "doctor_id" int8 NOT NULL,
    "patient_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

CREATE VIEW "public"."vw_patient_billing_summary" AS ;
CREATE VIEW "public"."vw_todays_appointments" AS ;
CREATE VIEW "public"."vw_bed_occupancy" AS ;
CREATE VIEW "public"."vw_doctor_performance" AS ;
CREATE VIEW "public"."vw_active_bed_assignments" AS ;
;
;
;
ALTER TABLE "public"."otp_verification" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;


-- Indices
CREATE INDEX idx_otp_user ON public.otp_verification USING btree (user_id);
CREATE INDEX idx_otp_expires ON public.otp_verification USING btree (expires_at);
CREATE INDEX idx_otp_email ON public.otp_verification USING btree (email);
CREATE INDEX idx_otp_mobile ON public.otp_verification USING btree (mobile);


-- Indices
CREATE UNIQUE INDEX role_permissions_role_module_key ON public.role_permissions USING btree (role, module);


-- Indices
CREATE INDEX idx_user_username ON public.users USING btree (username);
CREATE INDEX idx_user_email ON public.users USING btree (email);
CREATE UNIQUE INDEX uk_6dotkott2kjsp8vw4d0m25fb7 ON public.users USING btree (email);
ALTER TABLE "public"."insurance_details" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");


-- Indices
CREATE UNIQUE INDEX uk_83w4dr8p6o0a7ltgw56fs5ph3 ON public.insurance_details USING btree (policy_number);
CREATE UNIQUE INDEX uk_aqjxdm8nqt71gnai5mdyfn68k ON public.insurance_details USING btree (patient_id);
ALTER TABLE "public"."user_sessions" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."bill_master" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."bill_master" ADD FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment_details"("id");
ALTER TABLE "public"."bill_master" ADD FOREIGN KEY ("bed_assignment_id") REFERENCES "public"."bed_assignments"("id");


-- Indices
CREATE UNIQUE INDEX bill_master_bill_number_key ON public.bill_master USING btree (bill_number);
CREATE INDEX idx_bill_patient ON public.bill_master USING btree (patient_id);
CREATE INDEX idx_bill_date ON public.bill_master USING btree (bill_date);
CREATE INDEX idx_bill_status ON public.bill_master USING btree (payment_status);
CREATE INDEX idx_bill_number ON public.bill_master USING btree (bill_number);
ALTER TABLE "public"."bed_assignments" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."bed_assignments" ADD FOREIGN KEY ("assigned_by_doctor_id") REFERENCES "public"."doctor_details"("id");
ALTER TABLE "public"."bed_assignments" ADD FOREIGN KEY ("bed_id") REFERENCES "public"."bed_details"("id");


-- Indices
CREATE INDEX idx_assignment_code ON public.bed_assignments USING btree (assignment_code);
CREATE INDEX idx_assignment_patient ON public.bed_assignments USING btree (patient_id);
CREATE INDEX idx_assignment_status ON public.bed_assignments USING btree (status);
CREATE UNIQUE INDEX uk_k1de7vnt8s3hl35um7cdrtmnu ON public.bed_assignments USING btree (assignment_code);
ALTER TABLE "public"."ward_details" ADD FOREIGN KEY ("department_id") REFERENCES "public"."department_details"("id");
ALTER TABLE "public"."ward_details" ADD FOREIGN KEY ("incharge_nurse_id") REFERENCES "public"."users"("id");


-- Indices
CREATE UNIQUE INDEX bed_wards_pkey ON public.ward_details USING btree (id);
CREATE UNIQUE INDEX uk_i9bpeh8eesxm8ac8lnwby458i ON public.ward_details USING btree (ward_code);
CREATE UNIQUE INDEX uk_5k1j4jx0m2r2uump1ifq55g49 ON public.ward_details USING btree (ward_name);
CREATE INDEX idx_ward_details_code ON public.ward_details USING btree (ward_code);
CREATE INDEX idx_ward_details_name ON public.ward_details USING btree (ward_name);
ALTER TABLE "public"."appointment_details" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."appointment_details" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");
ALTER TABLE "public"."appointment_details" ADD FOREIGN KEY ("department_id") REFERENCES "public"."department_details"("id");


-- Indices
CREATE UNIQUE INDEX appointments_pkey ON public.appointment_details USING btree (id);
CREATE UNIQUE INDEX uk_88w59a3uq8pvoxypr2ejldy0h ON public.appointment_details USING btree (appointment_code);
CREATE INDEX idx_appointment_details_code ON public.appointment_details USING btree (appointment_code);
CREATE INDEX idx_appointment_details_patient ON public.appointment_details USING btree (patient_id);
CREATE INDEX idx_appointment_details_doctor ON public.appointment_details USING btree (doctor_id);
CREATE INDEX idx_appointment_details_date ON public.appointment_details USING btree (appointment_date);
CREATE INDEX idx_appointment_details_status ON public.appointment_details USING btree (status);
ALTER TABLE "public"."bed_details" ADD FOREIGN KEY ("ward_id") REFERENCES "public"."ward_details"("id");


-- Indices
CREATE UNIQUE INDEX beds_pkey ON public.bed_details USING btree (id);
CREATE UNIQUE INDEX ukn6v9j8hsnno8ln6diwrw05hno ON public.bed_details USING btree (ward_id, bed_number);
CREATE UNIQUE INDEX uk_36skhe0vvn1on1cdnqq2a34n7 ON public.bed_details USING btree (bed_code);
CREATE INDEX idx_bed_details_code ON public.bed_details USING btree (bed_code);
CREATE INDEX idx_bed_details_status ON public.bed_details USING btree (status);
CREATE INDEX idx_bed_details_ward ON public.bed_details USING btree (ward_id);
CREATE UNIQUE INDEX ukrejmjupes9nf0nlnyyiv9cqj9 ON public.bed_details USING btree (ward_id, bed_number);
ALTER TABLE "public"."emergency_contacts" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."medical_records" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."medical_records" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");


-- Indices
CREATE INDEX idx_medical_record_patient ON public.medical_records USING btree (patient_id);
CREATE INDEX idx_medical_record_doctor ON public.medical_records USING btree (doctor_id);
CREATE INDEX idx_medical_record_date ON public.medical_records USING btree (record_date);
ALTER TABLE "public"."doctor_departments" ADD FOREIGN KEY ("department_id") REFERENCES "public"."department_details"("id");
ALTER TABLE "public"."doctor_departments" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");
ALTER TABLE "public"."department_details" ADD FOREIGN KEY ("head_doctor_id") REFERENCES "public"."doctor_details"("id");


-- Indices
CREATE UNIQUE INDEX departments_pkey ON public.department_details USING btree (id);
CREATE UNIQUE INDEX uk_89g8qie2y696a3tarmty43sq9 ON public.department_details USING btree (department_code);
CREATE UNIQUE INDEX uk_qyf2ekbfpnddm6f3rkgt39i9o ON public.department_details USING btree (department_name);
CREATE INDEX idx_department_details_code ON public.department_details USING btree (department_code);
CREATE INDEX idx_department_details_name ON public.department_details USING btree (department_name);
ALTER TABLE "public"."doctor_schedules" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");


-- Indices
CREATE UNIQUE INDEX ukikf4casiw3es8690kql547pc2 ON public.doctor_schedules USING btree (doctor_id, day_of_week, start_time);
ALTER TABLE "public"."doctor_details" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


-- Indices
CREATE UNIQUE INDEX doctors_pkey ON public.doctor_details USING btree (id);
CREATE INDEX idx_doctor_license ON public.doctor_details USING btree (license_number);
CREATE UNIQUE INDEX uk_m9b9dtrqd29msht6lwqp0y1aw ON public.doctor_details USING btree (doctor_code);
CREATE UNIQUE INDEX uk_caifv0va46t2mu85cg5afmayf ON public.doctor_details USING btree (email);
CREATE UNIQUE INDEX uk_1xu5x0jae737xae254t4rgcd1 ON public.doctor_details USING btree (license_number);
CREATE INDEX idx_doctor_details_code ON public.doctor_details USING btree (doctor_code);
CREATE INDEX idx_doctor_details_email ON public.doctor_details USING btree (email);
CREATE INDEX idx_doctor_details_specialization ON public.doctor_details USING btree (specialization);
ALTER TABLE "public"."patient_details" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


-- Indices
CREATE UNIQUE INDEX patients_pkey ON public.patient_details USING btree (id);
CREATE INDEX idx_patient_code ON public.patient_details USING btree (patient_code);
CREATE UNIQUE INDEX uk_pdu5f0e015icwwcx7otn46rv8 ON public.patient_details USING btree (patient_code);
CREATE INDEX idx_patient_details_code ON public.patient_details USING btree (patient_code);
CREATE INDEX idx_patient_details_phone ON public.patient_details USING btree (phone_primary);
CREATE INDEX idx_patient_details_email ON public.patient_details USING btree (email);
ALTER TABLE "public"."bill_items" ADD FOREIGN KEY ("bill_id") REFERENCES "public"."bill_master"("bill_id") ON DELETE CASCADE;
ALTER TABLE "public"."payment_transactions" ADD FOREIGN KEY ("bill_id") REFERENCES "public"."bill_master"("bill_id");


-- Indices
CREATE UNIQUE INDEX payment_transactions_transaction_number_key ON public.payment_transactions USING btree (transaction_number);
CREATE INDEX idx_payment_bill ON public.payment_transactions USING btree (bill_id);
CREATE INDEX idx_payment_date ON public.payment_transactions USING btree (payment_date);
CREATE INDEX idx_payment_status ON public.payment_transactions USING btree (payment_status);
ALTER TABLE "public"."patient_vitals" ADD FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment_details"("id");
ALTER TABLE "public"."patient_vitals" ADD FOREIGN KEY ("bed_assignment_id") REFERENCES "public"."bed_assignments"("id");
ALTER TABLE "public"."patient_vitals" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");


-- Indices
CREATE INDEX idx_vitals_patient ON public.patient_vitals USING btree (patient_id);
CREATE INDEX idx_vitals_date ON public.patient_vitals USING btree (recorded_at);
ALTER TABLE "public"."insurance_claims" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."insurance_claims" ADD FOREIGN KEY ("bill_id") REFERENCES "public"."bill_master"("bill_id");
ALTER TABLE "public"."insurance_claims" ADD FOREIGN KEY ("insurance_id") REFERENCES "public"."insurance_details"("id");


-- Indices
CREATE UNIQUE INDEX insurance_claims_claim_number_key ON public.insurance_claims USING btree (claim_number);


-- Indices
CREATE UNIQUE INDEX ward_types_type_code_key ON public.ward_types USING btree (type_code);
ALTER TABLE "public"."bed_maintenance" ADD FOREIGN KEY ("bed_id") REFERENCES "public"."bed_details"("id");
ALTER TABLE "public"."bed_transfer_history" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."bed_transfer_history" ADD FOREIGN KEY ("to_bed_id") REFERENCES "public"."bed_details"("id");
ALTER TABLE "public"."bed_transfer_history" ADD FOREIGN KEY ("from_bed_id") REFERENCES "public"."bed_details"("id");
ALTER TABLE "public"."prescriptions" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."prescriptions" ADD FOREIGN KEY ("medical_record_id") REFERENCES "public"."medical_records"("id");
ALTER TABLE "public"."prescriptions" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");
ALTER TABLE "public"."prescriptions" ADD FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment_details"("id");


-- Indices
CREATE UNIQUE INDEX prescriptions_prescription_number_key ON public.prescriptions USING btree (prescription_number);
CREATE INDEX idx_prescription_patient ON public.prescriptions USING btree (patient_id);
CREATE INDEX idx_prescription_doctor ON public.prescriptions USING btree (doctor_id);
CREATE INDEX idx_prescription_date ON public.prescriptions USING btree (prescription_date);
ALTER TABLE "public"."prescription_items" ADD FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions"("prescription_id") ON DELETE CASCADE;
ALTER TABLE "public"."medical_record_diagnoses" ADD FOREIGN KEY ("diagnosis_code_id") REFERENCES "public"."diagnosis_codes"("code_id");
ALTER TABLE "public"."medical_record_diagnoses" ADD FOREIGN KEY ("medical_record_id") REFERENCES "public"."medical_records"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX diagnosis_codes_icd_code_key ON public.diagnosis_codes USING btree (icd_code);
ALTER TABLE "public"."appointment_queue" ADD FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment_details"("id") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX appointment_queue_appointment_id_key ON public.appointment_queue USING btree (appointment_id);
CREATE INDEX idx_queue_date ON public.appointment_queue USING btree (queue_date);
CREATE INDEX idx_queue_status ON public.appointment_queue USING btree (queue_status);
ALTER TABLE "public"."doctor_time_slots" ADD FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment_details"("id");
ALTER TABLE "public"."doctor_time_slots" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");
ALTER TABLE "public"."doctor_time_slots" ADD FOREIGN KEY ("schedule_id") REFERENCES "public"."doctor_schedules"("id");


-- Indices
CREATE UNIQUE INDEX doctor_time_slots_doctor_id_slot_date_slot_time_key ON public.doctor_time_slots USING btree (doctor_id, slot_date, slot_time);
ALTER TABLE "public"."staff_profiles" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");
ALTER TABLE "public"."staff_profiles" ADD FOREIGN KEY ("department_id") REFERENCES "public"."department_details"("id");


-- Indices
CREATE UNIQUE INDEX staff_profiles_staff_code_key ON public.staff_profiles USING btree (staff_code);
CREATE UNIQUE INDEX staff_profiles_user_id_key ON public.staff_profiles USING btree (user_id);
CREATE UNIQUE INDEX staff_profiles_email_key ON public.staff_profiles USING btree (email);
CREATE INDEX idx_staff_type ON public.staff_profiles USING btree (staff_type);
CREATE INDEX idx_staff_department ON public.staff_profiles USING btree (department_id);
ALTER TABLE "public"."staff_assignments" ADD FOREIGN KEY ("ward_id") REFERENCES "public"."ward_details"("id");
ALTER TABLE "public"."staff_assignments" ADD FOREIGN KEY ("department_id") REFERENCES "public"."department_details"("id");
ALTER TABLE "public"."staff_assignments" ADD FOREIGN KEY ("shift_id") REFERENCES "public"."staff_shifts"("shift_id");
ALTER TABLE "public"."staff_assignments" ADD FOREIGN KEY ("staff_id") REFERENCES "public"."staff_profiles"("staff_id");
ALTER TABLE "public"."nursing_notes" ADD FOREIGN KEY ("nurse_id") REFERENCES "public"."staff_profiles"("staff_id");
ALTER TABLE "public"."nursing_notes" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."nursing_notes" ADD FOREIGN KEY ("bed_assignment_id") REFERENCES "public"."bed_assignments"("id");
ALTER TABLE "public"."discharge_summaries" ADD FOREIGN KEY ("bed_assignment_id") REFERENCES "public"."bed_assignments"("id");
ALTER TABLE "public"."discharge_summaries" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");
ALTER TABLE "public"."discharge_summaries" ADD FOREIGN KEY ("patient_id") REFERENCES "public"."patient_details"("id");
ALTER TABLE "public"."activity_logs" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


-- Indices
CREATE INDEX idx_activity_user ON public.activity_logs USING btree (user_id);
CREATE INDEX idx_activity_date ON public.activity_logs USING btree (created_at);
CREATE INDEX idx_activity_module ON public.activity_logs USING btree (module);
ALTER TABLE "public"."notifications" ADD FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."bed_wards" ADD FOREIGN KEY ("incharge_nurse_id") REFERENCES "public"."users"("id");


-- Indices
CREATE UNIQUE INDEX bed_wards_pkey1 ON public.bed_wards USING btree (id);
ALTER TABLE "public"."beds" ADD FOREIGN KEY ("ward_id") REFERENCES "public"."bed_wards"("id");


-- Indices
CREATE UNIQUE INDEX beds_pkey1 ON public.beds USING btree (id);
ALTER TABLE "public"."appointments" ADD FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor_details"("id");


-- Indices
CREATE UNIQUE INDEX appointments_pkey1 ON public.appointments USING btree (id);
