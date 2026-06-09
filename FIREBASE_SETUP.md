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

## 📱 Step 5: APK Build — GitHub Actions

APK ko build karne ke liye GitHub Actions use karenge (kyunki Android device pe aapt2 nahi chal sakta).

### 🔑 Pehle: GitHub Token Update Karo

1. **GitHub jao:** https://github.com/settings/tokens
2. Apna purana token delete karo (ya edit karo)
3. **New token banao** — ✅ `workflow` scope bhi select karo
4. Token copy karo
5. Termux mein token update karo:
   ```bash
   cd ~/bgmi-tournament
   git remote set-url origin https://YOUR_USERNAME:NEW_TOKEN@github.com/raj86017-cmd/bgmi-tournament.git
   ```

### 🚀 Phir Commit karo Workflow File

```bash
cd ~/bgmi-tournament
git add .github/workflows/build-apk.yml
git commit -m "Add APK build workflow"
git push origin master
```

Push ke baad:
1. GitHub repo mein **Actions** tab jao
2. "Build & Release APK" workflow chalao (manual trigger)
3. ~5 min mein APK ready ho jayega
4. **Artifacts** section se `.apk` download karo

### 📥 Direct APK Download

Alternate: jab workflow complete hoga, to build result mein APK milega:
- `bgmi-tournament-apk-debug.zip` → debug APK (testing ke liye)
- `bgmi-tournament-apk-release.zip` → release APK (publish ke liye)

### ⚠️ APK Signing (Release Build)

Play Store pe upload karne ke liye sign karna hoga:
```bash
# Android Studio se, ya command line:
jarsigner -keystore my-release-key.jks app-release-unsigned.apk alias-name
zipalign -v 4 app-release-unsigned.apk BGMI-Tournament.apk
```

## 🧪 Testing

1. `index.html` ko kisi browser mein khulo (ya GitHub Pages pe deploy karo)
2. Sign up with email/password
3. Login karo
4. Check: dashboard, tournaments, teams, payment, support — sab Firebase se data lega

---

**Problem ho toh:** `F12` → Console check karo — Firebase errors dikhenge.
