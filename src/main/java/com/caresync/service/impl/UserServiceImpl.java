package com.caresync.service.impl;

import com.caresync.dto.PagedResponse;
import com.caresync.dto.UserDTO;
import com.caresync.entity.Role;
import com.caresync.entity.User;
import com.caresync.exception.ResourceNotFoundException;
import com.caresync.repository.UserRepository;
import com.caresync.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PagedResponse<UserDTO> getAllUsers(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        List<UserDTO> users = usersPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<UserDTO>builder()
                .content(users)
                .page(usersPage.getNumber())
                .size(usersPage.getSize())
                .totalElements(usersPage.getTotalElements())
                .totalPages(usersPage.getTotalPages())
                .last(usersPage.isLast())
                .build();
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return convertToDTO(user);
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return convertToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        // Check if username exists
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .role(userDTO.getRole() != null ? userDTO.getRole() : Role.PATIENT)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Check email uniqueness if changed
        if (!user.getEmail().equals(userDTO.getEmail()) && 
            userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setEmail(userDTO.getEmail());
        
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        if (userDTO.getRole() != null) {
            user.setRole(userDTO.getRole());
        }
        
        if (userDTO.getIsActive() != null) {
            user.setIsActive(userDTO.getIsActive());
        }

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserDTO updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setRole(role);
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    public List<UserDTO> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public long countByRole(Role role) {
        return userRepository.countByRole(role);
    }

    private UserDTO convertToDTO(User user) {
        // Get firstName/lastName from associated patient or doctor if available
        String firstName = null;
        String lastName = null;
        String phone = null;

        if (user.getPatient() != null) {
            firstName = user.getPatient().getFirstName();
            lastName = user.getPatient().getLastName();
            phone = user.getPatient().getPhone();
        } else if (user.getDoctor() != null) {
            firstName = user.getDoctor().getFirstName();
            lastName = user.getDoctor().getLastName();
            phone = user.getDoctor().getPhone();
        }

        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(firstName)
                .lastName(lastName)
                .phone(phone)
                .role(user.getRole())
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
