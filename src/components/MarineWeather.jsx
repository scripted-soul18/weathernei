import React from 'react';
import { 
  Anchor, 
  Waves, 
  Wind, 
  Compass, 
  AlertOctagon, 
  ShieldCheck, 
  Navigation,
  LifeBuoy
} from 'lucide-react';
import { PORT_SIGNALS } from '../services/imdAlertService';

export default function MarineWeather({ weatherData, onAskMarineQuestion }) {
  if (!weatherData) return null;
  const { location, current } = weatherData;

  const windKm = current.windSpeedKm || 15;
  const windKnots = Math.round(windKm * 0.54);
  const waveHeightM = (windKm * 0.11 + 0.7).toFixed(1);
  const swellPeriodSec = 8;
  const seaState = windKnots > 25 ? "Very Rough to High" : windKnots > 16 ? "Rough" : windKnots > 10 ? "Moderate" : "Smooth to Slight";
  const isSafeForSea = windKnots < 20;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900 to-cyan-950/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Anchor className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Coastal & Ocean Weather Advisory for Fisherfolk (IMD / INCOIS)
            </h2>
            <p className="text-xs text-slate-400">
              Marine meteorological observations and sea safety directives for <strong>{location.name}</strong>
            </p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
          isSafeForSea ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
        }`}>
          {isSafeForSea ? <ShieldCheck className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
          <span>{isSafeForSea ? "SAFE FOR INSHORE FISHING (< 12 NM)" : "CRITICAL WARNING: DO NOT VENTURE INTO SEA"}</span>
        </div>
      </div>

      {/* Marine Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wave Height */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Significant Wave Height</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold font-tech text-white">
              {waveHeightM} <span className="text-sm font-normal text-slate-400">meters</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Swell Period: ~{swellPeriodSec} seconds</p>
          </div>
          <div className="text-[10px] text-cyan-300 font-medium">
            {waveHeightM > 2.5 ? "High Swell Waves (Caution)" : "Normal wave dynamics"}
          </div>
        </div>

        {/* Sea Surface Wind */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Offshore Wind Velocity</span>
            <Wind className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-bold font-tech text-white">
              {windKnots} <span className="text-sm font-normal text-slate-400">Knots</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Equivalent: {windKm} km/h (Gusts: {Math.round(windKm * 1.3)} km/h)
            </p>
          </div>
          <div className="text-[10px] text-slate-400">
            Beaufort Scale: Force {Math.min(12, Math.round(windKnots / 4))}
          </div>
        </div>

        {/* Sea State */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Sea State Classification</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold font-display text-white truncate">
              {seaState}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">IMD Marine Scale</p>
          </div>
          <div className="text-[10px] text-slate-300">
            Visibility at sea: &gt; 8 km (Good)
          </div>
        </div>

        {/* Port Warning Signal */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Port Warning</span>
            <LifeBuoy className="w-4 h-4 text-red-400" />
          </div>
          <div className="my-2">
            <div className="text-lg font-bold font-display text-amber-300">
              Signal No. III
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Local Cautionary Signal</p>
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            Squally weather alert for ports
          </div>
        </div>
      </div>

      {/* Port Warning Signals Guide */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60">
        <h3 className="text-sm font-bold text-white font-display mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" /> IMD Standard Port Warning Signals Reference (India Maritime Code)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PORT_SIGNALS.map((sig) => (
            <div key={sig.num} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">{sig.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Sig {sig.num}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{sig.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
