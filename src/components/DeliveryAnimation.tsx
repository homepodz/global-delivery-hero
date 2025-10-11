import { motion } from "framer-motion";

const DeliveryAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Globe */}
      <motion.div
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg width="300" height="300" viewBox="0 0 300 300" className="opacity-20">
          <circle cx="150" cy="150" r="140" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
          <ellipse cx="150" cy="150" rx="140" ry="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
          <ellipse cx="150" cy="150" rx="60" ry="140" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="10" y1="150" x2="290" y2="150" stroke="hsl(var(--primary))" strokeWidth="1" />
          <line x1="150" y1="10" x2="150" y2="290" stroke="hsl(var(--primary))" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Plane Animation */}
      <motion.div
        className="absolute"
        initial={{ offsetDistance: "0%", scale: 0.8 }}
        animate={{
          offsetDistance: ["0%", "100%"],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          offsetPath: "path('M 150,10 A 140,140 0 1,1 150,290 A 140,140 0 1,1 150,10')",
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path
            d="M30 10 L45 35 L30 30 L15 35 Z M30 30 L30 45"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* Truck Animation (appears after plane) */}
      <motion.div
        className="absolute left-[15%] bottom-[30%]"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: [0, 150], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          times: [0, 0.5, 0.9, 1],
          delay: 4,
        }}
      >
        <svg width="70" height="50" viewBox="0 0 70 50">
          {/* Truck body */}
          <rect x="10" y="15" width="35" height="20" rx="3" fill="hsl(var(--accent))" />
          <rect x="40" y="20" width="20" height="15" rx="2" fill="hsl(var(--accent))" />
          {/* Wheels */}
          <circle cx="20" cy="40" r="6" fill="hsl(var(--foreground))" />
          <circle cx="50" cy="40" r="6" fill="hsl(var(--foreground))" />
        </svg>
      </motion.div>

      {/* House (delivery destination) */}
      <motion.div
        className="absolute right-[15%] bottom-[25%]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1], opacity: [0, 1] }}
        transition={{
          duration: 1,
          delay: 6,
          repeat: Infinity,
          repeatDelay: 7,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* House roof */}
          <path d="M 40,20 L 70,45 L 10,45 Z" fill="hsl(var(--primary))" />
          {/* House body */}
          <rect x="20" y="45" width="40" height="30" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          {/* Door */}
          <rect x="32" y="55" width="16" height="20" fill="hsl(var(--accent))" rx="2" />
          {/* Window */}
          <rect x="25" y="50" width="10" height="10" fill="hsl(var(--primary) / 0.3)" rx="1" />
          <rect x="45" y="50" width="10" height="10" fill="hsl(var(--primary) / 0.3)" rx="1" />
        </svg>
      </motion.div>

      {/* Package delivery indicator */}
      <motion.div
        className="absolute right-[22%] bottom-[35%]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.5,
          delay: 6.5,
          repeat: Infinity,
          repeatDelay: 6.5,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <rect x="4" y="4" width="12" height="12" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="1" rx="1" />
          <line x1="4" y1="10" x2="16" y2="10" stroke="hsl(var(--foreground))" strokeWidth="1" />
          <line x1="10" y1="4" x2="10" y2="16" stroke="hsl(var(--foreground))" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
};

export default DeliveryAnimation;
