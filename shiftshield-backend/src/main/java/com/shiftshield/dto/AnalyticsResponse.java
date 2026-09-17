package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AnalyticsResponse {
    
    // Key-Value map for risk trends (e.g., "Emergency" -> 5 critical risks)
    private Map<String, Long> criticalRisksByDepartment;
    
    // Shift fill rates (e.g., "FILLED" -> 85, "OPEN" -> 15)
    private Map<String, Long> shiftStatusDistribution;
    
    // Average staff assignments per shift
    private Double averageStaffPerShift;
    
}
