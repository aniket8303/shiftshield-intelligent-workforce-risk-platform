package com.shiftshield.controller;

import com.shiftshield.entity.Organization;
import com.shiftshield.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizations")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        return ResponseEntity.ok(organizationRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createOrganization(@RequestBody Organization organization) {
        if (organizationRepository.findAll().stream().anyMatch(o -> o.getHospitalCode().equals(organization.getHospitalCode()))) {
            return ResponseEntity.badRequest().body("Hospital Code already exists");
        }
        return ResponseEntity.ok(organizationRepository.save(organization));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrganization(@PathVariable Integer id, @RequestBody Organization updatedOrg) {
        Optional<Organization> existing = organizationRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Organization org = existing.get();
        org.setName(updatedOrg.getName());
        org.setLocation(updatedOrg.getLocation());
        org.setSubscriptionPlan(updatedOrg.getSubscriptionPlan());
        org.setStatus(updatedOrg.getStatus());
        
        return ResponseEntity.ok(organizationRepository.save(org));
    }
}
