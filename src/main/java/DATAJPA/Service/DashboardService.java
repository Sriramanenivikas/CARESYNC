package DATAJPA.Service;

import DATAJPA.Entity.Appointment;
import DATAJPA.Entity.User;
import DATAJPA.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillMasterRepository billMasterRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final NotificationRepository notificationRepository;

    public Map<String, Object> getAdminDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "ADMIN");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());

        // Today's appointments
        LocalDate today = LocalDate.now();
        stats.put("todayAppointments", appointmentRepository.countByAppointmentDateBetween(today, today));

        // Total bills
        stats.put("totalBills", billMasterRepository.count());

        // Revenue
        Double revenue = billMasterRepository.sumTotalAmount();
        stats.put("totalRevenue", revenue != null ? revenue : 0.0);

        dashboard.put("stats", stats);
        dashboard.put("message", "Admin Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    public Map<String, Object> getDoctorDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "DOCTOR");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();

        Long doctorId = user.getId(); // Assuming user ID maps to doctor ID

        // Today's appointments
        LocalDate today = LocalDate.now();
        stats.put("todayAppointments", appointmentRepository.countByDoctorIdAndAppointmentDateBetween(doctorId, today, today));

        // Total appointments
        stats.put("totalAppointments", appointmentRepository.countByDoctorId(doctorId));

        // Pending appointments
        stats.put("pendingAppointments", appointmentRepository.countByDoctorIdAndStatus(doctorId, Appointment.AppointmentStatus.SCHEDULED));

        // Completed appointments
        stats.put("completedAppointments", appointmentRepository.countByDoctorIdAndStatus(doctorId, Appointment.AppointmentStatus.COMPLETED));

        // Total patients treated
        stats.put("totalPatients", appointmentRepository.countDistinctPatientsByDoctorId(doctorId));

        dashboard.put("stats", stats);
        dashboard.put("message", "Doctor Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    public Map<String, Object> getPatientDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "PATIENT");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();

        Long patientId = user.getId(); // Assuming user ID maps to patient ID

        // Upcoming appointments
        stats.put("upcomingAppointments", appointmentRepository.countByPatientIdAndAppointmentDateAfter(patientId, LocalDate.now()));

        // Total appointments
        stats.put("totalAppointments", appointmentRepository.countByPatientId(patientId));

        // Prescriptions count
        stats.put("prescriptions", prescriptionRepository.countByPatientId(patientId));

        // Pending bills
        stats.put("pendingBills", billMasterRepository.countByPatientIdAndPaymentStatus(patientId, "UNPAID"));

        // Total bills
        stats.put("totalBills", billMasterRepository.countByPatientId(patientId));

        dashboard.put("stats", stats);
        dashboard.put("message", "Patient Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    public Map<String, Object> getReceptionistDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "RECEPTIONIST");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();

        // Today's appointments
        LocalDate today = LocalDate.now();
        stats.put("todayAppointments", appointmentRepository.countByAppointmentDateBetween(today, today));

        // Total patients
        stats.put("totalPatients", patientRepository.count());

        // Pending bills
        stats.put("pendingBills", billMasterRepository.countByPaymentStatus("UNPAID"));

        // Total bills
        stats.put("totalBills", billMasterRepository.count());

        // New patients registered today
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        stats.put("newPatientsToday", patientRepository.countByCreatedAtBetween(startOfDay, endOfDay));

        // Check-ins (appointments with status CONFIRMED)
        stats.put("checkIns", appointmentRepository.countByStatus(Appointment.AppointmentStatus.CONFIRMED));

        dashboard.put("stats", stats);
        dashboard.put("message", "Receptionist Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    public Map<String, Object> getNurseDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "NURSE");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();

        // Today's appointments that need nursing care
        LocalDate today = LocalDate.now();
        stats.put("todayAppointments", appointmentRepository.countByAppointmentDateBetween(today, today));

        // Active patients
        stats.put("activePatients", patientRepository.count());

        // Pending tasks (notifications)
        stats.put("pendingTasks", notificationRepository.countByUserIdAndIsReadFalse(user.getId()));

        dashboard.put("stats", stats);
        dashboard.put("message", "Nurse Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    public Map<String, Object> getPharmacistDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "PHARMACIST");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();

        // Total prescriptions
        stats.put("totalPrescriptions", prescriptionRepository.count());

        // Today's prescriptions
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        stats.put("todayPrescriptions", prescriptionRepository.countByCreatedAtBetween(startOfDay, endOfDay));

        // Pending prescriptions (not dispensed)
        stats.put("pendingPrescriptions", prescriptionRepository.countByIsDispensed(false));

        dashboard.put("stats", stats);
        dashboard.put("message", "Pharmacist Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }

    public Map<String, Object> getLabTechnicianDashboard(User user) {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("role", "LAB_TECHNICIAN");
        dashboard.put("userId", user.getId());
        dashboard.put("username", user.getUsername());

        Map<String, Object> stats = new HashMap<>();

        // Placeholder stats - implement when lab module is added
        stats.put("pendingTests", 0);
        stats.put("completedTestsToday", 0);
        stats.put("totalTests", 0);

        dashboard.put("stats", stats);
        dashboard.put("message", "Lab Technician Dashboard");
        dashboard.put("timestamp", LocalDateTime.now());

        return dashboard;
    }
}

