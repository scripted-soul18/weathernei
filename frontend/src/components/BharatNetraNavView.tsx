import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
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
  Sparkles,
  Zap,
  Info,
  Search,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { WeatherForecastResponse, LandslidePredictionResponse } from '../types';
import {
  safeRouteEngine,
  VehicleType,
  SafeRouteAnalysisResult,
  LocationSuggestion,
  Coordinate
} from '../services/safeRouteEngine';

interface BharatNetraNavViewProps {
  user: { name: string; role: string; emailOrPhone: string } | null;
  weatherData: WeatherForecastResponse | null;
  predictionData: LandslidePredictionResponse | null;
  onOpenWeatherPrediction: () => void;
  onLogout: () => void;
  onSelectCoordinates?: (lat: number, lon: number, name: string) => void;
}

type BottomTab = 'trips' | 'nearby' | 'start' | 'alerts' | 'road_info';

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

  // Locations state
  const [origin, setOrigin] = useState('Pune');
  const [destination, setDestination] = useState('Talegaon');
  const [originCoords, setOriginCoords] = useState<Coordinate>({ lat: 18.5204, lon: 73.8567 });
  const [destCoords, setDestCoords] = useState<Coordinate>({ lat: 18.7297, lon: 73.6749 });

  // Autocomplete suggestions
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeInput, setActiveInput] = useState<'origin' | 'dest' | null>(null);

  // Safe Route Analysis State
  const [analysisResult, setAnalysisResult] = useState<SafeRouteAnalysisResult | null>(null);
  const [selectedRouteType, setSelectedRouteType] = useState<'safe' | 'alternate'>('safe');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // UI Modals & Navigation state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  // Leaflet Map Refs
  const navMapContainerRef = useRef<HTMLDivElement>(null);
  const navMapRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Real Leaflet Map
  useEffect(() => {
    if (!navMapContainerRef.current || navMapRef.current) return;

    const map = L.map(navMapContainerRef.current, {
      center: [originCoords.lat, originCoords.lon],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 19
    });

    // Dark Satellite / Hybrid Tiles (Zero watermark, fast and responsive)
    L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20
    }).addTo(map);

    routeLayerGroupRef.current = L.layerGroup().addTo(map);
    navMapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      navMapRef.current = null;
    };
  }, []);

  // 2. Perform Safe Route Analysis whenever origin, destination, vehicle, or risk changes
  useEffect(() => {
    let isMounted = true;
    setIsCalculatingRoute(true);

    safeRouteEngine
      .analyzeRoute(
        origin,
        destination,
        selectedVehicle,
        predictionData?.risk_level || 'MODERATE',
        originCoords,
        destCoords
      )
      .then((res) => {
        if (isMounted) {
          setAnalysisResult(res);
          setIsCalculatingRoute(false);
        }
      })
      .catch((err) => {
        console.error('Failed to compute safe route:', err);
        if (isMounted) setIsCalculatingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [origin, destination, selectedVehicle, originCoords, destCoords, predictionData?.risk_level]);

  // 3. Render Route & Hazard Overlays on Leaflet Map
  useEffect(() => {
    if (!navMapRef.current || !routeLayerGroupRef.current || !analysisResult) return;

    const layerGroup = routeLayerGroupRef.current;
    layerGroup.clearLayers();

    const currentRoute =
      selectedRouteType === 'safe'
        ? analysisResult.recommendedRoute
        : analysisResult.alternateRoutes[0] || analysisResult.recommendedRoute;

    // Draw background path (for alternate route preview)
    if (analysisResult.alternateRoutes.length > 0 && selectedRouteType === 'safe') {
      const altPolyline = L.polyline(analysisResult.alternateRoutes[0].path, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.45,
        dashArray: '8, 8'
      });
      layerGroup.addLayer(altPolyline);
    }

    // Draw Primary Selected Route Polyline
    const routeColor = selectedRouteType === 'safe' ? '#10b981' : '#f59e0b';
    const glowPolyline = L.polyline(currentRoute.path, {
      color: routeColor,
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });

    const innerPolyline = L.polyline(currentRoute.path, {
      color: '#ffffff',
      weight: 2,
      opacity: 0.8,
      dashArray: '5, 5'
    });

    layerGroup.addLayer(glowPolyline);
    layerGroup.addLayer(innerPolyline);

    // Draw Hazard Markers on Map
    analysisResult.detectedHazards.forEach((hazard) => {
      const hazardCircle = L.circleMarker([hazard.location.lat, hazard.location.lon], {
        radius: 12,
        fillColor: '#ef4444',
        color: '#ffffff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.75
      });
      hazardCircle.bindTooltip(
        `<div style="font-family: Inter, sans-serif; font-size: 11px; padding: 2px;">
          <strong style="color: #ef4444;">⚠️ GEOHAZARD DETECTED</strong><br/>
          ${hazard.description}<br/>
          <span style="color: #10b981; font-weight: bold;">Safe Route Bypassing This Hazard</span>
        </div>`,
        { direction: 'top', offset: [0, -10] }
      );
      layerGroup.addLayer(hazardCircle);
    });

    // Draw Origin Marker (Blue pulsing circle)
    const origIcon = L.divIcon({
      className: 'nav-origin-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #3b82f6; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(59,130,246,0.9); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
          </div>
          <span style="margin-top: 3px; background: rgba(15,23,42,0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #475569; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.6); font-family: Inter, sans-serif;">
            ${origin.split(',')[0]}
          </span>
        </div>
      `,
      iconSize: [30, 45],
      iconAnchor: [15, 11]
    });

    const origMarker = L.marker([analysisResult.originCoords.lat, analysisResult.originCoords.lon], {
      icon: origIcon
    });
    layerGroup.addLayer(origMarker);

    // Draw Destination Marker (Red pin)
    const destIcon = L.divIcon({
      className: 'nav-dest-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #ef4444; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(239,68,68,0.9); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 2px; background: #ffffff;"></div>
          </div>
          <span style="margin-top: 3px; background: rgba(15,23,42,0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #475569; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.6); font-family: Inter, sans-serif;">
            ${destination.split(',')[0]}
          </span>
        </div>
      `,
      iconSize: [30, 45],
      iconAnchor: [15, 11]
    });

    const destMarker = L.marker([analysisResult.destCoords.lat, analysisResult.destCoords.lon], {
      icon: destIcon
    });
    layerGroup.addLayer(destMarker);

    // Fit map bounds to show route
    if (currentRoute.path.length > 0) {
      navMapRef.current.fitBounds(glowPolyline.getBounds(), {
        padding: [45, 45],
        maxZoom: 14
      });
    }
  }, [analysisResult, selectedRouteType]);

  // Autocomplete Search Handlers
  const handleOriginChange = (val: string) => {
    setOrigin(val);
    setActiveInput('origin');
    if (val.length >= 2) {
      safeRouteEngine.searchLocation(val).then(setOriginSuggestions);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestChange = (val: string) => {
    setDestination(val);
    setActiveInput('dest');
    if (val.length >= 2) {
      safeRouteEngine.searchLocation(val).then(setDestSuggestions);
    } else {
      setDestSuggestions([]);
    }
  };

  const selectOriginSuggestion = (sug: LocationSuggestion) => {
    setOrigin(sug.shortName);
    setOriginCoords({ lat: sug.lat, lon: sug.lon });
    setOriginSuggestions([]);
    setActiveInput(null);
    if (onSelectCoordinates) {
      onSelectCoordinates(sug.lat, sug.lon, sug.displayName);
    }
  };

  const selectDestSuggestion = (sug: LocationSuggestion) => {
    setDestination(sug.shortName);
    setDestCoords({ lat: sug.lat, lon: sug.lon });
    setDestSuggestions([]);
    setActiveInput(null);
  };

  const handleSwap = () => {
    const tempName = origin;
    const tempCoords = originCoords;
    setOrigin(destination);
    setOriginCoords(destCoords);
    setDestination(tempName);
    setDestCoords(tempCoords);
  };

  const handlePresetSelect = (pOrigin: string, pDest: string) => {
    const origC = safeRouteEngine.resolveCoordinates(pOrigin);
    const destC = safeRouteEngine.resolveCoordinates(pDest);
    setOrigin(pOrigin);
    setDestination(pDest);
    setOriginCoords(origC);
    setDestCoords(destC);
    if (onSelectCoordinates) {
      onSelectCoordinates(origC.lat, origC.lon, pOrigin);
    }
  };

  const handleBottomTabClick = (tab: BottomTab) => {
    setActiveBottomTab(tab);
    if (tab === 'nearby') {
      onOpenWeatherPrediction();
    } else if (tab === 'alerts') {
      setShowAlertModal(true);
    }
  };

  const activeRoute =
    analysisResult && selectedRouteType === 'safe'
      ? analysisResult.recommendedRoute
      : analysisResult?.alternateRoutes[0] || analysisResult?.recommendedRoute;

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#050B14] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative overflow-x-hidden font-sans transition-colors duration-300">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-[#050B14] dark:via-[#091220] dark:to-[#040812] pointer-events-none z-0 transition-colors duration-300" />

      {/* Main Container - Centered Mobile Layout */}
      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col justify-between bg-white dark:bg-[#070E1A] shadow-2xl border-x border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR matching Image 2 */}
        {/* ========================================================================= */}
        <header className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 bg-white/95 dark:bg-[#070E1A]/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
          {/* Left: Menu & Brand Shield */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Bharat Netra Shield Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/40 border-2 border-emerald-500/80 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Shield className="w-5 h-5 fill-emerald-500/20 stroke-emerald-500 dark:stroke-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    Bharat
                  </span>
                  <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                    नेत्र
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                  Safer Roads • Stronger Bharat
                </div>
              </div>
            </div>
          </div>

          {/* Right: Theme Toggle & Alerts Bell */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-cyan-300" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            <button
              onClick={() => setShowAlertModal(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative transition-colors"
              title="Active Road & Weather Alerts"
            >
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {analysisResult?.detectedHazards.length || 1}
              </span>
            </button>
          </div>
        </header>

        {/* Dropdown Menu when Hamburger clicked */}
        {isMenuOpen && (
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-fadeIn z-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{user?.name || 'Authorized User'}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">{user?.role || 'Citizen Driver'}</div>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
            {/* Quick Corridors Selection */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Popular Disaster &amp; Highway Corridors
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { handlePresetSelect('Pune', 'Talegaon'); setIsMenuOpen(false); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors"
                >
                  Pune ⇄ Talegaon (NH 48)
                </button>
                <button
                  onClick={() => { handlePresetSelect('Shimla', 'Manali'); setIsMenuOpen(false); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors"
                >
                  Shimla ⇄ Manali (NH 5)
                </button>
                <button
                  onClick={() => { handlePresetSelect('Mumbai', 'Pune'); setIsMenuOpen(false); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors"
                >
                  Mumbai ⇄ Pune (Expressway)
                </button>
                <button
                  onClick={() => { handlePresetSelect('Dehradun', 'Mussoorie'); setIsMenuOpen(false); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors"
                >
                  Dehradun ⇄ Mussoorie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ROUTE SEARCH & LIVE AUTOCOMPLETE INPUTS */}
        {/* ========================================================================= */}
        <section className="px-4 py-3 bg-slate-50 dark:bg-[#0A1220] border-b border-slate-200 dark:border-slate-800/80 relative transition-colors duration-300">
          <div className="flex items-center justify-between gap-3">
            {/* Inputs Column */}
            <div className="flex-1 space-y-2 relative">
              {/* Origin Search */}
              <div className="relative flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20 shrink-0" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    onFocus={() => setActiveInput('origin')}
                    className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="Enter starting location in India"
                  />
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Pickup Point</div>
                </div>
                {origin && (
                  <button onClick={() => setOrigin('')} className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Origin Autocomplete Dropdown */}
              {activeInput === 'origin' && originSuggestions.length > 0 && (
                <div className="absolute top-10 left-0 right-0 z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 space-y-1">
                  {originSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectOriginSuggestion(sug)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 dark:text-white">{sug.shortName}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">{sug.displayName}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Dotted Connection Line */}
              <div className="pl-1.5 -my-1">
                <div className="w-0.5 h-3 border-l-2 border-dotted border-slate-300 dark:border-slate-600" />
              </div>

              {/* Destination Search */}
              <div className="relative flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-sm bg-rose-500 ring-4 ring-rose-500/20 shrink-0" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => handleDestChange(e.target.value)}
                    onFocus={() => setActiveInput('dest')}
                    className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="Enter destination"
                  />
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">Dropoff Destination</div>
                </div>
                {destination && (
                  <button onClick={() => setDestination('')} className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Destination Autocomplete Dropdown */}
              {activeInput === 'dest' && destSuggestions.length > 0 && (
                <div className="absolute top-20 left-0 right-0 z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 space-y-1">
                  {destSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectDestSuggestion(sug)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-900 dark:text-white">{sug.shortName}</span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">{sug.displayName}</span>
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button on Right */}
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-md active:scale-95 transition-all shrink-0"
              title="Swap Origin and Destination"
            >
              <ArrowUpDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Swap</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. VEHICLE MODE SELECTORS */}
        {/* ========================================================================= */}
        <section className="px-4 py-2 bg-white dark:bg-[#070E1A] border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
          <div className="grid grid-cols-4 gap-2">
            {/* Car */}
            <button
              onClick={() => setSelectedVehicle('car')}
              className={`py-2 px-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                selectedVehicle === 'car'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-700 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-100 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="text-[10px] font-bold">Car</span>
            </button>

            {/* Bike */}
            <button
              onClick={() => setSelectedVehicle('bike')}
              className={`py-2 px-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                selectedVehicle === 'bike'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-700 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-100 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span className="text-[10px] font-bold">Bike</span>
            </button>

            {/* Truck */}
            <button
              onClick={() => setSelectedVehicle('truck')}
              className={`py-2 px-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                selectedVehicle === 'truck'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-700 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-100 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Truck</span>
            </button>

            {/* Ambulance */}
            <button
              onClick={() => setSelectedVehicle('ambulance')}
              className={`py-2 px-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                selectedVehicle === 'ambulance'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 text-emerald-700 dark:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-100 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="relative">
                <Truck className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 text-[8px] text-rose-500 font-extrabold">+</span>
              </div>
              <span className="text-[10px] font-bold">Ambulance</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. REAL INTERACTIVE LEAFLET ROAD MAP SECTION */}
        {/* ========================================================================= */}
        <section className="relative flex-1 min-h-[350px] sm:min-h-[400px] bg-slate-200 dark:bg-[#0A1322] overflow-hidden flex flex-col justify-between p-3">
          {/* Leaflet Map Canvas */}
          <div
            ref={navMapContainerRef}
            className="absolute inset-0 w-full h-full z-0"
            id="bharat-netra-nav-leaflet-map"
          />

          {/* Top Controls Overlay on Map */}
          <div className="relative z-20 flex items-center justify-between w-full pointer-events-none">
            {/* Live Traffic Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#07111E]/90 border border-slate-200 dark:border-slate-700/80 text-[11px] font-bold text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-lg pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>{isCalculatingRoute ? 'Calculating Live Route...' : 'Live Safe Traffic'}</span>
            </div>

            {/* Route Option Switcher (Safe vs Alternate Direct) */}
            {analysisResult && analysisResult.alternateRoutes.length > 0 && (
              <div className="flex items-center gap-1 bg-white/95 dark:bg-[#091322]/90 border border-slate-200 dark:border-slate-700/80 p-0.5 rounded-xl backdrop-blur-md pointer-events-auto shadow-lg">
                <button
                  onClick={() => setSelectedRouteType('safe')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    selectedRouteType === 'safe'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Safe Route
                </button>
                <button
                  onClick={() => setSelectedRouteType('alternate')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    selectedRouteType === 'alternate'
                      ? 'bg-amber-500 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Shortcut
                </button>
              </div>
            )}
          </div>

          {/* Floating Route Info Badge on Map */}
          {activeRoute && (
            <div className="absolute top-[44%] left-[16%] z-20 flex flex-col items-start gap-1 pointer-events-auto">
              <div className="px-2.5 py-1.5 rounded-xl bg-emerald-900/90 dark:bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 dark:text-emerald-300 font-extrabold text-xs shadow-lg backdrop-blur-md flex flex-col leading-tight">
                <span>{activeRoute.durationMin} min</span>
                <span className="text-[10px] font-normal text-emerald-300/90 dark:text-emerald-400/90">{activeRoute.distanceKm} km</span>
              </div>
              <div className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-emerald-500/40 text-[9px] font-bold text-emerald-300">
                {activeRoute.highway}
              </div>
            </div>
          )}

          {/* Right Floating Working Map Controls */}
          <div className="relative z-20 self-end flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={() => navMapRef.current?.zoomIn()}
              className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-100 dark:bg-[#091322]/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-xl backdrop-blur-md active:scale-95 transition-colors"
              title="Zoom In"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => navMapRef.current?.zoomOut()}
              className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-100 dark:bg-[#091322]/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-xl backdrop-blur-md active:scale-95 transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (navMapRef.current && analysisResult) {
                  navMapRef.current.flyTo(
                    [analysisResult.originCoords.lat, analysisResult.originCoords.lon],
                    13,
                    { duration: 1 }
                  );
                }
              }}
              className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-100 dark:bg-[#091322]/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xl backdrop-blur-md active:scale-95 transition-colors"
              title="Recenter Map on Origin"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SAFE ROUTE BOTTOM CARD & TELEMETRY */}
        {/* ========================================================================= */}
        <section className="px-4 py-3 bg-slate-50 dark:bg-[#08101C] border-t border-slate-200 dark:border-slate-800/80 space-y-2.5 transition-colors duration-300">
          {/* Main Action Banner: Safe Route & START Button */}
          <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#0C1728] p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl">
            {/* Left: Shield & Route Stats */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Shield className="w-6 h-6 fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {selectedRouteType === 'safe' ? 'Safe Route' : 'Direct Shortcut'}
                  </span>
                  {activeRoute && activeRoute.safetyGainPercent > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      +{activeRoute.safetyGainPercent}% Safer
                    </span>
                  )}
                </div>
                <div className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {activeRoute?.durationMin || 35} min{' '}
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                    • {activeRoute?.distanceKm || 35.1} km
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Big Green START Button */}
            <button
              onClick={() => setIsJourneyStarted(!isJourneyStarted)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-95 transition-all text-center flex flex-col items-center justify-center leading-tight shrink-0"
            >
              <span>{isJourneyStarted ? 'PAUSE' : 'START'}</span>
              <span className="text-[8px] font-normal text-emerald-100">Live Guidance</span>
            </button>
          </div>

          {/* Vehicle Constraint Notice if applicable */}
          {activeRoute?.vehicleConstraints.notice && (
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">{activeRoute.vehicleConstraints.notice}</span>
            </div>
          )}

          {/* 3 Telemetry Summary Badges */}
          <div className="grid grid-cols-3 gap-2 text-left">
            {/* Hazards Monitored */}
            <div
              onClick={onOpenWeatherPrediction}
              className="cursor-pointer bg-white hover:bg-slate-100 dark:bg-[#0A1424] dark:hover:bg-[#0D1A30] p-2 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1 transition-all shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Hazards Monitored</span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight truncate">
                {activeRoute && activeRoute.hazardsAvoided.length > 0
                  ? activeRoute.hazardsAvoided[0]
                  : 'Landslide, Flood, Rain'}
              </div>
            </div>

            {/* Traffic Updates Live */}
            <div className="bg-white dark:bg-[#0A1424] p-2 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Radio className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Traffic Updates</span>
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                Real-time routing
              </div>
            </div>

            {/* Weather Safe */}
            <div
              onClick={onOpenWeatherPrediction}
              className="cursor-pointer bg-white hover:bg-slate-100 dark:bg-[#0A1424] dark:hover:bg-[#0D1A30] p-2 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                <CloudRain className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 group-hover:animate-bounce shrink-0" />
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Weather Safe</span>
              </div>
              <div className="text-[9px] text-cyan-700 dark:text-cyan-300/90 leading-tight truncate font-medium">
                {weatherData
                  ? `${weatherData.current.weather_description || 'Clear'} • ${Math.round(
                      weatherData.current.temperature
                    )}°C`
                  : 'Light rain • 24°C'}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. BOTTOM NAVIGATION BAR matching Image 2 */}
        {/* ========================================================================= */}
        <nav className="px-2 py-2 bg-white dark:bg-[#060C16] border-t border-slate-200 dark:border-slate-800/80 sticky bottom-0 z-40 transition-colors duration-300">
          <div className="flex items-center justify-around relative">
            {/* Trips */}
            <button
              onClick={() => handleBottomTabClick('trips')}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                activeBottomTab === 'trips' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-medium">Trips</span>
            </button>

            {/* Nearby (CRITICAL: OPENS WEATHER PREDICTION INTERFACE) */}
            <button
              onClick={() => handleBottomTabClick('nearby')}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-all group relative ${
                activeBottomTab === 'nearby' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300'
              }`}
            >
              <div className="p-1 rounded-full group-hover:bg-emerald-500/20 transition-all">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Nearby</span>
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
            </button>

            {/* Start Journey (Elevated Center Glowing Button) */}
            <div className="-mt-6 flex flex-col items-center">
              <button
                onClick={() => setIsJourneyStarted(!isJourneyStarted)}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-[#0A1728] flex items-center justify-center shadow-inner">
                  <Navigation className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                </div>
              </button>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Start Journey</span>
            </div>

            {/* Alerts with Badge */}
            <button
              onClick={() => handleBottomTabClick('alerts')}
              className={`flex flex-col items-center gap-1 py-1 px-3 relative transition-colors ${
                activeBottomTab === 'alerts' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {analysisResult?.detectedHazards.length || 1}
                </span>
              </div>
              <span className="text-[10px] font-medium">Alerts</span>
            </button>

            {/* Road Info */}
            <button
              onClick={() => handleBottomTabClick('road_info')}
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                activeBottomTab === 'road_info' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-[10px] font-medium">Road Info</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Active Road Hazard Advisory Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Active Road Hazard Advisory</span>
              </div>
              <button onClick={() => setShowAlertModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/30 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {activeRoute?.highway || 'Highway'} Corridor Status
              </div>
              {analysisResult?.detectedHazards.map((hz, i) => (
                <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-rose-500">⚠️</span>
                  <span>{hz.description}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowAlertModal(false); onOpenWeatherPrediction(); }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-colors"
            >
              Inspect Live Weather &amp; Landslide Forecast
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
