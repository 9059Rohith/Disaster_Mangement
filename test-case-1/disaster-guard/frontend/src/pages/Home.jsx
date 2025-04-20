import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);

  // Track mouse position for interactive effects
  useEffect(() => {
    // Fade in elements with animation class
    const fadeElements = document.querySelectorAll('.fade-element');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
    
    fadeElements.forEach(el => observer.observe(el));
    
    return () => {
      fadeElements.forEach(el => observer.unobserve(el));
    };
  }, [mousePosition]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden antialiased bg-black text-white">
      {/* Video Background for Hero Section */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0">
  <video 
    ref={videoRef}
    autoPlay
    loop
    muted
    playsInline
    className="absolute w-full h-full object-cover"
  >
    <source src="/8817503-uhd_3840_2160_30fps.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  
  {/* Overlay to ensure text is readable over video */}
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
</div>

      {/* Main content */}
      <div className="relative w-full min-h-screen overflow-hidden antialiased text-white">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl w-full">
            <div className="fade-element  opacity-0 transform translate-y-10 transition-all duration-1000 delay-300">
              <h1 className="text-6xl text-black sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 text-center mb-6 animate-pulse-subtle">
                DisasterGuard
              </h1>
              <p className="mt-6 text-xl text-black sm:text-2xl text-blue-100 text-center max-w-3xl mx-auto leading-relaxed">
                An advanced, AI-powered disaster management platform with real-time
                alerts, community-driven response, and intelligent assistance.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/register"
                  className="glow-button bg-transparent backdrop-blur-sm px-8 py-4 rounded-full text-white border border-blue-400/30 shadow-glow-blue hover:shadow-glow-blue-lg transition-all duration-500 transform hover:scale-105 w-64 text-center font-medium"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="glow-button bg-blue-600/20 backdrop-blur-sm px-8 py-4 rounded-full text-white border border-blue-400/50 shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all duration-500 transform hover:scale-105 w-64 text-center font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center fade-element opacity-0 transition-all duration-1000 delay-1000">
            <span className="text-white/70 text-sm mb-3">Explore Features</span>
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center items-start p-2">
              <div className="w-2 h-3 bg-white/80 rounded-full animate-scroll-down"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 relative overflow-hidden backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
              <h2 className="text-base text-cyan-400 font-bold tracking-wide uppercase text-glow-cyan">
                Features
              </h2>
              <p className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">A better way to respond</span>
              </p>
              <p className="mt-5 max-w-2xl text-xl text-blue-200 mx-auto">
                DisasterGuard provides comprehensive support during emergency situations.
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
                {/* Feature cards with enhanced styling */}
                <div className="feature-card group fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 group-hover:duration-500"></div>
  <div className="relative p-8 backdrop-blur-md bg-white/50 rounded-2xl border border-cyan-500/30 h-full transition-all duration-500 group-hover:border-cyan-500/50 group-hover:scale-[1.03] group-hover:shadow-glow-blue-sm">
    <div className="flex items-center mb-5">
      <div className="flex-shrink-0 mr-4">
        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-700">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-gray-900 transition-colors duration-300">
        Real-time Alerts
      </h3>
    </div>
    <p className="text-black text-opacity-80 group-hover:text-black group-hover:text-opacity-100 transition-colors duration-300">
      Get instant notifications about disasters in your area with severity
      classifications and recommended actions tailored to your location.
    </p>
  </div>
</div>

<div className="feature-card group fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '200ms' }}>
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 group-hover:duration-500"></div>
  <div className="relative p-8 backdrop-blur-md bg-white/50 rounded-2xl border border-blue-500/30 h-full transition-all duration-500 group-hover:border-blue-500/50 group-hover:scale-[1.03] group-hover:shadow-glow-indigo-sm">
    <div className="flex items-center mb-5">
      <div className="flex-shrink-0 mr-4">
        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-700">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-gray-900 transition-colors duration-300">
        Community Response
      </h3>
    </div>
    <p className="text-black text-opacity-80 group-hover:text-black group-hover:text-opacity-100 transition-colors duration-300">
      Connect with your community during crises to coordinate efforts, 
      share resources, and ensure everyone's safety through our advanced platform.
    </p>
  </div>
</div>
                <div className="feature-card group fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '400ms' }}>
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 group-hover:duration-500"></div>
  <div className="relative p-8 backdrop-blur-md bg-white/30 rounded-2xl border border-emerald-500/30 h-full transition-all duration-500 group-hover:border-emerald-400/60 group-hover:scale-[1.03] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
    <div className="flex items-center mb-5">
      <div className="flex-shrink-0 mr-4">
        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-700">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-gray-900 transition-colors duration-300">
        Resource Management
      </h3>
    </div>
    <p className="text-black text-opacity-80 group-hover:text-black group-hover:text-opacity-100 transition-colors duration-300">
      Track and allocate resources efficiently during emergency situations,
      ensuring help reaches those who need it most with our intelligent allocation system.
    </p>
  </div>
</div>

                <div className="feature-card group fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '600ms' }}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 group-hover:duration-500"></div>
                  <div className="relative p-8 backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 h-full transition-all duration-500 group-hover:border-purple-500/50 group-hover:scale-[1.03] group-hover:shadow-glow-pink-sm">
                    <div className="flex items-center mb-5">
                      <div className="flex-shrink-0 mr-4">
                        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg group-hover:shadow-pink-500/50 transition-all duration-700">
                          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-gray-900 transition-colors duration-300">
                        Intelligent Assistance
                      </h3>
                    </div>
                    <p className="text-black text-opacity-80 group-hover:text-black group-hover:text-opacity-100 transition-colors duration-300">
                      Get AI-powered recommendations and guidance during emergencies,
                      with 24/7 support and multilingual capabilities that adapt to your situation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-24 sm:py-32 relative overflow-hidden backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-xl text-center fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
              <h2 className="text-lg font-semibold leading-8 tracking-tight text-cyan-400 text-glow-cyan">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by communities worldwide
              </p>
            </div>
            
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {/* Testimonial cards with enhanced styling */}
              <div className="group fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
                <div className="flex flex-col justify-between h-full relative rounded-3xl backdrop-blur-md bg-gradient-to-b from-white/10 to-white/5 p-8 border border-white/10 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="relative">
                    <div className="flex items-center gap-x-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                      "DisasterGuard was crucial during the recent flooding in our area. The real-time alerts gave us time to evacuate safely and the resource coordination helped our community recover much faster."
                    </p>
                  </div>
                  <div className="mt-8 border-t border-gray-700/50 pt-6 relative">
                    <div className="flex items-center gap-x-4">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="h-12 w-12 rounded-full bg-gray-800 object-cover ring-2 ring-cyan-500/30" />
                      <div>
                        <h3 className="text-base font-semibold leading-7 tracking-tight text-white">Sarah Johnson</h3>
                        <p className="text-sm leading-6 text-cyan-300">Community Leader, Riverdale</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '200ms' }}>
                <div className="flex flex-col justify-between h-full relative rounded-3xl backdrop-blur-md bg-gradient-to-b from-white/10 to-white/5 p-8 border border-white/10 transition-all duration-500 group-hover:border-blue-500/30 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="relative">
                    <div className="flex items-center gap-x-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                      "As an emergency response coordinator, I've found DisasterGuard's intelligent assistance invaluable. It helps us make faster, better decisions when every minute counts."
                    </p>
                  </div>
                  <div className="mt-8 border-t border-gray-700/50 pt-6 relative">
                    <div className="flex items-center gap-x-4">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="h-12 w-12 rounded-full bg-gray-800 object-cover ring-2 ring-blue-500/30" />
                      <div>
                        <h3 className="text-base font-semibold leading-7 tracking-tight text-white">Robert Chen</h3>
                        <p className="text-sm leading-6 text-blue-300">Emergency Response Coordinator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '400ms' }}>
                <div className="flex flex-col justify-between h-full relative rounded-3xl backdrop-blur-md bg-gradient-to-b from-white/10 to-white/5 p-8 border border-white/10 transition-all duration-500 group-hover:border-purple-500/30 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="relative">
                    <div className="flex items-center gap-x-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                      "The community response feature has transformed how our town prepares for hurricane season. We're more connected, better prepared, and much more resilient as a result."
                    </p>
                  </div>
                  <div className="mt-8 border-t border-gray-700/50 pt-6 relative">
                    <div className="flex items-center gap-x-4">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="h-12 w-12 rounded-full bg-gray-800 object-cover ring-2 ring-indigo-500/30" />
                      <div>
                        <h3 className="text-base font-semibold leading-7 tracking-tight text-white">Miguel Rodriguez</h3>
                        <p className="text-sm leading-6 text-indigo-300">Town Mayor, Coastal Heights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-24 relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900/50 via-blue-900/50 to-purple-900/50"></div>
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Real impact, real numbers</span>
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  DisasterGuard has helped communities prepare for and respond to emergencies with unprecedented effectiveness.
                </p>
              </div>
              <dl className="mt-16 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col bg-white/5 backdrop-blur-2xl p-8 border border-white/10 rounded-2xl transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/10 fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
                  <dt className="text-sm font-semibold leading-6 text-gray-300">Communities protected</dt>
                  <dd className="order-first text-4xl font-bold tracking-tight text-white">2,000+</dd>
                </div>
                <div className="flex flex-col bg-white/5 backdrop-blur-2xl p-8 border border-white/10 rounded-2xl transition-all duration-500 hover:border-blue-500/30 hover:bg-white/10 fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '200ms' }}>
                  <dt className="text-sm font-semibold leading-6 text-gray-300">Disasters managed</dt>
                  <dd className="order-first text-4xl font-bold tracking-tight text-white">500+</dd>
                </div>
                <div className="flex flex-col bg-white/5 backdrop-blur-2xl p-8 border border-white/10 rounded-2xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/10 fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '400ms' }}>
                  <dt className="text-sm font-semibold leading-6 text-gray-300">Lives potentially saved</dt>
                  <dd className="order-first text-4xl font-bold tracking-tight text-white">50,000+</dd>
                </div>
                <div className="flex flex-col bg-white/5 backdrop-blur-2xl p-8 border border-white/10 rounded-2xl transition-all duration-500 hover:border-purple-500/30 hover:bg-white/10 fade-element opacity-0 transition-all duration-1000 transform translate-y-10" style={{ transitionDelay: '600ms' }}>
                  <dt className="text-sm font-semibold leading-6 text-gray-300">Response time improvement</dt>
                  <dd className="order-first text-4xl font-bold tracking-tight text-white">40%</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-indigo-900/70"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.2),transparent_50%)] bg-center"></div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 relative z-10">
            <div className="fade-element opacity-0 transition-all duration-1000 transform translate-y-10">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">Prepare for emergencies.</span>
                <span className="block mt-2">Start using DisasterGuard today.</span>
              </h2>
              <p className="mt-6 text-xl leading-7 text-blue-200">
                Join thousands of communities already using DisasterGuard to stay safe and coordinated during emergencies.
              </p>
              <div className="mt-10">
                <Link
                  to="/register"
                  className="glow-button-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-10 py-5 rounded-full text-white font-medium text-lg shadow-glow-blue-lg hover:shadow-glow-blue-xl transition-all duration-500 transform hover:scale-105 hover:translate-y-[-5px] inline-flex items-center"
                >
                  Sign up for free
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-transparent border-t border-blue-900/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4">DisasterGuard</h3>
                <p className="text-blue-200 text-sm">
                  Advanced disaster management platform powered by AI, helping communities prepare, respond, and recover.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/resources" className="text-blue-300 hover:text-white transition-colors">Disaster Preparedness</Link></li>
                  <li><Link to="/guides" className="text-blue-300 hover:text-white transition-colors">Emergency Guides</Link></li>
                  <li><Link to="/blog" className="text-blue-300 hover:text-white transition-colors">Blog</Link></li>
                  <li><Link to="/faq" className="text-blue-300 hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-blue-300">help@disasterguard.com</li>
                  <li className="text-blue-300">1-800-DISASTER</li>
                  <li className="flex space-x-4 mt-4">
                    <a href="#" className="text-blue-300 hover:text-white transition-all duration-300 transform hover:scale-110">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-300 hover:text-white transition-all duration-300 transform hover:scale-110">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-300 hover:text-white transition-all duration-300 transform hover:scale-110">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-blue-900/30 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-blue-200">&copy; 2025 DisasterGuard. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-sm text-blue-300 hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-sm text-blue-300 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Global CSS for animations */}
        <style >{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes scroll-down {
            0%, 100% { transform: translateY(0); opacity: 0.8; }
            50% { transform: translateY(6px); opacity: 0.4; }
          }
          
          @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          @keyframes animate-gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: animate-gradient-x 15s ease infinite;
          }
          
          .animate-scroll-down {
            animation: scroll-down 2s ease-in-out infinite;
          }
          
          .animate-pulse-subtle {
            animation: pulse-subtle 3s ease-in-out infinite;
          }
            /* Add to the style jsx global section */
          .backdrop-glow {
            backdrop-filter: blur(50px);
            box-shadow: 0 0 40px rgba(56, 189, 248, 0.1), 0 0 80px rgba(79, 70, 229, 0.08);
          }
          
          .fade-element.visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          .text-glow-cyan {
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.5), 0 0 20px rgba(56, 189, 248, 0.3);
          }
          
          .shadow-glow-blue {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
          }
          
          .shadow-glow-blue-lg {
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.4), 0 0 10px rgba(59, 130, 246, 0.2);
          }
          
          .shadow-glow-blue-xl {
            box-shadow: 0 0 35px rgba(59, 130, 246, 0.5), 0 0 15px rgba(59, 130, 246, 0.3);
          }
          
          .shadow-glow-cyan {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
          }
          
          .shadow-glow-cyan-lg {
            box-shadow: 0 0 25px rgba(6, 182, 212, 0.4), 0 0 10px rgba(6, 182, 212, 0.2);
          }
          
          .shadow-glow-blue-sm {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
          }
          
          .shadow-glow-indigo-sm {
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);
          }
          
          .shadow-glow-purple-sm {
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
          }
          
          .shadow-glow-pink-sm {
            box-shadow: 0 0 10px rgba(236, 72, 153, 0.2);
          }
        `}</style>
      </div>
      </div>

  );
};

export default Home;