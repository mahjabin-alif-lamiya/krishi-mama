# Krishi Mama — Testing & Quality Assurance Verification

This report documents the automated testing infrastructure, pass rates, test categories, and verification evidence for **Krishi Mama**.

---

## 1. Automated Test Suites Summary

| Test Suite | Location | Runner | Test Count | Pass Rate |
| :--- | :--- | :--- | :---: | :---: |
| **Frontend Unit & Integration** | `krishi_client/tests/` | Node.js Test Runner | **187** | **100% (187 / 187)** |
| **Backend Unit & Contract** | `krishi_server/tests/` | Node.js Test Runner | **106** | **100% (106 / 106)** |
| **Backend Offline & Snapshot** | `krishi_server/tests/` | Node.js Test Runner | **8** | **100% (8 / 8)** |
| **Total Automated Tests** | Across Monorepo | Built-in `node --test` | **301** | **100%** |

---

## 2. Frontend Test Verification Breakdown (`krishi_client`)

* **`voice.input.test.js` & `voice.output.test.js`:** Tests Web Speech API availability, interim vs final transcripts, language toggling, Bengali Unicode preservation, and SpeechSynthesis voice matching.
* **`map.offline.test.js`:** Tests BBS 2020 GeoJSON boundary parsing offline, polygon bounds calculation, SVG DivIcon generation with zero external PNG dependencies, and spatial footprints geometry (SMAP 36 km, MODIS 250 m).
* **`farm.ui.test.js`, `farm.lifecycle.ui.test.js`, `farm.activity.ui.test.js`, `farm.notification.ui.test.js`:** Tests farm lifecycle stage calculators, task state transitions, and responsive mobile layouts.
* **`dashboard.data.audit.test.js` & `cross.page.data.consistency.test.js`:** Verifies that GPM precipitation requires 48 valid intervals before publishing daily totals, SMAP requires flag 0/8, and MODIS rank-1 marginal data is withheld from operational views.
* **`division.intelligence.test.js`:** Verifies that the dashboard correctly scopes data to Cumilla and Chattogram without leaking cross-district state.
* **`auth.location.test.js` & `auth.ui.alignment.test.js`:** Validates GPS coordinate mapping to districts, safety fallback timers, and phone number normalization.

---

## 3. Backend Test Verification Breakdown (`krishi_server`)

* **NASA Ingestion & Validation Suites:**
  * `gpm.validator.test.js`: Confirms 48 half-hour interval requirement for local day standard.
  * `smap.validator.test.js` & `smap.recovery.test.js`: Confirms filtering of fill value `-9999.0` and verification of 16-bit quality flags.
  * `modis.validator.test.js` & `modis.latest.quality.test.js`: Confirms pixel reliability scaling ($0.0001$) and good quality (rank 0) separation.
  * `power.validator.test.js`: Enforces strict validation of multi-parameter daily agro-climatology envelopes.
* **AI Grounding & Security Suites:**
  * `assistant.tools.test.js`: Validates Gemini tool schemas, parameter typing, and executor outputs.
  * `assistant.grounded.test.js`: Verifies that AI answers refuse ungrounded questions and respect district availability constraints.
* **Offline Verification Suite (`npm run test:offline`):**
  * `offline.readiness.test.js` & `phase8_2_verification.js`: Confirms that with MongoDB disconnected, all REST API endpoints serve pre-cached static snapshots with full data integrity.
