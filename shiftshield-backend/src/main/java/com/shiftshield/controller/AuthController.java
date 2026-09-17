package com.shiftshield.controller;

import com.shiftshield.dto.AuthResponse;
import com.shiftshield.dto.LoginRequest;
import com.shiftshield.entity.User;
import com.shiftshield.entity.Staff;
import com.shiftshield.repository.UserRepository;
import com.shiftshield.repository.StaffRepository;
import com.shiftshield.service.JwtService;
import com.shiftshield.security.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final SecurityUtils securityUtils;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService,
            UserRepository userRepository,
            StaffRepository staffRepository,
            SecurityUtils securityUtils) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.securityUtils = securityUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails, user.getOrganization().getId(), user.getRole());

            AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .organizationId(user.getOrganization().getId())
                    .build();

            return ResponseEntity.ok(new AuthResponse(token, userDto));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Invalid email or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        User user = securityUtils.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Integer departmentId = null;
        java.util.Optional<Staff> staffOpt = staffRepository.findByUserId(user.getId());
        if (staffOpt.isPresent() && staffOpt.get().getDepartment() != null) {
            departmentId = staffOpt.get().getDepartment().getId();
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("role", user.getRole());
        response.put("organizationId", user.getOrganization() != null ? user.getOrganization().getId() : null);
        response.put("departmentId", departmentId);

        return ResponseEntity.ok(response);
    }
}