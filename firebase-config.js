// ============================================================
// 🔥 FIREBASE CONFIGURATION
// ============================================================
// STEP 1: Google Console jao → https://console.firebase.google.com
// STEP 2: "Create a project" button dabao → project name "BGMI-Tournament"
// STEP 3: Web app add karo (</> icon) → app name "BGMI Tournament Web"
// STEP 4: Firebase SDK snippet copy karo — NICHE PASTE KARO
// STEP 5: Authentication → Sign-in method → Email/Password enable karo
// STEP 6: Firestore → Create database → Start in test mode → Next → Done
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
