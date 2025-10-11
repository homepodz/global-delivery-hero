import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DeliveryAnimation from "./DeliveryAnimation";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_100%)]" />

      <div className="container mx-auto relative z-10">
        {/* Centered content layout */}
        <div className="max-w-7xl mx-auto">
          {/* Title and subtitle - centered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 space-y-6"
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Fast, Reliable
              </span>
              <br />
              <span className="text-foreground">Global Delivery</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We deliver your products worldwide with speed, care, and precision.
            </motion.p>
          </motion.div>

          {/* Stats row - centered above animation */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-1 tracking-tight">195+</div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">Countries</div>
            </div>
            <div className="hidden md:block h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-1 tracking-tight">24/7</div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">Support</div>
            </div>
            <div className="hidden md:block h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-1 tracking-tight">99.9%</div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">On Time</div>
            </div>
          </motion.div>

          {/* Animation - centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mx-auto mb-16"
            style={{ maxWidth: "600px", height: "500px" }}
          >
            <DeliveryAnimation />
          </motion.div>

          {/* CTA buttons - centered */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 group text-lg px-8 py-6 rounded-xl"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 hover:bg-secondary transition-all duration-300 text-lg px-8 py-6 rounded-xl"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Subtle floating elements for depth */}
      <motion.div
        className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-primary/30 blur-sm"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[15%] w-3 h-3 rounded-full bg-accent/30 blur-sm"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </section>
  );
};

export default HeroSection;
