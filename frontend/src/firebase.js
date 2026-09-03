import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Environment variables configuration for Vite (Loaded from .env or Netlify, with project defaults)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNX0yuhZ7cK-btiHv6P7yJ-zIm0vNJfRs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "srikar-portfolio-c5412.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "srikar-portfolio-c5412",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "srikar-portfolio-c5412.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "927713063016",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:927713063016:web:30158f6a47f3b52b0b8bdd"
};

// Check if Firebase configuration is provided
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
  );
};

// Allowed admin email (defaults to Srikar's email)
export const getAdminEmail = () => {
  return (import.meta.env.VITE_ADMIN_EMAIL || 'srikarsensai@gmail.com').trim().toLowerCase();
};

let app = null;
let firestore = null;
let auth = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    console.log('🔥 Cloud Firestore & Auth initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Firebase initialization note:', error);
  }
} else {
  console.info('ℹ️ Firebase running in offline/fallback mode.');
}

export { auth, firestore };

/**
 * Sign in admin user with email and password, verifying they are the authorized admin.
 */
export const loginAdmin = async (email, password) => {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Please add your Firebase credentials.');
  }

  const normalizedEmail = (email || '').trim().toLowerCase();
  const adminEmail = getAdminEmail();

  if (normalizedEmail !== adminEmail) {
    throw new Error(`Access Denied: Only ${adminEmail} is authorized to access the editor desk.`);
  }

  const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  const user = userCredential.user;

  if (user.email.toLowerCase() !== adminEmail) {
    await signOut(auth);
    throw new Error(`Access Denied: ${user.email} is not authorized.`);
  }

  return user;
};

/**
 * 1-Click Google Sign-In with Gmail account verification.
 */
export const loginWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not configured. Please add your Firebase credentials.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const adminEmail = getAdminEmail();

  if (user.email.toLowerCase() !== adminEmail) {
    await signOut(auth);
    throw new Error(`Access Denied: Google account "${user.email}" is not authorized.`);
  }

  return user;
};

/**
 * Sign out current admin user.
 */
export const logoutAdmin = async () => {
  if (!auth) return;
  await signOut(auth);
};

/**
 * Listen to auth state changes.
 */
export const subscribeToAuth = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user && user.email.toLowerCase() === getAdminEmail()) {
      callback(user);
    } else {
      callback(null);
    }
  });
};

/**
 * Fetch portfolio data from Cloud Firestore 'portfolio/data' document.
 */
export const fetchPortfolioFromFirebase = async () => {
  if (!firestore) return null;
  try {
    const docRef = doc(firestore, 'portfolio', 'data');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ [Cloud Firestore] Live portfolio loaded from Cloud Firestore!');
      return { data, source: 'firestore' };
    } else {
      console.log('ℹ️ [Cloud Firestore] Connected, but "portfolio/data" document is not seeded yet. Click "Save All Changes" in /dashboard to seed.');
    }
  } catch (fsErr) {
    console.warn('⚠️ [Cloud Firestore] Read error (check Firestore rules):', fsErr.message);
  }
  return null;
};

/**
 * Save complete portfolio data to Cloud Firestore with safe merge.
 */
export const savePortfolioToFirebase = async (data) => {
  if (!firestore) return false;
  try {
    const docRef = doc(firestore, 'portfolio', 'data');
    await setDoc(docRef, data, { merge: true });
    console.log('✅ [Cloud Firestore] Portfolio successfully written to Cloud Firestore!');
    return true;
  } catch (error) {
    console.error('❌ [Cloud Firestore] Save error (check Firestore Rules in Firebase Console):', error);
    return false;
  }
};

/**
 * Save contact inquiry message to Cloud Firestore 'messages' collection.
 */
export const saveContactMessageToFirebase = async (messageData) => {
  if (!firestore) return false;
  try {
    const messagesRef = collection(firestore, 'messages');
    await addDoc(messagesRef, {
      ...messageData,
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString()
    });
    console.log('✅ [Cloud Firestore] Contact message saved to Firestore "messages" collection!');
    return true;
  } catch (error) {
    console.error('❌ [Cloud Firestore] Message error (check Firestore Rules):', error);
    return false;
  }
};
