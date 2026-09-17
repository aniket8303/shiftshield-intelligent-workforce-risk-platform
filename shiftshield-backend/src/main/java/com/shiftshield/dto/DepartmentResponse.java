package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DepartmentResponse {
    private Integer id;
    private String name;
    private String code;
    private String description;
    private Integer requiredStaffing;
    private Integer requiredSeniorStaff;
    private String riskLevel;
    private String status;
    private Integer headUserId;
    private String headUserName;
}
