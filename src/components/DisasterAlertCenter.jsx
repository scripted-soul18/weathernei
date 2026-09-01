import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Wind, 
  Droplets, 
  Send, 
  Copy, 
  Check, 
  LifeBuoy,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ACTIVE_DISTRICT_ALERTS, ACTIVE_CYCLONE_SIMULATION, IMD_WARNING_LEVELS } from '../data/imdAlertsData';

export default function DisasterAlertCenter({ onAskDisasterQuestion }) {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const filteredAlerts = selectedFilter === "ALL" 
    ? ACTIVE_DISTRICT_ALERTS 
    : ACTIVE_DISTRICT_ALERTS.filter(a => a.level === selectedFilter);

  const cyclone = ACTIVE_CYCLONE_SIMULATION;

  const sampleCapSms = `[IMD EMERGENCY ALERT - CAP/NDMA] Red Alert issued for ${ACTIVE_DISTRICT_ALERTS[0].district} (${ACTIVE_DISTRICT_ALERTS[0].state}). Extremely Heavy Rainfall (>200mm) & Gale Winds (${cyclone.maxSustainedWindKmph} km/h) expected within 24 hours due to ${cyclone.name}. Stay indoors, move to cyclone shelters if in low-lying coast. Helpline: 1070 / 112.`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(sampleCapSms);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2000);
  };

  const handleSimulateBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Severe Cyclone Surveillance */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-blue-950/70 border border-red-500/40 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-widest animate-pulse flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> High Priority Cyclone Alert
              </span>
              <span className="text-xs font-mono text-cyan-300">
                Basin: {cyclone.basin} • Category: {cyclone.intensityScale}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {cyclone.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              System currently centered at <strong>{cyclone.currentLocation.distanceFromCoast}</strong>. 
              Projected to cross coast between <strong>{cyclone.landfallForecast.location}</strong> during <strong>{cyclone.landfallForecast.expectedTime}</strong> with storm surge of <strong>{cyclone.landfallForecast.stormSurgeMeters}</strong>.
            </p>
          </div>

          {/* Cyclone Live Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Max Sustained Wind</span>
              <div className="text-xl font-bold font-tech text-red-400">{cyclone.maxSustainedWindKmph} km/h</div>
              <span className="text-[10px] text-slate-500 font-mono">Gusts: {cyclone.gustingToKmph} km/h</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Central Pressure</span>
              <div className="text-xl font-bold font-tech text-cyan-300">{cyclone.centralPressureHpa} hPa</div>
              <span className="text-[10px] text-slate-500 font-mono">Deep Depression eye</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Storm Surge</span>
              <div className="text-xl font-bold font-tech text-amber-400">1.5 - 2.2 m</div>
              <span className="text-[10px] text-slate-500">Above Astro Tide</span>
            </div>
          </div>
        </div>

        {/* Port Danger Signals Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3 overflow-x-auto no-scrollbar text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <LifeBuoy className="w-3.5 h-3.5 text-red-400" /> Active Port Signals:
          </span>
          {cyclone.portWarningSignals.map((port, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-950/60 text-red-200 border border-red-900/50 shrink-0 font-medium">
              <strong>{port.port}:</strong> {port.signal}
            </span>
          ))}
        </div>
      </div>

      {/* Warning Level Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel rounded-2xl p-4 border border-slate-700/60">
        <div>
          <h3 className="text-base font-bold text-white font-display">
            Active IMD Warning Matrix ({filteredAlerts.length} Districts)
          </h3>
          <p className="text-xs text-slate-400">
            Real-time multi-hazard bulletins across Indian states and union territories
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
          {["ALL", "RED", "ORANGE", "YELLOW"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedFilter(lvl)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedFilter === lvl
                  ? lvl === "RED" ? 'bg-red-500 text-white' : lvl === "ORANGE" ? 'bg-orange-500 text-white' : lvl === "YELLOW" ? 'bg-yellow-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl} {lvl !== "ALL" && "ALERTS"}
            </button>
          ))}
        </div>
      </div>

      {/* District Alerts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert, idx) => {
          const isRed = alert.level === "RED";
          const isOrange = alert.level === "ORANGE";

          return (
            <div
              key={idx}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isRed
                  ? 'bg-red-950/25 border-red-500/40 shadow-lg shadow-red-500/5'
                  : isOrange
                  ? 'bg-orange-950/20 border-orange-500/40'
                  : 'bg-yellow-950/15 border-yellow-500/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white font-display">
                        {alert.district}
                      </h4>
                      <span className="text-xs text-slate-400">({alert.state})</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300 mt-0.5">
                      {alert.event}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase shrink-0 ${
                    isRed ? 'bg-red-500 text-white' : isOrange ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-slate-950'
                  }`}>
                    {alert.level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Rainfall Expected:</span>
                    <div className="font-bold font-tech text-white">{alert.rainfallExpectedMm}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Wind Velocity:</span>
                    <div className="font-bold font-tech text-white">{alert.windSpeedKmph}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p><strong>Impact:</strong> {alert.impact}</p>
                  <p className="text-cyan-300"><strong>Advisory:</strong> {alert.advisory}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Validity: {alert.validUntil}</span>
                <button
                  onClick={() => onAskDisasterQuestion(`Provide disaster management action checklist for ${alert.district} (${alert.state}) under ${alert.level} alert.`)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Generate SitRep ➔
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Common Alerting Protocol (CAP) SMS Simulator */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white font-display">
              Simulated Common Alerting Protocol (CAP / NDMA) Public Broadcast
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-semibold">
            Emergency Cell Broadcast System
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
          {sampleCapSms}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleCopySms}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copiedBroadcast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBroadcast ? "Copied Alert SMS" : "Copy Alert Text"}</span>
          </button>

          <button
            onClick={handleSimulateBroadcast}
            disabled={broadcastSent}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md shadow-red-500/20 transition-all disabled:opacity-60"
          >
            {broadcastSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
            <span>{broadcastSent ? "Broadcast Disseminated (SMS & Sirens)" : "Simulate Public Cell Broadcast"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
