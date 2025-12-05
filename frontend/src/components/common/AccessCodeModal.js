import React, { useState } from 'react';
import { FiLock, FiShield, FiAlertTriangle, FiX, FiLoader } from 'react-icons/fi';
import { validateAccessCode } from '../../services/accessCodeService';

/**
 * Access Code Modal - Minecraft-themed popup for protected operations
 * Shows when users try to perform CRUD operations without proper access
 * Now validates against backend database instead of localStorage
 */
const AccessCodeModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  operation = 'perform this action',
  itemName = ''
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');

    try {
      const result = await validateAccessCode(accessCode);

      if (result.valid) {
        onSuccess(result.codeInfo);
        setAccessCode('');
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to validate access code. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = () => {
    setAccessCode('');
    setError('');
    onClose();
  };

  // Format access code input with dashes
  const handleCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Add dashes after every 4 characters
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }
    if (value.length > 9) {
      value = value.slice(0, 9) + '-' + value.slice(9);
    }
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    
    setAccessCode(value);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-scale-in">
        {/* Minecraft-style glow border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-75 blur-sm animate-pulse" />
        
        <div className="relative bg-zinc-900 border-4 border-zinc-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/30 flex items-center justify-center border-2 border-amber-300">
                <FiShield className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono tracking-wider">
                  ACCESS REQUIRED
                </h2>
                <p className="text-amber-200 text-xs font-mono">
                  PROTECTED OPERATION
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-black/20 text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning Message */}
            <div className="bg-amber-500/10 border-2 border-amber-500/50 p-4 mb-6">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-200 text-sm font-mono">
                    You are trying to <span className="text-white font-bold">{operation}</span>
                    {itemName && <span className="text-white font-bold"> "{itemName}"</span>}
                  </p>
                  <p className="text-zinc-400 text-xs font-mono mt-2">
                    This action requires an access code to prevent unauthorized database modifications.
                    Contact the system administrator if you need access.
                  </p>
                </div>
              </div>
            </div>

            {/* Access Code Input */}
            <form onSubmit={handleSubmit}>
              <label className="block text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                Enter Access Code
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={handleCodeChange}
                  placeholder="XXXX-XXXX-XXXX"
                  className={`w-full bg-zinc-800 border-2 text-white text-center text-xl tracking-widest font-mono py-4 px-12 focus:outline-none transition-colors ${
                    error ? 'border-red-500' : 'border-zinc-600 focus:border-amber-500'
                  }`}
                  autoFocus
                  maxLength={14}
                />
              </div>

              {error && (
                <div className="mt-3 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 text-sm font-mono flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-mono py-3 px-4 border-b-4 border-zinc-800 hover:border-zinc-700 active:border-b-0 transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={accessCode.length < 14 || isValidating}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold py-3 px-4 border-b-4 border-amber-800 hover:border-amber-700 active:border-b-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? 'VALIDATING...' : 'VERIFY ACCESS'}
                </button>
              </div>
            </form>

            {/* Info Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-700">
              <p className="text-zinc-600 text-xs font-mono text-center">
                This protection exists to prevent misuse of the demo database.
                <br />
                Recruiters can request access codes from the administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeModal;
