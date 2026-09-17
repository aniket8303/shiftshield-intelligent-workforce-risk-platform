package com.shiftshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Integer id;
    private String action;
    private String entityType;
    private Integer entityId;
    private String details;
    private LocalDateTime timestamp;
    private String userEmail;
    private String userFullName;
}
