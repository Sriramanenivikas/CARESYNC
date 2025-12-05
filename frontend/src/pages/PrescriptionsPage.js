import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { prescriptionService, patientService, doctorService } from '../services';
import { validatePrescriptionForm } from '../utils/validation';
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  ConfirmDialog,
  SearchInput,
  Pagination,
  EmptyState,
  Loading,
  Avatar,
} from '../components/common';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFileText,
  FiDownload,
  FiPrinter,
} from 'react-icons/fi';
import { formatDate, getFullName, exportToCSV } from '../utils/helpers';

const PrescriptionsPage = () => {
  const { success, error: showError } = useNotification();
  const { user } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const role = user?.role;
  const isPatient = role === 'PATIENT';
  const isDoctor = role === 'DOCTOR';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Helper to extract array from paginated response
      const extractArray = (res) => {
        if (!res.success) return [];
        const data = res.data;
        return Array.isArray(data) ? data : (data?.content || []);
      };

      // Get patientId or doctorId with fallback fetch
      let patientId = user?.patientId;
      let doctorId = user?.doctorId;

      if (isPatient && !patientId && user?.id) {
        try {
          const patientRes = await patientService.getByUserId(user.id);
          if (patientRes.success && patientRes.data?.id) {
            patientId = patientRes.data.id;
          }
        } catch (e) {
          console.warn('Could not fetch patient profile');
        }
      }

      if (isDoctor && !doctorId && user?.id) {
        try {
          const doctorRes = await doctorService.getByUserId(user.id);
          if (doctorRes.success && doctorRes.data?.id) {
            doctorId = doctorRes.data.id;
          }
        } catch (e) {
          console.warn('Could not fetch doctor profile');
        }
      }

      // Fetch prescriptions based on role
      let prescriptionsPromise;
      if (isPatient && patientId) {
        prescriptionsPromise = prescriptionService.getByPatient(patientId);
      } else if (isDoctor && doctorId) {
        prescriptionsPromise = prescriptionService.getByDoctor(doctorId);
      } else {
        prescriptionsPromise = prescriptionService.getAll();
      }

      const [prescriptionsRes, patientsRes, doctorsRes] = await Promise.all([
        prescriptionsPromise,
        patientService.getAll().catch(() => ({ success: false, data: [] })),
        doctorService.getAll().catch(() => ({ success: false, data: [] })),
      ]);

      setPrescriptions(extractArray(prescriptionsRes));
      setPatients(extractArray(patientsRes));
      setDoctors(extractArray(doctorsRes));
    } catch (err) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [showError, user, isPatient, isDoctor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const searchLower = searchTerm.toLowerCase();
    const patientName = rx.patientName || `${rx.patient?.firstName || ''} ${rx.patient?.lastName || ''}`;
    const doctorName = rx.doctorName || `${rx.doctor?.firstName || ''} ${rx.doctor?.lastName || ''}`;
    return (
      patientName.toLowerCase().includes(searchLower) ||
      rx.diagnosis?.toLowerCase().includes(searchLower) ||
      doctorName.toLowerCase().includes(searchLower) ||
      rx.medicationName?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    });
    setFormErrors({});
    setSelectedPrescription(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleEdit = (prescription) => {
    setSelectedPrescription(prescription);
    setFormData({
      patientId: prescription.patient?.id?.toString() || '',
      doctorId: prescription.doctor?.id?.toString() || '',
      medicationName: prescription.medicationName || '',
      dosage: prescription.dosage || '',
      frequency: prescription.frequency || '',
      duration: prescription.duration || '',
      instructions: prescription.instructions || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleView = (prescription) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (prescription) => {
    setSelectedPrescription(prescription);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validatePrescriptionForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormLoading(true);

    try {
      const submitData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        instructions: formData.instructions,
      };

      let result;
      if (selectedPrescription) {
        result = await prescriptionService.update(selectedPrescription.id, submitData);
      } else {
        result = await prescriptionService.create(submitData);
      }

      if (result.success) {
        success(selectedPrescription ? 'Prescription updated successfully' : 'Prescription created successfully');
        setIsFormModalOpen(false);
        fetchData();
        resetForm();
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('An error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPrescription) return;

    setFormLoading(true);
    try {
      const result = await prescriptionService.delete(selectedPrescription.id);
      if (result.success) {
        success('Prescription deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchData();
        setSelectedPrescription(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to delete prescription');
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = prescriptions.map((rx) => ({
      'Patient': getFullName(rx.patient?.firstName, rx.patient?.lastName),
      'Doctor': getFullName(rx.doctor?.firstName, rx.doctor?.lastName),
      'Medication': rx.medicationName,
      'Dosage': rx.dosage,
      'Frequency': rx.frequency,
      'Duration': rx.duration,
      'Date': formatDate(rx.createdAt),
    }));
    exportToCSV(exportData, 'prescriptions.csv');
    success('Prescriptions exported successfully');
  };

  const handlePrint = (prescription) => {
    const printContent = `
      <html>
        <head>
          <title>Prescription - ${getFullName(prescription.patient?.firstName, prescription.patient?.lastName)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #0891b2; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0891b2; }
            .rx-symbol { font-size: 48px; color: #0891b2; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #666; }
            .value { margin-top: 5px; }
            .medication { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CareSync</div>
            <p>123 Medical Center Drive | Phone: (555) 123-4567</p>
          </div>
          <div class="rx-symbol">℞</div>
          <div class="section">
            <div class="label">Patient</div>
            <div class="value">${getFullName(prescription.patient?.firstName, prescription.patient?.lastName)}</div>
          </div>
          <div class="section">
            <div class="label">Date</div>
            <div class="value">${formatDate(prescription.createdAt)}</div>
          </div>
          <div class="medication">
            <div class="section">
              <div class="label">Medication</div>
              <div class="value" style="font-size: 20px; font-weight: bold;">${prescription.medicationName}</div>
            </div>
            <div class="section">
              <div class="label">Dosage</div>
              <div class="value">${prescription.dosage}</div>
            </div>
            <div class="section">
              <div class="label">Frequency</div>
              <div class="value">${prescription.frequency}</div>
            </div>
            <div class="section">
              <div class="label">Duration</div>
              <div class="value">${prescription.duration}</div>
            </div>
            ${prescription.instructions ? `
            <div class="section">
              <div class="label">Instructions</div>
              <div class="value">${prescription.instructions}</div>
            </div>` : ''}
          </div>
          <div class="footer">
            <div class="label">Prescribed by</div>
            <div class="value">Dr. ${getFullName(prescription.doctor?.firstName, prescription.doctor?.lastName)}</div>
            <p style="margin-top: 30px; color: #999;">This prescription is valid for 30 days from the date of issue.</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const patientOptions = patients.map((p) => ({
    value: p.id.toString(),
    label: getFullName(p.firstName, p.lastName),
  }));

  const doctorOptions = doctors.map((d) => ({
    value: d.id.toString(),
    label: `Dr. ${getFullName(d.firstName, d.lastName)}`,
  }));

  const frequencyOptions = [
    { value: 'Once daily', label: 'Once daily' },
    { value: 'Twice daily', label: 'Twice daily' },
    { value: 'Three times daily', label: 'Three times daily' },
    { value: 'Four times daily', label: 'Four times daily' },
    { value: 'Every 4 hours', label: 'Every 4 hours' },
    { value: 'Every 6 hours', label: 'Every 6 hours' },
    { value: 'Every 8 hours', label: 'Every 8 hours' },
    { value: 'Every 12 hours', label: 'Every 12 hours' },
    { value: 'As needed', label: 'As needed (PRN)' },
    { value: 'Before meals', label: 'Before meals' },
    { value: 'After meals', label: 'After meals' },
    { value: 'At bedtime', label: 'At bedtime' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loading size="lg" text="Loading prescriptions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Prescriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage medication prescriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FiDownload} onClick={handleExport}>
            Export
          </Button>
          <Button variant="primary" icon={FiPlus} onClick={handleCreate}>
            New Prescription
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient, doctor, or medication..."
            className="flex-1"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FiFileText className="w-4 h-4" />
            <span>{filteredPrescriptions.length} prescriptions</span>
          </div>
        </div>
      </Card>

      {/* Prescriptions Table */}
      <Card padding={false}>
        {paginatedPrescriptions.length === 0 ? (
          <EmptyState
            icon={FiFileText}
            title="No prescriptions found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Get started by creating a prescription'}
            action={!searchTerm ? handleCreate : undefined}
            actionText={!searchTerm ? 'New Prescription' : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Prescribed By</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPrescriptions.map((prescription) => {
                    const patientName = prescription.patientName || getFullName(prescription.patient?.firstName, prescription.patient?.lastName);
                    const doctorName = prescription.doctorName || getFullName(prescription.doctor?.firstName, prescription.doctor?.lastName);
                    // Handle items array for prescription items
                    const firstItem = prescription.items?.[0] || {};
                    const medication = prescription.medicationName || firstItem.medicineName || prescription.diagnosis || 'See details';
                    const dosage = prescription.dosage || firstItem.dosage || '-';
                    const frequency = prescription.frequency || firstItem.frequency || '-';
                    const duration = prescription.duration || firstItem.duration || '-';
                    return (
                    <tr key={prescription.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstName={patientName?.split(' ')[0]}
                            lastName={patientName?.split(' ').slice(1).join(' ')}
                            size="sm"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {patientName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {medication}
                        </span>
                        {prescription.items?.length > 1 && (
                          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                            +{prescription.items.length - 1} more
                          </span>
                        )}
                      </td>
                      <td className="text-slate-600 dark:text-slate-300">{dosage}</td>
                      <td className="text-slate-600 dark:text-slate-300">{frequency}</td>
                      <td className="text-slate-600 dark:text-slate-300">{duration}</td>
                      <td>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Dr. {doctorName}
                        </span>
                      </td>
                      <td className="text-slate-600 dark:text-slate-300">{formatDate(prescription.createdAt || prescription.prescriptionDate)}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handlePrint(prescription)}
                            className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            title="Print"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleView(prescription)}
                            className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(prescription)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prescription)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredPrescriptions.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedPrescription ? 'Edit Prescription' : 'New Prescription'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Patient"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              options={patientOptions}
              error={formErrors.patientId}
              required
              placeholder="Select a patient"
            />
            <Select
              label="Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              options={doctorOptions}
              error={formErrors.doctorId}
              required
              placeholder="Select a doctor"
            />
          </div>

          <Input
            label="Medication Name"
            name="medicationName"
            value={formData.medicationName}
            onChange={handleInputChange}
            error={formErrors.medicationName}
            required
            placeholder="e.g., Amoxicillin 500mg"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              error={formErrors.dosage}
              required
              placeholder="e.g., 1 tablet"
            />
            <Select
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              options={frequencyOptions}
              error={formErrors.frequency}
              required
              placeholder="Select frequency"
            />
            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              error={formErrors.duration}
              required
              placeholder="e.g., 7 days"
            />
          </div>

          <Textarea
            label="Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            error={formErrors.instructions}
            placeholder="Special instructions for the patient..."
            rows={3}
            maxLength={1000}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedPrescription ? 'Update Prescription' : 'Create Prescription'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Prescription Details"
        size="md"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            <div className="text-center text-6xl text-primary-500 dark:text-primary-400 mb-4">℞</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Patient</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {getFullName(selectedPrescription.patient?.firstName, selectedPrescription.patient?.lastName)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Prescribed By</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Dr. {getFullName(selectedPrescription.doctor?.firstName, selectedPrescription.doctor?.lastName)}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-slate-400">Medication</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {selectedPrescription.medicationName}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Dosage</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedPrescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Frequency</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedPrescription.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Duration</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedPrescription.duration}</p>
                </div>
              </div>
            </div>

            {selectedPrescription.instructions && (
              <div>
                <p className="text-sm text-slate-400">Instructions</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{selectedPrescription.instructions}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-slate-400">Date Prescribed</p>
              <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(selectedPrescription.createdAt)}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button
                variant="outline"
                icon={FiPrinter}
                onClick={() => handlePrint(selectedPrescription)}
              >
                Print
              </Button>
              <Button
                variant="outline"
                icon={FiEdit2}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedPrescription);
                }}
              >
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={formLoading}
      />
    </div>
  );
};

export default PrescriptionsPage;
