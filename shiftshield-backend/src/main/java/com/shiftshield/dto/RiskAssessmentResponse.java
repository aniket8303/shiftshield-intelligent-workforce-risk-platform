package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RiskAssessmentResponse {
    private Integer id;
    private Integer shiftId;
    private String departmentName;
    private LocalDateTime shiftDate;
    private String shiftType;
    private Integer requiredStaff;
    private Integer assignedStaff;
    private Integer requiredSeniorStaff;
    private Integer assignedSeniorStaff;
    private String shiftStatus;
    private Integer riskScore;
    private String riskLevel;
    private List<String> reasons;
    private LocalDateTime calculatedAt;
}
