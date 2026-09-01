// Active IMD Warning Bulletins, National Warning Matrix & Cyclone Track Datasets

export const IMD_WARNING_LEVELS = {
  GREEN: {
    code: "GREEN",
    title: "No Warning (No Action)",
    action: "Normal Day-to-Day activities can proceed.",
    color: "#22c55e",
    bgClass: "alert-green"
  },
  YELLOW: {
    code: "YELLOW",
    title: "Watch (Be Updated)",
    action: "Keep track of changing weather conditions through official IMD portals.",
    color: "#eab308",
    bgClass: "alert-yellow"
  },
  ORANGE: {
    code: "ORANGE",
    title: "Alert (Be Prepared)",
    action: "Be prepared for disruption in transport, waterlogging, or power outages. Avoid unnecessary travel.",
    color: "#f97316",
    bgClass: "alert-orange"
  },
  RED: {
    code: "RED",
    title: "Warning (Take Action)",
    action: "Immediate disaster mitigation, evacuation of low-lying areas, suspension of coastal & fishing activities.",
    color: "#ef4444",
    bgClass: "alert-red"
  }
};

export const ACTIVE_DISTRICT_ALERTS = [
  {
    district: "Balasore & Bhadrak",
    state: "Odisha",
    lat: 21.4934,
    lon: 86.9135,
    level: "RED",
    event: "Extremely Heavy Rainfall & Coastal Inundation",
    validUntil: "24 Hours (Next 08:30 IST)",
    rainfallExpectedMm: "210 - 260 mm",
    windSpeedKmph: "75 - 85 kmph gusting to 95 kmph",
    impact: "Severe waterlogging in low-lying coastal tracts, tree branch uprooting, damage to kutcha houses.",
    advisory: "NDRF and SDRF teams mobilized. Total suspension of fishing operations. Fishermen advised not to venture into North Bay of Bengal."
  },
  {
    district: "East & West Godavari",
    state: "Andhra Pradesh",
    lat: 16.9891,
    lon: 82.2475,
    level: "ORANGE",
    event: "Isolated Very Heavy Rainfall with Squally Winds",
    validUntil: "36 Hours",
    rainfallExpectedMm: "120 - 180 mm",
    windSpeedKmph: "50 - 60 kmph",
    impact: "Localized flooding of roads, minor landslides in agency hill tracts.",
    advisory: "Keep emergency supplies ready. Shift livestock to elevated platforms."
  },
  {
    district: "Mumbai Suburban & Thane",
    state: "Maharashtra",
    lat: 19.1250,
    lon: 72.8800,
    level: "ORANGE",
    event: "Heavy to Very Heavy Rainfall at Isolated Places with High Tide",
    validUntil: "48 Hours",
    rainfallExpectedMm: "115 - 160 mm",
    windSpeedKmph: "45 - 55 kmph",
    impact: "High tide (4.45m) combined with rain may cause waterlogging in low-lying railway tracks (Kurla/Sion).",
    advisory: "Commuters advised to check BMC/traffic updates before venturing out."
  },
  {
    district: "Ludhiana & Patiala",
    state: "Punjab",
    lat: 30.9010,
    lon: 75.8573,
    level: "YELLOW",
    event: "Thunderstorm with Lightning & Gusty Winds (30-40 kmph)",
    validUntil: "24 Hours",
    rainfallExpectedMm: "25 - 45 mm",
    windSpeedKmph: "35 - 45 kmph",
    impact: "Partial lodging in standing mature mustard and vegetable crops.",
    advisory: "Avoid taking shelter under lone trees during lightning. Defer chemical spraying."
  },
  {
    district: "Barmer & Jaisalmer",
    state: "Rajasthan",
    lat: 25.7521,
    lon: 71.3967,
    level: "ORANGE",
    event: "Severe Heat Wave to Heat Wave Conditions (Max Temp 44-46°C)",
    validUntil: "72 Hours",
    rainfallExpectedMm: "0 mm",
    windSpeedKmph: "20 - 30 kmph (Dry Loo winds)",
    impact: "High risk of heat stroke/dehydration for outdoor laborers, elderly, and infants.",
    advisory: "Avoid exposure between 11:30 AM and 04:00 PM. Drink plenty of water (ORS/Lassi). Wear loose cotton attire."
  },
  {
    district: "Shimla & Kullu",
    state: "Himachal Pradesh",
    lat: 31.1048,
    lon: 77.1734,
    level: "YELLOW",
    event: "Western Disturbance with Light Snow & Rain",
    validUntil: "48 Hours",
    rainfallExpectedMm: "15 - 30 mm (Snow at >2500m)",
    windSpeedKmph: "25 - 35 kmph",
    impact: "Slippery roads in high mountain passes (Atal Tunnel / Jalori Pass).",
    advisory: "Tourists are advised to drive with anti-skid chains and carry warm woollens."
  },
  {
    district: "Guwahati & Kamrup",
    state: "Assam",
    lat: 26.1445,
    lon: 91.7362,
    level: "ORANGE",
    event: "Heavy Rainfall with Rising River Levels in Brahmaputra Tributaries",
    validUntil: "48 Hours",
    rainfallExpectedMm: "90 - 140 mm",
    windSpeedKmph: "30 - 40 kmph",
    impact: "Flash floods in urban pockets and riverbank erosion.",
    advisory: "Keep disaster emergency contacts handy. Move assets from floodplains."
  }
];

// Real-time Cyclone Track Simulation (e.g. Severe Cyclonic Storm in Bay of Bengal)
export const ACTIVE_CYCLONE_SIMULATION = {
  name: "Severe Cyclonic Storm 'SAGAR-DEEP'",
  intensityScale: "Severe Cyclonic Storm (SCS)",
  basin: "North Bay of Bengal",
  centralPressureHpa: 984,
  maxSustainedWindKmph: 110,
  gustingToKmph: 125,
  currentLocation: {
    lat: 18.2,
    lon: 87.4,
    distanceFromCoast: "190 km SE of Paradip (Odisha)"
  },
  landfallForecast: {
    location: "Between Dhamra Port (Odisha) and Sagar Island (West Bengal)",
    expectedTime: "Tomorrow Early Morning (04:00 - 07:00 IST)",
    stormSurgeMeters: "1.5 to 2.2 meters above astronomical tide"
  },
  portWarningSignals: [
    { port: "Paradip", signal: "Great Danger Signal No. X (Ten)" },
    { port: "Dhamra", signal: "Great Danger Signal No. X (Ten)" },
    { port: "Visakhapatnam", signal: "Local Warning Signal No. IV (Four)" },
    { port: "Haldia / Kolkata", signal: "Danger Signal No. VIII (Eight)" }
  ],
  trackWaypoints: [
    { step: "Past 12 hrs", lat: 16.5, lon: 88.5, status: "Deep Depression (55 kmph)", time: "Yesterday 17:30 IST" },
    { step: "Past 6 hrs", lat: 17.3, lon: 88.0, status: "Cyclonic Storm (80 kmph)", time: "Today 05:30 IST" },
    { step: "Current Position", lat: 18.2, lon: 87.4, status: "Severe Cyclonic Storm (110 kmph)", time: "Live / Now", isLive: true },
    { step: "Forecast +12 hrs", lat: 19.6, lon: 87.1, status: "Severe Cyclonic Storm (115 kmph)", time: "Tonight 23:30 IST" },
    { step: "Landfall Forecast", lat: 21.1, lon: 87.0, status: "Landfall Crossing (100-110 kmph)", time: "Tomorrow 05:30 IST", isLandfall: true },
    { step: "Post-Landfall +24 hrs", lat: 22.4, lon: 86.6, status: "Depression over Jharkhand (45 kmph)", time: "Tomorrow 17:30 IST" }
  ]
};
