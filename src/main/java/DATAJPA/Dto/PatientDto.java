package DATAJPA.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private Long id;
    private String name;
    private String email;
    private String gender;
    private String bloodGroup;
    private String birthdate;
    private LocalDateTime createdAt;
    private Long insuranceId;
    private Integer appointmentCount;
}
