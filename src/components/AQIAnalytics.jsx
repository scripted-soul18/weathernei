import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  HeartPulse, 
  Wind, 
  CheckCircle2,
  Info
} from 'lucide-react';

export default function AQIAnalytics({ aqiData, locationName }) {
  if (!aqiData) return null;

  const pollutants = [
    { key: "pm2_5", label: "PM 2.5 (Fine Particulate)", val: aqiData.pm2_5, unit: "µg/m³", limit: 60, desc: "Combustion particles, organic compounds, metals" },
    { key: "pm10", label: "PM 10 (Coarse Inhalable)", val: aqiData.pm10, unit: "µg/m³", limit: 100, desc: "Dust, pollen, mold spores, construction dust" },
    { key: "no2", label: "Nitrogen Dioxide (NO₂)", val: aqiData.no2, unit: "µg/m³", limit: 80, desc: "Vehicular exhaust, thermal power generation" },
    { key: "so2", label: "Sulphur Dioxide (SO₂)", val: aqiData.so2, unit: "µg/m³", limit: 80, desc: "Industrial emissions, coal burning" },
    { key: "co", label: "Carbon Monoxide (CO)", val: aqiData.co, unit: "µg/m³", limit: 2000, desc: "Incomplete fuel combustion in traffic" },
    { key: "ozone", label: "Surface Ozone (O₃)", val: aqiData.ozone, unit: "µg/m³", limit: 100, desc: "Secondary pollutant formed under sunlight" }
  ];

  return (
    <div className="space-y-5">
      {/* Hero AQI Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Central Pollution Control Board (CPCB) Standard
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Air Quality Index: {locationName}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {aqiData.impact}
          </p>
        </div>

        {/* Big AQI Number Display */}
        <div className="p-5 rounded-2xl border flex flex-col items-center justify-center min-w-[160px] text-center" style={{ backgroundColor: `${aqiData.color}15`, borderColor: `${aqiData.color}50` }}>
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">National AQI</span>
          <div className="text-5xl font-black font-tech my-1" style={{ color: aqiData.color }}>
            {aqiData.aqi}
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: aqiData.color }}>
            {aqiData.category}
          </span>
        </div>
      </div>

      {/* Pollutant Matrix Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutants.map((pol) => {
          const isOverLimit = pol.val > pol.limit;
          const ratio = Math.min(100, Math.round((pol.val / pol.limit) * 100));

          return (
            <div key={pol.key} className="glass-panel rounded-2xl p-4 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-white">{pol.label}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isOverLimit ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {isOverLimit ? "Above NAAQS" : "Safe Limit"}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-tech text-white">
                    {pol.val} <span className="text-xs font-normal text-slate-400">{pol.unit}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">NAAQS: {pol.limit}</span>
                </div>

                {/* Progress bar towards safety limit */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverLimit ? 'bg-red-500' : ratio > 75 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                {pol.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Health Advisories for Sensitive Groups */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 space-y-3">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-400" /> Sectoral Health Guidance & Sensitive Demographics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300">🏃 Outdoor Athletes & Commuters</span>
            <p className="text-[11px] text-slate-400">
              {aqiData.aqi > 200 ? "Avoid intense aerobic workouts outdoors during early morning inversion." : "Conditions suitable for regular outdoor jogging and cycling."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="font-semibold text-amber-300">👵 Elderly & Children</span>
            <p className="text-[11px] text-slate-400">
              {aqiData.aqi > 150 ? "Limit prolonged outdoor exertion. Keep indoor spaces ventilated with air purifiers." : "Air quality poses no specific risks to school activities."}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="font-semibold text-rose-300">🫁 Asthmatic & Cardiac Patients</span>
            <p className="text-[11px] text-slate-400">
              {aqiData.aqi > 150 ? "Keep emergency bronchodilator inhalers handy. Wear N95 filtration masks outside." : "Maintain routine medication schedule."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
