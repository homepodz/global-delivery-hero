import { useState } from "react";

interface CityNodeProps {
  city: string;
  x: number;
  y: number;
  region: string;
  deliveryTime: string;
}

const CityNode = ({ city, x, y, region, deliveryTime }: CityNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Outer glow ring */}
      <circle
        cx={x}
        cy={y}
        r="8"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        opacity={isHovered ? 0.6 : 0.35}
        className="transition-opacity duration-300"
      />
      
      {/* Inner dot */}
      <circle
        cx={x}
        cy={y}
        r="4"
        fill="hsl(var(--primary))"
        opacity={isHovered ? 1 : 0.9}
        className="transition-opacity duration-300"
        filter="drop-shadow(0 0 8px hsl(var(--primary) / 0.8))"
      />

      {/* Tooltip */}
      {isHovered && (
        <g>
          <rect
            x={x - 80}
            y={y - 50}
            width="160"
            height="40"
            rx="8"
            fill="hsl(var(--background))"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            opacity="0.95"
            filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
          />
          <text
            x={x}
            y={y - 34}
            textAnchor="middle"
            fill="hsl(var(--foreground))"
            fontSize="12"
            fontWeight="600"
          >
            {region}
          </text>
          <text
            x={x}
            y={y - 20}
            textAnchor="middle"
            fill="hsl(var(--muted-foreground))"
            fontSize="11"
          >
            {deliveryTime}
          </text>
        </g>
      )}
    </g>
  );
};

const ConnectionLine = ({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 50;

  return (
    <g>
      <path
        d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
        filter="drop-shadow(0 0 8px hsl(var(--primary) / 0.4))"
      />
    </g>
  );
};

const TravelingDot = ({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 50;

  return (
    <circle r="3" fill="hsl(var(--primary))" opacity="0.9" filter="drop-shadow(0 0 6px hsl(var(--primary)))">
      <animateMotion
        dur="4s"
        repeatCount="indefinite"
        begin={`${delay}s`}
        path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
      />
    </circle>
  );
};

const WorldMapPaths = ({ hoveredContinent }: { hoveredContinent: string | null }) => {
  const getContinentOpacity = (continent: string) => {
    if (!hoveredContinent) return { fill: 0.14, stroke: 0.5, border: 0.35 };
    return continent === hoveredContinent
      ? { fill: 0.14, stroke: 0.65, border: 0.50 }
      : { fill: 0.14, stroke: 0.5, border: 0.35 };
  };

  const continents = [
    {
      name: "North America",
      landPath: "M120,80 L180,70 L200,80 L210,100 L200,140 L170,160 L140,150 L120,120 Z",
      coastPath: "M120,80 L180,70 L200,80 L210,100 L200,140 L170,160 L140,150 L120,120 Z",
      borders: "M150,80 L150,140 M170,85 L170,135"
    },
    {
      name: "South America",
      landPath: "M180,180 L200,200 L190,260 L170,270 L160,250 L165,200 Z",
      coastPath: "M180,180 L200,200 L190,260 L170,270 L160,250 L165,200 Z",
      borders: "M175,200 L175,250"
    },
    {
      name: "Europe",
      landPath: "M280,60 L320,55 L340,70 L330,100 L310,110 L280,95 Z",
      coastPath: "M280,60 L320,55 L340,70 L330,100 L310,110 L280,95 Z",
      borders: "M300,65 L300,100 M320,70 L320,95"
    },
    {
      name: "Africa",
      landPath: "M290,120 L320,115 L340,140 L335,200 L310,220 L285,210 L280,160 Z",
      coastPath: "M290,120 L320,115 L340,140 L335,200 L310,220 L285,210 L280,160 Z",
      borders: "M310,130 L310,200"
    },
    {
      name: "Asia",
      landPath: "M360,50 L480,45 L500,70 L490,120 L460,140 L420,135 L380,110 L360,80 Z",
      coastPath: "M360,50 L480,45 L500,70 L490,120 L460,140 L420,135 L380,110 L360,80 Z",
      borders: "M400,60 L400,120 M440,55 L440,125 M470,60 L470,115"
    },
    {
      name: "Australia",
      landPath: "M520,220 L560,215 L575,235 L570,260 L545,270 L520,255 Z",
      coastPath: "M520,220 L560,215 L575,235 L570,260 L545,270 L520,255 Z",
      borders: ""
    }
  ];

  return (
    <g>
      {continents.map((continent) => {
        const opacity = getContinentOpacity(continent.name);
        return (
          <g key={continent.name}>
            {/* Landmass fill */}
            <path
              d={continent.landPath}
              fill="#5aa5ff"
              opacity={opacity.fill}
              className="transition-opacity duration-600"
            />
            {/* Coastline stroke */}
            <path
              d={continent.coastPath}
              fill="none"
              stroke="#9cc7ff"
              strokeWidth="1.25"
              opacity={opacity.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 8px rgba(156,199,255,0.35))"
              className="transition-opacity duration-600"
            />
            {/* Country borders */}
            {continent.borders && (
              <path
                d={continent.borders}
                fill="none"
                stroke="#bfe0ff"
                strokeWidth="0.7"
                opacity={opacity.border}
                strokeDasharray="3,2"
                className="transition-opacity duration-600"
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

const DeliveryAnimation = () => {
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  const cities = [
    { city: "New York", x: 165, y: 110, region: "🇺🇸 USA", deliveryTime: "3–5 days" },
    { city: "Toronto", x: 145, y: 95, region: "🇨🇦 Canada", deliveryTime: "4–6 days" },
    { city: "London", x: 300, y: 75, region: "🇬🇧 UK", deliveryTime: "5–7 days" },
    { city: "Paris", x: 310, y: 85, region: "🇫🇷 France", deliveryTime: "5–7 days" },
    { city: "Dubai", x: 380, y: 115, region: "🇦🇪 UAE", deliveryTime: "7–10 days" },
    { city: "Singapore", x: 470, y: 150, region: "🇸🇬 Singapore", deliveryTime: "6–9 days" },
    { city: "Sydney", x: 545, y: 245, region: "🇦🇺 Australia", deliveryTime: "8–12 days" },
  ];

  const connections = [
    { from: 0, to: 2 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
  ];

  const continentRegions = [
    { name: "North America", path: "M120,80 L180,70 L200,80 L210,100 L200,140 L170,160 L140,150 L120,120 Z" },
    { name: "South America", path: "M180,180 L200,200 L190,260 L170,270 L160,250 L165,200 Z" },
    { name: "Europe", path: "M280,60 L320,55 L340,70 L330,100 L310,110 L280,95 Z" },
    { name: "Africa", path: "M290,120 L320,115 L340,140 L335,200 L310,220 L285,210 L280,160 Z" },
    { name: "Asia", path: "M360,50 L480,45 L500,70 L490,120 L460,140 L420,135 L380,110 L360,80 Z" },
    { name: "Australia", path: "M520,220 L560,215 L575,235 L570,260 L545,270 L520,255 Z" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.06)_0%,_transparent_70%)]" />
      
      <svg
        viewBox="0 0 700 300"
        className="w-full h-full max-w-7xl"
        style={{ opacity: 0.95 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Invisible hover regions */}
        {continentRegions.map((region) => (
          <path
            key={region.name}
            d={region.path}
            fill="transparent"
            onMouseEnter={() => setHoveredContinent(region.name)}
            onMouseLeave={() => setHoveredContinent(null)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Map with continents */}
        <WorldMapPaths hoveredContinent={hoveredContinent} />

        {/* Connection lines */}
        {connections.map((conn, i) => (
          <ConnectionLine
            key={i}
            x1={cities[conn.from].x}
            y1={cities[conn.from].y}
            x2={cities[conn.to].x}
            y2={cities[conn.to].y}
          />
        ))}

        {/* Traveling dots */}
        {connections.map((conn, i) => (
          <TravelingDot
            key={i}
            x1={cities[conn.from].x}
            y1={cities[conn.from].y}
            x2={cities[conn.to].x}
            y2={cities[conn.to].y}
            delay={i * 0.6}
          />
        ))}

        {/* City nodes */}
        {cities.map((city, i) => (
          <CityNode key={i} {...city} />
        ))}
      </svg>

      {/* Tagline overlay */}
      <div className="absolute bottom-8 right-8 text-right">
        <p className="text-sm md:text-base font-semibold text-primary/80 tracking-wide">
          Global Network. Fast Shipping.
        </p>
      </div>
    </div>
  );
};

export default DeliveryAnimation;
