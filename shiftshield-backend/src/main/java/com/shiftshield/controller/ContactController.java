package com.shiftshield.controller;

import com.shiftshield.dto.ContactRequest;
import com.shiftshield.entity.Contact;
import com.shiftshield.repository.ContactRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequest request) {
        Contact contact = Contact.builder()
                .name(request.getName())
                .organization(request.getOrganization())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(request.getRole())
                .message(request.getMessage())
                .build();
        contactRepository.save(contact);
        return ResponseEntity.ok().body("{\"message\": \"Contact form submitted successfully\"}");
    }
}
