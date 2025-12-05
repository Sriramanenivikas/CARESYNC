import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { billService, patientService, appointmentService } from '../services';
import { validateBillForm } from '../utils/validation';
import { requiresAccessCode } from '../utils/accessCode';
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
  FiDollarSign,
  FiDownload,
  FiCheckCircle,
  FiPrinter,
  FiClock,
  FiAlertCircle,
} from 'react-icons/fi';
import { formatDate, formatCurrency, getFullName, exportToCSV } from '../utils/helpers';

const BillsPage = () => {
  const { success, error: showError } = useNotification();
  const { user } = useAuth();

  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
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
  const [selectedBill, setSelectedBill] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    amount: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  const role = user?.role;
  const isPatient = role === 'PATIENT';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Helper to extract array
      const extractArray = (res) => {
        if (!res.success) return [];
        const data = res.data;
        return Array.isArray(data) ? data : (data?.content || []);
      };

      // Get patientId for patient role
      let patientId = user?.patientId;
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

      // Fetch bills based on role
      let billsPromise;
      if (isPatient && patientId) {
        billsPromise = billService.getByPatient(patientId);
      } else {
        billsPromise = billService.getAll();
      }

      const [billsRes, patientsRes, appointmentsRes] = await Promise.all([
        billsPromise,
        patientService.getAll().catch(() => ({ success: false, data: [] })),
        appointmentService.getAll().catch(() => ({ success: false, data: [] })),
      ]);

      const billsData = extractArray(billsRes);
      setBills(billsData);
      calculateStats(billsData);
      setPatients(extractArray(patientsRes));
      setAppointments(extractArray(appointmentsRes));
    } catch (err) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [showError, user, isPatient]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateStats = (billData) => {
    const total = billData.length;
    const paid = billData.filter(b => b.status === 'PAID').length;
    const pending = billData.filter(b => b.status === 'PENDING').length;
    const partial = billData.filter(b => b.status === 'PARTIAL').length;
    const overdue = billData.filter(b => {
      if (b.status === 'PENDING' && b.dueDate) {
        return new Date(b.dueDate) < new Date();
      }
      return false;
    }).length;
    // Use finalAmount, fallback to totalAmount, then amount
    const getAmount = (b) => b.finalAmount || b.totalAmount || b.amount || 0;
    const totalAmount = billData.reduce((sum, b) => sum + getAmount(b), 0);
    const paidAmount = billData.filter(b => b.status === 'PAID').reduce((sum, b) => sum + getAmount(b), 0);
    const pendingAmount = billData.filter(b => b.status === 'PENDING' || b.status === 'PARTIAL')
      .reduce((sum, b) => {
        const total = getAmount(b);
        const paidPart = b.paidAmount || 0;
        return sum + (total - paidPart);
      }, 0);

    setStats({ total, paid, pending: pending + partial, overdue, totalAmount, paidAmount, pendingAmount });
  };

  const filteredBills = bills.filter((bill) => {
    const searchLower = searchTerm.toLowerCase();
    const patientName = bill.patientName || `${bill.patient?.firstName || ''} ${bill.patient?.lastName || ''}`;
    const matchesSearch = 
      patientName.toLowerCase().includes(searchLower) ||
      bill.billNumber?.toLowerCase().includes(searchLower) ||
      bill.notes?.toLowerCase().includes(searchLower);
    
    const matchesStatus = !statusFilter || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      patientId: '',
      appointmentId: '',
      amount: '',
      description: '',
      status: 'PENDING',
      dueDate: '',
    });
    setFormErrors({});
    setSelectedBill(null);
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

  const handleEdit = (bill) => {
    if (requiresAccessCode(user, 'UPDATE')) {
      setPendingAction({ type: 'UPDATE', bill });
      setIsAccessCodeModalOpen(true);
    } else {
      proceedWithEdit(bill);
    }
  };

  const proceedWithEdit = (bill) => {
    setSelectedBill(bill);
    setFormData({
      patientId: bill.patient?.id?.toString() || '',
      appointmentId: bill.appointment?.id?.toString() || '',
      amount: bill.amount?.toString() || '',
      description: bill.description || '',
      status: bill.status || 'PENDING',
      dueDate: bill.dueDate ? bill.dueDate.split('T')[0] : '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleView = (bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (bill) => {
    setSelectedBill(bill);
    if (requiresAccessCode(user, 'DELETE')) {
      setPendingAction({ type: 'DELETE', bill });
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
      proceedWithEdit(pendingAction.bill);
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

    const validation = validateBillForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormLoading(true);

    try {
      const submitData = {
        patientId: parseInt(formData.patientId),
        appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : null,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate || null,
      };

      let result;
      if (selectedBill) {
        result = await billService.update(selectedBill.id, submitData);
      } else {
        result = await billService.create(submitData);
      }

      if (result.success) {
        success(selectedBill ? 'Bill updated successfully' : 'Bill created successfully');
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
    if (!selectedBill) return;

    setFormLoading(true);
    try {
      const result = await billService.delete(selectedBill.id);
      if (result.success) {
        success('Bill deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchData();
        setSelectedBill(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to delete bill');
    } finally {
      setFormLoading(false);
    }
  };

  const handleMarkAsPaid = async (bill) => {
    try {
      const result = await billService.updateStatus(bill.id, 'PAID');
      if (result.success) {
        success('Bill marked as paid');
        fetchData();
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to update bill status');
    }
  };

  const handleExport = () => {
    const exportData = bills.map((b) => ({
      'Patient': getFullName(b.patient?.firstName, b.patient?.lastName),
      'Amount': b.amount,
      'Description': b.description,
      'Status': b.status,
      'Due Date': formatDate(b.dueDate),
      'Created': formatDate(b.createdAt),
    }));
    exportToCSV(exportData, 'bills.csv');
    success('Bills exported successfully');
  };

  const handlePrintInvoice = (bill) => {
    const printContent = `
      <html>
        <head>
          <title>Invoice #${bill.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0891b2; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #0891b2; }
            .invoice-title { font-size: 32px; color: #333; }
            .invoice-info { margin-bottom: 30px; }
            .invoice-info p { margin: 5px 0; }
            .bill-to { margin-bottom: 30px; }
            .bill-to h3 { color: #666; margin-bottom: 10px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background: #f8f9fa; }
            .total-row { font-size: 18px; font-weight: bold; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
            .status.PAID { background: #d1fae5; color: #065f46; }
            .status.PENDING { background: #fef3c7; color: #92400e; }
            .status.OVERDUE { background: #fee2e2; color: #991b1b; }
            .footer { margin-top: 50px; text-align: center; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">CareSync Hospital</div>
              <p>123 Medical Center Drive</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div style="text-align: right;">
              <div class="invoice-title">INVOICE</div>
              <p><strong>Invoice #:</strong> ${bill.id.toString().padStart(6, '0')}</p>
              <p><strong>Date:</strong> ${formatDate(bill.createdAt)}</p>
              <p><strong>Due Date:</strong> ${bill.dueDate ? formatDate(bill.dueDate) : 'Upon Receipt'}</p>
            </div>
          </div>

          <div class="bill-to">
            <h3>Bill To:</h3>
            <p><strong>${getFullName(bill.patient?.firstName, bill.patient?.lastName)}</strong></p>
            <p>${bill.patient?.email || ''}</p>
            <p>${bill.patient?.phone || ''}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${bill.description}</td>
                <td style="text-align: right;">${formatCurrency(bill.amount)}</td>
              </tr>
              <tr class="total-row">
                <td>Total</td>
                <td style="text-align: right;">${formatCurrency(bill.amount)}</td>
              </tr>
            </tbody>
          </table>

          <p><strong>Status:</strong> <span class="status ${bill.status}">${bill.status}</span></p>

          <div class="footer">
            <p>Thank you for choosing CareSync Hospital</p>
            <p>Payment is due within 30 days. Please include invoice number with payment.</p>
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

  const appointmentOptions = appointments
    .filter(a => !formData.patientId || a.patient?.id?.toString() === formData.patientId)
    .map((a) => ({
      value: a.id.toString(),
      label: `${formatDate(a.appointmentDateTime)} - Dr. ${getFullName(a.doctor?.firstName, a.doctor?.lastName)}`,
    }));

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'OVERDUE', label: 'Overdue' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loading size="lg" text="Loading bills..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Bills & Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage patient billing and payments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FiDownload} onClick={handleExport}>
            Export
          </Button>
          <Button variant="primary" icon={FiPlus} onClick={handleCreate}>
            Create Bill
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <FiDollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Paid</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.paidAmount)}</p>
            <p className="text-xs text-slate-400">{stats.paid} bills</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
            <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(stats.pendingAmount)}</p>
            <p className="text-xs text-slate-400">{stats.pending} bills</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Overdue</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
            <p className="text-xs text-slate-400">bills</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by patient name or description..."
            className="flex-1"
          />
          <Select
            name="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            className="w-48"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FiDollarSign className="w-4 h-4" />
            <span>{filteredBills.length} bills</span>
          </div>
        </div>
      </Card>

      {/* Bills Table */}
      <Card padding={false}>
        {paginatedBills.length === 0 ? (
          <EmptyState
            icon={FiDollarSign}
            title="No bills found"
            description={searchTerm || statusFilter ? 'Try adjusting your filters' : 'Get started by creating a bill'}
            action={!searchTerm && !statusFilter ? handleCreate : undefined}
            actionText={!searchTerm && !statusFilter ? 'Create Bill' : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Patient</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBills.map((bill) => {
                    const patientName = bill.patientName || getFullName(bill.patient?.firstName, bill.patient?.lastName);
                    const amount = bill.finalAmount || bill.totalAmount || bill.amount || 0;
                    const description = bill.notes || bill.description || 'Consultation';
                    return (
                    <tr key={bill.id}>
                      <td>
                        <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
                          {bill.billNumber || `#${bill.id.toString().padStart(6, '0')}`}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstName={patientName.split(' ')[0]}
                            lastName={patientName.split(' ').slice(1).join(' ')}
                            size="sm"
                          />
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {patientName}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-[200px]">
                        <span className="text-sm text-slate-600 dark:text-slate-300 truncate block">
                          {description}
                        </span>
                      </td>
                      <td>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {formatCurrency(amount)}
                        </span>
                      </td>
                      <td className="text-slate-600 dark:text-slate-300">
                        {bill.dueDate ? formatDate(bill.dueDate) : '-'}
                      </td>
                      <td>
                        <StatusBadge status={bill.status} />
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          {bill.status === 'PENDING' && (
                            <button
                              onClick={() => handleMarkAsPaid(bill)}
                              className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Mark as Paid"
                            >
                              <FiCheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handlePrintInvoice(bill)}
                            className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            title="Print Invoice"
                          >
                            <FiPrinter className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleView(bill)}
                            className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(bill)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(bill)}
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
              totalItems={filteredBills.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedBill ? 'Edit Bill' : 'Create New Bill'}
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
            label="Related Appointment (Optional)"
            name="appointmentId"
            value={formData.appointmentId}
            onChange={handleInputChange}
            options={[{ value: '', label: 'No appointment' }, ...appointmentOptions]}
            disabled={!formData.patientId}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Amount ($)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              error={formErrors.amount}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
              error={formErrors.dueDate}
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={formErrors.description}
            required
            placeholder="e.g., Consultation fee, Lab tests, Medication..."
            rows={3}
            maxLength={500}
          />

          {selectedBill && (
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
              error={formErrors.status}
            />
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedBill ? 'Update Bill' : 'Create Bill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Bill Details"
        size="md"
      >
        {selectedBill && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-slate-600 dark:text-slate-300">
                Invoice #{selectedBill.id.toString().padStart(6, '0')}
              </span>
              <StatusBadge status={selectedBill.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Patient</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar
                    firstName={selectedBill.patient?.firstName}
                    lastName={selectedBill.patient?.lastName}
                    size="sm"
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {getFullName(selectedBill.patient?.firstName, selectedBill.patient?.lastName)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400">Created On</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(selectedBill.createdAt)}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Description</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedBill.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Amount</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {formatCurrency(selectedBill.amount)}
                  </p>
                </div>
              </div>
            </div>

            {selectedBill.dueDate && (
              <div>
                <p className="text-sm text-slate-400">Due Date</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(selectedBill.dueDate)}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button
                variant="outline"
                icon={FiPrinter}
                onClick={() => handlePrintInvoice(selectedBill)}
              >
                Print Invoice
              </Button>
              {selectedBill.status === 'PENDING' && (
                <Button
                  variant="secondary"
                  icon={FiCheckCircle}
                  onClick={() => {
                    handleMarkAsPaid(selectedBill);
                    setIsViewModalOpen(false);
                  }}
                >
                  Mark as Paid
                </Button>
              )}
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
        title="Delete Bill"
        message="Are you sure you want to delete this bill? This action cannot be undone."
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
        itemName={pendingAction?.type === 'CREATE' ? 'new bill' : (selectedBill?.billNumber || 'this bill')}
      />
    </div>
  );
};

export default BillsPage;
