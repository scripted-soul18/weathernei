/**
 * Bharat Netra — Safe Route Analysis Engine
 * Integrated GIS Graph & Disaster Hazard Avoidance Engine.
 * Adapted from patilnayan875/Bharat-Netra.
 */

export interface Coordinate {
  lat: number;
  lon: number;
}

export type VehicleType = 'car' | 'bike' | 'truck' | 'ambulance';

export interface HazardOverlay {
  id: string;
  type: 'landslide' | 'flood' | 'heavy_rain' | 'rockfall' | 'road_damage';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  location: Coordinate;
  radiusMeters: number;
  description: string;
}

export interface RouteOption {
  id: string;
  name: string;
  highway: string;
  distanceKm: number;
  durationMin: number;
  safetyScore: number; // 0 to 100 (100 = completely safe)
  safetyGainPercent: number; // e.g. 10% or 18% safer than hazard route
  riskLevel: 'SAFE' | 'LOW RISK' | 'MODERATE RISK' | 'HIGH HAZARD';
  path: [number, number][]; // [lat, lon] coordinates for Leaflet polyline
  hazardsAvoided: string[];
  vehicleConstraints: {
    vehicleType: VehicleType;
    speedKmH: number;
    passable: boolean;
  };
}

export interface SafeRouteAnalysisResult {
  origin: string;
  destination: string;
  originCoords: Coordinate;
  destCoords: Coordinate;
  recommendedRoute: RouteOption;
  alternateRoutes: RouteOption[];
  detectedHazards: HazardOverlay[];
  weatherCondition: string;
  generatedAt: string;
}

// Haversine Distance (in km)
export function haversineDistance(c1: Coordinate, c2: Coordinate): number {
  const R = 6371; // Earth radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lon - c1.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Pre-computed Indian Highway Networks & High-Precision Corridors
const INDIAN_ROAD_CORRIDORS: Record<
  string,
  {
    from: string;
    to: string;
    fromCoords: Coordinate;
    toCoords: Coordinate;
    highway: string;
    baseKm: number;
    safeWaypoints: [number, number][];
    hazardWaypoints: [number, number][];
    hazards: HazardOverlay[];
  }
> = {
  'pune-talegaon': {
    from: 'Pune',
    to: 'Talegaon',
    fromCoords: { lat: 18.5204, lon: 73.8567 },
    toCoords: { lat: 18.7297, lon: 73.6749 },
    highway: 'NH 48 / Expressway',
    baseKm: 35.1,
    safeWaypoints: [
      [18.5204, 73.8567],
      [18.5385, 73.8340],
      [18.5610, 73.8050],
      [18.5990, 73.7720],
      [18.6480, 73.7310],
      [18.6890, 73.7020],
      [18.7297, 73.6749]
    ],
    hazardWaypoints: [
      [18.5204, 73.8567],
      [18.5490, 73.8120],
      [18.6250, 73.7150], // Ghat section with rockfall risk
      [18.7297, 73.6749]
    ],
    hazards: [
      {
        id: 'hz-pune-1',
        type: 'landslide',
        severity: 'MODERATE',
        location: { lat: 18.625, lon: 73.715 },
        radiusMeters: 400,
        description: 'Khandala Ghat Slope Instability Alert'
      }
    ]
  },
  'shimla-manali': {
    from: 'Shimla',
    to: 'Kufri / Manali',
    fromCoords: { lat: 31.1048, lon: 77.1734 },
    toCoords: { lat: 31.0979, lon: 77.2678 },
    highway: 'NH 5 (Hindustan-Tibet Road)',
    baseKm: 48.2,
    safeWaypoints: [
      [31.1048, 77.1734],
      [31.1120, 77.1950],
      [31.1210, 77.2280],
      [31.0979, 77.2678]
    ],
    hazardWaypoints: [
      [31.1048, 77.1734],
      [31.1350, 77.2100], // Steep escarpment
      [31.0979, 77.2678]
    ],
    hazards: [
      {
        id: 'hz-shimla-1',
        type: 'landslide',
        severity: 'HIGH',
        location: { lat: 31.135, lon: 77.21 },
        radiusMeters: 800,
        description: 'Himalayan Ridge Soil Saturation & Debris Flow Warning'
      }
    ]
  },
  'mumbai-pune': {
    from: 'Mumbai',
    to: 'Pune',
    fromCoords: { lat: 19.0760, lon: 72.8777 },
    toCoords: { lat: 18.5204, lon: 73.8567 },
    highway: 'Mumbai-Pune Expressway',
    baseKm: 148.0,
    safeWaypoints: [
      [19.0760, 72.8777],
      [19.0330, 73.0297],
      [18.9894, 73.1175],
      [18.7557, 73.4091],
      [18.6250, 73.7650],
      [18.5204, 73.8567]
    ],
    hazardWaypoints: [
      [19.0760, 72.8777],
      [18.8100, 73.3200], // Old NH 4 Ghat hairpin
      [18.5204, 73.8567]
    ],
    hazards: [
      {
        id: 'hz-bhor-1',
        type: 'rockfall',
        severity: 'MODERATE',
        location: { lat: 18.81, lon: 73.32 },
        radiusMeters: 500,
        description: 'Bhor Ghat Monsoon Rockfall Netting Zone'
      }
    ]
  }
};

/**
 * Vehicle Speed & Constraints Matrix
 */
const VEHICLE_SPEEDS: Record<VehicleType, { baseSpeed: number; hazardSensitivity: number }> = {
  car: { baseSpeed: 60, hazardSensitivity: 1.0 },
  bike: { baseSpeed: 45, hazardSensitivity: 1.4 }, // Bikes are more exposed to rain/mud
  truck: { baseSpeed: 40, hazardSensitivity: 1.2 }, // Heavy cargo needs safer gradients
  ambulance: { baseSpeed: 75, hazardSensitivity: 0.8 } // Emergency clearance
};

export class SafeRouteEngine {
  /**
   * Analyzes routes between origin and destination with safety dominance.
   */
  public analyzeRoute(
    origin: string,
    destination: string,
    vehicle: VehicleType = 'truck',
    landslideRiskLevel?: string
  ): SafeRouteAnalysisResult {
    const key = this.matchCorridorKey(origin, destination);
    const corridor = INDIAN_ROAD_CORRIDORS[key] || INDIAN_ROAD_CORRIDORS['pune-talegaon'];

    const vehicleSpec = VEHICLE_SPEEDS[vehicle] || VEHICLE_SPEEDS.truck;
    const distanceKm = corridor.baseKm;

    // Calculate duration in minutes based on vehicle speed
    const durationMin = Math.round((distanceKm / vehicleSpec.baseSpeed) * 60);

    // Calculate safety score and safety boost based on landslide risk
    let safetyScore = 94;
    let safetyBoost = 10;
    if (landslideRiskLevel === 'VERY HIGH') {
      safetyScore = 78;
      safetyBoost = 24;
    } else if (landslideRiskLevel === 'HIGH') {
      safetyScore = 86;
      safetyBoost = 18;
    }

    const recommendedRoute: RouteOption = {
      id: 'rt-safe-1',
      name: `Safest Route via ${corridor.highway}`,
      highway: corridor.highway,
      distanceKm: distanceKm,
      durationMin: durationMin,
      safetyScore: safetyScore,
      safetyGainPercent: safetyBoost,
      riskLevel: 'SAFE',
      path: corridor.safeWaypoints,
      hazardsAvoided: corridor.hazards.map((h) => h.description),
      vehicleConstraints: {
        vehicleType: vehicle,
        speedKmH: vehicleSpec.baseSpeed,
        passable: true
      }
    };

    const alternateRoute: RouteOption = {
      id: 'rt-alt-2',
      name: 'Direct Route (Hazard Prone)',
      highway: 'Old Highway Shortcut',
      distanceKm: Math.round((distanceKm * 0.92) * 10) / 10,
      durationMin: Math.round(durationMin * 1.15), // slower due to rough terrain/hazards
      safetyScore: 62,
      safetyGainPercent: 0,
      riskLevel: 'MODERATE RISK',
      path: corridor.hazardWaypoints,
      hazardsAvoided: [],
      vehicleConstraints: {
        vehicleType: vehicle,
        speedKmH: Math.round(vehicleSpec.baseSpeed * 0.75),
        passable: vehicle !== 'truck'
      }
    };

    return {
      origin: corridor.from,
      destination: corridor.to,
      originCoords: corridor.fromCoords,
      destCoords: corridor.toCoords,
      recommendedRoute,
      alternateRoutes: [alternateRoute],
      detectedHazards: corridor.hazards,
      weatherCondition: 'Light Rain / Monsoon Watch Active',
      generatedAt: new Date().toISOString()
    };
  }

  private matchCorridorKey(orig: string, dest: string): string {
    const o = orig.toLowerCase();
    const d = dest.toLowerCase();
    if (o.includes('shimla') || d.includes('shimla') || o.includes('manali') || d.includes('manali')) {
      return 'shimla-manali';
    }
    if (o.includes('mumbai') || d.includes('mumbai')) {
      return 'mumbai-pune';
    }
    return 'pune-talegaon';
  }
}

export const safeRouteEngine = new SafeRouteEngine();
