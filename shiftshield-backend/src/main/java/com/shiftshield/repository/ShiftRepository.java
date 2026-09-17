package com.shiftshield.repository;

import com.shiftshield.entity.Shift;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    @EntityGraph(attributePaths = {"department", "organization"})
    List<Shift> findByOrganizationId(Integer organizationId);
    @EntityGraph(attributePaths = {"department", "organization"})
    Page<Shift> findByOrganizationId(Integer organizationId, Pageable pageable);

    @EntityGraph(attributePaths = {"department", "organization"})
    List<Shift> findByOrganizationIdAndDepartmentId(Integer organizationId, Integer departmentId);
    @EntityGraph(attributePaths = {"department", "organization"})
    Page<Shift> findByOrganizationIdAndDepartmentId(Integer organizationId, Integer departmentId, Pageable pageable);

    @EntityGraph(attributePaths = {"department", "organization"})
    List<Shift> findByOrganizationIdAndStartTimeBetween(Integer organizationId, LocalDateTime start, LocalDateTime end);

    @EntityGraph(attributePaths = {"department", "organization"})
    List<Shift> findByOrganizationIdAndDepartmentIdAndStartTimeBetween(Integer organizationId, Integer departmentId, LocalDateTime start, LocalDateTime end);
}
