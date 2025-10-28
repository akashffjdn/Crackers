import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaBan, FaCheck, FaDownload, FaTimes ,FaSave} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout'; //
import { User } from '../../data/types'; //
import api from '../../services/api'; //
import LoadingSpinner from '../../components/LoadingSpinner'; //
import Pagination from '../../components/Pagination'; //

// Interface matching backend User model structure for API responses
interface UserFromAPI extends Omit<User, 'id'> {
    _id: string; // Backend uses _id
}

interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    isActive: boolean;
    // Add address fields if you want to edit them here
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
}


const UserManagement: React.FC = () => {
    // State for users, loading, errors
    const [users, setUsers] = useState<User[]>([]); // Use frontend User type with 'id'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for filtering and pagination (remains mostly the same)
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // State for the modal form
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Loading state for save button
    const [formError, setFormError] = useState<string | null>(null); // Error message inside modal
    const [formData, setFormData] = useState<UserFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user',
        isActive: true,
        address: {}, // Initialize address
    });

    // --- Fetch Users Function ---
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/users'); // GET /api/users
            // Map backend _id to frontend id
            const fetchedUsers = response.data.map((user: UserFromAPI) => ({
                ...user,
                id: user._id, // Map _id to id
            }));
            setUsers(fetchedUsers);
        } catch (err: any) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch users');
            setUsers([]); // Clear users on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    // --- Filtering Logic --- (remains the same, uses 'users' state)
    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.firstName.toLowerCase().includes(lowerSearch) ||
                user.lastName.toLowerCase().includes(lowerSearch) ||
                user.email.toLowerCase().includes(lowerSearch) ||
                user.phone.includes(searchTerm)
            );
        }
        if (roleFilter) {
            filtered = filtered.filter(user => user.role === roleFilter);
        }
        if (statusFilter) {
            const isActive = statusFilter === 'active';
            filtered = filtered.filter(user => user.isActive === isActive);
        }

        // Sort is implicit via fetch/state update order, can add explicit sort if needed
        // filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setFilteredUsers(filtered);
        if (currentPage !== 1) setCurrentPage(1); // Reset page on filter change

    }, [users, searchTerm, roleFilter, statusFilter, currentPage]); // Added currentPage dependency

    // --- Pagination Calculation --- (remains the same)
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    // --- Modal and Form Handlers ---

    // Open Add User Modal
    const handleAddUser = () => {
        setSelectedUser(null);
        setFormData({ // Reset form data
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'user',
            isActive: true,
            address: {},
        });
        setFormError(null);
        setIsFormOpen(true);
    };

    // Open Edit User Modal
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setFormData({ // Populate form data
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            address: user.address ? { ...user.address } : {}, // Copy address object
        });
        setFormError(null);
        setIsFormOpen(true);
    };

    // Handle input changes in the modal form
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle nested address fields
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value,
                }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        }
         else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    // Save User (Add or Update) - Calls API
    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setIsSaving(true);
        setFormError(null);

        // Basic validation (add more if needed)
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
             setFormError('Please fill in all required fields.');
             setIsSaving(false);
             return;
        }

        try {
            if (selectedUser) {
                // Update existing user
                await api.put(`/users/${selectedUser.id}`, formData); // PUT /api/users/:id
            } else {
                // Create new user - NOTE: Backend doesn't have an admin route for this.
                // Usually creation is via /api/auth/register which needs a password.
                // For admin creation, you might need a dedicated backend endpoint
                // or adjust the register route for admin use (less common).
                // We'll skip creation via this form for now, assuming users register themselves.
                 alert("Admin user creation via this form is not implemented. Users should register themselves.");
                 setFormError("Admin user creation via this form is not implemented.");
                 setIsSaving(false);
                 return;
                 // If you add a POST /api/users route for admin creation:
                 // await api.post('/users', { ...formData, password: 'temporaryPassword' }); // Needs password handling
            }
            setIsFormOpen(false);
            fetchUsers(); // Refetch users to show changes
        } catch (err: any) {
            console.error("Error saving user:", err);
            setFormError(err.response?.data?.message || err.message || 'Failed to save user');
        } finally {
            setIsSaving(false);
        }
    };

    // Toggle User Status - Calls API
    const handleToggleUserStatus = async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newStatus = !user.isActive;
        // Optimistic UI update (optional) - update state first
        // setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: newStatus } : u));

        try {
            await api.put(`/users/${userId}`, { isActive: newStatus }); // PUT /api/users/:id
            // If not doing optimistic update, refetch here:
            fetchUsers();
            alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully.`);
        } catch (err: any) {
            console.error("Error toggling user status:", err);
            alert(`Failed to toggle status: ${err.response?.data?.message || err.message}`);
            // Revert optimistic update if it failed
            // setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: user.isActive } : u));
        }
    };

    // Delete User - Calls API
    const handleDeleteUser = async (userId: string) => {
        const userToDelete = users.find(u => u.id === userId);
        if (userToDelete?.role === 'admin') {
            alert('Cannot delete admin users.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete user ${userToDelete?.firstName} ${userToDelete?.lastName}?`)) {
             // Optimistic UI update (optional)
             // setUsers(prev => prev.filter(u => u.id !== userId));
            try {
                await api.delete(`/users/${userId}`); // DELETE /api/users/:id
                 // If not doing optimistic update, refetch here:
                fetchUsers();
                alert('User deleted successfully.');
            } catch (err: any) {
                console.error("Error deleting user:", err);
                alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
                 // Revert optimistic update if it failed
                 // if (userToDelete) fetchUsers(); // or add the user back manually
            }
        }
    };

    // Calculate Stats (uses 'users' state)
    const userStats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        admins: users.filter(u => u.role === 'admin').length,
        customers: users.filter(u => u.role === 'user').length
    }), [users]);


    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Manage customer accounts and admin users</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                        {/* Export Button (Functionality not implemented) */}
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FaDownload />
                            <span>Export Users</span>
                        </button>
                        {/* Add User Button (Opens Modal - Add functionality via modal save is limited) */}
                        <button
                            onClick={handleAddUser}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <FaUserPlus />
                            <span>Add User</span>
                        </button>
                    </div>
                </div>

                 {/* Loading State */}
                 {isLoading && (
                    <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                        <LoadingSpinner text="Loading users..." />
                    </div>
                 )}

                 {/* Error State */}
                 {error && !isLoading && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        Error: {error}
                        <button onClick={fetchUsers} className="ml-4 px-2 py-1 border border-red-300 rounded text-sm hover:bg-red-100">Retry</button>
                    </div>
                 )}


                {/* Stats Cards - Render only when not loading and no error */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Total Users', value: userStats.total, color: 'text-blue-800' },
                            { label: 'Active', value: userStats.active, color: 'text-green-800' },
                            { label: 'Inactive', value: userStats.inactive, color: 'text-red-800' },
                            { label: 'Customers', value: userStats.customers, color: 'text-purple-800' },
                            { label: 'Admins', value: userStats.admins, color: 'text-yellow-800' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                                <div className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters - Render only when not loading and no error */}
                {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                             {/* Search Input */}
                             <div>
                                <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        id="user-search"
                                        type="search" // Use type="search" for potential browser benefits
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Name, email, phone..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                             </div>
                              {/* Role Filter */}
                            <div>
                                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    id="role-filter"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" // Added bg-white for consistency
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                             {/* Status Filter */}
                            <div>
                                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                     id="status-filter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" // Added bg-white
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                             {/* Clear Filters Button */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setRoleFilter('');
                                        setStatusFilter('');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    type="button" // Explicitly set type
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Table - Render only when not loading and no error */}
                {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {/* Table Headers */}
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                         <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                                No users found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                 {/* User Column */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {/* Avatar Placeholder */}
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                                                            <span className="text-red-600 font-semibold text-sm">
                                                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                             {/* Use original _id from backend if needed for display */}
                                                            <div className="text-xs text-gray-500 font-mono">ID: {user.id.substring(0, 8)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                 {/* Contact Column */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">{user.email}</a>
                                                        <div className="text-sm text-gray-500">{user.phone}</div>
                                                        {user.address && (
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {user.address.city}, {user.address.state}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                 {/* Role Column */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full capitalize ${
                                                        user.role === 'admin'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                 {/* Status Column */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                         <span className={`mr-1.5 h-2 w-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                 {/* Joined Column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                 {/* Actions Column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleUserStatus(user.id)}
                                                            className={`p-1 rounded transition-colors ${
                                                                user.isActive
                                                                    ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                                                                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                                            }`}
                                                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                                        >
                                                            {user.isActive ? <FaBan /> : <FaCheck />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                                                            title="Delete User"
                                                            disabled={user.role === 'admin'} // Prevent deleting admins
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                         {/* Pagination Controls */}
                         {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                         )}
                    </div>
                )}

                {/* User Form Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] flex flex-col">
                             {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {selectedUser ? 'Edit User' : 'Add New User'}
                                </h3>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                             {/* Modal Form */}
                             <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-5">
                                 {/* Form Error */}
                                {formError && (
                                    <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                                        {formError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     {/* First Name */}
                                    <div>
                                        <label htmlFor="form-firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input id="form-firstName" type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                    </div>
                                     {/* Last Name */}
                                    <div>
                                        <label htmlFor="form-lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input id="form-lastName" type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                    </div>
                                </div>
                                 {/* Email */}
                                <div>
                                    <label htmlFor="form-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input id="form-email" type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                </div>
                                 {/* Phone */}
                                <div>
                                    <label htmlFor="form-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input id="form-phone" type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                </div>
                                 {/* Role */}
                                <div>
                                    <label htmlFor="form-role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select id="form-role" name="role" value={formData.role} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                                        <option value="user">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                 {/* Address Fields (Optional) */}
                                <fieldset className="border p-4 rounded-lg">
                                    <legend className="text-sm font-medium text-gray-700 px-1">Address (Optional)</legend>
                                    <div className="space-y-3">
                                        <input type="text" name="address.street" value={formData.address?.street || ''} onChange={handleFormChange} placeholder="Street" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <input type="text" name="address.city" value={formData.address?.city || ''} onChange={handleFormChange} placeholder="City" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                            <input type="text" name="address.state" value={formData.address?.state || ''} onChange={handleFormChange} placeholder="State" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                            <input type="text" name="address.pincode" value={formData.address?.pincode || ''} onChange={handleFormChange} placeholder="Pincode" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Status Toggle */}
                                <div className="flex items-center pt-2">
                                    <input id="form-isActive" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"/>
                                    <label htmlFor="form-isActive" className="ml-2 block text-sm font-medium text-gray-900">
                                        Active User
                                    </label>
                                </div>
                             </form>

                             {/* Modal Footer */}
                            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    type="button"
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                     onClick={handleSaveUser} // Use onClick to trigger save logic
                                    type="button" // Change type to button as onSubmit is on the form
                                    disabled={isSaving}
                                    className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <LoadingSpinner size="sm" color="text-white"/> : <FaSave />}
                                    <span>{isSaving ? 'Saving...' : (selectedUser ? 'Update User' : 'Create User')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default UserManagement;