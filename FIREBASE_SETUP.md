# 🔥 Firebase Setup Guide - BGMI Tournament

## 🎯 Step 1: Firebase Project Create Karo

1. **Google Console khulo:** https://console.firebase.google.com
2. **"Create a project"** button dabao
3. Project name: `BGMI-Tournament` (ya kuch bhi)
4. Google Analytics — **enable mat karo** (free rehne ke liye)
5. Project ban jaane tak wait karo

## 🌐 Step 2: Web App Add Karo

1. Firebase console mein **"Add app"** button dabao
2. **Web app icon (`</>`)** select karo
3. App nickname: `BGMI Tournament Web`
4. **"Register app"** dabao
5. Ek config object dikhega — jaise:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "...",
     ...
   };
   ```
6. Yeh config copy karo → `firebase-config.js` file mein **paste karo** (YOUR_API_KEY etc replace karo)

## 🔐 Step 3: Authentication Enable Karo

1. Firebase console mein left sidebar se **"Authentication"** → **"Sign-in method"**
2. **"Email/Password"** provider select karo
3. **Enable** toggle ON karo → **Save**

## 🗄️ Step 4: Firestore Database Banao

1. Left sidebar se **"Firestore Database"**
2. **"Create database"** button dabao
3. Location: choose nearest (e.g. `asia-south1`)
4. **"Start in test mode"** select karo → **Next** → **Done**

## 📱 Step 5: APK Build

APK automatically GitHub Actions se build hoga. Steps:
1. Firebase setup complete karo (upar ke steps)
2. Git push karo
3. GitHub repo mein **Actions** tab jao
4. "Build APK" workflow chalao
5. Download karo jab build complete ho

## 🧪 Testing

1. `index.html` ko kisi browser mein khulo (ya GitHub Pages pe deploy karo)
2. Sign up with email/password
3. Login karo
4. Check: dashboard, tournaments, teams, payment, support — sab Firebase se data lega

---

**Problem ho toh:** `F12` → Console check karo — Firebase errors dikhenge.
