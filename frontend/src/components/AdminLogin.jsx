import React, { useState } from 'react';
import { loginWithGoogle, isFirebaseConfigured, getAdminEmail } from '../firebase';
import { useTheme } from '../context/ThemeContext';

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const { showToast } = useTheme();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const adminEmail = getAdminEmail();
  const isConfigured = isFirebaseConfigured();

  // 1-Click Google Sign In (Exclusive Auth Method)
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    if (!isConfigured) {
      setErrorMessage('Firebase credentials are not configured in environment yet.');
      return;
    }

    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      showToast('Welcome back, Srikar! Verification successful.');
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      let msg = error.message;
      if (error.code === 'auth/unauthorized-domain') {
        msg = `Domain "${window.location.hostname}" is not authorized in Firebase! Please go to Firebase Console > Authentication > Settings > Authorized domains and add "${window.location.hostname}".`;
      } else if (error.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in popup was closed before completing.';
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = 'Google Sign-In is not enabled in Firebase Console yet. Go to Firebase Console > Authentication > Sign-in method and enable Google.';
      } else if (error.code === 'auth/popup-blocked') {
        msg = 'Popup was blocked by your browser. Please allow popups for this site.';
      } else if (error.code === 'auth/network-request-failed') {
        msg = 'Network request failed. Please check your internet connection or ad blocker.';
      }
      setErrorMessage(msg);
      showToast('Google verification failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleDevBypass = () => {
    showToast('Dev bypass active (Local Preview Mode)');
    if (onLoginSuccess) {
      onLoginSuccess({ email: adminEmail, devBypass: true });
    }
  };

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-brand-darkCard rounded-[2.5rem] p-8 md:p-10 shadow-soft dark:shadow-soft-dark border border-zinc-200/40 dark:border-zinc-800/40 bento-transition relative overflow-hidden text-center">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        {/* Security Badge Header */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-4 text-brand-orange shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-orange font-bold">RESTRICTED ACCESS</span>
          <h2 className="font-syne font-bold text-2xl text-zinc-900 dark:text-white mt-1">Admin Verification</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 max-w-xs leading-relaxed">
            Sign in with the verified owner Google account to unlock the editor desk.
          </p>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start space-x-2 text-left">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Direct Google Sign In Button */}
        <div className="relative z-10 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-4 px-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-700 hover:border-brand-orange dark:hover:border-brand-orange rounded-2xl text-xs font-semibold text-zinc-850 dark:text-zinc-100 shadow-sm hover:scale-[1.01] active:scale-95 bento-transition flex items-center justify-center space-x-3 disabled:opacity-50 group"
          >
            {isGoogleLoading ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></span>
                <span className="font-mono">Connecting with Google...</span>
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="font-semibold text-sm">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Offline / Dev helper banner if Firebase credentials are not yet set */}
        {!isConfigured && (
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 text-center">
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mb-2">
              Firebase keys not detected in environment.
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
