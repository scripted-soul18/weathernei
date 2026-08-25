import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { HourlyForecastItem, DailyForecastItem } from '../types';
import { BarChart3, TrendingUp, Droplets, Wind, Calendar } from 'lucide-react';

interface WeatherChartsProps {
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ hourly, daily }) => {
  const [activeTab, setActiveTab] = useState<'rainfall' | 'temp_humidity' | 'wind' | 'daily'>('rainfall');

  // Format hourly data slice (first 24-36 hours)
  const hourlyData = hourly.slice(0, 24).map((item) => {
    const d = new Date(item.time);
    const hourLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      hour: hourLabel,
      rainfall: item.rainfall,
      temperature: item.temperature,
      humidity: item.humidity,
      wind_speed: item.wind_speed,
      soil_moisture: Math.round(item.soil_moisture * 100)
    };
  });

  const dailyData = daily.map((item) => {
    const d = new Date(item.date);
    const dayLabel = d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
    return {
      day: dayLabel,
      max_temp: item.max_temp,
      min_temp: item.min_temp,
      rainfall: item.total_rainfall,
      description: item.weather_description
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl">
          <p className="font-semibold text-slate-200 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-mono text-[11px]">
              {entry.name}: <strong>{entry.value} {entry.unit || ''}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">
              Meteorological Forecasting Charts
            </h3>
            <p className="text-[11px] text-slate-400">
              Hourly atmospheric trends and multi-day precipitation forecasts
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('rainfall')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'rainfall'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>

          <button
            onClick={() => setActiveTab('temp_humidity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'temp_humidity'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Temp & Humidity</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'wind'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Speed</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'daily'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Outlook</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        {activeTab === 'rainfall' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" mm" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rainfall" name="Rainfall" fill="url(#rainBarGrad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'temp_humidity' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="humAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#f43f5e" strokeWidth={2} fill="url(#tempAreaGrad)" />
              <Area type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#06b6d4" strokeWidth={2} fill="url(#humAreaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'wind' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" km/h" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="wind_speed" name="Wind Speed" stroke="#2dd4bf" strokeWidth={2.5} dot={{ r: 3, fill: '#2dd4bf' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'daily' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dailyRainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rainfall" name="Total Rain (mm)" fill="url(#dailyRainGrad)" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="max_temp" name="Max Temp (°C)" stroke="#f59e0b" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
