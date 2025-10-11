import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    country: "United States",
    flag: "🇺🇸",
    rating: 5,
    text: "Incredibly fast shipping! My package arrived in just 3 days from across the globe. The tracking was accurate and customer service was excellent.",
  },
  {
    name: "Marco Rossi",
    country: "Italy",
    flag: "🇮🇹",
    rating: 5,
    text: "Outstanding service from start to finish. The package was handled with care and arrived in perfect condition. Highly recommended!",
  },
  {
    name: "Yuki Tanaka",
    country: "Japan",
    flag: "🇯🇵",
    rating: 5,
    text: "Professional and reliable. This is my third order and every time the delivery has been flawless. They truly care about their customers.",
  },
];

const TestimonialsSection = () => {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted Worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our customers from around the globe have to say
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full border-0 shadow-card hover:shadow-glow transition-all duration-500 bg-card">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="text-3xl">{testimonial.flag}</div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.country}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
