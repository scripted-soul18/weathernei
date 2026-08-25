import {
  WeatherForecastResponse,
  LandslidePredictionResponse,
  RiskMapResponse,
  PredictionTimelineResponse,
  ModelMetricsResponse,
  SavedLocationItem,
  PredictionHistoryItem,
  AlertItem
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://127.0.0.1:8000/api' : '/api');

export async function fetchWeather(lat: number, lon: number): Promise<WeatherForecastResponse> {
  const res = await fetch(`${API_BASE}/weather?latitude=${lat}&longitude=${lon}`);
  if (!res.ok) throw new Error(`Weather error: ${res.statusText}`);
  return res.json();
}

export async function predictLandslide(params: {
  latitude: number;
  longitude: number;
  rainfall_24h?: number;
  slope?: number;
  soil_moisture?: number;
}): Promise<LandslidePredictionResponse> {
  const res = await fetch(`${API_BASE}/predict-landslide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Prediction error: ${res.statusText}`);
  return res.json();
}

export async function fetchRiskMap(lat: number, lon: number, radiusKm: number = 12): Promise<RiskMapResponse> {
  const res = await fetch(`${API_BASE}/risk-map?latitude=${lat}&longitude=${lon}&radius_km=${radiusKm}`);
  if (!res.ok) throw new Error(`Risk map error: ${res.statusText}`);
  return res.json();
}

export async function fetchTimeline(lat: number, lon: number): Promise<PredictionTimelineResponse> {
  const res = await fetch(`${API_BASE}/timeline?latitude=${lat}&longitude=${lon}`);
  if (!res.ok) throw new Error(`Timeline error: ${res.statusText}`);
  return res.json();
}

export async function fetchLocationName(lat: number, lon: number): Promise<any> {
  const res = await fetch(`${API_BASE}/location?lat=${lat}&lon=${lon}`);
  if (!res.ok) return { display_name: `${lat.toFixed(3)}°, ${lon.toFixed(3)}°` };
  return res.json();
}

export async function searchLocations(query: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/location?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchModelMetrics(): Promise<ModelMetricsResponse> {
  const res = await fetch(`${API_BASE}/model-metrics`);
  if (!res.ok) throw new Error(`Metrics error: ${res.statusText}`);
  return res.json();
}

export async function fetchSavedLocations(): Promise<SavedLocationItem[]> {
  const res = await fetch(`${API_BASE}/saved-locations`);
  if (!res.ok) return [];
  return res.json();
}

export async function saveLocation(name: string, lat: number, lon: number, notes?: string): Promise<SavedLocationItem> {
  const res = await fetch(`${API_BASE}/saved-locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, latitude: lat, longitude: lon, notes }),
  });
  if (!res.ok) throw new Error(`Save location error: ${res.statusText}`);
  return res.json();
}

export async function fetchPredictionHistory(): Promise<PredictionHistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) return [];
  return res.json();
}
