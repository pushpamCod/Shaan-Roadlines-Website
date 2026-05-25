import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store";
import {
  ArrowLeftRight,
  Bus,
  Calendar,
  MapPin,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CITIES = [
  "Delhi",
  "Mumbai",
  "Pune",
  "Bangalore",
  "Chennai",
  "Jaipur",
  "Hyderabad",
  "Kolkata",
  "Agra",
  "Goa",
];

const POPULAR_ROUTES = [
  { from: "Delhi", to: "Jaipur" },
  { from: "Mumbai", to: "Pune" },
  { from: "Bangalore", to: "Chennai" },
  { from: "Delhi", to: "Agra" },
];

export default function BusSearchPage() {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const filteredFrom = CITIES.filter(
    (c) => c.toLowerCase().includes(from.toLowerCase()) && c !== to,
  );
  const filteredTo = CITIES.filter(
    (c) => c.toLowerCase().includes(to.toLowerCase()) && c !== from,
  );

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      addToast({
        type: "error",
        title: "Missing Details",
        message: "Please fill in origin, destination, and travel date.",
      });
      return;
    }
    navigate(
      `/bus/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&passengers=${passengers}`,
    );
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 py-12">
      {/* Floating blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Bus className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Bus Booking
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
            Book Bus Tickets
          </h1>
          <p className="text-muted-foreground text-lg">
            Search from 50,000+ routes across India
          </p>
        </div>

        {/* Search Card */}
        <div className="glass-card w-full p-6 md:p-8 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-4">
            {/* From */}
            <div className="relative">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <MapPin className="inline w-3 h-3 mr-1" />
                From
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  onFocus={() => setShowFromSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowFromSuggestions(false), 150)
                  }
                  placeholder="Origin city"
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/60 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  data-ocid="bus.from_input"
                />
                {showFromSuggestions && filteredFrom.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-xl overflow-hidden z-50 shadow-elevated">
                    {filteredFrom.map((city) => (
                      <button
                        key={city}
                        type="button"
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-teal-400/10 transition-colors"
                        onMouseDown={() => {
                          setFrom(city);
                          setShowFromSuggestions(false);
                        }}
                      >
                        <MapPin className="inline w-3 h-3 mr-2 text-teal-400" />
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Swap */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwap}
                className="rounded-full border-teal-400/40 hover:bg-teal-400/10 hover:border-teal-400 transition-smooth"
                data-ocid="bus.swap_button"
              >
                <ArrowLeftRight className="w-4 h-4 text-teal-400" />
              </Button>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <MapPin className="inline w-3 h-3 mr-1" />
                To
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  onFocus={() => setShowToSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowToSuggestions(false), 150)
                  }
                  placeholder="Destination city"
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/60 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  data-ocid="bus.to_input"
                />
                {showToSuggestions && filteredTo.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-xl overflow-hidden z-50 shadow-elevated">
                    {filteredTo.map((city) => (
                      <button
                        key={city}
                        type="button"
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-teal-400/10 transition-colors"
                        onMouseDown={() => {
                          setTo(city);
                          setShowToSuggestions(false);
                        }}
                      >
                        <MapPin className="inline w-3 h-3 mr-2 text-teal-400" />
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Calendar className="inline w-3 h-3 mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/60 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all text-foreground"
                data-ocid="bus.date_input"
              />
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Users className="inline w-3 h-3 mr-1" />
                Passengers
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  className="w-10 h-10 rounded-xl bg-background/50 border border-border/60 flex items-center justify-center text-lg font-bold hover:border-teal-400 hover:bg-teal-400/10 transition-all"
                  data-ocid="bus.passengers_decrement"
                >
                  −
                </button>
                <span
                  className="flex-1 text-center py-3 rounded-xl bg-background/50 border border-border/60 font-semibold text-foreground"
                  data-ocid="bus.passengers_count"
                >
                  {passengers}
                </span>
                <button
                  type="button"
                  onClick={() => setPassengers(Math.min(10, passengers + 1))}
                  className="w-10 h-10 rounded-xl bg-background/50 border border-border/60 flex items-center justify-center text-lg font-bold hover:border-teal-400 hover:bg-teal-400/10 transition-all"
                  data-ocid="bus.passengers_increment"
                >
                  +
                </button>
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="button"
              onClick={handleSearch}
              className="h-12 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold transition-smooth shadow-elevated"
              data-ocid="bus.search_button"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Buses
            </Button>
          </div>

          {/* Popular Routes */}
          <div className="mt-6 pt-5 border-t border-border/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              Popular Routes
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={`${route.from}-${route.to}`}
                  type="button"
                  onClick={() => {
                    setFrom(route.from);
                    setTo(route.to);
                  }}
                  className="px-3 py-1.5 rounded-full text-sm glass border border-teal-400/30 hover:border-teal-400 hover:bg-teal-400/10 transition-smooth text-foreground"
                  data-ocid={`bus.popular_route.${route.from.toLowerCase()}_${route.to.toLowerCase()}`}
                >
                  {route.from} → {route.to}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-teal-400">✓</span> 2,000+ operators
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-teal-400">✓</span> Instant confirmation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-teal-400">✓</span> Free cancellation
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
