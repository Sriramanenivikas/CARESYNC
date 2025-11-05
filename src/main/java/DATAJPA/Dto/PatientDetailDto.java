package DATAJPA.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetailDto {
    private Long id;
    private String name;
    private String email;
    private String gender;
    private String bloodGroup;
    private String birthdate;
    private LocalDateTime createdAt;
    private InsuranceDto insurance;
    private List<AppointmentDto> appointments = new ArrayList<>();
}
