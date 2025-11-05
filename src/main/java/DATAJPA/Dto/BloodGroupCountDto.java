// filepath: /Users/vikas/Downloads/CareSync/src/main/java/DATAJPA/Dto/BloodGroupCountDto.java
package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BloodGroupCountDto {
    private String bloodGroup;
    private Long count;
}

