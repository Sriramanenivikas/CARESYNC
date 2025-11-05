package DATAJPA.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OtpRequestDto {

    private String email;

    private String mobile;

    @NotBlank(message = "OTP type is required")
    private String otpType; // LOGIN, REGISTRATION, PASSWORD_RESET

    private String username; // For login flow
}

