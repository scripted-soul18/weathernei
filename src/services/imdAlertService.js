// India Meteorological Department (IMD) Warning Protocols, Alert Matrices & Bulletin Generator

export const IMD_RAINFALL_CATEGORIES = [
  { min: 0.1, max: 2.4, label: "Very Light Rain (VLR)", color: "#93c5fd" },
  { min: 2.5, max: 15.5, label: "Light Rain (LR)", color: "#60a5fa" },
  { min: 15.6, max: 64.4, label: "Moderate Rain (MR)", color: "#3b82f6" },
  { min: 64.5, max: 115.5, label: "Heavy Rain (HR)", color: "#eab308", alert: "YELLOW / ORANGE" },
  { min: 115.6, max: 204.4, label: "Very Heavy Rain (VHR)", color: "#f97316", alert: "ORANGE / RED" },
  { min: 204.5, max: 999, label: "Extremely Heavy Rain (EHR)", color: "#ef4444", alert: "RED ALERT" }
];

export const IMD_CYCLONE_CLASSIFICATION = [
  { windMinKmph: 31, windMaxKmph: 49, category: "Depression (D)", signal: "Signal I / II" },
  { windMinKmph: 50, windMaxKmph: 61, category: "Deep Depression (DD)", signal: "Signal III" },
  { windMinKmph: 62, windMaxKmph: 88, category: "Cyclonic Storm (CS)", signal: "Signal IV / V" },
  { windMinKmph: 89, windMaxKmph: 117, category: "Severe Cyclonic Storm (SCS)", signal: "Signal VI / VII" },
  { windMinKmph: 118, windMaxKmph: 166, category: "Very Severe Cyclonic Storm (VSCS)", signal: "Signal VIII / IX" },
  { windMinKmph: 167, windMaxKmph: 221, category: "Extremely Severe Cyclonic Storm (ESCS)", signal: "Signal X" },
  { windMinKmph: 222, windMaxKmph: 400, category: "Super Cyclonic Storm (SuCS)", signal: "Signal XI (Great Danger)" }
];

export const PORT_SIGNALS = [
  { num: 1, name: "Cautionary Signal No. I", meaning: "Distant bad weather or squally winds at sea. Ports not affected directly." },
  { num: 2, name: "Warning Signal No. II", meaning: "Distant cyclonic storm with gale winds. Ships leaving port may face rough sea." },
  { num: 3, name: "Local Cautionary Signal No. III", meaning: "Port is threatened by squally weather / sudden gale." },
  { num: 4, name: "Local Warning Signal No. IV", meaning: "Port is threatened by a cyclonic circulation. Ships must take precautions." },
  { num: 8, name: "Danger Signal No. VIII", meaning: "Severe cyclonic storm expected to cross coast to north/south of the port." },
  { num: 10, name: "Great Danger Signal No. X", meaning: "Severe/Super cyclonic storm expected to cross coast over or very close to the port." },
  { num: 11, name: "Failure of Communication No. XI", meaning: "All communications with the meteorological office have broken down." }
];

/**
 * Classify 24-hr rainfall according to official IMD standards
 */
export function getImdRainfallClassification(rainfallMm) {
  if (!rainfallMm || rainfallMm < 0.1) return { label: "No Rain / Dry", color: "#64748b" };
  for (const cat of IMD_RAINFALL_CATEGORIES) {
    if (rainfallMm >= cat.min && rainfallMm <= cat.max) return cat;
  }
  return IMD_RAINFALL_CATEGORIES[IMD_RAINFALL_CATEGORIES.length - 1];
}

/**
 * Generate official printable IMD Meteorological Bulletin Text / SitRep
 */
export function generateImdOfficialBulletin({ location, weather, alerts, cyclone }) {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });

  return `
================================================================================
           GOVERNMENT OF INDIA / MINISTRY OF EARTH SCIENCES (MoES)
                    INDIA METEOROLOGICAL DEPARTMENT (IMD)
                   NATIONAL WEATHER FORECASTING CENTRE (NWFC)
================================================================================
BULLETIN NO.: IMD/HQ/WX-GPT/2026/08-${Math.floor(1000 + Math.random() * 9000)}
ISSUED AT: ${timeStr}, ${dateStr}
SUBJECT: ALL INDIA DAILY WEATHER & IMPACT-BASED WARNING INFERENCE

1. CHIEF SYNOPTIC FEATURES:
   - A Western Disturbance as a trough in mid-tropospheric westerlies runs along longitudes 70°E to the north of latitude 30°N.
   - Active cyclonic circulation / low pressure area persists over North Bay of Bengal with associated cyclonic shear zone.
   - Strong South-Westerly monsoon surge observed along the West Coast and North-East states.

2. CURRENT OBSERVATIONAL INFERENCE FOR: ${location?.name || "NATIONAL NETWORK"}
   - Surface Temperature: ${weather?.current?.temp || 28}°C (Departure: +0.4°C normal)
   - Apparent Temperature (Feels Like): ${weather?.current?.feelsLike || 30}°C
   - Relative Humidity (08:30 IST): ${weather?.current?.humidity || 65}%
   - Surface Barometric Pressure: ${weather?.current?.pressureHpa || 1012} hPa (MSL)
   - Prevailing Surface Wind: ${weather?.current?.windSpeedKm || 12} km/h from Direction ${weather?.current?.windDirectionDeg || 120}°
   - 24-hr Cumulative Precipitation: ${weather?.current?.precipitationMm || 0} mm (${getImdRainfallClassification(weather?.current?.precipitationMm || 0).label})
   - Air Quality Index (CPCB Standard): ${weather?.aqi?.aqi || 74} (${weather?.aqi?.category || "Satisfactory"})

3. SEVERE WEATHER WARNING MATRIX (COLOR-CODED 5-DAY OUTLOOK):
   [RED ALERT - TAKE ACTION]:
   * Extremely Heavy Rainfall (>204.4 mm) over coastal Odisha, Gangetic West Bengal, and Konkan.
   
   [ORANGE ALERT - BE PREPARED]:
   * Isolated Very Heavy Rainfall (115.6 - 204.4 mm) over Coastal Andhra Pradesh, Assam, and East Rajasthan.
   
   [YELLOW ALERT - BE UPDATED]:
   * Thunderstorm accompanied by lightning and gusty surface winds (30-40 kmph) over Punjab, Haryana, and Delhi NCR.

4. SPECIAL CYCLONE STATUS & TRACKING ADVISORY:
   - System: ${cyclone?.name || "Severe Cyclonic Storm"}
   - Current Intensity: ${cyclone?.intensityScale || "Severe Cyclonic Storm (SCS)"}
   - Max Sustained Surface Wind: ${cyclone?.maxSustainedWindKmph || 110} kmph gusting to ${cyclone?.gustingToKmph || 125} kmph
   - Landfall Forecast: ${cyclone?.landfallForecast?.location || "Odisha-Bengal Coast"} during ${cyclone?.landfallForecast?.expectedTime || "Next 24h"}
   - Fishermen Warning: Total suspension of inshore and offshore fishing operations.

5. ACTIONABLE SECTORAL IMPACT & MITIGATION GUIDANCE:
   - Agriculture (Agromet): Protect standing crops from lodging. Clear drainage channels in paddy/cotton fields.
   - Disaster Management (NDRF/SDMA): Pre-position emergency rescue inflatable boats in low-lying riparian catchments.
   - Power & Telecom: Keep emergency restoration DG sets and repair crews ready on standby.

================================================================================
           ISSUED BY: DUTY METEOROLOGICAL OFFICER, NWFC / RMC NEW DELHI
                  POWERED BY WEATHERGPT (MoES / IMD AI SUITE)
================================================================================
  `.trim();
}
