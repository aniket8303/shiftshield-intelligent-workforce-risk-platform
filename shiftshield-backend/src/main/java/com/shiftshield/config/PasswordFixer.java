package com.shiftshield.config;

import com.shiftshield.entity.User;
import com.shiftshield.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public class PasswordFixer {

    @Bean
    @Transactional
    public CommandLineRunner fixPasswords(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("⏳ Checking for plaintext passwords to fix...");
            List<User> users = userRepository.findAll();
            int count = 0;
            for (User user : users) {
                if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                    userRepository.save(user);
                    count++;
                }
            }
            if (count > 0) {
                System.out.println("✅ Fixed " + count + " plaintext passwords in the database.");
            } else {
                System.out.println("✅ All passwords are appropriately hashed.");
            }
        };
    }
}
