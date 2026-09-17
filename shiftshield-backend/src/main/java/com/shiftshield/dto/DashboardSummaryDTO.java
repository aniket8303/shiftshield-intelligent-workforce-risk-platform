package com.shiftshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private AnalyticsResponse overview;
    private List<AnalyticsTrendResponse> riskTrends;
    private List<AnalyticsStaffingResponse> staffing;
    private List<AnalyticsDepartmentResponse> departments;
}
