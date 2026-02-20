# 🚀 How to Publish CampusMart to Google Play Store

Your PWA is now fully configured for the Play Store! I have already set up the required **Manifest**, **Maskable Icons**, and **Asset Links**.

Follow these steps to generate your Android App Bundle (`.aab` / `.apk`) for free without coding.

---

## ✅ Step 1: Deploy Your App
You must have your website hosted live on HTTPS (e.g., Vercel, Netlify, or your own server).
You cannot publish `localhost` to the Play Store.

## 📦 Step 2: Use PWABuilder (Easiest Method)
1. Go to **[PWABuilder.com](https://www.pwabuilder.com)**.
2. Enter your live URL (e.g., `https://campusmart.co.ke`).
3. Click **Start**.
4. It will check your PWA status. You should see all green checks because I've already fixed your Manifest, Service Worker, and Icons.
5. Click **Package for Stores** → **Android**.
6. Fill in the details:
   - **Package ID**: `com.campusmart.app` (or your preferred ID)
   - **App Name**: CampusMart
   - **Launcher Icon**: Upload the `public/icon-512.png` I generated if asked.
7. Download the package. You will get a zip file with your `.aab` file signed and ready.

## 🔐 Step 3: Verify Ownership (Asset Links)
Google needs to know you own the website.
1. When you generate your app in PWABuilder (or Android Studio), you will get a **SHA-256 Fingerprint**.
2. Copy that fingerprint (it looks like `12:34:56:AB:CD...`).
3. Open the file in your project: `public/.well-known/assetlinks.json`.
4. Replace the placeholder fingerprint with your real one.
5. Redeploy your website.
6. Google will now verify your app automatically.

## 🎨 Step 4: Your Icons
I have already generated **Maskable Icons** (`icon-512.png`).
- On **Android**, these will automatically be cropped into circles, rounded squares, or whatever shape the user's phone uses.
- The logo is perfectly centered with white padding, so **no part of the logo will be cut off**.

## 📸 Step 5: Screenshots
I have added placeholder screenshots to `manifest.json`.
- Before submitting to the Play Store console, you must upload **real screenshots** of your app running on a phone and a 7-inch tablet.
- Take these screenshots on your phone and upload them to the Google Play Console listing.

---

**🎉 You are ready to go!**
