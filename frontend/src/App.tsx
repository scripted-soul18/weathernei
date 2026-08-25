import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TopStatsBar } from './components/TopStatsBar';
import { WeatherCard } from './components/WeatherCard';
import { LandslideRiskCard } from './components/LandslideRiskCard';
import { AlertBanner } from './components/AlertBanner';
import { RiskTimeline } from './components/RiskTimeline';
import { WeatherCharts } from './components/WeatherCharts';
import { ModelMetricsModal } from './components/ModelMetricsModal';
import { SavedLocationsDrawer } from './components/SavedLocationsDrawer';
import { InteractiveMap } from './map/InteractiveMap';
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

// Initial default location: Shimla (Himalayan mountainous terrain, famous landslide monitoring site)
const DEFAULT_LAT = 31.1048;
const DEFAULT_LON = 77.1734;
const DEFAULT_NAME = 'Shimla, Himachal Pradesh, India';

export function App() {
  const [lat, setLat] = useState<number>(DEFAULT_LAT);
  const [lon, setLon] = useState<number>(DEFAULT_LON);
  const [locationName, setLocationName] = useState<string>(DEFAULT_NAME);

  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [predictionData, setPredictionData] = useState<LandslidePredictionResponse | null>(null);
  const [riskMapData, setRiskMapData] = useState<RiskMapResponse | null>(null);
  const [timelineData, setTimelineData] = useState<PredictionTimelineResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMetricsOpen, setIsMetricsOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  // Load all data for target coordinates
  const loadDataForLocation = useCallback(
    async (
      targetLat: number,
      targetLon: number,
      nameOverride?: string,
      customSimParams?: { rainfall_24h?: number; slope?: number; soil_moisture?: number }
    ) => {
      setIsLoading(true);
      setIsAlertDismissed(false);

      try {
        // Parallel fetch of weather, ML prediction, spatial risk map, timeline, and reverse geocoding
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
        console.error('Failed to load platform data:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger on initial load or coordinate changes
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        onSelectCoordinates={handleSelectCoordinates}
        currentLat={lat}
        currentLon={lon}
        onOpenSavedLocations={() => setIsSavedOpen(true)}
        onOpenModelMetrics={() => setIsMetricsOpen(true)}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        alertCount={alerts.length}
        currentRiskLevel={predictionData?.risk_level}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Safety Alert Banner (if Risk is HIGH or VERY HIGH and not dismissed) */}
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

        {/* Top Location & Elevation Stats Bar */}
        <TopStatsBar
          locationName={locationName}
          latitude={lat}
          longitude={lon}
          elevation={predictionData?.terrain?.elevation || weatherData?.elevation || 350}
          slope={predictionData?.terrain?.slope || 15}
          terrain={predictionData?.terrain}
          riskLevel={predictionData?.risk_level || 'LOW'}
          lastUpdated={predictionData?.timestamp || new Date().toISOString()}
        />

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Leaflet Map with Spatial Heat Overlay (7 Cols) */}
          <div className="lg:col-span-7 h-[540px] sm:h-[600px] flex flex-col">
            <InteractiveMap
              latitude={lat}
              longitude={lon}
              riskLevel={predictionData?.risk_level || 'LOW'}
              landslideProbability={predictionData?.landslide_probability || 0.1}
              gridPoints={riskMapData?.grid_points || []}
              onSelectLocation={handleSelectCoordinates}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Current Weather Card + Landslide Risk Assessment (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Current Weather Card */}
            {weatherData ? (
              <WeatherCard weather={weatherData.current} isLoading={isLoading} />
            ) : (
              <div className="glass-panel p-6 rounded-2xl h-48 flex items-center justify-center text-slate-400">
                Loading meteorological conditions...
              </div>
            )}

            {/* Landslide Risk Assessment Card with SHAP & Explainable AI */}
            {predictionData ? (
              <LandslideRiskCard
                prediction={predictionData}
                onSimulate={handleSimulate}
                isLoading={isLoading}
              />
            ) : (
              <div className="glass-panel p-6 rounded-2xl h-64 flex items-center justify-center text-slate-400">
                Evaluating landslide hazard probability...
              </div>
            )}
          </div>
        </div>

        {/* Prediction Timeline Horizon Progression (+72 Hours) */}
        {timelineData && (
          <RiskTimeline timeline={timelineData.timeline} isLoading={isLoading} />
        )}

        {/* Weather & Meteorological Forecasting Charts */}
        {weatherData && (
          <WeatherCharts hourly={weatherData.hourly} daily={weatherData.daily} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 glass-panel py-6 text-center text-xs text-slate-500 space-y-1">
        <p>
          TERRA-GUARD &copy; {new Date().getFullYear()} Weather Forecast & Landslide Risk Prediction Platform.
        </p>
        <p className="text-[11px] text-slate-400 max-w-xl mx-auto px-4">
          All predictions are AI-based risk estimates calculated from multi-factor geotechnical and meteorological models.
          Always follow official warnings from local disaster management authorities.
        </p>
      </footer>

      {/* Modals & Drawers */}
      <ModelMetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
      />

      <SavedLocationsDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        currentLat={lat}
        currentLon={lon}
        currentLocationName={locationName}
        onSelectLocation={handleSelectCoordinates}
      />
    </div>
  );
}

export default App;
