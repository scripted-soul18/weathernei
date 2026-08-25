import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RiskGridPoint, RiskLevel } from '../types';
import { MapLegend } from './MapLegend';
import { Crosshair, MapPin, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  riskLevel: RiskLevel;
  landslideProbability: number;
  gridPoints: RiskGridPoint[];
  onSelectLocation: (lat: number, lon: number) => void;
  isLoading?: boolean;
}

const TILE_URLS = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

const ATTRIBUTIONS = {
  dark: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
  osm: '&copy; OpenStreetMap contributors',
};

const RISK_COLORS: Record<RiskLevel, { fill: string; stroke: string; glow: string }> = {
  LOW: { fill: '#10B981', stroke: '#059669', glow: 'rgba(16, 185, 129, 0.4)' },
  MODERATE: { fill: '#F59E0B', stroke: '#D97706', glow: 'rgba(245, 158, 11, 0.4)' },
  HIGH: { fill: '#F97316', stroke: '#EA580C', glow: 'rgba(249, 115, 22, 0.5)' },
  'VERY HIGH': { fill: '#EF4444', stroke: '#DC2626', glow: 'rgba(239, 68, 68, 0.6)' },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  riskLevel,
  landslideProbability,
  gridPoints,
  onSelectLocation,
  isLoading = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const gridLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeTile, setActiveTile] = useState<'dark' | 'satellite' | 'osm'>('dark');
  const [showRiskGrid, setShowRiskGrid] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
    });

    const tileLayer = L.tileLayer(TILE_URLS.dark, {
      attribution: ATTRIBUTIONS.dark,
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    gridLayerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      onSelectLocation(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_URLS[activeTile]);
  }, [activeTile]);

  // Update Map Position & Main Target Pin
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    map.flyTo([latitude, longitude], map.getZoom(), { duration: 1.2 });

    const colorConfig = RISK_COLORS[riskLevel] || RISK_COLORS.LOW;

    // Custom Glowing SVG Pin Icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
          <div style="
            position: absolute;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: ${colorConfig.glow};
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            position: relative;
            z-index: 10;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${colorConfig.fill};
            border: 3px solid #ffffff;
            box-shadow: 0 0 15px ${colorConfig.fill};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setIcon(customIcon);
    } else {
      markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    }

    markerRef.current.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif; font-size: 12px; color: #0f172a;">
        <strong style="color: ${colorConfig.stroke};">${riskLevel} RISK (${(landslideProbability * 100).toFixed(1)}%)</strong><br/>
        <span>Lat: ${latitude.toFixed(4)}°, Lon: ${longitude.toFixed(4)}°</span>
      </div>
    `);
  }, [latitude, longitude, riskLevel, landslideProbability]);

  // Update Spatial Risk Grid Overlays
  useEffect(() => {
    if (!gridLayerGroupRef.current) return;
    gridLayerGroupRef.current.clearLayers();

    if (!showRiskGrid || !gridPoints || gridPoints.length === 0) return;

    gridPoints.forEach((pt) => {
      const colorConfig = RISK_COLORS[pt.risk_level] || RISK_COLORS.LOW;

      const circleMarker = L.circleMarker([pt.latitude, pt.longitude], {
        radius: 12 + pt.landslide_probability * 10,
        fillColor: colorConfig.fill,
        color: colorConfig.stroke,
        weight: 1.5,
        opacity: 0.8,
        fillOpacity: 0.45 + pt.landslide_probability * 0.35,
      });

      circleMarker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px; line-height: 1.4;">
          <strong style="color: ${colorConfig.stroke}; font-size: 12px;">${pt.risk_level} RISK</strong><br/>
          <strong>Risk Prob:</strong> ${(pt.landslide_probability * 100).toFixed(1)}%<br/>
          <strong>Slope:</strong> ${pt.slope}° | <strong>Elev:</strong> ${pt.elevation}m<br/>
          <strong>24h Rain:</strong> ${pt.rainfall_24h}mm<br/>
          <span style="color: #64748b;">Click to analyze point</span>
        </div>
      `, { direction: 'top', offset: [0, -10] });

      circleMarker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectLocation(pt.latitude, pt.longitude);
      });

      gridLayerGroupRef.current?.addLayer(circleMarker);
    });
  }, [gridPoints, showRiskGrid]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel group">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" id="interactive-leaflet-map" />

      {/* Top Map Action Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2">
        <div className="glass-panel px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg flex items-center gap-2 text-xs text-slate-200">
          <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-medium">Click anywhere to predict risk</span>
        </div>
      </div>

      {/* Zoom Buttons */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-8 h-8 rounded-lg glass-panel hover:bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 shadow-md transition-all active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-8 h-8 rounded-lg glass-panel hover:bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 shadow-md transition-all active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <MapLegend
        tileLayer={activeTile}
        onTileChange={setActiveTile}
        showRiskGrid={showRiskGrid}
        onToggleRiskGrid={() => setShowRiskGrid(!showRiskGrid)}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[1100] flex flex-col items-center justify-center text-slate-200 gap-3">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium tracking-wide">Evaluating terrain & meteorology...</span>
        </div>
      )}
    </div>
  );
};
