# Krishi Mama — REST API Documentation

Base URL (Production): `https://krishi-mama-api.onrender.com/api/v1`  
Base URL (Local): `http://localhost:5000/api/v1`

---

## 1. General Response Format

All responses use standard JSON envelopes:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-11-13T12:00:00.000Z"
  }
}
```

In case of error:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DISTRICT",
    "message": "Only Cumilla and Chattogram currently have validated district data."
  }
}
```

---

## 2. API Endpoints Catalog

### Health & Status
* `GET /health` — Verifies server runtime, memory usage, uptime, and database connection status.

### Climate & Agro-Climatology
* `GET /climate/summary?district=cumilla` — Historical mean agro-climatology indicators (rainfall, temperatures, humidity, solar radiation).
* `GET /climate/rainfall?district=cumilla&grouping=monthly` — Monthly precipitation distributions and historical variance.
* `GET /climate/temperature?district=cumilla` — Temperature extremes and diurnal temperature range (DTR).
* `GET /climate/handoff?district=cumilla&transition=aman-mustard` — Seasonal transition window evaluation (Nov 1–20) based on 25-year dry-run distributions.

### Crop Rotation Planner
* `POST /rotations/preview` — Evaluates a single crop sequence for feasibility.
  * *Request Body:* `{ "district": "cumilla", "crops": ["monsoon_aman", "mustard", "boro_rice"], "soil": "clay_loam", "drainage": "moderate", "irrigation": "tubewell", "priority": "yield" }`
* `POST /rotations/compare` — Compares two proposed crop rotations and returns agro-climatic resilience scores.

### Satellite Observations
* `GET /soil-moisture/latest?district=cumilla` — Latest recommended SMAP surface soil moisture observation.
* `GET /soil-moisture/history?district=cumilla&from=YYYY-MM-DD&to=YYYY-MM-DD` — Time-series of recommended SMAP observations.
* `GET /vegetation/latest?district=cumilla` — Latest rank-0 good quality MODIS NDVI/EVI composite.
* `GET /gpm/latest?district=cumilla` — Latest complete 48-interval daily GPM rain total.

### GIS & Administrative Boundaries
* `GET /gis/districts` — Supported pilot district centroids and p-codes.
* `GET /gis/boundaries?district=cumilla` — BBS 2020 Admin2 boundary GeoJSON polygon.
* `GET /gis/layers?district=cumilla` — Combined bundle of boundary and latest satellite footprints for client map rendering.

### Weather Intelligence
* `GET /weather/forecast?district=cumilla` — 7-day short-range and 16-day extended numerical weather forecast.
* `GET /weather/alerts?district=cumilla&crop=monsoon_aman` — Deterministic agro-meteorological risk assessment and active BMD government bulletins.

### AI Assistant
* `POST /assistant/chat` — Context-grounded conversation endpoint.
  * *Request Body:* `{ "message": "কুমিল্লার মাটির আর্দ্রতা কেমন?", "district": "cumilla" }`
* `GET /assistant/conversations` — Retrieves logged-in farmer's chat session history.
