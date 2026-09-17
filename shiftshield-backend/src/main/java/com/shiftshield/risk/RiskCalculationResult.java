package com.shiftshield.risk;

import java.util.List;

public class RiskCalculationResult {
    private int riskScore;
    private String riskLevel;
    private List<RiskReason> reasons;
    private List<String> rawReasons;
    private String recommendedAction;

    public RiskCalculationResult() {}

    public RiskCalculationResult(int riskScore, String riskLevel, List<RiskReason> reasons, List<String> rawReasons, String recommendedAction) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.reasons = reasons;
        this.rawReasons = rawReasons;
        this.recommendedAction = recommendedAction;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public List<RiskReason> getReasons() {
        return reasons;
    }

    public List<String> getRawReasons() {
        return rawReasons;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }
}
