import type { BusView } from "@/backend";
import { BookingType, BusType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useBuses,
  useCheckMealEligibility,
  useValidateCoupon,
} from "@/hooks/useBackend";
import { useCartStore, useUIStore } from "@/store";
import {
  ArrowRight,
  Bus,
  Check,
  ChevronDown,
  MapPin,
  Tag,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// ─── Seat Map ────────────────────────────────────────────────────────────────

type SeatStatus = "available" | "selected" | "booked";

function getSeatStatus(
  seatId: string,
  busId: number,
  seatIndex: number,
  selectedSeats: string[],
): SeatStatus {
  const isBooked = (seatIndex * 7 + busId) % 3 === 0;
  if (isBooked) return "booked";
  if (selectedSeats.includes(seatId)) return "selected";
  return "available";
}

interface SeatProps {
  id: string;
  seatIndex: number;
  busId: number;
  selectedSeats: string[];
  onToggle: (id: string, status: SeatStatus) => void;
  small?: boolean;
}

function Seat({
  id,
  seatIndex,
  busId,
  selectedSeats,
  onToggle,
  small,
}: SeatProps) {
  const status = getSeatStatus(id, busId, seatIndex, selectedSeats);
  const sizeClass = small ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";

  const colorClass =
    status === "booked"
      ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-60"
      : status === "selected"
        ? "bg-amber-400 border-amber-500 text-white shadow-md cursor-pointer"
        : "bg-teal-50 border-teal-400 text-teal-700 hover:bg-teal-100 cursor-pointer dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50";

  return (
    <button
      type="button"
      disabled={status === "booked"}
      onClick={() => onToggle(id, status)}
      className={`${sizeClass} ${colorClass} rounded-md border font-semibold transition-all flex items-center justify-center`}
      title={`Seat ${id} — ${status}`}
      data-ocid={`bus_seat.seat.${id.toLowerCase()}`}
    >
      {id.replace(/\d/g, "")}
      {id.replace(/\D/g, "")}
    </button>
  );
}

interface SeaterMapProps {
  rows: number;
  busId: number;
  selectedSeats: string[];
  onToggle: (id: string, status: SeatStatus) => void;
}

function SeaterMap({ rows, busId, selectedSeats, onToggle }: SeaterMapProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-6 text-xs text-muted-foreground mb-1">
        <span className="w-8 text-center">Row</span>
        <span className="flex gap-2">
          <span className="w-9">A</span>
          <span className="w-9">B</span>
        </span>
        <span className="w-4 text-center text-muted-foreground/40">|</span>
        <span className="flex gap-2">
          <span className="w-9">C</span>
          <span className="w-9">D</span>
        </span>
      </div>
      {Array.from({ length: rows }, (_, row) => {
        const rowNum = row + 1;
        return (
          <div key={rowNum} className="flex items-center gap-6">
            <span className="w-8 text-xs text-muted-foreground text-center font-medium">
              {rowNum}
            </span>
            <div className="flex gap-2">
              {["A", "B"].map((col, ci) => {
                const id = `${rowNum}${col}`;
                const idx = row * 4 + ci;
                return (
                  <Seat
                    key={id}
                    id={id}
                    seatIndex={idx}
                    busId={busId}
                    selectedSeats={selectedSeats}
                    onToggle={onToggle}
                  />
                );
              })}
            </div>
            <div className="w-4 text-center text-border">|</div>
            <div className="flex gap-2">
              {["C", "D"].map((col, ci) => {
                const id = `${rowNum}${col}`;
                const idx = row * 4 + 2 + ci;
                return (
                  <Seat
                    key={id}
                    id={id}
                    seatIndex={idx}
                    busId={busId}
                    selectedSeats={selectedSeats}
                    onToggle={onToggle}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface SleeperMapProps {
  rows: number;
  busId: number;
  selectedSeats: string[];
  onToggle: (id: string, status: SeatStatus) => void;
}

function SleeperMap({ rows, busId, selectedSeats, onToggle }: SleeperMapProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-2 font-medium">
          Main Section
        </p>
        <div className="flex flex-col gap-2">
          {Array.from({ length: rows }, (_, row) => {
            const rowNum = row + 1;
            return (
              <div key={rowNum}>
                <p className="text-xs text-muted-foreground mb-1">
                  Row {rowNum}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    {["L1", "L2"].map((suffix, ci) => {
                      const id = `${rowNum}${suffix}`;
                      const idx = row * 4 + ci;
                      return (
                        <Seat
                          key={id}
                          id={id}
                          seatIndex={idx}
                          busId={busId}
                          selectedSeats={selectedSeats}
                          onToggle={onToggle}
                          small
                        />
                      );
                    })}
                    <span className="text-xs text-muted-foreground self-center">
                      Lower
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {["U1", "U2"].map((suffix, ci) => {
                      const id = `${rowNum}${suffix}`;
                      const idx = row * 4 + 2 + ci;
                      return (
                        <Seat
                          key={id}
                          id={id}
                          seatIndex={idx}
                          busId={busId}
                          selectedSeats={selectedSeats}
                          onToggle={onToggle}
                          small
                        />
                      );
                    })}
                    <span className="text-xs text-muted-foreground self-center">
                      Upper
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-24">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Side</p>
        <div className="flex flex-col gap-2">
          {Array.from({ length: rows }, (_, row) => {
            const rowNum = row + 1;
            return (
              <div key={rowNum} className="flex flex-col gap-1">
                <Seat
                  id={`${rowNum}SL`}
                  seatIndex={row * 2 + 200}
                  busId={busId}
                  selectedSeats={selectedSeats}
                  onToggle={onToggle}
                  small
                />
                <Seat
                  id={`${rowNum}SU`}
                  seatIndex={row * 2 + 201}
                  busId={busId}
                  selectedSeats={selectedSeats}
                  onToggle={onToggle}
                  small
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BusSeatPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const { data: allBuses, isLoading } = useBuses(
    from || undefined,
    to || undefined,
  );
  const bus: BusView | undefined = allBuses?.find(
    (b) => Number(b.id) === Number(id),
  );

  const { mutateAsync: validateCoupon, isPending: isValidatingCoupon } =
    useValidateCoupon();
  const checkMealMutation = useCheckMealEligibility();
  const mealEligibility = checkMealMutation.data;

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [droppingPoint, setDroppingPoint] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const busId = Number(id);
  const isSleeper = bus
    ? bus.busType === BusType.AC_Sleeper ||
      bus.busType === BusType.NonAC_Sleeper
    : false;

  const handleToggleSeat = (seatId: string, status: SeatStatus) => {
    if (status === "booked") return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= Number(passengers)) {
        addToast({
          type: "error",
          title: "Seat Limit Reached",
          message: `You can only select ${passengers} seat(s) for this booking.`,
        });
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const getBusTypeLabel = (b: BusView) => {
    if (b.busType === BusType.AC_Sleeper) return "AC Sleeper";
    if (b.busType === BusType.AC_Seater) return "AC Seater";
    if (b.busType === BusType.NonAC_Sleeper) return "Non-AC Sleeper";
    return "Non-AC Seater";
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !bus) return;
    const baseAmount = Number(bus.price) * Number(passengers);
    try {
      const result = await validateCoupon({
        code: couponCode,
        amount: BigInt(baseAmount),
        type: BookingType.Bus,
      });
      if (result && result.valid) {
        setDiscount(Number(result.discountAmount));
        setCouponApplied(true);
        addToast({
          type: "success",
          title: "Coupon Applied!",
          message: `You saved ₹${Number(result.discountAmount).toLocaleString()}`,
        });
      } else {
        addToast({
          type: "error",
          title: "Invalid Coupon",
          message: "This coupon is not valid for the current booking.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Coupon Error",
        message: "Could not validate coupon. Please try again.",
      });
    }
  };

  const baseAmount = bus ? Number(bus.price) * Number(passengers) : 0;
  const total = Math.max(0, baseAmount - discount);

  const handleProceed = () => {
    if (!bus || selectedSeats.length === 0) return;

    checkMealMutation.mutate({
      distanceKm: BigInt(600),
      bookingType: BookingType.Bus,
    });
    useCartStore.getState().setBookingContext({
      travelMode: "bus",
      referenceId: BigInt(Number(bus.id)),
      fromLocation: from,
      toLocation: to,
      travelDate: date,
      totalAmount: BigInt(total),
      passengerDetails: selectedSeats.map((s, i) => ({
        name: `Passenger ${i + 1}`,
        age: BigInt(25),
        seatNumber: s,
      })),
      couponCode,
      selectedSeats,
    });
    navigate("/booking/summary");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading seat map...</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="bus_seat.error_state"
      >
        <div className="text-center">
          <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Bus not found
          </h2>
          <Button
            type="button"
            onClick={() => navigate("/bus")}
            className="rounded-xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const typeLabel = getBusTypeLabel(bus);

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border/60 shadow-subtle sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="hover:text-foreground transition-colors"
            >
              ← Back to results
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">
                {bus.operatorName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {bus.from}
                <ArrowRight className="w-3 h-3" />
                {bus.to}
                <span>·</span>
                <span>{date}</span>
                <span>·</span>
                <Badge
                  variant="outline"
                  className="text-xs border-teal-400/50 text-teal-400"
                >
                  {typeLabel}
                </Badge>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xl font-bold text-teal-400">
                ₹{Number(bus.price).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Seat Map */}
        <div className="flex-1 min-w-0">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
              <div className="flex-1 h-8 rounded-t-2xl bg-muted/40 flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  Front
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isSleeper ? (
                <SleeperMap
                  rows={5}
                  busId={busId}
                  selectedSeats={selectedSeats}
                  onToggle={handleToggleSeat}
                />
              ) : (
                <SeaterMap
                  rows={10}
                  busId={busId}
                  selectedSeats={selectedSeats}
                  onToggle={handleToggleSeat}
                />
              )}
            </div>

            {/* Legend */}
            <div
              className="flex items-center gap-6 mt-6 pt-4 border-t border-border/30"
              data-ocid="bus_seat.legend"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-teal-50 border border-teal-400 dark:bg-teal-900/30" />
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-400 border border-amber-500" />
                <span className="text-xs text-muted-foreground">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-muted border border-border opacity-60" />
                <span className="text-xs text-muted-foreground">Booked</span>
              </div>
            </div>

            {/* Selection status */}
            <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground">
                Selected:{" "}
                <span className="font-semibold text-foreground">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "None selected"}
                </span>
                <span className="ml-2 text-xs">
                  ({selectedSeats.length}/{passengers} seats)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl p-5 sticky top-24 flex flex-col gap-4"
            data-ocid="bus_seat.summary_panel"
          >
            <h3 className="font-bold text-foreground text-lg">
              Booking Summary
            </h3>

            {/* Trip info */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium text-foreground">
                  {bus.from} → {bus.to}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Departure</span>
                <span className="font-medium text-foreground">
                  {bus.departureTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-medium text-foreground">
                  {selectedSeats.length > 0 ? selectedSeats.join(", ") : "—"}
                </span>
              </div>
            </div>

            {/* Boarding Point */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Boarding Point
              </label>
              <select
                value={boardingPoint}
                onChange={(e) => setBoardingPoint(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-background/50 border border-border/60 focus:border-teal-400 outline-none text-sm text-foreground"
                data-ocid="bus_seat.boarding_select"
              >
                <option value="">Select boarding point</option>
                {bus.boardingPoints.map((bp) => (
                  <option key={bp} value={bp}>
                    {bp}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropping Point */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Dropping Point
              </label>
              <select
                value={droppingPoint}
                onChange={(e) => setDroppingPoint(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-background/50 border border-border/60 focus:border-teal-400 outline-none text-sm text-foreground"
                data-ocid="bus_seat.dropping_select"
              >
                <option value="">Select dropping point</option>
                {bus.droppingPoints.map((dp) => (
                  <option key={dp} value={dp}>
                    {dp}
                  </option>
                ))}
              </select>
            </div>

            {/* Coupon */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Tag className="inline w-3 h-3 mr-1" />
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponApplied) {
                      setCouponApplied(false);
                      setDiscount(0);
                    }
                  }}
                  placeholder="Enter coupon"
                  className="flex-1 px-3 py-2 rounded-xl bg-background/50 border border-border/60 focus:border-teal-400 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  data-ocid="bus_seat.coupon_input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  disabled={
                    isValidatingCoupon || !couponCode.trim() || couponApplied
                  }
                  className="rounded-xl border-teal-400/50 text-teal-400 hover:bg-teal-400/10 text-xs"
                  data-ocid="bus_seat.apply_coupon"
                >
                  {couponApplied ? <Check className="w-3 h-3" /> : "Apply"}
                </Button>
              </div>
              {couponApplied && discount > 0 && (
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Saved ₹{discount.toLocaleString()}
                </p>
              )}
            </div>

            {/* Meal Eligibility */}
            {mealEligibility && (
              <div
                className="p-3 rounded-xl border border-emerald-400/40 bg-emerald-400/5"
                data-ocid="bus_seat.meal_section"
              >
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <Utensils className="w-3.5 h-3.5" />🎉 Free Meal Eligible!
                </p>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background/50 border border-emerald-400/40 focus:border-emerald-400 outline-none text-xs text-foreground"
                  data-ocid="bus_seat.meal_select"
                >
                  <option value="">Choose meal type</option>
                  <option value="Veg">🥗 Veg Meal</option>
                  <option value="NonVeg">🍗 Non-Veg Meal</option>
                  <option value="Snacks">🍿 Snacks</option>
                  <option value="Beverages">☕ Beverages</option>
                </select>
              </div>
            )}

            {/* Price breakdown */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/30 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">
                  ₹{Number(bus.price).toLocaleString()} × {passengers} seat
                  {Number(passengers) > 1 ? "s" : ""}
                </span>
                <span className="text-foreground">
                  ₹{baseAmount.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-1 text-emerald-400">
                  <span>Coupon discount</span>
                  <span>−₹{discount.toLocaleString()}</span>
                </div>
              )}
              {mealEligibility && selectedMealType && (
                <div className="flex justify-between mb-1 text-emerald-400">
                  <span>Free meal</span>
                  <span>₹0</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border/30 font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-teal-400 text-lg">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              type="button"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="w-full bg-teal-500 hover:bg-teal-400 text-white rounded-xl py-3 font-semibold transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid="bus_seat.proceed_button"
            >
              {selectedSeats.length === 0
                ? `Select ${passengers} seat${Number(passengers) > 1 ? "s" : ""} to continue`
                : `Proceed to Pay · ₹${total.toLocaleString()}`}
            </Button>

            {/* Cancellation policy */}
            {bus.cancellationPolicy && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground transition-colors flex items-center gap-1">
                  <ChevronDown className="w-3 h-3" />
                  Cancellation Policy
                </summary>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {bus.cancellationPolicy}
                </p>
              </details>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
