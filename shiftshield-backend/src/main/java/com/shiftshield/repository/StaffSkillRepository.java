package com.shiftshield.repository;

import com.shiftshield.entity.StaffSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffSkillRepository extends JpaRepository<StaffSkill, Integer> {
    List<StaffSkill> findByStaffId(Integer staffId);
}
