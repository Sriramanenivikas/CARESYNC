package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDto {
    private Long id;
    private String departmentCode;
    private String departmentName;
    private String description;
    private String phone;
    private String email;
    private Integer floorNumber;
    private String headDoctorName;
    private Integer totalDoctors;
}

