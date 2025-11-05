package DATAJPA.Dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDto {
    private Long prescriptionId;
    private String prescriptionNumber;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private Long medicalRecordId;
    private LocalDateTime prescriptionDate;
    private String diagnosis;
    private String chiefComplaints;
    private LocalDate followUpDate;
    private String specialInstructions;
    private Boolean isDispensed;
    private LocalDateTime dispensedAt;
    private String dispensedBy;
    private List<PrescriptionItemDto> prescriptionItems;
}
