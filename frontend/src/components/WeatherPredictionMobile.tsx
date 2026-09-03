import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  RefreshCw,
  Bookmark,
  Sun,
  Moon,
  Mountain,
  CloudRain,
  Activity,
  Layers,
  Sliders,
  ChevronRight,
  TrendingUp,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  ShieldAlert,
  Clock,
  Navigation,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { InteractiveMap } from '../map/InteractiveMap';
import { WeatherCard } from './WeatherCard';
import { LandslideRiskCard } from './LandslideRiskCard';
import { RiskTimeline } from './RiskTimeline';
import { WeatherCharts } from './WeatherCharts';
import { AlertBanner } from './AlertBanner';
import { LocationSearchBar } from './LocationSearchBar';
import { useTheme } from '../context/ThemeContext';
import {
  WeatherForecastResponse,
  LandslidePredictionResponse,
  RiskMapResponse,
  PredictionTimelineResponse,
  AlertItem
} from '../types';

interface WeatherPredictionMobileProps {
  currentLat: number;
  currentLon: number;
  locationName: string;
  weatherData: WeatherForecastResponse | null;
  predictionData: LandslidePredictionResponse | null;
  riskMapData: RiskMapResponse | null;
  timelineData: PredictionTimelineResponse | null;
  alerts: AlertItem[];
  isLoading: boolean;
  onBackToNavigation: () => void;
  onSelectCoordinates: (lat: number, lon: number, name?: string) => void;
  onSimulate: (params: { rainfall_24h?: number; slope?: number; soil_moisture?: number }) => void;
  onRefresh: () => void;
  onOpenSavedLocations: () => void;
}

type MobileTab = 'overview' | 'map' | 'charts' | 'simulate';

export const WeatherPredictionMobile: React.FC<WeatherPredictionMobileProps> = ({
  currentLat,
  currentLon,
  locationName,
  weatherData,
  predictionData,
  riskMapData,
  timelineData,
  alerts,
  isLoading,
  onBackToNavigation,
  onSelectCoordinates,
  onSimulate,
  onRefresh,
  onOpenSavedLocations
}) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<MobileTab>('overview');
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const currentRisk = predictionData?.risk_level || 'LOW';
  const probPercent = Math.round((predictionData?.landslide_probability || 0.1) * 100);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 min-h-[calc(100vh-2rem)] transition-colors duration-300">
      {/* 1. Mobile Top Header */}
      <header className="px-3.5 py-2.5 bg-white/95 dark:bg-[#091220] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sticky top-0 z-40 backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onBackToNavigation}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 active:scale-95 transition-all shrink-0"
            title="Back to Navigation"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div
            onClick={() => setShowSearchModal(true)}
            className="flex-1 min-w-0 cursor-pointer bg-slate-100 dark:bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
            <div className="text-left truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {locationName.split(',')[0]}
              <span className="block text-[9px] text-slate-500 dark:text-slate-400 font-normal truncate">
                {currentLat.toFixed(2)}°N, {currentLon.toFixed(2)}°E
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 transition-colors active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          <button
            onClick={onOpenSavedLocations}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 relative active:scale-95 transition-colors"
            title="Saved Locations"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 active:scale-95 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. Mobile Segment Tabs */}
      <div className="px-3 pt-2 pb-1.5 bg-slate-50 dark:bg-[#070E1A] border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-200/80 dark:bg-[#0B1526] border border-slate-300/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Risk &amp; Weather</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'map'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Spatial Map</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'charts'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>72h Forecast</span>
          </button>
        </div>
      </div>

      {/* 3. Main Scrollable Content for Mobile */}
      <main className="flex-1 p-3 space-y-3 overflow-y-auto pb-4">
        {/* Safety Alert Banner */}
        {predictionData && !isAlertDismissed && (
          <AlertBanner
            locationName={locationName}
            riskLevel={predictionData.risk_level}
            probability={predictionData.landslide_probability}
            factors={predictionData.factors}
            disclaimer={predictionData.disclaimer}
            onDismiss={() => setIsAlertDismissed(true)}
          />
        )}

        {/* TAB 1: OVERVIEW (Live Weather & Landslide Hazard Card) */}
        {activeTab === 'overview' && (
          <div className="space-y-3 animate-fadeIn">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Hazard Risk</div>
                <div className={`text-base font-black font-mono mt-0.5 ${
                  currentRisk === 'VERY HIGH' ? 'text-rose-600 dark:text-rose-400' : currentRisk === 'HIGH' ? 'text-amber-600 dark:text-amber-400' : currentRisk === 'MODERATE' ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {currentRisk}
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Probability</div>
                <div className="text-base font-black text-cyan-600 dark:text-cyan-300 font-mono mt-0.5">
                  {probPercent}%
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">24h Rainfall</div>
                <div className="text-base font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                  {weatherData ? `${weatherData.current.rainfall_24h} mm` : '0 mm'}
                </div>
              </div>
            </div>

            {/* Live Weather Card */}
            {weatherData ? (
              <WeatherCard weather={weatherData.current} isLoading={isLoading} />
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 shadow-sm">
                Loading meteorological telemetry...
              </div>
            )}

            {/* Landslide Risk Assessment Card */}
            {predictionData ? (
              <LandslideRiskCard
                prediction={predictionData}
                onSimulate={onSimulate}
                isLoading={isLoading}
              />
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 shadow-sm">
                Calculating landslide risk model...
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SPATIAL MAP VIEW */}
        {activeTab === 'map' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <InteractiveMap
                latitude={currentLat}
                longitude={currentLon}
                riskLevel={predictionData?.risk_level || 'LOW'}
                landslideProbability={predictionData?.landslide_probability || 0.1}
                gridPoints={riskMapData?.grid_points || []}
                onSelectLocation={onSelectCoordinates}
                isLoading={isLoading}
              />
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
              <span>Elevation: {predictionData?.terrain?.elevation || 350}m</span>
              <span>Slope: {predictionData?.terrain?.slope || 15}°</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold font-mono">DEM ACTIVE</span>
            </div>
          </div>
        )}

        {/* TAB 3: 72-HOUR TIMELINE & CHARTS */}
        {activeTab === 'charts' && (
          <div className="space-y-3 animate-fadeIn">
            {timelineData && (
              <RiskTimeline timeline={timelineData.timeline} isLoading={isLoading} />
            )}

            {weatherData && (
              <WeatherCharts hourly={weatherData.hourly} daily={weatherData.daily} />
            )}
          </div>
        )}
      </main>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-12">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xl transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Search Corridors &amp; Locations</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <LocationSearchBar
              onSelectCoordinates={(lat, lon, name) => {
                onSelectCoordinates(lat, lon, name);
                setShowSearchModal(false);
              }}
              currentLat={currentLat}
              currentLon={currentLon}
            />
          </div>
        </div>
      )}

      {/* 4. Mobile Bottom Navigation Bar */}
      <nav className="px-2 py-2 bg-white dark:bg-[#060C16] border-t border-slate-200 dark:border-slate-800/80 sticky bottom-0 z-40 transition-colors duration-300">
        <div className="flex items-center justify-around relative">
          {/* Trips */}
          <button
            onClick={onBackToNavigation}
            className="flex flex-col items-center gap-1 py-1 px-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium">Trips</span>
          </button>

          {/* Nearby (Currently Active - Green) */}
          <button
            onClick={() => setActiveTab('overview')}
            className="flex flex-col items-center gap-1 py-1 px-3 text-emerald-600 dark:text-emerald-400 font-bold transition-all relative"
          >
            <div className="p-1 rounded-full bg-emerald-500/20">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Nearby</span>
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          </button>

          {/* Start Journey (Center Button) */}
          <div className="-mt-6 flex flex-col items-center">
            <button
              onClick={onBackToNavigation}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0A1728] flex items-center justify-center shadow-inner">
                <Navigation className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
              </div>
            </button>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Start Journey</span>
          </div>

          {/* Alerts */}
          <button
            onClick={onBackToNavigation}
            className="flex flex-col items-center gap-1 py-1 px-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 relative transition-colors"
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                1
              </span>
            </div>
            <span className="text-[10px] font-medium">Alerts</span>
          </button>

          {/* Road Info */}
          <button
            onClick={onBackToNavigation}
            className="flex flex-col items-center gap-1 py-1 px-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Road Info</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
