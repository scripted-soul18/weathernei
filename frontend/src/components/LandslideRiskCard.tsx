import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { LandslidePredictionResponse, RiskLevel } from '../types';

interface LandslideRiskCardProps {
  prediction: LandslidePredictionResponse;
  onSimulate: (params: { rainfall_24h?: number; slope?: number; soil_moisture?: number }) => void;
  isLoading?: boolean;
}

const RISK_BADGE_CONFIG: Record<
  RiskLevel,
  { label: string; textClass: string; bgClass: string; borderClass: string; barClass: string; glowClass: string }
> = {
  LOW: {
    label: 'LOW RISK',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    barClass: 'bg-emerald-500',
    glowClass: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  },
  MODERATE: {
    label: 'MODERATE RISK',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
    barClass: 'bg-amber-500',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
  },
  HIGH: {
    label: 'HIGH RISK',
    textClass: 'text-orange-400',
    bgClass: 'bg-orange-500/20',
    borderClass: 'border-orange-500/40',
    barClass: 'bg-orange-500',
    glowClass: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
  },
  'VERY HIGH': {
    label: 'VERY HIGH RISK',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-500/25',
    borderClass: 'border-rose-500/60',
    barClass: 'bg-rose-500',
    glowClass: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
  },
};

export const LandslideRiskCard: React.FC<LandslideRiskCardProps> = ({
  prediction,
  onSimulate,
  isLoading = false,
}) => {
  const [showSim, setShowSim] = useState(false);
  const [simRain, setSimRain] = useState<number>(prediction.weather_summary?.rainfall_24h || 25);
  const [simSlope, setSimSlope] = useState<number>(prediction.terrain?.slope || 20);
  const [simMoisture, setSimMoisture] = useState<number>(0.5);

  const badge = RISK_BADGE_CONFIG[prediction.risk_level] || RISK_BADGE_CONFIG.LOW;
  const probPercent = Math.round(prediction.landslide_probability * 100);

  const handleApplySim = () => {
    onSimulate({
      rainfall_24h: Number(simRain),
      slope: Number(simSlope),
      soil_moisture: Number(simMoisture),
    });
  };

  const handleResetSim = () => {
    onSimulate({});
  };

  return (
    <div className={`w-full glass-panel rounded-2xl p-5 border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-500 ${badge.glowClass}`}>
      {/* Top Banner & AI Model Version */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Brain className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
            Landslide Risk Assessment
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            Conf: <strong className="text-slate-200">{(prediction.confidence * 100).toFixed(0)}%</strong>
          </span>
          <button
            onClick={() => setShowSim(!showSim)}
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all"
          >
            <Sliders className="w-3 h-3" />
            <span>Simulate</span>
            {showSim ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Risk Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800 mb-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${badge.bgClass} ${badge.borderClass}`}>
            <ShieldAlert className={`w-7 h-7 ${badge.textClass} ${prediction.risk_level === 'VERY HIGH' ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Predicted Threat</div>
            <div className={`text-xl sm:text-2xl font-black tracking-tight ${badge.textClass}`}>
              {badge.label}
            </div>
          </div>
        </div>

        {/* Probability Gauge */}
        <div className="w-full sm:w-48 flex flex-col items-end">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-xs text-slate-400">Probability:</span>
            <span className="text-2xl font-black font-mono text-white">{probPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ${badge.barClass}`}
              style={{ width: `${Math.max(4, probPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* What-If Simulation Drawer */}
      {showSim && (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs">
          <div className="flex items-center justify-between font-semibold text-cyan-300 mb-2.5">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> What-If Parameter Simulation
            </span>
            <button
              onClick={handleResetSim}
              className="text-[10px] text-slate-400 hover:text-rose-400 underline"
            >
              Reset Live Defaults
            </button>
          </div>

          <div className="space-y-2.5 mb-3">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Simulated 24h Rainfall:</span>
                <span className="font-mono text-cyan-400">{simRain} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={simRain}
                onChange={(e) => setSimRain(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Simulated Slope:</span>
                <span className="font-mono text-cyan-400">{simSlope}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                value={simSlope}
                onChange={(e) => setSimSlope(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Simulated Soil Saturation:</span>
                <span className="font-mono text-cyan-400">{Math.round(simMoisture * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={simMoisture}
                onChange={(e) => setSimMoisture(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleApplySim}
            className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-md active:scale-95"
          >
            Re-evaluate Model Risk
          </button>
        </div>
      )}

      {/* Explainable AI (SHAP) Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            Why is the risk evaluated at this level?
          </span>
          <span className="text-[10px] text-slate-500 italic">SHAP Feature Contributions</span>
        </div>

        <div className="space-y-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
          {prediction.shap_contributions && prediction.shap_contributions.length > 0 ? (
            prediction.shap_contributions.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono text-slate-400 font-semibold">{item.contribution_pct}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(5, item.contribution_pct))}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">Calculating feature contributions...</div>
          )}
        </div>
      </div>

      {/* Major Risk Factors Checklist */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-slate-300 mb-2">Major Contributing Factors:</div>
        <div className="grid grid-cols-1 gap-1.5">
          {prediction.factors.map((factor, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> {prediction.disclaimer}
        </span>
      </div>
    </div>
  );
};
