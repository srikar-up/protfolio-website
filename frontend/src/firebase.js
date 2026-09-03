import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Environment variables configuration with Srikar's Firebase project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNX0yuhZ7cK-btiHv6P7yJ-zIm0vNJfRs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "srikar-portfolio-c5412.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://srikar-portfolio-c5412-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "srikar-portfolio-c5412",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "srikar-portfolio-c5412.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "927713063016",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:927713063016:web:30158f6a47f3b52b0b8bdd"
};

// Check if Firebase configuration is provided
export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// Allowed admin email (defaults to Srikar's email)
export const getAdminEmail = () => {
  return (import.meta.env.VITE_ADMIN_EMAIL || 'srikarsensai@gmail.com').trim().toLowerCase();
};

let app = null;
let firestore = null;
let rtdb = null;
let auth = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Initialize Cloud Firestore as the primary crash-proof database
    try {
      firestore = getFirestore(app);
      console.log('🔥 Cloud Firestore initialized as primary database.');
    } catch (fsErr) {
      console.warn('Firestore initialization note:', fsErr);
    }

    // Initialize Realtime Database as secondary fallback
    if (firebaseConfig.databaseURL) {
      try {
        rtdb = getDatabase(app);
      } catch (rtdbErr) {
        console.warn('Realtime Database fallback note:', rtdbErr);
      }
    }

    console.log('🔥 Firebase services initialized successfully.');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error);
  }
} else {
  console.info('ℹ️ Firebase running in offline/fallback mode.');
}

export { auth, firestore, rtdb };

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
 * Fetch portfolio data: Checks Cloud Firestore FIRST (Crash-proof), then RTDB fallback.
 */
export const fetchPortfolioFromFirebase = async () => {
  // 1. Check Cloud Firestore (Primary)
  if (firestore) {
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
  }

  // 2. Fallback to Realtime Database if Firestore is not yet created
  if (rtdb) {
    try {
      const portfolioRef = ref(rtdb, 'portfolio');
      const snapshot = await get(portfolioRef);
      if (snapshot.exists()) {
        console.log('✅ [Firebase RTDB] Live portfolio loaded from Realtime Database!');
        return { data: snapshot.val(), source: 'realtime-database' };
      }
    } catch (rtdbErr) {
      console.warn('⚠️ [Firebase RTDB] Read error:', rtdbErr.message);
    }
  }

  return null;
};

/**
 * Save complete portfolio data: Writes to Cloud Firestore (with safe merge) and RTDB.
 */
export const savePortfolioToFirebase = async (data) => {
  let saved = false;

  // 1. Save to Cloud Firestore (Primary crash-proof store)
  if (firestore) {
    try {
      const docRef = doc(firestore, 'portfolio', 'data');
      await setDoc(docRef, data, { merge: true });
      console.log('✅ [Cloud Firestore] Portfolio successfully written to Cloud Firestore!');
      saved = true;
    } catch (error) {
      console.error('❌ [Cloud Firestore] Save error (check Firestore Rules in Firebase Console):', error);
    }
  }

  // 2. Also save to Realtime Database as backup
  if (rtdb) {
    try {
      const portfolioRef = ref(rtdb, 'portfolio');
      await set(portfolioRef, data);
      saved = true;
    } catch (error) {
      // Ignore if RTDB is not enabled
    }
  }

  return saved;
};

/**
 * Save contact inquiry message to Cloud Firestore 'messages' collection.
 */
export const saveContactMessageToFirebase = async (messageData) => {
  let saved = false;

  // 1. Save to Cloud Firestore (Primary)
  if (firestore) {
    try {
      const messagesRef = collection(firestore, 'messages');
      await addDoc(messagesRef, {
        ...messageData,
        createdAt: serverTimestamp(),
        submittedAt: new Date().toISOString()
      });
      console.log('✅ [Cloud Firestore] Contact message saved to Firestore "messages" collection!');
      saved = true;
    } catch (error) {
      console.error('❌ [Cloud Firestore] Message error (check Firestore Rules):', error);
    }
  }

  // 2. Fallback to Realtime Database
  if (rtdb) {
    try {
      const messagesRef = ref(rtdb, 'messages');
      await push(messagesRef, {
        ...messageData,
        timestamp: Date.now(),
        date: new Date().toISOString()
      });
      saved = true;
    } catch (error) {
      // Ignore
    }
  }

  return saved;
};
