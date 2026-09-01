// Indian Agricultural Crop Weather Rules & Advisory Guidelines (Meghdoot / Agromet IMD Standard)
export const CROPS_DATA = [
  {
    id: "wheat",
    name: "Wheat (गेहूं)",
    season: "Rabi (Winter)",
    criticalStages: ["CRI (Crown Root Initiation)", "Tillering", "Jointing", "Flowering / Heading", "Milking / Grain Filling"],
    tempOpt: { min: 10, max: 25, ideal: 18 },
    rainOpt: "75 - 100 mm (Light irrigation intervals)",
    pesticideSprayConditions: {
      maxWindSpeedKm: 12,
      maxRainProbPct: 20,
      minTemp: 12,
      maxTemp: 28,
      idealHumidity: "50% - 70%"
    },
    weatherRisks: [
      { condition: "Terminal Heatwave (>32°C during grain filling)", impact: "Causes forced maturity, shrivelled grains, and yield loss up to 25%." },
      { condition: "Unseasonal Rain / Hailstorm at maturity", impact: "Lodging, grain blackening, and fungal blast." },
      { condition: "Prolonged high humidity (>85%) with 15-20°C temp", impact: "Yellow Rust (Puccinia striiformis) epidemic." }
    ],
    advisories: {
      highRain: "Suspend nitrogen top-dressing and irrigation. Clear field drainage channels to prevent water stagnation.",
      frostRisk: "Apply light evening sprinkler irrigation to elevate soil microclimate temperature by 1-2°C.",
      drySpell: "Apply protective light irrigation at critical CRI (21 DAS) or flowering stages."
    }
  },
  {
    id: "rice",
    name: "Rice / Paddy (धान / चावल)",
    season: "Kharif (Monsoon) & Boro",
    criticalStages: ["Nursery Raising", "Transplanting", "Tillering", "Panicle Initiation", "Flowering", "Maturity"],
    tempOpt: { min: 20, max: 37, ideal: 28 },
    rainOpt: "1150 - 1500 mm (Standing water needed)",
    pesticideSprayConditions: {
      maxWindSpeedKm: 15,
      maxRainProbPct: 30,
      minTemp: 20,
      maxTemp: 35,
      idealHumidity: "60% - 85%"
    },
    weatherRisks: [
      { condition: "Prolonged dry spell during panicle emergence", impact: "High spikelet sterility and unfilled chaffy grains." },
      { condition: "Heavy rainfall (>100mm/day) post flowering", impact: "Submergence stress and bacterial leaf blight." },
      { condition: "Cloudy humid weather with intermittent drizzles", impact: "Brown Plant Hopper (BPH) and False Smut outbreak." }
    ],
    advisories: {
      highRain: "Maintain 5 cm bund height and release excess water into farm ponds or drainage canals.",
      drySpell: "Adopt Alternate Wetting and Drying (AWD) technique to conserve irrigation water.",
      pestAlert: "If overcast conditions persist for 3+ days, monitor for Brown Plant Hopper near base of tillers."
    }
  },
  {
    id: "cotton",
    name: "Cotton / Kapas (कपास)",
    season: "Kharif",
    criticalStages: ["Squaring", "Flowering", "Boll Formation", "Boll Bursting / Picking"],
    tempOpt: { min: 21, max: 35, ideal: 27 },
    rainOpt: "500 - 750 mm",
    pesticideSprayConditions: {
      maxWindSpeedKm: 10,
      maxRainProbPct: 15,
      minTemp: 22,
      maxTemp: 34,
      idealHumidity: "45% - 65%"
    },
    weatherRisks: [
      { condition: "Rainfall during boll opening / picking stage", impact: "Fiber quality deterioration, staining, and boll rotting." },
      { condition: "Waterlogging for >48 hours", impact: "Root asphyxiation and para-wilt disease." }
    ],
    advisories: {
      highRain: "Drain excess water immediately. Avoid picking cotton right after rain; pick only during bright sunshine.",
      pestAlert: "Pink Bollworm pheromone traps must be inspected if nocturnal temperatures exceed 24°C."
    }
  },
  {
    id: "mustard",
    name: "Mustard / Sarson (सरसों)",
    season: "Rabi",
    criticalStages: ["Germination", "Rosette", "Flowering", "Siliqua / Pod Formation"],
    tempOpt: { min: 10, max: 25, ideal: 17 },
    rainOpt: "350 - 450 mm",
    pesticideSprayConditions: {
      maxWindSpeedKm: 10,
      maxRainProbPct: 10,
      minTemp: 10,
      maxTemp: 25,
      idealHumidity: "50% - 70%"
    },
    weatherRisks: [
      { condition: "Cloudy weather with high humidity (>80%) during flowering", impact: "Aphid (Lipaphis erysimi) flare-up and Alternaria blight." },
      { condition: "Frost / Freezing temperatures (<4°C)", impact: "Siliqua pod freezing and yield loss." }
    ],
    advisories: {
      frostRisk: "Create smoke screens/smudge fires on windward edges in the early morning to deter frost damage.",
      pestAlert: "Spray Thiamethoxam 25 WG @ 0.2g/L on clear sunny mornings if aphid population exceeds ETL."
    }
  },
  {
    id: "sugarcane",
    name: "Sugarcane (गन्ना)",
    season: "Perennial / Annual",
    criticalStages: ["Germination", "Tillering / Formative", "Grand Growth", "Ripening"],
    tempOpt: { min: 20, max: 38, ideal: 30 },
    rainOpt: "1500 - 2500 mm",
    pesticideSprayConditions: {
      maxWindSpeedKm: 15,
      maxRainProbPct: 25,
      minTemp: 18,
      maxTemp: 35,
      idealHumidity: "60% - 80%"
    },
    weatherRisks: [
      { condition: "Waterlogging at grand growth", impact: "Root rot and reduced sucrose accumulation." },
      { condition: "Severe drought / Heat stress (>42°C)", impact: "Internode shortening and early shoot borer attack." }
    ],
    advisories: {
      highRain: "Earth up soil around cane rows to prevent lodging during gale winds.",
      drySpell: "Apply trash mulching in inter-row spaces to preserve rhizosphere soil moisture."
    }
  }
];
