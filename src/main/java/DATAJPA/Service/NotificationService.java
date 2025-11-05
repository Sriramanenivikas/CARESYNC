package DATAJPA.Service;

import DATAJPA.Dto.NotificationDto;
import DATAJPA.Entity.Notification;
import DATAJPA.Repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationDto createNotification(Long userId, String type, String title,
                                             String message, String priority, String link) {
        Notification notification = Notification.builder()
                .userId(userId)
                .notificationType(Notification.NotificationType.valueOf(type))
                .title(title)
                .message(message)
                .priority(Notification.Priority.valueOf(priority))
                .isRead(false)
                .link(link)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created for user: {}", userId);

        return convertToDto(saved);
    }

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification notification : notifications) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }

    // Helper methods for specific notifications

    public void sendAppointmentNotification(Long userId, String appointmentCode, String message) {
        createNotification(userId, "APPOINTMENT", "Appointment Update",
                message, "NORMAL", "/appointments/" + appointmentCode);
    }

    public void sendBillCreatedNotification(Long userId, String billNumber) {
        createNotification(userId, "BILLING", "New Bill Generated",
                "A new bill " + billNumber + " has been generated for you.",
                "NORMAL", "/bills/" + billNumber);
    }

    public void sendPrescriptionCreatedNotification(Long userId, String prescriptionNumber) {
        createNotification(userId, "PRESCRIPTION", "New Prescription",
                "A new prescription " + prescriptionNumber + " has been created for you.",
                "NORMAL", "/prescriptions/" + prescriptionNumber);
    }

    public void sendPaymentConfirmation(Long userId, String billNumber, String amount) {
        createNotification(userId, "BILLING", "Payment Received",
                "Payment of ₹" + amount + " received for bill " + billNumber,
                "NORMAL", "/bills/" + billNumber);
    }

    private NotificationDto convertToDto(Notification notification) {
        return NotificationDto.builder()
                .notificationId(notification.getNotificationId())
                .userId(notification.getUserId())
                .notificationType(notification.getNotificationType().name())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .priority(notification.getPriority().name())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .link(notification.getLink())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}

