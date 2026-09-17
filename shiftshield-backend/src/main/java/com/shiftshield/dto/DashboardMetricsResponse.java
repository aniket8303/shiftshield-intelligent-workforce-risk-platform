package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardMetricsResponse {
    // High-level aggregates
    private Long totalActiveStaff;
    private Long totalInactiveStaff;
    private Long totalDepartments;
    private Long totalOpenShifts;
    private Long totalFilledShifts;
    
    // Department specific
    private Integer departmentId;
    private String departmentName;

    // Risk insights
    private Long highRiskShifts;
    private Long criticalRiskShifts;
    private Long understaffedShifts;
    private Double overallRiskScore;

    // Recent activity or upcoming shifts
    private List<ShiftResponse> upcomingShifts;
    private List<RiskAssessmentResponse> recentRisks;
    
    // HR & Staff Specific
    private List<ShiftAssignmentResponse> myUpcomingShifts;
    private List<ShiftAssignmentResponse> myRecentShifts;
    private Long weeklyHours;
    private Long pendingRequests;
    private Long unreadNotifications;

}
