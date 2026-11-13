# Google OAuth 2.0 Setup Guide — Krishi Mama (কৃষি মামা)

This guide explains why Google Sign-In displays a setup notice by default, and how to configure Google OAuth 2.0 credentials on **Render** (production) or `.env` (local development).

---

## 1. Why Does Google Sign-In Show a Notice / Return False?

In the current live deployment:
- When a user clicks **"Continue with Google"**, the frontend checks `/api/v1/auth/google/status`.
- The backend checks if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables exist and are valid.
- Since Google OAuth credentials belong to your private Google Cloud Console account, they are not bundled into the open-source repository. When unset, the backend returns:
  ```json
  {
    "success": true,
    "data": {
      "configured": false,
      "clientId": null
    }
  }
  ```
- The frontend detects `configured: false` and displays an informative banner:
  > *"Google Sign-In is awaiting credentials in server/.env... / গুগল সাইন-ইন চালুর জন্য server/.env ফাইলে ক্রেডেনশিয়াল প্রয়োজন।"*

> [!NOTE]
> **You do NOT need Google Login to test Krishi Mama!**
> - **Guest Mode:** All analytical tools, NASA datasets, maps, and crop handoff calculators are open-access without any login.
> - **Email/Password Login:** You can register a new account on [`/register`](https://krishi-mama.vercel.app/register) using an email and password immediately.

---

## 2. Step-by-Step Google Cloud Console Setup

If you would like to enable Google Sign-In:

### Step 1: Create a Project in Google Cloud Console
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and select **"New Project"**.
3. Name the project `krishi-mama` and click **"Create"**.

### Step 2: Configure the OAuth Consent Screen
1. In the left navigation, go to **APIs & Services** > **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the required fields:
   - **App name:** `Krishi Mama`
   - **User support email:** (your email)
   - **Developer contact information:** (your email)
4. Click **Save and Continue** through Scopes (default `email`, `profile`, `openid` are sufficient).
5. Under **Test users**, add your own Google email address (for testing while the app is in testing mode).
6. Click **Save and Continue**.

### Step 3: Create OAuth 2.0 Client Credentials
1. In the left navigation, go to **APIs & Services** > **Credentials**.
2. Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Name: `Krishi Mama Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - `https://krishi-mama.vercel.app` (Live Frontend)
   - `http://localhost:3000` (Local Frontend)
6. Under **Authorized redirect URIs**, add:
   - `https://krishi-mama-api.onrender.com/api/v1/auth/google/callback` (Live Backend Callback)
   - `http://localhost:5000/api/v1/auth/google/callback` (Local Backend Callback)
7. Click **CREATE**.
8. A modal will pop up with your **Client ID** (e.g., `xxxx.apps.googleusercontent.com`) and **Client Secret**. Copy both values.

---

## 3. Adding Credentials to Render (Production Deployment)

To activate Google Sign-In on your live Render backend:

1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click on your **`krishi-mama-api`** Web Service.
3. In the left sidebar, click **Environment**.
4. Click **Add Environment Variable** and add the following keys:

| Key | Value |
|---|---|
| `GOOGLE_CLIENT_ID` | `Your copied Client ID from Google Cloud Console` |
| `GOOGLE_CLIENT_SECRET` | `Your copied Client Secret from Google Cloud Console` |
| `GOOGLE_CALLBACK_URL` | `https://krishi-mama-api.onrender.com/api/v1/auth/google/callback` |
| `CLIENT_URL` | `https://krishi-mama.vercel.app` |

5. Click **Save Changes**.
6. Render will automatically redeploy the backend with the new variables active. Once deployed, clicking "Continue with Google" on `https://krishi-mama.vercel.app/login` will smoothly redirect to the official Google consent screen!
