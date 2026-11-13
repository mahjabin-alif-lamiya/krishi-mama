# Krishi Mama (কৃষি মামা) — Project Overview

**NASA Space Apps Challenge 2026**  
**Challenge:** Field Shift — Adapting Farms with NASA Data  
**Team:** NeuralMesh  

---

## 1. Executive Summary

Krishi Mama is a digital decision-support platform designed for the agricultural ecosystem of Bangladesh. It combines NASA Earth observation datasets with ground agronomic data to provide:

* Actionable crop rotation recommendations based on historical climate norms.
* Seasonal transition window intelligence (e.g., Transplanted Aman rice harvest to winter Mustard sowing).
* Real-time environmental monitoring using calibrated NASA satellite observations.
* Offline resilience and voice-enabled AI assistance in both Bangla and English.

## 2. Links to Deployments & Code

* **Live Web Application (Frontend):** [https://krishi-mama.vercel.app/](https://krishi-mama.vercel.app/)
* **Live REST API (Backend):** [https://krishi-mama-api.onrender.com/](https://krishi-mama-api.onrender.com/)
* **API Health Check:** [https://krishi-mama-api.onrender.com/api/v1/health](https://krishi-mama-api.onrender.com/api/v1/health)
* **GitHub Repository:** [https://github.com/mahjabin-alif-lamiya/krishi-mama](https://github.com/mahjabin-alif-lamiya/krishi-mama)

## 3. Core Modules & Components

1. **Dashboard Overview:** Displays regional agro-climatology indicators, data quality badges, and numerical weather intelligence for Cumilla and Chattogram.
2. **Crop Rotation Engine:** Evaluates multi-crop combinations across Kharif-1, Kharif-2, and Robi seasons against irrigation, soil texture, and drainage constraints.
3. **Agro-Weather Crop Calendar:** Aligns DAE/BAMIS approved standard meteorological weeks (SMW) with active satellite observations for Aman, Boro, Aus, and Mustard.
4. **Interactive GIS Map:** Vector-based GIS viewer rendering BBS 2020 administrative boundaries and satellite observation footprints.
5. **My Farm Management:** Personalized parcel tracker enabling farmers to schedule field activities, calculate phenology stages, and receive localized hazard warnings.
6. **Bilingual AI Assistant:** Context-grounded conversational agent powered by Google Gemini 2.5 Flash with fallback to a deterministic offline engine.
