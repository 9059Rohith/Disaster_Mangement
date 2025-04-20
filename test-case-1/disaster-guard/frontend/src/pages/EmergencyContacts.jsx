import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    phone: '',
    email: '',
    website: '',
    category: 'general',
    address: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Load contacts from localStorage on initial render
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Default emergency contacts
      const defaultContacts = [
        {
          id: '1',
          name: 'Emergency Services',
          organization: 'Government',
          phone: '911',
          email: '',
          website: '',
          category: 'emergency',
          address: '',
          notes: 'Call for immediate life-threatening emergencies'
        },
        {
          id: '2',
          name: 'FEMA',
          organization: 'Federal Emergency Management Agency',
          phone: '1-800-621-3362',
          email: 'info@fema.gov',
          website: 'https://www.fema.gov',
          category: 'government',
          address: '',
          notes: 'Contact for disaster assistance'
        },
        {
          id: '3',
          name: 'Red Cross',
          organization: 'American Red Cross',
          phone: '1-800-733-2767',
          email: 'info@redcross.org',
          website: 'https://www.redcross.org',
          category: 'ngo',
          address: '',
          notes: 'Disaster relief, shelter, and assistance'
        }
      ];
      setContacts(defaultContacts);
      localStorage.setItem('emergencyContacts', JSON.stringify(defaultContacts));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      organization: '',
      phone: '',
      email: '',
      website: '',
      category: 'general',
      address: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!formData.name || !formData.phone) {
      setError('Name and phone number are required.');
      return;
    }
    
    if (editingContact) {
      // Update existing contact
      const updatedContacts = contacts.map(contact => 
        contact.id === editingContact.id ? { ...formData, id: contact.id } : contact
      );
      setContacts(updatedContacts);
      setSuccessMessage('Contact updated successfully!');
    } else {
      // Add new contact
      const newContact = {
        ...formData,
        id: Date.now().toString()
      };
      setContacts(prev => [...prev, newContact]);
      setSuccessMessage('Contact added successfully!');
    }
    
    closeModal();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setSuccessMessage('Contact deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const filterContactsByCategory = () => {
    if (activeCategory === 'all') {
      return contacts;
    }
    return contacts.filter(contact => contact.category === activeCategory);
  };

  const filteredContacts = filterContactsByCategory();

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Contacts' },
    { id: 'emergency', name: 'Emergency Services' },
    { id: 'government', name: 'Government Agencies' },
    { id: 'ngo', name: 'NGOs & Relief Organizations' },
    { id: 'medical', name: 'Medical Services' },
    { id: 'utility', name: 'Utility Companies' },
    { id: 'general', name: 'General' }
  ];

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Emergency Contacts</h1>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Add New Contact</Button>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <Alert type="success" message={successMessage} className="mb-4" />
      )}
      
      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto bg-gray-50 p-2 rounded-lg shadow-sm">
        <div className="flex space-x-2 p-1">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 ${
                activeCategory === category.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Contact List */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No contacts found in this category.</p>
          <Button onClick={openAddModal} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Add New Contact</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => (
            <Card key={contact.id} className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">{contact.name}</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(contact)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    aria-label="Edit contact"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    aria-label="Delete contact"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {contact.organization && (
                <p className="text-gray-600 mb-2">{contact.organization}</p>
              )}
              
              <div className="mt-2">
                <p className="flex items-center mb-1">
                  <span className="font-medium mr-2 text-gray-700">Phone:</span>
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                </p>
                
                {contact.email && (
                  <p className="flex items-center mb-1">
                    <span className="font-medium mr-2 text-gray-700">Email:</span>
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </p>
                )}
                
                {contact.website && (
                  <p className="flex items-center mb-1">
                    <span className="font-medium mr-2 text-gray-700">Website:</span>
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </p>
                )}
                
                {contact.address && (
                  <p className="mt-1 text-gray-700">
                    <span className="font-medium">Address:</span>
                    <span className="ml-1">{contact.address}</span>
                  </p>
                )}
                
                {contact.notes && (
                  <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700">
                    {contact.notes}
                  </p>
                )}
              </div>
              
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${
                  contact.category === 'emergency' ? 'bg-red-100 text-red-800' :
                  contact.category === 'government' ? 'bg-blue-100 text-blue-800' :
                  contact.category === 'ngo' ? 'bg-green-100 text-green-800' :
                  contact.category === 'medical' ? 'bg-purple-100 text-purple-800' :
                  contact.category === 'utility' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contact.category}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add/Edit Contact Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
      >
        <form onSubmit={handleSubmit} className="bg-white rounded-lg">
          {error && <Alert type="error" message={error} className="mb-4" />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="emergency">Emergency Services</option>
                <option value="government">Government Agency</option>
                <option value="ngo">NGO / Relief Organization</option>
                <option value="medical">Medical Services</option>
                <option value="utility">Utility Company</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any important information about this contact"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              onClick={closeModal} 
              color="secondary"
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyContacts;