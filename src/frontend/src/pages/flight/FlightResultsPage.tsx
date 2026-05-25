import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFlights } from "@/hooks/useBackend";
import type { FlightView } from "@/types";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Luggage,
  Plane,
  SlidersHorizontal,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AIRLINES = [
  {
    name: "IndiGo",
    color: "bg-indigo-500",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Air India",
    color: "bg-red-500",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "SpiceJet",
    color: "bg-orange-500",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Vistara",
    color: "bg-teal-500",
    textColor: "text-teal-600 dark:text-teal-400",
  },
];

function getAirlineStyle(airline: string) {
  return (
    AIRLINES.find((a) => a.name.toLowerCase() === airline.toLowerCase()) ?? {
      name: airline,
      color: "bg-primary",
      textColor: "text-primary",
    }
  );
}

function FlightSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-xl" />
          <div>
            <div className="skeleton h-4 w-20 rounded mb-1" />
            <div className="skeleton h-3 w-14 rounded" />
          </div>
        </div>
        <div className="flex-1 flex gap-6 px-4">
          <div className="skeleton h-6 w-12 rounded" />
          <div className="flex-1 skeleton h-px" />
          <div className="skeleton h-6 w-12 rounded" />
        </div>
        <div className="skeleton h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}

interface FlightCardProps {
  flight: FlightView;
  isBestDeal: boolean;
  index: number;
}

function FlightCard({ flight, isBestDeal, index }: FlightCardProps) {
  const navigate = useNavigate();
  const style = getAirlineStyle(flight.airline);
  const price = Number(flight.price);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`bg-card border rounded-2xl overflow-hidden transition-smooth hover:shadow-lg ${
        isBestDeal ? "border-accent/60 ring-1 ring-accent/30" : "border-border"
      }`}
      data-ocid={`flight.result.item.${index + 1}`}
    >
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Airline */}
          <div className="flex items-center gap-3 min-w-[140px]">
            <div
              className={`w-10 h-10 rounded-xl ${style.color} flex items-center justify-center shadow-md`}
            >
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${style.textColor}`}>
                {flight.airline}
              </p>
              <p className="text-muted-foreground text-xs">
                {flight.flightNumber}
              </p>
            </div>
            {isBestDeal && (
              <Badge className="bg-accent/20 text-accent-foreground border-accent/40 text-xs ml-1">
                🏆 Best
              </Badge>
            )}
          </div>

          {/* Route timeline */}
          <div className="flex-1 flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-bold font-display text-foreground">
                {flight.departureTime}
              </p>
              <p className="text-muted-foreground text-sm font-mono">
                {flight.from}
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <p className="text-muted-foreground text-xs mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {flight.duration}
              </p>
              <div className="w-full flex items-center gap-1">
                <div className="h-px flex-1 bg-border" />
                <Plane className="w-4 h-4 text-primary rotate-90" />
                <div className="h-px flex-1 bg-border" />
              </div>
              <p
                className={`text-xs mt-1 font-medium ${
                  Number(flight.stops) === 0
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {Number(flight.stops) === 0
                  ? "Non-stop"
                  : `${Number(flight.stops)} Stop`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold font-display text-foreground">
                {flight.arrivalTime}
              </p>
              <p className="text-muted-foreground text-sm font-mono">
                {flight.to}
              </p>
            </div>
          </div>

          {/* Price + book */}
          <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-1 md:min-w-[130px]">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Luggage className="w-3.5 h-3.5" />
              <span>{flight.baggage}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {flight.cabin}
            </Badge>
            <div className="text-right">
              <p className="text-2xl font-bold font-display text-foreground">
                ₹{price.toLocaleString("en-IN")}
              </p>
              <p className="text-muted-foreground text-xs">per person</p>
            </div>
            <Button
              type="button"
              onClick={() => navigate(`/flight/${flight.id}/seats`)}
              data-ocid={`flight.result.book_button.${index + 1}`}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 rounded-xl transition-smooth"
            >
              Book <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          data-ocid={`flight.result.expand.${index + 1}`}
          className="mt-3 text-xs text-primary flex items-center gap-1 hover:opacity-80 transition-smooth"
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {expanded ? "Hide details" : "View details"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border bg-muted/30 px-5 py-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Flight</p>
                <p className="font-semibold">{flight.flightNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Class</p>
                <p className="font-semibold capitalize">{flight.cabin}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Baggage</p>
                <p className="font-semibold">{flight.baggage}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Seats Left</p>
                <p className="font-semibold text-emerald-500">
                  {Number(flight.availableSeats)} available
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FlightResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const date = searchParams.get("date") ?? "";
  const cabinParam = searchParams.get("cabin") ?? "";

  const { data: flights = [], isLoading } = useFlights(
    from || undefined,
    to || undefined,
    date || undefined,
    cabinParam || undefined,
  );

  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">(
    "price",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20000);

  function toggleAirline(name: string) {
    setSelectedAirlines((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  }

  function toggleStops(val: string) {
    setSelectedStops((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val],
    );
  }

  const filtered = useMemo(() => {
    let result = [...flights];
    if (selectedAirlines.length > 0)
      result = result.filter((f) => selectedAirlines.includes(f.airline));
    if (selectedStops.includes("non-stop"))
      result = result.filter((f) => Number(f.stops) === 0);
    else if (selectedStops.includes("1-stop"))
      result = result.filter((f) => Number(f.stops) === 1);
    result = result.filter((f) => Number(f.price) <= maxPrice);
    if (sortBy === "price")
      result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "departure")
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    else result.sort((a, b) => a.duration.localeCompare(b.duration));
    return result;
  }, [flights, selectedAirlines, selectedStops, maxPrice, sortBy]);

  const cheapestPrice =
    flights.length > 0 ? Math.min(...flights.map((f) => Number(f.price))) : 0;
  const fastestFlight = flights.reduce<FlightView | null>((acc, f) => {
    if (!acc) return f;
    return f.duration < acc.duration ? f : acc;
  }, null);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Airlines
        </p>
        {AIRLINES.map((a) => (
          <label
            key={a.name}
            className="flex items-center gap-2 py-1.5 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedAirlines.includes(a.name)}
              onChange={() => toggleAirline(a.name)}
              data-ocid={`flight.filter.airline.${a.name.toLowerCase().replace(" ", "_")}`}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {a.name}
            </span>
          </label>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Stops
        </p>
        {[
          { label: "Non-stop", value: "non-stop" },
          { label: "1 Stop", value: "1-stop" },
        ].map((s) => (
          <label
            key={s.value}
            className="flex items-center gap-2 py-1.5 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedStops.includes(s.value)}
              onChange={() => toggleStops(s.value)}
              data-ocid={`flight.filter.stops.${s.value}`}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {s.label}
            </span>
          </label>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
          Max Price
        </p>
        <input
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          data-ocid="flight.filter.price_range"
          className="w-full accent-primary"
        />
        <p className="text-sm font-bold text-primary mt-1">
          ₹{maxPrice.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Search header */}
      <div className="gradient-hero py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white text-xl font-display font-bold">
                <span>{from || "???"}</span>
                <ArrowRight className="w-5 h-5 text-accent" />
                <span>{to || "???"}</span>
              </div>
              <p className="text-white/60 text-sm mt-1">
                {date} · {searchParams.get("adults") ?? 1} Traveller ·{" "}
                {cabinParam || "Economy"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/flight")}
              data-ocid="flight.results.modify_search"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Modify Search
            </Button>
          </div>
        </div>
      </div>

      {/* Price comparison bar */}
      {!isLoading && flights.length > 0 && (
        <div className="border-b border-border bg-card">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-6 overflow-x-auto">
            {[
              {
                label: "Cheapest",
                icon: <Zap className="w-4 h-4" />,
                price: cheapestPrice,
                color: "text-emerald-500",
              },
              {
                label: "Fastest",
                icon: <Clock className="w-4 h-4" />,
                price: fastestFlight ? Number(fastestFlight.price) : 0,
                color: "text-primary",
              },
              {
                label: "Best Value",
                icon: <Star className="w-4 h-4" />,
                price: cheapestPrice + 200,
                color: "text-accent",
              },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center gap-2 shrink-0">
                <span className={opt.color}>{opt.icon}</span>
                <span className="text-muted-foreground text-sm">
                  {opt.label}:
                </span>
                <span className="font-bold text-foreground text-sm">
                  ₹{opt.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-4">
              <h3 className="font-display font-semibold text-foreground mb-5 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Searching..."
                  : `${filtered.length} flight${filtered.length !== 1 ? "s" : ""} found`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="md:hidden flex items-center gap-1 text-sm border border-border rounded-xl px-3 py-1.5 text-foreground"
                  data-ocid="flight.mobile_filter_toggle"
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <span className="text-muted-foreground text-xs">Sort:</span>
                {(["price", "duration", "departure"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSortBy(s)}
                    data-ocid={`flight.sort.${s}`}
                    className={`text-xs px-3 py-1.5 rounded-full transition-smooth capitalize ${
                      sortBy === s
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <FlightSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
                data-ocid="flight.results.empty_state"
              >
                <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No flights found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button type="button" onClick={() => navigate("/flight")}>
                  Search Again
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filtered.map((flight, i) => (
                  <FlightCard
                    key={flight.id.toString()}
                    flight={flight}
                    isBestDeal={Number(flight.price) === cheapestPrice}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card p-5 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold">Filters</h3>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              <FilterPanel />
              <Button
                type="button"
                className="w-full mt-6"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
