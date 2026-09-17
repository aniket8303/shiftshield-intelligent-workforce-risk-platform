package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ShiftResponse {
    private Integer id;
    private Integer organizationId;
    private Integer departmentId;
    private String departmentName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String type;
    private Integer requiredStaffCount;
    private Integer requiredSeniorStaffCount;
    private Integer assignedStaffCount;
    private String status;
}
