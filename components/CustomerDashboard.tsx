// REPOSITORY SOURCE: diplomat-bit/aibanking.dev-jocall3-new | PATH: diplomat-bit-aibanking.dev-jocall3-new-84d7a30/components/CustomerDashboard.tsx
================================================================================


import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => {
                                setCustomerType(e.target.value as '' | 'active' | 'testing');
                                setCurrentPage(1);
                            }}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CustomerDashboard (1).tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search input change
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const handleTypeChange = (newType: '' | 'active' | 'testing') => {
        setCustomerType(newType);
        setCurrentPage(1); // Reset to first page on type change
    };

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => handleTypeChange(e.target.value as '' | 'active' | 'testing')}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CustomerDashboard (2).tsx
================================================================================

```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- The James Burvel O’Callaghan III Code: Customer Management System ---
// --- Core Architectural Components and Declarations ---

// A. CompanyEntity: JBO-CUST-MGMT-001 - The James Burvel O’Callaghan III Code: Customer Management
namespace JBCM {
    // A1. API Endpoints
    export const API_ENDPOINT_A1_GET_CUSTOMERS = '/api/v1/customers';
    export const API_ENDPOINT_A2_ADD_CUSTOMER = '/api/v1/customers';
    export const API_ENDPOINT_A3_UPDATE_CUSTOMER = '/api/v1/customers/{id}';
    export const API_ENDPOINT_A4_DELETE_CUSTOMER = '/api/v1/customers/{id}';
    export const API_ENDPOINT_A5_GET_CUSTOMER_BY_ID = '/api/v1/customers/{id}';
    export const API_ENDPOINT_A6_SEARCH_CUSTOMERS = '/api/v1/customers/search';
    export const API_ENDPOINT_A7_GET_CUSTOMER_STATS = '/api/v1/customers/stats';
    export const API_ENDPOINT_A8_EXPORT_CUSTOMERS = '/api/v1/customers/export';
    export const API_ENDPOINT_A9_IMPORT_CUSTOMERS = '/api/v1/customers/import';
    export const API_ENDPOINT_A10_ACTIVATE_CUSTOMER = '/api/v1/customers/{id}/activate';
    export const API_ENDPOINT_A11_DEACTIVATE_CUSTOMER = '/api/v1/customers/{id}/deactivate';
    export const API_ENDPOINT_A12_LIST_ORDERS_BY_CUSTOMER = '/api/v1/customers/{id}/orders';
    export const API_ENDPOINT_A13_GET_CUSTOMER_NOTES = '/api/v1/customers/{id}/notes';
    export const API_ENDPOINT_A14_ADD_CUSTOMER_NOTE = '/api/v1/customers/{id}/notes';
    export const API_ENDPOINT_A15_UPDATE_CUSTOMER_NOTE = '/api/v1/customers/{id}/notes/{noteId}';
    export const API_ENDPOINT_A16_DELETE_CUSTOMER_NOTE = '/api/v1/customers/{id}/notes/{noteId}';
    export const API_ENDPOINT_A17_GET_CUSTOMER_TRANSACTIONS = '/api/v1/customers/{id}/transactions';
    export const API_ENDPOINT_A18_ADD_CUSTOMER_TRANSACTION = '/api/v1/customers/{id}/transactions';
    export const API_ENDPOINT_A19_GET_CUSTOMER_ADDRESSES = '/api/v1/customers/{id}/addresses';
    export const API_ENDPOINT_A20_ADD_CUSTOMER_ADDRESS = '/api/v1/customers/{id}/addresses';
    export const API_ENDPOINT_A21_UPDATE_CUSTOMER_ADDRESS = '/api/v1/customers/{id}/addresses/{addressId}';
    export const API_ENDPOINT_A22_DELETE_CUSTOMER_ADDRESS = '/api/v1/customers/{id}/addresses/{addressId}';
    export const API_ENDPOINT_A23_GET_CUSTOMER_CONTACTS = '/api/v1/customers/{id}/contacts';
    export const API_ENDPOINT_A24_ADD_CUSTOMER_CONTACT = '/api/v1/customers/{id}/contacts';
    export const API_ENDPOINT_A25_UPDATE_CUSTOMER_CONTACT = '/api/v1/customers/{id}/contacts/{contactId}';
    export const API_ENDPOINT_A26_DELETE_CUSTOMER_CONTACT = '/api/v1/customers/{id}/contacts/{contactId}';
    export const API_ENDPOINT_A27_GET_CUSTOMER_PREFERENCES = '/api/v1/customers/{id}/preferences';
    export const API_ENDPOINT_A28_UPDATE_CUSTOMER_PREFERENCES = '/api/v1/customers/{id}/preferences';
    export const API_ENDPOINT_A29_GET_CUSTOMER_REPORTS = '/api/v1/customers/{id}/reports';
    export const API_ENDPOINT_A30_GENERATE_CUSTOMER_REPORT = '/api/v1/customers/{id}/reports/generate';
    export const API_ENDPOINT_A31_GET_CUSTOMER_SUBSCRIPTIONS = '/api/v1/customers/{id}/subscriptions';
    export const API_ENDPOINT_A32_ADD_CUSTOMER_SUBSCRIPTION = '/api/v1/customers/{id}/subscriptions';
    export const API_ENDPOINT_A33_UPDATE_CUSTOMER_SUBSCRIPTION = '/api/v1/customers/{id}/subscriptions/{subscriptionId}';
    export const API_ENDPOINT_A34_CANCEL_CUSTOMER_SUBSCRIPTION = '/api/v1/customers/{id}/subscriptions/{subscriptionId}/cancel';
    export const API_ENDPOINT_A35_GET_CUSTOMER_LOYALTY_POINTS = '/api/v1/customers/{id}/loyalty';
    export const API_ENDPOINT_A36_ADJUST_CUSTOMER_LOYALTY_POINTS = '/api/v1/customers/{id}/loyalty';
    export const API_ENDPOINT_A37_GET_CUSTOMER_DISCOUNTS = '/api/v1/customers/{id}/discounts';
    export const API_ENDPOINT_A38_APPLY_CUSTOMER_DISCOUNT = '/api/v1/customers/{id}/discounts/{discountId}/apply';
    export const API_ENDPOINT_A39_REMOVE_CUSTOMER_DISCOUNT = '/api/v1/customers/{id}/discounts/{discountId}/remove';
    export const API_ENDPOINT_A40_GET_CUSTOMER_TAGS = '/api/v1/customers/{id}/tags';
    export const API_ENDPOINT_A41_ADD_CUSTOMER_TAG = '/api/v1/customers/{id}/tags';
    export const API_ENDPOINT_A42_REMOVE_CUSTOMER_TAG = '/api/v1/customers/{id}/tags/{tagId}/remove';
    export const API_ENDPOINT_A43_GET_CUSTOMER_ACTIVITY_LOG = '/api/v1/customers/{id}/activity';
    export const API_ENDPOINT_A44_GET_CUSTOMER_FILES = '/api/v1/customers/{id}/files';
    export const API_ENDPOINT_A45_UPLOAD_CUSTOMER_FILE = '/api/v1/customers/{id}/files';
    export const API_ENDPOINT_A46_DELETE_CUSTOMER_FILE = '/api/v1/customers/{id}/files/{fileId}/delete';
    export const API_ENDPOINT_A47_GET_CUSTOMER_EMAILS = '/api/v1/customers/{id}/emails';
    export const API_ENDPOINT_A48_SEND_CUSTOMER_EMAIL = '/api/v1/customers/{id}/emails/send';
    export const API_ENDPOINT_A49_GET_CUSTOMER_SMS_MESSAGES = '/api/v1/customers/{id}/sms';
    export const API_ENDPOINT_A50_SEND_CUSTOMER_SMS_MESSAGE = '/api/v1/customers/{id}/sms/send';
    export const API_ENDPOINT_A51_GET_CUSTOMER_SUPPORT_TICKETS = '/api/v1/customers/{id}/support-tickets';
    export const API_ENDPOINT_A52_CREATE_CUSTOMER_SUPPORT_TICKET = '/api/v1/customers/{id}/support-tickets/create';
    export const API_ENDPOINT_A53_UPDATE_CUSTOMER_SUPPORT_TICKET = '/api/v1/customers/{id}/support-tickets/{ticketId}/update';
    export const API_ENDPOINT_A54_CLOSE_CUSTOMER_SUPPORT_TICKET = '/api/v1/customers/{id}/support-tickets/{ticketId}/close';
    export const API_ENDPOINT_A55_GET_CUSTOMER_INVOICES = '/api/v1/customers/{id}/invoices';
    export const API_ENDPOINT_A56_GENERATE_CUSTOMER_INVOICE = '/api/v1/customers/{id}/invoices/generate';
    export const API_ENDPOINT_A57_PAY_CUSTOMER_INVOICE = '/api/v1/customers/{id}/invoices/{invoiceId}/pay';
    export const API_ENDPOINT_A58_GET_CUSTOMER_PAYMENTS = '/api/v1/customers/{id}/payments';
    export const API_ENDPOINT_A59_REFUND_CUSTOMER_PAYMENT = '/api/v1/customers/{id}/payments/{paymentId}/refund';
    export const API_ENDPOINT_A60_GET_CUSTOMER_COUPONS = '/api/v1/customers/{id}/coupons';
    export const API_ENDPOINT_A61_APPLY_CUSTOMER_COUPON = '/api/v1/customers/{id}/coupons/{couponId}/apply';
    export const API_ENDPOINT_A62_REMOVE_CUSTOMER_COUPON = '/api/v1/customers/{id}/coupons/{couponId}/remove';
    export const API_ENDPOINT_A63_GET_CUSTOMER_REWARDS = '/api/v1/customers/{id}/rewards';
    export const API_ENDPOINT_A64_REDEEM_CUSTOMER_REWARD = '/api/v1/customers/{id}/rewards/{rewardId}/redeem';
    export const API_ENDPOINT_A65_GET_CUSTOMER_REFERRALS = '/api/v1/customers/{id}/referrals';
    export const API_ENDPOINT_A66_CREATE_CUSTOMER_REFERRAL = '/api/v1/customers/{id}/referrals/create';
    export const API_ENDPOINT_A67_GET_CUSTOMER_ORDERS = '/api/v1/customers/{id}/orders';
    export const API_ENDPOINT_A68_CREATE_CUSTOMER_ORDER = '/api/v1/customers/{id}/orders/create';
    export const API_ENDPOINT_A69_UPDATE_CUSTOMER_ORDER = '/api/v1/customers/{id}/orders/{orderId}/update';
    export const API_ENDPOINT_A70_CANCEL_CUSTOMER_ORDER = '/api/v1/customers/{id}/orders/{orderId}/cancel';
    export const API_ENDPOINT_A71_GET_CUSTOMER_QUOTES = '/api/v1/customers/{id}/quotes';
    export const API_ENDPOINT_A72_CREATE_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/create';
    export const API_ENDPOINT_A73_UPDATE_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/{quoteId}/update';
    export const API_ENDPOINT_A74_ACCEPT_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/{quoteId}/accept';
    export const API_ENDPOINT_A75_REJECT_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/{quoteId}/reject';
    export const API_ENDPOINT_A76_GET_CUSTOMER_CONTRACTS = '/api/v1/customers/{id}/contracts';
    export const API_ENDPOINT_A77_CREATE_CUSTOMER_CONTRACT = '/api/v1/customers/{id}/contracts/create';
    export const API_ENDPOINT_A78_UPDATE_CUSTOMER_CONTRACT = '/api/v1/customers/{id}/contracts/{contractId}/update';
    export const API_ENDPOINT_A79_TERMINATE_CUSTOMER_CONTRACT = '/api/v1/customers/{id}/contracts/{contractId}/terminate';
    export const API_ENDPOINT_A80_GET_CUSTOMER_AGREEMENTS = '/api/v1/customers/{id}/agreements';
    export const API_ENDPOINT_A81_CREATE_CUSTOMER_AGREEMENT = '/api/v1/customers/{id}/agreements/create';
    export const API_ENDPOINT_A82_UPDATE_CUSTOMER_AGREEMENT = '/api/v1/customers/{id}/agreements/{agreementId}/update';
    export const API_ENDPOINT_A83_CANCEL_CUSTOMER_AGREEMENT = '/api/v1/customers/{id}/agreements/{agreementId}/cancel';
    export const API_ENDPOINT_A84_GET_CUSTOMER_MEMBERSHIPS = '/api/v1/customers/{id}/memberships';
    export const API_ENDPOINT_A85_ACTIVATE_CUSTOMER_MEMBERSHIP = '/api/v1/customers/{id}/memberships/{membershipId}/activate';
    export const API_ENDPOINT_A86_DEACTIVATE_CUSTOMER_MEMBERSHIP = '/api/v1/customers/{id}/memberships/{membershipId}/deactivate';
    export const API_ENDPOINT_A87_GET_CUSTOMER_PROFILES = '/api/v1/customers/{id}/profiles';
    export const API_ENDPOINT_A88_UPDATE_CUSTOMER_PROFILE = '/api/v1/customers/{id}/profiles/update';
    export const API_ENDPOINT_A89_GET_CUSTOMER_RISK_ASSESSMENT = '/api/v1/customers/{id}/risk-assessment';
    export const API_ENDPOINT_A90_PERFORM_CUSTOMER_RISK_ASSESSMENT = '/api/v1/customers/{id}/risk-assessment/perform';
    export const API_ENDPOINT_A91_GET_CUSTOMER_COMPLIANCE_RECORDS = '/api/v1/customers/{id}/compliance-records';
    export const API_ENDPOINT_A92_UPDATE_CUSTOMER_COMPLIANCE_RECORD = '/api/v1/customers/{id}/compliance-records/update';
    export const API_ENDPOINT_A93_GET_CUSTOMER_SECURITY_LOGS = '/api/v1/customers/{id}/security-logs';
    export const API_ENDPOINT_A94_GET_CUSTOMER_DATA_BREACH_NOTIFICATIONS = '/api/v1/customers/{id}/data-breach-notifications';
    export const API_ENDPOINT_A95_SEND_CUSTOMER_DATA_BREACH_NOTIFICATION = '/api/v1/customers/{id}/data-breach-notifications/send';
    export const API_ENDPOINT_A96_GET_CUSTOMER_ACCESS_LOGS = '/api/v1/customers/{id}/access-logs';
    export const API_ENDPOINT_A97_GET_CUSTOMER_AUDIT_TRAIL = '/api/v1/customers/{id}/audit-trail';
    export const API_ENDPOINT_A98_EXPORT_CUSTOMER_DATA = '/api/v1/customers/{id}/export-data';
    export const API_ENDPOINT_A99_ANALYZE_CUSTOMER_DATA = '/api/v1/customers/{id}/analyze-data';
    export const API_ENDPOINT_A100_PURGE_CUSTOMER_DATA = '/api/v1/customers/{id}/purge-data';

    // A2. Data Structures (Types)
    export interface Customer {
        id: string;
        username: string;
        firstName?: string;
        lastName?: string;
        type: 'active' | 'testing' | 'suspended' | 'blocked' | 'pending' | 'deleted';
        createdDate: string; // ISO 8601 string, e.g., "2024-07-27T12:00:00.000Z"
        lastLogin?: string; // ISO 8601 string
        email?: string;
        phoneNumber?: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        company?: string;
        jobTitle?: string;
        status: 'active' | 'inactive' | 'onboarding' | 'churned';
        preferences?: {
            newsletter: boolean;
            marketingEmails: boolean;
            language: string; // e.g., 'en', 'es', 'fr'
        };
        securitySettings?: {
            twoFactorAuthEnabled: boolean;
            passwordLastChanged: string; // ISO 8601 string
        };
        metadata?: { [key: string]: any }; // Allow for extensible data
        notes?: Array<{
            noteId: string;
            content: string;
            author: string;
            timestamp: string; // ISO 8601 string
        }>;
        tags?: string[];
        subscriptions?: Array<{
            subscriptionId: string;
            plan: string;
            startDate: string; // ISO 8601 string
            endDate?: string; // ISO 8601 string
            status: 'active' | 'pending' | 'cancelled' | 'expired';
        }>;
        loyaltyPoints?: number;
        discounts?: Array<{
            discountId: string;
            name: string;
            description: string;
            amount: number;
            type: 'percentage' | 'fixed';
            startDate: string; // ISO 8601 string
            endDate?: string; // ISO 8601 string
        }>;
    }

    export interface CustomersResponse {
        found: number;
        displaying: number;
        moreAvailable: boolean;
        customers: Customer[];
    }

    export interface NewCustomer {
        username: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        type: 'active' | 'testing' | 'suspended' | 'blocked' | 'pending';
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        company?: string;
        jobTitle?: string;
        preferences?: {
            newsletter: boolean;
            marketingEmails: boolean;
            language: string;
        };
    }

    export interface CustomerUpdate {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        type?: 'active' | 'testing' | 'suspended' | 'blocked' | 'pending';
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zip?: string;
            country?: string;
        };
        company?: string;
        jobTitle?: string;
        status?: 'active' | 'inactive' | 'onboarding' | 'churned';
        preferences?: {
            newsletter?: boolean;
            marketingEmails?: boolean;
            language?: string;
        };
    }

    // A3. Utility Functions
    export const formatDate = (iso8601String: string): string => {
        try {
            return new Date(iso8601String).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) {
            console.error("Invalid date string:", iso8601String, error);
            return "Invalid Date";
        }
    };

    export const formatDateTime = (iso8601String: string): string => {
        try {
            return new Date(iso8601String).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
        } catch (error) {
            console.error("Invalid date string:", iso8601String, error);
            return "Invalid Date/Time";
        }
    };

    // A4. Mock Data (for demonstration and local development)
    const MOCK_CUSTOMERS: Customer[] = [
        { id: 'JBOC3-CUST-0001', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '2023-01-15T10:00:00.000Z', lastLogin: '2024-07-26T14:30:00.000Z', email: 'john.doe@example.com', phoneNumber: '+15551234567', status: 'active', preferences: { newsletter: true, marketingEmails: false, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-06-20T10:00:00.000Z' }, notes: [{ noteId: 'NOTE-001', content: 'Initial contact', author: 'System', timestamp: '2023-01-16T09:00:00.000Z' }], tags: ['premium', 'subscribed'], subscriptions: [{ subscriptionId: 'SUB-001', plan: 'Gold', startDate: '2023-02-01T00:00:00.000Z', endDate: '2024-02-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 1500, discounts: [{ discountId: 'DISC-001', name: 'Welcome Discount', description: '10% off', amount: 10, type: 'percentage', startDate: '2023-01-15T00:00:00.000Z', endDate: '2023-02-15T00:00:00.000Z' }] },
        { id: 'JBOC3-CUST-0002', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '2023-02-20T14:00:00.000Z', lastLogin: '2024-07-25T18:00:00.000Z', email: 'jane.smith@example.com', phoneNumber: '+15559876543', status: 'active', preferences: { newsletter: false, marketingEmails: true, language: 'es' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-07-01T12:00:00.000Z' }, notes: [{ noteId: 'NOTE-002', content: 'Follow up call', author: 'Sales', timestamp: '2023-02-22T11:00:00.000Z' }], tags: ['trial', 'lead'], subscriptions: [{ subscriptionId: 'SUB-002', plan: 'Silver', startDate: '2023-03-10T00:00:00.000Z', endDate: '2024-03-10T00:00:00.000Z', status: 'active' }], loyaltyPoints: 500, discounts: [] },
        { id: 'JBOC3-CUST-0003', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '2023-03-10T11:00:00.000Z', lastLogin: '2024-07-24T10:00:00.000Z', email: 'test.user.1@example.com', phoneNumber: '+15552468013', status: 'onboarding', preferences: { newsletter: true, marketingEmails: true, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-07-20T16:00:00.000Z' }, notes: [], tags: ['beta'], subscriptions: [], loyaltyPoints: 0, discounts: [] },
        { id: 'JBOC3-CUST-0004', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '2023-04-05T16:00:00.000Z', lastLogin: '2024-07-26T08:00:00.000Z', email: 'samantha.green@example.com', phoneNumber: '+15551357924', status: 'active', preferences: { newsletter: false, marketingEmails: false, language: 'fr' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-05-15T09:00:00.000Z' }, notes: [{ noteId: 'NOTE-003', content: 'Initial setup completed', author: 'Support', timestamp: '2023-04-06T14:00:00.000Z' }], tags: ['premium'], subscriptions: [{ subscriptionId: 'SUB-003', plan: 'Platinum', startDate: '2023-05-01T00:00:00.000Z', endDate: '2024-05-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 2500, discounts: [{ discountId: 'DISC-002', name: 'Loyalty Reward', description: '5% off', amount: 5, type: 'percentage', startDate: '2024-01-01T00:00:00.000Z', endDate: '2024-12-31T00:00:00.000Z' }] },
        { id: 'JBOC3-CUST-0005', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '2023-05-01T09:00:00.000Z', lastLogin: '2024-07-23T15:00:00.000Z', email: 'test.user.2@example.com', phoneNumber: '+15550246813', status: 'inactive', preferences: { newsletter: true, marketingEmails: false, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-06-01T11:00:00.000Z' }, notes: [], tags: ['alpha'], subscriptions: [], loyaltyPoints: 100, discounts: [] },
        { id: 'JBOC3-CUST-0006', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '2023-06-12T12:00:00.000Z', lastLogin: '2024-07-27T11:00:00.000Z', email: 'peter.jones@example.com', phoneNumber: '+15553691470', status: 'active', preferences: { newsletter: true, marketingEmails: true, language: 'en' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-07-27T08:00:00.000Z' }, notes: [], tags: ['standard'], subscriptions: [{ subscriptionId: 'SUB-004', plan: 'Silver', startDate: '2023-07-01T00:00:00.000Z', endDate: '2024-07-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 750, discounts: [] },
        { id: 'JBOC3-CUST-0007', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '2023-07-03T17:00:00.000Z', lastLogin: '2024-07-26T16:00:00.000Z', email: 'mary.williams@example.com', phoneNumber: '+15552840961', status: 'active', preferences: { newsletter: false, marketingEmails: true, language: 'es' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-07-10T14:00:00.000Z' }, notes: [], tags: ['premium', 'subscribed'], subscriptions: [{ subscriptionId: 'SUB-005', plan: 'Gold', startDate: '2023-08-15T00:00:00.000Z', endDate: '2024-08-15T00:00:00.000Z', status: 'active' }], loyaltyPoints: 2000, discounts: [] },
        { id: 'JBOC3-CUST-0008', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '2023-08-18T10:00:00.000Z', lastLogin: '2024-07-22T19:00:00.000Z', email: 'test.user.3@example.com', phoneNumber: '+15554703852', status: 'onboarding', preferences: { newsletter: true, marketingEmails: false, language: 'fr' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-07-18T13:00:00.000Z' }, notes: [], tags: ['beta'], subscriptions: [], loyaltyPoints: 0, discounts: [] },
        { id: 'JBOC3-CUST-0009', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '2023-09-01T08:00:00.000Z', lastLogin: '2024-07-25T11:00:00.000Z', email: 'david.brown@example.com', phoneNumber: '+15556139273', status: 'active', preferences: { newsletter: true, marketingEmails: true, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-07-05T10:00:00.000Z' }, notes: [{ noteId: 'NOTE-004', content: 'Customer requested support', author: 'Support', timestamp: '2023-09-02T15:00:00.000Z' }], tags: ['premium', 'active'], subscriptions: [{ subscriptionId: 'SUB-006', plan: 'Platinum', startDate: '2023-10-01T00:00:00.000Z', endDate: '2024-10-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 3000, discounts: [{ discountId: 'DISC-003', name: 'Early Bird', description: '20% off', amount: 20, type: 'percentage', startDate: '2023-09-01T00:00:00.000Z', endDate: '2023-10-01T00:00:00.000Z' }] },
        { id: 'JBOC3-CUST-0010', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '2023-10-11T14:00:00.000Z', lastLogin: '2024-07-24T09:00:00.000Z', email: 'linda.davis@example.com', phoneNumber: '+15557458194', status: 'inactive', preferences: { newsletter: false, marketingEmails: false, language: 'en' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-06-10T17:00:00.000Z' }, notes: [], tags: ['standard', 'churned'], subscriptions: [], loyaltyPoints: 100, discounts: [] }
    ];

    // A5. API Service (Simulated) - Replace with actual API calls in a real application.
    const apiService = {
        // A5.1. Get Customers (Paginated, Filtered, and Searched)
        getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing' | 'suspended' | 'blocked' | 'pending' | 'deleted'): Promise<CustomersResponse> => {
            console.log(`[JBOC3 API] Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
            await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

            let filteredCustomers = [...MOCK_CUSTOMERS];

            if (search) {
                const lowerSearch = search.toLowerCase();
                filteredCustomers = filteredCustomers.filter(c =>
                    c.username.toLowerCase().includes(lowerSearch) ||
                    (c.firstName && c.firstName.toLowerCase().includes(lowerSearch)) ||
                    (c.lastName && c.lastName.toLowerCase().includes(lowerSearch)) ||
                    (c.email && c.email.toLowerCase().includes(lowerSearch)) ||
                    (c.phoneNumber && c.phoneNumber.includes(search))
                );
            }

            if (type) {
                filteredCustomers = filteredCustomers.filter(c => c.type === type);
            }

            const startIndex = (start - 1) * limit;
            const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + limit);

            return {
                found: filteredCustomers.length,
                displaying: paginatedCustomers.length,
                moreAvailable: startIndex + paginatedCustomers.length < filteredCustomers.length,
                customers: paginatedCustomers,
            };
        },
        // A5.2. Add a New Customer
        addCustomer: async (customerData: NewCustomer): Promise<Customer> => {
            console.log(`[JBOC3 API] Adding customer:`, customerData);
            await new Promise(resolve => setTimeout(resolve, 750));
            const newCustomerId = `JBOC3-CUST-${Math.floor(Math.random() * 9000).toString().padStart(4, '0')}`; // Ensure unique ID
            const newCustomer: Customer = {
                id: newCustomerId,
                createdDate: new Date().toISOString(),
                ...customerData,
                type: customerData.

================================================================================
// APPENDED FROM REPO: diplomat-bit/almost | ORIGINAL PATH: diplomat-bit-almost-93a5466/components/CustomerDashboard.tsx
================================================================================


import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => {
                                setCustomerType(e.target.value as '' | 'active' | 'testing');
                                setCurrentPage(1);
                            }}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CustomerDashboard (1).tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search input change
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const handleTypeChange = (newType: '' | 'active' | 'testing') => {
        setCustomerType(newType);
        setCurrentPage(1); // Reset to first page on type change
    };

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => handleTypeChange(e.target.value as '' | 'active' | 'testing')}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CustomerDashboard.tsx
================================================================================


import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => {
                                setCustomerType(e.target.value as '' | 'active' | 'testing');
                                setCurrentPage(1);
                            }}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/Fuckyou | ORIGINAL PATH: diplomat-bit-Fuckyou-70f83c5/components/CustomerDashboard_1.tsx
================================================================================


import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => {
                                setCustomerType(e.target.value as '' | 'active' | 'testing');
                                setCurrentPage(1);
                            }}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;


================================================================================
// APPENDED FROM REPO: diplomat-bit/jamesburvelocallaghaniiiand | ORIGINAL PATH: diplomat-bit-jamesburvelocallaghaniiiand-9414e97/components/CustomerDashboard.tsx
================================================================================

```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- The James Burvel O’Callaghan III Code: Customer Management System ---
// --- Core Architectural Components and Declarations ---

// A. CompanyEntity: JBO-CUST-MGMT-001 - The James Burvel O’Callaghan III Code: Customer Management
namespace JBCM {
    // A1. API Endpoints
    export const API_ENDPOINT_A1_GET_CUSTOMERS = '/api/v1/customers';
    export const API_ENDPOINT_A2_ADD_CUSTOMER = '/api/v1/customers';
    export const API_ENDPOINT_A3_UPDATE_CUSTOMER = '/api/v1/customers/{id}';
    export const API_ENDPOINT_A4_DELETE_CUSTOMER = '/api/v1/customers/{id}';
    export const API_ENDPOINT_A5_GET_CUSTOMER_BY_ID = '/api/v1/customers/{id}';
    export const API_ENDPOINT_A6_SEARCH_CUSTOMERS = '/api/v1/customers/search';
    export const API_ENDPOINT_A7_GET_CUSTOMER_STATS = '/api/v1/customers/stats';
    export const API_ENDPOINT_A8_EXPORT_CUSTOMERS = '/api/v1/customers/export';
    export const API_ENDPOINT_A9_IMPORT_CUSTOMERS = '/api/v1/customers/import';
    export const API_ENDPOINT_A10_ACTIVATE_CUSTOMER = '/api/v1/customers/{id}/activate';
    export const API_ENDPOINT_A11_DEACTIVATE_CUSTOMER = '/api/v1/customers/{id}/deactivate';
    export const API_ENDPOINT_A12_LIST_ORDERS_BY_CUSTOMER = '/api/v1/customers/{id}/orders';
    export const API_ENDPOINT_A13_GET_CUSTOMER_NOTES = '/api/v1/customers/{id}/notes';
    export const API_ENDPOINT_A14_ADD_CUSTOMER_NOTE = '/api/v1/customers/{id}/notes';
    export const API_ENDPOINT_A15_UPDATE_CUSTOMER_NOTE = '/api/v1/customers/{id}/notes/{noteId}';
    export const API_ENDPOINT_A16_DELETE_CUSTOMER_NOTE = '/api/v1/customers/{id}/notes/{noteId}';
    export const API_ENDPOINT_A17_GET_CUSTOMER_TRANSACTIONS = '/api/v1/customers/{id}/transactions';
    export const API_ENDPOINT_A18_ADD_CUSTOMER_TRANSACTION = '/api/v1/customers/{id}/transactions';
    export const API_ENDPOINT_A19_GET_CUSTOMER_ADDRESSES = '/api/v1/customers/{id}/addresses';
    export const API_ENDPOINT_A20_ADD_CUSTOMER_ADDRESS = '/api/v1/customers/{id}/addresses';
    export const API_ENDPOINT_A21_UPDATE_CUSTOMER_ADDRESS = '/api/v1/customers/{id}/addresses/{addressId}';
    export const API_ENDPOINT_A22_DELETE_CUSTOMER_ADDRESS = '/api/v1/customers/{id}/addresses/{addressId}';
    export const API_ENDPOINT_A23_GET_CUSTOMER_CONTACTS = '/api/v1/customers/{id}/contacts';
    export const API_ENDPOINT_A24_ADD_CUSTOMER_CONTACT = '/api/v1/customers/{id}/contacts';
    export const API_ENDPOINT_A25_UPDATE_CUSTOMER_CONTACT = '/api/v1/customers/{id}/contacts/{contactId}';
    export const API_ENDPOINT_A26_DELETE_CUSTOMER_CONTACT = '/api/v1/customers/{id}/contacts/{contactId}';
    export const API_ENDPOINT_A27_GET_CUSTOMER_PREFERENCES = '/api/v1/customers/{id}/preferences';
    export const API_ENDPOINT_A28_UPDATE_CUSTOMER_PREFERENCES = '/api/v1/customers/{id}/preferences';
    export const API_ENDPOINT_A29_GET_CUSTOMER_REPORTS = '/api/v1/customers/{id}/reports';
    export const API_ENDPOINT_A30_GENERATE_CUSTOMER_REPORT = '/api/v1/customers/{id}/reports/generate';
    export const API_ENDPOINT_A31_GET_CUSTOMER_SUBSCRIPTIONS = '/api/v1/customers/{id}/subscriptions';
    export const API_ENDPOINT_A32_ADD_CUSTOMER_SUBSCRIPTION = '/api/v1/customers/{id}/subscriptions';
    export const API_ENDPOINT_A33_UPDATE_CUSTOMER_SUBSCRIPTION = '/api/v1/customers/{id}/subscriptions/{subscriptionId}';
    export const API_ENDPOINT_A34_CANCEL_CUSTOMER_SUBSCRIPTION = '/api/v1/customers/{id}/subscriptions/{subscriptionId}/cancel';
    export const API_ENDPOINT_A35_GET_CUSTOMER_LOYALTY_POINTS = '/api/v1/customers/{id}/loyalty';
    export const API_ENDPOINT_A36_ADJUST_CUSTOMER_LOYALTY_POINTS = '/api/v1/customers/{id}/loyalty';
    export const API_ENDPOINT_A37_GET_CUSTOMER_DISCOUNTS = '/api/v1/customers/{id}/discounts';
    export const API_ENDPOINT_A38_APPLY_CUSTOMER_DISCOUNT = '/api/v1/customers/{id}/discounts/{discountId}/apply';
    export const API_ENDPOINT_A39_REMOVE_CUSTOMER_DISCOUNT = '/api/v1/customers/{id}/discounts/{discountId}/remove';
    export const API_ENDPOINT_A40_GET_CUSTOMER_TAGS = '/api/v1/customers/{id}/tags';
    export const API_ENDPOINT_A41_ADD_CUSTOMER_TAG = '/api/v1/customers/{id}/tags';
    export const API_ENDPOINT_A42_REMOVE_CUSTOMER_TAG = '/api/v1/customers/{id}/tags/{tagId}/remove';
    export const API_ENDPOINT_A43_GET_CUSTOMER_ACTIVITY_LOG = '/api/v1/customers/{id}/activity';
    export const API_ENDPOINT_A44_GET_CUSTOMER_FILES = '/api/v1/customers/{id}/files';
    export const API_ENDPOINT_A45_UPLOAD_CUSTOMER_FILE = '/api/v1/customers/{id}/files';
    export const API_ENDPOINT_A46_DELETE_CUSTOMER_FILE = '/api/v1/customers/{id}/files/{fileId}/delete';
    export const API_ENDPOINT_A47_GET_CUSTOMER_EMAILS = '/api/v1/customers/{id}/emails';
    export const API_ENDPOINT_A48_SEND_CUSTOMER_EMAIL = '/api/v1/customers/{id}/emails/send';
    export const API_ENDPOINT_A49_GET_CUSTOMER_SMS_MESSAGES = '/api/v1/customers/{id}/sms';
    export const API_ENDPOINT_A50_SEND_CUSTOMER_SMS_MESSAGE = '/api/v1/customers/{id}/sms/send';
    export const API_ENDPOINT_A51_GET_CUSTOMER_SUPPORT_TICKETS = '/api/v1/customers/{id}/support-tickets';
    export const API_ENDPOINT_A52_CREATE_CUSTOMER_SUPPORT_TICKET = '/api/v1/customers/{id}/support-tickets/create';
    export const API_ENDPOINT_A53_UPDATE_CUSTOMER_SUPPORT_TICKET = '/api/v1/customers/{id}/support-tickets/{ticketId}/update';
    export const API_ENDPOINT_A54_CLOSE_CUSTOMER_SUPPORT_TICKET = '/api/v1/customers/{id}/support-tickets/{ticketId}/close';
    export const API_ENDPOINT_A55_GET_CUSTOMER_INVOICES = '/api/v1/customers/{id}/invoices';
    export const API_ENDPOINT_A56_GENERATE_CUSTOMER_INVOICE = '/api/v1/customers/{id}/invoices/generate';
    export const API_ENDPOINT_A57_PAY_CUSTOMER_INVOICE = '/api/v1/customers/{id}/invoices/{invoiceId}/pay';
    export const API_ENDPOINT_A58_GET_CUSTOMER_PAYMENTS = '/api/v1/customers/{id}/payments';
    export const API_ENDPOINT_A59_REFUND_CUSTOMER_PAYMENT = '/api/v1/customers/{id}/payments/{paymentId}/refund';
    export const API_ENDPOINT_A60_GET_CUSTOMER_COUPONS = '/api/v1/customers/{id}/coupons';
    export const API_ENDPOINT_A61_APPLY_CUSTOMER_COUPON = '/api/v1/customers/{id}/coupons/{couponId}/apply';
    export const API_ENDPOINT_A62_REMOVE_CUSTOMER_COUPON = '/api/v1/customers/{id}/coupons/{couponId}/remove';
    export const API_ENDPOINT_A63_GET_CUSTOMER_REWARDS = '/api/v1/customers/{id}/rewards';
    export const API_ENDPOINT_A64_REDEEM_CUSTOMER_REWARD = '/api/v1/customers/{id}/rewards/{rewardId}/redeem';
    export const API_ENDPOINT_A65_GET_CUSTOMER_REFERRALS = '/api/v1/customers/{id}/referrals';
    export const API_ENDPOINT_A66_CREATE_CUSTOMER_REFERRAL = '/api/v1/customers/{id}/referrals/create';
    export const API_ENDPOINT_A67_GET_CUSTOMER_ORDERS = '/api/v1/customers/{id}/orders';
    export const API_ENDPOINT_A68_CREATE_CUSTOMER_ORDER = '/api/v1/customers/{id}/orders/create';
    export const API_ENDPOINT_A69_UPDATE_CUSTOMER_ORDER = '/api/v1/customers/{id}/orders/{orderId}/update';
    export const API_ENDPOINT_A70_CANCEL_CUSTOMER_ORDER = '/api/v1/customers/{id}/orders/{orderId}/cancel';
    export const API_ENDPOINT_A71_GET_CUSTOMER_QUOTES = '/api/v1/customers/{id}/quotes';
    export const API_ENDPOINT_A72_CREATE_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/create';
    export const API_ENDPOINT_A73_UPDATE_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/{quoteId}/update';
    export const API_ENDPOINT_A74_ACCEPT_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/{quoteId}/accept';
    export const API_ENDPOINT_A75_REJECT_CUSTOMER_QUOTE = '/api/v1/customers/{id}/quotes/{quoteId}/reject';
    export const API_ENDPOINT_A76_GET_CUSTOMER_CONTRACTS = '/api/v1/customers/{id}/contracts';
    export const API_ENDPOINT_A77_CREATE_CUSTOMER_CONTRACT = '/api/v1/customers/{id}/contracts/create';
    export const API_ENDPOINT_A78_UPDATE_CUSTOMER_CONTRACT = '/api/v1/customers/{id}/contracts/{contractId}/update';
    export const API_ENDPOINT_A79_TERMINATE_CUSTOMER_CONTRACT = '/api/v1/customers/{id}/contracts/{contractId}/terminate';
    export const API_ENDPOINT_A80_GET_CUSTOMER_AGREEMENTS = '/api/v1/customers/{id}/agreements';
    export const API_ENDPOINT_A81_CREATE_CUSTOMER_AGREEMENT = '/api/v1/customers/{id}/agreements/create';
    export const API_ENDPOINT_A82_UPDATE_CUSTOMER_AGREEMENT = '/api/v1/customers/{id}/agreements/{agreementId}/update';
    export const API_ENDPOINT_A83_CANCEL_CUSTOMER_AGREEMENT = '/api/v1/customers/{id}/agreements/{agreementId}/cancel';
    export const API_ENDPOINT_A84_GET_CUSTOMER_MEMBERSHIPS = '/api/v1/customers/{id}/memberships';
    export const API_ENDPOINT_A85_ACTIVATE_CUSTOMER_MEMBERSHIP = '/api/v1/customers/{id}/memberships/{membershipId}/activate';
    export const API_ENDPOINT_A86_DEACTIVATE_CUSTOMER_MEMBERSHIP = '/api/v1/customers/{id}/memberships/{membershipId}/deactivate';
    export const API_ENDPOINT_A87_GET_CUSTOMER_PROFILES = '/api/v1/customers/{id}/profiles';
    export const API_ENDPOINT_A88_UPDATE_CUSTOMER_PROFILE = '/api/v1/customers/{id}/profiles/update';
    export const API_ENDPOINT_A89_GET_CUSTOMER_RISK_ASSESSMENT = '/api/v1/customers/{id}/risk-assessment';
    export const API_ENDPOINT_A90_PERFORM_CUSTOMER_RISK_ASSESSMENT = '/api/v1/customers/{id}/risk-assessment/perform';
    export const API_ENDPOINT_A91_GET_CUSTOMER_COMPLIANCE_RECORDS = '/api/v1/customers/{id}/compliance-records';
    export const API_ENDPOINT_A92_UPDATE_CUSTOMER_COMPLIANCE_RECORD = '/api/v1/customers/{id}/compliance-records/update';
    export const API_ENDPOINT_A93_GET_CUSTOMER_SECURITY_LOGS = '/api/v1/customers/{id}/security-logs';
    export const API_ENDPOINT_A94_GET_CUSTOMER_DATA_BREACH_NOTIFICATIONS = '/api/v1/customers/{id}/data-breach-notifications';
    export const API_ENDPOINT_A95_SEND_CUSTOMER_DATA_BREACH_NOTIFICATION = '/api/v1/customers/{id}/data-breach-notifications/send';
    export const API_ENDPOINT_A96_GET_CUSTOMER_ACCESS_LOGS = '/api/v1/customers/{id}/access-logs';
    export const API_ENDPOINT_A97_GET_CUSTOMER_AUDIT_TRAIL = '/api/v1/customers/{id}/audit-trail';
    export const API_ENDPOINT_A98_EXPORT_CUSTOMER_DATA = '/api/v1/customers/{id}/export-data';
    export const API_ENDPOINT_A99_ANALYZE_CUSTOMER_DATA = '/api/v1/customers/{id}/analyze-data';
    export const API_ENDPOINT_A100_PURGE_CUSTOMER_DATA = '/api/v1/customers/{id}/purge-data';

    // A2. Data Structures (Types)
    export interface Customer {
        id: string;
        username: string;
        firstName?: string;
        lastName?: string;
        type: 'active' | 'testing' | 'suspended' | 'blocked' | 'pending' | 'deleted';
        createdDate: string; // ISO 8601 string, e.g., "2024-07-27T12:00:00.000Z"
        lastLogin?: string; // ISO 8601 string
        email?: string;
        phoneNumber?: string;
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        company?: string;
        jobTitle?: string;
        status: 'active' | 'inactive' | 'onboarding' | 'churned';
        preferences?: {
            newsletter: boolean;
            marketingEmails: boolean;
            language: string; // e.g., 'en', 'es', 'fr'
        };
        securitySettings?: {
            twoFactorAuthEnabled: boolean;
            passwordLastChanged: string; // ISO 8601 string
        };
        metadata?: { [key: string]: any }; // Allow for extensible data
        notes?: Array<{
            noteId: string;
            content: string;
            author: string;
            timestamp: string; // ISO 8601 string
        }>;
        tags?: string[];
        subscriptions?: Array<{
            subscriptionId: string;
            plan: string;
            startDate: string; // ISO 8601 string
            endDate?: string; // ISO 8601 string
            status: 'active' | 'pending' | 'cancelled' | 'expired';
        }>;
        loyaltyPoints?: number;
        discounts?: Array<{
            discountId: string;
            name: string;
            description: string;
            amount: number;
            type: 'percentage' | 'fixed';
            startDate: string; // ISO 8601 string
            endDate?: string; // ISO 8601 string
        }>;
    }

    export interface CustomersResponse {
        found: number;
        displaying: number;
        moreAvailable: boolean;
        customers: Customer[];
    }

    export interface NewCustomer {
        username: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        type: 'active' | 'testing' | 'suspended' | 'blocked' | 'pending';
        address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        company?: string;
        jobTitle?: string;
        preferences?: {
            newsletter: boolean;
            marketingEmails: boolean;
            language: string;
        };
    }

    export interface CustomerUpdate {
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
        type?: 'active' | 'testing' | 'suspended' | 'blocked' | 'pending';
        address?: {
            street?: string;
            city?: string;
            state?: string;
            zip?: string;
            country?: string;
        };
        company?: string;
        jobTitle?: string;
        status?: 'active' | 'inactive' | 'onboarding' | 'churned';
        preferences?: {
            newsletter?: boolean;
            marketingEmails?: boolean;
            language?: string;
        };
    }

    // A3. Utility Functions
    export const formatDate = (iso8601String: string): string => {
        try {
            return new Date(iso8601String).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) {
            console.error("Invalid date string:", iso8601String, error);
            return "Invalid Date";
        }
    };

    export const formatDateTime = (iso8601String: string): string => {
        try {
            return new Date(iso8601String).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
        } catch (error) {
            console.error("Invalid date string:", iso8601String, error);
            return "Invalid Date/Time";
        }
    };

    // A4. Mock Data (for demonstration and local development)
    const MOCK_CUSTOMERS: Customer[] = [
        { id: 'JBOC3-CUST-0001', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '2023-01-15T10:00:00.000Z', lastLogin: '2024-07-26T14:30:00.000Z', email: 'john.doe@example.com', phoneNumber: '+15551234567', status: 'active', preferences: { newsletter: true, marketingEmails: false, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-06-20T10:00:00.000Z' }, notes: [{ noteId: 'NOTE-001', content: 'Initial contact', author: 'System', timestamp: '2023-01-16T09:00:00.000Z' }], tags: ['premium', 'subscribed'], subscriptions: [{ subscriptionId: 'SUB-001', plan: 'Gold', startDate: '2023-02-01T00:00:00.000Z', endDate: '2024-02-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 1500, discounts: [{ discountId: 'DISC-001', name: 'Welcome Discount', description: '10% off', amount: 10, type: 'percentage', startDate: '2023-01-15T00:00:00.000Z', endDate: '2023-02-15T00:00:00.000Z' }] },
        { id: 'JBOC3-CUST-0002', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '2023-02-20T14:00:00.000Z', lastLogin: '2024-07-25T18:00:00.000Z', email: 'jane.smith@example.com', phoneNumber: '+15559876543', status: 'active', preferences: { newsletter: false, marketingEmails: true, language: 'es' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-07-01T12:00:00.000Z' }, notes: [{ noteId: 'NOTE-002', content: 'Follow up call', author: 'Sales', timestamp: '2023-02-22T11:00:00.000Z' }], tags: ['trial', 'lead'], subscriptions: [{ subscriptionId: 'SUB-002', plan: 'Silver', startDate: '2023-03-10T00:00:00.000Z', endDate: '2024-03-10T00:00:00.000Z', status: 'active' }], loyaltyPoints: 500, discounts: [] },
        { id: 'JBOC3-CUST-0003', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '2023-03-10T11:00:00.000Z', lastLogin: '2024-07-24T10:00:00.000Z', email: 'test.user.1@example.com', phoneNumber: '+15552468013', status: 'onboarding', preferences: { newsletter: true, marketingEmails: true, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-07-20T16:00:00.000Z' }, notes: [], tags: ['beta'], subscriptions: [], loyaltyPoints: 0, discounts: [] },
        { id: 'JBOC3-CUST-0004', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '2023-04-05T16:00:00.000Z', lastLogin: '2024-07-26T08:00:00.000Z', email: 'samantha.green@example.com', phoneNumber: '+15551357924', status: 'active', preferences: { newsletter: false, marketingEmails: false, language: 'fr' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-05-15T09:00:00.000Z' }, notes: [{ noteId: 'NOTE-003', content: 'Initial setup completed', author: 'Support', timestamp: '2023-04-06T14:00:00.000Z' }], tags: ['premium'], subscriptions: [{ subscriptionId: 'SUB-003', plan: 'Platinum', startDate: '2023-05-01T00:00:00.000Z', endDate: '2024-05-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 2500, discounts: [{ discountId: 'DISC-002', name: 'Loyalty Reward', description: '5% off', amount: 5, type: 'percentage', startDate: '2024-01-01T00:00:00.000Z', endDate: '2024-12-31T00:00:00.000Z' }] },
        { id: 'JBOC3-CUST-0005', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '2023-05-01T09:00:00.000Z', lastLogin: '2024-07-23T15:00:00.000Z', email: 'test.user.2@example.com', phoneNumber: '+15550246813', status: 'inactive', preferences: { newsletter: true, marketingEmails: false, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-06-01T11:00:00.000Z' }, notes: [], tags: ['alpha'], subscriptions: [], loyaltyPoints: 100, discounts: [] },
        { id: 'JBOC3-CUST-0006', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '2023-06-12T12:00:00.000Z', lastLogin: '2024-07-27T11:00:00.000Z', email: 'peter.jones@example.com', phoneNumber: '+15553691470', status: 'active', preferences: { newsletter: true, marketingEmails: true, language: 'en' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-07-27T08:00:00.000Z' }, notes: [], tags: ['standard'], subscriptions: [{ subscriptionId: 'SUB-004', plan: 'Silver', startDate: '2023-07-01T00:00:00.000Z', endDate: '2024-07-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 750, discounts: [] },
        { id: 'JBOC3-CUST-0007', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '2023-07-03T17:00:00.000Z', lastLogin: '2024-07-26T16:00:00.000Z', email: 'mary.williams@example.com', phoneNumber: '+15552840961', status: 'active', preferences: { newsletter: false, marketingEmails: true, language: 'es' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-07-10T14:00:00.000Z' }, notes: [], tags: ['premium', 'subscribed'], subscriptions: [{ subscriptionId: 'SUB-005', plan: 'Gold', startDate: '2023-08-15T00:00:00.000Z', endDate: '2024-08-15T00:00:00.000Z', status: 'active' }], loyaltyPoints: 2000, discounts: [] },
        { id: 'JBOC3-CUST-0008', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '2023-08-18T10:00:00.000Z', lastLogin: '2024-07-22T19:00:00.000Z', email: 'test.user.3@example.com', phoneNumber: '+15554703852', status: 'onboarding', preferences: { newsletter: true, marketingEmails: false, language: 'fr' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-07-18T13:00:00.000Z' }, notes: [], tags: ['beta'], subscriptions: [], loyaltyPoints: 0, discounts: [] },
        { id: 'JBOC3-CUST-0009', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '2023-09-01T08:00:00.000Z', lastLogin: '2024-07-25T11:00:00.000Z', email: 'david.brown@example.com', phoneNumber: '+15556139273', status: 'active', preferences: { newsletter: true, marketingEmails: true, language: 'en' }, securitySettings: { twoFactorAuthEnabled: true, passwordLastChanged: '2024-07-05T10:00:00.000Z' }, notes: [{ noteId: 'NOTE-004', content: 'Customer requested support', author: 'Support', timestamp: '2023-09-02T15:00:00.000Z' }], tags: ['premium', 'active'], subscriptions: [{ subscriptionId: 'SUB-006', plan: 'Platinum', startDate: '2023-10-01T00:00:00.000Z', endDate: '2024-10-01T00:00:00.000Z', status: 'active' }], loyaltyPoints: 3000, discounts: [{ discountId: 'DISC-003', name: 'Early Bird', description: '20% off', amount: 20, type: 'percentage', startDate: '2023-09-01T00:00:00.000Z', endDate: '2023-10-01T00:00:00.000Z' }] },
        { id: 'JBOC3-CUST-0010', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '2023-10-11T14:00:00.000Z', lastLogin: '2024-07-24T09:00:00.000Z', email: 'linda.davis@example.com', phoneNumber: '+15557458194', status: 'inactive', preferences: { newsletter: false, marketingEmails: false, language: 'en' }, securitySettings: { twoFactorAuthEnabled: false, passwordLastChanged: '2024-06-10T17:00:00.000Z' }, notes: [], tags: ['standard', 'churned'], subscriptions: [], loyaltyPoints: 100, discounts: [] }
    ];

    // A5. API Service (Simulated) - Replace with actual API calls in a real application.
    const apiService = {
        // A5.1. Get Customers (Paginated, Filtered, and Searched)
        getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing' | 'suspended' | 'blocked' | 'pending' | 'deleted'): Promise<CustomersResponse> => {
            console.log(`[JBOC3 API] Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
            await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

            let filteredCustomers = [...MOCK_CUSTOMERS];

            if (search) {
                const lowerSearch = search.toLowerCase();
                filteredCustomers = filteredCustomers.filter(c =>
                    c.username.toLowerCase().includes(lowerSearch) ||
                    (c.firstName && c.firstName.toLowerCase().includes(lowerSearch)) ||
                    (c.lastName && c.lastName.toLowerCase().includes(lowerSearch)) ||
                    (c.email && c.email.toLowerCase().includes(lowerSearch)) ||
                    (c.phoneNumber && c.phoneNumber.includes(search))
                );
            }

            if (type) {
                filteredCustomers = filteredCustomers.filter(c => c.type === type);
            }

            const startIndex = (start - 1) * limit;
            const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + limit);

            return {
                found: filteredCustomers.length,
                displaying: paginatedCustomers.length,
                moreAvailable: startIndex + paginatedCustomers.length < filteredCustomers.length,
                customers: paginatedCustomers,
            };
        },
        // A5.2. Add a New Customer
        addCustomer: async (customerData: NewCustomer): Promise<Customer> => {
            console.log(`[JBOC3 API] Adding customer:`, customerData);
            await new Promise(resolve => setTimeout(resolve, 750));
            const newCustomerId = `JBOC3-CUST-${Math.floor(Math.random() * 9000).toString().padStart(4, '0')}`; // Ensure unique ID
            const newCustomer: Customer = {
                id: newCustomerId,
                createdDate: new Date().toISOString(),
                ...customerData,
                type: customerData.

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CustomerDashboard (1).tsx
================================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search input change
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const handleTypeChange = (newType: '' | 'active' | 'testing') => {
        setCustomerType(newType);
        setCurrentPage(1); // Reset to first page on type change
    };

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => handleTypeChange(e.target.value as '' | 'active' | 'testing')}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/components/CustomerDashboard.tsx
================================================================================


import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Type Definitions (based on OpenAPI schema) ---

interface Customer {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  type: 'active' | 'testing';
  createdDate: string; // Should be a string representation of Unix timestamp
}

interface CustomersResponse {
  found: number;
  displaying: number;
  moreAvailable: boolean;
  customers: Customer[];
}

interface NewCustomer {
    username: string;
    firstName?: string;
    lastName?: string;
}

interface CustomerUpdate {
    firstName?: string;
    lastName?: string;
}

// --- Mock API Functions ---
// In a real application, these would be in a separate API service file.

const MOCK_CUSTOMERS: Customer[] = [
    { id: '1005061234', username: 'john.doe', firstName: 'John', lastName: 'Doe', type: 'active', createdDate: '1607450357' },
    { id: '1005061235', username: 'jane.smith', firstName: 'Jane', lastName: 'Smith', type: 'active', createdDate: '1607451357' },
    { id: '1005061236', username: 'test.user.1', firstName: 'Test', lastName: 'User1', type: 'testing', createdDate: '1607452357' },
    { id: '1005061237', username: 'samantha.green', firstName: 'Samantha', lastName: 'Green', type: 'active', createdDate: '1607453357' },
    { id: '1005061238', username: 'test.user.2', firstName: 'Test', lastName: 'User2', type: 'testing', createdDate: '1607454357' },
    { id: '1005061239', username: 'peter.jones', firstName: 'Peter', lastName: 'Jones', type: 'active', createdDate: '1607455357' },
    { id: '1005061240', username: 'mary.williams', firstName: 'Mary', lastName: 'Williams', type: 'active', createdDate: '1607456357' },
    { id: '1005061241', username: 'test.user.3', firstName: 'Test', lastName: 'User3', type: 'testing', createdDate: '1607457357' },
    { id: '1005061242', username: 'david.brown', firstName: 'David', lastName: 'Brown', type: 'active', createdDate: '1607458357' },
    { id: '1005061243', username: 'linda.davis', firstName: 'Linda', lastName: 'Davis', type: 'active', createdDate: '1607459357' },
];

const api = {
  getCustomers: async (start: number, limit: number, search: string, type: '' | 'active' | 'testing'): Promise<CustomersResponse> => {
    console.log(`Fetching customers: start=${start}, limit=${limit}, search='${search}', type='${type}'`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    let filtered = MOCK_CUSTOMERS;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c =>
        c.username.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch)
      );
    }

    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }

    const startIndex = (start - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      found: filtered.length,
      displaying: paginated.length,
      moreAvailable: startIndex + paginated.length < filtered.length,
      customers: paginated,
    };
  },
  addCustomer: async (customerData: NewCustomer, type: 'active' | 'testing'): Promise<Customer> => {
    console.log(`Adding ${type} customer:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCustomer: Customer = {
      id: Math.random().toString(36).substring(2, 12),
      createdDate: String(Math.floor(Date.now() / 1000)),
      type,
      ...customerData
    };
    MOCK_CUSTOMERS.unshift(newCustomer); // Add to the top for visibility
    return newCustomer;
  },
  modifyCustomer: async (customerId: string, customerData: CustomerUpdate): Promise<void> => {
    console.log(`Modifying customer ${customerId}:`, customerData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS[index] = { ...MOCK_CUSTOMERS[index], ...customerData };
    } else {
        throw new Error("Customer not found");
    }
  },
  deleteCustomer: async (customerId: string): Promise<void> => {
    console.log(`Deleting customer ${customerId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_CUSTOMERS.findIndex(c => c.id === customerId);
    if (index !== -1) {
        MOCK_CUSTOMERS.splice(index, 1);
    } else {
        throw new Error("Customer not found");
    }
  },
};

// --- Helper Components ---

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CustomerForm: React.FC<{
    initialData?: Partial<Customer>;
    onSubmit: (data: NewCustomer | CustomerUpdate, type?: 'active' | 'testing') => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditMode?: boolean;
}> = ({ initialData, onSubmit, onCancel, isSubmitting, isEditMode = false }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [type, setType] = useState<'active' | 'testing'>(initialData?.type || 'active');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEditMode
          ? { firstName, lastName }
          : { username, firstName, lastName };
        onSubmit(data, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            {!isEditMode && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
                </div>
            )}
             {!isEditMode && (
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">Customer Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as 'active' | 'testing')} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring">
                        <option value="active">Active</option>
                        <option value="testing">Testing</option>
                    </select>
                </div>
             )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring" />
            </div>
            <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

// --- Main Dashboard Component ---

const CustomerDashboard: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [limit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerType, setCustomerType] = useState<'' | 'active' | 'testing'>('');

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRecords / limit), [totalRecords, limit]);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getCustomers(currentPage, limit, debouncedSearch, customerType);
            setCustomers(response.customers);
            setTotalRecords(response.found);
        } catch (err) {
            setError('Failed to fetch customers.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, debouncedSearch, customerType]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFormSubmit = async (data: NewCustomer | CustomerUpdate, type: 'active' | 'testing' = 'active') => {
        setIsSubmitting(true);
        try {
            if (isAddModalOpen) {
                await api.addCustomer(data as NewCustomer, type);
            } else if (isEditModalOpen && selectedCustomer) {
                await api.modifyCustomer(selectedCustomer.id, data as CustomerUpdate);
            }
            closeModals();
            await fetchCustomers();
        } catch (err) {
            console.error("Submission failed:", err);
            setError("Failed to save customer data.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;
        setIsSubmitting(true);
        try {
            await api.deleteCustomer(selectedCustomer.id);
            closeModals();
            await fetchCustomers();
        } catch(err) {
            console.error("Delete failed:", err);
            setError("Failed to delete customer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const closeModals = () => {
        setAddModalOpen(false);
        setEditModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
    };
    
    const formatDate = (unixTimestamp: string) => {
        return new Date(parseInt(unixTimestamp, 10) * 1000).toLocaleDateString();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="col-span-1 md:col-span-2 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        />
                        <select
                            value={customerType}
                            onChange={(e) => {
                                setCustomerType(e.target.value as '' | 'active' | 'testing');
                                setCurrentPage(1);
                            }}
                            className="col-span-1 shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                        >
                            <option value="">All Types</option>
                            <option value="active">Active</option>
                            <option value="testing">Testing</option>
                        </select>
                        <button onClick={() => setAddModalOpen(true)} className="col-span-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Customer
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="text-center p-10">Loading...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled On</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${customer.firstName || ''} ${customer.lastName || ''}`.trim()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                customer.type === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.createdDate)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => openEditModal(customer)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && totalRecords > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                        </span>
                        <div className="space-x-2">
                            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Previous
                            </button>
                            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Customer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={closeModals} title="Add New Customer">
                <CustomerForm onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} />
            </Modal>

            {/* Edit Customer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Customer">
                {selectedCustomer && (
                    <CustomerForm initialData={selectedCustomer} onSubmit={handleFormSubmit} onCancel={closeModals} isSubmitting={isSubmitting} isEditMode />
                )}
            </Modal>

            {/* Delete Customer Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={closeModals} title="Delete Customer">
                {selectedCustomer && (
                    <div>
                        <p className="mb-4 text-gray-700">Are you sure you want to delete customer "{selectedCustomer.username}"? This action cannot be undone.</p>
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={closeModals} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-red-300">
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerDashboard;
