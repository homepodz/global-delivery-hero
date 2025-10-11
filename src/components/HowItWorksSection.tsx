import { motion } from "framer-motion";
import { ShoppingCart, Warehouse, Home } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Place Your Order",
    description: "Browse and order from our wide selection. We handle the rest.",
    step: "01",
  },
  {
    icon: Warehouse,
    title: "We Ship from the Closest Hub",
    description: "Your order is processed and shipped from the nearest distribution center.",
    step: "02",
  },
  {
    icon: Home,
    title: "Delivered to Your Door",
    description: "Fast, secure delivery right to your doorstep with real-time tracking.",
    step: "03",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to get your products delivered anywhere in the world
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative text-center"
            >
              <div className="relative inline-block mb-8">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-glow">
                  <step.icon className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.step}
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
