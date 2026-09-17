package com.shiftshield.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ShiftAssignmentRequest {
    @NotNull(message = "Staff ID is required")
    private Integer staffId;

    @NotNull(message = "Shift ID is required")
    private Integer shiftId;
}
