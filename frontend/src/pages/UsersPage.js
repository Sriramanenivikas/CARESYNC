import React, { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';
import { requiresAccessCode } from '../utils/accessCode';
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
  StatusBadge,
  AccessCodeModal,
} from '../components/common';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUsers,
  FiDownload,
  FiShield,
  FiMail,
  FiPhone,
  FiLock,
} from 'react-icons/fi';
import { formatDate, getFullName, exportToCSV } from '../utils/helpers';

const UsersPage = () => {
  const { success, error: showError } = useNotification();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'PATIENT',
  });
  const [formErrors, setFormErrors] = useState({});
  const [newRole, setNewRole] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await adminService.getUsers();
      
      if (result.success) {
        const data = result.data;
        const usersArray = Array.isArray(data) ? data : (data?.content || []);
        setUsers(usersArray);
      } else {
        showError(result.error || 'Failed to fetch users');
        setUsers([]);
      }
    } catch (err) {
      showError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower);

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'PATIENT',
    });
    setFormErrors({});
    setSelectedUser(null);
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

  const handleEdit = (userToEdit) => {
    if (requiresAccessCode(user, 'UPDATE')) {
      setPendingAction({ type: 'UPDATE', userToEdit });
      setIsAccessCodeModalOpen(true);
    } else {
      proceedWithEdit(userToEdit);
    }
  };

  const proceedWithEdit = (userToEdit) => {
    setSelectedUser(userToEdit);
    setFormData({
      username: userToEdit.username || '',
      email: userToEdit.email || '',
      password: '',
      firstName: userToEdit.firstName || '',
      lastName: userToEdit.lastName || '',
      phone: userToEdit.phone || '',
      role: userToEdit.role || 'PATIENT',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleView = (userToView) => {
    setSelectedUser(userToView);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (userToDelete) => {
    setSelectedUser(userToDelete);
    if (requiresAccessCode(user, 'DELETE')) {
      setPendingAction({ type: 'DELETE', userToDelete });
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
      proceedWithEdit(pendingAction.userToEdit);
    }
    setPendingAction(null);
  };

  const handleRoleClick = (userToUpdate) => {
    setSelectedUser(userToUpdate);
    setNewRole(userToUpdate.role || 'PATIENT');
    setIsRoleModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username?.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!selectedUser && !formData.password?.trim()) {
      errors.password = 'Password is required for new users';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormLoading(true);

    try {
      const submitData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
        role: formData.role,
      };

      if (formData.password) {
        submitData.password = formData.password;
      }

      let result;
      if (selectedUser) {
        result = await adminService.updateUser(selectedUser.id, submitData);
      } else {
        result = await adminService.createUser(submitData);
      }

      if (result.success) {
        success(selectedUser ? 'User updated successfully' : 'User created successfully');
        setIsFormModalOpen(false);
        fetchUsers();
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
    if (!selectedUser) return;

    setFormLoading(true);
    try {
      const result = await adminService.deleteUser(selectedUser.id);
      if (result.success) {
        success('User deleted successfully');
        setIsDeleteDialogOpen(false);
        fetchUsers();
        setSelectedUser(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to delete user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser) return;

    setFormLoading(true);
    try {
      const result = await adminService.updateUserRole(selectedUser.id, newRole);
      if (result.success) {
        success('User role updated successfully');
        setIsRoleModalOpen(false);
        fetchUsers();
        setSelectedUser(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('Failed to update user role');
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = users.map((u) => ({
      Username: u.username,
      Email: u.email,
      'First Name': u.firstName,
      'Last Name': u.lastName,
      Phone: u.phone || '',
      Role: u.role,
      'Created At': formatDate(u.createdAt),
    }));
    exportToCSV(exportData, 'users.csv');
    success('Users exported successfully');
  };

  const roleOptions = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'PATIENT', label: 'Patient' },
  ];

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      DOCTOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      NURSE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      RECEPTIONIST: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      PATIENT: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[role] || colors.PATIENT;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loading size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage system users and roles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={FiDownload} onClick={handleExport}>
            Export
          </Button>
          <Button variant="primary" icon={FiPlus} onClick={handleCreate}>
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {roleOptions.map((role) => {
          const count = users.filter((u) => u.role === role.value).length;
          return (
            <Card key={role.value} className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">{role.label}s</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by username, email, or name..."
            className="flex-1"
          />
          <Select
            name="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[{ value: '', label: 'All Roles' }, ...roleOptions]}
            className="w-48"
          />
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FiUsers className="w-4 h-4" />
            <span>{filteredUsers.length} users</span>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding={false}>
        {paginatedUsers.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No users found"
            description={searchTerm || roleFilter ? 'Try adjusting your filters' : 'Get started by adding a user'}
            action={!searchTerm && !roleFilter ? handleCreate : undefined}
            actionText={!searchTerm && !roleFilter ? 'Add User' : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {getFullName(user.firstName, user.lastName)}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <FiMail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td>
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleRoleClick(user)}
                            className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            title="Change Role"
                          >
                            <FiShield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleView(user)}
                            className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        size="md"
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
              placeholder="John"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={formErrors.lastName}
              required
              placeholder="Doe"
            />
          </div>

          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={formErrors.username}
            required
            placeholder="johndoe"
            disabled={!!selectedUser}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            required
            placeholder="john@example.com"
          />

          <Input
            label={selectedUser ? 'New Password (leave blank to keep current)' : 'Password'}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            required={!selectedUser}
            placeholder="••••••••"
          />

          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
          />

          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            options={roleOptions}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="ghost" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar firstName={selectedUser.firstName} lastName={selectedUser.lastName} size="lg" />
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  {getFullName(selectedUser.firstName, selectedUser.lastName)}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">@{selectedUser.username}</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{selectedUser.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Created At</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Last Updated</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(selectedUser.updatedAt)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button variant="outline" icon={FiEdit2} onClick={() => { setIsViewModalOpen(false); handleEdit(selectedUser); }}>
                Edit
              </Button>
              <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Change Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Change User Role"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <Avatar firstName={selectedUser.firstName} lastName={selectedUser.lastName} size="sm" />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {getFullName(selectedUser.firstName, selectedUser.lastName)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current role: {selectedUser.role}</p>
              </div>
            </div>

            <Select
              label="New Role"
              name="newRole"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              options={roleOptions}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button type="button" variant="ghost" onClick={() => setIsRoleModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                icon={FiShield} 
                onClick={handleRoleUpdate} 
                loading={formLoading}
                disabled={newRole === selectedUser.role}
              >
                Update Role
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
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.username}"? This action cannot be undone.`}
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
        itemName={pendingAction?.type === 'CREATE' ? 'new user' : (selectedUser?.username || 'this user')}
      />
    </div>
  );
};

export default UsersPage;
