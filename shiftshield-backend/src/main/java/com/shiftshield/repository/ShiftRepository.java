package com.shiftshield.repository;

import com.shiftshield.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    List<Shift> findByOrganizationId(Integer organizationId);
    List<Shift> findByOrganizationIdAndDepartmentId(Integer organizationId, Integer departmentId);
    List<Shift> findByOrganizationIdAndStartTimeBetween(Integer organizationId, LocalDateTime start, LocalDateTime end);
    List<Shift> findByOrganizationIdAndDepartmentIdAndStartTimeBetween(Integer organizationId, Integer departmentId, LocalDateTime start, LocalDateTime end);
}
