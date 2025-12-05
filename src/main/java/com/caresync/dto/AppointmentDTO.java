package com.caresync.dto;

import com.caresync.entity.AppointmentStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Long id;
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    private String patientName;
    private String patientPhone;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    
    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Appointment date must be today or in the future")
    private LocalDate appointmentDate;
    
    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;
    
    private LocalTime endTime;
    private AppointmentStatus status;
    private String reason;
    private String symptoms;
    private String diagnosis;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
