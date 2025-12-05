package com.caresync.service;

import com.caresync.dto.DashboardDTO;

/**
 * Service interface for Dashboard analytics
 */
public interface DashboardService {
    
    DashboardDTO getAdminDashboard();
    
    DashboardDTO getDoctorDashboard(Long doctorId);
    
    DashboardDTO getPatientDashboard(Long patientId);
}
