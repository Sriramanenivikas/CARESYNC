package com.caresync.dto;

import com.caresync.entity.DayOfWeek;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorScheduleDTO {
    private Long id;
    private Long doctorId;
    
    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;
    
    @NotNull(message = "Start time is required")
    private LocalTime startTime;
    
    @NotNull(message = "End time is required")
    private LocalTime endTime;
    
    private Integer slotDurationMinutes;
    private Boolean isAvailable;
}
