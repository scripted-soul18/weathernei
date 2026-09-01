import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  Wind, 
  Droplets, 
  Compass, 
  Gauge, 
  SunMedium, 
  Eye, 
  TrendingUp, 
  Sunrise, 
  Sunset,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { getImdRainfallClassification } from '../services/imdAlertService';
import { getTranslation } from '../services/translationService';

// Icon mapper for weather conditions
const getConditionIcon = (iconName, className = "w-6 h-6") => {
  switch (iconName) {
    case "Sun": return <Sun className={`${className} text-amber-400`} />;
    case "SunDim": return <SunMedium className={`${className} text-amber-300`} />;
    case "CloudSun": return <CloudSun className={`${className} text-sky-300`} />;
    case "Cloud": return <Cloud className={`${className} text-slate-300`} />;
    case "CloudDrizzle":
    case "CloudRain": return <CloudRain className={`${className} text-blue-400`} />;
    case "CloudRainWind": return <CloudRain className={`${className} text-cyan-400`} />;
    case "CloudLightning": return <CloudLightning className={`${className} text-yellow-400`} />;
    case "Snowflake": return <Snowflake className={`${className} text-cyan-200`} />;
    case "CloudFog": return <CloudFog className={`${className} text-slate-400`} />;
    default: return <CloudSun className={`${className} text-sky-300`} />;
  }
};

export default function LiveWeatherDashboard({ weatherData, currentLanguage, onAskQuestion }) {
  const t = getTranslation(currentLanguage);
  if (!weatherData) return null;

  const { location, current, aqi, hourly, daily, agromet } = weatherData;
  const rainClass = getImdRainfallClassification(current.precipitationMm || daily[0]?.rainSumMm || 0);

  return (
    <div className="space-y-5">
      {/* Hero Current Weather & Station Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-blue-950/60 border border-slate-700/60 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left: Location & Conditions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live Meteorological Station
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Lat: {location.lat.toFixed(2)}°N, Lon: {location.lon.toFixed(2)}°E • Alt: {location.elevation}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight flex items-center gap-3">
              {location.name}
            </h1>

            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <span className="flex items-center gap-1 font-medium text-cyan-300">
                {getConditionIcon(current.wmo.icon, "w-5 h-5")} {current.wmo.label}
              </span>
              <span>•</span>
              <span>Updated at <strong className="text-white">{current.lastUpdated}</strong></span>
            </div>
          </div>

          {/* Right: Big Temperature Display */}
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="text-5xl sm:text-6xl font-black text-white font-display tracking-tighter flex items-start justify-end">
                <span>{current.temp}</span>
                <span className="text-2xl sm:text-3xl text-cyan-400 font-normal ml-0.5">°C</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                {t.metrics.feelsLike}: <strong className="text-slate-200">{current.feelsLike}°C</strong>
              </div>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 border border-cyan-400/30 flex items-center justify-center p-3 shadow-inner">
              {getConditionIcon(current.wmo.icon, "w-10 h-10 sm:w-12 sm:h-12")}
            </div>
          </div>
        </div>

        {/* Quick Question Prompt Chips Grounded in Current Weather */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Query:
          </span>
          <button
            onClick={() => onAskQuestion(`Will it rain in ${location.name} today? Should I carry an umbrella?`)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-cyan-950/60 text-slate-200 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all shrink-0"
          >
            🌧️ Umbrella / Rain Forecast
          </button>
          <button
            onClick={() => onAskQuestion(`Is it safe to spray pesticides or fertilizers on crops in ${location.name}?`)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-emerald-950/60 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all shrink-0"
          >
            🌾 Farmer Spray Suitability
          </button>
          <button
            onClick={() => onAskQuestion(`What are the active IMD disaster alerts and cyclone updates?`)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-red-950/60 text-slate-200 hover:text-red-300 border border-slate-700 hover:border-red-500/40 transition-all shrink-0"
          >
            🚨 Disaster & Cyclone Alerts
          </button>
          <button
            onClick={() => onAskQuestion(`Explain the air quality index (AQI) and health precautions for ${location.name}.`)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-purple-950/60 text-slate-200 hover:text-purple-300 border border-slate-700 hover:border-purple-500/40 transition-all shrink-0"
          >
            🍃 AQI & Pollution Breakdown
          </button>
        </div>
      </div>

      {/* Grid of Key Synoptic Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1: Air Quality Index */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Air Quality (AQI)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-tech text-white flex items-baseline gap-1.5">
              <span>{aqi.aqi}</span>
              <span className="text-xs px-1.5 py-0.5 rounded font-sans font-medium" style={{ backgroundColor: `${aqi.color}25`, color: aqi.color }}>
                {aqi.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">PM2.5: {aqi.pm2_5} µg/m³</p>
          </div>
        </div>

        {/* Metric 2: Relative Humidity */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.metrics.humidity}</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-tech text-white">
              {current.humidity}<span className="text-base text-slate-400 font-normal">%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Dew Point: <strong className="text-slate-300">{agromet.dewPointC}°C</strong>
            </p>
          </div>
        </div>

        {/* Metric 3: Wind Speed & Direction */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.metrics.wind}</span>
            <Wind className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-tech text-white">
              {current.windSpeedKm}<span className="text-xs text-slate-400 font-normal ml-1">km/h</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" /> Gusts: {current.windGustsKm} km/h
            </p>
          </div>
        </div>

        {/* Metric 4: Barometric Pressure */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.metrics.pressure}</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-tech text-white">
              {current.pressureHpa}<span className="text-xs text-slate-400 font-normal ml-1">hPa</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Mean Sea Level (MSL)</p>
          </div>
        </div>

        {/* Metric 5: Precipitation & Rain Classification */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.metrics.precipitation}</span>
            <CloudRain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-tech text-white">
              {current.precipitationMm}<span className="text-xs text-slate-400 font-normal ml-1">mm</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate" title={rainClass.label}>
              {rainClass.label}
            </p>
          </div>
        </div>

        {/* Metric 6: Cloud Cover & Day Status */}
        <div className="glass-panel rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.metrics.cloudCover}</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-tech text-white">
              {current.cloudCoverPct}<span className="text-base text-slate-400 font-normal">%</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sun: <strong className="text-slate-300">{daily[0]?.sunrise || "06:05"} - {daily[0]?.sunset || "18:45"}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 24-Hour Hourly Forecast Slider */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              24-Hour Synoptic Hourly Forecast
            </h2>
          </div>
          <span className="text-xs text-slate-400">Scroll horizontally ➔</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {hourly.map((h, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-between min-w-[80px] p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all text-center group shrink-0"
            >
              <span className="text-xs font-semibold text-slate-300">{h.time}</span>
              <div className="my-2 transform group-hover:scale-110 transition-transform">
                {getConditionIcon(h.wmo.icon, "w-6 h-6")}
              </div>
              <span className="text-base font-bold font-tech text-white">{h.temp}°C</span>
              
              {/* Rain Probability Pill */}
              <div className="mt-2 flex items-center gap-1 text-[10px] text-blue-300 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900/40">
                <Droplets className="w-2.5 h-2.5 text-blue-400" />
                <span>{h.pop}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Extended Weather Outlook */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              7-Day Extended Meteorological Outlook
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">IMD Ensemble Model</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {daily.map((d, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                idx === 0
                  ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${idx === 0 ? 'text-cyan-300' : 'text-slate-300'}`}>
                  {d.day}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{d.date}</span>
              </div>

              <div className="my-3 flex items-center justify-center">
                {getConditionIcon(d.wmo.icon, "w-8 h-8")}
              </div>

              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-tech font-bold">
                  <span className="text-white">{d.maxTemp}°</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">{d.minTemp}°</span>
                </div>

                <div className="text-[11px] text-slate-400 truncate" title={d.wmo.label}>
                  {d.wmo.label}
                </div>

                {d.rainProb > 0 && (
                  <div className="text-[10px] text-blue-400 font-medium">
                    🌧️ {d.rainProb}% ({d.rainSumMm} mm)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
