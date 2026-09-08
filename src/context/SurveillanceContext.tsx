import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Camera,
  ThreatAlert,
  TrackingTarget,
  KPIMetrics,
  VirtualFence,
  Detection,
} from '../types/surveillance';
import {
  INITIAL_CAMERAS,
  INITIAL_THREAT_ALERTS,
  INITIAL_TRACKING_TARGETS,
  INITIAL_KPIS,
  PIPELINE_STAGES,
} from '../data/mockData';
import { soundManager } from '../utils/soundEffects';

interface SurveillanceContextType {
  cameras: Camera[];
  alerts: ThreatAlert[];
  targets: TrackingTarget[];
  kpis: KPIMetrics;
  selectedCameraId: string;
  selectedTargetId: string;
  isNightVisionGlobal: boolean;
  activeSectorFilter: string;
  gridMode: 1 | 4 | 6 | 9;
  pipelineStages: typeof PIPELINE_STAGES;
  activeStageId: number;
  
  // Demo Mode
  demoModeActive: boolean;
  demoStep: number;
  demoPlaying: boolean;
  startDemo: () => void;
  pauseDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  resetDemo: () => void;

  // Actions
  setSelectedCameraId: (id: string) => void;
  setSelectedTargetId: (id: string) => void;
  setActiveSectorFilter: (sector: string) => void;
  setGridMode: (mode: 1 | 4 | 6 | 9) => void;
  toggleNightVision: (cameraId?: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  dispatchResponse: (alertId: string) => void;
  markFalseAlarm: (alertId: string) => void;
  trackTargetFromAlert: (targetId: string, cameraId: string) => void;
  triggerSimulatedBreach: (cameraId?: string) => void;
  updateVirtualFence: (fence: VirtualFence) => void;
  addVirtualFence: (fence: VirtualFence) => void;
  deleteVirtualFence: (fenceId: string) => void;
  updateCameraStatus: (cameraId: string, status: Camera['status']) => void;
  addMockCamera: (cam: Partial<Camera>) => void;
}

const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

export const SurveillanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<ThreatAlert[]>(INITIAL_THREAT_ALERTS);
  const [targets, setTargets] = useState<TrackingTarget[]>(INITIAL_TRACKING_TARGETS);
  const [kpis, setKpis] = useState<KPIMetrics>(INITIAL_KPIS);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-04');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('P-1042');
  const [isNightVisionGlobal, setIsNightVisionGlobal] = useState<boolean>(false);
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('ALL');
  const [gridMode, setGridMode] = useState<1 | 4 | 6 | 9>(6);
  const [pipelineStages, setPipelineStages] = useState(PIPELINE_STAGES);
  const [activeStageId, setActiveStageId] = useState<number>(8);

  // Demo presentation state
  const [demoModeActive, setDemoModeActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);
  const [demoPlaying, setDemoPlaying] = useState<boolean>(false);
  const demoTimerRef = useRef<number | null>(null);

  // Acknowledge Alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true, status: 'ACKNOWLEDGED' } : a))
    );
    setKpis((prev) => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats - 1),
    }));
    soundManager.playAckChime();
  }, []);

  // Dispatch Response
  const dispatchResponse = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'DISPATCHED', acknowledged: true } : a))
    );
    setTargets((prev) =>
      prev.map((t) => (t.id === 'P-1042' ? { ...t, status: 'DISPATCHED' } : t))
    );
    soundManager.playAckChime();
  }, []);

  // Mark False Alarm
  const markFalseAlarm = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'FALSE_ALARM',
              threatScore: 8,
              verificationSignals: {
                ...a.verificationSignals,
                isFilteredFalseAlarm: true,
                reason: 'Manually verified as environmental false alarm by Command Operator',
              },
            }
          : a
      )
    );
    setKpis((prev) => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats - 1),
    }));
  }, []);

  // Track Target From Alert
  const trackTargetFromAlert = useCallback((targetId: string, cameraId: string) => {
    setSelectedTargetId(targetId);
    setSelectedCameraId(cameraId);
  }, []);

  // Toggle Night Vision
  const toggleNightVision = useCallback((cameraId?: string) => {
    if (cameraId) {
      setCameras((prev) =>
        prev.map((c) =>
          c.id === cameraId ? { ...c, nightVisionActive: !c.nightVisionActive } : c
        )
      );
    } else {
      setIsNightVisionGlobal((prev) => {
        const next = !prev;
        setCameras((cams) => cams.map((c) => ({ ...c, nightVisionActive: next })));
        return next;
      });
    }
  }, []);

  // Simulated Virtual Fence Breach Trigger
  const triggerSimulatedBreach = useCallback((targetCamId: string = 'CAM-04') => {
    soundManager.playBreachKlaxon();

    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newAlert: ThreatAlert = {
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`,
      level: 'CRITICAL',
      title: '🚨 CRITICAL: Virtual Fence Breach Detected',
      description: `Intruder crossing restricted polygon boundary on ${targetCamId} at high velocity.`,
      cameraId: targetCamId,
      cameraName: cameras.find((c) => c.id === targetCamId)?.name || 'Perimeter Boundary',
      confidence: 0.98,
      timestamp,
      threatScore: 96,
      acknowledged: false,
      targetId: 'P-1042',
      status: 'PENDING',
      verificationSignals: {
        baseConfidence: 98,
        restrictedZoneBonus: 20,
        nightMultiplier: 12,
        crossCameraBonus: 15,
        behaviorBonus: 15,
        isFilteredFalseAlarm: false,
        reason: 'Confirmed multi-signal breach: geometric polygon crossing + gait match',
      },
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setKpis((prev) => ({
      ...prev,
      activeThreats: prev.activeThreats + 1,
      virtualFenceBreaches: prev.virtualFenceBreaches + 1,
      personsDetected: prev.personsDetected + 1,
    }));

    // Update camera fence breach status
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === targetCamId) {
          return {
            ...c,
            virtualFences: c.virtualFences.map((vf) => ({
              ...vf,
              isBreached: true,
              breachCount: vf.breachCount + 1,
            })),
            activeDetections: [
              {
                id: `DET-${Date.now()}`,
                type: 'FENCE_BREACH',
                label: 'BREACH // INTRUSION DETECTED',
                confidence: 0.98,
                bbox: [46, 42, 20, 50],
                targetId: 'P-1042',
                timestamp,
                cameraId: targetCamId,
                cameraName: c.name,
                threatLevel: 'CRITICAL',
                behavior: 'Barrier scaling detected',
              },
              ...c.activeDetections,
            ],
          };
        }
        return c;
      })
    );

    setActiveStageId(8);
  }, [cameras]);

  // Virtual Fence Management
  const updateVirtualFence = useCallback((updated: VirtualFence) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === updated.cameraId) {
          return {
            ...c,
            virtualFences: c.virtualFences.map((vf) => (vf.id === updated.id ? updated : vf)),
          };
        }
        return c;
      })
    );
  }, []);

  const addVirtualFence = useCallback((fence: VirtualFence) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === fence.cameraId) {
          return {
            ...c,
            virtualFences: [...c.virtualFences, fence],
          };
        }
        return c;
      })
    );
  }, []);

  const deleteVirtualFence = useCallback((fenceId: string) => {
    setCameras((prev) =>
      prev.map((c) => ({
        ...c,
        virtualFences: c.virtualFences.filter((vf) => vf.id !== fenceId),
      }))
    );
  }, []);

  const updateCameraStatus = useCallback((cameraId: string, status: Camera['status']) => {
    setCameras((prev) =>
      prev.map((c) => (c.id === cameraId ? { ...c, status } : c))
    );
  }, []);

  const addMockCamera = useCallback((cam: Partial<Camera>) => {
    const newCam: Camera = {
      id: cam.id || `CAM-${(cameras.length + 1).toString().padStart(2, '0')}`,
      name: cam.name || 'New Perimeter Camera',
      sector: cam.sector || 'Sector E New Deploy',
      rtspUrl: cam.rtspUrl || `rtsp://192.168.10.${cameras.length + 10}:554/live`,
      ip: cam.ip || `192.168.10.${cameras.length + 10}`,
      status: cam.status || 'ONLINE',
      fps: 30.0,
      resolution: cam.resolution || '1920x1080 (FHD)',
      bitrate: '4.0 Mbps',
      edgeNode: cam.edgeNode || 'Jetson-Orin-Nano-X',
      edgeTemp: 44,
      edgeLoad: 45,
      lat: 28.67,
      lng: 71.30,
      zoneType: cam.zoneType || 'BORDER_PERIMETER',
      nightVisionActive: false,
      detectionsCount: 0,
      activeDetections: [],
      virtualFences: [],
      feedType: 'DESERT_PERIMETER',
    };
    setCameras((prev) => [...prev, newCam]);
  }, [cameras.length]);

  // Demo Presentation Step Execution
  const executeDemoStep = useCallback((step: number) => {
    setDemoStep(step);
    switch (step) {
      case 0:
        // Reset state
        setSelectedCameraId('CAM-01');
        setActiveStageId(1);
        break;
      case 1:
        // 1. Person appears on CAM-02 Checkpoint
        setSelectedCameraId('CAM-02');
        setActiveStageId(2);
        soundManager.playRadarChirp();
        break;
      case 2:
        // 2. Target bypasses checkpoint into intermediate scrub
        setSelectedCameraId('CAM-02');
        setActiveStageId(3);
        break;
      case 3:
        // 3. Same target appears on CAM-03 (Re-ID verified)
        setSelectedCameraId('CAM-03');
        setSelectedTargetId('P-1042');
        setActiveStageId(3);
        soundManager.playRadarChirp();
        break;
      case 4:
        // 4. Target moves toward restricted zone
        setActiveStageId(4);
        break;
      case 5:
        // 5. CAM-05 detects target
        setSelectedCameraId('CAM-05');
        setActiveStageId(5);
        break;
      case 6:
        // 6. CAM-04 virtual fence breach occurs
        setSelectedCameraId('CAM-04');
        setActiveStageId(4);
        triggerSimulatedBreach('CAM-04');
        break;
      case 7:
        // 7. Multi-signal verification starts
        setActiveStageId(6);
        break;
      case 8:
        // 8. Threat score increases to critical 94/100
        setActiveStageId(7);
        break;
      case 9:
        // 9. Critical alert appears
        setActiveStageId(8);
        break;
      case 10:
        // 10. Operator tracks target & response team dispatched
        setSelectedTargetId('P-1042');
        setActiveStageId(9);
        soundManager.playAckChime();
        break;
      default:
        break;
    }
  }, [triggerSimulatedBreach]);

  const startDemo = useCallback(() => {
    setDemoModeActive(true);
    setDemoPlaying(true);
    executeDemoStep(1);
  }, [executeDemoStep]);

  const pauseDemo = useCallback(() => {
    setDemoPlaying(false);
  }, []);

  const nextDemoStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = Math.min(10, prev + 1);
      executeDemoStep(next);
      return next;
    });
  }, [executeDemoStep]);

  const prevDemoStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = Math.max(0, prev - 1);
      executeDemoStep(next);
      return next;
    });
  }, [executeDemoStep]);

  const resetDemo = useCallback(() => {
    setDemoPlaying(false);
    setDemoModeActive(false);
    setDemoStep(0);
    setSelectedCameraId('CAM-04');
    setSelectedTargetId('P-1042');
    setActiveStageId(8);
  }, []);

  // Demo auto-advance timer
  useEffect(() => {
    if (demoPlaying && demoModeActive) {
      demoTimerRef.current = window.setTimeout(() => {
        if (demoStep < 10) {
          nextDemoStep();
        } else {
          setDemoPlaying(false);
        }
      }, 5500);
    }
    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    };
  }, [demoPlaying, demoModeActive, demoStep, nextDemoStep]);

  // Background Simulated Heartbeat: micro-updates for FPS, Bitrate, Jetson telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((cam) => {
          if (cam.status === 'OFFLINE') return cam;
          const fpsJitter = Number((29.5 + Math.random() * 0.9).toFixed(1));
          const loadJitter = Math.min(95, Math.max(30, cam.edgeLoad + Math.floor(Math.random() * 5 - 2)));
          const tempJitter = Math.min(65, Math.max(40, cam.edgeTemp + (Math.random() > 0.5 ? 0.2 : -0.2)));
          return {
            ...cam,
            fps: cam.status === 'DEGRADED' ? 18.2 : fpsJitter,
            edgeLoad: loadJitter,
            edgeTemp: Number(tempJitter.toFixed(1)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SurveillanceContext.Provider
      value={{
        cameras,
        alerts,
        targets,
        kpis,
        selectedCameraId,
        selectedTargetId,
        isNightVisionGlobal,
        activeSectorFilter,
        gridMode,
        pipelineStages,
        activeStageId,
        demoModeActive,
        demoStep,
        demoPlaying,
        startDemo,
        pauseDemo,
        nextDemoStep,
        prevDemoStep,
        resetDemo,
        setSelectedCameraId,
        setSelectedTargetId,
        setActiveSectorFilter,
        setGridMode,
        toggleNightVision,
        acknowledgeAlert,
        dispatchResponse,
        markFalseAlarm,
        trackTargetFromAlert,
        triggerSimulatedBreach,
        updateVirtualFence,
        addVirtualFence,
        deleteVirtualFence,
        updateCameraStatus,
        addMockCamera,
      }}
    >
      {children}
    </SurveillanceContext.Provider>
  );
};

export const useSurveillance = () => {
  const ctx = useContext(SurveillanceContext);
  if (!ctx) throw new Error('useSurveillance must be used within SurveillanceProvider');
  return ctx;
};
