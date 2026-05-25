import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/store";
import { Check, Download, Gift, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingSuccessPage() {
  const navigate = useNavigate();
  const cart = useCartStore();

  const referenceNumber = Date.now().toString(36).toUpperCase();
  const loyaltyPoints = Math.floor(Number(cart.totalAmount) / 10);
  const isFreeFoodEligible = (cart.distanceKm || 0) >= 300;

  useEffect(() => {
    return () => {
      cart.clearCart();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", damping: 10 }}
            >
              <Check size={48} className="text-green-500" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-muted-foreground">
            Your trip is all set. Have a wonderful journey!
          </p>
        </motion.div>

        {/* Reference Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-green-500/30 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Booking Reference
                </span>
                <Badge className="bg-green-500 text-white font-mono text-sm">
                  {referenceNumber}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {cart.travelMode || "Bus"} Journey
                  </span>
                  <span className="font-medium">
                    {cart.fromLocation} → {cart.toLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Travel Date</span>
                  <span className="font-medium">
                    {cart.travelDate
                      ? new Date(cart.travelDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Confirmed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ₹{cart.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                {cart.selectedSeats && cart.selectedSeats.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium">
                      {cart.selectedSeats.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loyalty Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Star size={24} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold">
                  +{loyaltyPoints} TravelPoints Earned!
                </p>
                <p className="text-xs text-muted-foreground">
                  Redeem on your next booking for discounts
                </p>
              </div>
              <Badge className="bg-amber-500 text-white">
                {loyaltyPoints} pts
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Free Food Badge */}
        {isFreeFoodEligible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border border-teal-500/30 bg-teal-500/5">
              <CardContent className="p-4 flex items-center gap-4">
                <Gift size={24} className="text-teal-500" />
                <div>
                  <p className="font-bold text-teal-600 dark:text-teal-400">
                    Complimentary Meal Included!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your meal coupon has been sent to your email
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            data-ocid="booking-success.download_button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {}}
          >
            <Download size={16} />
            Download Ticket
          </Button>
          <Button
            data-ocid="booking-success.dashboard_button"
            className="bg-teal-500 hover:bg-teal-600 text-white"
            onClick={() => navigate("/dashboard")}
          >
            View My Bookings
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            data-ocid="booking-success.home_button"
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Book Another Trip →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
