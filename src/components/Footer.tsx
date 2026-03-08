import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl font-bold gold-text mb-4">PODIKART</h3>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              India's most trusted everyday podi brand. Homemade, hygienic, and authentic.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "Products", to: "/products" },
                { label: "Categories", to: "/categories" },
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Become a Partner", to: "/partner" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Policies</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Return & Refund Policy", to: "/return-refund-policy" },
                { label: "Delivery Policy", to: "/delivery-policy" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Terms and Conditions", to: "/terms-conditions" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-primary">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/70">
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 79899 07021</span>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> podikart.lmt@gmail.com</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Hyderabad, India</span>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-sm text-secondary-foreground/50">
          © 2026 Podikart. All rights reserved
        </div>
      </div>
    </footer>
  );
}
