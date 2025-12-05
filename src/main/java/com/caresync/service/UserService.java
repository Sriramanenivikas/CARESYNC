package com.caresync.service;

import com.caresync.dto.PagedResponse;
import com.caresync.dto.UserDTO;
import com.caresync.entity.Role;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    PagedResponse<UserDTO> getAllUsers(Pageable pageable);
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO getUserByUsername(String username);
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(Long id, UserDTO userDTO);
    void deleteUser(Long id);
    UserDTO updateUserRole(Long id, Role role);
    List<UserDTO> getUsersByRole(Role role);
    long countByRole(Role role);
}
