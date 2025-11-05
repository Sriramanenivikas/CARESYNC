package DATAJPA.Dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionItemDto {
    private Long itemId;
    private String medicineName;
    private String medicineType;
    private String dosage;
    private String frequency;
    private String duration;
    private Integer quantity;
    private String route;
    private String timing;
    private String instructions;
    private Boolean isDispensed;
    private Integer dispensedQuantity;
}
