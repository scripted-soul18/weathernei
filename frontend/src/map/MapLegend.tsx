import React from 'react';
import { Layers, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface MapLegendProps {
  tileLayer: 'dark' | 'osm' | 'satellite';
  onTileChange: (tile: 'dark' | 'osm' | 'satellite') => void;
  showRiskGrid: boolean;
  onToggleRiskGrid: () => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  tileLayer,
  onTileChange,
  showRiskGrid,
  onToggleRiskGrid,
}) => {
  return (
    <div className="absolute bottom-6 right-6 z-[1000] glass-panel p-3.5 rounded-xl border border-slate-700/60 shadow-2xl max-w-xs text-xs">
      <div className="flex items-center justify-between gap-4 mb-2.5 pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Landslide Risk Scale</span>
        </div>
        <button
          onClick={onToggleRiskGrid}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
            showRiskGrid
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
          title="Toggle spatial heatmap grid"
        >
          {showRiskGrid ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>Grid</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
          <span className="text-slate-300">Low (0-20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]"></span>
          <span className="text-slate-300">Mod (20-50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.7)]"></span>
          <span className="text-slate-300">High (50-75%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
          <span className="text-rose-300 font-semibold">V.High (75-100%)</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
        <span className="text-slate-400 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Base Tile:
        </span>
        <div className="flex gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onTileChange('dark')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              tileLayer === 'dark' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => onTileChange('satellite')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              tileLayer === 'satellite' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => onTileChange('osm')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
              tileLayer === 'osm' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            OSM
          </button>
        </div>
      </div>
    </div>
  );
};
