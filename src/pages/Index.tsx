import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Footer from "@/components/Footer";
import SocialProofToast from "@/components/SocialProofToast";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <HeroSection />

      {/* Features section */}
      <FeaturesSection />

      {/* How It Works section */}
      <HowItWorksSection />

      {/* Footer and social proof */}
      <Footer />
      <SocialProofToast />
    </div>
  );
};

export default Index;
