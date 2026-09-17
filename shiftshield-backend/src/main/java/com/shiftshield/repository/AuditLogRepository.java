package com.shiftshield.repository;

import com.shiftshield.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
    @EntityGraph(attributePaths = {"user", "organization"})
    List<AuditLog> findByOrganizationIdOrderByTimestampDesc(Integer organizationId);

    @EntityGraph(attributePaths = {"user", "organization"})
    Page<AuditLog> findByOrganizationIdOrderByTimestampDesc(Integer organizationId, Pageable pageable);
}
