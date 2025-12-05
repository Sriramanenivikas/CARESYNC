import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { patientService } from '../services';
import { validatePatientForm } from '../utils/validation';
import {
  Card,
  Button,
  Input,
  Select,
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
  FiPhone,
  FiMail,
  FiUsers,
  FiDownload,
} from 'react-icons/fi';
import { formatDate, calculateAge, getFullName, exportToCSV } from '../utils/helpers';

const PatientsPage = () => {
  const { success, error: showError } = useNotification();

  // State
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalHistory: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const result = await patientService.getAll();
      if (result.success) {
        // Handle paginated response { content: [], ... } or direct array
        const data = result.data;
        const patientsList = Array.isArray(data) ? data : (data?.content || []);
        setPatients(patientsList);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter patients by search term
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName?.toLowerCase().includes(searchLower) ||
      patient.lastName?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.phone?.includes(searchTerm)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      bloodGroup: '',
      emergencyContact: '',
      medicalHistory: '',
    });
    setFormErrors({});
    setSelectedPatient(null);
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      email: patient.email || '',
      phone: patient.phone || '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      gender: patient.gender || '',
      address: patient.address || '',
      bloodGroup: patient.bloodGroup || '',
      emergencyContact: patient.emergencyContact || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Open view modal
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validation = validatePatientForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormLoading(true);

    try {
      let result;
      if (selectedPatient) {
        result = await patientService.update(selectedPatient.id, formData);
      } else {
        result = await patientService.create(formData);
      }

      if (result.success) {
        success(selectedPatient ? 'Patient updated successfully' : 'Patient created successfully');
        setIsFormModalOpen(false);
        fetchPatients();
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

  // Delete patient
  const handleDelete = async () => {
    if (!selectedPatient) return;

    setFormLoading(true);
    try {
      const result = await patientService.delete(selectedPatient.id);
      if (result.success) {
        success('Patient deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchPatients();
        setSelectedPatient(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to delete patient');
    } finally {
      setFormLoading(false);
    }
  };

  // Export patients
  const handleExport = () => {
    const exportData = patients.map((p) => ({
      'First Name': p.firstName,
      'Last Name': p.lastName,
      Email: p.email,
      Phone: p.phone,
      'Date of Birth': formatDate(p.dateOfBirth),
      Gender: p.gender,
      'Blood Group': p.bloodGroup,
      Address: p.address,
    }));
    exportToCSV(exportData, 'patients.csv');
    success('Patients exported successfully');
  };

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loading size="lg" text="Loading patients..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Patients</h1>
          <p className="text-slate-500 mt-1">Manage patient records and information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={FiDownload}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={handleCreate}
          >
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search patients by name, email, or phone..."
            className="flex-1"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiUsers className="w-4 h-4" />
            <span>{filteredPatients.length} patients</span>
          </div>
        </div>
      </Card>

      {/* Patients Table */}
      <Card padding={false}>
        {paginatedPatients.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No patients found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first patient'}
            action={!searchTerm ? handleCreate : undefined}
            actionText={!searchTerm ? 'Add Patient' : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Contact</th>
                    <th>Age/DOB</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstName={patient.firstName}
                            lastName={patient.lastName}
                            size="md"
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {getFullName(patient.firstName, patient.lastName)}
                            </p>
                            <p className="text-xs text-slate-400">ID: {patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <FiMail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{patient.email || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{patient.phone || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{calculateAge(patient.dateOfBirth)} years</p>
                          <p className="text-xs text-slate-400">{formatDate(patient.dateOfBirth)}</p>
                        </div>
                      </td>
                      <td>
                        <span className="capitalize">{patient.gender?.toLowerCase() || '-'}</span>
                      </td>
                      <td>
                        {patient.bloodGroup ? (
                          <span className="badge-primary">{patient.bloodGroup}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(patient)}
                            className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(patient)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(patient)}
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
              totalItems={filteredPatients.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={formErrors.firstName}
              required
              placeholder="Enter first name"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={formErrors.lastName}
              required
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
              placeholder="Enter email address"
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={formErrors.phone}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              error={formErrors.dateOfBirth}
              required
            />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={genderOptions}
              error={formErrors.gender}
              required
            />
            <Select
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              options={bloodGroupOptions}
              error={formErrors.bloodGroup}
            />
          </div>

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={formErrors.address}
            placeholder="Enter full address"
          />

          <Input
            label="Emergency Contact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Emergency contact number"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
            >
              {selectedPatient ? 'Update Patient' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Patient Details"
        size="md"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                firstName={selectedPatient.firstName}
                lastName={selectedPatient.lastName}
                size="xl"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {getFullName(selectedPatient.firstName, selectedPatient.lastName)}
                </h3>
                <p className="text-slate-500">Patient ID: {selectedPatient.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium">{selectedPatient.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-medium">{selectedPatient.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Date of Birth</p>
                <p className="font-medium">{formatDate(selectedPatient.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Age</p>
                <p className="font-medium">{calculateAge(selectedPatient.dateOfBirth)} years</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Gender</p>
                <p className="font-medium capitalize">{selectedPatient.gender?.toLowerCase() || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Blood Group</p>
                <p className="font-medium">{selectedPatient.bloodGroup || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Address</p>
              <p className="font-medium">{selectedPatient.address || '-'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Emergency Contact</p>
              <p className="font-medium">{selectedPatient.emergencyContact || '-'}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                icon={FiEdit2}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedPatient);
                }}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete ${getFullName(selectedPatient?.firstName, selectedPatient?.lastName)}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        loading={formLoading}
      />
    </div>
  );
};

export default PatientsPage;
