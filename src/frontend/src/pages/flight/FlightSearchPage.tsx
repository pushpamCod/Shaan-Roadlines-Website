import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plane,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AIRPORTS = [
  { code: "DEL", city: "Delhi", airport: "Indira Gandhi Intl" },
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Intl" },
  { code: "BLR", city: "Bangalore", airport: "Kempegowda Intl" },
  { code: "GOA", city: "Goa", airport: "Dabolim Airport" },
  { code: "CCU", city: "Kolkata", airport: "Netaji Subhas Intl" },
  { code: "HYD", city: "Hyderabad", airport: "Rajiv Gandhi Intl" },
  { code: "MAA", city: "Chennai", airport: "Chennai Intl" },
];

const POPULAR_ROUTES = [
  {
    from: "DEL",
    to: "BOM",
    label: "Delhi → Mumbai",
    price: "₹3,299",
    emoji: "✈️",
  },
  {
    from: "BOM",
    to: "GOA",
    label: "Mumbai → Goa",
    price: "₹2,199",
    emoji: "🏖️",
  },
  {
    from: "DEL",
    to: "BLR",
    label: "Delhi → Bangalore",
    price: "₹4,099",
    emoji: "🌆",
  },
  {
    from: "CCU",
    to: "DEL",
    label: "Kolkata → Delhi",
    price: "₹3,599",
    emoji: "🕌",
  },
];

type TripType = "one-way" | "round-trip" | "multi-city";
type CabinClass = "economy" | "business" | "first";

interface PassengerCount {
  adults: number;
  children: number;
}

export default function FlightSearchPage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [passengers, setPassengers] = useState<PassengerCount>({
    adults: 1,
    children: 0,
  });
  const [showPassengers, setShowPassengers] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function swapAirports() {
    setFrom(to);
    setTo(from);
  }

  function handleSearch() {
    if (!from || !to || !departure) return;
    const params = new URLSearchParams({
      from,
      to,
      date: departure,
      cabin,
      tripType,
      adults: passengers.adults.toString(),
      children: passengers.children.toString(),
    });
    if (tripType === "round-trip" && returnDate)
      params.set("returnDate", returnDate);
    navigate(`/flight/results?${params.toString()}`);
  }

  function handlePopularRoute(f: string, t: string) {
    setFrom(f);
    setTo(t);
    setDeparture(today);
  }

  const totalPassengers = passengers.adults + passengers.children;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative gradient-hero overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ x: [0, 12, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <Plane
                  className="w-10 h-10 text-accent"
                  style={{ fill: "rgba(245,158,11,0.2)" }}
                />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Book <span className="text-gradient">Flights</span>
              </h1>
            </div>
            <p className="text-white/70 text-lg">
              Search hundreds of airlines for the best deals
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card rounded-3xl p-6 md:p-8"
          >
            {/* Trip Type Tabs */}
            <div className="flex gap-2 mb-6">
              {(["one-way", "round-trip", "multi-city"] as TripType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTripType(t)}
                    data-ocid={`flight.trip_type.${t.replace("-", "_")}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth capitalize ${
                      tripType === t
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t.replace("-", " ")}
                  </button>
                ),
              )}
            </div>

            {/* From / To + Swap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative">
              <div className="space-y-1.5">
                <p className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> From
                </p>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  data-ocid="flight.from_select"
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {AIRPORTS.map((a) => (
                    <option
                      key={a.code}
                      value={a.code}
                      className="bg-background text-foreground"
                    >
                      {a.code} — {a.city}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swapAirports}
                data-ocid="flight.swap_button"
                className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[20%] md:translate-y-[-50%] z-10 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full p-2 shadow-lg transition-smooth hover:rotate-180"
                aria-label="Swap airports"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5">
                <p className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> To
                </p>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  data-ocid="flight.to_select"
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {AIRPORTS.map((a) => (
                    <option
                      key={a.code}
                      value={a.code}
                      className="bg-background text-foreground"
                    >
                      {a.code} — {a.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates + Cabin + Passengers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1.5">
                <p className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Departure
                </p>
                <input
                  type="date"
                  min={today}
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  data-ocid="flight.departure_date"
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {tripType === "round-trip" ? (
                <div className="space-y-1.5">
                  <p className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Return
                  </p>
                  <input
                    type="date"
                    min={departure || today}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    data-ocid="flight.return_date"
                    className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ) : (
                <div />
              )}

              <div className="space-y-1.5">
                <p className="text-white/60 text-xs uppercase tracking-wider">
                  Cabin
                </p>
                <select
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value as CabinClass)}
                  data-ocid="flight.cabin_select"
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="economy" className="bg-background">
                    Economy
                  </option>
                  <option value="business" className="bg-background">
                    Business
                  </option>
                  <option value="first" className="bg-background">
                    First Class
                  </option>
                </select>
              </div>

              <div className="relative space-y-1.5">
                <p className="text-white/60 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Passengers
                </p>
                <button
                  type="button"
                  onClick={() => setShowPassengers(!showPassengers)}
                  data-ocid="flight.passengers_toggle"
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-3 text-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span>
                    {totalPassengers} Traveller{totalPassengers > 1 ? "s" : ""}
                  </span>
                  {showPassengers ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showPassengers && (
                  <div className="absolute top-full mt-1 left-0 z-20 glass-card rounded-2xl p-4 w-64 shadow-2xl border border-white/20">
                    {(["adults", "children"] as const).map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="text-white text-sm font-medium capitalize">
                            {type}
                          </p>
                          <p className="text-white/50 text-xs">
                            {type === "adults" ? "12+ yrs" : "2–11 yrs"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPassengers((p) => ({
                                ...p,
                                [type]: Math.max(
                                  type === "adults" ? 1 : 0,
                                  p[type] - 1,
                                ),
                              }))
                            }
                            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-smooth"
                          >
                            −
                          </button>
                          <span className="text-white w-4 text-center">
                            {passengers[type]}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setPassengers((p) => ({
                                ...p,
                                [type]: Math.min(9, p[type] + 1),
                              }))
                            }
                            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-smooth"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      className="w-full mt-2"
                      size="sm"
                      onClick={() => setShowPassengers(false)}
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleSearch}
              disabled={!from || !to || !departure}
              data-ocid="flight.search_button"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-4 rounded-2xl shadow-lg transition-smooth"
            >
              <Plane className="w-5 h-5 mr-2" />
              Search Flights
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Popular Routes
          </h2>
          <p className="text-muted-foreground mb-8">
            Frequently searched destinations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ROUTES.map((route, i) => (
              <motion.button
                key={route.label}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => handlePopularRoute(route.from, route.to)}
                data-ocid={`flight.popular_route.${i + 1}`}
                className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/50 hover:shadow-lg transition-smooth"
              >
                <div className="text-3xl mb-3">{route.emoji}</div>
                <div className="flex items-center gap-1 text-foreground font-semibold text-sm">
                  <span>{route.from}</span>
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span>{route.to}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-0.5 mb-3">
                  {route.label}
                </p>
                <Badge
                  variant="secondary"
                  className="text-xs font-bold text-primary"
                >
                  From {route.price}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
