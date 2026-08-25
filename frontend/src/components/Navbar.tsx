import React from 'react';
import {
  CloudLightning,
  Mountain,
  ShieldAlert,
  Bookmark,
  Activity,
  Bell,
  RefreshCw
} from 'lucide-react';
import { LocationSearchBar } from './LocationSearchBar';
import { RiskLevel } from '../types';

interface NavbarProps {
  onSelectCoordinates: (lat: number, lon: number, name?: string) => void;
  currentLat: number;
  currentLon: number;
  onOpenSavedLocations: () => void;
  onOpenModelMetrics: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  alertCount: number;
  currentRiskLevel?: RiskLevel;
}

const PRESET_LOCATIONS = [
  { name: 'Shimla (Himalayas)', lat: 31.1048, lon: 77.1734 },
  { name: 'Wayanad (Western Ghats)', lat: 11.6854, lon: 76.1320 },
  { name: 'Interlaken (Alps)', lat: 46.6863, lon: 7.8632 },
  { name: 'Seattle (Cascades)', lat: 47.6062, lon: -122.3321 }
];

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCoordinates,
  currentLat,
  currentLon,
  onOpenSavedLocations,
  onOpenModelMetrics,
  onRefresh,
  isLoading,
  alertCount,
  currentRiskLevel = 'LOW'
}) => {
  return (
    <header className="sticky top-0 z-[1100] w-full border-b border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Mountain className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  TERRA-GUARD
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Weather Forecast & Landslide Risk Assessment Platform
              </p>
            </div>
          </div>

          {/* Quick Refresh Icon on mobile */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full md:flex-1 max-w-lg flex items-center justify-center">
          <LocationSearchBar
            onSelectCoordinates={onSelectCoordinates}
            currentLat={currentLat}
            currentLon={currentLon}
          />
        </div>

        {/* Preset Shortcuts & Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          {/* Preset Buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {PRESET_LOCATIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSelectCoordinates(preset.lat, preset.lon, preset.name)}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-all"
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="hidden md:flex items-center justify-center p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition-all shadow-sm active:scale-95"
            title="Refresh live weather and AI risk model"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Model Transparency */}
          <button
            onClick={onOpenModelMetrics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-all shadow-sm active:scale-95"
            title="Inspect Machine Learning Validation Metrics & SHAP Architecture"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">ML Metrics</span>
          </button>

          {/* Saved Locations */}
          <button
            onClick={onOpenSavedLocations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-all shadow-sm active:scale-95 relative"
            title="Saved Locations & Prediction History"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
