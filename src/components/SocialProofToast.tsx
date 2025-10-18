import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { generateMockToast } from "@/data/mockShopActivity";

const TOAST_INTERVAL_MIN = 20000; // 20s
const TOAST_INTERVAL_MAX = 45000; // 45s
const TOAST_DURATION = 4500; // 4.5s display
const COOLDOWN_DURATION = 900000; // 15 min after manual close
const SLEEP_HOURS = [1, 2, 3, 4, 5, 6]; // 01:00-06:00

const SocialProofToast = () => {
  const [toast, setToast] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user manually dismissed recently
    const lastDismissed = localStorage.getItem("toast_dismissed_at");
    if (lastDismissed) {
      const timeSince = Date.now() - parseInt(lastDismissed);
      if (timeSince < COOLDOWN_DURATION) {
        setIsDismissed(true);
        setTimeout(() => setIsDismissed(false), COOLDOWN_DURATION - timeSince);
        return;
      }
    }

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const showToast = () => {
      // Check sleep hours (using client timezone)
      const hour = new Date().getHours();
      if (SLEEP_HOURS.includes(hour)) return;

      // Don't show if user dismissed
      if (isDismissed) return;

      // Generate and show toast
      const message = generateMockToast();
      setToast(message);

      // Auto-dismiss after duration
      setTimeout(() => {
        setToast(null);
      }, TOAST_DURATION);
    };

    // Initial delay
    const initialDelay = Math.random() * 10000 + 5000; // 5-15s
    const initialTimer = setTimeout(showToast, initialDelay);

    // Recurring toasts with jitter
    const scheduleNext = () => {
      const jitter = Math.random() * (TOAST_INTERVAL_MAX - TOAST_INTERVAL_MIN) + TOAST_INTERVAL_MIN;
      return setTimeout(() => {
        showToast();
        scheduleNext();
      }, jitter);
    };

    const recurringTimer = scheduleNext();

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(recurringTimer);
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    setToast(null);
    setIsDismissed(true);
    localStorage.setItem("toast_dismissed_at", Date.now().toString());

    // Reset after cooldown
    setTimeout(() => {
      setIsDismissed(false);
    }, COOLDOWN_DURATION);
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ 
            duration: 0.25, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          className="fixed bottom-6 left-6 max-md:left-1/2 max-md:-translate-x-1/2 z-50 max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl shadow-elegant px-4 py-3 pr-12 relative">
            <p className="text-sm text-foreground/90 font-medium">
              {toast}
            </p>
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofToast;
