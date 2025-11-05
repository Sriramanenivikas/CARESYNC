package DATAJPA.Service;

import DATAJPA.Dto.PrescriptionDto;
import DATAJPA.Dto.PrescriptionItemDto;
import DATAJPA.Entity.Prescription;
import DATAJPA.Entity.PrescriptionItem;
import DATAJPA.Repository.PrescriptionItemRepository;
import DATAJPA.Repository.PrescriptionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;

    @Autowired(required = false)
    private NotificationService notificationService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                              PrescriptionItemRepository prescriptionItemRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
    }

    @Transactional
    public PrescriptionDto createPrescription(PrescriptionDto prescriptionDto) {
        // Generate prescription number
        String prescriptionNumber = generatePrescriptionNumber();

        Prescription prescription = Prescription.builder()
                .prescriptionNumber(prescriptionNumber)
                .patientId(prescriptionDto.getPatientId())
                .doctorId(prescriptionDto.getDoctorId())
                .appointmentId(prescriptionDto.getAppointmentId())
                .medicalRecordId(prescriptionDto.getMedicalRecordId())
                .diagnosis(prescriptionDto.getDiagnosis())
                .chiefComplaints(prescriptionDto.getChiefComplaints())
                .followUpDate(prescriptionDto.getFollowUpDate())
                .specialInstructions(prescriptionDto.getSpecialInstructions())
                .isDispensed(false)
                .build();

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Add prescription items
        if (prescriptionDto.getPrescriptionItems() != null && !prescriptionDto.getPrescriptionItems().isEmpty()) {
            for (PrescriptionItemDto itemDto : prescriptionDto.getPrescriptionItems()) {
                PrescriptionItem item = PrescriptionItem.builder()
                        .prescription(savedPrescription)
                        .medicineName(itemDto.getMedicineName())
                        .medicineType(itemDto.getMedicineType())
                        .dosage(itemDto.getDosage())
                        .frequency(itemDto.getFrequency())
                        .duration(itemDto.getDuration())
                        .quantity(itemDto.getQuantity())
                        .route(itemDto.getRoute())
                        .timing(itemDto.getTiming())
                        .instructions(itemDto.getInstructions())
                        .isDispensed(false)
                        .dispensedQuantity(0)
                        .build();

                prescriptionItemRepository.save(item);
            }
        }

        // Send notification
        if (notificationService != null) {
            notificationService.sendPrescriptionCreatedNotification(
                    prescriptionDto.getPatientId(), prescriptionNumber);
        }

        log.info("Prescription created: {}", prescriptionNumber);
        return convertToDto(savedPrescription);
    }

    public PrescriptionDto getPrescriptionById(Long prescriptionId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return convertToDto(prescription);
    }

    public List<PrescriptionDto> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PrescriptionDto> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionDto markAsDispensed(Long prescriptionId, String dispensedBy) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        prescription.setIsDispensed(true);
        prescription.setDispensedAt(LocalDateTime.now());
        prescription.setDispensedBy(dispensedBy);

        // Mark all items as dispensed
        List<PrescriptionItem> items = prescriptionItemRepository
                .findByPrescription_PrescriptionId(prescriptionId);

        for (PrescriptionItem item : items) {
            item.setIsDispensed(true);
            item.setDispensedQuantity(item.getQuantity());
            prescriptionItemRepository.save(item);
        }

        prescriptionRepository.save(prescription);
        log.info("Prescription marked as dispensed: {}", prescription.getPrescriptionNumber());

        return convertToDto(prescription);
    }

    private PrescriptionDto convertToDto(Prescription prescription) {
        List<PrescriptionItemDto> items = prescriptionItemRepository
                .findByPrescription_PrescriptionId(prescription.getPrescriptionId()).stream()
                .map(this::convertItemToDto)
                .collect(Collectors.toList());

        return PrescriptionDto.builder()
                .prescriptionId(prescription.getPrescriptionId())
                .prescriptionNumber(prescription.getPrescriptionNumber())
                .patientId(prescription.getPatientId())
                .doctorId(prescription.getDoctorId())
                .appointmentId(prescription.getAppointmentId())
                .medicalRecordId(prescription.getMedicalRecordId())
                .prescriptionDate(prescription.getPrescriptionDate())
                .diagnosis(prescription.getDiagnosis())
                .chiefComplaints(prescription.getChiefComplaints())
                .followUpDate(prescription.getFollowUpDate())
                .specialInstructions(prescription.getSpecialInstructions())
                .isDispensed(prescription.getIsDispensed())
                .dispensedAt(prescription.getDispensedAt())
                .dispensedBy(prescription.getDispensedBy())
                .prescriptionItems(items)
                .build();
    }

    private PrescriptionItemDto convertItemToDto(PrescriptionItem item) {
        return PrescriptionItemDto.builder()
                .itemId(item.getItemId())
                .medicineName(item.getMedicineName())
                .medicineType(item.getMedicineType())
                .dosage(item.getDosage())
                .frequency(item.getFrequency())
                .duration(item.getDuration())
                .quantity(item.getQuantity())
                .route(item.getRoute())
                .timing(item.getTiming())
                .instructions(item.getInstructions())
                .isDispensed(item.getIsDispensed())
                .dispensedQuantity(item.getDispensedQuantity())
                .build();
    }

    private String generatePrescriptionNumber() {
        return "RX-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
}

