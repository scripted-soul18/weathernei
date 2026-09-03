import React, { useEffect, useState, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { VehicleLanguageOnboarding } from './components/VehicleLanguageOnboarding';
import { AuthScreen } from './components/AuthScreen';
import { BharatNetraNavView } from './components/BharatNetraNavView';
import { WeatherPredictionMobile } from './components/WeatherPredictionMobile';
import { SavedLocationsDrawer } from './components/SavedLocationsDrawer';
import { MobileAppWrapper } from './components/MobileAppWrapper';
import { ThemeProvider } from './context/ThemeContext';
import {
  WeatherForecastResponse,
  LandslidePredictionResponse,
  RiskMapResponse,
  PredictionTimelineResponse,
  AlertItem
} from './types';
import {
  fetchWeather,
  predictLandslide,
  fetchRiskMap,
  fetchTimeline,
  fetchLocationName,
  fetchAlerts
} from './services/api';

// Default initial location: Pune / Shimla
const DEFAULT_LAT = 18.5204;
const DEFAULT_LON = 73.8567;
const DEFAULT_NAME = 'Pune, Maharashtra, India';

interface UserProfile {
  name: string;
  role: string;
  emailOrPhone: string;
  language?: string;
  vehicle?: string;
}

type ActiveView = 'splash' | 'onboarding' | 'auth' | 'navigation' | 'weather_prediction';

function MainAppContent() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bharat_netra_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Selected Preferences during Onboarding
  const [userPreferences, setUserPreferences] = useState<{ language: string; vehicle: string }>({
    language: 'en',
    vehicle: 'car'
  });

  const [activeView, setActiveView] = useState<ActiveView>(currentUser ? 'navigation' : 'splash');
  const [lat, setLat] = useState<number>(DEFAULT_LAT);
  const [lon, setLon] = useState<number>(DEFAULT_LON);
  const [locationName, setLocationName] = useState<string>(DEFAULT_NAME);

  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [predictionData, setPredictionData] = useState<LandslidePredictionResponse | null>(null);
  const [riskMapData, setRiskMapData] = useState<RiskMapResponse | null>(null);
  const [timelineData, setTimelineData] = useState<PredictionTimelineResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);

  // Load all data for target coordinates
  const loadDataForLocation = useCallback(
    async (
      targetLat: number,
      targetLon: number,
      nameOverride?: string,
      customSimParams?: { rainfall_24h?: number; slope?: number; soil_moisture?: number }
    ) => {
      setIsLoading(true);

      try {
        const [wData, pData, rData, tData, locInfo, activeAlerts] = await Promise.all([
          fetchWeather(targetLat, targetLon).catch(() => null),
          predictLandslide({
            latitude: targetLat,
            longitude: targetLon,
            ...customSimParams,
          }).catch(() => null),
          fetchRiskMap(targetLat, targetLon).catch(() => null),
          fetchTimeline(targetLat, targetLon).catch(() => null),
          nameOverride ? Promise.resolve({ display_name: nameOverride }) : fetchLocationName(targetLat, targetLon).catch(() => null),
          fetchAlerts().catch(() => []),
        ]);

        if (wData) setWeatherData(wData);
        if (pData) setPredictionData(pData);
        if (rData) setRiskMapData(rData);
        if (tData) setTimelineData(tData);
        if (locInfo?.display_name) setLocationName(locInfo.display_name);
        setAlerts(activeAlerts);
      } catch (err) {
        console.error('Failed to load weather analysis data:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDataForLocation(lat, lon, locationName);
  }, [lat, lon]);

  const handleSelectCoordinates = (newLat: number, newLon: number, name?: string) => {
    setLat(newLat);
    setLon(newLon);
    if (name) setLocationName(name);
  };

  const handleSimulate = (params: { rainfall_24h?: number; slope?: number; soil_moisture?: number }) => {
    loadDataForLocation(lat, lon, locationName, params);
  };

  const handleRefresh = () => {
    loadDataForLocation(lat, lon, locationName);
  };

  const handleOnboardingContinue = (prefs: { language: string; vehicle: string }) => {
    setUserPreferences(prefs);
    setActiveView('auth');
  };

  const handleLoginSuccess = (userProfile: { name: string; role: string; emailOrPhone: string }) => {
    const fullProfile: UserProfile = {
      ...userProfile,
      ...userPreferences
    };
    setCurrentUser(fullProfile);
    localStorage.setItem('bharat_netra_user', JSON.stringify(fullProfile));
    setActiveView('navigation');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bharat_netra_user');
    setActiveView('splash');
  };

  return (
    <MobileAppWrapper>
      {/* 1. SPLASH SCREEN (Matching Image 1: India Night Satellite Map + BHARAT नेत्र + GET STARTED) */}
      {activeView === 'splash' && (
        <SplashScreen onGetStarted={() => setActiveView('onboarding')} />
      )}

      {/* 2. VEHICLE & LANGUAGE ONBOARDING (Matching Image 2: 6 Languages + 4 Vehicle Cards + Continue Button) */}
      {activeView === 'onboarding' && (
        <VehicleLanguageOnboarding
          onBack={() => setActiveView('splash')}
          onContinue={handleOnboardingContinue}
        />
      )}

      {/* 3. WELCOME & AUTH SCREEN (Matching Image 3: Email / Mobile OTP / Gov Authority Credentials) */}
      {activeView === 'auth' && (
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setActiveView('onboarding')}
        />
      )}

      {/* 4. BHARAT NETRA ROAD NAVIGATION VIEW (Live Safe Route Engine & Map) */}
      {activeView === 'navigation' && (
        <BharatNetraNavView
          user={currentUser}
          weatherData={weatherData}
          predictionData={predictionData}
          onOpenWeatherPrediction={() => setActiveView('weather_prediction')}
          onLogout={handleLogout}
          onSelectCoordinates={handleSelectCoordinates}
        />
      )}

      {/* 5. WEATHER & LANDSLIDE PREDICTION MOBILE VIEW (When clicking 'Nearby') */}
      {activeView === 'weather_prediction' && (
        <WeatherPredictionMobile
          currentLat={lat}
          currentLon={lon}
          locationName={locationName}
          weatherData={weatherData}
          predictionData={predictionData}
          riskMapData={riskMapData}
          timelineData={timelineData}
          alerts={alerts}
          isLoading={isLoading}
          onBackToNavigation={() => setActiveView('navigation')}
          onSelectCoordinates={handleSelectCoordinates}
          onSimulate={handleSimulate}
          onRefresh={handleRefresh}
          onOpenSavedLocations={() => setIsSavedOpen(true)}
        />
      )}

      {/* Saved Locations Drawer */}
      <SavedLocationsDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        currentLat={lat}
        currentLon={lon}
        currentLocationName={locationName}
        onSelectLocation={handleSelectCoordinates}
      />
    </MobileAppWrapper>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}

export default App;
