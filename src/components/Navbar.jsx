import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudLightning, 
  Search, 
  MapPin, 
  Globe, 
  User, 
  Sprout, 
  ShieldAlert, 
  Anchor, 
  Plane, 
  Volume2, 
  VolumeX, 
  Sparkles,
  FileText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { INDIAN_LOCATIONS } from '../data/indianLocations';
import { ACTIVE_DISTRICT_ALERTS } from '../data/imdAlertsData';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translationService';
import { searchGeocodingLocations } from '../services/weatherService';

export default function Navbar({
  selectedLocation,
  onSelectLocation,
  currentPersona,
  onChangePersona,
  currentLanguage,
  onChangeLanguage,
  onOpenBulletinModal,
  onRefreshWeather,
  isRefreshing
}) {
  const t = getTranslation(currentLanguage);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [audioSirenEnabled, setAudioSirenEnabled] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for locations
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      // First check local Indian locations
      const localMatches = INDIAN_LOCATIONS.filter(
        loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               loc.state.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4);

      // Also query Geocoding API for exact village/district match
      const remoteMatches = await searchGeocodingLocations(searchQuery);
      
      const combined = [
        ...localMatches.map(l => ({ ...l, isLocal: true, displayName: `${l.name}, ${l.state}` })),
        ...remoteMatches.filter(r => !localMatches.some(l => l.name.toLowerCase() === r.name.toLowerCase()))
      ];

      setSearchResults(combined.slice(0, 6));
      setIsSearching(false);
      setIsSearchOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelectLocation({
            name: "My GPS Location",
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            elevation: "Detected"
          });
        },
        (err) => {
          alert("Location access denied or unavailable. Using default station.");
        }
      );
    }
  };

  const personas = [
    { id: "citizen", label: t.personas.citizen, icon: User, color: "text-sky-400" },
    { id: "kisan", label: t.personas.kisan, icon: Sprout, color: "text-emerald-400" },
    { id: "disaster", label: t.personas.disaster, icon: ShieldAlert, color: "text-red-400" },
    { id: "marine", label: t.personas.marine, icon: Anchor, color: "text-cyan-400" },
    { id: "aviation", label: t.personas.aviation, icon: Plane, color: "text-amber-400" }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b1120]/85 border-b border-slate-800/80 transition-all">
      {/* Top Disaster Alert Ticker */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border-b border-red-500/30 px-3 py-1 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="flex items-center gap-1 bg-red-600/90 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> IMD Early Warning
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee pl-4 text-xs font-medium text-slate-200">
              🔴 <strong className="text-red-400">RED ALERT:</strong> Extremely Heavy Rainfall in Balasore & Bhadrak (Odisha) | 
              🟠 <strong className="text-orange-400">ORANGE ALERT:</strong> Heavy Rain with High Tide in Mumbai Suburban & Thane | 
              🌀 <strong className="text-cyan-400">CYCLONE WATCH:</strong> Severe Storm 'SAGAR-DEEP' 190 km SE of Paradip | 
              🌾 <strong className="text-emerald-400">AGROMET:</strong> Spraying advisory active for Punjab & Haryana wheat zones.
            </div>
          </div>
        </div>

        <button 
          onClick={() => setAudioSirenEnabled(!audioSirenEnabled)}
          title={audioSirenEnabled ? "Audio Warning Alerts Active" : "Mute Audio Alerts"}
          className={`ml-3 px-2 py-0.5 rounded text-[11px] flex items-center gap-1 border transition-colors ${
            audioSirenEnabled ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          {audioSirenEnabled ? <Volume2 className="w-3 h-3 text-red-400 animate-bounce" /> : <VolumeX className="w-3 h-3" />}
          <span className="hidden sm:inline">{audioSirenEnabled ? "Siren ON" : "Alert Audio"}</span>
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Government Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <CloudLightning className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b1120] animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b1120]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-display">
                  Weather<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">GPT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  MoES / IMD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Ministry of Earth Sciences • India Meteorological Dept
              </p>
            </div>
          </div>

          {/* Quick Bulletin Modal Trigger (Mobile & Desktop) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenBulletinModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5" /> Bulletin
            </button>
          </div>
        </div>

        {/* Center: Search City / District */}
        <div className="relative w-full md:max-w-md" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setIsSearchOpen(true)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                onClick={handleUseCurrentLocation}
                title="Use GPS Current Location"
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={onRefreshWeather}
                disabled={isRefreshing}
                title="Refresh Live Meteorological Data"
                className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
              {searchResults.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation(loc);
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-200 hover:bg-cyan-950/40 hover:text-cyan-300 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-medium">{loc.displayName || loc.name}</span>
                  </div>
                  {loc.agroZone && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                      {loc.agroZone}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Language Dropdown & Official Bulletin Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-2.5 py-1.5 rounded-xl">
            <Globe className="w-4 h-4 text-cyan-400" />
            <select
              value={currentLanguage}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Official IMD Bulletin Button */}
          <button
            onClick={onOpenBulletinModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official IMD Bulletin</span>
          </button>
        </div>
      </div>

      {/* Persona Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/40">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Mode:
        </span>
        {personas.map((p) => {
          const Icon = p.icon;
          const isActive = currentPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangePersona(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/40 to-blue-600/40 text-white border border-cyan-400/60 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? p.color : 'text-slate-400'}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
