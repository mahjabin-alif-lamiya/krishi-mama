# References and Citations — Krishi Mama (কৃষি মামা)

This document provides official links, academic citations, and technical documentation references for all satellite datasets, meteorological models, agricultural research institutes, and key technologies utilized in the Krishi Mama platform.

---

## 1. NASA Earth Observation Data Sources

### NASA POWER (Prediction Of Worldwide Energy Resources)
- **Portal:** [https://power.larc.nasa.gov/](https://power.larc.nasa.gov/)
- **API Documentation:** [https://power.larc.nasa.gov/docs/services/api/](https://power.larc.nasa.gov/docs/services/api/)
- **Parameters:**
  - `PRECTOTCORR`: Bias-corrected total precipitation ($mm/day$)
  - `T2M`, `T2M_MAX`, `T2M_MIN`: Temperature at 2 meters ($\degree C$)
  - `RH2M`: Relative humidity at 2 meters ($\%$)
  - `ALLSKY_SFC_SW_DWN`: All-sky surface downward shortwave irradiance ($MJ/m^2/day$)
- **Resolution:** $0.5\degree \times 0.5\degree$ latitude/longitude grid (MERRA-2 assimilation model).

### NASA GPM IMERG (Global Precipitation Measurement)
- **Product:** GPM Level 3 Integrated Multi-satellitE Retrievals for GPM (IMERG) Half-Hourly ($0.1\degree \times 0.1\degree$) V07 (`GPM_3IMERGHH`)
- **Portal:** [https://gpm.nasa.gov/data/imerg](https://gpm.nasa.gov/data/imerg)
- **NASA Earthdata Search:** [https://search.earthdata.nasa.gov/](https://search.earthdata.nasa.gov/)
- **Citation:** Huffman, G. J., et al. (2020). *GPM IMERG Final Precipitation L3 Half Hourly 0.1 degree x 0.1 degree V07*, Goddard Earth Sciences Data and Information Services Center (GES DISC).
- **Processing Standard:** Krishi Mama enforces a strict 48-interval Bangladesh local day ($UTC+6$) completeness check before computing daily aggregates.

### NASA SMAP (Soil Moisture Active Passive)
- **Product:** SMAP L3 Enhanced Radiometer Global Daily 9 km EASE-Grid Soil Moisture (`SPL3SMP_E.006`)
- **Portal:** [https://smap.jpl.nasa.gov/](https://smap.jpl.nasa.gov/)
- **NASA NSIDC DAAC:** [https://nsidc.org/data/smap](https://nsidc.org/data/smap)
- **Citation:** O'Neill, P. E., et al. (2021). *SMAP L3 Enhanced Radiometer Global Daily 9 km EASE-Grid Soil Moisture, Version 6*. Boulder, Colorado USA. NASA National Snow and Ice Data Center Distributed Active Archive Center.
- **Parameters:** Surface volumetric soil moisture ($cm^3/cm^3$ for 0–5 cm topsoil). Quality flags `0` (recommended) and `8` (acceptable) enforced.

### NASA MODIS (Moderate Resolution Imaging Spectroradiometer)
- **Product:** MODIS/Terra Vegetation Indices 16-Day L3 Global 250 m SIN Grid V061 (`MOD13Q1.061`)
- **Portal:** [https://modis.gsfc.nasa.gov/data/dataprod/mod13.php](https://modis.gsfc.nasa.gov/data/dataprod/mod13.php)
- **NASA LP DAAC:** [https://lpdaac.usgs.gov/products/mod13q1v061/](https://lpdaac.usgs.gov/products/mod13q1v061/)
- **Citation:** Didan, K. (2021). *MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V061*. NASA EOSDIS Land Processes Distributed Active Archive Center.
- **Parameters:** NDVI, EVI (scale factor 0.0001, Pixel Reliability Rank 0 good quality).

---

## 2. Bangladesh Agricultural & Meteorological Sources

### BAMIS (Bangladesh Agrometeorological Information System)
- **Portal:** [http://www.bamis.gov.bd/](http://www.bamis.gov.bd/)
- **Organization:** Department of Agricultural Extension (DAE), Ministry of Agriculture, Bangladesh.
- **Role in Krishi Mama:** Agro-climatic advisory bulletins, rainfall classification thresholds, and seasonal agro-climatic boundaries.

### DAE (Department of Agricultural Extension)
- **Portal:** [http://dae.gov.bd/](http://dae.gov.bd/)
- **Organization:** Ministry of Agriculture, Government of the People's Republic of Bangladesh.
- **Role in Krishi Mama:** Official crop sowing calendars, standard crop rotation recommendations, and national agricultural guidelines.

### BRRI (Bangladesh Rice Research Institute)
- **Portal:** [https://brri.portal.gov.bd/](https://brri.portal.gov.bd/)
- **Role in Krishi Mama:** Phenological temperature thresholds, GDD (Growing Degree Day) requirements, and flooding tolerance benchmarks for Aus, T. Aman, and Boro rice cultivars.

### BARI (Bangladesh Agricultural Research Institute)
- **Portal:** [https://bari.portal.gov.bd/](https://bari.portal.gov.bd/)
- **Role in Krishi Mama:** Moisture thresholds, temperature limits, and rotation timings for Rabi oilseeds (Mustard), pulses (Lentil, Mungbean), and winter vegetables.

---

## 3. NASA Space Apps Challenge

- **Event:** NASA International Space Apps Challenge 2026
- **Challenge:** *Field Shift — Adapting Farms with NASA Data*
- **Challenge Overview:** Developing climate-smart tools that harness NASA Earth observation data to guide farmers in adaptive crop rotation, sowing decisions, and sustainable agriculture amid climate uncertainty.
- **Global Portal:** [https://www.spaceappschallenge.org/](https://www.spaceappschallenge.org/)

---

## 4. Software Libraries & Technical Frameworks

- **Next.js:** [https://nextjs.org/](https://nextjs.org/) — React production framework with App Router, server-rendered layouts, and static optimization.
- **React:** [https://react.dev/](https://react.dev/) — User interface library for declarative, component-driven development.
- **Tailwind CSS:** [https://tailwindcss.com/](https://tailwindcss.com/) — Utility-first CSS framework for responsive layout styling.
- **Leaflet & React-Leaflet:** [https://leafletjs.com/](https://leafletjs.com/) — Open-source JavaScript library for interactive GIS mapping.
- **Express.js:** [https://expressjs.com/](https://expressjs.com/) — Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose & MongoDB Atlas:** [https://mongoosejs.com/](https://mongoosejs.com/) — Elegant MongoDB object modeling and cloud document database.
- **Google Generative AI SDK:** [https://ai.google.dev/](https://ai.google.dev/) — Google Gemini API client for domain-grounded agricultural explanations.
- **NumPy & Python Scientific Stack:** [https://numpy.org/](https://numpy.org/) — Fundamental scientific computation package used for offline GPM 48-interval matrix reduction.
