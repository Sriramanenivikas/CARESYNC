import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd, FaHospital, FaAmbulance, FaHeartbeat, FaCalendarCheck,
  FaPrescriptionBottle, FaFlask, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaClock, FaAward, FaUsers, FaShieldAlt, FaArrowRight, FaBars, FaTimes
} from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { icon: FaUsers, value: '50,000+', label: 'Happy Patients' },
    { icon: FaUserMd, value: '200+', label: 'Expert Doctors' },
    { icon: FaAward, value: '25+', label: 'Years Experience' },
    { icon: FaHospital, value: '15+', label: 'Departments' },
  ];

  const services = [
    {
      icon: FaUserMd,
      title: 'Expert Doctors',
      description: 'Highly qualified and experienced medical professionals',
      color: 'teal'
    },
    {
      icon: FaAmbulance,
      title: '24/7 Emergency',
      description: 'Round-the-clock emergency medical services',
      color: 'rose'
    },
    {
      icon: FaCalendarCheck,
      title: 'Easy Appointments',
      description: 'Book appointments online with ease',
      color: 'emerald'
    },
    {
      icon: FaFlask,
      title: 'Advanced Lab',
      description: 'State-of-the-art diagnostic facilities',
      color: 'violet'
    },
    {
      icon: FaPrescriptionBottle,
      title: 'Pharmacy',
      description: 'In-house pharmacy with quality medicines',
      color: 'amber'
    },
    {
      icon: FaShieldAlt,
      title: 'Health Insurance',
      description: 'We accept all major insurance providers',
      color: 'cyan'
    },
  ];

  const departments = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Radiology', 'Emergency Medicine', 'General Surgery'
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-lg flex items-center justify-center">
                <FaHeartbeat className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                  CareSync
                </h1>
                <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-teal-100'}`}>
                  Healthcare Excellence
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className={`font-medium hover:text-teal-600 transition ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>Home</a>
              <a href="#services" className={`font-medium hover:text-teal-600 transition ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>Services</a>
              <a href="#departments" className={`font-medium hover:text-teal-600 transition ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>Departments</a>
              <a href="#contact" className={`font-medium hover:text-teal-600 transition ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>Contact</a>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-teal-700 hover:to-emerald-700 transition font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Login / Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${scrolled ? 'text-gray-900' : 'text-white'}`}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <a href="#home" className="block text-gray-700 hover:text-teal-600 font-medium">Home</a>
              <a href="#services" className="block text-gray-700 hover:text-teal-600 font-medium">Services</a>
              <a href="#departments" className="block text-gray-700 hover:text-teal-600 font-medium">Departments</a>
              <a href="#contact" className="block text-gray-700 hover:text-teal-600 font-medium">Contact</a>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-teal-700 hover:to-emerald-700 transition font-medium"
              >
                Login / Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Video Background */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-emerald-800/85 z-10"></div>
          {/* Fallback gradient if video doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-700 to-teal-900"></div>
          {/* Video element (you can replace with actual video URL) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%231e40af' width='1920' height='1080'/%3E%3C/svg%3E"
          >
            {/* You can add your hospital video URL here */}
            {/* <source src="/videos/hospital-background.mp4" type="video/mp4" /> */}
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Your Health, Our Priority
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-teal-100 animate-slide-up">
            Advanced Healthcare Solutions with Compassionate Care
          </p>
          <p className="text-lg mb-12 text-emerald-50 max-w-3xl mx-auto animate-slide-up">
            Experience world-class medical services with state-of-the-art facilities,
            expert doctors, and 24/7 emergency care. Your wellness journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-teal-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-teal-50 transition shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started <FaArrowRight />
            </button>
            <a
              href="#services"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-teal-700 transition shadow-2xl flex items-center justify-center gap-2"
            >
              <FaAmbulance /> Emergency: 911
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition">
                <stat.icon className="text-5xl text-teal-600 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-${service.color}-100 rounded-lg flex items-center justify-center mb-6`}>
                  <service.icon className={`text-3xl text-${service.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Medical Departments
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized care across multiple medical disciplines
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-emerald-100 rounded-lg p-6 text-center hover:from-teal-600 hover:to-emerald-600 hover:text-white transition cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105"
              >
                <p className="font-semibold text-lg">{dept}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose CareSync?
            </h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              We are committed to providing the best healthcare experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <FaClock className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-3">24/7 Availability</h3>
              <p className="text-teal-100">Round-the-clock medical care whenever you need it</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <FaAward className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-3">Award Winning</h3>
              <p className="text-emerald-100">Recognized for excellence in patient care and service</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
              <FaShieldAlt className="text-5xl mb-4" />
              <h3 className="text-2xl font-bold mb-3">Insurance Partners</h3>
              <p className="text-teal-100">We work with all major insurance providers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">Emergency: 911</p>
              <p className="text-gray-600">General: +1 (555) 123-4567</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@caresync.com</p>
              <p className="text-gray-600">support@caresync.com</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-2xl text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Healthcare Avenue</p>
              <p className="text-gray-600">Medical District, MD 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-emerald-700 rounded-lg flex items-center justify-center">
                  <FaHeartbeat className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold">CareSync</h3>
              </div>
              <p className="text-gray-400">
                Providing quality healthcare services with compassion and excellence.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#departments" className="hover:text-white transition">Departments</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Emergency Care</a></li>
                <li><a href="#" className="hover:text-white transition">Appointments</a></li>
                <li><a href="#" className="hover:text-white transition">Laboratory</a></li>
                <li><a href="#" className="hover:text-white transition">Pharmacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency: 24/7</li>
                <li>Outpatient: 8 AM - 8 PM</li>
                <li>Laboratory: 7 AM - 9 PM</li>
                <li>Pharmacy: 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareSync Hospital Management System. All rights reserved.</p>
            <p className="mt-2 text-sm">Designed for excellence in healthcare delivery</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

