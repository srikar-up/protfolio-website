import React, { useState } from 'react';
import { loginAdmin, isFirebaseConfigured, getAdminEmail } from '../firebase';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const { showToast } = useTheme();
  const [email, setEmail] = useState(getAdminEmail());
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const adminEmail = getAdminEmail();
  const isConfigured = isFirebaseConfigured();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (!isConfigured) {
      setErrorMessage('Firebase credentials are not configured in .env yet.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginAdmin(email, password);
      showToast(`Welcome, Srikar! Verification successful.`);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Login error:', error);
      let msg = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password.';
      } else if (error.code === 'auth/user-not-found') {
        msg = `Admin account not found in Firebase. Please create user ${adminEmail} in Firebase Console.`;
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console yet. Please enable it in Firebase Console > Authentication > Sign-in method.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please try again later.';
      }
      setErrorMessage(msg);
      showToast('Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevBypass = () => {
    showToast('Dev bypass active (Local Preview Mode)');
    if (onLoginSuccess) {
      onLoginSuccess({ email: adminEmail, devBypass: true });
    }
  };

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-brand-darkCard rounded-[2.5rem] p-8 md:p-10 shadow-soft dark:shadow-soft-dark border border-zinc-200/40 dark:border-zinc-800/40 bento-transition relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        {/* Security Badge Header */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-4 text-brand-orange shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-orange font-bold">RESTRICTED ACCESS</span>
          <h2 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white mt-1">Admin Verification</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs leading-relaxed">
            Only the authorized owner email (<span className="text-brand-orange font-semibold font-mono">{adminEmail}</span>) can enter editor mode.
          </p>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start space-x-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Admin Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="srikarsensai@gmail.com"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-mono text-brand-orange hover:underline focus:outline-none"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3.5 text-xs text-zinc-850 dark:text-zinc-100 outline-none bento-transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-100 rounded-full font-semibold text-xs shadow-md hover:scale-[1.02] active:scale-95 bento-transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>VERIFYING CREDENTIALS...</span>
              </span>
            ) : (
              <span>VERIFY & ENTER CONTROL DESK</span>
            )}
          </button>
        </form>

        {/* Offline / Dev helper banner if Firebase credentials are not yet set */}
        {!isConfigured && (
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/40 text-center">
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mb-2">
              Firebase keys not added yet in environment.
            </p>
            <button 
              type="button"
              onClick={handleDevBypass}
              className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300 hover:text-brand-orange underline"
            >
              Enter via Local Dev Bypass →
            </button>
          </div>
        )}

        {/* Return Button */}
        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bento-transition"
          >
            ← Return to Portfolio
          </button>
        </div>

      </div>
    </div>
  );
}
