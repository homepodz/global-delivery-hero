"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DottedMap from "dotted-map";

/**
 * WorldMap
 * - Renders a crisp dotted basemap (SVG) and animates shipping routes on top.
 * - No outlined box; designed to blend into the section background.
 */

type Point = { lat: number; lng: number; label?: string };
type Dot = { start: Point; end: Point };

export interface WorldMapProps {
  dots?: Dot[];
  lineColor?: string;            // route + node color
  showLabels?: boolean;
  animationDuration?: number;    // seconds per route
  loop?: boolean;
  landOpacity?: number;          // 0.10 – 0.20 looks best on light BG
  coastOpacity?: number;         // 0.45 – 0.60
}

export function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
  showLabels = true,
  animationDuration = 2,
  loop = true,
  landOpacity = 0.14,
  coastOpacity = 0.52,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Generate basemap once
  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);
  const svgMap = useMemo(
    () =>
      map.getSVG({
        radius: 0.22,
        color: "#00000040",     // subtle dots for land
        shape: "circle",
        backgroundColor: "transparent",
      }),
    [map]
  );

  // Simple equirectangular projection to match 800×400 viewBox
  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50; // lift the arc
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  // Animation timing across all routes
  const staggerDelay = 0.3;
  const totalAnimationTime = dots.length * staggerDelay + animationDuration;
  const pauseTime = 2;
  const fullCycleDuration = totalAnimationTime + pauseTime;

  return (
    <div
      className="relative w-full"
      style={{ minHeight: "min(52vh, 680px)" }} // full-width, no box
    >
      {/* Basemap as an <img> so it’s super light and blends in */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        alt="World map"
        className="pointer-events-none select-none w-full h-auto opacity-[var(--land-opacity,1)]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, white 10%, white 90%, transparent)",
          filter: `drop-shadow(0 0 8px rgba(156,199,255,${coastOpacity}))`,
        }}
        draggable={false}
      />

      {/* Routes + nodes */}
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <filter id="glow">
            <feMorphology operator="dilate" radius="0.5" />
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* draw animated arcs */}
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);

          const startTime = (i * staggerDelay) / fullCycleDuration;
          const endTime = (i * staggerDelay + animationDuration) / fullCycleDuration;
          const resetTime = totalAnimationTime / fullCycleDuration;

          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1.25"
                initial={{ pathLength: 0 }}
                animate={
                  loop
                    ? { pathLength: [0, 0, 1, 1, 0] }
                    : { pathLength: 1 }
                }
                transition={
                  loop
                    ? {
                        duration: fullCycleDuration,
                        times: [0, startTime, endTime, resetTime, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                      }
                    : {
                        duration: animationDuration,
                        delay: i * staggerDelay,
                        ease: "easeInOut",
                      }
                }
                style={{ mixBlendMode: "screen" }}
              />

              {/* traveling particle */}
              {loop && (
                <motion.circle
                  r="4"
                  fill={lineColor}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{
                    offsetDistance: [null, "0%", "100%", "100%", "100%"],
                    opacity: [0, 0, 1, 0, 0],
                  }}
                  transition={{
                    duration: fullCycleDuration,
                    times: [0, startTime, endTime, resetTime, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{
                    offsetPath: `path('${createCurvedPath(startPoint, endPoint)}')`,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* nodes + labels */}
        {dots.map((dot, i) => {
          const s = projectPoint(dot.start.lat, dot.start.lng);
          const e = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`points-${i}`} filter="url(#glow)">
              {/* start */}
              <motion.g
                onHoverStart={() => setHoveredLocation(dot.start.label || "")}
                onHoverEnd={() => setHoveredLocation(null)}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <circle cx={s.x} cy={s.y} r="3" fill={lineColor} />
                <circle cx={s.x} cy={s.y} r="3" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="3" to="12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              </motion.g>

              {/* end */}
              <motion.g
                onHoverStart={() => setHoveredLocation(dot.end.label || "")}
                onHoverEnd={() => setHoveredLocation(null)}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <circle cx={e.x} cy={e.y} r="3" fill={lineColor} />
                <circle cx={e.x} cy={e.y} r="3" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="3" to="12" dur="2s" begin="0.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
                </circle>
              </motion.g>

              {/* labels */}
              {showLabels && dot.start.label && (
                <foreignObject x={s.x - 60} y={s.y - 30} width="120" height="26" className="pointer-events-none">
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/95 text-black border border-gray-200 shadow-sm">
                      {dot.start.label}
                    </span>
                  </div>
                </foreignObject>
              )}
              {showLabels && dot.end.label && (
                <foreignObject x={e.x - 60} y={e.y - 30} width="120" height="26" className="pointer-events-none">
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/95 text-black border border-gray-200 shadow-sm">
                      {dot.end.label}
                    </span>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Mobile tooltip (optional) */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 bg-white/90 text-black px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm sm:hidden border border-gray-200"
          >
            {hoveredLocation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
