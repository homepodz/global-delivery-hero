import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DeliveryAnimation from "./DeliveryAnimation";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-background via-background to-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--gradient-hero))] pointer-events-none" />
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Fast, Reliable Global Delivery
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We deliver your products worldwide with speed, care, and precision.
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 hover:bg-secondary transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            className="flex items-center gap-8 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <div className="text-3xl font-bold text-primary">195+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">On Time</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[500px] lg:h-[600px]"
        >
          <DeliveryAnimation />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
