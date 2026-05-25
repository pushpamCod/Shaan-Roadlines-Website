import type { BusView } from "@/backend";
import { BusType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBuses } from "@/hooks/useBackend";
import {
  ArrowRight,
  Bus,
  Clock,
  Droplets,
  Filter,
  MapPin,
  Star,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type BusTypeFilter =
  | "AC_Sleeper"
  | "AC_Seater"
  | "NonAC_Sleeper"
  | "NonAC_Seater";

function getBusTypeLabel(bus: BusView): string {
  if (bus.busType === BusType.AC_Sleeper) return "AC Sleeper";
  if (bus.busType === BusType.AC_Seater) return "AC Seater";
  if (bus.busType === BusType.NonAC_Sleeper) return "Non-AC Sleeper";
  return "Non-AC Seater";
}

function BusCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl p-5 bg-muted/30 border border-border/20">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-muted w-40 rounded" />
        <div className="h-5 bg-muted w-24 rounded" />
      </div>
      <div className="flex gap-4 mb-3">
        <div className="h-8 bg-muted w-20 rounded" />
        <div className="h-8 bg-muted w-16 rounded" />
        <div className="h-8 bg-muted w-20 rounded" />
      </div>
      <div className="h-4 bg-muted w-32 rounded mb-2" />
      <div className="flex justify-between mt-4">
        <div className="h-6 bg-muted w-24 rounded" />
        <div className="h-10 bg-muted w-28 rounded-xl" />
      </div>
    </div>
  );
}

const BUS_TYPES: { label: string; key: BusTypeFilter }[] = [
  { label: "AC Sleeper", key: "AC_Sleeper" },
  { label: "AC Seater", key: "AC_Seater" },
  { label: "Non-AC Sleeper", key: "NonAC_Sleeper" },
  { label: "Non-AC Seater", key: "NonAC_Seater" },
];

export default function BusResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const { data: buses, isLoading } = useBuses(
    from || undefined,
    to || undefined,
  );

  const [selectedTypes, setSelectedTypes] = useState<BusTypeFilter[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);

  const toggleType = (key: BusTypeFilter) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key],
    );
  };

  const filteredBuses = (buses ?? []).filter((bus) => {
    const typeLabel = getBusTypeLabel(bus);
    const typeKey = BUS_TYPES.find((t) => t.label === typeLabel)?.key;
    const typeMatch =
      selectedTypes.length === 0 ||
      (typeKey && selectedTypes.includes(typeKey));
    const ratingMatch = bus.rating >= minRating;
    const priceMatch = Number(bus.price) <= maxPrice;
    return typeMatch && ratingMatch && priceMatch;
  });

  const hasAmenity = (bus: BusView, name: string) =>
    bus.amenities.some((a) => a.toLowerCase().includes(name.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/60 shadow-subtle sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-foreground">
              <MapPin className="w-4 h-4 text-teal-400" />
              {from}
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              {to}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {date} · {passengers} passenger{Number(passengers) > 1 ? "s" : ""}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/bus")}
            className="rounded-xl text-xs"
            data-ocid="bus_results.modify_search"
          >
            Modify Search
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Filters */}
        <div
          className={`${showFilters ? "flex" : "hidden"} md:flex flex-col w-64 shrink-0 glass-card rounded-2xl p-5 h-fit sticky top-24 gap-5`}
          data-ocid="bus_results.filters_panel"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-400" />
              Filters
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedTypes([]);
                setMinRating(0);
                setMaxPrice(5000);
              }}
              className="text-xs text-teal-400 hover:underline"
              data-ocid="bus_results.clear_filters"
            >
              Clear all
            </button>
          </div>

          {/* Bus Type Filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Bus Type
            </p>
            <div className="flex flex-col gap-2">
              {BUS_TYPES.map((type) => (
                <label
                  key={type.key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.key)}
                    onChange={() => toggleType(type.key)}
                    className="rounded border-border accent-teal-500"
                    data-ocid={`bus_results.filter_type.${type.key.toLowerCase()}`}
                  />
                  <span className="text-sm text-foreground">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Min Rating: {minRating > 0 ? `${minRating}★` : "Any"}
            </p>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-teal-500"
              data-ocid="bus_results.filter_rating"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Any</span>
              <span>5★</span>
            </div>
          </div>

          {/* Max Price Filter */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Max Price: ₹{maxPrice}
            </p>
            <input
              type="range"
              min={200}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-500"
              data-ocid="bus_results.filter_price"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹200</span>
              <span>₹5,000</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl"
              data-ocid="bus_results.toggle_filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>

          {/* Results header */}
          {!isLoading && (
            <div className="mb-4 flex items-center gap-2">
              <Bus className="w-4 h-4 text-teal-400" />
              <span className="font-semibold text-foreground">
                {filteredBuses.length} bus
                {filteredBuses.length !== 1 ? "es" : ""} found
              </span>
              {from && to && (
                <span className="text-muted-foreground text-sm">
                  for {from} → {to}
                </span>
              )}
            </div>
          )}

          {/* Skeleton loaders */}
          {isLoading && (
            <div className="flex flex-col gap-4">
              <BusCardSkeleton />
              <BusCardSkeleton />
              <BusCardSkeleton />
            </div>
          )}

          {/* Bus cards */}
          {!isLoading && (
            <div className="flex flex-col gap-4" data-ocid="bus_results.list">
              {filteredBuses.length === 0 ? (
                <div
                  className="glass-card rounded-2xl p-12 text-center"
                  data-ocid="bus_results.empty_state"
                >
                  <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No buses found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search for a different route.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedTypes([]);
                      setMinRating(0);
                      setMaxPrice(5000);
                    }}
                    className="rounded-xl"
                    data-ocid="bus_results.reset_filters"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                filteredBuses.map((bus, index) => {
                  const busTypeLabel = getBusTypeLabel(bus);
                  const isAC = busTypeLabel.includes("AC");
                  const price = Number(bus.price);
                  const availableSeats = Number(bus.availableSeats);

                  return (
                    <motion.div
                      key={Number(bus.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                      className="glass-card rounded-xl p-5 hover:shadow-elevated transition-smooth cursor-pointer group"
                      data-ocid={`bus_results.item.${index + 1}`}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-foreground group-hover:text-teal-400 transition-colors">
                            {bus.operatorName}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {bus.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              isAC
                                ? "border-teal-400/50 text-teal-400 bg-teal-400/10"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {busTypeLabel}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              availableSeats < 5
                                ? "border-red-400/50 text-red-400 bg-red-400/10"
                                : "border-emerald-400/50 text-emerald-400 bg-emerald-400/10"
                            }`}
                          >
                            {availableSeats} seats left
                          </Badge>
                        </div>
                      </div>

                      {/* Middle row: times */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-xl font-bold text-foreground">
                            {bus.departureTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bus.from}
                          </p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {bus.duration}
                          </div>
                          <div className="w-full h-px bg-border/60 mt-1 relative">
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-400" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-foreground">
                            {bus.arrivalTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {bus.to}
                          </p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                        {hasAmenity(bus, "wifi") && (
                          <span className="flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-teal-400" />
                            WiFi
                          </span>
                        )}
                        {hasAmenity(bus, "charging") && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            Charging
                          </span>
                        )}
                        {hasAmenity(bus, "water") && (
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-400" />
                            Water
                          </span>
                        )}
                        {bus.amenities
                          .slice(0, 2)
                          .filter(
                            (a) =>
                              !a.toLowerCase().includes("wifi") &&
                              !a.toLowerCase().includes("charging") &&
                              !a.toLowerCase().includes("water"),
                          )
                          .map((a) => (
                            <span
                              key={a}
                              className="px-2 py-0.5 rounded-full bg-muted/40 text-xs"
                            >
                              {a}
                            </span>
                          ))}
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= Math.round(bus.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {bus.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-teal-400">
                              ₹{price.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              per seat
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/bus/${Number(bus.id)}/seats?passengers=${passengers}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`,
                              )
                            }
                            className="bg-teal-500 hover:bg-teal-400 text-white rounded-xl px-5 transition-smooth"
                            data-ocid={`bus_results.select_seats.${index + 1}`}
                          >
                            Select Seats
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
