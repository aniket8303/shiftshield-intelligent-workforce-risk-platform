package com.shiftshield.controller;

import com.shiftshield.service.DemoDataLoaderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/demo-data")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class AdminDemoDataController {

    private final DemoDataLoaderService demoDataLoaderService;

    public AdminDemoDataController(DemoDataLoaderService demoDataLoaderService) {
        this.demoDataLoaderService = demoDataLoaderService;
    }

    @PostMapping("/import")
    public ResponseEntity<?> importDemoData() {
        try {
            String result = demoDataLoaderService.loadDemoData();
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
