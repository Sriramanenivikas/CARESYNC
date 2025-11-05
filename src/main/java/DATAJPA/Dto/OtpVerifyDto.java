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
public class OtpVerifyDto {

    private String email;

    private String mobile;

    @NotBlank(message = "OTP code is required")
    private String otpCode;

    private String username; // For login flow

    private String password; // For login with OTP
}

