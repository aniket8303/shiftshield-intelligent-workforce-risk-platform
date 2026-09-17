package com.shiftshield.risk;

public class RiskReason {
    private String description;
    private String category;
    private int scoreImpact;

    public RiskReason() {}

    public RiskReason(String description, String category, int scoreImpact) {
        this.description = description;
        this.category = category;
        this.scoreImpact = scoreImpact;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getScoreImpact() {
        return scoreImpact;
    }

    public void setScoreImpact(int scoreImpact) {
        this.scoreImpact = scoreImpact;
    }
}
