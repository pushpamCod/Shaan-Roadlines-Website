import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlights } from "@/hooks/useBackend";
import { useCartStore } from "@/store";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Luggage,
  Plane,
  Tag,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type SeatStatus = "available" | "selected" | "booked";

interface Seat {
  id: string;
  row: number;
  col: string;
  status: SeatStatus;
  isExit: boolean;
}

function buildEconomySeats(selectedSeats: string[]): Seat[] {
  const seats: Seat[] = [];
  const bookedSet = new Set([
    "3A",
    "3B",
    "7C",
    "7D",
    "12F",
    "15A",
    "15B",
    "20E",
    "22C",
    "25F",
  ]);
  for (let row = 1; row <= 30; row++) {
    for (const col of ["A", "B", "C", "D", "E", "F"]) {
      const id = `${row}${col}`;
      let status: SeatStatus = "available";
      if (bookedSet.has(id)) status = "booked";
      if (selectedSeats.includes(id)) status = "selected";
      seats.push({ id, row, col, status, isExit: row === 10 || row === 20 });
    }
  }
  return seats;
}

function buildBusinessSeats(selectedSeats: string[]): Seat[] {
  const seats: Seat[] = [];
  const bookedSet = new Set(["1A", "2C", "3B", "4D"]);
  for (let row = 1; row <= 6; row++) {
    for (const col of ["A", "B", "C", "D"]) {
      const id = `B${row}${col}`;
      let status: SeatStatus = "available";
      if (bookedSet.has(`${row}${col}`)) status = "booked";
      if (selectedSeats.includes(id)) status = "selected";
      seats.push({ id, row, col, status, isExit: false });
    }
  }
  return seats;
}

interface SeatButtonProps {
  seat: Seat;
  onToggle: (id: string) => void;
}

function SeatButton({ seat, onToggle }: SeatButtonProps) {
  const colorMap: Record<SeatStatus, string> = {
    available:
      "bg-teal-500/20 border-teal-500/50 text-teal-600 dark:text-teal-400 hover:bg-teal-500/40 cursor-pointer",
    selected:
      "bg-amber-500/30 border-amber-500 text-amber-600 dark:text-amber-400 cursor-pointer ring-1 ring-amber-500",
    booked:
      "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50",
  };

  return (
    <button
      type="button"
      disabled={seat.status === "booked"}
      onClick={() => onToggle(seat.id)}
      data-ocid={`flight.seat.${seat.id}`}
      className={`w-9 h-9 rounded-lg border text-xs font-bold transition-smooth ${
        colorMap[seat.status]
      }`}
      title={seat.status === "booked" ? "Seat unavailable" : `Seat ${seat.id}`}
    >
      {seat.id.replace(/^B/, "")}
    </button>
  );
}

interface PassengerForm {
  name: string;
  age: string;
  gender: string;
  passport: string;
}

export default function FlightSeatPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSelectedSeats, setPassengerDetails, setBookingContext } =
    useCartStore();

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const cabin = searchParams.get("cabin") ?? "economy";

  const { data: flights = [] } = useFlights();
  const flight = flights.find((f) => f.id.toString() === id);

  const isBusinessCabin =
    cabin === "business" || flight?.cabin?.toLowerCase() === "business";

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [passengerForms, setPassengerForms] = useState<PassengerForm[]>([
    { name: "", age: "", gender: "male", passport: "" },
  ]);

  const seats = useMemo(
    () =>
      isBusinessCabin
        ? buildBusinessSeats(selectedSeatIds)
        : buildEconomySeats(selectedSeatIds),
    [selectedSeatIds, isBusinessCabin],
  );

  function toggleSeat(seatId: string) {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : prev.length < 6
          ? [...prev, seatId]
          : prev,
    );
  }

  function updatePassenger(
    idx: number,
    field: keyof PassengerForm,
    value: string,
  ) {
    setPassengerForms((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    );
  }

  const basePrice = flight ? Number(flight.price) : 4299;
  const taxRate = 0.18;
  const taxes = Math.round(basePrice * taxRate);
  const discount = couponApplied ? Math.round(basePrice * 0.1) : 0;
  const total = basePrice + taxes - discount;

  // Long-haul distance check (e.g., DEL→BLR or DEL→MAA ≈ 1500+ km)
  const isLongHaul = ["DEL-MAA", "DEL-CCU", "BOM-CCU", "BLR-CCU"].some(
    (r) => r === `${flight?.from ?? from}-${flight?.to ?? to}`,
  );
  const isFreeFood = isLongHaul;

  function handleProceed() {
    if (selectedSeatIds.length === 0) return;
    const passengers = passengerForms.map((p) => ({
      name: p.name || "Passenger",
      age: BigInt(Number.parseInt(p.age) || 25),
      gender: p.gender,
      seatNumber: selectedSeatIds[0] ?? "",
    }));
    setSelectedSeats(selectedSeatIds);
    setPassengerDetails(passengers);
    setBookingContext({
      travelMode: "flight",
      referenceId: flight?.id ?? BigInt(0),
      fromLocation: flight?.from ?? from,
      toLocation: flight?.to ?? to,
      travelDate: "",
      totalAmount: BigInt(total),
      distanceKm: isLongHaul ? BigInt(1500) : BigInt(500),
    });
    navigate("/booking/summary");
  }

  const econRows = useMemo(() => {
    if (isBusinessCabin) return [];
    const rows: Seat[][] = [];
    for (let r = 1; r <= 30; r++) {
      rows.push(seats.filter((s) => s.row === r));
    }
    return rows;
  }, [seats, isBusinessCabin]);

  const bizRows = useMemo(() => {
    if (!isBusinessCabin) return [];
    const rows: Seat[][] = [];
    for (let r = 1; r <= 6; r++) {
      rows.push(seats.filter((s) => s.row === r));
    }
    return rows;
  }, [seats, isBusinessCabin]);

  return (
    <main className="min-h-screen bg-background">
      {/* Flight header */}
      <div className="gradient-hero py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">
                  {flight?.airline ?? "Airline"} · {flight?.flightNumber ?? id}
                </p>
                <div className="flex items-center gap-2 text-white font-display font-bold text-xl">
                  <span>{flight?.from ?? from}</span>
                  <ArrowRight className="w-4 h-4 text-accent" />
                  <span>{flight?.to ?? to}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 ml-auto">
              <div className="text-center">
                <p className="text-white/60 text-xs">Departure</p>
                <p className="text-white font-semibold">
                  {flight?.departureTime ?? "--:--"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>{flight?.duration ?? "--"}</span>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs">Arrival</p>
                <p className="text-white font-semibold">
                  {flight?.arrivalTime ?? "--:--"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Seat map + passenger form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free food banner */}
            {isFreeFood && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3"
              >
                <UtensilsCrossed className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    🍽️ Complimentary Meal Included!
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Long-haul flight. Enjoy a free in-flight meal.
                  </p>
                </div>
                <Badge className="ml-auto bg-emerald-500/20 text-emerald-600 border-emerald-500/40">
                  Free Food
                </Badge>
              </motion.div>
            )}

            {/* Seat map */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display font-bold text-foreground mb-1">
                Select Your Seat
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                {isBusinessCabin
                  ? "Business class — 2-2 layout"
                  : "Economy class — 3-3 layout"}
              </p>

              {/* Legend */}
              <div className="flex items-center gap-4 mb-5 text-xs">
                {[
                  {
                    color: "bg-teal-500/20 border border-teal-500/50",
                    label: "Available",
                  },
                  {
                    color: "bg-amber-500/30 border border-amber-500",
                    label: "Selected",
                  },
                  {
                    color: "bg-muted border border-border opacity-50",
                    label: "Booked",
                  },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded ${l.color}`} />
                    <span className="text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Aircraft nose */}
              <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center gap-1">
                  <Plane className="w-8 h-8 text-muted-foreground rotate-[-90deg]" />
                  <p className="text-xs text-muted-foreground">Front</p>
                </div>
              </div>

              {/* Column headers */}
              {isBusinessCabin ? (
                <>
                  <div className="flex justify-center gap-1 mb-3 px-6">
                    <div className="flex gap-1">
                      {["A", "B"].map((c) => (
                        <div
                          key={c}
                          className="w-9 h-6 flex items-center justify-center text-xs text-muted-foreground font-semibold"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                    <div className="w-8" />
                    <div className="flex gap-1">
                      {["C", "D"].map((c) => (
                        <div
                          key={c}
                          className="w-9 h-6 flex items-center justify-center text-xs text-muted-foreground font-semibold"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {bizRows.map((row) => (
                      <div
                        key={row[0]?.row}
                        className="flex items-center justify-center gap-1"
                      >
                        <span className="w-5 text-xs text-muted-foreground text-right mr-1">
                          {row[0]?.row}
                        </span>
                        <div className="flex gap-1">
                          {row
                            .filter((s) => ["A", "B"].includes(s.col))
                            .map((s) => (
                              <SeatButton
                                key={s.id}
                                seat={s}
                                onToggle={toggleSeat}
                              />
                            ))}
                        </div>
                        <div className="w-8" />
                        <div className="flex gap-1">
                          {row
                            .filter((s) => ["C", "D"].includes(s.col))
                            .map((s) => (
                              <SeatButton
                                key={s.id}
                                seat={s}
                                onToggle={toggleSeat}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center gap-1 mb-3">
                    <div className="flex gap-1">
                      {["A", "B", "C"].map((c) => (
                        <div
                          key={c}
                          className="w-9 h-6 flex items-center justify-center text-xs text-muted-foreground font-semibold"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                    <div className="w-8" />
                    <div className="flex gap-1">
                      {["D", "E", "F"].map((c) => (
                        <div
                          key={c}
                          className="w-9 h-6 flex items-center justify-center text-xs text-muted-foreground font-semibold"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-2">
                    {econRows.map((row) => (
                      <div key={row[0]?.row}>
                        {row[0]?.isExit && (
                          <div className="flex items-center gap-2 py-1 text-xs text-amber-500 font-medium">
                            <div className="flex-1 border-t border-dashed border-amber-500/40" />
                            <span>EXIT</span>
                            <div className="flex-1 border-t border-dashed border-amber-500/40" />
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-5 text-xs text-muted-foreground text-right mr-1">
                            {row[0]?.row}
                          </span>
                          <div className="flex gap-1">
                            {row
                              .filter((s) => ["A", "B", "C"].includes(s.col))
                              .map((s) => (
                                <SeatButton
                                  key={s.id}
                                  seat={s}
                                  onToggle={toggleSeat}
                                />
                              ))}
                          </div>
                          <div className="w-8" />
                          <div className="flex gap-1">
                            {row
                              .filter((s) => ["D", "E", "F"].includes(s.col))
                              .map((s) => (
                                <SeatButton
                                  key={s.id}
                                  seat={s}
                                  onToggle={toggleSeat}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selectedSeatIds.length > 0 && (
                <p className="text-sm text-primary font-medium mt-4">
                  Selected: {selectedSeatIds.join(", ")}
                </p>
              )}
            </div>

            {/* Baggage info */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Luggage className="w-4 h-4 text-primary" /> Baggage Allowance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold font-display text-primary">
                    7 kg
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Cabin Bag
                  </p>
                  <p className="text-muted-foreground text-xs">
                    1 piece allowed
                  </p>
                </div>
                <div className="bg-muted/40 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold font-display text-primary">
                    {isBusinessCabin ? "25" : "15"} kg
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Check-in Bag
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {isBusinessCabin ? "2 pieces" : "1 piece"}
                  </p>
                </div>
              </div>
            </div>

            {/* Passenger details */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Passenger Details
              </h3>
              {passengerForms.map((pax, idx) => (
                <div
                  key={`passenger-form-${idx}`}
                  className="space-y-4 pb-4 border-b border-border last:border-0 last:pb-0 mb-4 last:mb-0"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    Passenger {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input
                        placeholder="As on ID/Passport"
                        value={pax.name}
                        onChange={(e) =>
                          updatePassenger(idx, "name", e.target.value)
                        }
                        data-ocid={`flight.passenger.name.${idx + 1}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Age</Label>
                      <Input
                        type="number"
                        min="1"
                        max="99"
                        placeholder="25"
                        value={pax.age}
                        onChange={(e) =>
                          updatePassenger(idx, "age", e.target.value)
                        }
                        data-ocid={`flight.passenger.age.${idx + 1}`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Gender</Label>
                      <select
                        value={pax.gender}
                        onChange={(e) =>
                          updatePassenger(idx, "gender", e.target.value)
                        }
                        data-ocid={`flight.passenger.gender.${idx + 1}`}
                        className="w-full bg-background text-foreground border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Passport No. (optional)</Label>
                      <Input
                        placeholder="For international flights"
                        value={pax.passport}
                        onChange={(e) =>
                          updatePassenger(idx, "passport", e.target.value)
                        }
                        data-ocid={`flight.passenger.passport.${idx + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Fare sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-4">
              <h3 className="font-display font-bold text-foreground mb-4">
                Fare Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span className="font-semibold">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Taxes & Fees (18%)
                  </span>
                  <span className="font-semibold">
                    ₹{taxes.toLocaleString("en-IN")}
                  </span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Coupon Discount</span>
                    <span>−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {isFreeFood && (
                  <div className="flex justify-between text-emerald-500">
                    <span className="flex items-center gap-1">
                      <UtensilsCrossed className="w-3.5 h-3.5" /> Meal
                    </span>
                    <span>FREE</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-xl text-primary">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-5">
                <Label className="flex items-center gap-1 mb-2">
                  <Tag className="w-3.5 h-3.5" /> Coupon Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    data-ocid="flight.coupon_input"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (coupon.trim()) setCouponApplied(true);
                    }}
                    data-ocid="flight.coupon_apply_button"
                    className="shrink-0"
                  >
                    {couponApplied ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-emerald-500 text-xs mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 10% discount
                    applied!
                  </p>
                )}
              </div>

              {/* Selected seats summary */}
              {selectedSeatIds.length > 0 && (
                <div className="mt-4 p-3 bg-primary/10 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">
                    Selected Seats
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeatIds.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="button"
                className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-smooth"
                onClick={handleProceed}
                disabled={selectedSeatIds.length === 0}
                data-ocid="flight.proceed_button"
              >
                Proceed to Summary
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>

              {selectedSeatIds.length === 0 && (
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Please select at least 1 seat
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
