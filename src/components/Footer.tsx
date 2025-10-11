import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-16 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-glow to-accent-glow bg-clip-text text-transparent">
              Swift Global
            </h3>
            <p className="text-background/70 leading-relaxed">
              Fast, reliable worldwide delivery. Your trusted partner for global shipping solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Track Package
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@swiftglobal.com"
                className="flex items-center gap-2 text-background/70 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
                hello@swiftglobal.com
              </a>
              <div className="flex gap-4 pt-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {currentYear} Swift Global Delivery. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-background/60 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-background/60 hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
