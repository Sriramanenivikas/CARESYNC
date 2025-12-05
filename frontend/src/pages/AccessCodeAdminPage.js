import React, { useState, useEffect } from 'react';
import { 
  FiLock, 
  FiKey, 
  FiCopy, 
  FiTrash2, 
  FiCheck, 
  FiX,
  FiShield,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiClock,
  FiUser,
  FiAlertTriangle,
  FiLoader
} from 'react-icons/fi';
import { 
  verifyAdminCredentials, 
  createAccessCode, 
  getAccessCodes, 
  deleteAccessCode,
  deactivateAccessCode,
  formatRemainingTime
} from '../services/accessCodeService';

const AccessCodeAdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [accessCodes, setAccessCodes] = useState([]);
  const [newCodeNote, setNewCodeNote] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [, setTick] = useState(0); // For re-rendering countdown

  useEffect(() => {
    if (isAuthenticated) {
      loadAccessCodes();
      // Update countdown every minute
      const interval = setInterval(() => {
        loadAccessCodes();
        setTick(t => t + 1);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadAccessCodes = async () => {
    try {
      const codes = await getAccessCodes();
      setAccessCodes(codes);
    } catch (error) {
      console.error('Failed to load access codes:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const valid = await verifyAdminCredentials(username, password);
      if (valid) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid credentials. Access denied.');
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      const newCode = await createAccessCode(username, newCodeNote);
      setGeneratedCode(newCode);
      setNewCodeNote('');
      await loadAccessCodes();
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteCode = async (codeId) => {
    if (window.confirm('Are you sure you want to delete this access code?')) {
      await deleteAccessCode(codeId);
      await loadAccessCodes();
    }
  };

  const handleDeactivateCode = async (codeId) => {
    await deactivateAccessCode(codeId);
    await loadAccessCodes();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(39, 39, 42, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(39, 39, 42, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="relative w-full max-w-md">
          {/* Minecraft-style border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 opacity-75 blur-sm" />
          
          <div className="relative bg-zinc-900 border-4 border-zinc-700 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 mb-4">
                <FiShield className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wider" style={{ fontFamily: 'monospace' }}>
                ACCESS CODE ADMIN
              </h1>
              <p className="text-zinc-400 text-sm mt-2 font-mono">
                CARESYNC SECURITY PORTAL
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 text-sm font-mono">
                  ⚠ {authError}
                </div>
              )}

              <div>
                <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-800 border-2 border-zinc-600 text-white pl-10 pr-4 py-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-800 border-2 border-zinc-600 text-white pl-10 pr-12 py-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-3 px-4 border-b-4 border-emerald-800 hover:border-emerald-700 active:border-b-0 active:mt-1 transition-all"
              >
                [ AUTHENTICATE ]
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-zinc-600 text-xs font-mono">
                AUTHORIZED PERSONNEL ONLY
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(39, 39, 42, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(39, 39, 42, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <FiKey className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-mono tracking-wider">
                ACCESS CODE MANAGER
              </h1>
              <p className="text-zinc-500 text-sm font-mono">
                Welcome, {username}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-sm border border-zinc-700"
          >
            LOGOUT
          </button>
        </div>

        {/* Generate New Code Section */}
        <div className="bg-zinc-900 border-2 border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
            <FiPlus className="w-5 h-5 text-emerald-400" />
            GENERATE NEW ACCESS CODE
          </h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={newCodeNote}
              onChange={(e) => setNewCodeNote(e.target.value)}
              placeholder="Note (e.g., Recruiter from Google)"
              className="flex-1 bg-zinc-800 border-2 border-zinc-600 text-white px-4 py-3 font-mono focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={handleGenerateCode}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-3 px-6 border-b-4 border-emerald-800 hover:border-emerald-700 active:border-b-0 transition-all flex items-center gap-2"
            >
              <FiKey className="w-4 h-4" />
              GENERATE
            </button>
          </div>

          {/* Newly Generated Code Display */}
          {generatedCode && (
            <div className="mt-4 bg-emerald-500/10 border-2 border-emerald-500 p-4">
              <p className="text-emerald-400 text-xs font-mono uppercase mb-2">
                NEW CODE GENERATED (VALID FOR 1 HOUR):
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white font-mono tracking-widest">
                  {generatedCode.code}
                </span>
                <button
                  onClick={() => handleCopyCode(generatedCode.code)}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 font-mono text-sm"
                >
                  {copiedId === generatedCode.code ? (
                    <>
                      <FiCheck className="w-4 h-4 text-emerald-400" />
                      COPIED!
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-4 h-4" />
                      COPY
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <FiAlertTriangle className="w-4 h-4 text-amber-400" />
                <p className="text-amber-400 text-xs font-mono">
                  ⏰ This code expires in 1 hour. Share it immediately with the recruiter.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Access Codes List */}
        <div className="bg-zinc-900 border-2 border-zinc-700 p-6">
          <h2 className="text-lg font-bold text-white font-mono mb-4 flex items-center gap-2">
            <FiShield className="w-5 h-5 text-emerald-400" />
            ACTIVE ACCESS CODES ({accessCodes.filter(c => c.isActive).length})
          </h2>

          {accessCodes.length === 0 ? (
            <div className="text-center py-12">
              <FiKey className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-mono">No access codes generated yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accessCodes.map((code) => (
                <div
                  key={code.id}
                  className={`border-2 p-4 ${
                    code.isActive 
                      ? 'border-zinc-600 bg-zinc-800/50' 
                      : 'border-zinc-800 bg-zinc-900/50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${code.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                      <span className="text-xl font-bold text-white font-mono tracking-wider">
                        {code.code}
                      </span>
                      {code.isActive && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 font-mono border border-amber-500/50">
                          ⏰ {formatRemainingTime(code)}
                        </span>
                      )}
                      {!code.isActive && (
                        <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-1 font-mono">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(code.code)}
                        className="p-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                        title="Copy code"
                      >
                        {copiedId === code.code ? (
                          <FiCheck className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FiCopy className="w-4 h-4" />
                        )}
                      </button>
                      {code.isActive && (
                        <button
                          onClick={() => handleDeactivateCode(code.id)}
                          className="p-2 bg-zinc-700 hover:bg-amber-600 text-zinc-300 hover:text-white"
                          title="Deactivate"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        className="p-2 bg-zinc-700 hover:bg-red-600 text-zinc-300 hover:text-white"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500">Note:</span>
                      <span className="text-zinc-300 ml-2">{code.note || 'No note'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-500">Created:</span>
                      <span className="text-zinc-300 ml-1">{formatDate(code.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Used:</span>
                      <span className="text-emerald-400 ml-2">{code.usageCount} times</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-zinc-600 text-xs font-mono">
            CARESYNC SECURITY SYSTEM • UNAUTHORIZED ACCESS IS PROHIBITED
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeAdminPage;
