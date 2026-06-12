# CBC Teachers Hub — Production Deployment Guide

> Version: 1.0.0  
> Last updated: June 2026

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Variables](#2-environment-variables)
3. [Vercel Deployment (Frontend)](#3-vercel-deployment-frontend)
4. [Firebase Deployment (Backend)](#4-firebase-deployment-backend)
5. [Google Cloud Configuration](#5-google-cloud-configuration)
6. [Pesapal Webhook Setup](#6-pesapal-webhook-setup)
7. [Post-Deployment Verification](#7-post-deployment-verification)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

### Accounts & Tools

| Requirement | Details |
|-------------|---------|
| **GitHub** | Repository hosted on GitHub |
| **Vercel** | Account at vercel.com (Hobby or Pro) |
| **Firebase** | Blaze plan (pay-as-you-go) required for Cloud Functions |
| **Google Cloud** | Project with billing enabled |
| **Pesapal** | Merchant account (sandbox tested) |
| **Node.js** | v20+ installed locally |
| **Firebase CLI** | `npm install -g firebase-tools` |

### Verify Local Setup

```bash
node --version    # >= 20
npm --version     # >= 10
firebase --version # >= 13
```

---

## 2. Environment Variables

### Overview

- **`NEXT_PUBLIC_*`** variables are safe for the browser (bundled into client JS).
- **Server-only** variables are never exposed to the client.
- All variables must be set in **Vercel** and **locally**.

### Required Variables

Copy `.env.production.example` and fill in your values:

```bash
cp .env.production.example .env.local
```

| Variable | Required | Public | Description |
|----------|----------|--------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | ✅ | Firebase Web API key (starts with `AIza...`) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | ✅ | e.g. `cbc-teachers-hub.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | ✅ | e.g. `cbc-teachers-hub.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | ✅ | Sender ID from Firebase console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | ✅ | App ID from Firebase console |
| `FIREBASE_ADMIN_SERVICE_ACCOUNT` | ✅ | ❌ | Full JSON string of service account key |
| `GEMINI_API_KEY` | ⚠️* | ❌ | Google AI Studio API key |
| `PESAPAL_CONSUMER_KEY` | ⚠️* | ❌ | Pesapal API consumer key |
| `PESAPAL_CONSUMER_SECRET` | ⚠️* | ❌ | Pesapal API consumer secret |
| `PESAPAL_IPN_ID` | ⚠️* | ❌ | Pesapal Instant Payment Notification ID |
| `NEXT_PUBLIC_BASE_URL` | ✅ | ✅ | **Production URL** e.g. `https://cbc-teachers-hub.vercel.app` |

> ⚠️* Required only if you use the corresponding feature.  
> `GEMINI_API_KEY` is needed for AI generation.  
> `PESAPAL_*` variables are needed for subscriptions.

### Setting Variables in Vercel

```bash
# Install Vercel CLI (optional — can use dashboard)
npm i -g vercel

# Link project (first time)
vercel link

# Add each variable
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add FIREBASE_ADMIN_SERVICE_ACCOUNT production
# ... repeat for all variables
```

Or set them in the **Vercel Dashboard** → Project → Settings → Environment Variables.

---

## 3. Vercel Deployment (Frontend)

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "Production deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `./` (default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Node Version** | 20.x |

4. Add all environment variables from [Section 2](#2-environment-variables)
5. Click **Deploy**

### Step 3: Configure Domain (Optional)

1. Vercel Dashboard → Project → Domains
2. Add your custom domain (e.g. `cbcteachers.com`)
3. Update DNS records as instructed by Vercel
4. Set `NEXT_PUBLIC_BASE_URL` to your custom domain

### Step 4: Enable Production Branch

Vercel automatically deploys `main`/`master` to production.  
To change: Project → Settings → Git → Production Branch.

---

## 4. Firebase Deployment (Backend)

### Step 1: Login & Select Project

```bash
firebase login
firebase use cbc-teachers-hub
```

### Step 2: Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

This deploys:
- `firestore.rules` — Firestore security rules
- `firestore.indexes.json` — Composite indexes

### Step 3: Deploy Storage Rules

```bash
firebase deploy --only storage
```

### Step 4: Deploy Cloud Functions

```bash
# Install functions dependencies
cd functions
npm ci
cd ..

# Build TypeScript
cd functions
npm run build
cd ..

# Set function secrets (never commit these)
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set RESEND_API_KEY
firebase functions:secrets:set PESAPAL_CONSUMER_KEY
firebase functions:secrets:set PESAPAL_CONSUMER_SECRET
firebase functions:secrets:set PESAPAL_IPN_ID

# Deploy functions
firebase deploy --only functions
```

### Step 5: Verify Firebase Auth

1. Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Enable **Google** (if using Google sign-in)
4. Add authorized domains:
   - `cbc-teachers-hub.vercel.app` (your Vercel domain)
   - `cbcteachers.com` (your custom domain, if any)

---

## 5. Google Cloud Configuration

### Step 1: Enable Required APIs

In **Google Cloud Console** → APIs & Services → Library, enable:

| API | Purpose |
|-----|---------|
| **Identity Toolkit API** | Required for Firebase Authentication |
| **Firebase Rules API** | Required for Firestore Rules |
| **Cloud Functions API** | Required for Firebase Functions |
| **Cloud Firestore API** | Firestore database |
| **Cloud Storage API** | Firebase Storage |

### Step 2: Configure API Key Restrictions

1. Google Cloud Console → APIs & Services → Credentials
2. Find your Web API key (`AIzaSy...`)
3. **Application restrictions** → **HTTP referrers**
4. Add (if using a custom domain):
   ```
   https://cbc-teachers-hub.vercel.app/*
   https://your-custom-domain.com/*
   ```
5. Keep for local development:
   ```
   http://localhost:3000/*
   http://localhost:3001/*
   ```
6. **API restrictions** → **Restrict key**
7. Select: `Identity Toolkit API`, `Firebase Rules API`, `Cloud Storage API`, `Cloud Firestore API`

### Step 3: Create Service Account (for Admin SDK)

1. Google Cloud Console → IAM & Admin → Service Accounts
2. Create service account → `cbc-teachers-hub-admin`
3. Assign roles:
   - `Firebase Admin SDK Admin`
   - `Firebase Authentication Admin`
   - `Cloud Datastore User`
   - `Storage Object Admin`
4. Create and download JSON key
5. Copy the entire JSON content as `FIREBASE_ADMIN_SERVICE_ACCOUNT` environment variable

---

## 6. Pesapal Webhook Setup

### Step 1: Configure Webhook URL

Pesapal sends IPN (Instant Payment Notification) to your webhook endpoint.

Your webhook URL will be:
```
https://cbc-teachers-hub.vercel.app/api/webhooks/pesapal
```

### Step 2: Register IPN with Pesapal

Use the Pesapal merchant dashboard or API to register the IPN URL.

### Step 3: Set `PESAPAL_IPN_ID`

After registration, copy the IPN ID returned by Pesapal and set it as:
```
PESAPAL_IPN_ID=<your-ipn-id>
```

### Step 4: Set Environment

For production:
```
PESAPAL_ENVIRONMENT=production
```

### Step 5: Verify webhook

```bash
curl -X GET https://cbc-teachers-hub.vercel.app/api/webhooks/pesapal
# Expected: {"status":"Pesapal webhook endpoint active"}
```

---

## 7. Post-Deployment Verification

### Checklist

Test each item after deployment:

| # | Test | Expected Result | Pass/Fail |
|---|------|----------------|-----------|
| 1 | Visit `https://your-app.vercel.app/` | Homepage loads, no console errors | — |
| 2 | Go to `/signup` | Signup form renders | — |
| 3 | Create a new account | User created, redirected to dashboard | — |
| 4 | Logout | Redirected to `/login` | — |
| 5 | Login with email/password | Dashboard loads | — |
| 6 | Forgot password | Email sent (if Resend configured) | — |
| 7 | `/teacher/dashboard` | Loads without errors | — |
| 8 | Generate a lesson plan | AI returns content, saved to library | — |
| 9 | Generate an exam | AI returns content | — |
| 10 | Resource Centre — upload | File uploads to Storage | — |
| 11 | Resource Centre — search | Results appear | — |
| 12 | Subscription — click "Upgrade" | Redirects to Pesapal | — |
| 13 | Subscription — complete payment | Status changes to `active` | — |
| 14 | Visit `/admin` as `school_admin` | Admin dashboard loads | — |
| 15 | Visit `/admin` as `teacher` | Redirected to `/teacher/dashboard` | — |
| 16 | Visit `/lesson-plans` without login | Redirected to `/login` | — |
| 17 | Check Vercel Analytics dashboard | Page views recorded | — |
| 18 | Trigger an error on a page | Error boundary shows, app doesn't crash | — |
| 19 | Mobile — `/login` | Responsive, works on small screens | — |
| 20 | API — `GET /api/webhooks/pesapal` | Returns 200 with status message | — |

### Production Smoke Test Script

```bash
# 1. Check app is online
curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app/
# Expected: 200

# 2. Check security headers
curl -s -I https://your-app.vercel.app/ | grep -i "strict-transport-security"
# Expected: max-age=63072000; includeSubDomains; preload

# 3. Check middleware protection (unauthenticated)
curl -s -o /dev/null -w "%{http_code}" https://your-app.vercel.app/teacher/dashboard
# Expected: 307 (redirect to /login)

# 4. Check API (unauthenticated)
curl -s -X POST https://your-app.vercel.app/api/ai/lesson-plan \
  -H "Content-Type: application/json" \
  -d '{}' -o /dev/null -w "%{http_code}"
# Expected: 401 (missing auth token)

# 5. Check sitemap
curl -s https://your-app.vercel.app/sitemap.xml | head -5
# Expected: XML sitemap
```

---

## 8. Troubleshooting

### Firebase Auth 403 / auth/network-request-failed

**Cause:** API key HTTP referrer restrictions blocking your domain.

**Fix:**
1. Google Cloud Console → APIs & Services → Credentials
2. Edit your Web API key
3. Under "Application restrictions" → "HTTP referrers"
4. Add: `https://your-app.vercel.app/*`
5. Under "API restrictions", ensure "Identity Toolkit API" is selected

### Firestore Permission Denied

**Cause:** Firestore rules not deployed or incorrect.

**Fix:**
```bash
firebase deploy --only firestore:rules
```

### Cloud Functions Deploy Fails

**Cause:** Missing secrets or billing not enabled.

**Fix:**
```bash
# Check billing
firebase console  # → Project → Usage & Billing

# Set missing secrets
firebase functions:secrets:set GEMINI_API_KEY
```

### Vercel Build Fails

**Cause:** Missing environment variables during build.

**Fix:**
- Ensure all required vars are set in Vercel dashboard
- Check build logs: Vercel Dashboard → Deployments → Failed → View Logs
- Common missing: `FIREBASE_ADMIN_SERVICE_ACCOUNT` (large JSON, paste carefully)

### Pesapal Webhook Not Received

**Cause:** IPN URL not registered or incorrect.

**Fix:**
1. Verify `PESAPAL_IPN_ID` is correct
2. Verify webhook URL is publicly accessible:
   ```bash
   curl https://your-app.vercel.app/api/webhooks/pesapal
   ```
3. Check Pesapal merchant dashboard for IPN configuration

### Session Cookie Not Set

**Cause:** AuthProvider fails to read Firestore user document.

**Fix:**
- Verify the user document exists in `users/{uid}` collection
- Check Firestore rules allow reading `users/{uid}` for authenticated users

---

## Production Architecture Summary

```
┌──────────────────────────────────────────────────────────────────┐
│                          Vercel (Frontend)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Next.js App (Edge + Serverless Functions)                 │  │
│  │  • Middleware (auth protection)                            │  │
│  │  • API Routes (AI generation, billing, resources)          │  │
│  │  • Static Pages (homepage, auth, dashboard)                │  │
│  │  • Vercel Analytics                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Firebase (Backend)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Auth        │  │  Firestore  │  │  Cloud Functions        │  │
│  │  • Email/pwd │  │  • users    │  │  • Authentication hooks │  │
│  │  • Google    │  │  • subscriptions │  • AI processing ext. │  │
│  └─────────────┘  │  • ai_usage  │  └─────────────────────────┘  │
│                   │  • generated_content │                       │
│                   └─────────────┘                                │
└──────────────────────────────────────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         Google AI     OpenAI        Pesapal
         (Gemini)      (Fallback)    (Payments)
```

---

## Rollback Plan

If the deployment has issues:

```bash
# Vercel — revert to previous deployment
vercel rollback

# Firebase Functions — deploy previous version
firebase deploy --only functions --force

# Or from git:
git revert HEAD --no-edit
git push origin main
```
