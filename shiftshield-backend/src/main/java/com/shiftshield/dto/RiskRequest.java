package com.shiftshield.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class RiskRequest {

    @Min(0)
    @Max(24)
    private int hoursWorked;

    @Min(0)
    @Max(14)
    private int consecutiveShifts;

    @Min(0)
    @Max(24)
    private int restHours;

    @Min(0)
    @Max(100)
    private int departmentWorkload;

    @Min(0)
    private int experienceYears;

    public RiskRequest() {
    }

    public RiskRequest(int hoursWorked, int consecutiveShifts, int restHours,
            int departmentWorkload, int experienceYears) {

        this.hoursWorked = hoursWorked;
        this.consecutiveShifts = consecutiveShifts;
        this.restHours = restHours;
        this.departmentWorkload = departmentWorkload;
        this.experienceYears = experienceYears;
    }

    public int getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(int hoursWorked) {
        this.hoursWorked = hoursWorked;
    }

    public int getConsecutiveShifts() {
        return consecutiveShifts;
    }

    public void setConsecutiveShifts(int consecutiveShifts) {
        this.consecutiveShifts = consecutiveShifts;
    }

    public int getRestHours() {
        return restHours;
    }

    public void setRestHours(int restHours) {
        this.restHours = restHours;
    }

    public int getDepartmentWorkload() {
        return departmentWorkload;
    }

    public void setDepartmentWorkload(int departmentWorkload) {
        this.departmentWorkload = departmentWorkload;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }
}