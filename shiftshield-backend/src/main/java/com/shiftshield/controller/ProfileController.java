package com.shiftshield.controller;

import com.shiftshield.entity.User;
import com.shiftshield.repository.UserRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityUtils securityUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile() {
        User user = securityUtils.getCurrentUser();
        user.setPassword(null); // Never return password hash
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        User user = securityUtils.getCurrentUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok().body(Map.of("message", "Password changed successfully."));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        User user = securityUtils.getCurrentUser();
        if (payload.containsKey("firstName")) {
            user.setFirstName(payload.get("firstName"));
        }
        if (payload.containsKey("lastName")) {
            user.setLastName(payload.get("lastName"));
        }
        if (payload.containsKey("phone")) {
            user.setPhone(payload.get("phone"));
        }
        
        User saved = userRepository.save(user);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
}
