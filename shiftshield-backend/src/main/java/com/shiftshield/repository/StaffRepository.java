package com.shiftshield.repository;

import com.shiftshield.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    List<Staff> findByOrganizationId(Integer organizationId);
    List<Staff> findByOrganizationIdAndDepartmentId(Integer organizationId, Integer departmentId);
    Optional<Staff> findByUserId(Integer userId);
}