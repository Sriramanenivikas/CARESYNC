import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiActivity, 
  FiCalendar, 
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiArrowRight,
  FiCheck,
  FiLock,
} from 'react-icons/fi';
import { Logo } from '../components/common';

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      role: 'Doctor',
      icon: FiActivity,
      desc: 'Manage appointments, prescriptions & patient records'
    },
    {
      role: 'Nurse',
      icon: FiUsers,
      desc: 'Track patient vitals, daily tasks & care coordination'
    },
    {
      role: 'Receptionist',
      icon: FiCalendar,
      desc: 'Handle bookings, check-ins & front desk operations'
    },
    {
      role: 'Patient',
      icon: FiFileText,
      desc: 'View appointments, prescriptions & bills in ₹'
    }
  ];

  const demoAccounts = [
    { role: 'Doctor', user: 'dr.smith', pass: 'Doctor@123' },
    { role: 'Nurse', user: 'nurse.lisa', pass: 'Nurse@123' },
    { role: 'Receptionist', user: 'reception.mary', pass: 'Recept@123' },
    { role: 'Patient', user: 'patient.robert', pass: 'Patient@123' },
  ];

  const highlights = [
    'Role-Based Access Control',
    'Real-time KPI Dashboards',
    'Indian Currency (₹) Support',
    'RESTful API Architecture',
    'Responsive Modern UI',
    'Production-Ready Docker'
  ];

  const stats = [
    { value: '99.9%', label: 'System uptime guarantee' },
    { value: '4+', label: 'User roles supported' },
    { value: '6+', label: 'Core modules included' },
  ];

  return (
    <div className="min-h-screen dot-grid">
      {/* Header */}
      <header className="flex justify-between items-center px-[5%] py-5 border-b border-black/5 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Logo size={28} className="text-blue-500" />
          <div className="minecraft-heading text-xl">CareSync</div>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#features" className="text-gray-600 text-sm font-medium hover:text-black transition-colors">Features</a>
          <a href="#roles" className="text-gray-600 text-sm font-medium hover:text-black transition-colors">Roles</a>
          <a href="#demo" className="text-gray-600 text-sm font-medium hover:text-black transition-colors">Demo</a>
        </nav>
        <div className="flex gap-3">
          <a 
            href="https://github.com/Sriramanenivikas/CARESYNC" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-black transition-colors"
          >
            <FiGithub className="w-5 h-5" />
          </a>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-[5%] text-center max-w-4xl mx-auto">
        <span className="monospace-label mb-4">{"// HEALTHCARE SYSTEM"}</span>
        <h1 className="text-5xl md:text-6xl leading-tight mb-6">
          Manage Care<br />
          <span className="highlight-green">Without Compromise</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Full-stack hospital management with role-based dashboards for doctors, nurses, 
          receptionists & patients. Built with React & Spring Boot.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            Start Using CareSync <FiArrowRight className="w-4 h-4" />
          </button>
          <a
            href="https://github.com/Sriramanenivikas/CARESYNC"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-black text-black font-semibold rounded-full hover:bg-black hover:text-white transition-colors"
          >
            View Source
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-divider py-16 px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-4xl font-sans font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Split Section - Features */}
      <section id="features" className="grid md:grid-cols-2 gap-12 py-24 px-[5%] items-center max-w-6xl mx-auto">
        <div>
          <span className="monospace-label mb-4">{"// INFRASTRUCTURE"}</span>
          <h2 className="text-3xl mb-5">System You Can Count On</h2>
          <p className="text-gray-500 mb-6">
            Comprehensive healthcare management with secure authentication, 
            real-time dashboards, and streamlined workflows for every team member.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FiCheck className="w-5 h-5 text-green-500" />
              <span className="font-medium">Battle-Tested Authentication</span>
            </div>
            <p className="text-sm text-gray-500 ml-8">JWT-based security with role-based access control.</p>
          </div>
        </div>

        {/* Code Window */}
        <div className="code-window">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-black dark:border-gray-600 flex gap-2">
            <div className="w-3 h-3 rounded-full border border-gray-400" style={{background:'#ff5f56'}}></div>
            <div className="w-3 h-3 rounded-full border border-gray-400" style={{background:'#ffbd2e'}}></div>
            <div className="w-3 h-3 rounded-full border border-gray-400" style={{background:'#27c93f'}}></div>
          </div>
          <div className="p-5 font-mono text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="text-red-600">const</span> auth = <span className="text-red-600">new</span> CareSync({'{'}<br/>
              <span className="ml-4">role: <span className="text-blue-700">"DOCTOR"</span>,</span><br/>
              <span className="ml-4">permissions: [<span className="text-blue-700">"patients"</span>, <span className="text-blue-700">"appointments"</span>]</span><br/>
              {'}'});<br/><br/>
              <span className="text-red-600">async function</span> getDashboard() {'{'}<br/>
              <span className="ml-4"><span className="text-red-600">await</span> auth.fetchUserData();</span><br/>
              {'}'}
            </div>
          </div>
        </div>
      </section>

      {/* Roles Grid */}
      <section id="roles" className="py-24 px-[5%] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <span className="monospace-label mb-4">{"// USE CASES"}</span>
          <h2 className="text-3xl mb-3">Built for Every Role</h2>
          <p className="text-gray-500 mb-10">Transform your healthcare operations with role-specific interfaces.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r) => (
              <div 
                key={r.role}
                className="bg-white dark:bg-gray-800 p-6 border border-transparent hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-offset dark:hover:shadow-offset-dark"
              >
                <div className="w-10 h-10 bg-black dark:bg-white flex items-center justify-center mb-4">
                  <r.icon className="w-5 h-5 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-sans font-semibold mb-2">{r.role}</h3>
                <p className="text-sm text-gray-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 px-[5%]">
        <div className="max-w-4xl mx-auto">
          <span className="monospace-label mb-4">{"// FEATURES"}</span>
          <h2 className="text-3xl mb-10">Key Highlights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-dotted border-gray-200 dark:border-gray-700">
                <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section - Dark */}
      <section id="demo" className="bg-black text-white py-20 px-[5%]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <span className="monospace-label bg-gray-800 text-white mb-4">{"// TRY IT NOW"}</span>
            <h2 className="text-3xl text-white mb-4">Demo Credentials</h2>
            <p className="text-gray-400 mb-6">
              Use these credentials to explore different role-based dashboards.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                Go to Login <FiArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/admin/access-codes')}
                className="px-6 py-3 bg-transparent text-white font-semibold rounded-full border border-gray-600 hover:border-white transition-colors flex items-center gap-2"
              >
                <FiLock className="w-4 h-4" /> Admin Panel
              </button>
            </div>
          </div>

          <div className="border border-gray-700 p-6">
            <h4 className="text-white font-semibold mb-4 font-sans">Available Accounts</h4>
            <div className="space-y-3">
              {demoAccounts.map((acc) => (
                <div 
                  key={acc.role}
                  className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-300 font-medium">{acc.role}</span>
                  <div className="flex gap-4 text-sm">
                    <code className="text-gray-400 bg-gray-800 px-2 py-1">{acc.user}</code>
                    <code className="text-gray-400 bg-gray-800 px-2 py-1">{acc.pass}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-[5%] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="minecraft-heading text-lg">CareSync</span>
            <span className="text-sm text-gray-500">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Built by</span>
            <a 
              href="https://www.linkedin.com/in/sriramanenivikas/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-black dark:text-white hover:underline flex items-center gap-2"
            >
              <FiLinkedin className="w-4 h-4" /> Vikas Sriramaneni
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
