package com.shiftshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDepartmentResponse {
    private String departmentName;
    private int openRisks;
    private int criticalRisks;
    private int highRisks;
    private int mediumRisks;
    private int lowRisks;
}
