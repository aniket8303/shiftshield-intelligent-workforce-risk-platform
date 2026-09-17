package com.shiftshield.controller;

import com.shiftshield.dto.UserResponseDTO;
import com.shiftshield.entity.User;
import com.shiftshield.repository.UserRepository;
import com.shiftshield.service.UserService;
import com.shiftshield.service.AuditLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuditLogService auditLogService;

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        List<UserResponseDTO> users = userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    // =========================
    // CREATE USER
    // =========================
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Email already exists");
        }

        User saved = userService.register(user);
        
        auditLogService.logAction("CREATE_USER", "User", saved.getId(), "Created user account for: " + saved.getEmail());

        return ResponseEntity.ok(toDTO(saved));
    }

    // =========================
    // UPDATE USER
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @RequestBody User updatedUser) {

        Optional<User> existing = userRepository.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = existing.get();

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhone(updatedUser.getPhone());
        user.setRole(updatedUser.getRole());
        user.setStatus(updatedUser.getStatus());

        if (updatedUser.getOrganization() != null
                && updatedUser.getOrganization().getId() != null) {

            user.setOrganization(updatedUser.getOrganization());
        }

        User saved = userRepository.save(user);

        auditLogService.logAction("UPDATE_USER", "User", saved.getId(), "Updated user account for: " + saved.getEmail());

        return ResponseEntity.ok(toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {

        Optional<User> existing = userRepository.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = existing.get();
        user.setStatus("INACTIVE");
        userRepository.save(user);
        
        auditLogService.logAction("DEACTIVATE_USER", "User", user.getId(), "Deactivated user account for: " + user.getEmail());

        return ResponseEntity.noContent().build();
    }

    // =========================
    // ENTITY → DTO
    // =========================
    private UserResponseDTO toDTO(User user) {

        Integer organizationId = null;
        String organizationName = null;

        if (user.getOrganization() != null) {
            organizationId = user.getOrganization().getId();
            organizationName = user.getOrganization().getName();
        }

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .organizationId(organizationId)
                .organizationName(organizationName)
                .build();
    }
}