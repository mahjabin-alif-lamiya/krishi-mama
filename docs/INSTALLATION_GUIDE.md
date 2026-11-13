# Krishi Mama — Installation & Local Development Guide

This guide details the prerequisites and step-by-step setup required to run **Krishi Mama** locally for development, evaluation, and testing.

---

## 1. System Prerequisites

* **Node.js:** `>= 18.18.0` (Recommended: Node.js 22 LTS)
* **npm:** `>= 9.0.0`
* **Python:** `>= 3.11.0` (Optional — for running raw NumPy CLI analysis; fallback handles snapshots)
* **MongoDB:** Local MongoDB Community Server `>= 6.0` or MongoDB Atlas account (Optional — offline snapshot mode activates automatically if disconnected)
* **Git:** Installed on system PATH

---

## 2. Cloning the Repository

```bash
git clone https://github.com/mahjabin-alif-lamiya/krishi-mama.git
cd krishi-mama
```

---

## 3. Backend Setup (`krishi_server`)

1. **Navigate to the server directory:**
   ```bash
   cd krishi_server
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *For minimal offline development, default values are sufficient. Add `MONGODB_URI` and `GEMINI_API_KEY` for live database and Google AI assistant features.*

4. **Run Server Unit & Offline Tests:**
   ```bash
   npm run test:unit
   npm run test:offline
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   *The API will listen at:* `http://localhost:5000/api/v1`

---

## 4. Frontend Setup (`krishi_client`)

1. **Open a new terminal and navigate to the client directory:**
   ```bash
   cd ../krishi_client
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file:
   ```bash
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1" > .env.local
   ```

4. **Run Frontend Tests:**
   ```bash
   npm test
   ```

5. **Start the Next.js Development Server:**
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to:* `http://localhost:3000`

---

## 5. Production Build Verification

To verify that the frontend builds cleanly without errors:
```bash
cd krishi_client
npm run build
```
This will compile all 25 static and dynamic pages with 0 errors.
