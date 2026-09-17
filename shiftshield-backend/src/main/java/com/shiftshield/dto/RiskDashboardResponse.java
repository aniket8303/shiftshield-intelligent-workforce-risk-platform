package com.shiftshield.dto;

public class RiskDashboardResponse {

    private long totalStaff;
    private long totalAssessments;
    private long highRisk;
    private long mediumRisk;
    private long lowRisk;

    public RiskDashboardResponse(
            long totalStaff,
            long totalAssessments,
            long highRisk,
            long mediumRisk,
            long lowRisk) {

        this.totalStaff = totalStaff;
        this.totalAssessments = totalAssessments;
        this.highRisk = highRisk;
        this.mediumRisk = mediumRisk;
        this.lowRisk = lowRisk;
    }

    public long getTotalStaff() {
        return totalStaff;
    }

    public long getTotalAssessments() {
        return totalAssessments;
    }

    public long getHighRisk() {
        return highRisk;
    }

    public long getMediumRisk() {
        return mediumRisk;
    }

    public long getLowRisk() {
        return lowRisk;
    }
}