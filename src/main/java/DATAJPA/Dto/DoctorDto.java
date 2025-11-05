package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private Long id;
    private String doctorCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String gender;
    private String phonePrimary;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String availabilityStatus;
    private LocalDate joiningDate;
}

