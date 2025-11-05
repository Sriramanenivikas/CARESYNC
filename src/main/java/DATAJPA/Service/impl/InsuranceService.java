package DATAJPA.Service.impl;

import DATAJPA.Entity.Insurance;
import DATAJPA.Entity.Patient;
import DATAJPA.Repository.InsuranceRepository;
import DATAJPA.Repository.PatientRepository;
import DATAJPA.Service.InsuranceServise;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class InsuranceService implements InsuranceServise {
    private final InsuranceRepository insuranceRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Insurance assignInsuranceToPatient(Insurance insurance, Long patientId) {
        log.info("Attempting to assign insurance to patient with ID: {}", patientId);

        // Validate input parameters
        if (insurance == null) {
            log.error("Insurance object cannot be null");
            throw new IllegalArgumentException("Insurance object cannot be null");
        }

        if (patientId == null) {
            log.error("Patient ID cannot be null");
            throw new IllegalArgumentException("Patient ID cannot be null");
        }

        // Validate required insurance fields
        validateInsurance(insurance);

        // Fetch patient
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> {
                    log.error("Patient not found with id: {}", patientId);
                    return new RuntimeException("Patient not found with id: " + patientId);
                });

        // Check if patient already has insurance
        if (patient.getInsurance() != null) {
            log.warn("Patient {} already has insurance with policy number: {}. Updating to new insurance.",
                    patientId, patient.getInsurance().getPolicyNumber());
            // Remove old insurance
            Insurance oldInsurance = patient.getInsurance();
            patient.setInsurance(null);
            oldInsurance.setPatient(null);
            insuranceRepository.delete(oldInsurance);
        }

        // Check if insurance policy number already exists
        insuranceRepository.findByPolicyNumber(insurance.getPolicyNumber())
                .ifPresent(existingInsurance -> {
                    log.error("Insurance policy number {} already exists", insurance.getPolicyNumber());
                    throw new IllegalArgumentException("Insurance policy number already exists: " + insurance.getPolicyNumber());
                });

        // Set bidirectional relationship
        insurance.setPatient(patient);
        patient.setInsurance(insurance);

        // Set default values if not provided
        if (insurance.getIsActive() == null) {
            insurance.setIsActive(true);
        }

        // Validate coverage dates
        if (insurance.getCoverageEndDate() != null &&
            insurance.getCoverageStartDate() != null &&
            insurance.getCoverageEndDate().isBefore(insurance.getCoverageStartDate())) {
            log.error("Coverage end date cannot be before start date");
            throw new IllegalArgumentException("Coverage end date cannot be before start date");
        }

        // Save and flush to ensure bidirectional relationship is persisted
        Insurance savedInsurance = insuranceRepository.save(insurance);
        patientRepository.save(patient);

        log.info("Successfully assigned insurance with policy number {} to patient {}",
                savedInsurance.getPolicyNumber(), patientId);

        return savedInsurance;
    }

    @Transactional
    public void removeInsuranceFromPatient(Long insuranceId) {
        log.info("Attempting to remove insurance with ID: {}", insuranceId);

        if (insuranceId == null) {
            log.error("Insurance ID cannot be null");
            throw new IllegalArgumentException("Insurance ID cannot be null");
        }

        Insurance insurance = insuranceRepository.findById(insuranceId)
                .orElseThrow(() -> {
                    log.error("Insurance not found with id: {}", insuranceId);
                    return new RuntimeException("Insurance not found with id: " + insuranceId);
                });

        Patient patient = insurance.getPatient();

        if (patient != null) {
            // Remove bidirectional relationship
            patient.setInsurance(null);
            insurance.setPatient(null);
            patientRepository.save(patient);
            log.info("Removed insurance {} from patient {}", insuranceId, patient.getId());
        } else {
            log.warn("Insurance {} is not associated with any patient", insuranceId);
        }

        insuranceRepository.save(insurance);
        log.info("Successfully removed insurance association for insurance ID: {}", insuranceId);
    }

    @Transactional
    public void deleteInsurance(Long insuranceId) {
        log.info("Attempting to delete insurance with ID: {}", insuranceId);

        if (insuranceId == null) {
            log.error("Insurance ID cannot be null");
            throw new IllegalArgumentException("Insurance ID cannot be null");
        }

        Insurance insurance = insuranceRepository.findById(insuranceId)
                .orElseThrow(() -> {
                    log.error("Insurance not found with id: {}", insuranceId);
                    return new RuntimeException("Insurance not found with id: " + insuranceId);
                });

        Patient patient = insurance.getPatient();

        if (patient != null) {
            // Remove bidirectional relationship before deletion
            patient.setInsurance(null);
            patientRepository.save(patient);
            log.info("Removed insurance association from patient {} before deletion", patient.getId());
        }

        insuranceRepository.delete(insurance);
        log.info("Successfully deleted insurance with ID: {}", insuranceId);
    }

    /**
     * Validates insurance object for required fields and business rules
     */
    private void validateInsurance(Insurance insurance) {
        if (insurance.getPolicyNumber() == null || insurance.getPolicyNumber().trim().isEmpty()) {
            log.error("Policy number is required");
            throw new IllegalArgumentException("Policy number is required");
        }

        if (insurance.getProviderName() == null || insurance.getProviderName().trim().isEmpty()) {
            log.error("Provider name is required");
            throw new IllegalArgumentException("Provider name is required");
        }

        if (insurance.getProvider() == null || insurance.getProvider().trim().isEmpty()) {
            log.error("Provider is required");
            throw new IllegalArgumentException("Provider is required");
        }

        if (insurance.getValidTill() == null) {
            log.error("Valid till date is required");
            throw new IllegalArgumentException("Valid till date is required");
        }

        // Check if insurance is expired
        if (insurance.getValidTill().isBefore(LocalDate.now())) {
            log.warn("Insurance policy {} is expired. Valid till: {}",
                    insurance.getPolicyNumber(), insurance.getValidTill());
            insurance.setIsActive(false);
        }

        log.debug("Insurance validation successful for policy number: {}", insurance.getPolicyNumber());
    }
}
