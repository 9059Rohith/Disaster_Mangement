import { useState, useEffect } from 'react';

const Community = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community Hub</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Community News */}
          <div className="col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Community Updates
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-5">
                    <h4 className="text-md font-semibold">Neighborhood Watch Program Launch</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      We're excited to announce the launch of our new neighborhood watch program to improve disaster preparedness in our community.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Posted 2 days ago</p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-5">
                    <h4 className="text-md font-semibold">Emergency Response Training</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      Join us this Saturday for a free emergency response training session at the community center. Learn critical skills that could save lives!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Posted 5 days ago</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold">Volunteer Opportunities</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      We need volunteers to help with our disaster preparedness initiatives. If you're interested, please sign up through the DisasterGuard app.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Posted 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upcoming Events
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Emergency Response Training</p>
                      <p className="text-sm text-gray-500">Mar 20</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Community Center, 9 AM</p>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">First Aid Workshop</p>
                      <p className="text-sm text-gray-500">Mar 27</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Public Library, 10 AM</p>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Disaster Preparedness Seminar</p>
                      <p className="text-sm text-gray-500">Apr 5</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">City Hall, 6 PM</p>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Community Resources */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Resources
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-2">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                      Emergency Contact List
                    </a>
                  </li>
                  <li className="py-2">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                      Evacuation Routes Map
                    </a>
                  </li>
                  <li className="py-2">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                      Disaster Preparedness Guide
                    </a>
                  </li>
                  <li className="py-2">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                      Community Support Programs
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;