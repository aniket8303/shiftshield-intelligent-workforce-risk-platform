package com.shiftshield.controller;

import com.shiftshield.dto.AnalyticsResponse;
import com.shiftshield.dto.DashboardSummaryDTO;
import com.shiftshield.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsResponse> getOrganizationAnalytics() {
        return ResponseEntity.ok(analyticsService.getOrganizationAnalytics());
    }

    @GetMapping("/risk-trends")
    public ResponseEntity<java.util.List<com.shiftshield.dto.AnalyticsTrendResponse>> getRiskTrends() {
        return ResponseEntity.ok(analyticsService.getRiskTrends());
    }

    @GetMapping("/staffing")
    public ResponseEntity<java.util.List<com.shiftshield.dto.AnalyticsStaffingResponse>> getStaffingAnalytics() {
        return ResponseEntity.ok(analyticsService.getStaffingAnalytics());
    }

    @GetMapping("/departments")
    public ResponseEntity<java.util.List<com.shiftshield.dto.AnalyticsDepartmentResponse>> getDepartmentAnalytics() {
        return ResponseEntity.ok(analyticsService.getDepartmentAnalytics());
    }
}
