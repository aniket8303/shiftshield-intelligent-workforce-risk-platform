package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StaffResponse {
    private Integer id;
    private Integer userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String employeeId;
    private String employmentStatus;
    private String role;
    private Integer departmentId;
    private String departmentName;
    private String designation;
    private Integer experienceLevel;
    private Boolean isActive;
}
