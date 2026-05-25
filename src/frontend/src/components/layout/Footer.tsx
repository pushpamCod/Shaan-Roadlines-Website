import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Bus,
  Hotel,
  Instagram,
  Linkedin,
  Mail,
  Plane,
  TrainFront,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const footerLinks = {
  Company: [
    { href: "/about-founder", label: "About Founder" },
    { href: "#careers", label: "Careers" },
    { href: "#press", label: "Press" },
  ],
  Services: [
    { href: "/bus", label: "Bus Booking" },
    { href: "/train", label: "Train Booking" },
    { href: "/flight", label: "Flight Booking" },
    { href: "/hotel", label: "Hotel Booking" },
  ],
  Support: [
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact Us" },
    { href: "#cancellation", label: "Cancellation Policy" },
    { href: "#privacy", label: "Privacy Policy" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      {/* Gradient top bar */}
      <div className="h-px gradient-teal" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 font-display font-bold text-xl mb-3"
            >
              <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-gradient">Shaan Roadlines</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              Your premium travel companion. Book buses, trains, flights, and
              hotels with confidence. Best prices, seamless experience.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold mb-2">
                Get travel deals in your inbox
              </p>
              {subscribed ? (
                <p className="text-sm text-primary">
                  ✓ Subscribed! Welcome to Shaan Roadlines deals.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm"
                    data-ocid="footer.newsletter_input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    data-ocid="footer.newsletter_submit"
                    className="gradient-teal text-white border-0 shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shaan Roadlines. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
