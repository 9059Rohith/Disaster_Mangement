// frontend/src/components/Layout/Sidebar.jsx
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
// Fix the import path - the issue is likely here
// If your AuthContext is in a different location, adjust this path accordingly
import { useAuth } from '../../context/AuthContext';

// Alternatively, if you're using a default export in AuthContext.jsx, use:
// import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  
  
  // Don't show sidebar if user is not logged in
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0  md:block">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-8">DisasterGuard</h2>
        
        <nav>
          <ul className="space-y-2">
            {/* Main Navigation */}
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/alerts"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Alerts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Resources
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Reports
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Community
              </NavLink>
            </li>
            
            {/* Divider */}
            <li className="border-t border-gray-700 my-4"></li>
            
            {/* Additional Navigation Items */}
            <li>
              <NavLink
                to="/weather"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Weather Forecast
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/disaster-tracker"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Disaster Tracker
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/emergency-contacts"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                Emergency Contacts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/news"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                News Updates
              </NavLink>
            </li>
            
            {/* Divider */}
            <li className="border-t border-gray-700 my-4"></li>
            
            {/* User Account */}
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                }
              >
                My Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;