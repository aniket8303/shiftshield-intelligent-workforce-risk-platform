package com.shiftshield.service;

import com.shiftshield.dto.AuditLogResponse;
import com.shiftshield.entity.AuditLog;
import com.shiftshield.entity.User;
import com.shiftshield.repository.AuditLogRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final SecurityUtils securityUtils;

    public AuditLogService(AuditLogRepository auditLogRepository, SecurityUtils securityUtils) {
        this.auditLogRepository = auditLogRepository;
        this.securityUtils = securityUtils;
    }

    public void logAction(String action, String entityType, Integer entityId, String details) {
        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null || currentUser.getOrganization() == null) {
            // Cannot log without context in this setup
            return;
        }

        AuditLog log = AuditLog.builder()
                .organization(currentUser.getOrganization())
                .user(currentUser)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();

        auditLogRepository.save(log);
    }

    public List<AuditLogResponse> getOrganizationAuditLogs(String search, String user, String role, String action, String entityType, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        if (orgId == null) {
            throw new RuntimeException("Organization not found in security context");
        }

        java.util.stream.Stream<AuditLog> logStream = auditLogRepository.findByOrganizationIdOrderByTimestampDesc(orgId).stream();
        
        if (search != null && !search.isEmpty()) {
            String s = search.toLowerCase();
            logStream = logStream.filter(log -> 
                (log.getDetails() != null && log.getDetails().toLowerCase().contains(s)) ||
                (log.getAction() != null && log.getAction().toLowerCase().contains(s)) ||
                (log.getEntityType() != null && log.getEntityType().toLowerCase().contains(s))
            );
        }
        
        if (user != null && !user.isEmpty()) {
            logStream = logStream.filter(log -> log.getUser() != null && log.getUser().getEmail().equalsIgnoreCase(user));
        }
        
        if (role != null && !role.isEmpty()) {
            logStream = logStream.filter(log -> log.getUser() != null && log.getUser().getRole().equalsIgnoreCase(role));
        }
        
        if (action != null && !action.isEmpty()) {
            logStream = logStream.filter(log -> log.getAction() != null && log.getAction().equalsIgnoreCase(action));
        }
        
        if (entityType != null && !entityType.isEmpty()) {
            logStream = logStream.filter(log -> log.getEntityType() != null && log.getEntityType().equalsIgnoreCase(entityType));
        }
        
        if (startDate != null) {
            logStream = logStream.filter(log -> !log.getTimestamp().isBefore(startDate.atStartOfDay()));
        }
        
        if (endDate != null) {
            logStream = logStream.filter(log -> log.getTimestamp().isBefore(endDate.plusDays(1).atStartOfDay()));
        }

        return logStream
                .map(log -> AuditLogResponse.builder()
                        .id(log.getId())
                        .action(log.getAction())
                        .entityType(log.getEntityType())
                        .entityId(log.getEntityId())
                        .details(log.getDetails())
                        .timestamp(log.getTimestamp())
                        .userEmail(log.getUser() != null ? log.getUser().getEmail() : "SYSTEM")
                        .userFullName(log.getUser() != null ? log.getUser().getFirstName() + " " + log.getUser().getLastName() : "SYSTEM")
                        .build())
                .collect(Collectors.toList());
    }
}
