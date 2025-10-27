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

interface Continent {
  name: string;
  path: string;
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


// Detailed continent shapes (simplified Natural Earth-style)
const continents: Continent[] = [
  {
    name: "North America",
    path: "M 180 280 Q 190 240 200 220 Q 220 200 245 195 Q 270 192 290 198 Q 310 205 325 220 Q 335 235 338 255 Q 340 275 335 295 Q 328 315 315 330 Q 300 345 280 355 L 270 365 Q 260 375 250 385 L 245 395 Q 240 405 235 415 L 232 425 Q 230 435 228 445 L 225 455 Q 220 460 215 465 L 205 470 Q 195 472 185 468 Q 175 462 168 450 Q 162 435 160 418 L 158 400 Q 155 385 152 370 L 148 350 Q 145 330 148 310 Q 152 290 160 275 L 170 265 Q 175 260 180 280 Z"
  },
  {
    name: "South America",
    path: "M 270 380 Q 280 385 288 395 L 295 410 Q 300 430 302 450 L 303 470 Q 302 490 298 508 Q 292 525 282 538 Q 270 548 256 552 Q 242 554 230 548 Q 220 540 214 528 Q 210 512 210 495 L 212 475 Q 215 455 220 438 L 228 420 Q 235 405 243 395 L 252 388 Q 260 383 270 380 Z"
  },
  {
    name: "Europe",
    path: "M 540 220 Q 550 210 565 205 L 580 202 Q 595 201 610 203 L 625 208 Q 640 215 650 227 Q 658 240 660 255 L 658 270 Q 654 285 645 295 Q 635 303 622 307 L 605 308 Q 588 306 573 300 L 558 292 Q 545 282 538 268 L 535 252 Q 535 235 540 220 Z"
  },
  {
    name: "Africa",
    path: "M 555 295 Q 565 290 578 288 L 595 287 Q 612 289 628 295 L 645 305 Q 660 318 670 335 L 678 355 Q 683 375 684 395 L 682 420 Q 678 445 668 468 L 655 488 Q 640 505 620 515 L 598 522 Q 575 525 555 522 L 535 515 Q 518 505 505 490 L 495 470 Q 488 448 486 425 L 487 400 Q 490 375 497 352 L 508 330 Q 520 312 535 302 L 545 297 Q 550 295 555 295 Z"
  },
  {
    name: "Asia",
    path: "M 680 210 Q 695 205 712 202 L 735 200 Q 760 201 785 205 L 810 212 Q 835 221 858 233 L 880 248 Q 900 265 915 285 L 928 308 Q 938 332 943 357 L 945 382 Q 943 407 935 430 L 923 452 Q 908 472 888 487 L 865 500 Q 840 510 813 515 L 785 517 Q 758 515 733 508 L 710 498 Q 690 485 675 468 L 663 448 Q 654 426 650 402 L 649 377 Q 651 352 657 328 L 667 305 Q 678 285 692 268 L 705 252 Q 718 238 733 228 L 748 220 Q 663 215 680 210 Z"
  },
  {
    name: "Australia",
    path: "M 920 445 Q 935 440 952 440 L 972 443 Q 992 448 1008 458 L 1022 472 Q 1033 488 1038 506 L 1040 525 Q 1037 544 1028 560 L 1015 573 Q 998 583 978 588 L 958 590 Q 938 588 920 581 L 905 570 Q 893 556 886 539 L 883 520 Q 883 500 888 482 L 897 466 Q 907 453 920 445 Z"
  }
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
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);
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


// Connection routes between cities
const routes: Route[] = [
  { from: cities[0], to: cities[2], color: "#60a5fa" },
  { from: cities[0], to: cities[4], color: "#3b82f6" },
  { from: cities[2], to: cities[3], color: "#60a5fa" },
  { from: cities[3], to: cities[4], color: "#3b82f6" },
  { from: cities[4], to: cities[5], color: "#60a5fa" },
  { from: cities[4], to: cities[6], color: "#3b82f6" },
  { from: cities[6], to: cities[7], color: "#60a5fa" },
  { from: cities[6], to: cities[8], color: "#3b82f6" },
  { from: cities[1], to: cities[0], color: "#60a5fa" },
];

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
      {/* Subtle background gradient for contrast lift */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Map container - no background, transparent blend */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full"
          style={{ 
            filter: "drop-shadow(0 0 20px rgba(96, 165, 250, 0.12))",
            opacity: 0.98
          }}
        >
          {/* Detailed world map with continents */}
          <WorldMap hoveredContinent={hoveredContinent} setHoveredContinent={setHoveredContinent} />

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

// Detailed world map with landmasses, coastlines, and borders
function WorldMap({ 
  hoveredContinent, 
  setHoveredContinent 
}: { 
  hoveredContinent: string | null; 
  setHoveredContinent: (name: string | null) => void;
}) {
  return (
    <g>
      {/* Landmass fills */}
      {continents.map((continent) => {
        const isHovered = hoveredContinent === continent.name;
        return (
          <path
            key={`land-${continent.name}`}
            d={continent.path}
            fill="#5aa5ff"
            opacity={isHovered ? 0.20 : 0.14}
            style={{ 
              transition: 'opacity 600ms ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredContinent(continent.name)}
            onMouseLeave={() => setHoveredContinent(null)}
          />
        );
      })}

      {/* Coastline strokes with glow */}
      {continents.map((continent) => {
        const isHovered = hoveredContinent === continent.name;
        return (
          <path
            key={`coast-${continent.name}`}
            d={continent.path}
            fill="none"
            stroke="#9cc7ff"
            strokeWidth="1.25"
            opacity={isHovered ? 0.65 : 0.50}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(156, 199, 255, 0.35))',
              transition: 'opacity 600ms ease',
              pointerEvents: 'none'
            }}
          />
        );
      })}

      {/* Country borders (simplified for performance) */}
      <g className="hidden md:block">
        {/* North America internal borders */}
        <path d="M 220 265 L 240 280 M 250 270 L 260 290 M 280 300 L 290 320" 
          stroke="#bfe0ff" strokeWidth="0.7" opacity="0.35" strokeDasharray="2,2" />
        
        {/* Europe internal borders */}
        <path d="M 560 240 L 570 250 M 580 235 L 590 245 M 600 240 L 610 250 M 620 245 L 630 255" 
          stroke="#bfe0ff" strokeWidth="0.7" opacity="0.35" strokeDasharray="2,2" />
        
        {/* Africa internal borders */}
        <path d="M 570 350 L 590 360 M 600 370 L 620 380 M 580 400 L 600 410 M 620 420 L 640 430" 
          stroke="#bfe0ff" strokeWidth="0.7" opacity="0.35" strokeDasharray="2,2" />
        
        {/* Asia internal borders */}
        <path d="M 720 280 L 740 290 M 760 270 L 780 280 M 800 290 L 820 300 M 840 310 L 860 320 M 780 350 L 800 360 M 820 370 L 840 380" 
          stroke="#bfe0ff" strokeWidth="0.7" opacity="0.35" strokeDasharray="2,2" />
      </g>
    </g>
  );
}

// Connection line between cities with reduced blur to preserve map detail
function ConnectionLine({ route }: { route: Route }) {
  const x1 = (route.from.x / 100) * 1200;
  const y1 = (route.from.y / 100) * 600;
  const x2 = (route.to.x / 100) * 1200;
  const y2 = (route.to.y / 100) * 600;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 50;

  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

  return (
    <g style={{ mixBlendMode: 'screen' }}>
      {/* Glow layer with reduced blur */}
      <path
        d={pathD}
        stroke={route.color}
        strokeWidth="2.5"
        fill="none"
        opacity="0.25"
        strokeLinecap="round"
        style={{ filter: "blur(8px)" }}
      >
        <animate
          attributeName="opacity"
          values="0.15;0.35;0.15"
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
