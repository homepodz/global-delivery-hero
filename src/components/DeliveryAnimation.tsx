import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DeliveryAnimation = () => {
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    setPathLength(1);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gradient-globe))] opacity-60" />

      {/* Globe container with rotation */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Main globe sphere with gradient */}
        <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">
          <defs>
            {/* Gradient for globe */}
            <radialGradient id="globeGradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor="hsl(215 90% 68%)" stopOpacity="0.15" />
              <stop offset="50%" stopColor="hsl(215 90% 58%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(215 90% 48%)" stopOpacity="0.05" />
            </radialGradient>
            
            {/* Shadow gradient */}
            <radialGradient id="shadowGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="hsl(215 30% 12%)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="hsl(215 30% 12%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Globe shadow */}
          <ellipse cx="200" cy="350" rx="120" ry="20" fill="url(#shadowGradient)" />

          {/* Main globe circle */}
          <circle 
            cx="200" 
            cy="200" 
            r="150" 
            fill="url(#globeGradient)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Latitude lines */}
          <ellipse cx="200" cy="200" rx="150" ry="75" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="200" cy="200" rx="150" ry="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="200" cy="200" rx="150" ry="110" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.3" />

          {/* Longitude lines */}
          <ellipse cx="200" cy="200" rx="75" ry="150" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="200" cy="200" rx="40" ry="150" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.3" />
          <ellipse cx="200" cy="200" rx="110" ry="150" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0.3" />

          {/* Equator */}
          <line x1="50" y1="200" x2="350" y2="200" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
          
          {/* Prime meridian */}
          <line x1="200" y1="50" x2="200" y2="350" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />

          {/* Subtle continent shapes (simplified) */}
          <path
            d="M 120,180 Q 130,170 140,175 L 155,185 Q 160,190 155,195 L 145,200 Q 135,195 130,190 Z"
            fill="hsl(var(--primary))"
            opacity="0.15"
          />
          <path
            d="M 240,160 Q 250,155 260,160 L 270,170 Q 275,180 265,185 L 250,180 Q 245,175 240,170 Z"
            fill="hsl(var(--primary))"
            opacity="0.15"
          />
          <path
            d="M 180,220 Q 190,215 200,220 L 210,230 Q 215,240 205,245 L 190,240 Q 185,235 180,230 Z"
            fill="hsl(var(--primary))"
            opacity="0.15"
          />
        </svg>
      </motion.div>

      {/* Flight path - curved line across globe */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 400"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Curved flight path */}
        <motion.path
          d="M 80,180 Q 200,100 320,200"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1000"
          initial={{ strokeDashoffset: 1000 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      </svg>

      {/* Airplane animation along path */}
      <motion.div
        className="absolute"
        initial={{ offsetDistance: "0%" }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          offsetPath: "path('M 80,180 Q 200,100 320,200')",
          offsetRotate: "auto",
        }}
      >
        <div className="relative -ml-8 -mt-8">
          <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full" />
          <svg width="64" height="64" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
              </linearGradient>
            </defs>
            <g transform="translate(32, 32)">
              {/* Plane body */}
              <path
                d="M 0,-20 L 8,-8 L 4,0 L 8,8 L 0,20 L -8,8 L -4,0 L -8,-8 Z"
                fill="url(#planeGradient)"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="1.5"
              />
              {/* Plane wings */}
              <path
                d="M -15,0 L -8,-4 L 8,-4 L 15,0 L 8,4 L -8,4 Z"
                fill="url(#planeGradient)"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="1"
                opacity="0.9"
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* Truck animation (appears at destination) */}
      <motion.div
        className="absolute"
        style={{ left: "65%", top: "48%" }}
        initial={{ x: -60, opacity: 0, scale: 0.8 }}
        animate={{
          x: [0, 120],
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 4,
          times: [0, 0.3, 0.8, 1],
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <div className="absolute -inset-3 bg-accent/20 blur-lg rounded-lg" />
          <svg width="70" height="50" viewBox="0 0 70 50">
            <defs>
              <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
              </linearGradient>
            </defs>
            {/* Truck body */}
            <rect x="8" y="12" width="38" height="22" rx="3" fill="url(#truckGradient)" />
            <rect x="42" y="18" width="22" height="16" rx="2" fill="url(#truckGradient)" />
            {/* Wheels */}
            <circle cx="18" cy="38" r="6" fill="hsl(var(--foreground))" />
            <circle cx="52" cy="38" r="6" fill="hsl(var(--foreground))" />
            {/* Wheel centers */}
            <circle cx="18" cy="38" r="3" fill="hsl(var(--card))" />
            <circle cx="52" cy="38" r="3" fill="hsl(var(--card))" />
          </svg>
        </div>
      </motion.div>

      {/* House (delivery destination) */}
      <motion.div
        className="absolute"
        style={{ right: "10%", bottom: "25%" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 1.2,
          delay: 8,
          repeat: Infinity,
          repeatDelay: 6.8,
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/15 blur-xl rounded-full" />
          <svg width="90" height="90" viewBox="0 0 90 90">
            <defs>
              <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary-dark))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
              <linearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
              </linearGradient>
            </defs>
            
            {/* House shadow */}
            <ellipse cx="45" cy="82" rx="30" ry="5" fill="hsl(var(--foreground))" opacity="0.1" />
            
            {/* House roof */}
            <path d="M 45,18 L 75,48 L 15,48 Z" fill="url(#roofGradient)" />
            <path d="M 45,18 L 75,48 L 15,48 Z" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" opacity="0.3" />
            
            {/* House body */}
            <rect x="20" y="48" width="50" height="35" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" rx="2" />
            
            {/* Windows */}
            <rect x="26" y="54" width="12" height="12" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth="1.5" rx="1" />
            <rect x="52" y="54" width="12" height="12" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth="1.5" rx="1" />
            <line x1="32" y1="54" x2="32" y2="66" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
            <line x1="58" y1="54" x2="58" y2="66" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
            <line x1="26" y1="60" x2="38" y2="60" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
            <line x1="52" y1="60" x2="64" y2="60" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" />
            
            {/* Door */}
            <rect x="38" y="61" width="14" height="22" fill="url(#doorGradient)" rx="2" />
            <circle cx="48" cy="72" r="1.5" fill="hsl(var(--accent-foreground))" />
          </svg>

          {/* Package delivery check mark */}
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [180, 0, 0],
            }}
            transition={{
              duration: 0.6,
              delay: 9,
              repeat: Infinity,
              repeatDelay: 7.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow-accent">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M 2,8 L 6,12 L 14,4"
                  fill="none"
                  stroke="hsl(var(--accent-foreground))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeliveryAnimation;
