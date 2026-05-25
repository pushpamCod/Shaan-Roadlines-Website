import { BookingType, PaymentMethod } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateBooking, useProcessPayment } from "@/hooks/useBackend";
import { useCartStore } from "@/store";
import {
  Building,
  ChevronRight,
  CreditCard,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Punjab National Bank"];
const WALLETS = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"];

export default function PaymentPage() {
  const navigate = useNavigate();
  const cart = useCartStore();
  const createBooking = useCreateBooking();
  const processPayment = useProcessPayment();

  const [activeTab, setActiveTab] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [wallet, setWallet] = useState("");
  const [bank, setBank] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;
  };

  const modeToBookingType = (): BookingType => {
    const m = (cart.travelMode || "bus").toLowerCase();
    if (m === "train") return BookingType.Train;
    if (m === "flight") return BookingType.Flight;
    if (m === "hotel") return BookingType.Hotel;
    return BookingType.Bus;
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const bookingResult = await createBooking.mutateAsync({
        bookingType: modeToBookingType(),
        fromLocation: cart.fromLocation || "",
        toLocation: cart.toLocation || "",
        travelDate: cart.travelDate || new Date().toISOString(),
        totalAmount: cart.totalAmount,
        passengerDetails: cart.passengerDetails || [],
        couponCode: cart.couponCode || undefined,
        distanceKm: cart.distanceKm || BigInt(0),
        referenceId: cart.referenceId || BigInt(0),
      });
      await processPayment.mutateAsync({
        bookingId: bookingResult.id,
        amount: cart.totalAmount,
        method: PaymentMethod[activeTab as keyof typeof PaymentMethod],
      });
      navigate("/booking/success");
    } catch {
      navigate("/booking/failure");
    } finally {
      setIsProcessing(false);
    }
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
          <h1 className="text-xl font-bold">Secure Payment</h1>
          <Lock size={16} className="text-teal-500 ml-auto" />
          <span className="text-xs text-teal-500">SSL Secured</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-6">
        {/* Payment Form */}
        <div className="md:col-span-3 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger
                value="Card"
                data-ocid="payment.card_tab"
                className="flex flex-col gap-1 py-2"
              >
                <CreditCard size={16} />
                <span className="text-xs hidden sm:block">Card</span>
              </TabsTrigger>
              <TabsTrigger
                value="UPI"
                data-ocid="payment.upi_tab"
                className="flex flex-col gap-1 py-2"
              >
                <Smartphone size={16} />
                <span className="text-xs hidden sm:block">UPI</span>
              </TabsTrigger>
              <TabsTrigger
                value="Wallet"
                data-ocid="payment.wallet_tab"
                className="flex flex-col gap-1 py-2"
              >
                <Wallet size={16} />
                <span className="text-xs hidden sm:block">Wallet</span>
              </TabsTrigger>
              <TabsTrigger
                value="NetBanking"
                data-ocid="payment.netbanking_tab"
                className="flex flex-col gap-1 py-2"
              >
                <Building size={16} />
                <span className="text-xs hidden sm:block">Net Banking</span>
              </TabsTrigger>
            </TabsList>

            {/* Card Tab */}
            <TabsContent value="Card">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-border">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Card Number
                      </label>
                      <Input
                        data-ocid="payment.card_number_input"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Expiry
                        </label>
                        <Input
                          data-ocid="payment.expiry_input"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          CVV
                        </label>
                        <Input
                          data-ocid="payment.cvv_input"
                          placeholder="•••"
                          type="password"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Cardholder Name
                      </label>
                      <Input
                        data-ocid="payment.card_name_input"
                        placeholder="As on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      {["visa", "mastercard", "rupay", "amex"].map((b) => (
                        <Badge
                          key={b}
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* UPI Tab */}
            <TabsContent value="UPI">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-border">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        UPI ID
                      </label>
                      <Input
                        data-ocid="payment.upi_input"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports PhonePe, GPay, Paytm UPI and all BHIM-enabled
                      apps
                    </p>
                    <div className="flex gap-2">
                      {["GPay", "PhonePe", "BHIM"].map((u) => (
                        <Badge key={u} variant="outline" className="text-xs">
                          {u}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="Wallet">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-border">
                  <CardContent className="p-6">
                    <label className="text-sm font-medium mb-3 block">
                      Select Wallet
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {WALLETS.map((w) => (
                        <button
                          key={w}
                          type="button"
                          data-ocid={`payment.wallet_${w.toLowerCase().replace(" ", "_")}`}
                          onClick={() => setWallet(w)}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                            wallet === w
                              ? "border-teal-500 bg-teal-500/10 text-teal-600"
                              : "border-border hover:border-teal-300"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Net Banking Tab */}
            <TabsContent value="NetBanking">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-border">
                  <CardContent className="p-6">
                    <label className="text-sm font-medium mb-3 block">
                      Select Your Bank
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {BANKS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          data-ocid={`payment.bank_${b.toLowerCase().replace(/ /g, "_")}`}
                          onClick={() => setBank(b)}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                            bank === b
                              ? "border-teal-500 bg-teal-500/10 text-teal-600"
                              : "border-border hover:border-teal-300"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          <Button
            data-ocid="payment.pay_button"
            className="w-full h-14 text-lg bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex items-center justify-center gap-2"
            onClick={handlePay}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing Payment...</span>
            ) : (
              <>
                <Lock size={18} />
                Pay ₹{cart.totalAmount.toLocaleString("en-IN")}
                <ChevronRight size={18} />
              </>
            )}
          </Button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border border-border sticky top-24">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {cart.travelMode || "Bus"}
                    </span>
                    <span className="font-medium">
                      {cart.fromLocation} → {cart.toLocation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travelers</span>
                    <span>{cart.passengerDetails?.length || 1}</span>
                  </div>
                  {(cart.discountAmount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        − ₹{(cart.discountAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-teal-500">
                      ₹{cart.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock size={12} />
                  <span>256-bit SSL encrypted & PCI DSS compliant</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
