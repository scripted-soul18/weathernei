import React from 'react';
import { MapPin, Mountain, TrendingUp, Layers, Clock, AlertCircle } from 'lucide-react';
import { TerrainInfo, RiskLevel } from '../types';

interface TopStatsBarProps {
  locationName: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slope: number;
  terrain?: TerrainInfo;
  riskLevel: RiskLevel;
  lastUpdated: string;
}

const RISK_BADGES: Record<RiskLevel, { text: string; bg: string; border: string; color: string }> = {
  LOW: { text: 'LOW RISK', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', color: 'text-emerald-400' },
  MODERATE: { text: 'MODERATE RISK', bg: 'bg-amber-500/15', border: 'border-amber-500/30', color: 'text-amber-400' },
  HIGH: { text: 'HIGH RISK', bg: 'bg-orange-500/15', border: 'border-orange-500/40', color: 'text-orange-400' },
  'VERY HIGH': { text: 'VERY HIGH RISK', bg: 'bg-rose-500/20', border: 'border-rose-500/50', color: 'text-rose-400' },
};

export const TopStatsBar: React.FC<TopStatsBarProps> = ({
  locationName,
  latitude,
  longitude,
  elevation,
  slope,
  terrain,
  riskLevel,
  lastUpdated
}) => {
  const badge = RISK_BADGES[riskLevel] || RISK_BADGES.LOW;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-lg flex flex-wrap items-center justify-between gap-4">
      {/* Location Details */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-100 truncate max-w-sm" title={locationName}>
            {locationName || `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`}
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
            <span>Lat: <strong className="text-slate-200">{latitude.toFixed(4)}°</strong></span>
            <span>•</span>
            <span>Lon: <strong className="text-slate-200">{longitude.toFixed(4)}°</strong></span>
          </div>
        </div>
      </div>

      {/* Topographical Stats */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Mountain className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Elevation</span>
            <span className="font-mono font-semibold text-slate-200">{elevation.toFixed(0)} m</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Terrain Slope</span>
            <span className="font-mono font-semibold text-slate-200">{slope.toFixed(1)}°</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Layers className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Land Cover</span>
            <span className="font-semibold text-slate-200 capitalize">
              {terrain?.land_cover.replace(/_/g, ' ') || 'Mountain Shrub'}
            </span>
          </div>
        </div>

        {/* Current Assessment Badge */}
        <div className={`px-3 py-1.5 rounded-xl border ${badge.bg} ${badge.border} flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${riskLevel === 'VERY HIGH' ? 'bg-rose-500 animate-ping' : riskLevel === 'HIGH' ? 'bg-orange-500' : riskLevel === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className={`text-xs font-bold tracking-wide ${badge.color}`}>{badge.text}</span>
        </div>
      </div>
    </div>
  );
};
