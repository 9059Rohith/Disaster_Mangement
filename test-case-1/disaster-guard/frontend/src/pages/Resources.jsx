import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Resources = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    type: '',
    quantity: '',
    unit: '',
    description: '',
    location: {
      address: ''
    }
  });

  // Mock data for resources
  const mockResources = [
    {
      id: '1',
      name: 'Bottled Water',
      type: 'Water',
      quantity: 500,
      unit: 'bottles',
      description: 'Pallets of 16oz water bottles for emergency distribution',
      location: { address: 'City Hall, 123 Main St, Anytown' },
      status: 'Available',
      createdBy: { name: 'Emergency Services' }
    },
    {
      id: '2',
      name: 'Emergency Blankets',
      type: 'Shelter',
      quantity: 200,
      unit: 'blankets',
      description: 'Thermal emergency blankets',
      location: { address: 'Red Cross Center, 456 Oak Ave, Anytown' },
      status: 'Available',
      createdBy: { name: 'Red Cross' }
    },
    {
      id: '3',
      name: 'First Aid Kits',
      type: 'Medical',
      quantity: 50,
      unit: 'kits',
      description: 'Comprehensive first aid kits with basic medical supplies',
      location: { address: 'Community Center, 789 Pine St, Anytown' },
      status: 'Reserved',
      createdBy: { name: 'Community Health' }
    },
    {
      id: '4',
      name: 'Portable Generators',
      type: 'Equipment',
      quantity: 10,
      unit: 'generators',
      description: '5000W gas-powered generators for emergency power',
      location: { address: 'Fire Station, 101 Elm Rd, Anytown' },
      status: 'Available',
      createdBy: { name: 'Fire Department' }
    },
    {
      id: '5',
      name: 'Non-perishable Food',
      type: 'Food',
      quantity: 1000,
      unit: 'meals',
      description: 'MREs and canned food supplies',
      location: { address: 'Food Bank, 202 Maple Dr, Anytown' },
      status: 'Available',
      createdBy: { name: 'Food Bank' }
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch resources
    const timer = setTimeout(() => {
      setResources(mockResources);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewResource({
        ...newResource,
        [parent]: {
          ...newResource[parent],
          [child]: value
        }
      });
    } else {
      setNewResource({
        ...newResource,
        [name]: value
      });
    }
  };

  const handleSubmitResource = (e) => {
    e.preventDefault();
    
    // In a real app, you would submit the resource to the backend
    // For now, just add it to the local state
    const newResourceWithId = {
      id: `temp-${Date.now()}`,
      ...newResource,
      quantity: parseInt(newResource.quantity),
      status: 'Available',
      createdBy: { name: user?.name || 'Anonymous' }
    };
    
    setResources([...resources, newResourceWithId]);
    setShowAddModal(false);
    setNewResource({
      name: '',
      type: '',
      quantity: '',
      unit: '',
      description: '',
      location: { address: '' }
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'Depleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group resources by type for the summary section
  const resourcesByType = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = 0;
    }
    acc[resource.type] += resource.quantity;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Emergency Resources
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Resource
        </button>
      </div>

      {/* Resource Summary */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <h2 className="text-lg font-medium mb-4">Resource Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(resourcesByType).map(([type, count]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="font-medium text-gray-800">{type}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">{count}</p>
              <p className="text-xs text-gray-500 mt-1">Total items</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white shadow-md rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              id="type-filter"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="Food">Food</option>
              <option value="Water">Water</option>
              <option value="Shelter">Shelter</option>
              <option value="Medical">Medical</option>
              <option value="Equipment">Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="w-full md:w-1/4">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Depleted">Depleted</option>
            </select>
          </div>
          <div className="w-full md:w-2/4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search resources..."
            />
          </div>
        </div>
      </div>

      {/* Resources List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                    <div className="text-sm text-gray-500">{resource.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resource.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {resource.quantity} {resource.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resource.location.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitResource}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Add New Resource
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newResource.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Resource Type
                            </label>
                            <select
                              id="type"
                              name="type"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={newResource.type}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select type</option>
                              <option value="Food">Food</option>
                              <option value="Water">Water</option>
                              <option value="Shelter">Shelter</option>
                              <option value="Medical">Medical</option>
                              <option value="Equipment">Equipment</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                              Quantity
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                className="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                min="1"
                                value={newResource.quantity}
                                onChange={handleInputChange}
                                required
                              />
                              <input
                                type="text"
                                name="unit"
                                placeholder="Unit"
                                className="flex-1 block w-full border border-gray-300 rounded-r-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={newResource.unit}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newResource.description}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location.address"
                            id="location.address"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter address"
                            value={newResource.location.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Resource
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;