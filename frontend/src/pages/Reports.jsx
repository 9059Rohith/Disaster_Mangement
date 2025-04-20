import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    type: '',
    location: {
      address: ''
    }
  });

  // Mock data for reports
  const mockReports = [
    {
      id: '1',
      title: 'Downed Power Lines',
      description: 'Multiple power lines down on Oak Street following the storm.',
      type: 'Hazard',
      location: { address: '123 Oak St, Anytown' },
      status: 'Verified',
      createdAt: '2023-03-10T08:30:00Z',
      createdBy: { name: 'John Smith' }
    },
    {
      id: '2',
      title: 'Road Flooding',
      description: 'Heavy flooding on Main Street, road impassable by normal vehicles.',
      type: 'Hazard',
      location: { address: 'Main St & 5th Ave, Anytown' },
      status: 'Pending',
      createdAt: '2023-03-10T10:15:00Z',
      createdBy: { name: 'Sarah Johnson' }
    },
    {
      id: '3',
      title: 'Emergency Shelter Needed',
      description: 'Family of 5 displaced by storm damage, in need of temporary shelter.',
      type: 'Resource Request',
      location: { address: '456 Pine Ave, Anytown' },
      status: 'Resolved',
      createdAt: '2023-03-09T18:45:00Z',
      createdBy: { name: 'Michael Brown' }
    },
    {
      id: '4',
      title: 'Tree Fallen on House',
      description: 'Large oak tree has fallen and damaged the roof of residence.',
      type: 'Damage',
      location: { address: '789 Maple Dr, Anytown' },
      status: 'Verified',
      createdAt: '2023-03-09T20:22:00Z',
      createdBy: { name: 'Emily Wilson' }
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch reports
    const timer = setTimeout(() => {
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewReport({
        ...newReport,
        [parent]: {
          ...newReport[parent],
          [child]: value
        }
      });
    } else {
      setNewReport({
        ...newReport,
        [name]: value
      });
    }
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    
    // In a real app, you would submit the report to the backend
    // For now, just add it to the local state
    const newReportWithId = {
      id: `temp-${Date.now()}`,
      ...newReport,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      createdBy: { name: user?.name || 'Anonymous' }
    };
    
    setReports([newReportWithId, ...reports]);
    setShowReportModal(false);
    setNewReport({
      title: '',
      description: '',
      type: '',
      location: { address: '' }
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Incident Reports
        </h1>
        <button
          onClick={() => setShowReportModal(true)}
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
          Submit Report
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white shadow-md rounded-lg mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="type-filter"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="Damage">Damage</option>
              <option value="Hazard">Hazard</option>
              <option value="Resource Request">Resource Request</option>
              <option value="Resource Offer">Resource Offer</option>
              <option value="Status Update">Status Update</option>
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
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
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
              placeholder="Search reports..."
            />
          </div>
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {reports.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {reports.map((report) => (
                <li key={report.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 max-w-2xl">{report.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg 
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        {report.location.address}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-sm text-gray-500 mt-2">{report.type}</span>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>{formatDate(report.createdAt)}</span>
                        <span className="mx-1">•</span>
                        <span>{report.createdBy.name}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reports found.</p>
              <p className="text-sm text-gray-400 mt-1">
                Submit a report to help your community respond to emergencies.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submit Report Modal */}
      {showReportModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitReport}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Submit Incident Report
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newReport.title}
                            onChange={handleInputChange}
                            required
                          />
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
                            value={newReport.description}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Report Type
                          </label>
                          <select
                            id="type"
                            name="type"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newReport.type}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select type</option>
                            <option value="Damage">Damage</option>
                            <option value="Hazard">Hazard</option>
                            <option value="Resource Request">Resource Request</option>
                            <option value="Resource Offer">Resource Offer</option>
                            <option value="Status Update">Status Update</option>
                            <option value="Other">Other</option>
                          </select>
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
                            value={newReport.location.address}
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
                    Submit
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowReportModal(false)}
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

export default Reports;