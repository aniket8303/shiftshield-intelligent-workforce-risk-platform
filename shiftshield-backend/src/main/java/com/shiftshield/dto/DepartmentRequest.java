package com.shiftshield.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {
    @NotBlank(message = "Department name is required")
    private String name;
    
    @NotBlank(message = "Department code is required")
    private String code;
    
    private String description;
    private Integer requiredStaffing;
    private Integer requiredSeniorStaff;
    private String riskLevel;
    private String status;

    private Integer headUserId;
}
