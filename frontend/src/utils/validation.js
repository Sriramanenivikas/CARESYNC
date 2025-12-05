/**
 * Form validation utilities
 */

import { 
  validateEmail, 
  validatePhone, 
  validatePassword, 
  validateUsername, 
  validateName,
  validateNumber,
  validateSecureInput,
  validateDate,
} from './security';

export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  } else {
    const usernameResult = validateUsername(data.username);
    if (!usernameResult.isValid) {
      errors.username = usernameResult.error;
    }
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate patient registration/update form
 */
export const validatePatientForm = (data) => {
  const errors = {};

  // First Name
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else {
    const result = validateName(data.firstName, 'First name');
    if (!result.isValid) errors.firstName = result.error;
  }

  // Last Name
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else {
    const result = validateName(data.lastName, 'Last name');
    if (!result.isValid) errors.lastName = result.error;
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    try {
      const result = validateEmail(data.email);
      if (!result.isValid) errors.email = result.error;
    } catch (e) {
      errors.email = 'Invalid email format. Please use format: user@example.com';
    }
  }

  // Phone
  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const result = validatePhone(data.phone);
    if (!result.isValid) errors.phone = result.error;
  }

  // Date of Birth
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const date = new Date(data.dateOfBirth);
    const today = new Date();
    if (isNaN(date.getTime())) {
      errors.dateOfBirth = 'Please enter a valid date';
    } else if (date > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    } else if (date < new Date('1900-01-01')) {
      errors.dateOfBirth = 'Please enter a valid date of birth';
    }
  }

  // Gender
  if (!data.gender) {
    errors.gender = 'Gender is required';
  } else if (!['MALE', 'FEMALE', 'OTHER'].includes(data.gender)) {
    errors.gender = 'Please select a valid gender';
  }

  // Address (optional but validate if provided)
  if (data.address) {
    const result = validateSecureInput(data.address, 'Address');
    if (!result.isValid) errors.address = result.errors[0];
  }

  // Blood Group (optional)
  if (data.bloodGroup) {
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(data.bloodGroup)) {
      errors.bloodGroup = 'Please select a valid blood group';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate doctor form
 */
export const validateDoctorForm = (data) => {
  const errors = {};

  // First Name
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else {
    const result = validateName(data.firstName, 'First name');
    if (!result.isValid) errors.firstName = result.error;
  }

  // Last Name
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else {
    const result = validateName(data.lastName, 'Last name');
    if (!result.isValid) errors.lastName = result.error;
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    try {
      const result = validateEmail(data.email);
      if (!result.isValid) errors.email = result.error;
    } catch (e) {
      errors.email = 'Invalid email format. Please use format: user@example.com';
    }
  }

  // Phone
  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const result = validatePhone(data.phone);
    if (!result.isValid) errors.phone = result.error;
  }

  // Specialization
  if (!data.specialization?.trim()) {
    errors.specialization = 'Specialization is required';
  } else {
    const result = validateSecureInput(data.specialization, 'Specialization');
    if (!result.isValid) errors.specialization = result.errors[0];
  }

  // License Number
  if (!data.licenseNumber?.trim()) {
    errors.licenseNumber = 'License number is required';
  } else if (!/^[A-Z0-9-]{5,20}$/.test(data.licenseNumber)) {
    errors.licenseNumber = 'Please enter a valid license number';
  }

  // Experience Years (optional)
  if (data.experienceYears !== undefined && data.experienceYears !== '') {
    const result = validateNumber(data.experienceYears, { 
      min: 0, 
      max: 70, 
      integer: true, 
      fieldName: 'Experience years' 
    });
    if (!result.isValid) errors.experienceYears = result.error;
  }

  // Consultation Fee
  if (data.consultationFee !== undefined && data.consultationFee !== '') {
    const result = validateNumber(data.consultationFee, { 
      min: 0, 
      max: 100000, 
      fieldName: 'Consultation fee' 
    });
    if (!result.isValid) errors.consultationFee = result.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate appointment form
 */
export const validateAppointmentForm = (data) => {
  const errors = {};

  // Patient ID
  if (!data.patientId) {
    errors.patientId = 'Please select a patient';
  }

  // Doctor ID
  if (!data.doctorId) {
    errors.doctorId = 'Please select a doctor';
  }

  // Appointment Date & Time
  if (!data.appointmentDateTime) {
    errors.appointmentDateTime = 'Appointment date and time is required';
  } else {
    const appointmentDate = new Date(data.appointmentDateTime);
    const now = new Date();
    
    if (isNaN(appointmentDate.getTime())) {
      errors.appointmentDateTime = 'Please enter a valid date and time';
    } else if (appointmentDate < now) {
      errors.appointmentDateTime = 'Appointment must be scheduled for future';
    }
    
    // Check if within working hours (8 AM - 8 PM)
    const hours = appointmentDate.getHours();
    if (hours < 8 || hours >= 20) {
      errors.appointmentDateTime = 'Appointments can only be scheduled between 8 AM and 8 PM';
    }
  }

  // Status (if updating)
  if (data.status) {
    const validStatuses = ['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
    if (!validStatuses.includes(data.status)) {
      errors.status = 'Please select a valid status';
    }
  }

  // Notes (optional)
  if (data.notes) {
    const result = validateSecureInput(data.notes, 'Notes');
    if (!result.isValid) errors.notes = result.errors[0];
    if (data.notes.length > 500) {
      errors.notes = 'Notes cannot exceed 500 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate prescription form
 */
export const validatePrescriptionForm = (data) => {
  const errors = {};

  // Patient ID
  if (!data.patientId) {
    errors.patientId = 'Please select a patient';
  }

  // Doctor ID
  if (!data.doctorId) {
    errors.doctorId = 'Please select a doctor';
  }

  // Medication Name
  if (!data.medicationName?.trim()) {
    errors.medicationName = 'Medication name is required';
  } else {
    const result = validateSecureInput(data.medicationName, 'Medication name');
    if (!result.isValid) errors.medicationName = result.errors[0];
    if (data.medicationName.length > 200) {
      errors.medicationName = 'Medication name cannot exceed 200 characters';
    }
  }

  // Dosage
  if (!data.dosage?.trim()) {
    errors.dosage = 'Dosage is required';
  } else {
    const result = validateSecureInput(data.dosage, 'Dosage');
    if (!result.isValid) errors.dosage = result.errors[0];
  }

  // Frequency
  if (!data.frequency?.trim()) {
    errors.frequency = 'Frequency is required';
  } else {
    const result = validateSecureInput(data.frequency, 'Frequency');
    if (!result.isValid) errors.frequency = result.errors[0];
  }

  // Duration
  if (!data.duration?.trim()) {
    errors.duration = 'Duration is required';
  } else {
    const result = validateSecureInput(data.duration, 'Duration');
    if (!result.isValid) errors.duration = result.errors[0];
  }

  // Instructions (optional)
  if (data.instructions) {
    const result = validateSecureInput(data.instructions, 'Instructions');
    if (!result.isValid) errors.instructions = result.errors[0];
    if (data.instructions.length > 1000) {
      errors.instructions = 'Instructions cannot exceed 1000 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate bill form
 */
export const validateBillForm = (data) => {
  const errors = {};

  // Patient ID
  if (!data.patientId) {
    errors.patientId = 'Please select a patient';
  }

  // Amount
  if (data.amount === undefined || data.amount === '') {
    errors.amount = 'Amount is required';
  } else {
    const result = validateNumber(data.amount, { 
      min: 0, 
      max: 10000000, 
      fieldName: 'Amount' 
    });
    if (!result.isValid) errors.amount = result.error;
  }

  // Description
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else {
    const result = validateSecureInput(data.description, 'Description');
    if (!result.isValid) errors.description = result.errors[0];
    if (data.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
  }

  // Status
  if (data.status) {
    const validStatuses = ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'];
    if (!validStatuses.includes(data.status)) {
      errors.status = 'Please select a valid status';
    }
  }

  // Due Date (optional)
  if (data.dueDate) {
    const result = validateDate(data.dueDate);
    if (!result.isValid) errors.dueDate = result.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate user registration form
 */
export const validateUserForm = (data, isUpdate = false) => {
  const errors = {};

  // Username
  if (!data.username?.trim()) {
    errors.username = 'Username is required';
  } else {
    const result = validateUsername(data.username);
    if (!result.isValid) errors.username = result.error;
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else {
    try {
      const result = validateEmail(data.email);
      if (!result.isValid) errors.email = result.error;
    } catch (e) {
      errors.email = 'Invalid email format. Please use format: user@example.com';
    }
  }

  // Password (required for new users)
  if (!isUpdate) {
    if (!data.password) {
      errors.password = 'Password is required';
    } else {
      const result = validatePassword(data.password);
      if (!result.isValid) {
        errors.password = result.errors[0];
      }
    }

    // Confirm Password
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  } else if (data.password) {
    // If updating and password provided, validate it
    const result = validatePassword(data.password);
    if (!result.isValid) {
      errors.password = result.errors[0];
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  // Role
  if (!data.role) {
    errors.role = 'Role is required';
  } else {
    const validRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'];
    if (!validRoles.includes(data.role)) {
      errors.role = 'Please select a valid role';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get field error class
 */
export const getFieldErrorClass = (errors, fieldName) => {
  return errors[fieldName] ? 'input-error' : '';
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

export default {
  validateLoginForm,
  validatePatientForm,
  validateDoctorForm,
  validateAppointmentForm,
  validatePrescriptionForm,
  validateBillForm,
  validateUserForm,
  getFieldErrorClass,
  hasErrors,
};
