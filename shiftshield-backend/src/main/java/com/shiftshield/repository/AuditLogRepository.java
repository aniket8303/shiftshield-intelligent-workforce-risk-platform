package com.shiftshield.repository;

import com.shiftshield.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
    List<AuditLog> findByOrganizationIdOrderByTimestampDesc(Integer organizationId);
}
