# Krishi Mama — Database Design & Schema Specifications

The backend uses **MongoDB Atlas** as its persistence layer via Mongoose models.

---

## 1. Primary Collections Overview

| Collection Name | Model File | Purpose | Key Indexes |
| :--- | :--- | :--- | :--- |
| `users` | `user.model.js` | Farmer accounts and profile preferences | `email: 1 (sparse)`, `phone: 1 (sparse)` |
| `farms` | `farm.model.js` | Field parcels, crop types, coordinates | `userId: 1`, `location.districtCode: 1` |
| `farmactivities` | `farmactivity.model.js` | Agronomic tasks, scheduled calendar dates | `farmId: 1, scheduledDate: 1` |
| `farmnotifications` | `farmnotification.model.js` | Weather alerts and crop advisory notices | `farmId: 1, isRead: 1` |
| `nasaobservations` | `nasaobservation.model.js` | NASA POWER historical agro-climatology | `districtCode: 1, date: 1 (unique)` |
| `gpmobservations` | `gpmobservation.model.js` | NASA GPM IMERG daily rainfall records | `districtCode: 1, observationDate: 1 (unique)` |
| `smapobservations` | `smapobservation.model.js` | NASA SMAP L3 surface soil moisture | `districtCode: 1, date: 1, pass: 1 (unique)` |
| `modisobservations` | `modisobservation.model.js` | NASA MODIS 16-day NDVI/EVI composites | `districtCode: 1, dateLabel: 1 (unique)` |
| `conversations` | `conversation.model.js` | AI assistant grounded chat sessions | `userId: 1, updatedAt: -1` |
| `officialwarnings` | `officialwarning.model.js` | Verified BMD weather bulletins | `status: 1, effectiveUntil: 1` |

---

## 2. Key Schemas & Data Constraints

### GpmObservation Schema
```javascript
{
  districtCode: { type: String, required: true },
  observationDate: { type: Date, required: true },
  dateLabel: { type: String, required: true },
  totalPrecipitationMm: { type: Number, required: true },
  validIntervals: { type: Number, required: true }, // Exactly 48 for complete days
  observedIntervals: { type: Number, required: true },
  expectedIntervals: { type: Number, default: 48 },
  completeness: { type: String, enum: ["complete", "incomplete"], required: true },
  ingestionStatus: { type: String, enum: ["INGESTED", "CONTROLLED_TEST"], default: "INGESTED" }
}
```

### SmapObservation Schema
```javascript
{
  districtCode: { type: String, required: true },
  date: { type: Date, required: true },
  pass: { type: String, enum: ["AM", "PM", "COMPOSITE"], default: "COMPOSITE" },
  soilMoisture: { type: Number, required: true },
  qualityFlag: { type: Number, required: true },
  isRecommendedQuality: { type: Boolean, required: true }, // true for flag 0 or 8
  rawSoilMoisture: { type: Number },
  provenanceDatasetId: { type: String, default: "SPL3SMP_E.006" }
}
```

### ModisObservation Schema
```javascript
{
  districtCode: { type: String, required: true },
  dateLabel: { type: String, required: true },
  ndvi: { type: Number, required: true },
  evi: { type: Number },
  pixelReliability: { type: Number, required: true }, // 0 = Good, 1 = Marginal
  isReliableQuality: { type: Boolean, required: true },
  qualityClassification: { type: String, enum: ["good_data", "marginal_data", "unusable"] }
}
```
