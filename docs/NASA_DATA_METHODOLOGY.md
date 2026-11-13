# Krishi Mama — NASA Earth Observation Methodology

This document outlines the scientific basis, data acquisition pathways, calibration processes, and data quality standards used for NASA Earth observations in Krishi Mama.

---

## 1. Overview of NASA Datasets

| Dataset | Sensor / Platform | Spatial Resolution | Temporal Frequency | Primary Role in Krishi Mama |
| :--- | :--- | :--- | :--- | :--- |
| **NASA POWER** | Multi-satellite assimilation / MERRA-2 | $0.5^\circ \times 0.625^\circ$ (~50 km) | Daily | 25-year baseline agro-climatology norms (2001–2025) |
| **NASA GPM IMERG** | GPM Core Observatory Constellation | $0.1^\circ \times 0.1^\circ$ (~10 km) | Half-hourly (30 min) | Local-day precipitation and rainfall intensity analysis |
| **NASA SMAP** | L-band Radiometer (1.4 GHz) | 36 km native, 9 km EASE-Grid | Daily | Surface soil moisture ($m^3/m^3$, 0–5 cm depth) |
| **NASA MODIS** | Terra MODIS Optical / IR | 250 m | 16-day composite | Vegetation vigor (NDVI/EVI) and crop greenness |

---

## 2. Ingestion & Validation Protocols

### NASA POWER Agro-Climatology
* **Parameters Extracted:** `PRECTOTCORR`, `T2M`, `T2M_MAX`, `T2M_MIN`, `RH2M`, `ALLSKY_SFC_SW_DWN`.
* **Validation Rule:** All dates must be ISO format `YYYY-MM-DD`. Days outside the validated window are rejected.
* **Storage:** Persisted as continuous daily series for calculating rolling multi-year averages and dry-run streaks.

### NASA GPM IMERG Half-Hourly Precipitation
* **Product:** `GPM_3IMERGHH` V07 Final Run.
* **Asia/Dhaka Standard:** Bangladesh Standard Time (UTC+6) is strictly maintained. The local day begins at 00:00 BST (18:00 UTC previous day) and ends at 23:59 BST (17:59 UTC).
* **Completeness Rule:** Exactly 48 half-hour intervals must exist per local day. If even 1 interval is missing, the day is marked `incomplete` and total precipitation is withheld from farmer view.

### NASA SMAP Soil Moisture
* **Product:** `SPL3SMP_E.006`.
* **Bitmask Quality Evaluation:** Only observations with `retrieval_qual_flag` equal to `0` (Recommended) or `8` (Recommended AM/PM) are accepted into production views.
* **Fill Value Removal:** Values equal to `-9999.0` or out of physical soil porosity range ($<0.0$ or $>0.65\ m^3/m^3$) are filtered out.

### NASA MODIS Vegetation Indices
* **Product:** `MOD13Q1.061`.
* **Pixel Reliability Filtering:**
  * `0`: Good Quality (published).
  * `1`: Marginal Quality (withheld from latest metrics to prevent inaccurate fertilizer/irrigation advice).
  * `2`: Snow/Ice, `3`: Cloudy (excluded).
