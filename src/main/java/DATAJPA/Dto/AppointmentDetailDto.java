// filepath: /Users/vikas/Downloads/CareSync/src/main/java/DATAJPA/Dto/AppointmentDetailDto.java
package DATAJPA.Dto;

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
    private String appointmentCode;

    // Date/Time
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    // Enums represented as Strings for safe serialization
    private String appointmentType;
    private String status;
    private String priority;

    // Details
    private String reason;
    private String symptoms;
    private String notes;
    private BigDecimal consultationFee;

    // Patient snapshot
    private Long patientId;
    private String patientName;
    private String patientCode;

    // Doctor snapshot
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    // Department snapshot
    private Long departmentId;
    private String departmentName;

    // Audit timestamps as Strings to avoid timezone serialization issues here
    private String createdAt;
    private String updatedAt;
}

