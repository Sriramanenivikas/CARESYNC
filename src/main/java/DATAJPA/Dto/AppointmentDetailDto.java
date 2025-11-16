package DATAJPA.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDetailDto {
    // Core identifiers
    private Long id;

    @Size(max = 20, message = "Appointment code must not exceed 20 characters")
    private String appointmentCode;

    // Date/Time
    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Appointment date must be today or in the future")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    // Enums represented as Strings for safe serialization
    @NotBlank(message = "Appointment type is required")
    @Pattern(regexp = "CONSULTATION|FOLLOW_UP|EMERGENCY|CHECKUP|PROCEDURE",
             message = "Appointment type must be CONSULTATION, FOLLOW_UP, EMERGENCY, CHECKUP, or PROCEDURE")
    private String appointmentType;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "SCHEDULED|CONFIRMED|IN_PROGRESS|COMPLETED|CANCELLED|NO_SHOW",
             message = "Status must be SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, or NO_SHOW")
    private String status;

    @Pattern(regexp = "LOW|NORMAL|HIGH|EMERGENCY",
             message = "Priority must be LOW, NORMAL, HIGH, or EMERGENCY")
    private String priority;

    // Details
    @NotBlank(message = "Reason for appointment is required")
    @Size(min = 10, max = 500, message = "Reason must be between 10 and 500 characters")
    private String reason;

    @Size(max = 1000, message = "Symptoms must not exceed 1000 characters")
    private String symptoms;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Consultation fee must have at most 10 digits and 2 decimal places")
    private BigDecimal consultationFee;

    // Patient snapshot
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    private String patientName;
    private String patientCode;

    // Doctor snapshot
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    // Department snapshot
    @NotNull(message = "Department ID is required")
    private Long departmentId;
    private String departmentName;

    // Audit timestamps as Strings to avoid timezone serialization issues here
    private String createdAt;
    private String updatedAt;
}

