package com.shiftshield.dto;

public class RiskResponse {

    private Integer staffId;
    private String staffName;
    private int riskScore;
    private String riskLevel;

    public RiskResponse() {
    }

    public RiskResponse(Integer staffId, String staffName,
            int riskScore, String riskLevel) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
    }

    public Integer getStaffId() {
        return staffId;
    }

    public void setStaffId(Integer staffId) {
        this.staffId = staffId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}