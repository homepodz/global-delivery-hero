import { motion } from "framer-motion";
import { Plane, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Plane,
    title: "Fast Shipping Worldwide",
    description: "Express delivery to over 195 countries with real-time tracking every step of the way.",
  },
  {
    icon: Shield,
    title: "Trusted Couriers & Tracking",
    description: "Partner with the world's most reliable carriers. Track your package from warehouse to doorstep.",
  },
  {
    icon: Clock,
    title: "Satisfaction Guarantee",
    description: "99.9% on-time delivery rate. Your satisfaction is our commitment, backed by our promise.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of customers worldwide for fast, secure delivery
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="h-full border-0 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow mb-4">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
