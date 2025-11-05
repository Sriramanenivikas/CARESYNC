package DATAJPA.Dto;
import DATAJPA.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String jwtToken;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String dashboardUrl;

    public LoginResponseDTO(String jwtToken, Long userId) {
        this.jwtToken = jwtToken;
        this.userId = userId;
    }
}
