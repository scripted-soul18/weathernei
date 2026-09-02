import React, { useState, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  ArrowUpDown,
  Car,
  Bike,
  Truck,
  Plus,
  Minus,
  Crosshair,
  Shield,
  ShieldAlert,
  Clock,
  MapPin,
  Navigation,
  AlertTriangle,
  X,
  CloudRain,
  Radio,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { WeatherForecastResponse, LandslidePredictionResponse } from '../types';

interface BharatNetraNavViewProps {
  user: { name: string; role: string; emailOrPhone: string } | null;
  weatherData: WeatherForecastResponse | null;
  predictionData: LandslidePredictionResponse | null;
  onOpenWeatherPrediction: () => void;
  onLogout: () => void;
  onSelectCoordinates?: (lat: number, lon: number, name: string) => void;
}

type VehicleType = 'car' | 'bike' | 'truck' | 'ambulance';
type BottomTab = 'trips' | 'nearby' | 'start' | 'alerts' | 'road_info';

const ROUTE_PRESETS = [
  {
    from: 'Pune',
    to: 'Talegaon',
    distance: '35.1 km',
    duration: '35 min',
    highway: 'NH 48',
    safetyBoost: '10% Safer',
    fromCoords: { lat: 18.5204, lon: 73.8567 },
    toCoords: { lat: 18.7297, lon: 73.6749 }
  },
  {
    from: 'Shimla',
    to: 'Kufri / Manali',
    distance: '48.2 km',
    duration: '1 hr 20 min',
    highway: 'NH 5',
    safetyBoost: '18% Safer',
    fromCoords: { lat: 31.1048, lon: 77.1734 },
    toCoords: { lat: 31.0979, lon: 77.2678 }
  },
  {
    from: 'Mumbai',
    to: 'Pune Expressway',
    distance: '148 km',
    duration: '2 hr 45 min',
    highway: 'Expressway',
    safetyBoost: '14% Safer',
    fromCoords: { lat: 19.0760, lon: 72.8777 },
    toCoords: { lat: 18.5204, lon: 73.8567 }
  }
];

export const BharatNetraNavView: React.FC<BharatNetraNavViewProps> = ({
  user,
  weatherData,
  predictionData,
  onOpenWeatherPrediction,
  onLogout,
  onSelectCoordinates
}) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('truck');
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('start');

  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const route = ROUTE_PRESETS[currentRouteIndex];

  const [origin, setOrigin] = useState(route.from);
  const [destination, setDestination] = useState(route.to);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  // Sync origin/dest when preset changes
  useEffect(() => {
    setOrigin(route.from);
    setDestination(route.to);
  }, [currentRouteIndex]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleBottomTabClick = (tab: BottomTab) => {
    setActiveBottomTab(tab);
    if (tab === 'nearby') {
      // Direct action required by user: Click on Nearby opens Weather & Landslide prediction interface!
      onOpenWeatherPrediction();
    } else if (tab === 'alerts') {
      setShowAlertModal(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050B14] text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Dynamic Background Road Network Texture */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050B14] via-[#091220] to-[#040812] pointer-events-none z-0" />

      {/* Main Container - Responsive with Mobile Wrapper Center on Large Screens */}
      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col justify-between bg-[#070E1A] shadow-2xl border-x border-slate-800/80">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR matching Image 2 */}
        {/* ========================================================================= */}
        <header className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-800/60 bg-[#070E1A]/95 backdrop-blur-md sticky top-0 z-40">
          {/* Left: Hamburger Menu & Brand Shield */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Bharat Netra Shield Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/40 border-2 border-emerald-500/80 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Shield className="w-5 h-5 fill-emerald-500/20 stroke-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Bharat
                  </span>
                  <span className="font-extrabold text-base text-emerald-400">
                    नेत्र
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Safer Roads • Stronger Bharat
                </div>
              </div>
            </div>
          </div>

          {/* Right: Theme Toggle & Notification Bell with (1) Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setShowAlertModal(true)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white relative transition-colors"
              title="Active Road & Weather Alerts"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                1
              </span>
            </button>
          </div>
        </header>

        {/* Dropdown Menu when Hamburger clicked */}
        {isMenuOpen && (
          <div className="bg-slate-900 border-b border-slate-800 p-4 space-y-3 animate-fadeIn z-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <div className="font-bold text-sm text-white">{user?.name || 'Authorized User'}</div>
                <div className="text-xs text-emerald-400 font-mono">{user?.role || 'Citizen Driver'}</div>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold"
              >
                Logout
              </button>
            </div>
            <div className="text-xs text-slate-400 space-y-1.5">
              <button
                onClick={onOpenWeatherPrediction}
                className="w-full text-left py-1.5 px-2 rounded-lg bg-blue-600/20 text-cyan-300 font-semibold flex items-center justify-between"
              >
                <span>Open Weather &amp; Landslide Forecast</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] text-slate-500 pt-1">
                Connected to National Geohazard Early Warning Network.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ROUTE SEARCH & ORIGIN / DESTINATION BOX matching Image 2 */}
        {/* ========================================================================= */}
        <section className="px-4 py-3 bg-[#0A1220] border-b border-slate-800/80">
          <div className="flex items-center justify-between gap-3">
            {/* Origin & Destination Inputs */}
            <div className="flex-1 space-y-2">
              {/* Origin */}
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20 shrink-0" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-white focus:outline-none placeholder:text-slate-500"
                    placeholder="Enter starting location"
                  />
                  <div className="text-[10px] text-blue-400 font-medium">Current Location</div>
                </div>
                {origin && (
                  <button onClick={() => setOrigin('')} className="p-1 text-slate-500 hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dotted Connection Line */}
              <div className="pl-1.5 -my-1">
                <div className="w-0.5 h-3 border-l-2 border-dotted border-slate-600" />
              </div>

              {/* Destination */}
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-sm bg-rose-500 ring-4 ring-rose-500/20 shrink-0" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent font-bold text-sm text-white focus:outline-none placeholder:text-slate-500"
                    placeholder="Enter destination"
                  />
                  <div className="text-[10px] text-rose-400 font-medium">Destination</div>
                </div>
                {destination && (
                  <button onClick={() => setDestination('')} className="p-1 text-slate-500 hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Swap Button on Right matching Image 2 */}
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center gap-1 text-emerald-400 shadow-md active:scale-95 transition-all shrink-0"
              title="Swap Locations"
            >
              <ArrowUpDown className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400">Swap</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. VEHICLE MODE SELECTORS matching Image 2 */}
        {/* ========================================================================= */}
        <section className="px-4 py-2.5 bg-[#070E1A] border-b border-slate-800/80">
          <div className="grid grid-cols-4 gap-2">
            {/* Car */}
            <button
              onClick={() => setSelectedVehicle('car')}
              className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'car'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Car className="w-5 h-5" />
              <span className="text-[11px] font-bold">Car</span>
            </button>

            {/* Bike */}
            <button
              onClick={() => setSelectedVehicle('bike')}
              className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'bike'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Bike className="w-5 h-5" />
              <span className="text-[11px] font-bold">Bike</span>
            </button>

            {/* Truck (Selected Active in Screenshot) */}
            <button
              onClick={() => setSelectedVehicle('truck')}
              className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'truck'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Truck className="w-5 h-5 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-400">Truck</span>
            </button>

            {/* Ambulance */}
            <button
              onClick={() => setSelectedVehicle('ambulance')}
              className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                selectedVehicle === 'ambulance'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {/* Cross / Ambulance Icon */}
              <div className="relative">
                <Truck className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 text-[9px] text-rose-400 font-extrabold">+</span>
              </div>
              <span className="text-[11px] font-bold">Ambulance</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MAP VIEW & ROUTE DISPLAY matching Image 2 */}
        {/* ========================================================================= */}
        <section className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-[#0A1322] overflow-hidden flex flex-col justify-between p-3">
          {/* Map Grid Pattern / Satellite Simulated Dark Base */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-85 z-0"
            style={{
              backgroundImage: `url('https://api.maptiler.com/maps/hybrid/static/73.76,18.62,11/800x600.jpg?key=get_your_own_key'), radial-gradient(circle at center, #0e1e38 0%, #060c18 100%)`
            }}
          />

          {/* SVG Road Polyline Overlay (Simulating NH 48 expressway route) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 400" preserveAspectRatio="none">
            {/* Glow Path */}
            <path
              d="M 110,80 Q 150,140 160,200 T 250,320"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            />
            {/* Center animated dash */}
            <path
              d="M 110,80 Q 150,140 160,200 T 250,320"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="opacity-70"
            />
          </svg>

          {/* Top Left: Live Traffic Indicator matching Image 2 */}
          <div className="relative z-20 self-start">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07111E]/90 border border-slate-700/80 text-[11px] font-bold text-slate-200 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Traffic</span>
            </div>
          </div>

          {/* Map Markers on Polyline matching Image 2 */}
          <div className="absolute top-[18%] left-[24%] z-20 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-blue-500/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700 shadow">
              {origin}
            </span>
          </div>

          {/* Route Time & Highway Badges on Map matching Image 2 */}
          <div className="absolute top-[48%] left-[26%] z-20 flex flex-col items-start gap-1">
            <div className="px-2.5 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 font-extrabold text-xs shadow-lg backdrop-blur-md flex flex-col leading-tight">
              <span>{route.duration}</span>
              <span className="text-[10px] font-normal text-emerald-400/90">{route.distance}</span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-emerald-500/40 text-[9px] font-bold text-emerald-400">
              {route.highway}
            </div>
          </div>

          {/* Destination Marker on Polyline matching Image 2 */}
          <div className="absolute bottom-[22%] right-[32%] z-20 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-rose-500 ring-4 ring-rose-500/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded bg-white" />
            </div>
            <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700 shadow">
              {destination}
            </span>
          </div>

          {/* Right Floating Map Controls matching Image 2 */}
          <div className="relative z-20 self-end flex flex-col gap-2">
            <button
              onClick={() => {}}
              className="w-10 h-10 rounded-2xl bg-[#091322]/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 shadow-xl backdrop-blur-md active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => {}}
              className="w-10 h-10 rounded-2xl bg-[#091322]/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 shadow-xl backdrop-blur-md active:scale-95"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => {}}
              className="w-10 h-10 rounded-2xl bg-[#091322]/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-emerald-400 shadow-xl backdrop-blur-md active:scale-95"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SAFE ROUTE BOTTOM CARD & TELEMETRY matching Image 2 */}
        {/* ========================================================================= */}
        <section className="px-4 py-3 bg-[#08101C] border-t border-slate-800/80 space-y-3">
          {/* Main Action Banner: Safe Route & START Button matching Image 2 */}
          <div className="flex items-center justify-between gap-3 bg-[#0C1728] p-3.5 rounded-3xl border border-slate-800 shadow-xl">
            {/* Left: Shield & Route Stats */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-6 h-6 fill-emerald-500/20 stroke-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Safe Route</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {route.safetyBoost}
                  </span>
                </div>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  {route.duration} <span className="text-xs text-slate-400 font-normal">• {route.distance}</span>
                </div>
              </div>
            </div>

            {/* Right: Big Green START Button matching Image 2 */}
            <button
              onClick={() => setIsJourneyStarted(!isJourneyStarted)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-95 transition-all text-center flex flex-col items-center justify-center leading-tight"
            >
              <span>{isJourneyStarted ? 'PAUSE' : 'START'}</span>
              <span className="text-[9px] font-normal text-emerald-100">Let's drive safely</span>
            </button>
          </div>

          {/* 3 Telemetry Summary Badges matching Image 2 */}
          <div className="grid grid-cols-3 gap-2 text-left">
            {/* Hazards Monitored */}
            <div
              onClick={onOpenWeatherPrediction}
              className="cursor-pointer bg-[#0A1424] hover:bg-[#0D1A30] p-2 rounded-2xl border border-slate-800/80 space-y-1 transition-all"
            >
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold text-slate-200">Hazards Monitored</span>
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                Landslide, Flood, Rain
              </div>
            </div>

            {/* Traffic Updates Live */}
            <div className="bg-[#0A1424] p-2 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Radio className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold text-slate-200">Traffic Updates Live</span>
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                Real-time traffic
              </div>
            </div>

            {/* Weather Safe (Clicking opens Weather Prediction as well!) */}
            <div
              onClick={onOpenWeatherPrediction}
              className="cursor-pointer bg-[#0A1424] hover:bg-[#0D1A30] p-2 rounded-2xl border border-slate-800/80 space-y-1 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-cyan-400">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-bounce" />
                <span className="text-[10px] font-bold text-slate-200">Weather Safe</span>
              </div>
              <div className="text-[9px] text-cyan-300/90 leading-tight">
                {weatherData ? `${weatherData.current.weather_description || 'Clear'} • ${Math.round(weatherData.current.temperature)}°C` : 'Light rain • 24°C'}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. BOTTOM NAVIGATION BAR matching Image 2 */}
        {/* ========================================================================= */}
        <nav className="px-2 py-2 bg-[#060C16] border-t border-slate-800/80 sticky bottom-0 z-40">
          <div className="flex items-center justify-around relative">
            {/* Trips */}
            <button
              onClick={() => handleBottomTabClick('trips')}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                activeBottomTab === 'trips' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-medium">Trips</span>
            </button>

            {/* Nearby (CRITICAL: OPENS WEATHER PREDICTION INTERFACE AS REQUESTED!) */}
            <button
              onClick={() => handleBottomTabClick('nearby')}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-all group relative ${
                activeBottomTab === 'nearby' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <div className="p-1 rounded-full group-hover:bg-emerald-500/20 transition-all">
                <MapPin className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-emerald-400">Nearby</span>
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>

            {/* Start Journey (Elevated Center Glowing Button) */}
            <div className="-mt-6 flex flex-col items-center">
              <button
                onClick={() => setIsJourneyStarted(!isJourneyStarted)}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-[#0A1728] flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                </div>
              </button>
              <span className="text-[10px] font-bold text-emerald-400 mt-1">Start Journey</span>
            </div>

            {/* Alerts with Badge 1 */}
            <button
              onClick={() => handleBottomTabClick('alerts')}
              className={`flex flex-col items-center gap-1 py-1 px-3 relative transition-colors ${
                activeBottomTab === 'alerts' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
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
              onClick={() => handleBottomTabClick('road_info')}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                activeBottomTab === 'road_info' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] font-medium">Road Info</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Active Road Hazard Advisory</span>
              </div>
              <button onClick={() => setShowAlertModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1.5">
              <div className="text-xs font-bold text-white">NH 48 Monsoon Caution (Khandala Ghat)</div>
              <div className="text-[11px] text-slate-300">
                Light rainfall with wet road surfaces. Slope monitoring active for rockfall mitigation.
              </div>
            </div>
            <button
              onClick={() => { setShowAlertModal(false); onOpenWeatherPrediction(); }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
            >
              Inspect Live Weather &amp; Landslide Forecast
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
