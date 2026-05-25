import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Hotel, MapPin, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CITY_SUGGESTIONS = [
  "Mumbai",
  "Delhi",
  "Goa",
  "Jaipur",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Agra",
];

const POPULAR_DESTINATIONS = [
  {
    city: "Goa",
    tagline: "Beach Paradise",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    price: "₹2,499",
  },
  {
    city: "Jaipur",
    tagline: "Pink City",
    img: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400",
    price: "₹1,799",
  },
  {
    city: "Mumbai",
    tagline: "City of Dreams",
    img: "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=400",
    price: "₹3,299",
  },
  {
    city: "Delhi",
    tagline: "Capital Hub",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
    price: "₹2,199",
  },
  {
    city: "Bangalore",
    tagline: "Silicon Valley",
    img: "https://images.unsplash.com/photo-1596177624767-c33aaf04f882?w=400",
    price: "₹2,799",
  },
  {
    city: "Kolkata",
    tagline: "City of Joy",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    price: "₹1,599",
  },
];

export default function HotelSearchPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = city
    ? CITY_SUGGESTIONS.filter((c) =>
        c.toLowerCase().startsWith(city.toLowerCase()),
      )
    : CITY_SUGGESTIONS;

  function handleSearch() {
    if (!city.trim()) return;
    const params = new URLSearchParams({
      city,
      checkIn,
      checkOut,
      guests: guests.toString(),
      rooms: rooms.toString(),
    });
    navigate(`/hotel/results?${params.toString()}`);
  }

  function selectCity(c: string) {
    setCity(c);
    setShowSuggestions(false);
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hotel className="w-8 h-8 text-accent" />
              <span className="text-accent font-body text-sm font-semibold tracking-widest uppercase">
                Hotel Booking
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
              Find Perfect <span className="text-gradient">Hotels</span>
            </h1>
            <p className="text-white/70 text-lg font-body max-w-xl mx-auto">
              Discover luxury stays, boutique hotels and cozy guesthouses across
              India
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 mt-10 text-left shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* City */}
              <div className="lg:col-span-2 relative">
                <p className="text-white/70 text-xs font-body font-semibold uppercase tracking-wider mb-1">
                  Destination
                </p>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    data-ocid="hotel.search_input"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    placeholder="Enter city or hotel name"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary"
                  />
                  {showSuggestions && filtered.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                      {filtered.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onMouseDown={() => selectCity(c)}
                          className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors flex items-center gap-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Check-in */}
              <div>
                <p className="text-white/70 text-xs font-body font-semibold uppercase tracking-wider mb-1">
                  Check-in
                </p>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    data-ocid="hotel.checkin_input"
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white focus:border-primary"
                  />
                </div>
              </div>
              {/* Check-out */}
              <div>
                <p className="text-white/70 text-xs font-body font-semibold uppercase tracking-wider mb-1">
                  Check-out
                </p>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    data-ocid="hotel.checkout_input"
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-9 bg-white/10 border-white/20 text-white focus:border-primary"
                  />
                </div>
              </div>
              {/* Guests & Rooms */}
              <div>
                <p className="text-white/70 text-xs font-body font-semibold uppercase tracking-wider mb-1">
                  Guests / Rooms
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Users className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                    <Input
                      data-ocid="hotel.guests_input"
                      type="number"
                      min={1}
                      max={20}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="pl-7 bg-white/10 border-white/20 text-white focus:border-primary text-sm"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Hotel className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                    <Input
                      data-ocid="hotel.rooms_input"
                      type="number"
                      min={1}
                      max={10}
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="pl-7 bg-white/10 border-white/20 text-white focus:border-primary text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                data-ocid="hotel.search_button"
                onClick={handleSearch}
                size="lg"
                className="gradient-teal text-white font-semibold px-10 py-3 rounded-xl hover:opacity-90 transition-smooth"
              >
                <Search className="w-5 h-5 mr-2" /> Search Hotels
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-background py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground">
              Handpicked hotels at India's most loved cities
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  const params = new URLSearchParams({
                    city: dest.city,
                    checkIn,
                    checkOut,
                    guests: guests.toString(),
                    rooms: rooms.toString(),
                  });
                  navigate(`/hotel/results?${params.toString()}`);
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card card-hover"
                data-ocid={`hotel.destination.${i + 1}`}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={dest.img}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white font-display font-bold text-sm">
                      {dest.city}
                    </p>
                    <p className="text-white/70 text-xs">{dest.tagline}</p>
                  </div>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-sm font-bold text-primary">
                    {dest.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-alt py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-display font-bold text-foreground mb-6">
            Why Book with Shaan Roadlines?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🏷️",
                title: "Best Price Guarantee",
                desc: "We match any lower price you find",
              },
              {
                icon: "🔓",
                title: "Free Cancellation",
                desc: "Cancel up to 24h before check-in",
              },
              {
                icon: "⭐",
                title: "Verified Reviews",
                desc: "Genuine reviews from real guests",
              },
            ].map((tip) => (
              <div key={tip.title} className="glass-card rounded-2xl p-5">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h4 className="font-display font-semibold text-foreground mb-1">
                  {tip.title}
                </h4>
                <p className="text-sm text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
