package DATAJPA.Service;

import DATAJPA.Entity.ActivityLog;
import DATAJPA.Repository.ActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public void logActivity(Long userId, String userRole, String actionType, String module,
                           String entityType, Long entityId, String description,
                           HttpServletRequest request) {
        ActivityLog log = ActivityLog.builder()
                .userId(userId)
                .userRole(userRole)
                .actionType(actionType)
                .module(module)
                .entityType(entityType)
                .entityId(entityId)
                .actionDescription(description)
                .ipAddress(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .build();

        activityLogRepository.save(log);
    }

    @Transactional
    public void logActivity(Long userId, String userRole, String actionType, String module,
                           String description, HttpServletRequest request) {
        logActivity(userId, userRole, actionType, module, null, null, description, request);
    }

    public List<ActivityLog> getUserActivities(Long userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<ActivityLog> getModuleActivities(String module) {
        return activityLogRepository.findByModuleOrderByCreatedAtDesc(module);
    }

    public List<ActivityLog> getActivitiesByDateRange(LocalDateTime start, LocalDateTime end) {
        return activityLogRepository.findByCreatedAtBetween(start, end);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}

