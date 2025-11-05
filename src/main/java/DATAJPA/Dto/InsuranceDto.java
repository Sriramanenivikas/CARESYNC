package DATAJPA.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceDto {
    private Long id;
    private long policyNumber;
    private String provider;
    private LocalDate validTill;
    private LocalDateTime createdAt;
}
