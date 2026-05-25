import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Clock,
  CreditCard,
  Home,
  RefreshCw,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const REASONS = [
  {
    icon: <CreditCard size={18} className="text-red-400" />,
    text: "Insufficient funds or card declined",
  },
  {
    icon: <ShieldAlert size={18} className="text-orange-400" />,
    text: "Transaction flagged by bank security",
  },
  {
    icon: <Clock size={18} className="text-yellow-400" />,
    text: "Payment session timed out",
  },
  {
    icon: <WifiOff size={18} className="text-blue-400" />,
    text: "Network connectivity issue during checkout",
  },
];

const FAQ_ITEMS = [
  {
    q: "Will I be charged if the payment failed?",
    a: "No. Failed transactions are not charged. Any pending amount is fully released back to your account within 5-7 business days depending on your bank.",
  },
  {
    q: "How long until I can retry my payment?",
    a: 'You can retry immediately. Simply click "Try Again" and you will be taken back to the payment page with your booking details intact.',
  },
  {
    q: "Why did my card get declined?",
    a: "Cards can be declined for several reasons — incorrect details, daily limits, international transaction blocks, or bank security filters. Try a different payment method or contact your bank.",
  },
  {
    q: "Can I use a different payment method?",
    a: "Absolutely! We support Credit/Debit Cards, UPI, Wallets (Paytm, PhonePe, Amazon Pay), and Net Banking. Try switching to UPI for the most reliable experience.",
  },
];

export default function BookingFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Failure Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", damping: 10 }}
            >
              <AlertCircle
                size={48}
                className="text-red-500"
                strokeWidth={2.5}
              />
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
          <h1 className="text-3xl font-bold mb-2 text-red-500">
            Payment Failed
          </h1>
          <p className="text-muted-foreground">
            Don't worry — your booking is saved. Try a different payment method.
          </p>
        </motion.div>

        {/* Reasons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-red-500/20 bg-red-500/5">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                Possible Reasons
              </h3>
              <ul className="space-y-3">
                {REASONS.map((r, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    {r.icon}
                    <span>{r.text}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            data-ocid="booking-failure.retry_button"
            className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2"
            onClick={() => navigate("/booking/payment")}
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
          <Button
            data-ocid="booking-failure.home_button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            <Home size={16} />
            Go Home
          </Button>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-bold mb-3">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger
                  data-ocid={`booking-failure.faq_item.${i + 1}`}
                  className="text-left text-sm"
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <button
              type="button"
              data-ocid="booking-failure.support_link"
              className="text-teal-500 hover:underline"
              onClick={() => navigate("/support")}
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
