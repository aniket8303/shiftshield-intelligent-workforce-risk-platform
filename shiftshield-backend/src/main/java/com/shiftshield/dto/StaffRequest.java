package com.shiftshield.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Role is required")
    private String role; // System role, e.g. STAFF, SUPERVISOR

    private String phone;
    private String employeeId;
    private String employmentStatus;

    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    @NotBlank(message = "Designation is required")
    private String designation; // e.g. Senior Nurse

    private Integer experienceLevel;
    
    private Boolean isActive = true;
    
    // For creation only (can be auto-generated in a real system)
    private String password;
}
