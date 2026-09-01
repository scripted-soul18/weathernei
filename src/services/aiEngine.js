// WeatherGPT Conversational AI Engine (MoES / IMD Intelligence Suite)
import { getImdRainfallClassification } from './imdAlertService';
import { CROPS_DATA } from '../data/cropData';
import { ACTIVE_DISTRICT_ALERTS, ACTIVE_CYCLONE_SIMULATION } from '../data/imdAlertsData';

/**
 * Main query processor for WeatherGPT
 */
export async function processWeatherGptQuery({
  query,
  persona = "citizen",
  language = "en",
  weatherData,
  conversationHistory = [],
  apiKey = ""
}) {
  const cleanQuery = (query || "").trim();
  const lowerQuery = cleanQuery.toLowerCase();

  // If user provided a Gemini API Key, try calling Gemini with our structured system prompt
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiResponse = await callGeminiApi({
        apiKey,
        query: cleanQuery,
        persona,
        language,
        weatherData,
        conversationHistory
      });
      if (geminiResponse) return geminiResponse;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to WeatherGPT Built-in Meteorological Engine:", err);
    }
  }

  // Built-in Deterministic Meteorological AI Intelligence Engine
  return generateDeterministicIntelligence({
    query: lowerQuery,
    originalQuery: cleanQuery,
    persona,
    language,
    weatherData
  });
}

/**
 * Deterministic Meteorological AI Reasoning Engine
 */
function generateDeterministicIntelligence({
  query,
  originalQuery,
  persona,
  language,
  weatherData
}) {
  const loc = weatherData?.location?.name || "the selected region";
  const temp = weatherData?.current?.temp ?? 28;
  const feelsLike = weatherData?.current?.feelsLike ?? 30;
  const humidity = weatherData?.current?.humidity ?? 65;
  const windKm = weatherData?.current?.windSpeedKm ?? 12;
  const condition = weatherData?.current?.wmo?.label || "Partly Cloudy";
  const rainProb = weatherData?.daily?.[0]?.rainProb ?? 20;
  const rainSum = weatherData?.daily?.[0]?.rainSumMm ?? 0;
  const aqiVal = weatherData?.aqi?.aqi ?? 75;
  const aqiCat = weatherData?.aqi?.category ?? "Satisfactory";
  const isHindi = language === "hi";
  const isMarathi = language === "mr";
  const isBengali = language === "bn";
  const isTamil = language === "ta";
  const isTelugu = language === "te";

  // Intent 1: Rain / Umbrella / Precipitation
  if (
    query.includes("rain") ||
    query.includes("umbrella") ||
    query.includes("बारिश") ||
    query.includes("छाता") ||
    query.includes("वर्षा") ||
    query.includes("पाऊस") ||
    query.includes("বৃষ্টি") ||
    query.includes("மழை") ||
    query.includes("వర్షం")
  ) {
    const isRainy = rainProb > 40 || rainSum > 2 || condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("shower");
    
    if (isHindi) {
      return {
        text: `### 🌧️ **${loc} के लिए वर्षा पूर्वानुमान एवं विश्लेषण**\n\n` +
          `* **वर्तमान मौसम:** ${condition} (${temp}°C, नमी: ${humidity}%)\n` +
          `* **आज वर्षा की संभावना:** **${rainProb}%**\n` +
          `* **अपेक्षित वर्षा की मात्रा:** ${rainSum > 0 ? rainSum + " मिमी (" + getImdRainfallClassification(rainSum).label + ")" : "हल्की बूंदाबांदी अथवा शुष्क"}\n\n` +
          (isRainy
            ? `> ☔ **परामर्श:** आज बारिश की प्रबल संभावना है! **घर से बाहर निकलते समय छाता अथवा रेनकोट अवश्य साथ रखें।** निचले इलाकों में जलभराव से सावधान रहें।`
            : `> ☀️ **परामर्श:** आज भारी बारिश की संभावना कम है (${rainProb}%)। मौसम मुख्यतः सुहाना रहेगा, छाते की तत्काल आवश्यकता नहीं है।`),
        category: "rain_forecast",
        recommendation: isRainy ? "Carry Umbrella / Raincoat" : "No Umbrella Needed",
        metrics: { temp, rainProb, rainSum, humidity }
      };
    }

    return {
      text: `### 🌧️ **Precipitation Analysis for ${loc}**\n\n` +
        `* **Current Observation:** ${condition} at **${temp}°C** (Feels like **${feelsLike}°C**, Humidity: **${humidity}%**)\n` +
        `* **Rain Probability Today:** **${rainProb}%**\n` +
        `* **24-hr Expected Rainfall:** **${rainSum > 0 ? rainSum + ' mm (' + getImdRainfallClassification(rainSum).label + ')' : '0.0 mm / Negligible'}**\n\n` +
        (isRainy
          ? `> ☔ **IMD Actionable Advisory:** There is a high probability of precipitation (**${rainProb}%**). **You are strongly advised to carry an umbrella or raincoat** when heading outdoors. Watch out for momentary traffic slow-downs in low-lying transit corridors.`
          : `> 🌤️ **IMD Advisory:** Precipitation probability is low (**${rainProb}%**). Clear to partly cloudy skies expected. No heavy rainfall disruption anticipated for today.`),
      category: "rain_forecast",
      recommendation: isRainy ? "Carry Umbrella / Raincoat" : "No Umbrella Needed",
      metrics: { temp, rainProb, rainSum, humidity }
    };
  }

  // Intent 2: Agricultural / Spraying / Kisan Agromet Query
  if (
    persona === "kisan" ||
    query.includes("spray") ||
    query.includes("pesticide") ||
    query.includes("fertilizer") ||
    query.includes("crop") ||
    query.includes("wheat") ||
    query.includes("paddy") ||
    query.includes("cotton") ||
    query.includes("कीटनाशक") ||
    query.includes("छिड़काव") ||
    query.includes("फसल") ||
    query.includes("गेहूं") ||
    query.includes("धान") ||
    query.includes("यूरिया")
  ) {
    const spraySafe = windKm <= 14 && rainProb <= 25;
    const sprayStatus = spraySafe ? "✅ SUITABLE FOR SPRAYING" : "⚠️ DEFER / NOT RECOMMENDED";
    
    if (isHindi) {
      return {
        text: `### 🌾 **कृषि मौसम (Agromet) एवं कीटनाशक छिड़काव परामर्श: ${loc}**\n\n` +
          `* **हवा की गति:** ${windKm} किमी/घंटा ${windKm > 14 ? '(तेज हवा - घोल उड़ने का जोखिम)' : '(अनुकूल)'}\n` +
          `* **वर्षा संभावना (अगले 24 घंटे):** ${rainProb}%\n` +
          `* **तापमान एवं नमी:** ${temp}°C | ${humidity}%\n` +
          `* **छिड़काव स्थिति:** **${sprayStatus}**\n\n` +
          (spraySafe
            ? `> 🌾 **किसान भाइयों के लिए सुझाव:** मौसम रसायन छिड़काव और यूरिया की टॉप-ड्रेसिंग के लिए पूरी तरह अनुकूल है। सुबह 08:00 से 11:00 बजे या शाम 04:00 के बाद छिड़काव करें।`
            : `> ⚠️ **चेतावनी:** तेज हवाओं अथवा वर्षा की संभावना (${rainProb}%) के कारण कीटनाशक या खरपतवारनाशक का छिड़काव स्थगित रखें, अन्यथा दवा बह जाने और आर्थिक नुकसान की संभावना है।`),
        category: "agromet_advisory",
        recommendation: sprayStatus,
        metrics: { temp, windKm, humidity, rainProb }
      };
    }

    return {
      text: `### 🌾 **Agromet Crop & Pesticide Spraying Advisory: ${loc}**\n\n` +
        `* **Surface Wind Velocity:** **${windKm} km/h** ${windKm > 14 ? '(High drift risk)' : '(Optimal < 15 km/h)'}\n` +
        `* **Rain Probability Window:** **${rainProb}%**\n` +
        `* **Temperature & Relative Humidity:** **${temp}°C** | **${humidity}%**\n` +
        `* **Pesticide Spray Window Status:** **${sprayStatus}**\n\n` +
        (spraySafe
          ? `> ✅ **Meghdoot Agromet Advisory:** Current atmospheric conditions are **ideal for foliar spraying of insecticides, fungicides, and micronutrients**. Optimal application hours: 08:00 AM – 11:00 AM or post 04:30 PM.`
          : `> 🛑 **IMD Agromet Advisory:** **Postpone chemical spraying and foliar feeding.** Higher wind speeds (>14 km/h) or precipitation probability (${rainProb}%) will cause chemical runoff, uneven spray drift, and crop leaf scorch. Ensure drainage channels are clear.`),
      category: "agromet_advisory",
      recommendation: sprayStatus,
      metrics: { temp, windKm, humidity, rainProb }
    };
  }

  // Intent 3: Disaster Management / Cyclone / Extreme Warning
  if (
    persona === "disaster" ||
    query.includes("alert") ||
    query.includes("warning") ||
    query.includes("cyclone") ||
    query.includes("flood") ||
    query.includes("red alert") ||
    query.includes("orange alert") ||
    query.includes("आपदा") ||
    query.includes("चेतावनी") ||
    query.includes("चक्रवात") ||
    query.includes("बाढ़") ||
    query.includes("रेड अलर्ट")
  ) {
    const alertsCount = ACTIVE_DISTRICT_ALERTS.length;
    const redAlerts = ACTIVE_DISTRICT_ALERTS.filter(a => a.level === "RED");
    const orangeAlerts = ACTIVE_DISTRICT_ALERTS.filter(a => a.level === "ORANGE");

    if (isHindi) {
      return {
        text: `### 🚨 **राष्ट्रीय आपदा एवं आईएमडी चेतावनी बुलेटिन**\n\n` +
          `* **सक्रिय चेतावनी जिले:** कुल **${alertsCount}** जिले अलर्ट पर हैं।\n` +
          `* **रेड अलर्ट (तत्काल कार्रवाई):** ${redAlerts.map(a => a.district + " (" + a.state + ")").join(", ")}\n` +
          `* **ऑरेंज अलर्ट (तैयार रहें):** ${orangeAlerts.map(a => a.district + " (" + a.state + ")").join(", ")}\n\n` +
          `> 🌀 **सक्रिय चक्रवात बुलेटिन:** *${ACTIVE_CYCLONE_SIMULATION.name}* (${ACTIVE_CYCLONE_SIMULATION.intensityScale})\n` +
          `> * **स्थान:** ${ACTIVE_CYCLONE_SIMULATION.currentLocation.distanceFromCoast}\n` +
          `> * **हवा की गति:** ${ACTIVE_CYCLONE_SIMULATION.maxSustainedWindKmph} किमी/घंटा (झोंके: ${ACTIVE_CYCLONE_SIMULATION.gustingToKmph} किमी/घंटा)\n` +
          `> * **लैंडफॉल अनुमान:** ${ACTIVE_CYCLONE_SIMULATION.landfallForecast.location} (${ACTIVE_CYCLONE_SIMULATION.landfallForecast.expectedTime})\n\n` +
          `> ⚠️ **एसडीएमए / एनडीआरएफ निर्देश:** तटीय क्षेत्रों में नौका संचालन पूर्णतः बंद रखें एवं निचले बाढ़ संभावित क्षेत्रों से सुरक्षित स्थानों पर विस्थापन सुनिश्चित करें।`,
        category: "disaster_alert",
        recommendation: "Deploy NDRF / Pre-position SDRF Teams",
        metrics: { activeAlerts: alertsCount, redCount: redAlerts.length, cycloneSpeed: ACTIVE_CYCLONE_SIMULATION.maxSustainedWindKmph }
      };
    }

    return {
      text: `### 🚨 **IMD National Early Warning & Disaster Alert Matrix**\n\n` +
        `* **Active Warning Districts:** **${alertsCount} Districts** under active meteorological surveillance.\n` +
        `* 🔴 **RED ALERT Districts (Take Immediate Action):** ${redAlerts.map(a => `**${a.district}** (${a.state} - *${a.event}*)`).join("; ")}\n` +
        `* 🟠 **ORANGE ALERT Districts (Be Prepared):** ${orangeAlerts.map(a => `**${a.district}** (${a.state})`).join(", ")}\n\n` +
        `### 🌀 **Active Cyclone Surveillance: ${ACTIVE_CYCLONE_SIMULATION.name}**\n` +
        `* **Current Position:** ${ACTIVE_CYCLONE_SIMULATION.currentLocation.distanceFromCoast} (Lat ${ACTIVE_CYCLONE_SIMULATION.currentLocation.lat}°N, Lon ${ACTIVE_CYCLONE_SIMULATION.currentLocation.lon}°E)\n` +
        `* **Maximum Sustained Winds:** **${ACTIVE_CYCLONE_SIMULATION.maxSustainedWindKmph} km/h** gusting to **${ACTIVE_CYCLONE_SIMULATION.gustingToKmph} km/h** (Pressure: **${ACTIVE_CYCLONE_SIMULATION.centralPressureHpa} hPa**)\n` +
        `* **Expected Landfall:** Crossing near **${ACTIVE_CYCLONE_SIMULATION.landfallForecast.location}** during **${ACTIVE_CYCLONE_SIMULATION.landfallForecast.expectedTime}**\n` +
        `* **Storm Surge Threat:** **${ACTIVE_CYCLONE_SIMULATION.landfallForecast.stormSurgeMeters}**\n\n` +
        `> 🛡️ **NDRF / SDMA Action Directives:** Evacuation of low-lying settlements within 5 km of shoreline. Total ban on inshore/offshore marine operations. Disseminate SMS broadcasts via Common Alerting Protocol (CAP).`,
      category: "disaster_alert",
      recommendation: "Deploy Emergency Response Teams",
      metrics: { activeAlerts: alertsCount, redCount: redAlerts.length, cycloneSpeed: ACTIVE_CYCLONE_SIMULATION.maxSustainedWindKmph }
    };
  }

  // Intent 4: Fisherfolk & Marine Weather
  if (
    persona === "marine" ||
    query.includes("sea") ||
    query.includes("boat") ||
    query.includes("fish") ||
    query.includes("wave") ||
    query.includes("port") ||
    query.includes("coastal") ||
    query.includes("समुद्र") ||
    query.includes("मछुआरे") ||
    query.includes("लहरें") ||
    query.includes("बंदरगाह")
  ) {
    const waveHeightM = (windKm * 0.12 + 0.6).toFixed(1);
    const seaState = windKm > 40 ? "Very Rough to High" : windKm > 25 ? "Rough" : windKm > 15 ? "Moderate" : "Smooth to Slight";
    const isSafe = windKm < 30;

    return {
      text: `### 🌊 **Coastal & Marine Fishermen Weather Bulletin: ${loc}**\n\n` +
        `* **Sea State:** **${seaState}**\n` +
        `* **Significant Wave Height:** **${waveHeightM} meters**\n` +
        `* **Offshore Surface Wind:** **${windKm} km/h (${Math.round(windKm * 0.54)} Knots)**\n` +
        `* **Active Port Warning Signal:** Signal No. III (Local Cautionary Signal hoisted at major regional docks)\n\n` +
        (isSafe
          ? `> ⛵ **Advisory for Fishermen:** Sea conditions remain generally suitable for coastal fishing within 12 nautical miles. Maintain VHF Channel 16 monitoring.`
          : `> 🛑 **CRITICAL DANGER ADVISORY:** **Fishermen are strictly advised NOT to venture into deep sea or coastal waters.** Squally wind speeds reaching 45-55 kmph with turbulent swells anticipated. Vessels at sea must return to nearest safe harbor immediately.`),
      category: "marine_bulletin",
      recommendation: isSafe ? "Safe for Inshore Fishing" : "STRICT BAN - DO NOT VENTURE INTO SEA",
      metrics: { waveHeightM, windKnots: Math.round(windKm * 0.54), seaState }
    };
  }

  // Intent 5: Air Quality (AQI) & Health
  if (
    query.includes("aqi") ||
    query.includes("air") ||
    query.includes("pollution") ||
    query.includes("smog") ||
    query.includes("हवा") ||
    query.includes("प्रदूषण") ||
    query.includes("धुआं")
  ) {
    return {
      text: `### 🍃 **Air Quality Index (AQI) & Health Advisory for ${loc}**\n\n` +
        `* **National AQI:** **${aqiVal}** (${aqiCat})\n` +
        `* **Key Pollutant (PM2.5):** **${weatherData?.aqi?.pm2_5 || 32} µg/m³**\n` +
        `* **Coarse Particulate (PM10):** **${weatherData?.aqi?.pm10 || 64} µg/m³**\n` +
        `* **Nitrogen Dioxide (NO2):** **${weatherData?.aqi?.no2 || 22} µg/m³**\n\n` +
        `> 🩺 **Health Guidance:** ${weatherData?.aqi?.impact || "Air quality is acceptable. Enjoy normal outdoor activities."}\n` +
        (aqiVal > 200
          ? `> 😷 **Precaution:** Wear N95 masks during outdoor workouts, particularly during early morning hours.`
          : `> ✅ Air quality is suitable for regular outdoor sports and morning walks.`),
      category: "aqi_analytics",
      recommendation: aqiCat,
      metrics: { aqi: aqiVal, pm2_5: weatherData?.aqi?.pm2_5, pm10: weatherData?.aqi?.pm10 }
    };
  }

  // Default: Comprehensive 360-degree Meteorological Synthesis
  if (isHindi) {
    return {
      text: `### 🌤️ **${loc} मौसम विश्लेषण एवं सारांश**\n\n` +
        `* **वर्तमान तापमान:** **${temp}°C** (महसूस: **${feelsLike}°C**)\n` +
        `* **मौसम की स्थिति:** **${condition}**\n` +
        `* **हवा की गति:** **${windKm} किमी/घंटा** (दिशा: ${weatherData?.current?.windDirectionDeg || 110}°)\n` +
        `* **आर्द्रता (नमी):** **${humidity}%** | **वायुदाब:** **${weatherData?.current?.pressureHpa || 1013} hPa**\n` +
        `* **वर्षा की संभावना:** **${rainProb}%**\n` +
        `* **वायु गुणवत्ता (AQI):** **${aqiVal} (${aqiCat})**\n\n` +
        `> 💡 **वेदर जीपीटी सुझाव:** मौसम की स्थिति सामान्य है। यदि आप यात्रा या आउटडोर योजना बना रहे हैं, तो दोपहर के समय पर्याप्त पानी पिएं एवं धूप से बचाव करें।`,
      category: "general_weather",
      recommendation: "Normal weather conditions",
      metrics: { temp, feelsLike, humidity, windKm, aqi: aqiVal, rainProb }
    };
  }

  return {
    text: `### 🌤️ **Meteorological Intelligence Summary for ${loc}**\n\n` +
      `* **Surface Temperature:** **${temp}°C** (Feels like **${feelsLike}°C**)\n` +
      `* **Synoptic Condition:** **${condition}**\n` +
      `* **Relative Humidity:** **${humidity}%** | **Barometric Pressure:** **${weatherData?.current?.pressureHpa || 1012} hPa**\n` +
      `* **Surface Wind:** **${windKm} km/h** with gusts up to **${weatherData?.current?.windGustsKm || windKm * 1.3} km/h**\n` +
      `* **Rainfall Probability Today:** **${rainProb}%** (${rainSum > 0 ? rainSum + " mm expected" : "Negligible rain"})\n` +
      `* **Air Quality Index:** **${aqiVal} - ${aqiCat}**\n\n` +
      `> ℹ️ **WeatherGPT Decision Support:** Synoptic conditions are steady across the district. No severe thermal or convective hazards active for the next 12 hours.`,
    category: "general_weather",
    recommendation: "Normal day-to-day weather parameters",
    metrics: { temp, feelsLike, humidity, windKm, aqi: aqiVal, rainProb }
  };
}

/**
 * Optional Gemini API caller
 */
async function callGeminiApi({
  apiKey,
  query,
  persona,
  language,
  weatherData,
  conversationHistory
}) {
  const systemPrompt = `You are WeatherGPT, an expert AI meteorological conversational assistant developed for the Ministry of Earth Sciences (MoES) and the India Meteorological Department (IMD).
You provide accurate, scientific, actionable, and contextual weather forecasts, severe disaster warnings (cyclones, heavy rain, heatwaves), and Agromet crop advisories in natural language.
Current Persona Mode: ${persona}
Current User Selected Language: ${language}
Real-Time Ground Truth Weather Data:
${JSON.stringify(weatherData, null, 2)}
Active IMD Alerts:
${JSON.stringify(ACTIVE_DISTRICT_ALERTS, null, 2)}
Active Cyclone Tracking:
${JSON.stringify(ACTIVE_CYCLONE_SIMULATION, null, 2)}

Provide clear, helpful, markdown-formatted responses with bullet points, alerts, and tailored recommendations.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: `${systemPrompt}\n\nUser Question: ${query}` }
          ]
        }
      ]
    })
  });

  if (!res.ok) throw new Error(`Gemini API returned status ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty candidate returned by Gemini");

  return {
    text,
    category: "gemini_reasoned",
    recommendation: "AI Grounded Response",
    metrics: {
      temp: weatherData?.current?.temp,
      aqi: weatherData?.aqi?.aqi
    }
  };
}
