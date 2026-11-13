# Krishi Mama — User Guide (ব্যবহারকারী নির্দেশিকা)

Welcome to **Krishi Mama (কৃষি মামা)**. This guide explains how to use the web application to plan crops, check satellite environmental indicators, track farm activities, and interact with the AI assistant.

---

## 1. Accessing the Platform

Visit the live production site:  
👉 **[https://krishi-mama.vercel.app/](https://krishi-mama.vercel.app/)**

You can also run it locally on your computer at `http://localhost:3000`.

---

## 2. Setting Your Language & District

1. **Language Selection:** Click the language toggle button in the top navigation bar to switch between **English** and **বাংলা (Bengali)**. All numbers, dates, and agricultural terms will translate automatically.
2. **District Selection:** Select either **Cumilla (কুমিল্লা)** or **Chattogram (চট্টগ্রাম)** from the district dropdown in the header or via the location onboarding prompt.

---

## 3. Navigating the Core Modules

### Dashboard Overview (`/dashboard`)
* Provides an immediate snapshot of current rainfall, surface soil moisture, vegetation greenness (NDVI), and 7-day weather outlook for the selected district.
* View data freshness and quality badges directly below each metric card.

### Multi-Crop Rotation Planner (`/crop-rotation` & `/rotation-planner`)
* Choose your district and specify your field soil texture (e.g., Clay Loam, Sandy Loam, Clay), drainage speed, and irrigation source (Rainfed, Tubewell, Canal).
* Select up to 4 sequential crops across Kharif-1, Kharif-2, and Robi seasons.
* Click **"পরিকল্পনা মূল্যায়ন করুন (Evaluate Plan)"** to receive a feasibility score, transition window risk assessment, and recommended sowing dates.

### Agro-Weather Crop Calendar (`/crop-calendar`)
* Select a crop: **Transplanted Aman Rice**, **Boro Rice**, **Aus Rice**, or **Mustard**.
* Examine DAE-certified phenology stages (duration, water needs, weather hazards, and optimal temperature ranges).
* Review active NASA satellite environmental context (SMAP soil moisture and MODIS NDVI) associated with that stage.

### Interactive Environmental GIS Map (`/map`)
* Explore BBS 2020 district boundary polygons layered over OpenStreetMap tiles.
* Toggle spatial footprint layers: GPM rain grid (~10 km), SMAP radiometer footprint (36 km), SMAP EASE-Grid posting (9 km), and MODIS pixels (250 m).

### My Farm Management (`/my-farm`)
* Register or log in to create your personal farm parcel.
* Set your planted crop and sowing date to view your farm's calculated lifecycle timeline.
* Track pending field tasks (e.g., weeding, top-dressing urea, draining field prior to harvest).

### Grounded AI Assistant (`/assistant`)
* Ask agricultural questions via text or voice.
* Click the microphone icon to speak in Bengali; click the speaker icon to listen to spoken answers.
* The assistant references verified farm records, satellite observations, and DAE crop calendars.
