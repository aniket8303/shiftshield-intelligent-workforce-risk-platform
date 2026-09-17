package com.shiftshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsTrendResponse {
    private LocalDate date;
    private double averageRiskScore;
    private int criticalRisks;
    private int highRisks;
}
