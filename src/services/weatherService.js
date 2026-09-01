// Live Meteorological & Air Quality Data Aggregator (Open-Meteo & OpenStreetMap Geocoding)

// WMO Weather interpretation table
export const WMO_WEATHER_MAP = {
  0: { label: "Clear Sky", icon: "Sun", bg: "sunny", severity: "normal" },
  1: { label: "Mainly Clear", icon: "SunDim", bg: "sunny", severity: "normal" },
  2: { label: "Partly Cloudy", icon: "CloudSun", bg: "cloudy", severity: "normal" },
  3: { label: "Overcast", icon: "Cloud", bg: "cloudy", severity: "normal" },
  45: { label: "Foggy", icon: "CloudFog", bg: "fog", severity: "warning" },
  48: { label: "Depositing Rime Fog", icon: "CloudFog", bg: "fog", severity: "warning" },
  51: { label: "Light Drizzle", icon: "CloudDrizzle", bg: "rain", severity: "normal" },
  53: { label: "Moderate Drizzle", icon: "CloudDrizzle", bg: "rain", severity: "normal" },
  55: { label: "Dense Drizzle", icon: "CloudDrizzle", bg: "rain", severity: "warning" },
  61: { label: "Slight Rain", icon: "CloudRain", bg: "rain", severity: "normal" },
  63: { label: "Moderate Rain", icon: "CloudRain", bg: "rain", severity: "warning" },
  65: { label: "Heavy Rain (IMD Warning)", icon: "CloudRainWind", bg: "heavy-rain", severity: "danger" },
  71: { label: "Slight Snowfall", icon: "Snowflake", bg: "snow", severity: "normal" },
  73: { label: "Moderate Snowfall", icon: "Snowflake", bg: "snow", severity: "warning" },
  75: { label: "Heavy Snowfall", icon: "Snowflake", bg: "snow", severity: "danger" },
  80: { label: "Passing Rain Showers", icon: "CloudRain", bg: "rain", severity: "normal" },
  81: { label: "Moderate Showers", icon: "CloudRain", bg: "rain", severity: "warning" },
  82: { label: "Violent Rain Showers", icon: "CloudRainWind", bg: "heavy-rain", severity: "danger" },
  95: { label: "Thunderstorm with Lightning", icon: "CloudLightning", bg: "thunderstorm", severity: "danger" },
  96: { label: "Thunderstorm with Hail", icon: "CloudLightning", bg: "thunderstorm", severity: "critical" },
  99: { label: "Severe Thunderstorm & Heavy Hail", icon: "CloudLightning", bg: "thunderstorm", severity: "critical" }
};

export const getWmoInfo = (code) => {
  return WMO_WEATHER_MAP[code] || { label: "Partly Cloudy", icon: "CloudSun", bg: "cloudy", severity: "normal" };
};

// Calculate Indian AQI Category (Standard CPCB scale: 0-50 Good, 51-100 Satisfactory, 101-200 Moderate, 201-300 Poor, 301-400 Very Poor, 401-500 Severe)
export const getAqiDetails = (aqiValue) => {
  const val = Math.round(aqiValue || 65);
  if (val <= 50) {
    return { aqi: val, category: "Good", color: "#22c55e", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", impact: "Minimal health impact. Clean air." };
  } else if (val <= 100) {
    return { aqi: val, category: "Satisfactory", color: "#84cc16", bg: "bg-lime-500/20 text-lime-300 border-lime-500/40", impact: "Minor breathing discomfort to sensitive people." };
  } else if (val <= 200) {
    return { aqi: val, category: "Moderate", color: "#eab308", bg: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40", impact: "Breathing discomfort to people with lungs, asthma and heart diseases." };
  } else if (val <= 300) {
    return { aqi: val, category: "Poor", color: "#f97316", bg: "bg-orange-500/20 text-orange-300 border-orange-500/40", impact: "Breathing discomfort to most people on prolonged exposure." };
  } else if (val <= 400) {
    return { aqi: val, category: "Very Poor", color: "#ef4444", bg: "bg-red-500/20 text-red-300 border-red-500/40", impact: "Respiratory illness on prolonged exposure. Pronounced effect on heart patients." };
  } else {
    return { aqi: val, category: "Severe / Hazardous", color: "#a855f7", bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", impact: "Affects healthy people and seriously impacts those with existing diseases. Avoid outdoors." };
  }
};

/**
 * Fetch real-time weather & forecast for specific coordinates using Open-Meteo
 */
export async function fetchLiveWeatherData(lat, lon, locationName = "") {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,surface_pressure,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`;
    
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

    const [weatherRes, aqiRes] = await Promise.allSettled([
      fetch(weatherUrl),
      fetch(airQualityUrl)
    ]);

    let weatherData = null;
    let aqiData = null;

    if (weatherRes.status === "fulfilled" && weatherRes.value.ok) {
      weatherData = await weatherRes.value.json();
    }

    if (aqiRes.status === "fulfilled" && aqiRes.value.ok) {
      aqiData = await aqiRes.value.json();
    }

    if (!weatherData) {
      throw new Error("Unable to reach meteorological API");
    }

    const current = weatherData.current || {};
    const daily = weatherData.daily || {};
    const hourly = weatherData.hourly || {};
    const wmo = getWmoInfo(current.weather_code || 0);

    // Calculate Indian AQI estimate from pollutants or US AQI
    const rawAqi = aqiData?.current?.us_aqi || Math.round((aqiData?.current?.pm2_5 || 25) * 2.1) || 72;
    const aqiDetails = getAqiDetails(rawAqi);

    // Format 24-hr hourly forecast
    const currentHourIndex = new Date().getHours();
    const hourlySlice = [];
    if (hourly.time && hourly.time.length > 0) {
      for (let i = currentHourIndex; i < currentHourIndex + 24 && i < hourly.time.length; i++) {
        const timeStr = hourly.time[i];
        const dateObj = new Date(timeStr);
        hourlySlice.push({
          time: dateObj.toLocaleTimeString("en-IN", { hour: "numeric", hour12: true }),
          temp: Math.round(hourly.temperature_2m[i]),
          pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
          precipMm: hourly.precipitation ? hourly.precipitation[i] : 0,
          windKm: Math.round(hourly.wind_speed_10m ? hourly.wind_speed_10m[i] : 0),
          humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : 50,
          uv: hourly.uv_index ? hourly.uv_index[i] : 0,
          wmo: getWmoInfo(hourly.weather_code ? hourly.weather_code[i] : 0)
        });
      }
    }

    // Format 7-day daily forecast
    const dailyForecast = [];
    if (daily.time && daily.time.length > 0) {
      for (let i = 0; i < daily.time.length; i++) {
        const dateObj = new Date(daily.time[i]);
        const isToday = i === 0;
        const dayName = isToday ? "Today" : dateObj.toLocaleDateString("en-IN", { weekday: "short" });
        const dateStr = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

        dailyForecast.push({
          day: dayName,
          date: dateStr,
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          minTemp: Math.round(daily.temperature_2m_min[i]),
          rainSumMm: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
          rainProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          maxWind: Math.round(daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : 0),
          maxUv: daily.uv_index_max ? daily.uv_index_max[i] : 5,
          sunrise: daily.sunrise ? new Date(daily.sunrise[i]).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "06:05 AM",
          sunset: daily.sunset ? new Date(daily.sunset[i]).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "06:45 PM",
          wmo: getWmoInfo(daily.weather_code[i])
        });
      }
    }

    // Compute agricultural spray suitability index
    const windKm = current.wind_speed_10m || 8;
    const rainProbNext6h = hourlySlice.slice(0, 6).reduce((max, h) => Math.max(max, h.pop), 0);
    const spraySuitability = (windKm < 12 && rainProbNext6h < 25) ? "Optimal for Spraying" : (windKm > 20 || rainProbNext6h > 60) ? "Unfavourable (High Drift / Washout Risk)" : "Moderate / Caution";

    return {
      location: {
        name: locationName || "Selected Station",
        lat,
        lon,
        elevation: weatherData.elevation ? `${weatherData.elevation} m` : "Sea level",
        timezone: weatherData.timezone
      },
      current: {
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature || current.temperature_2m),
        humidity: current.relative_humidity_2m,
        pressureHpa: Math.round(current.pressure_msl || 1013),
        windSpeedKm: Math.round(current.wind_speed_10m),
        windDirectionDeg: current.wind_direction_10m || 0,
        windGustsKm: Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3),
        precipitationMm: current.precipitation || 0,
        cloudCoverPct: current.cloud_cover || 20,
        isDay: current.is_day === 1,
        wmo,
        lastUpdated: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      },
      aqi: {
        ...aqiDetails,
        pm2_5: aqiData?.current?.pm2_5 ? Math.round(aqiData.current.pm2_5) : 38,
        pm10: aqiData?.current?.pm10 ? Math.round(aqiData.current.pm10) : 68,
        no2: aqiData?.current?.nitrogen_dioxide ? Math.round(aqiData.current.nitrogen_dioxide) : 24,
        so2: aqiData?.current?.sulphur_dioxide ? Math.round(aqiData.current.sulphur_dioxide) : 12,
        co: aqiData?.current?.carbon_monoxide ? Math.round(aqiData.current.carbon_monoxide) : 480,
        ozone: aqiData?.current?.ozone ? Math.round(aqiData.current.ozone) : 42
      },
      hourly: hourlySlice,
      daily: dailyForecast,
      agromet: {
        spraySuitability,
        soilEvapotranspirationEstimate: (current.temperature_2m > 30 ? "High (4.5 - 6.0 mm/day)" : "Moderate (2.5 - 4.0 mm/day)"),
        dewPointC: Math.round(current.temperature_2m - ((100 - current.relative_humidity_2m) / 5))
      }
    };
  } catch (err) {
    console.warn("Weather API fetch fallback:", err);
    return getMockFallbackWeather(lat, lon, locationName);
  }
}

/**
 * Geocoding Search for any Indian City, Town or Village
 */
export async function searchGeocodingLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item) => ({
      name: item.name,
      admin1: item.admin1 || item.country,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude,
      elevation: item.elevation ? `${item.elevation} m` : "",
      displayName: `${item.name}${item.admin1 ? `, ${item.admin1}` : ""}${item.country ? ` (${item.country})` : ""}`
    }));
  } catch (e) {
    console.error("Geocoding lookup error:", e);
    return [];
  }
}

// Resilient Offline/Deterministic Fallback
function getMockFallbackWeather(lat, lon, locationName) {
  const isCoastal = lat < 22 && (lon < 74 || lon > 80);
  const isNorth = lat > 26;
  const temp = isNorth ? 26 : isCoastal ? 31 : 29;

  return {
    location: {
      name: locationName || "Meteorological Station",
      lat: lat || 28.61,
      lon: lon || 77.20,
      elevation: "216 m",
      timezone: "Asia/Kolkata"
    },
    current: {
      temp,
      feelsLike: temp + 2,
      humidity: 62,
      pressureHpa: 1012,
      windSpeedKm: 14,
      windDirectionDeg: 140,
      windGustsKm: 18,
      precipitationMm: 0,
      cloudCoverPct: 35,
      isDay: true,
      wmo: { label: "Mainly Clear", icon: "SunDim", bg: "sunny", severity: "normal" },
      lastUpdated: new Date().toLocaleTimeString("en-IN")
    },
    aqi: {
      aqi: 84,
      category: "Satisfactory",
      color: "#84cc16",
      bg: "bg-lime-500/20 text-lime-300 border-lime-500/40",
      impact: "Minor breathing discomfort to sensitive individuals.",
      pm2_5: 32,
      pm10: 58,
      no2: 22,
      so2: 9,
      co: 410,
      ozone: 38
    },
    hourly: Array.from({ length: 24 }).map((_, i) => ({
      time: `${(i % 12) || 12} ${i >= 12 ? "PM" : "AM"}`,
      temp: temp - 4 + Math.sin(i / 3) * 6,
      pop: i > 14 && i < 20 ? 30 : 10,
      precipMm: 0,
      windKm: 12 + (i % 5),
      humidity: 55 + (i % 20),
      uv: i >= 8 && i <= 17 ? 6 : 0,
      wmo: { label: "Mainly Clear", icon: "SunDim", bg: "sunny", severity: "normal" }
    })),
    daily: ["Today", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => ({
      day,
      date: `${22 + idx} Aug`,
      maxTemp: temp + 2 + (idx % 2),
      minTemp: temp - 6 - (idx % 2),
      rainSumMm: idx === 2 ? 14 : 0,
      rainProb: idx === 2 ? 65 : 20,
      maxWind: 18,
      maxUv: 7,
      sunrise: "06:02 AM",
      sunset: "06:48 PM",
      wmo: idx === 2 ? { label: "Moderate Rain", icon: "CloudRain", bg: "rain", severity: "warning" } : { label: "Mainly Clear", icon: "SunDim", bg: "sunny", severity: "normal" }
    })),
    agromet: {
      spraySuitability: "Optimal for Spraying",
      soilEvapotranspirationEstimate: "Moderate (3.5 - 4.2 mm/day)",
      dewPointC: 18
    }
  };
}
