import React from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Compass,
  Layers,
  CloudSun
} from 'lucide-react';
import { CurrentWeather } from '../types';

interface WeatherCardProps {
  weather: CurrentWeather;
  isLoading?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isLoading = false }) => {
  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <CloudSun className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Current Weather</h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 font-mono">
          {weather.weather_description}
        </span>
      </div>

      {/* Main Temperature & Weather Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Temperature */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-100">
              {weather.temperature.toFixed(1)}°C
            </div>
            <div className="text-[11px] text-slate-400">Surface Temp</div>
          </div>
        </div>

        {/* 24h Rainfall */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-cyan-300">
              {weather.rainfall_24h.toFixed(1)} <span className="text-sm font-normal text-slate-400">mm</span>
            </div>
            <div className="text-[11px] text-slate-400">24h Rainfall</div>
          </div>
        </div>
      </div>

      {/* Sub-grid of detailed environmental metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Rainfall Windows */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Precipitation</span>
          </div>
          <span className="font-mono text-sm font-semibold text-slate-200">
            {weather.rainfall_1h.toFixed(1)} mm <span className="text-[10px] text-slate-500 font-normal">/ 1h</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            7d: {weather.rainfall_7d.toFixed(1)} mm
          </span>
        </div>

        {/* Humidity */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <span className="font-mono text-sm font-semibold text-slate-200">
            {weather.humidity.toFixed(0)}%
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">Relative</span>
        </div>

        {/* Wind */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>Wind</span>
          </div>
          <span className="font-mono text-sm font-semibold text-slate-200">
            {weather.wind_speed.toFixed(1)} km/h
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
            <Compass className="w-2.5 h-2.5" /> {weather.wind_direction.toFixed(0)}°
          </span>
        </div>

        {/* Soil Moisture */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 flex flex-col">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Soil Saturation</span>
          </div>
          <span className="font-mono text-sm font-semibold text-amber-300">
            {(weather.soil_moisture * 100).toFixed(0)}%
          </span>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                weather.soil_moisture > 0.65
                  ? 'bg-rose-500'
                  : weather.soil_moisture > 0.45
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, weather.soil_moisture * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
