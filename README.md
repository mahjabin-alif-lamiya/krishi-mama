# Krishi Mama (কৃষি মামা)

**Team NeuralMesh | NASA Space Apps Challenge 2026 | Bangladesh**
**Challenge:** Field Shift: Adapting Farms with NASA Data
**Live app:** https://krishi-mama.vercel.app

Krishi Mama helps Bangladeshi farmers decide when to sow the next crop. After harvesting Aman rice, a farmer often asks: "If I wait one more week, will I lose my crop?" Krishi Mama compares sowing on time, after 7 days and after 14 days, using 25 years (2001 to 2025) of NASA POWER daily data, and explains the result in simple Bangla or English.

It is a decision-support tool built on past patterns. It is **not a weather forecast** and it never guarantees a crop outcome.

## Team

| Name | Role |
|---|---|
| Mahjabin Alif Lamiya | Full-stack, AI/ML |
| Md Rabbi Miah | Full-stack |
| Sumaiya Noor Dip | AI/ML, Researcher |
| Ikra Islam | UI/UX, Researcher |
| Md. Mizbaul Hasan Shawon | UI/UX, Content Creation |

## What the app does

1. The farmer chooses a division and a district (any of 64 districts, or "Use my location").
2. The farmer chooses a soil type (clay, loam or sandy), the next crop (mustard, lentil or wheat, after Aman rice) and a goal (lowest risk, saves water, protects soil).
3. The app compares the risk of sowing on time, after 7 days and after 14 days, recommends the safest timing, and gives short next steps.
4. A "Listen" button reads the advice aloud using the browser's built-in speech voices (availability depends on the device and browser).
5. The whole app works in Bangla and English, with a light and dark theme.

The interface is designed for farmers with limited literacy: one question per screen, large cards, icons, colors with icons (not color alone), and one plain sentence per result.

## NASA data used

**NASA POWER Daily API** (point query per district, 2001-01-01 to 2025-12-31):

| Variable | Meaning | Used in the risk score? |
|---|---|---|
| `PRECTOTCORR` | Corrected precipitation (mm/day) | Yes |
| `GWETROOT` | Root zone soil wetness (0 to 1) | Yes |
| `T2M` | Air temperature at 2 m | Fetched, not used yet (planned for heat-stress analysis) |

Data is requested live through a server route (`src/app/api/handoff/route.js`) and cached for 24 hours. If NASA does not respond within 8 seconds, the app falls back to a saved snapshot (`src/data/snapshots/`). The response states whether the data is `live` or `snapshot`, and the interface shows a badge.

Snapshots are included for Chattogram, Cumilla, Dhaka and Rajshahi. Other districts use the live API.

## How the risk is calculated

No machine learning. The method is a transparent count of past years.

For each rotation and each delay (0, 7, 14 days):

1. Take the 14-day establishment window that starts at the target sowing date plus the delay.
2. For each year from 2001 to 2025, mark the year as **too wet** if total rainfall in the window is above the wet threshold.
3. Mark the year as **too dry** if mean root zone soil wetness (`GWETROOT`) is below the dry threshold.
4. Risk percent = years marked wet or dry / years with complete data x 100.
5. Levels: under 25% safe, 25% to 50% caution, over 50% danger.

Code: `src/lib/risk.js`, `src/lib/sentences.js`, `src/lib/advice.js`, `src/lib/priorities.js`.

## Local information (not NASA data)

These values are **assumptions** and must be verified with BRRI, DAE, BARC and BAMIS. They are listed openly on the NASA Data page of the app.

| Rotation | Target sowing date | Wet threshold (14-day rain) | Dry threshold (mean GWETROOT) |
|---|---|---|---|
| Aman rice then Mustard | 10 November | above 40 mm | below 0.45 |
| Aman rice then Lentil | 15 November | above 35 mm | below 0.45 |
| Aman rice then Wheat | 22 November | above 45 mm | below 0.45 |

Soil type shifts the thresholds slightly (clay tolerates less rain, sandy tolerates more). Crop traits (water need, duration, effect on soil nitrogen) and the farmer's goal are used to rank the options. Everything is in `src/lib/crops.js`, `src/lib/soils.js` and `src/lib/priorities.js`.

## Limitations

- Shows past patterns only. It is not a weather forecast.
- NASA POWER is a grid product (about 0.5 degree), so a district point does not represent an exact field.
- Soil wetness is a model estimate, not a field measurement.
- Crop and soil values are assumptions, and the same assumptions are used for all districts. They are not yet calibrated regionally.
- The tool has been checked mainly for Chattogram and Cumilla and has not been tested with farmers yet.

## Future work

- NASA SMAP and NASA-USDA soil moisture, and GPM IMERG rainfall
- A heat-stress score using `T2M`
- Regional crop calendars and more crops
- Voice and SMS delivery for farmers
- Integration with BAMIS
- Validation with farmers and agricultural experts

## Tech stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, Recharts, lucide-react. Deployed on Vercel.

## Run locally

```bash
npm install
npm run snapshots   # optional: download offline NASA POWER snapshots
npm run dev
```

Open http://localhost:3000. No API key is needed for NASA POWER.

## Project structure

```
src/app/            pages: Home, planner (When to Sow), NASA Data, API route
src/components/     layout, cards, planner steps, UI
src/lib/            risk logic, crop and soil assumptions, sentences, translations
src/data/snapshots/ saved NASA POWER data (offline fallback)
scripts/            snapshot downloader
```

## Use of AI

- **Claude (Anthropic):** used for planning, writing prompts, and drafting documentation and presentation scripts.
- **Antigravity:** used as the coding assistant to generate and edit code from our prompts.
- The risk calculation itself uses no AI or machine learning. All sentences shown to farmers are generated by fixed rules in the code.
- `AGENTS.md` is an instruction file for AI coding agents (it is generated by Next.js) and is not part of the app.

## Credits and licenses

Data: NASA POWER, NASA Langley Research Center (https://power.larc.nasa.gov). Fonts: Inter and Noto Sans Bengali (Google Fonts). Icons: lucide-react.

Built for the NASA International Space Apps Challenge 2026 by Team NeuralMesh.
