import React, { useState } from 'react';
import { 
  Sprout, 
  Droplets, 
  Wind, 
  Sun, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  HelpCircle
} from 'lucide-react';
import { CROPS_DATA } from '../data/cropData';

export default function AgrometAdvisory({ weatherData, onAskAgrometQuestion }) {
  const [selectedCropId, setSelectedCropId] = useState("wheat");

  if (!weatherData) return null;
  const { location, current, hourly, agromet } = weatherData;
  const selectedCrop = CROPS_DATA.find(c => c.id === selectedCropId) || CROPS_DATA[0];

  // Dynamic Spray Suitability Evaluation
  const windKm = current.windSpeedKm || 10;
  const rainProbNext6h = hourly?.slice(0, 6).reduce((max, h) => Math.max(max, h.pop), 0) || 10;
  const temp = current.temp || 26;

  const isWindOk = windKm <= selectedCrop.pesticideSprayConditions.maxWindSpeedKm;
  const isRainOk = rainProbNext6h <= selectedCrop.pesticideSprayConditions.maxRainProbPct;
  const isTempOk = temp >= selectedCrop.pesticideSprayConditions.minTemp && temp <= selectedCrop.pesticideSprayConditions.maxTemp;

  const isOptimal = isWindOk && isRainOk && isTempOk;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sprout className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                National Agromet Advisory Service (Meghdoot / IMD Portal)
              </h2>
              <p className="text-xs text-slate-400">
                Weather-based crop decision support for <strong>{location.name}</strong> ({location.agroZone || "Agro-Climatic Zone"})
              </p>
            </div>
          </div>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {CROPS_DATA.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCropId(crop.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCropId === crop.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 border border-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {crop.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Real-time Spraying Suitability Gauge */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" /> Chemical Spraying Window
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isOptimal ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isOptimal ? "OPTIMAL" : "CAUTION / DEFER"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 mt-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span>Wind Velocity (&lt; {selectedCrop.pesticideSprayConditions.maxWindSpeedKm} km/h)</span>
                <span className="font-tech font-bold flex items-center gap-1">
                  {windKm} km/h {isWindOk ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span>Rain Chance next 6h (&lt; {selectedCrop.pesticideSprayConditions.maxRainProbPct}%)</span>
                <span className="font-tech font-bold flex items-center gap-1">
                  {rainProbNext6h}% {isRainOk ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span>Ambient Temperature ({selectedCrop.pesticideSprayConditions.minTemp}-{selectedCrop.pesticideSprayConditions.maxTemp}°C)</span>
                <span className="font-tech font-bold flex items-center gap-1">
                  {temp}°C {isTempOk ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onAskAgrometQuestion(`Can I spray insecticide on ${selectedCrop.name} in ${location.name} tomorrow?`)}
            className="mt-4 w-full py-2 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all text-center"
          >
            Ask WeatherGPT Spray Guidance ➔
          </button>
        </div>

        {/* Card 2: Soil & Evapotranspiration Indices */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display mb-3 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" /> Soil Moisture & Evapotranspiration
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400">Daily Potential Evapotranspiration (PET)</span>
                <div className="text-lg font-bold font-tech text-white">{agromet.soilEvapotranspirationEstimate}</div>
                <p className="text-[10px] text-slate-400">Determines crop water consumption rate</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400">Calculated Atmospheric Dew Point</span>
                <div className="text-lg font-bold font-tech text-white">{agromet.dewPointC}°C</div>
                <p className="text-[10px] text-slate-400">Condensation onset for leaf surface wetness</p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 mt-2">
            💡 <strong>Irrigation Tip:</strong> Apply light irrigation during early morning or late evening hours to minimize evaporative loss.
          </div>
        </div>

        {/* Card 3: Crop-Specific Vulnerabilities & Alerts */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Weather Risks & Crop Vulnerability
            </h3>

            <div className="space-y-2 text-xs">
              {selectedCrop.weatherRisks.map((risk, rIdx) => (
                <div key={rIdx} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-slate-300">
                  <div className="font-semibold text-amber-300">{risk.condition}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{risk.impact}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ideal Temperature: <strong>{selectedCrop.tempOpt.ideal}°C</strong></span>
            <span>Season: <strong>{selectedCrop.season}</strong></span>
          </div>
        </div>
      </div>

      {/* Critical Growth Stages Progress */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60">
        <h3 className="text-sm font-bold text-white font-display mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" /> Critical Phenological Stages for {selectedCrop.name}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {selectedCrop.criticalStages.map((stage, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] font-mono text-emerald-400">Stage 0{idx + 1}</span>
              <div className="text-xs font-semibold text-slate-200 mt-1">{stage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
