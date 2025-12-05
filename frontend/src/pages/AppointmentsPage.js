import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { appointmentService, patientService, doctorService } from '../services';
import { validateAppointmentForm } from '../utils/validation';
import { requiresAccessCode } from '../services/accessCodeService';
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
  StatusBadge,
  AccessCodeModal,
} from '../components/common';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiClock,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import { formatDate, getFullName, exportToCSV } from '../utils/helpers';

const AppointmentsPage = () => {
  const { success, error: showError } = useNotification();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDateTime: '',
    status: 'SCHEDULED',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const role = user?.role;
  const isAdmin = role === 'ADMIN' || role === 'TEST';
  const isDoctor = role === 'DOCTOR';
  const isPatient = role === 'PATIENT';
  const isNurse = role === 'NURSE';
  const isReceptionist = role === 'RECEPTIONIST';

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

      // Fetch appointments based on role
      let appointmentsPromise;
      if (isPatient && patientId) {
        appointmentsPromise = appointmentService.getByPatient(patientId);
      } else if (isDoctor && doctorId) {
        appointmentsPromise = appointmentService.getByDoctor(doctorId);
      } else if (isNurse) {
        appointmentsPromise = appointmentService.getToday();
      } else {
        // Admin, Receptionist, Test - get all
        appointmentsPromise = appointmentService.getAll();
      }

      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        appointmentsPromise,
        patientService.getAll().catch(() => ({ success: false, data: [] })),
        doctorService.getAll().catch(() => ({ success: false, data: [] })),
      ]);

      setAppointments(extractArray(appointmentsRes));
      setPatients(extractArray(patientsRes));
      setDoctors(extractArray(doctorsRes));
    } catch (err) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [showError, user, isPatient, isDoctor, isNurse]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAppointments = appointments.filter((apt) => {
    const searchLower = searchTerm.toLowerCase();
    // Backend returns patientName, doctorName directly, not nested objects
    const matchesSearch = 
      apt.patientName?.toLowerCase().includes(searchLower) ||
      apt.doctorName?.toLowerCase().includes(searchLower) ||
      apt.patient?.firstName?.toLowerCase().includes(searchLower) ||
      apt.patient?.lastName?.toLowerCase().includes(searchLower) ||
      apt.doctor?.firstName?.toLowerCase().includes(searchLower) ||
      apt.doctor?.lastName?.toLowerCase().includes(searchLower);
    
    const matchesStatus = !statusFilter || apt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDateTime: '',
      status: 'SCHEDULED',
      reason: '',
      symptoms: '',
      notes: '',
    });
    setFormErrors({});
    setSelectedAppointment(null);
  };

  const handleCreate = () => {
    if (requiresAccessCode(user, 'CREATE')) {
      setPendingAction({ type: 'CREATE' });
      setIsAccessCodeModalOpen(true);
    } else {
      resetForm();
      setIsFormModalOpen(true);
    }
  };

  const proceedWithCreate = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleEdit = (appointment) => {
    if (requiresAccessCode(user, 'UPDATE')) {
      setPendingAction({ type: 'UPDATE', appointment });
      setIsAccessCodeModalOpen(true);
    } else {
      proceedWithEdit(appointment);
    }
  };

  const proceedWithEdit = (appointment) => {
    setSelectedAppointment(appointment);
    let dateTime = '';
    if (appointment.appointmentDate && appointment.appointmentTime) {
      dateTime = `${appointment.appointmentDate}T${appointment.appointmentTime.slice(0, 5)}`;
    } else if (appointment.appointmentDateTime) {
      dateTime = new Date(appointment.appointmentDateTime).toISOString().slice(0, 16);
    }
    setFormData({
      patientId: appointment.patientId?.toString() || appointment.patient?.id?.toString() || '',
      doctorId: appointment.doctorId?.toString() || appointment.doctor?.id?.toString() || '',
      appointmentDateTime: dateTime,
      status: appointment.status || 'SCHEDULED',
      reason: appointment.reason || '',
      symptoms: appointment.symptoms || '',
      notes: appointment.notes || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    if (requiresAccessCode(user, 'DELETE')) {
      setPendingAction({ type: 'DELETE', appointment });
      setIsAccessCodeModalOpen(true);
    } else {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleAccessCodeSuccess = () => {
    if (pendingAction?.type === 'DELETE') {
      setIsDeleteDialogOpen(true);
    } else if (pendingAction?.type === 'CREATE') {
      proceedWithCreate();
    } else if (pendingAction?.type === 'UPDATE') {
      proceedWithEdit(pendingAction.appointment);
    }
    setPendingAction(null);
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

    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormLoading(true);

    try {
      const submitData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        appointmentDateTime: formData.appointmentDateTime,
        status: formData.status,
        reason: formData.reason,
        symptoms: formData.symptoms,
        notes: formData.notes,
      };

      let result;
      if (selectedAppointment) {
        result = await appointmentService.update(selectedAppointment.id, submitData);
      } else {
        result = await appointmentService.create(submitData);
      }

      if (result.success) {
        success(selectedAppointment ? 'Appointment updated successfully' : 'Appointment created successfully');
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
    if (!selectedAppointment) return;

    setFormLoading(true);
    try {
      const result = await appointmentService.delete(selectedAppointment.id);
      if (result.success) {
        success('Appointment deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchData();
        setSelectedAppointment(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to delete appointment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (appointment, newStatus) => {
    try {
      const result = await appointmentService.updateStatus(appointment.id, newStatus);
      if (result.success) {
        success('Status updated successfully');
        fetchData();
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handleExport = () => {
    const exportData = appointments.map((a) => ({
      'Patient': a.patientName || getFullName(a.patient?.firstName, a.patient?.lastName),
      'Doctor': a.doctorName || getFullName(a.doctor?.firstName, a.doctor?.lastName),
      'Date': a.appointmentDate || formatDate(a.appointmentDateTime),
      'Time': a.appointmentTime || '',
      'Status': a.status,
      'Reason': a.reason || '',
      'Notes': a.notes || '',
    }));
    exportToCSV(exportData, 'appointments.csv');
    success('Appointments exported successfully');
  };

  const patientOptions = patients.map((p) => ({
    value: p.id.toString(),
    label: getFullName(p.firstName, p.lastName),
  }));

  const doctorOptions = doctors.map((d) => ({
    value: d.id.toString(),
    label: `Dr. ${getFullName(d.firstName, d.lastName)} - ${d.specialization || 'General'}`,
  }));

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loading size="lg" text="Loading appointments..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage patient appointments and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FiDownload} onClick={handleExport}>
            Export
          </Button>
          <Button variant="primary" icon={FiPlus} onClick={handleCreate}>
            New Appointment
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient or doctor name..."
            className="flex-1"
          />
          <Select
            name="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            className="w-48"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiCalendar className="w-4 h-4" />
            <span>{filteredAppointments.length} appointments</span>
          </div>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card padding={false}>
        {paginatedAppointments.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            title="No appointments found"
            description={searchTerm || statusFilter ? 'Try adjusting your filters' : 'Get started by scheduling an appointment'}
            action={!searchTerm && !statusFilter ? handleCreate : undefined}
            actionText={!searchTerm && !statusFilter ? 'New Appointment' : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstName={appointment.patientName?.split(' ')[0]}
                            lastName={appointment.patientName?.split(' ').slice(1).join(' ')}
                            size="sm"
                          />
                          <div>
                            <span className="font-medium">
                              {appointment.patientName || getFullName(appointment.patient?.firstName, appointment.patient?.lastName)}
                            </span>
                            {appointment.patientPhone && (
                              <p className="text-xs text-slate-400">{appointment.patientPhone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstName={appointment.doctorName?.replace('Dr. ', '').split(' ')[0]}
                            lastName={appointment.doctorName?.split(' ').slice(-1)[0]}
                            size="sm"
                          />
                          <div>
                            <span className="font-medium">
                              {appointment.doctorName || `Dr. ${getFullName(appointment.doctor?.firstName, appointment.doctor?.lastName)}`}
                            </span>
                            <p className="text-xs text-slate-400">
                              {appointment.doctorSpecialization || appointment.doctor?.specialization}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {appointment.appointmentTime?.slice(0, 5) || 
                             (appointment.appointmentDateTime && new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            }))}
                          </p>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="max-w-[150px]">
                        <span className="text-sm text-slate-500 truncate block">
                          {appointment.notes || '-'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          {appointment.status === 'SCHEDULED' && (
                            <button
                              onClick={() => handleStatusChange(appointment, 'CONFIRMED')}
                              className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
                            <button
                              onClick={() => handleStatusChange(appointment, 'CANCELLED')}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleView(appointment)}
                            className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(appointment)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredAppointments.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Input
            label="Date & Time"
            name="appointmentDateTime"
            type="datetime-local"
            value={formData.appointmentDateTime}
            onChange={handleInputChange}
            error={formErrors.appointmentDateTime}
            required
          />

          {selectedAppointment && (
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              error={formErrors.status}
            />
          )}

          <Input
            label="Reason for Visit"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            error={formErrors.reason}
            placeholder="e.g., Annual checkup, Follow-up, Consultation"
          />

          <Textarea
            label="Symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleInputChange}
            error={formErrors.symptoms}
            placeholder="Describe any symptoms..."
            rows={2}
            maxLength={500}
          />

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            error={formErrors.notes}
            placeholder="Add any notes or special instructions..."
            rows={2}
            maxLength={500}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedAppointment ? 'Update Appointment' : 'Schedule Appointment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Appointment Details"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedAppointment.status} />
              <span className="text-sm text-slate-400">ID: {selectedAppointment.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Patient</p>
                <div className="flex items-center gap-2">
                  <Avatar
                    firstName={selectedAppointment.patientName?.split(' ')[0]}
                    lastName={selectedAppointment.patientName?.split(' ').slice(1).join(' ')}
                    size="sm"
                  />
                  <div>
                    <span className="font-medium">
                      {selectedAppointment.patientName || getFullName(selectedAppointment.patient?.firstName, selectedAppointment.patient?.lastName)}
                    </span>
                    {selectedAppointment.patientPhone && (
                      <p className="text-xs text-slate-400">{selectedAppointment.patientPhone}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Doctor</p>
                <div className="flex items-center gap-2">
                  <Avatar
                    firstName={selectedAppointment.doctorName?.replace('Dr. ', '').split(' ')[0]}
                    lastName={selectedAppointment.doctorName?.split(' ').slice(-1)[0]}
                    size="sm"
                  />
                  <div>
                    <span className="font-medium">
                      {selectedAppointment.doctorName || `Dr. ${getFullName(selectedAppointment.doctor?.firstName, selectedAppointment.doctor?.lastName)}`}
                    </span>
                    {selectedAppointment.doctorSpecialization && (
                      <p className="text-xs text-slate-400">{selectedAppointment.doctorSpecialization}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400">Date</p>
                <p className="font-medium">{formatDate(selectedAppointment.appointmentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Time</p>
                <p className="font-medium">
                  {selectedAppointment.appointmentTime?.slice(0, 5) || 
                   (selectedAppointment.appointmentDateTime && new Date(selectedAppointment.appointmentDateTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }))}
                </p>
              </div>
            </div>

            {selectedAppointment.reason && (
              <div>
                <p className="text-sm text-slate-400">Reason</p>
                <p className="font-medium">{selectedAppointment.reason}</p>
              </div>
            )}

            {selectedAppointment.symptoms && (
              <div>
                <p className="text-sm text-slate-400">Symptoms</p>
                <p className="font-medium">{selectedAppointment.symptoms}</p>
              </div>
            )}

            {selectedAppointment.notes && (
              <div>
                <p className="text-sm text-slate-400">Notes</p>
                <p className="font-medium">{selectedAppointment.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                icon={FiEdit2}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedAppointment);
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
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        loading={formLoading}
      />

      {/* Access Code Modal */}
      <AccessCodeModal
        isOpen={isAccessCodeModalOpen}
        onClose={() => {
          setIsAccessCodeModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAccessCodeSuccess}
        operation={pendingAction?.type?.toLowerCase() || 'modify'}
        itemName={pendingAction?.type === 'CREATE' ? 'new appointment' : 'this appointment'}
      />
    </div>
  );
};

export default AppointmentsPage;
