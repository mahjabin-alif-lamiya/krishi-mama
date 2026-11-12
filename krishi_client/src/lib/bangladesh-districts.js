/**
 * Bangladesh Administrative Divisions & Districts Dataset
 * Comprehensive mapping for NASA POWER agro-meteorological point queries.
 *
 * NOTE: Coordinates represent official district administrative headquarters / meteorological
 * representative points for NASA POWER (~0.5° x 0.5° grid resolution). They do not directly
 * represent individual farm parcels.
 */

export const DIVISIONS = [
  { id: "barishal", name: { en: "Barishal", bn: "বরিশাল" } },
  { id: "chattogram", name: { en: "Chattogram", bn: "চট্টগ্রাম" } },
  { id: "dhaka", name: { en: "Dhaka", bn: "ঢাকা" } },
  { id: "khulna", name: { en: "Khulna", bn: "খুলনা" } },
  { id: "mymensingh", name: { en: "Mymensingh", bn: "ময়মনসিংহ" } },
  { id: "rajshahi", name: { en: "Rajshahi", bn: "রাজশাহী" } },
  { id: "rangpur", name: { en: "Rangpur", bn: "রংপুর" } },
  { id: "sylhet", name: { en: "Sylhet", bn: "সিলেট" } },
];

export const DISTRICTS = {
  // ==========================================
  // BARISHAL DIVISION (6 districts)
  // ==========================================
  barguna: {
    id: "barguna",
    name: { en: "Barguna", bn: "বরগুনা" },
    division: { id: "barishal", en: "Barishal", bn: "বরিশাল" },
    lat: 22.0953,
    lon: 90.1121,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  barishal: {
    id: "barishal",
    name: { en: "Barishal", bn: "বরিশাল" },
    division: { id: "barishal", en: "Barishal", bn: "বরিশাল" },
    lat: 22.701,
    lon: 90.3535,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  bhola: {
    id: "bhola",
    name: { en: "Bhola", bn: "ভোলা" },
    division: { id: "barishal", en: "Barishal", bn: "বরিশাল" },
    lat: 22.6859,
    lon: 90.6481,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  jhalokati: {
    id: "jhalokati",
    name: { en: "Jhalokati", bn: "ঝালকাঠি" },
    division: { id: "barishal", en: "Barishal", bn: "বরিশাল" },
    lat: 22.6406,
    lon: 90.1987,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  patuakhali: {
    id: "patuakhali",
    name: { en: "Patuakhali", bn: "পটুয়াখালী" },
    division: { id: "barishal", en: "Barishal", bn: "বরিশাল" },
    lat: 22.3596,
    lon: 90.3298,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  pirojpur: {
    id: "pirojpur",
    name: { en: "Pirojpur", bn: "পিরোজপুর" },
    division: { id: "barishal", en: "Barishal", bn: "বরিশাল" },
    lat: 22.5841,
    lon: 89.972,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // CHATTOGRAM DIVISION (11 districts)
  // ==========================================
  bandarban: {
    id: "bandarban",
    name: { en: "Bandarban", bn: "বান্দরবান" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 22.1953,
    lon: 92.2184,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  brahmanbaria: {
    id: "brahmanbaria",
    name: { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 23.9571,
    lon: 91.1119,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  chandpur: {
    id: "chandpur",
    name: { en: "Chandpur", bn: "চাঁদপুর" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 23.2333,
    lon: 90.6667,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  chattogram: {
    id: "chattogram",
    name: { en: "Chattogram", bn: "চট্টগ্রাম" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 22.34,
    lon: 91.83,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  "coxs-bazar": {
    id: "coxs-bazar",
    name: { en: "Cox's Bazar", bn: "কক্সবাজার" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 21.4272,
    lon: 92.0058,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  cumilla: {
    id: "cumilla",
    name: { en: "Cumilla", bn: "কুমিল্লা" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 23.46,
    lon: 91.18,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  feni: {
    id: "feni",
    name: { en: "Feni", bn: "ফেনী" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 23.0186,
    lon: 91.3966,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  khagrachhari: {
    id: "khagrachhari",
    name: { en: "Khagrachhari", bn: "খাগড়াছড়ি" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 23.1193,
    lon: 91.9847,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  lakshmipur: {
    id: "lakshmipur",
    name: { en: "Lakshmipur", bn: "লক্ষ্মীপুর" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 22.9425,
    lon: 90.8412,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  noakhali: {
    id: "noakhali",
    name: { en: "Noakhali", bn: "নোয়াখালী" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 22.8696,
    lon: 91.0998,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  rangamati: {
    id: "rangamati",
    name: { en: "Rangamati", bn: "রাঙ্গামাটি" },
    division: { id: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
    lat: 22.7324,
    lon: 92.2985,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // DHAKA DIVISION (13 districts)
  // ==========================================
  dhaka: {
    id: "dhaka",
    name: { en: "Dhaka", bn: "ঢাকা" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.8103,
    lon: 90.4125,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  faridpur: {
    id: "faridpur",
    name: { en: "Faridpur", bn: "ফরিদপুর" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.6071,
    lon: 89.8426,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  gazipur: {
    id: "gazipur",
    name: { en: "Gazipur", bn: "গাজীপুর" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 24.0023,
    lon: 90.4264,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  gopalganj: {
    id: "gopalganj",
    name: { en: "Gopalganj", bn: "গোপালগঞ্জ" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.0051,
    lon: 89.8266,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  kishoreganj: {
    id: "kishoreganj",
    name: { en: "Kishoreganj", bn: "কিশোরগঞ্জ" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 24.4449,
    lon: 90.7766,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  madaripur: {
    id: "madaripur",
    name: { en: "Madaripur", bn: "মাদারীপুর" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.1641,
    lon: 90.1897,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  manikganj: {
    id: "manikganj",
    name: { en: "Manikganj", bn: "মানিকগঞ্জ" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.8644,
    lon: 90.0047,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  munshiganj: {
    id: "munshiganj",
    name: { en: "Munshiganj", bn: "মুন্সীগঞ্জ" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.5422,
    lon: 90.5305,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  narayanganj: {
    id: "narayanganj",
    name: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.6337,
    lon: 90.4965,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  narsingdi: {
    id: "narsingdi",
    name: { en: "Narsingdi", bn: "নরসিংদী" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.9193,
    lon: 90.7202,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  rajbari: {
    id: "rajbari",
    name: { en: "Rajbari", bn: "রাজবাড়ী" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.7574,
    lon: 89.6445,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  shariatpur: {
    id: "shariatpur",
    name: { en: "Shariatpur", bn: "শরীয়তপুর" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 23.2423,
    lon: 90.3537,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  tangail: {
    id: "tangail",
    name: { en: "Tangail", bn: "টাঙ্গাইল" },
    division: { id: "dhaka", en: "Dhaka", bn: "ঢাকা" },
    lat: 24.2513,
    lon: 89.9167,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // KHULNA DIVISION (10 districts)
  // ==========================================
  bagerhat: {
    id: "bagerhat",
    name: { en: "Bagerhat", bn: "বাগেরহাট" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 22.6516,
    lon: 89.7859,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  chuadanga: {
    id: "chuadanga",
    name: { en: "Chuadanga", bn: "চুয়াডাঙ্গা" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.6402,
    lon: 88.8418,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  jashore: {
    id: "jashore",
    name: { en: "Jashore", bn: "যশোর" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.1664,
    lon: 89.2081,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  jhenaidah: {
    id: "jhenaidah",
    name: { en: "Jhenaidah", bn: "ঝিনাইদহ" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.5448,
    lon: 89.1539,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  khulna: {
    id: "khulna",
    name: { en: "Khulna", bn: "খুলনা" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 22.8456,
    lon: 89.5403,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  kushtia: {
    id: "kushtia",
    name: { en: "Kushtia", bn: "কুষ্টিয়া" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.9013,
    lon: 89.1205,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  magura: {
    id: "magura",
    name: { en: "Magura", bn: "মাগুরা" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.4873,
    lon: 89.4199,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  meherpur: {
    id: "meherpur",
    name: { en: "Meherpur", bn: "মেহেরপুর" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.7622,
    lon: 88.6318,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  narail: {
    id: "narail",
    name: { en: "Narail", bn: "নড়াইল" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 23.1725,
    lon: 89.5127,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  satkhira: {
    id: "satkhira",
    name: { en: "Satkhira", bn: "সাতক্ষীরা" },
    division: { id: "khulna", en: "Khulna", bn: "খুলনা" },
    lat: 22.7185,
    lon: 89.0705,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // MYMENSINGH DIVISION (4 districts)
  // ==========================================
  jamalpur: {
    id: "jamalpur",
    name: { en: "Jamalpur", bn: "জামালপুর" },
    division: { id: "mymensingh", en: "Mymensingh", bn: "ময়মনসিংহ" },
    lat: 24.9375,
    lon: 89.9378,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  mymensingh: {
    id: "mymensingh",
    name: { en: "Mymensingh", bn: "ময়মনসিংহ" },
    division: { id: "mymensingh", en: "Mymensingh", bn: "ময়মনসিংহ" },
    lat: 24.7471,
    lon: 90.4203,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  netrokona: {
    id: "netrokona",
    name: { en: "Netrokona", bn: "নেত্রকোণা" },
    division: { id: "mymensingh", en: "Mymensingh", bn: "ময়মনসিংহ" },
    lat: 24.8709,
    lon: 90.7279,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  sherpur: {
    id: "sherpur",
    name: { en: "Sherpur", bn: "শেরপুর" },
    division: { id: "mymensingh", en: "Mymensingh", bn: "ময়মনসিংহ" },
    lat: 25.0205,
    lon: 90.0153,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // RAJSHAHI DIVISION (8 districts)
  // ==========================================
  bogura: {
    id: "bogura",
    name: { en: "Bogura", bn: "বগুড়া" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.8465,
    lon: 89.3777,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  chapainawabganj: {
    id: "chapainawabganj",
    name: { en: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.5965,
    lon: 88.2775,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  joypurhat: {
    id: "joypurhat",
    name: { en: "Joypurhat", bn: "জয়পুরহাট" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 25.1015,
    lon: 89.027,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  naogaon: {
    id: "naogaon",
    name: { en: "Naogaon", bn: "নওগাঁ" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.7936,
    lon: 88.9318,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  natore: {
    id: "natore",
    name: { en: "Natore", bn: "নাটোর" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.4206,
    lon: 89.0003,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  pabna: {
    id: "pabna",
    name: { en: "Pabna", bn: "পাবনা" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.0064,
    lon: 89.2372,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  rajshahi: {
    id: "rajshahi",
    name: { en: "Rajshahi", bn: "রাজশাহী" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.3636,
    lon: 88.6241,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  sirajganj: {
    id: "sirajganj",
    name: { en: "Sirajganj", bn: "সিরাজগঞ্জ" },
    division: { id: "rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
    lat: 24.4534,
    lon: 89.7008,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // RANGPUR DIVISION (8 districts)
  // ==========================================
  dinajpur: {
    id: "dinajpur",
    name: { en: "Dinajpur", bn: "দিনাজপুর" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 25.6217,
    lon: 88.6355,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  gaibandha: {
    id: "gaibandha",
    name: { en: "Gaibandha", bn: "গাইবান্ধা" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 25.3288,
    lon: 89.5407,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  kurigram: {
    id: "kurigram",
    name: { en: "Kurigram", bn: "কুড়িগ্রাম" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 25.8054,
    lon: 89.6362,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  lalmonirhat: {
    id: "lalmonirhat",
    name: { en: "Lalmonirhat", bn: "লালমনিরহাট" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 25.9923,
    lon: 89.2847,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  nilphamari: {
    id: "nilphamari",
    name: { en: "Nilphamari", bn: "নীলফামারী" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 25.9318,
    lon: 88.856,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  panchagarh: {
    id: "panchagarh",
    name: { en: "Panchagarh", bn: "পঞ্চগড়" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 26.3411,
    lon: 88.5542,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  rangpur: {
    id: "rangpur",
    name: { en: "Rangpur", bn: "রংপুর" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 25.7439,
    lon: 89.2752,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  thakurgaon: {
    id: "thakurgaon",
    name: { en: "Thakurgaon", bn: "ঠাকুরগাঁও" },
    division: { id: "rangpur", en: "Rangpur", bn: "রংপুর" },
    lat: 26.0337,
    lon: 88.4617,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },

  // ==========================================
  // SYLHET DIVISION (4 districts)
  // ==========================================
  habiganj: {
    id: "habiganj",
    name: { en: "Habiganj", bn: "হবিগঞ্জ" },
    division: { id: "sylhet", en: "Sylhet", bn: "সিলেট" },
    lat: 24.375,
    lon: 91.4155,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  moulvibazar: {
    id: "moulvibazar",
    name: { en: "Moulvibazar", bn: "মৌলভীবাজার" },
    division: { id: "sylhet", en: "Sylhet", bn: "সিলেট" },
    lat: 24.4829,
    lon: 91.7774,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  sunamganj: {
    id: "sunamganj",
    name: { en: "Sunamganj", bn: "সুনামগঞ্জ" },
    division: { id: "sylhet", en: "Sylhet", bn: "সিলেট" },
    lat: 25.0658,
    lon: 91.395,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
  sylhet: {
    id: "sylhet",
    name: { en: "Sylhet", bn: "সিলেট" },
    division: { id: "sylhet", en: "Sylhet", bn: "সিলেট" },
    lat: 24.8949,
    lon: 91.8687,
    note: "Representative district administrative point; NASA POWER ~0.5° grid.",
  },
};

/**
 * Retrieve a district object by ID
 * @param {string} id
 * @returns {Object|null}
 */
export function getDistrictById(id) {
  if (!id) return null;
  const key = String(id).toLowerCase().trim();
  return DISTRICTS[key] || null;
}

/**
 * Get all districts belonging to a division
 * @param {string} divisionId
 * @returns {Array}
 */
export function getDistrictsByDivision(divisionId) {
  if (!divisionId || divisionId === "all") {
    return Object.values(DISTRICTS);
  }
  const divKey = String(divisionId).toLowerCase().trim();
  return Object.values(DISTRICTS).filter(
    (d) => d.division.id.toLowerCase() === divKey
  );
}

/**
 * Search districts across English and Bangla names with optional division filter
 * @param {string} searchQuery
 * @param {string} [divisionId="all"]
 * @returns {Array}
 */
export function searchDistricts(searchQuery = "", divisionId = "all") {
  const baseList = getDistrictsByDivision(divisionId);
  const q = String(searchQuery).toLowerCase().trim();

  if (!q) return baseList;

  return baseList.filter((d) => {
    const enName = d.name.en.toLowerCase();
    const bnName = d.name.bn.toLowerCase();
    const divEn = d.division.en.toLowerCase();
    const divBn = d.division.bn.toLowerCase();

    return (
      enName.includes(q) ||
      bnName.includes(q) ||
      divEn.includes(q) ||
      divBn.includes(q)
    );
  });
}

/**
 * Get all 64 districts as an array
 * @returns {Array}
 */
export function getAllDistricts() {
  return Object.values(DISTRICTS);
}
