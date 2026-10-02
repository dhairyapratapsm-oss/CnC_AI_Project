# 🚀 Pragya Infotech - Client Shipping & Deployment Guide

This document provides a step-by-step technical deployment manual for handing over and deploying the redesigned **Pragya Infotech Platform** (`pragyainfotech.net`) to the client environment.

---

## 📌 1. Overview of Deliverables

The production-ready codebase is located in:
`c:\Antigravity_workspace\pragya-infotech-web`

### File Manifest:
- `index.html` - Master SEO-optimized landing page featuring the live AI Question Synthesizer demo, curriculum browser, pricing calculator, and role dashboards.
- `register.html` - Multi-step registration portal with live role selection, mobile OTP verification modal, and password strength validator.
- `styles/main.css` - Custom CSS design system with glassmorphism, responsive grid, animations, and dark/light theme variables.
- `js/app.js` - Interactive JavaScript application logic (AI demo engine, counter animations, tab switching, FAQ accordion).
- `js/register.js` - Registration wizard, role state management, password meter, and mobile OTP logic.
- `assets/` - Optimized web graphics (`hero_ai_learning.png`, `question_bank_preview.png`, `student_learning_app.png`).

---

## ☁️ 2. Deployment Options

### Option A: Vercel or Netlify (Recommended - Fast Global CDN & Auto SSL)

1. **Push Code to Git Repository**:
   ```bash
   cd c:\Antigravity_workspace\pragya-infotech-web
   git init
   git add .
   git commit -m "Initial commit - Pragya Infotech Production Web App"
   git remote add origin https://github.com/client-org/pragya-infotech-web.git
   git push -u origin main
   ```
2. **Connect to Vercel / Netlify**:
   - Log in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
   - Click **Import Project** and select the GitHub repository.
   - Framework Preset: **Other / Static Site** (Root directory: `./`).
   - Click **Deploy**.

---

### Option B: Shared Web Hosting (cPanel / Hostinger / GoDaddy via FTP)

1. Log in to the client's cPanel or hosting dashboard.
2. Open **File Manager** and navigate to `public_html/` (or the domain document root for `pragyainfotech.net`).
3. Upload all files from `c:\Antigravity_workspace\pragya-infotech-web`:
   - `index.html`
   - `register.html`
   - `styles/` folder
   - `js/` folder
   - `assets/` folder
4. Verify file permissions: Directories `755`, Files `644`.

---

### Option C: Firebase Hosting Deployment

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login and initialize Firebase in the project folder:
   ```bash
   cd c:\Antigravity_workspace\pragya-infotech-web
   firebase login
   firebase init hosting
   ```
   - Public directory: `.`
   - Configure as single-page app: `No`
3. Deploy to live hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## 🌐 3. Domain & DNS Configuration (`pragyainfotech.net`)

Log in to the domain registrar (e.g. Hostinger, GoDaddy, Namecheap) and set up the DNS records:

| Record Type | Host / Name | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` *(Vercel IP)* or Hosting Server IP | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` or `pragyainfotech.net` | 3600 |

*Note: Ensure HTTPS is enabled in the hosting provider dashboard (Let's Encrypt / Cloudflare SSL).*

---

## 🔌 4. Backend API Integration Checklist

To connect the registration form in `register.html` to the client's live backend server (Python/Node/PHP API):

1. Open [register.js](file:///c:/Antigravity_workspace/pragya-infotech-web/js/register.js).
2. Replace the OTP modal submission handler with an `fetch()` API request to the client backend endpoint:

```javascript
// Replace simulated submit in register.js with live API fetch:
const response = await fetch('https://api.pragyainfotech.net/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: fullName,
    email: email,
    phone: phone,
    role: selectedRole,
    targetClass: document.getElementById('regClass').value,
    targetBoard: document.getElementById('regBoard').value,
    schoolName: document.getElementById('regSchool').value,
    password: password
  })
});
const data = await response.json();
```

---

## 🔍 5. SEO & Analytics Verification Checklist

1. **Google Search Console**:
   - Upload `sitemap.xml` to Google Search Console.
   - Verify ownership using DNS TXT record or HTML file upload.
2. **Google Analytics (GA4)**:
   - Insert GA4 measurement tag script inside `<head>` of `index.html` and `register.html`.
3. **Core Web Vitals Test**:
   - Run PageSpeed Insights on `https://pragyainfotech.net/` to confirm >90 Performance score.

---

## 📄 6. Client Handover Summary Table

| Checklist Item | Status | Notes |
| :--- | :--- | :--- |
| **Landing Page Redesign** | ✅ Complete | Responsive, Glassmorphic, Theme Switcher |
| **Live AI Demo Generator** | ✅ Complete | Physics, Chemistry, Math grounded demo |
| **Registration Portal** | ✅ Complete | Multi-step role onboarding & OTP simulation |
| **SEO Meta Tags & JSON-LD** | ✅ Complete | High ranking search metadata included |
| **Client Deploy Guide** | ✅ Complete | Documented for Vercel, cPanel, Firebase |
