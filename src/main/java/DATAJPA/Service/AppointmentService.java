package DATAJPA.Service;

import DATAJPA.Dto.AppointmentDetailDto;
import DATAJPA.Dto.AppointmentDto;
import DATAJPA.Entity.Appointment;

import java.util.List;

public interface AppointmentService {
    Appointment CreateNewAppointment(Appointment appointment, Long doctorId, Long patientId);
    Appointment reassignAppointmentToDoctor(Long appointmentId, Long newDoctorId);
    Appointment saveAppointment(Appointment appointment);

    // DTO methods to prevent lazy loading issues
    List<AppointmentDto> getAllAppointmentsDto();
    AppointmentDetailDto getAppointmentDetailDto(Long id);
    List<AppointmentDto> getAppointmentsByPatientIdDto(Long patientId);
    List<AppointmentDto> getAppointmentsByDoctorIdDto(Long doctorId);
    List<AppointmentDto> getAppointmentsByStatusDto(Appointment.AppointmentStatus status);

    // Legacy entity methods (use with caution - may cause lazy loading issues)
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(Long id);
    List<Appointment> getAppointmentsByPatientId(Long patientId);
    List<Appointment> getAppointmentsByDoctorId(Long doctorId);
    List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status);
    Appointment updateAppointment(Appointment appointment, Long id);
    void deleteAppointment(Long id);
}
