package com.caresync.service.impl;

import com.caresync.dto.AppointmentDTO;
import com.caresync.dto.BillDTO;
import com.caresync.dto.DashboardDTO;
import com.caresync.entity.AppointmentStatus;
import com.caresync.entity.BillStatus;
import com.caresync.repository.*;
import com.caresync.service.AppointmentService;
import com.caresync.service.BillService;
import com.caresync.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentService appointmentService;
    private final BillService billService;

    @Override
    public DashboardDTO getAdminDashboard() {
        return DashboardDTO.builder()
                // Counts
                .totalPatients(patientRepository.countAllPatients())
                .totalDoctors(doctorRepository.countAllDoctors())
                .totalAppointments(appointmentRepository.count())
                .todayAppointments(appointmentRepository.countTodaysAppointments())
                .pendingBills(billRepository.countByStatus(BillStatus.PENDING) + 
                             billRepository.countByStatus(BillStatus.PARTIAL))
                .activeDepartments(departmentRepository.countActiveDepartments())
                
                // Revenue
                .totalRevenue(billService.getTotalRevenue())
                .todayRevenue(billService.getTodayRevenue())
                .monthlyRevenue(billService.getMonthlyRevenue())
                .outstandingAmount(billService.getOutstandingAmount())
                
                // Distributions
                .appointmentsByStatus(getAppointmentStatusDistribution())
                .billsByStatus(getBillStatusDistribution())
                .patientsByGender(getPatientGenderDistribution())
                .doctorsBySpecialization(getDoctorSpecializationDistribution())
                
                // Recent data
                .todaysAppointments(appointmentService.getTodaysAppointments())
                .pendingBillsList(billService.getPendingBills())
                .build();
    }

    @Override
    public DashboardDTO getDoctorDashboard(Long doctorId) {
        List<AppointmentDTO> todaysAppointments = appointmentService.getTodaysAppointmentsByDoctor(doctorId);
        
        return DashboardDTO.builder()
                .todayAppointments((long) todaysAppointments.size())
                .totalAppointments((long) appointmentRepository.findByDoctorId(doctorId).size())
                .todaysAppointments(todaysAppointments)
                .build();
    }

    @Override
    public DashboardDTO getPatientDashboard(Long patientId) {
        List<BillDTO> pendingBills = billService.getPendingBillsByPatient(patientId);
        BigDecimal outstanding = pendingBills.stream()
                .map(BillDTO::getBalanceDue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return DashboardDTO.builder()
                .totalAppointments((long) appointmentRepository.findByPatientId(patientId).size())
                .pendingBills((long) pendingBills.size())
                .outstandingAmount(outstanding)
                .pendingBillsList(pendingBills)
                .build();
    }

    // Helper methods for distributions
    private Map<String, Long> getAppointmentStatusDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        for (AppointmentStatus status : AppointmentStatus.values()) {
            distribution.put(status.name(), appointmentRepository.countByStatus(status));
        }
        return distribution;
    }

    private Map<String, Long> getBillStatusDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        for (BillStatus status : BillStatus.values()) {
            distribution.put(status.name(), billRepository.countByStatus(status));
        }
        return distribution;
    }

    private Map<String, Long> getPatientGenderDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        patientRepository.countByGender().forEach(result -> {
            distribution.put(result[0].toString(), (Long) result[1]);
        });
        return distribution;
    }

    private Map<String, Long> getDoctorSpecializationDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        doctorRepository.countBySpecialization().forEach(result -> {
            distribution.put((String) result[0], (Long) result[1]);
        });
        return distribution;
    }
}
