import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  Wind, 
  Droplets, 
  Flame, 
  ShieldAlert,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { ACTIVE_DISTRICT_ALERTS, ACTIVE_CYCLONE_SIMULATION } from '../data/imdAlertsData';

export default function InteractiveMap({ selectedLocation, onSelectStation }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({});

  const [activeLayer, setActiveLayer] = useState("all"); // 'all', 'radar', 'alerts', 'cyclone', 'temp'
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on India or selected location
    const centerLat = selectedLocation?.lat || 21.7679;
    const centerLon = selectedLocation?.lon || 78.8718;
    const initialZoom = selectedLocation ? 6 : 5;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false
      });

      // Dark CartoDB / OSM Base Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.flyTo([centerLat, centerLon], 6, { duration: 1.2 });
    }

    const map = mapInstanceRef.current;

    // Clear existing layer groups
    Object.values(layersGroupRef.current).forEach(lg => lg && lg.remove());
    layersGroupRef.current = {
      alerts: L.layerGroup().addTo(map),
      cyclone: L.layerGroup().addTo(map),
      station: L.layerGroup().addTo(map)
    };

    // 1. Plot Selected Location Marker
    if (selectedLocation) {
      const stationIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div style="
            background: linear-gradient(135deg, #06b6d4, #2563eb);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 15px #06b6d4;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
          ">
            📍
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([selectedLocation.lat, selectedLocation.lon], { icon: stationIcon })
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-weight: bold; color: #38bdf8; font-size: 14px;">${selectedLocation.name}</div>
            <div style="font-size: 12px; color: #94a3b8;">Active Selected Weather Station</div>
            <div style="font-size: 11px; margin-top: 4px; color: #cbd5e1;">Lat: ${selectedLocation.lat.toFixed(2)}°, Lon: ${selectedLocation.lon.toFixed(2)}°</div>
          </div>
        `)
        .addTo(layersGroupRef.current.station);
    }

    // 2. Plot IMD District Warning Alerts
    if (activeLayer === "all" || activeLayer === "alerts") {
      ACTIVE_DISTRICT_ALERTS.forEach((alert) => {
        const isRed = alert.level === "RED";
        const color = isRed ? "#ef4444" : alert.level === "ORANGE" ? "#f97316" : "#eab308";

        const alertMarker = L.circleMarker([alert.lat, alert.lon], {
          radius: isRed ? 22 : 16,
          fillColor: color,
          color: "#ffffff",
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.5
        });

        alertMarker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: bold; color: white; font-size: 13px;">${alert.district}</span>
              <span style="background: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
                ${alert.level} ALERT
              </span>
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 4px;"><strong>Event:</strong> ${alert.event}</div>
            <div style="font-size: 11px; color: #38bdf8; margin-bottom: 4px;"><strong>Rain:</strong> ${alert.rainfallExpectedMm}</div>
            <div style="font-size: 10px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 4px; margin-top: 4px;">
              <strong>NDRF Directive:</strong> ${alert.advisory}
            </div>
          </div>
        `);

        alertMarker.on('click', () => setSelectedAlert(alert));
        alertMarker.addTo(layersGroupRef.current.alerts);
      });
    }

    // 3. Plot Cyclone Simulation Track & Cone of Uncertainty
    if (activeLayer === "all" || activeLayer === "cyclone") {
      const waypoints = ACTIVE_CYCLONE_SIMULATION.trackWaypoints;
      const latlngs = waypoints.map(w => [w.lat, w.lon]);

      // Projected Track Line
      L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(layersGroupRef.current.cyclone);

      // Plot Cyclone Points
      waypoints.forEach((wp) => {
        const isLive = wp.isLive;
        const isLandfall = wp.isLandfall;

        const cycloneIcon = L.divIcon({
          className: 'cyclone-pin',
          html: `
            <div style="
              background: ${isLive ? '#ef4444' : isLandfall ? '#f97316' : '#0284c7'};
              width: ${isLive ? '28px' : '18px'};
              height: ${isLive ? '28px' : '18px'};
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 ${isLive ? '14px #ef4444' : '6px #0284c7'};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: ${isLive ? '14px' : '10px'};
              animation: ${isLive ? 'spin 4s linear infinite' : 'none'};
            ">
              ${isLive ? '🌀' : '•'}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        L.marker([wp.lat, wp.lon], { icon: cycloneIcon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <div style="font-weight: bold; color: #f87171; font-size: 13px;">${ACTIVE_CYCLONE_SIMULATION.name}</div>
              <div style="font-size: 12px; color: #f1f5f9; font-weight: 600;">${wp.status}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Time: <strong>${wp.time}</strong></div>
              <div style="font-size: 11px; color: #38bdf8;">Wind: ${ACTIVE_CYCLONE_SIMULATION.maxSustainedWindKmph} km/h (Gusts: ${ACTIVE_CYCLONE_SIMULATION.gustingToKmph} km/h)</div>
            </div>
          `)
          .addTo(layersGroupRef.current.cyclone);
      });
    }

  }, [selectedLocation, activeLayer]);

  // Quick jumps
  const jumpTo = (lat, lon, zoom = 7) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], zoom, { duration: 1.5 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel rounded-2xl p-4 border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-display">
              GIS Meteorological & Disaster Radar Command Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive real-time satellite Doppler radar, IMD color-coded district hazard polygons & cyclone track
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveLayer("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeLayer === "all" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Layers
          </button>
          <button
            onClick={() => setActiveLayer("alerts")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeLayer === "alerts" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-red-400" /> IMD Warnings
          </button>
          <button
            onClick={() => setActiveLayer("cyclone")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeLayer === "cyclone" ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>🌀</span> Cyclone Track
          </button>
        </div>
      </div>

      {/* Map Frame */}
      <div className="relative h-[520px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 shadow-xl max-w-xs">
          <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> IMD Warning Scale
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-400/40" />
              <span>Red Alert (Severe)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Orange (Be Prepared)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Yellow (Watch)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span>Selected Station</span>
            </div>
          </div>
        </div>

        {/* Quick Hotspot Jump Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-xs shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1">Hazard Hotspots:</span>
          <button
            onClick={() => jumpTo(20.5, 86.8, 7)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700 text-left transition-colors"
          >
            🔴 Odisha Coast (Cyclone)
          </button>
          <button
            onClick={() => jumpTo(19.07, 72.87, 8)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700 text-left transition-colors"
          >
            🟠 Mumbai (High Tide Rain)
          </button>
          <button
            onClick={() => jumpTo(26.14, 91.73, 7)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700 text-left transition-colors"
          >
            🟠 Assam (Flood Watch)
          </button>
          <button
            onClick={() => jumpTo(28.61, 77.20, 8)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700 text-left transition-colors"
          >
            🟡 Delhi NCR (Thunderstorm)
          </button>
        </div>
      </div>
    </div>
  );
}
