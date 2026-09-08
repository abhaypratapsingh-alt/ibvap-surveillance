import React, { useRef, useEffect } from 'react';
import { Camera } from '../../types/surveillance';

interface CameraFeedCanvasProps {
  camera: Camera;
  isNightMode?: boolean;
  showOverlay?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CameraFeedCanvas: React.FC<CameraFeedCanvasProps> = ({
  camera,
  isNightMode = false,
  showOverlay = true,
  className = '',
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIdRef = useRef<number>(0);
  const animTimeRef = useRef<number>(0);

  const effectiveNightMode = isNightMode || camera.nightVisionActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    const render = () => {
      if (!isMounted) return;
      animTimeRef.current += 0.025;
      const t = animTimeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Base Environment Rendering
      if (effectiveNightMode) {
        // Night Vision / Low Light Enhancement
        ctx.fillStyle = '#051111';
        ctx.fillRect(0, 0, w, h);

        // Night sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        skyGrad.addColorStop(0, '#020b0c');
        skyGrad.addColorStop(1, '#081f1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.45);

        // Terrain ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
        groundGrad.addColorStop(0, '#081a17');
        groundGrad.addColorStop(1, '#05110f');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.45, w, h * 0.55);

        // Phosphor grid / noise
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let y = h * 0.45; y < h; y += 22) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      } else {
        // Daylight Border Perimeter
        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.48);
        skyGrad.addColorStop(0, '#10223b');
        skyGrad.addColorStop(0.7, '#1b324b');
        skyGrad.addColorStop(1, '#33485c');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h * 0.48);

        // Distant hills / dunes
        ctx.fillStyle = '#1c2936';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.48);
        for (let x = 0; x <= w; x += 40) {
          const dy = Math.sin((x + t * 5) * 0.015) * 12 + Math.cos(x * 0.03) * 8;
          ctx.lineTo(x, h * 0.46 + dy);
        }
        ctx.lineTo(w, h * 0.55);
        ctx.lineTo(0, h * 0.55);
        ctx.fill();

        // Desert / Sand Ground
        const groundGrad = ctx.createLinearGradient(0, h * 0.48, 0, h);
        groundGrad.addColorStop(0, '#1a2736');
        groundGrad.addColorStop(0.4, '#151e28');
        groundGrad.addColorStop(1, '#0b111a');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, h * 0.48, w, h * 0.52);

        // Ground perspective lines
        ctx.strokeStyle = 'rgba(100, 140, 180, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 7; i++) {
          ctx.beginPath();
          ctx.moveTo(w * (0.15 + i * 0.12), h * 0.52);
          ctx.lineTo(w * (i * 0.18 - 0.1), h);
          ctx.stroke();
        }
      }

      // 2. Physical Border Fence Posts & Barbed Wire Lines
      const fenceY = h * 0.52;
      ctx.strokeStyle = effectiveNightMode ? 'rgba(0, 240, 255, 0.25)' : 'rgba(80, 110, 140, 0.4)';
      ctx.lineWidth = 1.5;

      // Fence Posts
      for (let x = 15; x < w; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, fenceY - 24);
        ctx.lineTo(x, fenceY + 16);
        ctx.stroke();

        // Cross insulators
        ctx.beginPath();
        ctx.moveTo(x - 4, fenceY - 14);
        ctx.lineTo(x + 4, fenceY - 14);
        ctx.moveTo(x - 4, fenceY);
        ctx.lineTo(x + 4, fenceY);
        ctx.stroke();
      }

      // Barbed Wire Wires
      ctx.beginPath();
      ctx.moveTo(0, fenceY - 16);
      ctx.lineTo(w, fenceY - 16);
      ctx.moveTo(0, fenceY - 2);
      ctx.lineTo(w, fenceY - 2);
      ctx.stroke();

      // Concertina coils (zigzag)
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 12) {
        ctx.lineTo(x, fenceY + 6 + (x % 24 === 0 ? -6 : 6));
      }
      ctx.stroke();

      // 3. Render Virtual Fences (Geofence Polygons)
      if (camera.virtualFences && camera.virtualFences.length > 0) {
        camera.virtualFences.forEach((fence) => {
          if (!fence.points || fence.points.length < 3) return;
          ctx.save();
          ctx.beginPath();
          const first = fence.points[0];
          ctx.moveTo((first.x / 100) * w, (first.y / 100) * h);

          for (let i = 1; i < fence.points.length; i++) {
            const p = fence.points[i];
            ctx.lineTo((p.x / 100) * w, (p.y / 100) * h);
          }
          ctx.closePath();

          if (fence.isBreached) {
            // Pulsing red alert fill
            const pulse = (Math.sin(t * 8) + 1) / 2;
            ctx.fillStyle = `rgba(239, 68, 68, ${0.2 + pulse * 0.25})`;
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.85 + pulse * 0.15})`;
            ctx.lineWidth = 2.5;
            ctx.setLineDash([8, 4]);
          } else {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
            ctx.strokeStyle = fence.color || '#00f0ff';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([6, 4]);
          }

          ctx.fill();
          ctx.stroke();

          // Render polygon vertices
          ctx.setLineDash([]);
          fence.points.forEach((p) => {
            const px = (p.x / 100) * w;
            const py = (p.y / 100) * h;
            ctx.fillStyle = fence.isBreached ? '#ef4444' : '#00f0ff';
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // Virtual Fence Label
          ctx.fillStyle = fence.isBreached ? '#ef4444' : '#00f0ff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(
            `VIRTUAL FENCE: ${fence.name} [${fence.direction}]`,
            (first.x / 100) * w + 6,
            (first.y / 100) * h - 6
          );
          ctx.restore();
        });
      }

      // 4. Render Dynamic AI Bounding Boxes & Simulated Moving Objects
      if (camera.activeDetections && camera.activeDetections.length > 0) {
        camera.activeDetections.forEach((det, idx) => {
          // Add subtle realistic tracking jitter / motion
          const offsetX = Math.sin(t * 2 + idx) * 0.8;
          const offsetY = Math.cos(t * 1.5 + idx) * 0.4;

          const bx = ((det.bbox[0] + offsetX) / 100) * w;
          const by = ((det.bbox[1] + offsetY) / 100) * h;
          const bw = (det.bbox[2] / 100) * w;
          const bh = (det.bbox[3] / 100) * h;

          const isCritical = det.threatLevel === 'CRITICAL' || det.type === 'FENCE_BREACH';
          const isHigh = det.threatLevel === 'HIGH' || det.type === 'SUSPICIOUS_ACTIVITY';
          const boxColor = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981';

          // Simulated silhouette inside bounding box
          ctx.save();
          if (det.type === 'PERSON' || det.type === 'FENCE_BREACH') {
            // Human figure silhouette
            const headR = bw * 0.18;
            const centerX = bx + bw * 0.5;
            const headY = by + bh * 0.22;

            ctx.fillStyle = effectiveNightMode ? '#4ef' : '#7ba6cf';
            ctx.beginPath();
            ctx.arc(centerX, headY, headR, 0, Math.PI * 2);
            ctx.fill();

            // Torso & legs
            ctx.strokeStyle = effectiveNightMode ? '#4ef' : '#7ba6cf';
            ctx.lineWidth = bw * 0.22;
            ctx.beginPath();
            ctx.moveTo(centerX, headY + headR);
            ctx.lineTo(centerX, by + bh * 0.65);
            ctx.stroke();

            // Legs walking motion
            const legSwing = Math.sin(t * 6) * (bw * 0.2);
            ctx.lineWidth = bw * 0.12;
            ctx.beginPath();
            ctx.moveTo(centerX, by + bh * 0.65);
            ctx.lineTo(centerX - legSwing, by + bh * 0.95);
            ctx.moveTo(centerX, by + bh * 0.65);
            ctx.lineTo(centerX + legSwing, by + bh * 0.95);
            ctx.stroke();
          } else if (det.type === 'VEHICLE') {
            // Vehicle silhouette
            ctx.fillStyle = effectiveNightMode ? '#38bdf8' : '#64748b';
            ctx.fillRect(bx + bw * 0.1, by + bh * 0.45, bw * 0.8, bh * 0.4);
            ctx.fillRect(bx + bw * 0.25, by + bh * 0.25, bw * 0.5, bh * 0.22);
            // Wheels
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(bx + bw * 0.28, by + bh * 0.85, bh * 0.12, 0, Math.PI * 2);
            ctx.arc(bx + bw * 0.72, by + bh * 0.85, bh * 0.12, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Draw Bounding Box (Corner brackets military style)
          ctx.save();
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 2;
          ctx.fillStyle = `${boxColor}15`;
          ctx.fillRect(bx, by, bw, bh);

          // Corner brackets
          const cl = Math.min(14, bw * 0.25);
          ctx.beginPath();
          // Top Left
          ctx.moveTo(bx, by + cl);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx + cl, by);
          // Top Right
          ctx.moveTo(bx + bw - cl, by);
          ctx.lineTo(bx + bw, by);
          ctx.lineTo(bx + bw, by + cl);
          // Bottom Left
          ctx.moveTo(bx, by + bh - cl);
          ctx.lineTo(bx, by + bh);
          ctx.lineTo(bx + cl, by + bh);
          // Bottom Right
          ctx.moveTo(bx + bw - cl, by + bh);
          ctx.lineTo(bx + bw, by + bh);
          ctx.lineTo(bx + bw, by + bh - cl);
          ctx.stroke();

          // Crosshairs targeting center
          const cx = bx + bw / 2;
          const cy = by + bh / 2;
          ctx.strokeStyle = `${boxColor}88`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 5, cy);
          ctx.lineTo(cx + 5, cy);
          ctx.moveTo(cx, cy - 5);
          ctx.lineTo(cx, cy + 5);
          ctx.stroke();

          // Label Tag Banner
          const labelText = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
          ctx.font = 'bold 9px ui-monospace, Consolas, monospace';
          const textW = ctx.measureText(labelText).width;

          ctx.fillStyle = boxColor;
          ctx.fillRect(bx, by - 16, textW + 8, 16);

          ctx.fillStyle = '#06090e';
          ctx.fillText(labelText, bx + 4, by - 4);

          // Target ID sub-tag
          if (det.targetId) {
            ctx.fillStyle = 'rgba(6, 9, 14, 0.85)';
            ctx.fillRect(bx, by + bh, 72, 13);
            ctx.strokeStyle = boxColor;
            ctx.strokeRect(bx, by + bh, 72, 13);
            ctx.fillStyle = boxColor;
            ctx.fillText(`ID: ${det.targetId}`, bx + 4, by + bh + 10);
          }

          ctx.restore();
        });
      }

      // 5. Radar / Scanline Laser Sweep Effect
      const scanY = (t * 45) % h;
      ctx.strokeStyle = effectiveNightMode ? 'rgba(0, 240, 255, 0.25)' : 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      // 6. Camera HUD Elements (Watermark, Cam ID, Resolution, Time)
      if (showOverlay) {
        ctx.save();
        ctx.font = '10px ui-monospace, Consolas, monospace';

        // Top Left: REC dot + Camera ID
        const recBlink = Math.floor(t * 2) % 2 === 0;
        ctx.fillStyle = recBlink ? '#ef4444' : '#7f1d1d';
        ctx.beginPath();
        ctx.arc(14, 15, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText('REC', 24, 18);

        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`[${camera.id}] ${camera.name}`, 55, 18);

        // Top Right: FPS & Edge Processing Node
        ctx.textAlign = 'right';
        ctx.fillStyle = '#10b981';
        ctx.fillText(`${camera.fps} FPS // ${camera.resolution}`, w - 10, 18);

        // Bottom Left: Coordinates & Sensor status
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`LAT ${camera.lat}°N  LNG ${camera.lng}°E`, 10, h - 12);

        // Bottom Right: Timestamp & Watermark
        const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(dateStr, w - 10, h - 24);

        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.font = 'bold 9px ui-monospace, Consolas, monospace';
        ctx.fillText('SIMULATED FEED // JETSON-AI-EDGE', w - 10, h - 12);

        // Night Vision Badge
        if (effectiveNightMode) {
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
          ctx.fillRect(10, 28, 160, 18);
          ctx.strokeStyle = '#00f0ff';
          ctx.strokeRect(10, 28, 160, 18);
          ctx.fillStyle = '#00f0ff';
          ctx.fillText('LOW-LIGHT ENHANCEMENT: ON', 15, 40);
        }

        ctx.restore();
      }

      frameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [camera, effectiveNightMode, showOverlay]);

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden bg-slate-950 select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="w-full h-full object-cover block"
      />
      {/* Screen scanline effect overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />
    </div>
  );
};
