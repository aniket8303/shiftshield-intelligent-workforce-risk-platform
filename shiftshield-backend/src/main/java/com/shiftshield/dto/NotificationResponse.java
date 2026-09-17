package com.shiftshield.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Integer id;
    private String message;
    private String type;
    private Boolean readStatus;
    private Integer riskId;
    private LocalDateTime createdAt;
}
