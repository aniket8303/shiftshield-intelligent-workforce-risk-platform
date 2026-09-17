package com.shiftshield.repository;

import com.shiftshield.entity.WorkloadRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkloadRecordRepository extends JpaRepository<WorkloadRecord, Long> {
    List<WorkloadRecord> findByStaffId(Integer staffId);
}
