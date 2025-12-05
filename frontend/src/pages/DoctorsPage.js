import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services';
import { validateDoctorForm } from '../utils/validation';
import { requiresAccessCode } from '../services/accessCodeService';
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
  AccessCodeModal,
} from '../components/common';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPhone,
  FiMail,
  FiUserPlus,
  FiDownload,
  FiDollarSign,
  FiBriefcase,
} from 'react-icons/fi';
import { getFullName, exportToCSV, formatCurrency } from '../utils/helpers';

const DoctorsPage = () => {
  const { success, error: showError } = useNotification();
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experienceYears: '',
    consultationFee: '',
    qualification: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const result = await doctorService.getAll();
      if (result.success) {
        // Handle paginated response { content: [], ... } or direct array
        const data = result.data;
        const doctorsList = Array.isArray(data) ? data : (data?.content || []);
        setDoctors(doctorsList);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.firstName?.toLowerCase().includes(searchLower) ||
      doctor.lastName?.toLowerCase().includes(searchLower) ||
      doctor.email?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      licenseNumber: '',
      experienceYears: '',
      consultationFee: '',
      qualification: '',
    });
    setFormErrors({});
    setSelectedDoctor(null);
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

  const handleEdit = (doctor) => {
    if (requiresAccessCode(user, 'UPDATE')) {
      setPendingAction({ type: 'UPDATE', doctor });
      setIsAccessCodeModalOpen(true);
    } else {
      proceedWithEdit(doctor);
    }
  };

  const proceedWithEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialization: doctor.specialization || '',
      licenseNumber: doctor.licenseNumber || '',
      experienceYears: doctor.experienceYears?.toString() || '',
      consultationFee: doctor.consultationFee?.toString() || '',
      qualification: doctor.qualification || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (doctor) => {
    setSelectedDoctor(doctor);
    if (requiresAccessCode(user, 'DELETE')) {
      setPendingAction({ type: 'DELETE', doctor });
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
      proceedWithEdit(pendingAction.doctor);
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

    const validation = validateDoctorForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormLoading(true);

    try {
      const submitData = {
        ...formData,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
      };

      let result;
      if (selectedDoctor) {
        result = await doctorService.update(selectedDoctor.id, submitData);
      } else {
        result = await doctorService.create(submitData);
      }

      if (result.success) {
        success(selectedDoctor ? 'Doctor updated successfully' : 'Doctor created successfully');
        setIsFormModalOpen(false);
        fetchDoctors();
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
    if (!selectedDoctor) return;

    setFormLoading(true);
    try {
      const result = await doctorService.delete(selectedDoctor.id);
      if (result.success) {
        success('Doctor deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchDoctors();
        setSelectedDoctor(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to delete doctor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = doctors.map((d) => ({
      'First Name': d.firstName,
      'Last Name': d.lastName,
      Email: d.email,
      Phone: d.phone,
      Specialization: d.specialization,
      'License Number': d.licenseNumber,
      'Experience (Years)': d.experienceYears,
      'Consultation Fee': d.consultationFee,
    }));
    exportToCSV(exportData, 'doctors.csv');
    success('Doctors exported successfully');
  };

  const specializationOptions = [
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Endocrinology', label: 'Endocrinology' },
    { value: 'Gastroenterology', label: 'Gastroenterology' },
    { value: 'General Medicine', label: 'General Medicine' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Oncology', label: 'Oncology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Pulmonology', label: 'Pulmonology' },
    { value: 'Radiology', label: 'Radiology' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Urology', label: 'Urology' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loading size="lg" text="Loading doctors..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Doctors</h1>
          <p className="text-slate-500 mt-1">Manage doctor profiles and information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FiDownload} onClick={handleExport}>
            Export
          </Button>
          <Button variant="primary" icon={FiPlus} onClick={handleCreate}>
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search doctors by name, email, or specialization..."
            className="flex-1"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiUserPlus className="w-4 h-4" />
            <span>{filteredDoctors.length} doctors</span>
          </div>
        </div>
      </Card>

      {/* Doctors Grid */}
      {paginatedDoctors.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiUserPlus}
            title="No doctors found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first doctor'}
            action={!searchTerm ? handleCreate : undefined}
            actionText={!searchTerm ? 'Add Doctor' : undefined}
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDoctors.map((doctor) => (
              <Card key={doctor.id} hover className="relative">
                <div className="flex items-start gap-4">
                  <Avatar
                    firstName={doctor.firstName}
                    lastName={doctor.lastName}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate">
                      Dr. {getFullName(doctor.firstName, doctor.lastName)}
                    </h3>
                    <p className="text-sm text-primary-500 font-medium">
                      {doctor.specialization || 'General'}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiMail className="w-3.5 h-3.5" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiPhone className="w-3.5 h-3.5" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm">
                    <FiBriefcase className="w-4 h-4 text-slate-400" />
                    <span>{doctor.experienceYears || 0} yrs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <FiDollarSign className="w-4 h-4 text-slate-400" />
                    <span>{formatCurrency(doctor.consultationFee || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleView(doctor)}
                    className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(doctor)}
                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doctor)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Card padding={false}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredDoctors.length}
              itemsPerPage={itemsPerPage}
            />
          </Card>
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              options={specializationOptions}
              error={formErrors.specialization}
              required
            />
            <Input
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              error={formErrors.licenseNumber}
              required
              placeholder="e.g., MED-12345"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Experience (Years)"
              name="experienceYears"
              type="number"
              value={formData.experienceYears}
              onChange={handleInputChange}
              error={formErrors.experienceYears}
              placeholder="Years of experience"
              min="0"
              max="70"
            />
            <Input
              label="Consultation Fee ($)"
              name="consultationFee"
              type="number"
              value={formData.consultationFee}
              onChange={handleInputChange}
              error={formErrors.consultationFee}
              placeholder="Fee amount"
              min="0"
              step="0.01"
            />
          </div>

          <Input
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            placeholder="e.g., MD, MBBS, PhD"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedDoctor ? 'Update Doctor' : 'Create Doctor'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Doctor Details"
        size="md"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar
                firstName={selectedDoctor.firstName}
                lastName={selectedDoctor.lastName}
                size="xl"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Dr. {getFullName(selectedDoctor.firstName, selectedDoctor.lastName)}
                </h3>
                <p className="text-primary-500 font-medium">{selectedDoctor.specialization}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium">{selectedDoctor.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-medium">{selectedDoctor.phone}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">License Number</p>
                <p className="font-medium">{selectedDoctor.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Experience</p>
                <p className="font-medium">{selectedDoctor.experienceYears || 0} years</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Consultation Fee</p>
                <p className="font-medium">{formatCurrency(selectedDoctor.consultationFee || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Qualification</p>
                <p className="font-medium">{selectedDoctor.qualification || '-'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                icon={FiEdit2}
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedDoctor);
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
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${getFullName(selectedDoctor?.firstName, selectedDoctor?.lastName)}? This action cannot be undone.`}
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
        itemName={pendingAction?.type === 'CREATE' ? 'new doctor' : (selectedDoctor ? `Dr. ${getFullName(selectedDoctor.firstName, selectedDoctor.lastName)}` : '')}
      />
    </div>
  );
};

export default DoctorsPage;
