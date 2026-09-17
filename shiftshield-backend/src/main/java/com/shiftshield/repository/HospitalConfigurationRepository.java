package com.shiftshield.repository;

import com.shiftshield.entity.HospitalConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalConfigurationRepository extends JpaRepository<HospitalConfiguration, Long> {
    List<HospitalConfiguration> findByOrganizationId(Integer organizationId);
    Optional<HospitalConfiguration> findByOrganizationIdAndSettingKey(Integer organizationId, String settingKey);
}
