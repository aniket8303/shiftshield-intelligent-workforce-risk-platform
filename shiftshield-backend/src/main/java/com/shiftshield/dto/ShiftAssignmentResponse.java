package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShiftAssignmentResponse {
    private Integer id;
    private Integer shiftId;
    private Integer staffId;
    private String staffName;
    private String staffDesignation;
    private Integer experienceLevel;
    private String status;
}
