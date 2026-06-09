#!/data/data/com.termux/files/home/usr/bin/bash
# ============================================================
# BGMI Tournament - Setup Script for Termux/Android
# ============================================================

BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo -e "${BLUE}⚔️ BGMI Tournament App Setup${NC}"
echo "========================================"

# Check dependencies
echo -e "\n${YELLOW}[1/4] Checking dependencies...${NC}"
command -v node >/dev/null 2>&1 && echo -e "  ${GREEN}✅ Node.js $(node -v)${NC}" || echo -e "  ${RED}❌ Node.js not found${NC}"
command -v npm >/dev/null 2>&1 && echo -e "  ${GREEN}✅ npm $(npm -v)${NC}" || echo -e "  ${RED}❌ npm not found${NC}"
command -v java >/dev/null 2>&1 && echo -e "  ${GREEN}✅ Java $(java -version 2>&1 | head -1)${NC}" || echo -e "  ${RED}❌ Java not found${NC}"

echo -e "\n${YELLOW}[2/4] Installing Capacitor dependencies...${NC}"
cd ~/bgmi-tournament
npm install @capacitor/cli @capacitor/core @capacitor/android
echo -e "  ${GREEN}✅ Capacitor installed${NC}"

echo -e "\n${YELLOW}[3/4] Syncing web to Android...${NC}"
npx cap sync android
echo -e "  ${GREEN}✅ Web assets synced to Android project${NC}"

echo -e "\n${YELLOW}[4/4] Checking APK build...${NC}"
cd ~/bgmi-tournament/android
export ANDROID_HOME=$HOME/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

if [ -f "$ANDROID_HOME/build-tools/36.0.0/aapt2" ]; then
    file "$ANDROID_HOME/build-tools/36.0.0/aapt2" | grep -q "ARM" && {
        echo -e "  ${GREEN}✅ ARM-native aapt2 found - can build APK!${NC}"
        echo -e "  ${GREEN}📱 Building...${NC}"
        ./gradlew assembleDebug 2>&1 | tail -5
    } || {
        echo -e "  ${YELLOW}⚠️ aapt2 is x86_64 only - APK build on device not possible${NC}"
        echo -e "  ${YELLOW}   Use GitHub Actions instead (see FIREBASE_SETUP.md)${NC}"
    }
else
    echo -e "  ${RED}❌ Android SDK build-tools not found${NC}"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "📱 Firebase setup: cat FIREBASE_SETUP.md"
echo -e "🔧 GitHub Actions: push workflow to build APK"
echo -e "🌐 Local server: python3 -m http.server 8080"
echo -e "${BLUE}========================================${NC}"
