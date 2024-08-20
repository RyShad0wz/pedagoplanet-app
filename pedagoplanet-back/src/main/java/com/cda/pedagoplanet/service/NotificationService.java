package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Notification;
import com.cda.pedagoplanet.entity.dto.NotificationDTO;
import com.cda.pedagoplanet.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findAllByUserId(userId);
    }

    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        return notifications.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setSenderId(notification.getSenderId());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setType(notification.getType());
        return dto;
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}

