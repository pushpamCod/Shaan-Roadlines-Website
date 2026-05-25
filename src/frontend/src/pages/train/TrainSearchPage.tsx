import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  Train,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CITIES = [
  "Delhi",
  "Mumbai",
  "Howrah",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Jaipur",
  "Pune",
  "Kolkata",
  "Bhopal",
];
const CLASSES = [
  "Sleeper",
  "3AC",
  "2AC",
  "1AC",
  "Chair Car",
  "Executive",
  "General",
];

const POPULAR_ROUTES = [
  {
    from: "Delhi",
    to: "Howrah",
    name: "Rajdhani Express",
    duration: "17h 30m",
    price: 1200,
  },
  {
    from: "Delhi",
    to: "Bhopal",
    name: "Shatabdi Express",
    duration: "7h 45m",
    price: 850,
  },
  {
    from: "Delhi",
    to: "Mumbai",
    name: "Duronto Express",
    duration: "23h 15m",
    price: 1500,
  },
  {
    from: "Hyderabad",
    to: "Chennai",
    name: "Charminar Express",
    duration: "13h 20m",
    price: 680,
  },
];

const PNR_STATUSES = [
  {
    status: "Confirmed",
    coach: "S4",
    berth: "LB 32",
    color: "text-emerald-500",
  },
  {
    status: "Waiting List 12",
    coach: "—",
    berth: "—",
    color: "text-amber-500",
  },
  { status: "RAC 45", coach: "B2", berth: "SL 67", color: "text-blue-500" },
];

function StationInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered =
    value.length > 0
      ? CITIES.filter((c) => c.toLowerCase().includes(value.toLowerCase()))
      : CITIES;

  return (
    <div className="relative flex-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="pl-9 bg-card border-border h-12"
        />
      </div>
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden"
          >
            {filtered.slice(0, 6).map((city) => (
              <li
                key={city}
                onMouseDown={() => {
                  onChange(city);
                  setOpen(false);
                }}
                className="px-4 py-2.5 cursor-pointer hover:bg-primary/10 text-sm flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                {city}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TrainSearchPage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [cls, setCls] = useState("Sleeper");
  const [passengers, setPassengers] = useState(1);
  const [pnr, setPnr] = useState("");
  const [pnrResult, setPnrResult] = useState<(typeof PNR_STATUSES)[0] | null>(
    null,
  );
  const [showPnrModal, setShowPnrModal] = useState(false);

  const handleSearch = () => {
    if (!from || !to || !date) return;
    navigate(
      `/train/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&class=${encodeURIComponent(cls)}&passengers=${passengers}`,
    );
  };

  const handlePnrCheck = () => {
    if (!pnr.trim()) return;
    const result =
      PNR_STATUSES[Math.floor(Math.random() * PNR_STATUSES.length)];
    setPnrResult(result);
    setShowPnrModal(true);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-blue-700 dark:from-primary/70 dark:via-slate-900 dark:to-blue-950">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/assets/images/train-hero.jpg')",
            backgroundSize: "cover",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 text-white/90 text-sm font-medium">
              <Train className="w-4 h-4" /> India's Fastest Train Booking
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
              Book Train Tickets
            </h1>
            <p className="text-white/80 text-lg">
              Search 13,000+ trains across India
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-wrap gap-4 items-end">
              <StationInput
                label="From"
                value={from}
                onChange={setFrom}
                placeholder="Enter origin city"
              />
              <button
                type="button"
                onClick={swap}
                className="mb-0.5 p-2 rounded-full hover:bg-primary/10 transition-colors self-end"
                aria-label="Swap stations"
              >
                <ArrowRight className="w-5 h-5 text-primary rotate-0" />
              </button>
              <StationInput
                label="To"
                value={to}
                onChange={setTo}
                placeholder="Enter destination city"
              />

              {/* Date */}
              <div className="flex-1 min-w-[140px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Date
                </p>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-9 bg-card border-border h-12 cursor-pointer"
                  />
                </div>
              </div>

              {/* Class */}
              <div className="flex-1 min-w-[150px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Class
                </p>
                <Select value={cls} onValueChange={setCls}>
                  <SelectTrigger className="h-12 bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Passengers */}
              <div className="min-w-[120px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Passengers
                </p>
                <div className="flex items-center gap-2 h-12 bg-card border border-border rounded-lg px-3">
                  <Users className="w-4 h-4 text-primary" />
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                    className="font-bold text-primary hover:text-primary/70 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold">
                    {passengers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.min(6, p + 1))}
                    className="font-bold text-primary hover:text-primary/70 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                size="lg"
                className="h-12 px-8 font-semibold gap-2"
              >
                <Search className="w-4 h-4" /> Search Trains
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">
          Popular Routes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_ROUTES.map((route, i) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setFrom(route.from);
                setTo(route.to);
              }}
              className="glass-card rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-all border border-border"
              data-ocid={`train.popular_route.${i + 1}`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <span>{route.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span>{route.to}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {route.name}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {route.duration}
                </div>
                <Badge variant="secondary" className="text-xs">
                  from ₹{route.price}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PNR Status Checker */}
      <section className="bg-muted/40 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">
              PNR Status Checker
            </h2>
            <p className="text-muted-foreground mt-1">
              Enter your 10-digit PNR number to check booking status
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 flex gap-3">
            <Input
              value={pnr}
              onChange={(e) =>
                setPnr(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter 10-digit PNR number"
              className="h-12"
              maxLength={10}
              data-ocid="train.pnr_input"
            />
            <Button
              onClick={handlePnrCheck}
              disabled={pnr.length !== 10}
              size="lg"
              className="h-12 px-6"
              data-ocid="train.pnr_check_button"
            >
              Check Status
            </Button>
          </div>
        </div>
      </section>

      {/* PNR Modal */}
      <AnimatePresence>
        {showPnrModal && pnrResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowPnrModal(false)}
            data-ocid="train.pnr_modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">PNR Status</h3>
                <button
                  type="button"
                  onClick={() => setShowPnrModal(false)}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  data-ocid="train.pnr_modal.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <div className="text-xs text-muted-foreground mb-1">
                  PNR Number
                </div>
                <div className="font-mono font-bold text-foreground text-lg">
                  {pnr}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <span className={`font-semibold text-sm ${pnrResult.color}`}>
                    {pnrResult.status}
                  </span>
                </div>
                {pnrResult.coach !== "—" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Coach
                      </span>
                      <span className="font-semibold text-sm">
                        {pnrResult.coach}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Berth
                      </span>
                      <span className="font-semibold text-sm">
                        {pnrResult.berth}
                      </span>
                    </div>
                  </>
                )}
              </div>
              {pnrResult.status === "Confirmed" && (
                <div className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-medium bg-emerald-500/10 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4" /> Your booking is confirmed!
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
