// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

// Layout Components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Resources from './pages/Resources';
import Reports from './pages/Reports';
import Community from './pages/Community';
import Profile from './pages/Profile';

// New Pages
import WeatherForecast from './pages/WeatherForecast';
import DisasterTracker from './pages/DisasterTracker';
import EmergencyContacts from './pages/EmergencyContacts';
import NewsUpdates from './pages/NewsUpdates';

// Auth Components
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/common.css'

// Layout component that conditionally renders the sidebar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-grow">
      {!isHomePage && <Sidebar />}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <AppLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/alerts" 
                  element={
                    <PrivateRoute>
                      <Alerts />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/resources" 
                  element={
                    <PrivateRoute>
                      <Resources />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <PrivateRoute>
                      <Reports />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/community" 
                  element={
                    <PrivateRoute>
                      <Community />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
                
                {/* New Routes */}
                <Route 
                  path="/weather" 
                  element={
                    <PrivateRoute>
                      <WeatherForecast />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/disaster-tracker" 
                  element={
                    <PrivateRoute>
                      <DisasterTracker />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/emergency-contacts" 
                  element={
                    <PrivateRoute>
                      <EmergencyContacts />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/news" 
                  element={
                    <PrivateRoute>
                      <NewsUpdates />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </AppLayout>
            <Footer />
          </div>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;