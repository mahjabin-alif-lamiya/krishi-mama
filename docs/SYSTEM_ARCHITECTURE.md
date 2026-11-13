# Krishi Mama — System Architecture & Design

This document details the software architecture, data flow, component interactions, and deployment topology of **Krishi Mama**.

---

## 1. Architectural Principles

1. **Decoupled Client-Server:** The Next.js frontend and Express REST API operate independently, communicating over standard HTTPS JSON endpoints.
2. **Defensive Scientific Ingestion:** Raw NASA granules are subjected to validation gates before persistence in MongoDB Atlas.
3. **Graceful Degradation (Offline Mode):** If MongoDB Atlas is unreachable or during rural network disconnects, the backend seamlessly falls back to pre-packaged static snapshots (`cumilla_climate.json`, `cumilla_handoff.json`, etc.).
4. **Zero-Hallucination AI:** The Google Gemini integration operates strictly through tool calling, precluding the LLM from fabricating observations.

---

## 2. End-to-End Component Flow

```mermaid
flowchart TD
    subgraph Users["End Users"]
        Farmer["Farmer (Bengali Mobile/Web)"]
        Officer["Agriculture Officer (Desktop/Tablet)"]
    end

    subgraph Frontend["Frontend Tier (Vercel)"]
        NextApp["Next.js 16 Web App"]
        LeafletMap["Leaflet GIS Component"]
        VoiceIO["Web Speech STT / TTS"]
        I18n["Bilingual Localization (bn/en)"]
    end

    subgraph Gateway["API Gateway Tier (Render)"]
        Express["Express 5 REST API (/api/v1)"]
        CorsMW["CORS & Cookie Parser"]
        RateLimit["Rate Limiting & Auth Guard"]
    end

    subgraph BackendServices["Core Application Services"]
        RotSvc["Crop Rotation Analysis Engine"]
        GisSvc["GIS & Administrative Boundary Service"]
        WeatherSvc["Agro-Weather Risk Engine"]
        FarmSvc["Farm Lifecycle & Task Service"]
        AiSvc["Assistant Chat & Grounding Engine"]
        SnapshotSvc["Offline Snapshot Service"]
    end

    subgraph DataTier["Data Tier"]
        MongoDB[("MongoDB Atlas Cloud DB")]
        Snapshots[("Static JSON Snapshots")]
    end

    subgraph ExternalSources["External APIs & Data"]
        NasaPowerAPI["NASA POWER API"]
        NasaCmrAPI["NASA Earthdata CMR API"]
        OpenMeteoAPI["Open-Meteo Weather API"]
        GeminiAPI["Google Gemini 2.5 Flash"]
    end

    Farmer --> NextApp
    Officer --> NextApp
    NextApp --> VoiceIO
    NextApp --> LeafletMap
    NextApp --> I18n
    NextApp --> Express

    Express --> CorsMW --> RateLimit
    RateLimit --> RotSvc
    RateLimit --> GisSvc
    RateLimit --> WeatherSvc
    RateLimit --> FarmSvc
    RateLimit --> AiSvc

    RotSvc --> MongoDB
    GisSvc --> MongoDB
    FarmSvc --> MongoDB
    WeatherSvc --> OpenMeteoAPI
    AiSvc --> GeminiAPI
    AiSvc --> FarmSvc

    RotSvc -.-> SnapshotSvc
    GisSvc -.-> SnapshotSvc
    SnapshotSvc --> Snapshots

    MongoDB -.-> Ingestion["Scheduled Ingestion Jobs"]
    Ingestion --> NasaPowerAPI
    Ingestion --> NasaCmrAPI
```

---

## 3. Directory and Package Layout

```
krishi-mama/
├── krishi_client/               # Next.js 16 Frontend
│   ├── app/                     # Next.js App Router (25 routes)
│   ├── components/              # UI, Map, Chart, Dashboard components
│   ├── contexts/                # Auth, Location, Voice contexts
│   ├── lib/                     # Localization, tokens, helpers
│   ├── services/                # API client abstraction
│   └── tests/                   # 187 automated unit tests
│
├── krishi_server/               # Express 5 Backend
│   ├── data/                    # BBS GeoJSON & offline snapshots
│   ├── src/
│   │   ├── config/              # Climate, SMAP, GPM, MODIS configs
│   │   ├── controllers/         # REST API route controllers
│   │   ├── jobs/                # Ingestion scripts (POWER, SMAP, CMR)
│   │   ├── models/              # Mongoose database schemas
│   │   ├── routes/              # Express v1 route definitions
│   │   ├── security/            # Ownership filters & password hashing
│   │   ├── services/            # Domain business & analytical logic
│   │   └── validators/          # Input sanity & boundary checks
│   └── tests/                   # 106 unit & 8 offline tests
│
├── docs/                        # Comprehensive documentation
├── PROJECT_DOCUMENTATION.md     # Primary documentation file
└── README.md                    # Root project guide
```
