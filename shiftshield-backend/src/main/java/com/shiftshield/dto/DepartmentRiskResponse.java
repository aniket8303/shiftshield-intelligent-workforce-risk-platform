package com.shiftshield.dto;

public class DepartmentRiskResponse {

    private String department;
    private long totalAssessments;
    private long highRisk;
    private long mediumRisk;
    private long lowRisk;

    public DepartmentRiskResponse(
            String department,
            long totalAssessments,
            long highRisk,
            long mediumRisk,
            long lowRisk) {

        this.department = department;
        this.totalAssessments = totalAssessments;
        this.highRisk = highRisk;
        this.mediumRisk = mediumRisk;
        this.lowRisk = lowRisk;
    }

    public String getDepartment() {
        return department;
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