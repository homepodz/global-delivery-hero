import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface City {
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  region: string;
  shippingDays: string;
  flag: string;
}

interface Route {
  from: City;
  to: City;
  color: string;
}

// Major cities with their approximate positions on a flat map
const cities: City[] = [
  { name: "New York", x: 25, y: 38, region: "USA", shippingDays: "3–5 days", flag: "🇺🇸" },
  { name: "Toronto", x: 23, y: 35, region: "Canada", shippingDays: "4–6 days", flag: "🇨🇦" },
  { name: "London", x: 49, y: 32, region: "UK", shippingDays: "5–7 days", flag: "🇬🇧" },
  { name: "Paris", x: 50, y: 35, region: "Europe", shippingDays: "5–7 days", flag: "🇪🇺" },
  { name: "Dubai", x: 60, y: 45, region: "UAE", shippingDays: "6–9 days", flag: "🇦🇪" },
  { name: "Riyadh", x: 58, y: 47, region: "Saudi Arabia", shippingDays: "7–10 days", flag: "🇸🇦" },
  { name: "Singapore", x: 73, y: 55, region: "Singapore", shippingDays: "8–12 days", flag: "🇸🇬" },
  { name: "Tokyo", x: 82, y: 37, region: "Japan", shippingDays: "7–10 days", flag: "🇯🇵" },
  { name: "Sydney", x: 85, y: 72, region: "Australia", shippingDays: "10–14 days", flag: "🇦🇺" },
];

// Connection routes between cities
const routes: Route[] = [
  { from: cities[0], to: cities[2], color: "#60a5fa" }, // NY to London
  { from: cities[0], to: cities[4], color: "#3b82f6" }, // NY to Dubai
  { from: cities[2], to: cities[3], color: "#60a5fa" }, // London to Paris
  { from: cities[3], to: cities[4], color: "#3b82f6" }, // Paris to Dubai
  { from: cities[4], to: cities[5], color: "#60a5fa" }, // Dubai to Riyadh
  { from: cities[4], to: cities[6], color: "#3b82f6" }, // Dubai to Singapore
  { from: cities[6], to: cities[7], color: "#60a5fa" }, // Singapore to Tokyo
  { from: cities[6], to: cities[8], color: "#3b82f6" }, // Singapore to Sydney
  { from: cities[1], to: cities[0], color: "#60a5fa" }, // Toronto to NY
];

// Traveling package dots
interface TravelingDot {
  id: number;
  route: Route;
  progress: number;
  speed: number;
}

const DeliveryAnimation = () => {
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [travelingDots, setTravelingDots] = useState<TravelingDot[]>([]);
  const nextDotId = useRef(0);

  // Add traveling dots periodically
  useEffect(() => {
    const addDot = () => {
      const route = routes[Math.floor(Math.random() * routes.length)];
      const newDot: TravelingDot = {
        id: nextDotId.current++,
        route,
        progress: 0,
        speed: 0.003 + Math.random() * 0.005, // Random speed
      };
      
      setTravelingDots((prev) => [...prev, newDot]);

      // Remove dot after completion
      setTimeout(() => {
        setTravelingDots((prev) => prev.filter((d) => d.id !== newDot.id));
      }, 12000);
    };

    // Initial dots
    const initialTimer = setTimeout(addDot, 500);
    
    // Add new dots periodically
    const interval = setInterval(addDot, 3000 + Math.random() * 2000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Animate dots
  useEffect(() => {
    const animate = () => {
      setTravelingDots((prev) =>
        prev.map((dot) => ({
          ...dot,
          progress: Math.min(dot.progress + dot.speed, 1),
        }))
      );
    };

    const intervalId = setInterval(animate, 16); // ~60fps
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-full overflow-visible">
      {/* Map container - no background, transparent blend */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full max-w-7xl"
          style={{ 
            filter: "drop-shadow(0 0 30px rgba(96, 165, 250, 0.15))",
            opacity: 0.95
          }}
        >
          {/* World map simplified paths */}
          <WorldMapPaths />

          {/* Connection routes */}
          {routes.map((route, idx) => (
            <ConnectionLine key={idx} route={route} />
          ))}

          {/* Traveling dots */}
          {travelingDots.map((dot) => (
            <TravelingDot key={dot.id} dot={dot} />
          ))}

          {/* City nodes */}
          {cities.map((city, idx) => (
            <CityNode
              key={idx}
              city={city}
              isHovered={hoveredCity?.name === city.name}
              onHover={() => setHoveredCity(city)}
              onLeave={() => setHoveredCity(null)}
            />
          ))}
        </svg>

        {/* Optional tagline overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 right-8 text-right"
        >
          <p className="text-sm md:text-base font-semibold text-primary/80 tracking-wide">
            Global Network.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground/70">
            Fast Shipping.
          </p>
        </motion.div>
      </div>

      {/* Tooltip */}
      {hoveredCity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-background/95 backdrop-blur-lg border border-primary/20 rounded-xl px-6 py-4 shadow-2xl shadow-primary/20">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{hoveredCity.flag}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {hoveredCity.name}, {hoveredCity.region}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fast shipping: {hoveredCity.shippingDays}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Simplified world map paths with soft glow
function WorldMapPaths() {
  return (
    <g opacity="0.25" stroke="#60a5fa" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* North America */}
      <path d="M 180 250 Q 200 200 250 180 Q 300 170 320 200 Q 330 240 300 280 Q 250 300 200 290 Z" />
      <path d="M 220 300 Q 240 320 260 340 Q 240 360 220 350 Z" />
      
      {/* South America */}
      <path d="M 280 360 Q 300 380 310 420 Q 300 460 280 480 Q 260 460 250 420 Q 255 380 280 360 Z" />
      
      {/* Europe */}
      <path d="M 540 200 Q 580 180 620 190 Q 640 210 630 240 Q 600 250 560 240 Z" />
      
      {/* Africa */}
      <path d="M 560 280 Q 600 270 640 290 Q 660 330 650 380 Q 620 420 580 440 Q 550 420 540 380 Q 530 320 560 280 Z" />
      
      {/* Asia */}
      <path d="M 680 200 Q 740 180 800 190 Q 860 200 920 210 Q 960 240 950 280 Q 920 300 880 310 Q 820 300 760 280 Q 700 260 680 220 Z" />
      <path d="M 800 320 Q 840 340 860 380 Q 850 420 820 440 Q 780 430 760 400 Q 770 360 800 320 Z" />
      
      {/* Australia */}
      <path d="M 920 430 Q 960 420 1000 440 Q 1020 470 1000 500 Q 960 510 920 490 Q 910 460 920 430 Z" />
    </g>
  );
}

// Connection line between cities
function ConnectionLine({ route }: { route: Route }) {
  const x1 = (route.from.x / 100) * 1200;
  const y1 = (route.from.y / 100) * 600;
  const x2 = (route.to.x / 100) * 1200;
  const y2 = (route.to.y / 100) * 600;

  // Calculate control point for curved line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 50;

  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

  return (
    <g>
      {/* Glow layer */}
      <path
        d={pathD}
        stroke={route.color}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
        style={{ filter: "blur(4px)" }}
      >
        <animate
          attributeName="opacity"
          values="0.2;0.5;0.2"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Main line */}
      <path
        d={pathD}
        stroke={route.color}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
        strokeDasharray="4 4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="8"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

// Traveling dot along route
function TravelingDot({ dot }: { dot: TravelingDot }) {
  const { route, progress } = dot;
  
  const x1 = (route.from.x / 100) * 1200;
  const y1 = (route.from.y / 100) * 600;
  const x2 = (route.to.x / 100) * 1200;
  const y2 = (route.to.y / 100) * 600;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 50;

  // Quadratic bezier curve interpolation
  const t = progress;
  const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
  const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

  return (
    <g opacity={1 - progress}>
      {/* Glow */}
      <circle cx={x} cy={y} r="8" fill={route.color} opacity="0.3" style={{ filter: "blur(6px)" }} />
      
      {/* Core */}
      <circle cx={x} cy={y} r="3" fill="#ffffff" opacity="0.9">
        <animate
          attributeName="r"
          values="3;5;3"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

// City node with pulsing effect
function CityNode({
  city,
  isHovered,
  onHover,
  onLeave,
}: {
  city: City;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const x = (city.x / 100) * 1200;
  const y = (city.y / 100) * 600;

  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
    >
      {/* Outer glow ring */}
      <circle cx={x} cy={y} r="20" fill="#60a5fa" opacity="0.1">
        <animate
          attributeName="r"
          values="15;25;15"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Middle ring */}
      <circle
        cx={x}
        cy={y}
        r="12"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Inner glow */}
      <circle cx={x} cy={y} r="8" fill="#3b82f6" opacity="0.6" style={{ filter: "blur(3px)" }} />

      {/* Core dot */}
      <circle
        cx={x}
        cy={y}
        r={isHovered ? "6" : "5"}
        fill="#ffffff"
        style={{ transition: "all 0.2s ease" }}
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Label */}
      {isHovered && (
        <text
          x={x}
          y={y - 30}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="14"
          fontWeight="600"
          style={{ pointerEvents: "none" }}
        >
          {city.name}
        </text>
      )}
    </g>
  );
}

export default DeliveryAnimation;
