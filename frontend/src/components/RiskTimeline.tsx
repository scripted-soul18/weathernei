import React, { useState } from 'react';
import { Clock, CloudRain, ArrowRight, Droplets, Thermometer, ChevronRight } from 'lucide-react';
import { TimelineHorizonItem, RiskLevel } from '../types';

interface RiskTimelineProps {
  timeline: TimelineHorizonItem[];
  isLoading?: boolean;
}

const RISK_BADGES: Record<
  RiskLevel,
  { text: string; bg: string; border: string; color: string; dot: string; glow: string }
> = {
  LOW: {
    text: 'LOW',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-500/40',
    color: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
  },
  MODERATE: {
    text: 'MODERATE',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-500/40',
    color: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]'
  },
  HIGH: {
    text: 'HIGH',
    bg: 'bg-orange-500/15 dark:bg-orange-500/20',
    border: 'border-orange-500/50',
    color: 'text-orange-700 dark:text-orange-400',
    dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.18)]'
  },
  'VERY HIGH': {
    text: 'VERY HIGH',
    bg: 'bg-rose-500/15 dark:bg-rose-500/25',
    border: 'border-rose-500/60',
    color: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)]'
  }
};

export const RiskTimeline: React.FC<RiskTimelineProps> = ({ timeline, isLoading = false }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  if (!timeline || timeline.length === 0) {
    return null;
  }

  const selectedItem = timeline[selectedIdx] || timeline[0];
  const selectedBadge = RISK_BADGES[selectedItem.risk_level] || RISK_BADGES.LOW;

  return (
    <div className="w-full glass-panel bg-white/90 dark:bg-[#0B1526]/90 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800/90 shadow-2xl space-y-5 transition-all">
      {/* 1. Header with Time Horizon Info & Active Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-500 dark:text-blue-400 shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wide">
              72-Hour Hazard Timeline Horizon
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Future cumulative rainfall &amp; soil saturation progression
            </p>
          </div>
        </div>

        {/* Selected Horizon Summary Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-900/90 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-inner">
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
            Forecast at <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">{selectedItem.time_offset}</strong>:
          </span>
          <span className={`font-extrabold flex items-center gap-1.5 text-xs ${selectedBadge.color}`}>
            <span className={`w-2 h-2 rounded-full ${selectedBadge.dot}`} />
            {selectedItem.risk_level} ({Math.round(selectedItem.landslide_probability * 100)}%)
          </span>
        </div>
      </div>

      {/* 2. Spacious Horizontal Scrollable Timeline Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
          <span>TIMELINE HORIZON CARDS</span>
          <span className="text-[10px] text-slate-500">Scroll horizontally →</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x">
          {timeline.map((item, idx) => {
            const badge = RISK_BADGES[item.risk_level] || RISK_BADGES.LOW;
            const isSelected = selectedIdx === idx;
            const prob = Math.round(item.landslide_probability * 100);

            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`min-w-[120px] sm:min-w-[130px] p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between shrink-0 snap-start select-none cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/15 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/40 shadow-lg scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top Time Header */}
                <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-200/60 dark:border-slate-800/80">
                  <span className="font-extrabold text-xs font-mono text-slate-800 dark:text-slate-100">
                    {item.time_offset}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
                </div>

                {/* Middle Telemetry Metrics */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono font-semibold">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                    <span>{item.cumulative_rainfall_mm.toFixed(1)} mm</span>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <Droplets className="w-3 h-3 text-cyan-500 shrink-0" />
                    <span>Sat: {(item.soil_moisture * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Bottom Risk Tag */}
                <div
                  className={`mt-auto pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] font-extrabold tracking-tight flex items-center justify-between ${badge.color}`}
                >
                  <span>{prob}%</span>
                  <span className="truncate">{badge.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Spacious Detailed Comparative Table View */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
          <span>HOURLY PARAMETER BREAKDOWN</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60 shadow-inner">
          <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300 min-w-[500px]">
            <thead className="text-[10px] uppercase bg-slate-100/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-extrabold tracking-wider">
              <tr>
                <th className="px-4 py-3">Time Horizon</th>
                <th className="px-4 py-3">Interval Rain</th>
                <th className="px-4 py-3">Accumulated Rain</th>
                <th className="px-4 py-3">Temperature</th>
                <th className="px-4 py-3">Soil Moisture</th>
                <th className="px-4 py-3 text-right">Hazard Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/60 font-mono text-xs">
              {timeline.map((row, idx) => {
                const badge = RISK_BADGES[row.risk_level] || RISK_BADGES.LOW;
                const isRowSelected = selectedIdx === idx;

                return (
                  <tr
                    key={idx}
                    className={`transition-colors cursor-pointer ${
                      isRowSelected
                        ? 'bg-blue-500/10 dark:bg-blue-900/30 font-bold text-white'
                        : 'hover:bg-slate-100/80 dark:hover:bg-slate-900/60'
                    }`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <td className="px-4 py-3 font-sans font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {isRowSelected && (
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 animate-pulse" />
                      )}
                      <span>{row.time_offset}</span>
                    </td>
                    <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold">
                      {row.rainfall_mm.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-blue-700 dark:text-blue-300 font-extrabold">
                      {row.cumulative_rainfall_mm.toFixed(1)} mm
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {row.temperature.toFixed(1)}°C
                    </td>
                    <td className="px-4 py-3 text-cyan-600 dark:text-cyan-400">
                      {(row.soil_moisture * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border ${badge.bg} ${badge.border} ${badge.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {row.risk_level} ({Math.round(row.landslide_probability * 100)}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
