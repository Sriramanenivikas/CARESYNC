package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDetailDto {
    private Long id;
    private String doctorCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String gender;
    private LocalDate dateOfBirth;
    private String phonePrimary;
    private String phoneSecondary;
    private String specialization;
    private String qualification;
    private String licenseNumber;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String availabilityStatus;
    private LocalDate joiningDate;

    // Department info
    private List<DepartmentDto> departments;

    // Schedule info
    private List<DoctorScheduleDto> schedules;

    // Statistics
    private Integer totalAppointments;
    private Integer todayAppointments;
}

