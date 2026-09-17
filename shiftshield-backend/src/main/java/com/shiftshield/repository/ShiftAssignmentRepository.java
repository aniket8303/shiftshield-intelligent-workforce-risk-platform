package com.shiftshield.repository;

import com.shiftshield.entity.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Integer> {
    List<ShiftAssignment> findByShiftId(Integer shiftId);
    List<ShiftAssignment> findByStaffId(Integer staffId);
    List<ShiftAssignment> findByShiftOrganizationId(Integer organizationId);
}
