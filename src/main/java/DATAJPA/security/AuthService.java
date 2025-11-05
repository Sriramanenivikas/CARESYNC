package DATAJPA.security;

import DATAJPA.Dto.LoginRequestDTO;
import DATAJPA.Dto.LoginResponseDTO;
import DATAJPA.Dto.RegisterDto;
import DATAJPA.Entity.User;
import DATAJPA.Exception.DuplicateResourceException;
import DATAJPA.Repository.Userrepositary;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final Auth_util auth_util;
    private final Userrepositary userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword())
        );
        User user = (User) authentication.getPrincipal();
        String token = auth_util.generateToken(user);

        // Create enhanced response with role-based dashboard URL
        LoginResponseDTO response = new LoginResponseDTO();
        response.setJwtToken(token);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setDashboardUrl(getDashboardUrlForRole(user.getRole()));

        return response;
    }

    private String getDashboardUrlForRole(User.Role role) {
        if (role == null) {
            return "/api/dashboard/me";
        }

        switch (role) {
            case ADMIN:
                return "/api/dashboard/admin";
            case DOCTOR:
                return "/api/dashboard/doctor";
            case PATIENT:
                return "/api/dashboard/patient";
            case RECEPTIONIST:
                return "/api/dashboard/receptionist";
            case NURSE:
                return "/api/dashboard/nurse";
            case PHARMACIST:
                return "/api/dashboard/pharmacist";
            case LAB_TECHNICIAN:
                return "/api/dashboard/lab-technician";
            default:
                return "/api/dashboard/me";
        }
    }

    public RegisterDto register(RegisterDto registerDto) {
        // Check if username already exists
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new DuplicateResourceException("User", "username", registerDto.getUsername());
        }

        // Create new user entity
        User newUser = new User();
        newUser.setUsername(registerDto.getUsername());
        // Encode password using BCrypt
        newUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        // Save user to database
        User savedUser = userRepository.save(newUser);

        // Return DTO with generated ID
        RegisterDto responseDto = new RegisterDto();
        responseDto.setId(savedUser.getId());
        responseDto.setUsername(savedUser.getUsername());

        // Don't return password in response for security
        responseDto.setPassword(null);

        return responseDto;
    }
}
