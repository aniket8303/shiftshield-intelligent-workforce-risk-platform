package com.shiftshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsStaffingResponse {
    private String departmentName;
    private int requiredStaff;
    private int assignedStaff;
    private double coveragePercentage;
}
