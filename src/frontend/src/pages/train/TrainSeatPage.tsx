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
import { useTrains } from "@/hooks/useBackend";
import { useCartStore, useUIStore } from "@/store";
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Clock,
  Tag,
  Train,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type BerthType = "LB" | "MB" | "UB" | "SL" | "SU";
type Berth = { id: string; label: string; type: BerthType; booked: boolean };

function buildBerthLayout(seed: string): Berth[] {
  const berths: Berth[] = [];
  const rng = (s: string, i: number) =>
    (s.charCodeAt(i % s.length) * 31 + i * 17) % 100 < 40;
  for (let comp = 1; comp <= 3; comp++) {
    const prefix = `C${comp}`;
    const types: { label: string; type: BerthType }[] = [
      { label: "LB", type: "LB" },
      { label: "MB", type: "MB" },
      { label: "UB", type: "UB" },
      { label: "SL", type: "SL" },
      { label: "SU", type: "SU" },
    ];
    for (const { label, type } of types) {
      const id = `${prefix}-${label}`;
      berths.push({
        id,
        label: `${prefix}\n${label}`,
        type,
        booked: rng(seed + id, comp),
      });
    }
  }
  return berths;
}

function buildChairLayout(seed: string): Berth[] {
  const seats: Berth[] = [];
  const rng = (s: string, i: number) =>
    (s.charCodeAt(i % s.length) * 31 + i * 17) % 100 < 40;
  for (let row = 1; row <= 6; row++) {
    for (const col of ["A", "B", "C", "D", "E", "F"]) {
      const id = `R${row}${col}`;
      seats.push({
        id,
        label: `${row}${col}`,
        type: "LB",
        booked: rng(seed + id, row),
      });
    }
  }
  return seats;
}

const BERTH_COLORS: Record<string, string> = {
  available:
    "bg-teal-500/20 border-teal-500/50 text-teal-700 dark:text-teal-300 hover:bg-teal-500/40 cursor-pointer",
  selected:
    "bg-amber-500/30 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-400 cursor-pointer",
  booked:
    "bg-muted/40 border-border text-muted-foreground cursor-not-allowed opacity-50",
};

function BerthGrid({
  berths,
  selected,
  onSelect,
}: {
  berths: Berth[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const compartments: Record<string, Berth[]> = {};
  for (const b of berths) {
    const comp = b.id.split("-")[0];
    if (!compartments[comp]) compartments[comp] = [];
    compartments[comp].push(b);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs flex-wrap mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border bg-teal-500/20 border-teal-500/50 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border bg-amber-500/30 border-amber-500 inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border bg-muted/40 border-border inline-block opacity-50" />
          Booked
        </span>
      </div>
      {Object.entries(compartments).map(([comp, cBerths]) => {
        const left = cBerths.filter((b) => ["LB", "MB", "UB"].includes(b.type));
        const right = cBerths.filter((b) => ["SL", "SU"].includes(b.type));
        return (
          <div
            key={comp}
            className="border border-border rounded-xl p-3 bg-muted/20"
          >
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Compartment {comp.replace("C", "")}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 grid grid-cols-3 gap-2">
                {left.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    disabled={b.booked}
                    onClick={() => !b.booked && onSelect(b.id)}
                    className={`h-12 rounded-lg border text-xs font-mono font-bold transition-all ${
                      b.booked
                        ? BERTH_COLORS.booked
                        : b.id === selected
                          ? BERTH_COLORS.selected
                          : BERTH_COLORS.available
                    }`}
                    data-ocid={`train.berth.${b.id}`}
                  >
                    {b.type}
                  </button>
                ))}
              </div>
              <div className="w-px bg-border mx-1" />
              <div className="grid grid-cols-2 gap-2">
                {right.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    disabled={b.booked}
                    onClick={() => !b.booked && onSelect(b.id)}
                    className={`h-12 w-14 rounded-lg border text-xs font-mono font-bold transition-all ${
                      b.booked
                        ? BERTH_COLORS.booked
                        : b.id === selected
                          ? BERTH_COLORS.selected
                          : BERTH_COLORS.available
                    }`}
                    data-ocid={`train.berth.${b.id}`}
                  >
                    {b.type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChairGrid({
  berths,
  selected,
  onSelect,
}: {
  berths: Berth[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const rows: Record<string, Berth[]> = {};
  for (const b of berths) {
    const row = b.id.slice(1, -1);
    if (!rows[row]) rows[row] = [];
    rows[row].push(b);
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs flex-wrap mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border bg-teal-500/20 border-teal-500/50 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border bg-amber-500/30 border-amber-500 inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border bg-muted/40 border-border inline-block opacity-50" />
          Booked
        </span>
      </div>
      {Object.entries(rows).map(([row, seats]) => (
        <div key={row} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-4 text-right">
            {row}
          </span>
          <div className="flex gap-1.5">
            {seats.slice(0, 3).map((s) => (
              <button
                type="button"
                key={s.id}
                disabled={s.booked}
                onClick={() => !s.booked && onSelect(s.id)}
                className={`w-10 h-10 rounded-lg border text-xs font-mono font-bold transition-all ${
                  s.booked
                    ? BERTH_COLORS.booked
                    : s.id === selected
                      ? BERTH_COLORS.selected
                      : BERTH_COLORS.available
                }`}
                data-ocid={`train.seat.${s.id}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="w-6" />
          <div className="flex gap-1.5">
            {seats.slice(3).map((s) => (
              <button
                type="button"
                key={s.id}
                disabled={s.booked}
                onClick={() => !s.booked && onSelect(s.id)}
                className={`w-10 h-10 rounded-lg border text-xs font-mono font-bold transition-all ${
                  s.booked
                    ? BERTH_COLORS.booked
                    : s.id === selected
                      ? BERTH_COLORS.selected
                      : BERTH_COLORS.available
                }`}
                data-ocid={`train.seat.${s.id}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrainSeatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const paramClass = params.get("class") ?? "Sleeper";
  const passengers = Number(params.get("passengers") ?? 1);

  const [activeClass, setActiveClass] = useState(paramClass);
  const [selectedBerth, setSelectedBerth] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [boardingStation, setBoardingStation] = useState("");
  const [passengers_list, setPassengersList] = useState(
    Array.from({ length: passengers }, () => ({ name: "", age: "" })),
  );

  const {
    setBookingContext,
    setSelectedSeats,
    setPassengerDetails,
    setCouponCode,
  } = useCartStore();
  const addToast = useUIStore((s) => s.addToast);

  const { data: trains, isLoading } = useTrains(
    undefined,
    undefined,
    undefined,
    undefined,
  );
  const train = useMemo(() => {
    if (!trains) return null;
    return trains.find((t) => Number(t.id) === Number(id)) ?? null;
  }, [trains, id]);

  const currentClass =
    train?.classes.find((c) => c.className === activeClass) ??
    train?.classes[0];
  const fare = currentClass ? Number(currentClass.fare) : 0;
  const isChairClass =
    activeClass === "Chair Car" || activeClass === "Executive";

  const berths = useMemo(() => {
    const seed = `${id}-${activeClass}`;
    return isChairClass ? buildChairLayout(seed) : buildBerthLayout(seed);
  }, [id, activeClass, isChairClass]);

  const totalFare = fare * passengers;
  const finalFare = Math.max(0, totalFare - discount);

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "TRAIN10") {
      setDiscount(Math.floor(totalFare * 0.1));
      setCouponApplied(true);
      addToast({
        type: "success",
        title: "Coupon applied",
        message: "10% discount applied!",
      });
    } else {
      addToast({
        type: "error",
        title: "Invalid coupon",
        message: "Coupon code not valid.",
      });
    }
  };

  const handleProceed = () => {
    if (!selectedBerth) {
      addToast({
        type: "error",
        title: "Select berth",
        message: "Please select a berth to continue.",
      });
      return;
    }
    const emptyPassenger = passengers_list.find((p) => !p.name || !p.age);
    if (emptyPassenger) {
      addToast({
        type: "error",
        title: "Passenger details",
        message: "Please fill in all passenger details.",
      });
      return;
    }

    setSelectedSeats([selectedBerth]);
    setPassengerDetails(
      passengers_list.map((p, i) => ({
        name: p.name,
        age: BigInt(Number(p.age)),
        seatNumber: i === 0 ? selectedBerth : `${selectedBerth}-${i + 1}`,
        mealPreference: "",
      })),
    );
    setCouponCode(coupon);
    setBookingContext({
      travelMode: "train",
      referenceId: BigInt(Number(id)),
      fromLocation: train?.from ?? "",
      toLocation: train?.to ?? "",
      travelDate: "",
      totalAmount: BigInt(finalFare),
      distanceKm: BigInt(800),
    });
    addToast({
      type: "success",
      title: "Booking saved",
      message: "Proceeding to booking summary…",
    });
    navigate("/booking/summary");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-lg px-4">
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      </main>
    );
  }

  if (!train) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center" data-ocid="train.seat.error_state">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold">Train not found</h2>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Train Header */}
      <div className="bg-gradient-to-r from-primary/90 to-blue-700 dark:from-slate-900 dark:to-primary/60">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/80 hover:text-white mb-3 text-sm transition-colors"
            data-ocid="train.seat.back_button"
          >
            <ChevronLeft className="w-4 h-4" /> Back to results
          </button>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Badge className="bg-white/20 text-white font-mono border-white/30">
                  {train.trainNumber}
                </Badge>
                <h1 className="text-2xl font-display font-bold text-white">
                  {train.name}
                </h1>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <span className="font-mono text-lg font-bold">
                  {train.departureTime}
                </span>
                <div className="flex items-center gap-2">
                  <span>{train.from}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{train.to}</span>
                </div>
                <span className="font-mono text-lg font-bold">
                  {train.arrivalTime}
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  {train.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Berth Selector */}
        <div className="flex-1 min-w-0">
          {/* Class Tabs */}
          <div className="flex gap-2 flex-wrap mb-5">
            {train.classes.map((cls) => (
              <button
                type="button"
                key={cls.className}
                onClick={() => {
                  setActiveClass(cls.className);
                  setSelectedBerth(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeClass === cls.className
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary/40 text-foreground"
                }`}
                data-ocid={`train.seat.class_tab.${cls.className}`}
              >
                {cls.className} · ₹{Number(cls.fare)}
                <span className="ml-1.5 opacity-70 text-xs">
                  ({Number(cls.available)} avail)
                </span>
              </button>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="font-display font-bold text-lg mb-4">
              {isChairClass ? "Seat" : "Berth"} Selection
              {selectedBerth && (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 text-sm font-normal text-amber-500"
                  >
                    Selected: {selectedBerth}
                  </motion.span>
                </AnimatePresence>
              )}
            </h2>
            {isChairClass ? (
              <ChairGrid
                berths={berths}
                selected={selectedBerth}
                onSelect={setSelectedBerth}
              />
            ) : (
              <BerthGrid
                berths={berths}
                selected={selectedBerth}
                onSelect={setSelectedBerth}
              />
            )}
          </div>
        </div>

        {/* Right: Booking Summary */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="glass-card rounded-2xl p-5 sticky top-20 space-y-5">
            <h3 className="font-display font-bold text-lg">Booking Summary</h3>

            {/* Selected berth */}
            <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
              <Train className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  Selected {isChairClass ? "Seat" : "Berth"}
                </div>
                <div className="font-mono font-bold text-foreground">
                  {selectedBerth ?? "— Not selected —"}
                </div>
              </div>
            </div>

            {/* Boarding station */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Boarding Station
              </p>
              <Select
                value={boardingStation}
                onValueChange={setBoardingStation}
              >
                <SelectTrigger data-ocid="train.seat.boarding_select">
                  <SelectValue placeholder="Select boarding station" />
                </SelectTrigger>
                <SelectContent>
                  {train.route.map((r) => (
                    <SelectItem key={r.station} value={r.station}>
                      {r.station} · {r.departureTime}
                    </SelectItem>
                  ))}
                  {train.route.length === 0 && (
                    <SelectItem value={train.from}>{train.from}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Passenger details */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Passenger Details
              </p>
              {passengers_list.map((p, i) => (
                <div
                  key={`passenger-${i}`}
                  className="space-y-2"
                  data-ocid={`train.seat.passenger.${i + 1}`}
                >
                  <div className="text-xs text-muted-foreground">
                    Passenger {i + 1}
                  </div>
                  <Input
                    placeholder="Full Name"
                    value={p.name}
                    onChange={(e) =>
                      setPassengersList((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, name: e.target.value } : x,
                        ),
                      )
                    }
                    className="h-9 text-sm"
                    data-ocid={`train.seat.passenger_name.${i + 1}`}
                  />
                  <Input
                    placeholder="Age"
                    type="number"
                    min="1"
                    max="120"
                    value={p.age}
                    onChange={(e) =>
                      setPassengersList((prev) =>
                        prev.map((x, j) =>
                          j === i ? { ...x, age: e.target.value } : x,
                        ),
                      )
                    }
                    className="h-9 text-sm"
                    data-ocid={`train.seat.passenger_age.${i + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Coupon Code
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="e.g. TRAIN10"
                    className="pl-8 h-9 text-sm"
                    disabled={couponApplied}
                    data-ocid="train.seat.coupon_input"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={!coupon || couponApplied}
                  data-ocid="train.seat.coupon_apply_button"
                >
                  Apply
                </Button>
              </div>
              {couponApplied && (
                <p className="text-xs text-emerald-500 mt-1">
                  ✓ Coupon applied — ₹{discount} off
                </p>
              )}
            </div>

            {/* Fare breakdown */}
            <div className="bg-muted/30 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  ₹{fare} × {passengers} passenger{passengers > 1 ? "s" : ""}
                </span>
                <span>₹{totalFare}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Coupon discount</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-foreground border-t border-border pt-2">
                <span>Total</span>
                <span className="text-primary text-lg">₹{finalFare}</span>
              </div>
            </div>

            <Button
              className="w-full h-11 font-semibold"
              onClick={handleProceed}
              data-ocid="train.seat.proceed_button"
            >
              Proceed to Booking
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
