package com.shiftshield.service;

import com.shiftshield.dto.NotificationResponse;
import com.shiftshield.entity.Notification;
import com.shiftshield.entity.RiskAssessment;
import com.shiftshield.entity.User;
import com.shiftshield.repository.NotificationRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SecurityUtils securityUtils;

    public NotificationService(NotificationRepository notificationRepository, SecurityUtils securityUtils) {
        this.notificationRepository = notificationRepository;
        this.securityUtils = securityUtils;
    }

    @Transactional
    public void createNotification(User user, RiskAssessment risk, String message, String type) {
        Notification notification = Notification.builder()
                .organization(user.getOrganization())
                .user(user)
                .risk(risk)
                .message(message)
                .type(type)
                .readStatus(false)
                .build();
        notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyUnreadNotifications() {
        User currentUser = securityUtils.getCurrentUser();
        return notificationRepository.findByUserIdAndReadStatusFalseOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getMyNotifications() {
        User currentUser = securityUtils.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(securityUtils.getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setReadStatus(true);
        notificationRepository.save(notification);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .readStatus(notification.getReadStatus())
                .riskId(notification.getRisk() != null ? notification.getRisk().getId() : null)
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
