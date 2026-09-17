package com.shiftshield.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShiftRequest {
    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    @NotNull(message = "Start time is required")
    @FutureOrPresent(message = "Start time cannot be in the past")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @FutureOrPresent(message = "End time cannot be in the past")
    private LocalDateTime endTime;

    @NotBlank(message = "Shift type is required")
    private String type; // e.g., Morning, Afternoon, Night

    @NotNull(message = "Required staff count is required")
    @Min(value = 1, message = "At least 1 staff member is required")
    private Integer requiredStaffCount;

    @NotNull(message = "Required senior staff count is required")
    @Min(value = 0, message = "Required senior staff count cannot be negative")
    private Integer requiredSeniorStaffCount;
}
