// frontend/src/pages/NewsUpdates.jsx
import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsApi';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

const NewsUpdates = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // New state variables for enhanced functionality
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    source: { name: 'User Submitted' },
    disasterType: 'earthquake',
    url: '',
    urlToImage: ''
  });
  const [reportReason, setReportReason] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchNews();
  }, [currentPage, filter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      
      if (filter === 'all') {
        response = await newsService.getDisasterNews(currentPage);
      } else {
        response = await newsService.getNewsByDisasterType(filter, currentPage);
      }
      
      // Check if response exists and has articles
      if (response && response.articles && response.articles.length > 0) {
        setNewsArticles(response.articles);
      } else {
        // If no articles are returned, set a default placeholder article
        setNewsArticles([{
          title: 'No specific news available for this filter',
          description: 'Try selecting a different category or search term to find relevant disaster news.',
          publishedAt: new Date().toISOString(),
          source: { name: 'System Message' },
          url: null,
          urlToImage: '/placeholder-image.jpg'
        }]);
      }
      
      // Calculate total pages
      const total = response?.totalResults || 0;
      const pages = Math.ceil(total / 10); // Assuming 10 articles per page
      setTotalPages(pages > 20 ? 20 : pages); // API usually limits to 100 results (20 pages of 5)
      
      setLoading(false);
      setIsInitialLoad(false);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to fetch news updates. Please try again later.');
      
      // Add fallback content even when error occurs
      setNewsArticles([{
        title: 'News temporarily unavailable',
        description: 'We\'re experiencing difficulties retrieving the latest disaster news. Please check back later or try a different filter.',
        publishedAt: new Date().toISOString(),
        source: { name: 'System Status' },
        url: null,
        urlToImage: '/placeholder-image.jpg'
      }]);
      
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      setFilter(searchTerm.trim());
      setCurrentPage(1);
    }
  };

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get empty state message based on current filter
  const getEmptyStateMessage = () => {
    if (filter === 'all') {
      return 'No disaster news articles are currently available.';
    } else {
      return `No news articles found for "${filter}". Try another disaster type or check back later.`;
    }
  };

  // New Functions for Enhanced Functionality

  // Function to handle adding a new article
  const handleAddNews = () => {
    // Validate form
    if (!newArticle.title || !newArticle.description) {
      setNotification({
        show: true,
        message: 'Title and description are required',
        type: 'error'
      });
      return;
    }

    // In a real application, you would call an API to save the article
    // For demonstration, we'll just add it to the local state
    const articleToAdd = {
      ...newArticle,
      publishedAt: new Date().toISOString(),
      id: `user-${Date.now()}`, // Generate a temporary ID
      isUserSubmitted: true
    };

    setNewsArticles(prev => [articleToAdd, ...prev]);
    setIsAddNewsModalOpen(false);
    
    // Reset form
    setNewArticle({
      title: '',
      description: '',
      source: { name: 'User Submitted' },
      disasterType: 'earthquake',
      url: '',
      urlToImage: ''
    });

    // Show success notification
    setNotification({
      show: true,
      message: 'News article added successfully!',
      type: 'success'
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to handle reporting an article
  const handleReportArticle = () => {
    if (!reportReason) {
      setNotification({
        show: true,
        message: 'Please provide a reason for reporting',
        type: 'error'
      });
      return;
    }

    // In a real application, you would send this report to your backend
    console.log('Reported article:', selectedArticle?.title);
    console.log('Reason:', reportReason);

    // Close modal and reset
    setIsReportModalOpen(false);
    setSelectedArticle(null);
    setReportReason('');

    // Show success notification
    setNotification({
      show: true,
      message: 'Article reported. Our team will review it shortly.',
      type: 'success'
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to handle removing an article
  const handleRemoveArticle = (articleId) => {
    // In a real application, you would call an API to delete the article
    // For demonstration, we'll just remove it from the local state
    setNewsArticles(prev => prev.filter(article => article.id !== articleId));
    
    // Show success notification
    setNotification({
      show: true,
      message: 'News article removed successfully!',
      type: 'success'
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to handle input change for new article form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'sourceName') {
      setNewArticle(prev => ({
        ...prev,
        source: { ...prev.source, name: value }
      }));
    } else {
      setNewArticle(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Disaster News Updates</h1>
      
      {/* Add News Button */}
      <div className="mb-4">
        <Button 
          onClick={() => setIsAddNewsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add News Article
        </Button>
      </div>
      
      {/* Notification */}
      {notification.show && (
        <Alert 
          type={notification.type} 
          message={notification.message} 
          className="mb-4"
          onClose={() => setNotification({ show: false, message: '', type: '' })}
        />
      )}
      
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for news..."
            className="px-4 py-2 border rounded-l flex-grow"
          />
          <Button type="submit" className="rounded-l-none">
            Search
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            All Disasters
          </button>
          <button
            onClick={() => handleFilter('earthquake')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'earthquake' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Earthquakes
          </button>
          <button
            onClick={() => handleFilter('hurricane')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'hurricane' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Hurricanes
          </button>
          <button
            onClick={() => handleFilter('wildfire')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'wildfire' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Wildfires
          </button>
          <button
            onClick={() => handleFilter('flood')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'flood' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Floods
          </button>
          <button
            onClick={() => handleFilter('tornado')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'tornado' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Tornados
          </button>
          <button
            onClick={() => handleFilter('tsunami')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'tsunami' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Tsunamis
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading disaster news articles...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      ) : (
        <>
          {/* News Articles */}
          {newsArticles.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded-lg">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <p className="text-lg text-gray-600">{getEmptyStateMessage()}</p>
              <div className="mt-4">
                <Button onClick={() => handleFilter('all')} className="mr-2">
                  View All News
                </Button>
                <Button onClick={() => fetchNews()} variant="outline">
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {newsArticles.map((article, index) => (
                <Card key={article.id || index} className="p-4">
                  <div className="md:flex">
                    {article.urlToImage ? (
                      <div className="md:flex-shrink-0 md:w-56 h-40 mb-4 md:mb-0 md:mr-4">
                        <img 
                          src={article.urlToImage} 
                          alt={article.title || 'News image'}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="md:flex-shrink-0 md:w-56 h-40 mb-4 md:mb-0 md:mr-4 bg-gray-200 flex items-center justify-center rounded">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold">
                          {article.url ? (
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
                            >
                              {article.title || 'Untitled Article'}
                            </a>
                          ) : (
                            <span>{article.title || 'Untitled Article'}</span>
                          )}
                        </h2>
                        
                        {/* User action buttons */}
                        <div className="flex space-x-2 ml-2">
                          {/* Report button */}
                          <button 
                            onClick={() => {
                              setSelectedArticle(article);
                              setIsReportModalOpen(true);
                            }}
                            className="text-gray-500 hover:text-yellow-600 p-1"
                            title="Report article"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                          </button>
                          
                          {/* Remove button - only shown for user-submitted content */}
                          {article.isUserSubmitted && (
                            <button 
                              onClick={() => handleRemoveArticle(article.id)}
                              className="text-gray-500 hover:text-red-600 p-1"
                              title="Remove article"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {article.source?.name && (
                          <span className={article.isUserSubmitted ? "bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2" : ""}>
                            {article.source.name}
                          </span>
                        )}
                        <span>{article.publishedAt ? formatDate(article.publishedAt) : 'Date unknown'}</span>
                        {article.disasterType && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                            {article.disasterType}
                          </span>
                        )}
                      </p>
                      
                      <p className="text-gray-700 mb-4">
                        {article.description || 'No description available.'}
                      </p>
                      
                      {article.url && (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Read full article
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1">
                <Button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Previous
                </Button>
                
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Suggest content if empty with no search */}
      {!loading && !error && newsArticles.length === 0 && filter === 'all' && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Suggested Disaster Categories</h3>
          <p className="mb-4 text-blue-700">Explore news about specific types of disasters:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['earthquake', 'hurricane', 'wildfire', 'flood', 'tornado', 'tsunami'].map(disasterType => (
              <button
                key={disasterType}
                onClick={() => handleFilter(disasterType)}
                className="bg-white hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded border border-blue-200 transition-colors"
              >
                {disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Add News Modal */}
      {isAddNewsModalOpen && (
        <Modal
          title="Add News Article"
          onClose={() => setIsAddNewsModalOpen(false)}
        >
          <div className="p-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newArticle.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                id="description"
                name="description"
                value={newArticle.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="disasterType" className="block text-sm font-medium text-gray-700 mb-1">Disaster Type</label>
              <select
                id="disasterType"
                name="disasterType"
                value={newArticle.disasterType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="earthquake">Earthquake</option>
                <option value="hurricane">Hurricane</option>
                <option value="wildfire">Wildfire</option>
                <option value="flood">Flood</option>
                <option value="tornado">Tornado</option>
                <option value="tsunami">Tsunami</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
              <input
                type="text"
                id="sourceName"
                name="sourceName"
                value={newArticle.source.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
              <input
                type="url"
                id="url"
                name="url"
                value={newArticle.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com/article"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="urlToImage" className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
              <input
                type="url"
                id="urlToImage"
                name="urlToImage"
                value={newArticle.urlToImage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setIsAddNewsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNews}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Article
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Report Modal */}
      {isReportModalOpen && selectedArticle && (
        <Modal
          title="Report Article"
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedArticle(null);
            setReportReason('');
          }}
        >
          <div className="p-4">
            <p className="mb-4 text-gray-700">
              You are reporting the article: <strong>{selectedArticle.title}</strong>
            </p>
            
            <div className="mb-4">
              <label htmlFor="reportReason" className="block text-sm font-medium text-gray-700 mb-1">Reason for reporting *</label>
              <select
                id="reportReason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a reason</option>
                <option value="inaccurate">Contains inaccurate information</option>
                <option value="outdated">Information is outdated</option>
                <option value="inappropriate">Contains inappropriate content</option>
                <option value="duplicate">Duplicate article</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reportDetails" className="block text-sm font-medium text-gray-700 mb-1">Additional details (optional)</label>
              <textarea
                id="reportDetails"
                className="w-full px-3 py-2 border rounded-md"
                rows="4"
                placeholder="Please provide any additional information about this report."
              ></textarea>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setSelectedArticle(null);
                  setReportReason('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReportArticle}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NewsUpdates;