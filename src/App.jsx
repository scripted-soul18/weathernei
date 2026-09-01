import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Bot, 
  Layers, 
  Sprout, 
  ShieldAlert, 
  Anchor, 
  Activity, 
  FileText,
  Radio,
  Sparkles,
  Info
} from 'lucide-react';
import Navbar from './components/Navbar';
import WeatherCanvas from './components/WeatherCanvas';
import LiveWeatherDashboard from './components/LiveWeatherDashboard';
import ChatInterface from './components/ChatInterface';
import InteractiveMap from './components/InteractiveMap';
import AgrometAdvisory from './components/AgrometAdvisory';
import DisasterAlertCenter from './components/DisasterAlertCenter';
import MarineWeather from './components/MarineWeather';
import AQIAnalytics from './components/AQIAnalytics';
import BulletinGeneratorModal from './components/BulletinGeneratorModal';

import { INDIAN_LOCATIONS } from './data/indianLocations';
import { fetchLiveWeatherData } from './services/weatherService';
import { getTranslation } from './services/translationService';

export default function App() {
  // Default to New Delhi or first curated Indian Met Station
  const [selectedLocation, setSelectedLocation] = useState(INDIAN_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [currentPersona, setCurrentPersona] = useState("citizen");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'chat', 'gisMap', 'agromet', 'alerts', 'marine', 'aqi'
  const [initialChatQuery, setInitialChatQuery] = useState("");
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const t = getTranslation(currentLanguage);

  // Fetch real-time weather whenever selected location changes
  const loadWeather = async (loc = selectedLocation) => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveWeatherData(loc.lat, loc.lon, loc.name);
      setWeatherData(data);
    } catch (err) {
      console.error("Failed to load meteorological data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  // Handle asking questions from any sub-component into WeatherGPT Chat
  const handleAskQuestion = (questionText) => {
    setInitialChatQuery(questionText);
    setActiveTab("chat");
  };

  const navTabs = [
    { id: "overview", label: t.tabs.overview, icon: CloudSun },
    { id: "chat", label: t.tabs.chat, icon: Bot, badge: "AI Assistant" },
    { id: "gisMap", label: t.tabs.gisMap, icon: Layers },
    { id: "agromet", label: t.tabs.agromet, icon: Sprout },
    { id: "alerts", label: t.tabs.alerts, icon: ShieldAlert, alertBadge: "3 Active" },
    { id: "marine", label: t.tabs.marine, icon: Anchor },
    { id: "aqi", label: t.tabs.aqi, icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Ambient Animated Weather Canvas Particles */}
      <WeatherCanvas weatherType={weatherData?.current?.wmo?.bg || "sunny"} />

      {/* Main Top Navigation */}
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        currentPersona={currentPersona}
        onChangePersona={(p) => setCurrentPersona(p)}
        currentLanguage={currentLanguage}
        onChangeLanguage={(lang) => setCurrentLanguage(lang)}
        onOpenBulletinModal={() => setIsBulletinModalOpen(true)}
        onRefreshWeather={() => loadWeather(selectedLocation)}
        isRefreshing={isRefreshing}
      />

      {/* Main App Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-slate-800/80 overflow-x-auto no-scrollbar shadow-lg">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950">
                    {tab.badge}
                  </span>
                )}
                {tab.alertBadge && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">
                    {tab.alertBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        {weatherData && (
          <div>
            {activeTab === "overview" && (
              <LiveWeatherDashboard
                weatherData={weatherData}
                currentLanguage={currentLanguage}
                onAskQuestion={handleAskQuestion}
              />
            )}

            {activeTab === "chat" && (
              <ChatInterface
                weatherData={weatherData}
                currentPersona={currentPersona}
                onChangePersona={setCurrentPersona}
                currentLanguage={currentLanguage}
                initialQuery={initialChatQuery}
                onClearInitialQuery={() => setInitialChatQuery("")}
              />
            )}

            {activeTab === "gisMap" && (
              <InteractiveMap
                selectedLocation={selectedLocation}
                onSelectStation={(loc) => setSelectedLocation(loc)}
              />
            )}

            {activeTab === "agromet" && (
              <AgrometAdvisory
                weatherData={weatherData}
                onAskAgrometQuestion={handleAskQuestion}
              />
            )}

            {activeTab === "alerts" && (
              <DisasterAlertCenter
                onAskDisasterQuestion={handleAskQuestion}
              />
            )}

            {activeTab === "marine" && (
              <MarineWeather
                weatherData={weatherData}
                onAskMarineQuestion={handleAskQuestion}
              />
            )}

            {activeTab === "aqi" && (
              <AQIAnalytics
                aqiData={weatherData.aqi}
                locationName={weatherData.location.name}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-800/80 text-center text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-400">
            WeatherGPT • Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD)
          </p>
          <p className="text-[11px] text-slate-500">
            Powered by Open-Meteo Synoptic Reanalysis, IMD Warning Matrices, Web Speech API & Conversational AI Suite
          </p>
        </footer>
      </main>

      {/* Official IMD Meteorological Bulletin Modal */}
      <BulletinGeneratorModal
        isOpen={isBulletinModalOpen}
        onClose={() => setIsBulletinModalOpen(false)}
        weatherData={weatherData}
      />
    </div>
  );
}
