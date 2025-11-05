package DATAJPA.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {

    private Long notificationId;
    private Long userId;
    private String notificationType;
    private String title;
    private String message;
    private String priority;
    private Boolean isRead;
    private LocalDateTime readAt;
    private String link;
    private LocalDateTime createdAt;
}

