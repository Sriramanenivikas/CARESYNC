package com.caresync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Dashboard statistics DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    // Counts
    private Long totalPatients;
    private Long totalDoctors;
    private Long totalAppointments;
    private Long todayAppointments;
    private Long pendingBills;
    private Long activeDepartments;
    
    // Revenue
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal outstandingAmount;
    
    // Distributions
    private Map<String, Long> appointmentsByStatus;
    private Map<String, Long> billsByStatus;
    private Map<String, Long> patientsByGender;
    private Map<String, Long> doctorsBySpecialization;
    
    // Recent data
    private List<AppointmentDTO> recentAppointments;
    private List<AppointmentDTO> todaysAppointments;
    private List<BillDTO> pendingBillsList;
}
