import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store";
import {
  Bus,
  Calendar,
  Hotel,
  MapPin,
  Plane,
  Tag,
  Train,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const modeIcons: Record<string, React.ReactNode> = {
  bus: <Bus size={22} className="text-teal-500" />,
  train: <Train size={22} className="text-blue-500" />,
  flight: <Plane size={22} className="text-amber-500" />,
  hotel: <Hotel size={22} className="text-purple-500" />,
};

const modeColors: Record<string, string> = {
  bus: "bg-teal-500/10 border-teal-500/30",
  train: "bg-blue-500/10 border-blue-500/30",
  flight: "bg-amber-500/10 border-amber-500/30",
  hotel: "bg-purple-500/10 border-purple-500/30",
};

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const cart = useCartStore();

  const mode = (cart.travelMode || "bus").toLowerCase();
  const subtotal = cart.totalAmount + (cart.discountAmount || BigInt(0));
  const isFreeFoodEligible =
    Number(cart.distanceKm || BigInt(0)) >= 300 ||
    cart.totalAmount === BigInt(0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not selected";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Booking Summary</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Travel Mode Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`border ${modeColors[mode] || modeColors.bus}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {modeIcons[mode]}
                <span className="font-bold text-lg capitalize">
                  {mode} Booking
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {mode !== "hotel" && (
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="text-muted-foreground mt-1 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Route</p>
                      <p className="font-semibold">
                        {cart.fromLocation || "N/A"} →{" "}
                        {cart.toLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
                {mode === "hotel" && (
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={16}
                      className="text-muted-foreground mt-1 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold">
                        {cart.toLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Calendar
                    size={16}
                    className="text-muted-foreground mt-1 shrink-0"
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">
                      {formatDate(cart.travelDate || "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users
                    size={16}
                    className="text-muted-foreground mt-1 shrink-0"
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">Passengers</p>
                    <p className="font-semibold">
                      {cart.passengerDetails?.length || 1} Traveler(s)
                    </p>
                  </div>
                </div>
                {cart.selectedSeats && cart.selectedSeats.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Tag
                      size={16}
                      className="text-muted-foreground mt-1 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-muted-foreground">Seats</p>
                      <p className="font-semibold">
                        {cart.selectedSeats.join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Free Food Badge */}
        {isFreeFoodEligible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <UtensilsCrossed size={20} className="text-green-500" />
              <div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  🎉 Complimentary Meal Included!
                </p>
                <p className="text-xs text-muted-foreground">
                  You're eligible for a free meal on this trip
                </p>
              </div>
              <Badge className="ml-auto bg-green-500 text-white">FREE</Badge>
            </div>
          </motion.div>
        )}

        {/* Passenger Details */}
        {cart.passengerDetails && cart.passengerDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-bold text-lg mb-3">Traveler Details</h2>
            <div className="space-y-2">
              {cart.passengerDetails.map((p, i) => (
                <Card key={i} className="border border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {p.name || `Passenger ${i + 1}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {p.age ? `Age: ${Number(p.age)}` : ""}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Seat {cart.selectedSeats?.[i] || i + 1}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Price Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bold text-lg mb-3">Price Details</h2>
          <Card className="border border-border">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Fare</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {(cart.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>
                    Discount {cart.couponCode ? `(${cart.couponCode})` : ""}
                  </span>
                  <span>
                    − ₹{(cart.discountAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-teal-500">
                  ₹{cart.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            data-ocid="booking-summary.confirm_button"
            className="w-full h-14 text-lg bg-teal-500 hover:bg-teal-600 text-white rounded-xl"
            onClick={() => navigate("/booking/payment")}
          >
            Confirm & Pay — ₹{cart.totalAmount.toLocaleString("en-IN")}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            🔒 100% Secure Payment · SSL Encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}
