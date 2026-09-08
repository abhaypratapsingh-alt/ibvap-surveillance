export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type UserRole = 'GUARD' | 'ADMIN' | 'RESPONSE_TEAM';
export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';
export type DetectionType = 
  | 'PERSON' 
  | 'VEHICLE' 
  | 'FACE' 
  | 'LICENSE_PLATE' 
  | 'FENCE_BREACH' 
  | 'SUSPICIOUS_ACTIVITY'
  | 'ANIMAL_FILTERED';

export interface Detection {
  id: string;
  type: DetectionType;
  label: string;
  confidence: number; // 0 to 1
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0..100
  targetId?: string;
  plateNumber?: string;
  timestamp: string;
  cameraId: string;
  cameraName: string;
  threatLevel: ThreatLevel;
  behavior?: string;
}

export interface VirtualFence {
  id: string;
  cameraId: string;
  name: string;
  threatLevel: ThreatLevel;
  activeHours: string;
  direction: 'ENTRY' | 'EXIT' | 'BOTH';
  points: Array<{ x: number; y: number }>; // 0-100 percentage coordinates
  color: string;
  isBreached: boolean;
  breachCount: number;
}

export interface Camera {
  id: string;
  name: string;
  sector: string;
  rtspUrl: string;
  ip: string;
  status: CameraStatus;
  fps: number;
  resolution: string;
  bitrate: string;
  edgeNode: string;
  edgeTemp: number;
  edgeLoad: number;
  lat: number;
  lng: number;
  zoneType: 'BORDER_PERIMETER' | 'RESTRICTED_BUFFER' | 'CHECKPOINT' | 'RIVERINE_GAP';
  nightVisionActive: boolean;
  detectionsCount: number;
  activeDetections: Detection[];
  virtualFences: VirtualFence[];
  feedType: 'DESERT_PERIMETER' | 'CHECKPOINT_GATE' | 'FENCE_LINE' | 'SCRUBLAND_NIGHT' | 'RIVER_CROSSING' | 'RADAR_OUTPOST';
}

export interface ThreatAlert {
  id: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  cameraId: string;
  cameraName: string;
  confidence: number;
  timestamp: string;
  threatScore: number; // 0 - 100
  acknowledged: boolean;
  targetId?: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'TRACKING' | 'DISPATCHED' | 'FALSE_ALARM';
  verificationSignals: {
    baseConfidence: number;
    restrictedZoneBonus: number;
    nightMultiplier: number;
    crossCameraBonus: number;
    behaviorBonus: number;
    isFilteredFalseAlarm?: boolean;
    reason?: string;
  };
}

export interface TrackingBreadcrumb {
  id: string;
  time: string;
  cameraId: string;
  cameraName: string;
  direction: string;
  confidence: number;
  duration: string;
  zone: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface TrackingTarget {
  id: string;
  type: 'PERSON' | 'VEHICLE';
  label: string;
  status: 'ACTIVE' | 'DISPATCHED' | 'LOST' | 'APPREHENDED';
  firstSeenTime: string;
  lastSeenTime: string;
  currentCamera: string;
  breadcrumbs: TrackingBreadcrumb[];
  features: {
    upperClothing?: string;
    lowerClothing?: string;
    headwear?: string;
    vehicleMake?: string;
    licensePlate?: string;
    speedEstimated?: string;
  };
}

export interface WorkflowStage {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  active: boolean;
  timestamp?: string;
  dataSummary?: string;
}

export interface KPIMetrics {
  camerasOnline: number;
  totalCameras: number;
  activeThreats: number;
  personsDetected: number;
  vehiclesDetected: number;
  virtualFenceBreaches: number;
  aiConfidenceAvg: number;
  systemUptimeHours: number;
}
