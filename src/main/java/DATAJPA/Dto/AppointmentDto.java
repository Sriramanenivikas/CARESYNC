package DATAJPA.Dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private String appointmentCode;

    // Patient and Doctor Information
    private Long patientId;
    private String patientName;
    private String patientCode;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private Long departmentId;
    private String departmentName;

    // Appointment Details
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String appointmentType; // CONSULTATION, FOLLOW_UP, EMERGENCY, CHECKUP, PROCEDURE
    private String priority; // NORMAL, LOW, HIGH, EMERGENCY
    private String status; // SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW

    // Clinical Information
    private String reason;
    private String symptoms;
    private String notes;
    private BigDecimal consultationFee;

    // Additional Information
    private Long scheduledBy; // User ID who scheduled the appointment
    private String scheduledByName;
    private String cancellationReason;
    private LocalDateTime cancelledAt;

    // System fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;

    // Legacy/Computed fields (for backward compatibility)
    @Deprecated
    private String appointmentTimeDate; // Use appointmentDate and appointmentTime instead
}
