/**
 * Curated user-facing guide to Krishi Mama routes and workflows.
 * Keep this aligned with krishi_client/app and the shared navigation config.
 * Contains public feature information only; never put user or farm records here.
 */

const PAGES = [
  {
    route: "/",
    title: "Home",
    keywords: ["home", "homepage", "landing", "শুরু", "হোম"],
    access: "Public",
    purpose: "Introduces Krishi Mama, its climate and crop decision-support features, and links to public data pages and sign-in.",
  },
  {
    route: "/dashboard",
    title: "Dashboard",
    keywords: ["dashboard", "overview", "ড্যাশবোর্ড", "সারাংশ"],
    access: "Signed-in workspace",
    purpose: "Shows a farmer's selected district and farm context, environmental summaries, weather intelligence, and planning information when available.",
  },
  {
    route: "/my-farm",
    title: "My Farm",
    keywords: ["farm", "my farm", "খামার", "জমি", "farm profile"],
    access: "Signed-in workspace",
    purpose: "Lists the signed-in user's farms and supports adding, editing, opening, or deleting a farm. Farm records can include name, location, land, crop, variety, planting date, soil, water source, and notes.",
  },
  {
    route: "/my-farm/new and /my-farm/[id]/edit",
    title: "Add or edit a farm",
    keywords: ["add farm", "new farm", "edit farm", "খামার যোগ", "খামার সম্পাদনা"],
    access: "Signed-in workspace",
    purpose: "Guided forms capture the farm's location and land, crop details, and other available profile fields. Save changes from the form; the assistant cannot change farm records.",
  },
  {
    route: "/my-farm/[id]",
    title: "Farm workspace",
    keywords: ["farm details", "crop stage", "activities", "কাজ", "ফসলের পর্যায়"],
    access: "Owner only",
    purpose: "Shows the selected owner's farm details, current calendar-estimated crop stage, environmental context, and scheduled/completed activities. Activity status and notes are managed in the farm page.",
  },
  {
    route: "/my-farm/plan and /rotation-planner",
    title: "Crop planning and rotation",
    keywords: ["crop plan", "rotation", "crop rotation", "ফসল পরিকল্পনা", "শস্যপর্যায়"],
    access: "Signed-in workspace for saved farm plans; public rotation demo is available at /crop-rotation",
    purpose: "Helps compare supported crop sequences and review deterministic eligibility and climate-informed planning results. Results are decision support, not a guaranteed yield or a plan saved by the assistant.",
  },
  {
    route: "/crop-rotation",
    title: "Crop rotation demo",
    keywords: ["rotation demo", "public demo", "ফসল চক্রের ডেমো"],
    access: "Public demo; saving farm-specific plans requires sign-in",
    purpose: "Shows sample crop-rotation planning without using another farmer's private farm records.",
  },
  {
    route: "/assistant",
    title: "AI Farmer Assistant",
    keywords: ["assistant", "chatbot", "ai", "প্রশ্ন", "চ্যাটবট"],
    access: "Signed-in workspace; guest access, if enabled, is temporary",
    purpose: "Answers farming questions using the current conversation, authorized selected-farm context, validated observations, official crop guidance, and available weather tools. It is read-only and cannot edit farms or save plans.",
  },
  {
    route: "/handoff",
    title: "Crop Transition (Handoff)",
    keywords: ["handoff", "transition", "crop change", "ফসল পরিবর্তন", "শুকনা সময়"],
    access: "Available in the application",
    purpose: "Reviews supported Aman-to-mustard and Boro-to-Aus transition windows using historical climate analysis. Historical opportunity rates are not a forecast or guarantee.",
  },
  {
    route: "/climate, /rainfall, /soil-moisture, /vegetation",
    title: "Climate and environmental data",
    keywords: ["climate", "rainfall", "soil moisture", "ndvi", "evi", "আবহাওয়া", "বৃষ্টি", "মাটির আর্দ্রতা", "উদ্ভিদ"],
    access: "Public data pages",
    purpose: "Shows available climate and environmental observations by supported district: NASA POWER historical climate, NASA GPM precipitation, NASA SMAP surface soil moisture, and NASA MODIS vegetation indices. Availability and observation date vary by dataset.",
  },
  {
    route: "/map",
    title: "Interactive Map",
    keywords: ["map", "district map", "মানচিত্র", "জেলা"],
    access: "Public data page",
    purpose: "Explores supported district-level geography and available map data. A district-level satellite or weather value is not a measurement from an individual field.",
  },
  {
    route: "/crop-calendar",
    title: "Crop Calendar",
    keywords: ["calendar", "sowing", "planting", "harvest", "ক্যালেন্ডার", "বপন", "কাটা"],
    access: "Public data page",
    purpose: "Presents official crop-calendar guidance for supported crops, including available sowing, transplanting, stage, and harvest periods. Calendar guidance must be considered with field conditions.",
  },
  {
    route: "/data-sources",
    title: "Data Sources",
    keywords: ["source", "dataset", "nasa", "data source", "তথ্যসূত্র", "উপাত্ত"],
    access: "Public data page",
    purpose: "Explains the datasets and providers used by the site. NASA observations may be archived or delayed; NASA POWER historical climate is not live weather.",
  },
  {
    route: "/settings",
    title: "Settings",
    keywords: ["settings", "language", "theme", "সেটিংস", "ভাষা", "থিম"],
    access: "Signed-in workspace",
    purpose: "Provides available account and application preferences. Never ask for or disclose passwords, authentication codes, or private credentials in chat.",
  },
  {
    route: "/login, /register, /location-onboarding",
    title: "Account and location setup",
    keywords: ["login", "sign in", "register", "account", "location", "লগইন", "নিবন্ধন", "অবস্থান"],
    access: "Public entry pages",
    purpose: "Sign in or register to use private farm features. Location onboarding sets the user's selected area. The assistant cannot sign users in or change authentication details.",
  },
];

const SITE_LIMITATIONS = [
  "Validated district environmental records are currently scoped to Cumilla and Chattogram; do not invent coverage elsewhere.",
  "Use dataset-specific tools for current database values. This guide describes site features and is not a live data feed.",
  "Farm and conversation data is private to its owner. Never search across or reveal other users' records.",
  "Only call a recommendation complete when its required observations or official guidance are available; state missing data clearly.",
];

const DATA_CATALOGUE = [
  {
    dataset: "NASA GPM IMERG Final V07",
    use: "Satellite precipitation observations and local-day rainfall summaries.",
    rule: "A daily total is reportable only when all 48 Bangladesh-local half-hour intervals pass validation. About 0.1-degree grid estimates are not farm rain-gauge readings.",
  },
  {
    dataset: "NASA SMAP SPL3SMP_E V006",
    use: "Validated satellite surface soil-moisture estimates.",
    rule: "Use recommended quality records only. This represents the top 0-5 cm, not root-zone moisture or a live field sensor.",
  },
  {
    dataset: "NASA MODIS MOD13Q1.061",
    use: "Validated vegetation greenness indices (NDVI/EVI).",
    rule: "Use reliable pixel-quality records. Greenness is not a disease diagnosis, crop-specific field inspection, or guaranteed yield.",
  },
  {
    dataset: "NASA POWER Daily Point",
    use: "Historical district climate statistics, rainfall, and temperature baselines.",
    rule: "The configured climate normal period is 2001-2025. Historical climate is not today's live weather or a forecast.",
  },
  {
    dataset: "Open-Meteo forecast and seasonal products; BMD official warnings",
    use: "Short-range and extended weather outlooks, seasonal tendencies, and separately identified official weather warnings.",
    rule: "Forecasts have regional spatial resolution and uncertainty; always distinguish official bulletins from project-generated risk assessments.",
  },
  {
    dataset: "BAMIS / DAE / BRRI / BARI official crop guidance",
    use: "Supported crop calendars, growth stages, and agronomic guidance returned by the official-guidance tools.",
    rule: "Calendar windows are general guidance, not a promise of yield or a substitute for field conditions.",
  },
];

export function getPlatformKnowledge({ topic = "" } = {}) {
  const query = String(topic).toLocaleLowerCase();
  const selectedPages = query
    ? PAGES.filter((page) =>
        page.keywords.some((keyword) => {
          const normalizedKeyword = keyword.toLocaleLowerCase();
          return query.includes(normalizedKeyword) || normalizedKeyword.split(/\s+/).every((word) => query.includes(word));
        }) ||
        page.title.toLocaleLowerCase().includes(query) ||
        page.route.toLocaleLowerCase().includes(query)
      )
    : PAGES;
  const pages = selectedPages.length > 0 ? selectedPages : PAGES;

  return {
    title: "Krishi Mama website guide",
    pageCount: pages.length,
    pages,
    supportedDistricts: ["Cumilla", "Chattogram"],
    crops: ["Transplanted Aman rice", "Boro rice", "Aus rice", "Mustard"],
    dataCatalogue: DATA_CATALOGUE,
    limitations: SITE_LIMITATIONS,
  };
}
