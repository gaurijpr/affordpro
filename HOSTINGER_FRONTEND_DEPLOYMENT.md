# 🏨 HOSTINGER FRONTEND DEPLOYMENT GUIDE (AFFORDPRO)

This guide explains how to upload the production-ready **AffordPro Frontend** files to Hostinger.

---

## 🎯 HOSTINGER UPLOAD SUMMARY

* **Framework**: React 19 (Single Page Application)
* **Build Tool**: Vite 6
* **Production Build Output Directory**: `dist/` or `AFFORDPRO-HOSTINGER-FRONTEND/`
* **Deployment ZIP File**: `affordpro-hostinger-frontend.zip`
* **Hostinger Destination Directory**: `public_html/`

---

## 📋 STEP-BY-STEP UPLOAD INSTRUCTIONS

### STEP 1: Log in to Hostinger
1. Go to **[https://hpanel.hostinger.com/](https://hpanel.hostinger.com/)** and log in.
2. Under **Websites**, click **Manage** next to your domain.

---

### STEP 2: Open Hostinger File Manager
1. In the left menu, go to **Files** ➔ **File Manager**.
2. Select **Access files of <your-domain>**.
3. Double-click to open the **`public_html`** folder.

---

### STEP 3: Upload the Production Zip File
1. Inside `public_html`, click the **Upload** button (top-right icon).
2. Select **File** ➔ Choose **`affordpro-hostinger-frontend.zip`** (located at `E:\Antigravity Project\Affordpro\affordpro-hostinger-frontend.zip`).
3. Wait for the upload to complete (100%).

---

### STEP 4: Extract the Zip File
1. Right-click **`affordpro-hostinger-frontend.zip`** inside `public_html`.
2. Click **Extract**.
3. Choose destination: `.` (Current directory: `public_html`).
4. Click **Extract**.

---

### STEP 5: Verify File Structure inside `public_html`
Ensure your `public_html` directory looks **EXACTLY** like this:

```text
public_html/
│
├── .htaccess             <-- Ensures direct URL routing works without 404
├── index.html            <-- Main application entry HTML
├── affordpro-logo.png    <-- Favicon & Branding Logo
└── assets/               <-- Production JS & CSS bundles
    ├── index-XXXX.js
    └── index-XXXX.css
```

> **IMPORTANT**: `index.html` and `.htaccess` must be **directly** inside `public_html`, NOT inside a nested subfolder like `public_html/dist/`.

---

## 🌐 PRODUCTION API BASE URL CONFIGURATION

The frontend communicates with your live backend using the environment variable:

```text
VITE_API_BASE_URL
```

* **Current Placeholder**: `https://api.affordpro.com/api/v1`
* **Development Local URL**: `http://localhost:5000/api/v1`

### How to update the Production API URL in the future:
1. Open `.env.production` (or create it from `.env.production.example`).
2. Set your live backend API URL:
   ```env
   VITE_API_BASE_URL=https://your-live-backend-domain.com/api/v1
   ```
3. Run `npm run build` locally.
4. Re-upload the contents of `dist/` to Hostinger `public_html/`.

---

## 🔁 SPA ROUTING (`.htaccess`)
Because AffordPro is a React Single Page Application (SPA), direct navigation to routes like:
* `/products`
* `/product/viral-reels-bundle`
* `/category/canva-templates`
* `/cart`
* `/checkout`
* `/account`
* `/login`

requires Apache URL rewriting. The included **`.htaccess`** file in `public_html` automatically routes all requests to `index.html` so direct link opening works perfectly without Hostinger 404 errors.

---

## 🧪 HOW TO TEST THE DEPLOYED WEBSITE
1. Open `https://yourdomain.com` in your web browser.
2. Test homepage loading, product browsing, category filtering, search, cart, and checkout.
3. Test direct page refreshing on `/product/<slug>` and `/cart`.
