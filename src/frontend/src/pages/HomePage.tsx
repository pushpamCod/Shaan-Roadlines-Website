import type { FlightView, HotelView } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlights, useHotels } from "@/hooks/useBackend";
import { useUIStore } from "@/store";
import {
  ArrowRight,
  Bus,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Hotel,
  Mail,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Star,
  Train,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────
type BookingTab = "bus" | "train" | "flight" | "hotel";
type TripType = "one-way" | "round-trip";

// ─── Data ────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    city: "Goa",
    tag: "Beach Paradise",
    from: "₹1,299",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
  },
  {
    city: "Jaipur",
    tag: "Pink City",
    from: "₹899",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80",
  },
  {
    city: "Mumbai",
    tag: "City of Dreams",
    from: "₹749",
    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80",
  },
  {
    city: "Delhi",
    tag: "Capital Vibes",
    from: "₹599",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80",
  },
  {
    city: "Bangalore",
    tag: "Garden City",
    from: "₹849",
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80",
  },
  {
    city: "Manali",
    tag: "Mountain Bliss",
    from: "₹1,499",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];

const OFFERS = [
  {
    code: "FIRST10",
    title: "First Booking Discount",
    desc: "Save 10% on your very first booking on Shaan Roadlines",
    highlight: "10% OFF",
    gradient: "from-blue-600/30 to-cyan-500/20",
    textColor: "text-cyan-400",
  },
  {
    code: "TRAVEL500",
    title: "Bus & Train Special",
    desc: "Flat ₹500 off on all bus and train bookings above ₹2,000",
    highlight: "₹500 OFF",
    gradient: "from-amber-500/30 to-orange-400/20",
    textColor: "text-amber-400",
  },
  {
    code: "PREMIUM20",
    title: "Premium Traveler Deal",
    desc: "20% off on business class flights and premium hotel rooms",
    highlight: "20% OFF",
    gradient: "from-purple-600/30 to-pink-500/20",
    textColor: "text-purple-400",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Shaan Roadlines made our family trip to Goa seamless. The seat selection UI is brilliant and the free food offer was a lovely surprise!",
    avatar: "PS",
  },
  {
    name: "Arjun Mehta",
    location: "Bangalore",
    rating: 5,
    text: "Booked 3 flights in one go for a multi-city trip. The AI assistant helped me find the best deals. Absolutely love this platform!",
    avatar: "AM",
  },
  {
    name: "Kavitha Nair",
    location: "Chennai",
    rating: 4,
    text: "Great hotel selection with real photos and honest ratings. The glassmorphism design is stunning — feels like a luxury travel app.",
    avatar: "KN",
  },
];

const FAQS = [
  {
    q: "How do I book a bus ticket on Shaan Roadlines?",
    a: "Click on the Bus tab, enter your origin and destination cities, pick your travel date and passenger count, then hit Search. Choose from available buses and select your preferred seats interactively.",
  },
  {
    q: "Can I cancel my booking and get a refund?",
    a: "Yes. Go to your Dashboard → My Bookings, find the booking you want to cancel, and click Cancel. Refund policies vary by operator — most bus and train bookings support cancellations up to 2 hours before departure.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets. All transactions are secured with 256-bit SSL encryption.",
  },
  {
    q: "How does the free food service work?",
    a: "First-time users automatically receive a complimentary meal on any booking. Long-distance travelers (500+ km) are eligible for a free meal or snack pack. Look for the 🍽️ Free Food Included badge during checkout.",
  },
  {
    q: "Is there an AI travel assistant?",
    a: "Yes! Click the chat icon in the bottom-right corner to open the AI travel assistant. It can help you plan trips, find deals, answer booking questions, and give personalised recommendations.",
  },
  {
    q: "How do I earn and redeem loyalty points?",
    a: "You earn 1 point per ₹10 spent. Points can be redeemed for discounts on future bookings. Check your loyalty balance anytime in your Dashboard.",
  },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: HotelView }) {
  const navigate = useNavigate();
  const imgs = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
  ];
  const imgIdx = Number(hotel.id) % imgs.length;
  const rating = Number(hotel.rating) / 10;
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm cursor-pointer group"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
      data-ocid={`hotel.card.${Number(hotel.id)}`}
    >
      <div className="relative overflow-hidden h-44">
        <img
          src={imgs[imgIdx]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-amber-500/90 text-white text-xs font-bold border-0">
            ★ {rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-display font-semibold text-foreground truncate">
          {hotel.name}
        </h4>
        <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" />
          {hotel.city}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-display font-bold text-primary text-lg">
            ₹{Number(hotel.pricePerNight).toLocaleString()}
            <span className="text-xs text-muted-foreground font-normal">
              /night
            </span>
          </span>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7"
            data-ocid={`hotel.book_button.${Number(hotel.id)}`}
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function FlightCard({ flight }: { flight: FlightView }) {
  const navigate = useNavigate();
  const airlines = [
    { logo: "✈️", color: "bg-blue-500/10 border-blue-500/20" },
    { logo: "🛫", color: "bg-teal-500/10 border-teal-500/20" },
    { logo: "✈️", color: "bg-purple-500/10 border-purple-500/20" },
    { logo: "🛩️", color: "bg-orange-500/10 border-orange-500/20" },
  ];
  const style = airlines[Number(flight.id) % airlines.length];
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer group"
      onClick={() =>
        navigate(`/flight/results?from=${flight.from}&to=${flight.to}`)
      }
      data-ocid={`flight.card.${Number(flight.id)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`px-3 py-1.5 rounded-xl border text-sm font-semibold ${style.color}`}
        >
          {flight.airline}
        </div>
        <Badge variant="secondary" className="text-xs">
          {flight.cabin}
        </Badge>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <p className="font-display font-bold text-xl text-foreground">
            {flight.departureTime.slice(0, 5)}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {flight.from}
          </p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px bg-border" />
            <Plane className="w-4 h-4 text-primary rotate-0" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {flight.duration}
          </span>
        </div>
        <div className="text-center">
          <p className="font-display font-bold text-xl text-foreground">
            {flight.arrivalTime.slice(0, 5)}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {flight.to}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <span className="font-display font-bold text-primary text-xl">
            ₹{Number(flight.price).toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground ml-1">per person</span>
        </div>
        <Button
          size="sm"
          className="text-xs h-8"
          data-ocid={`flight.book_button.${Number(flight.id)}`}
        >
          Book Now <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={false}
      className="border border-border rounded-2xl overflow-hidden"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
        data-ocid={`faq.toggle.${idx + 1}`}
        aria-expanded={open}
      >
        <span className="font-display font-medium text-foreground pr-4">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const addToast = useUIStore((s) => s.addToast);
  const handle = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    addToast({
      type: "success",
      title: "Copied!",
      message: `Coupon code "${code}" copied to clipboard!`,
    });
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-mono font-bold transition-all"
      data-ocid={`offer.copy_button.${code}`}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {code}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);

  // Active booking tab
  const [activeTab, setActiveTab] = useState<BookingTab>("bus");

  // Bus form
  const [busFrom, setBusFrom] = useState("");
  const [busTo, setBusTo] = useState("");
  const [busDate, setBusDate] = useState("");
  const [busPassengers, setBusPassengers] = useState("1");

  // Train form
  const [trainFrom, setTrainFrom] = useState("");
  const [trainTo, setTrainTo] = useState("");
  const [trainDate, setTrainDate] = useState("");
  const [trainClass, setTrainClass] = useState("Sleeper");

  // Flight form
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightCabin, setFlightCabin] = useState("Economy");
  const [flightPassengers, setFlightPassengers] = useState("1");

  // Hotel form
  const [hotelCity, setHotelCity] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelGuests, setHotelGuests] = useState("2");
  const [hotelRooms, setHotelRooms] = useState("1");

  // Newsletter
  const [email, setEmail] = useState("");

  // Fetch data
  const { data: hotels, isLoading: hotelsLoading } = useHotels();
  const { data: flights, isLoading: flightsLoading } = useFlights();

  const today = new Date().toISOString().split("T")[0];

  // Submit handlers
  const handleBusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/bus/results?from=${encodeURIComponent(busFrom)}&to=${encodeURIComponent(busTo)}&date=${busDate}&passengers=${busPassengers}`,
    );
  };
  const handleTrainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/train/results?from=${encodeURIComponent(trainFrom)}&to=${encodeURIComponent(trainTo)}&date=${trainDate}&class=${encodeURIComponent(trainClass)}`,
    );
  };
  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/flight/results?from=${encodeURIComponent(flightFrom)}&to=${encodeURIComponent(flightTo)}&date=${flightDate}&cabin=${encodeURIComponent(flightCabin)}&tripType=${tripType}&passengers=${flightPassengers}`,
    );
  };
  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/hotel/results?city=${encodeURIComponent(hotelCity)}&checkIn=${hotelCheckIn}&checkOut=${hotelCheckOut}&guests=${hotelGuests}&rooms=${hotelRooms}`,
    );
  };
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Subscribed!",
      message: "You're subscribed! Look out for deals in your inbox.",
    });
    setEmail("");
  };

  const tabConfig: { id: BookingTab; label: string; icon: React.ReactNode }[] =
    [
      { id: "bus", label: "Bus", icon: <Bus className="w-4 h-4" /> },
      { id: "train", label: "Train", icon: <Train className="w-4 h-4" /> },
      { id: "flight", label: "Flights", icon: <Plane className="w-4 h-4" /> },
      { id: "hotel", label: "Hotels", icon: <Hotel className="w-4 h-4" /> },
    ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 gradient-hero"
          style={{
            backgroundImage: `url('/assets/generated/hero-travel.dim_1600x800.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background/80" />
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-16 pb-12">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-white/80 text-sm mb-5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              India's Most Loved Travel Platform
            </div>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-4">
              Your Journey <span className="text-gradient">Begins Here</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Search, compare and book buses, trains, flights, and hotels across
              India — all in one place.
            </p>
          </motion.div>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="glass-card rounded-3xl p-6 shadow-2xl"
            data-ocid="hero.search_panel"
          >
            {/* Tabs */}
            <div
              className="flex gap-2 mb-6 overflow-x-auto pb-1"
              role="tablist"
            >
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`hero.tab.${tab.id}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Bus Form */}
            {activeTab === "bus" && (
              <form
                onSubmit={handleBusSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                data-ocid="bus.search_form"
              >
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="From City"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={busFrom}
                    onChange={(e) => setBusFrom(e.target.value)}
                    required
                    data-ocid="bus.from_input"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="To City"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={busTo}
                    onChange={(e) => setBusTo(e.target.value)}
                    required
                    data-ocid="bus.to_input"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    min={today}
                    className="pl-9 bg-white/10 border-white/20 text-white"
                    value={busDate}
                    onChange={(e) => setBusDate(e.target.value)}
                    required
                    data-ocid="bus.date_input"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Passengers"
                      type="number"
                      min="1"
                      max="10"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={busPassengers}
                      onChange={(e) => setBusPassengers(e.target.value)}
                      data-ocid="bus.passengers_input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="gradient-amber text-white font-bold px-5 flex-shrink-0 border-0 shadow-lg"
                    data-ocid="bus.search_button"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Train Form */}
            {activeTab === "train" && (
              <form
                onSubmit={handleTrainSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                data-ocid="train.search_form"
              >
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="From Station"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={trainFrom}
                    onChange={(e) => setTrainFrom(e.target.value)}
                    required
                    data-ocid="train.from_input"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="To Station"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={trainTo}
                    onChange={(e) => setTrainTo(e.target.value)}
                    required
                    data-ocid="train.to_input"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    min={today}
                    className="pl-9 bg-white/10 border-white/20 text-white"
                    value={trainDate}
                    onChange={(e) => setTrainDate(e.target.value)}
                    required
                    data-ocid="train.date_input"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-xl px-3 bg-white/10 border border-white/20 text-white text-sm"
                    value={trainClass}
                    onChange={(e) => setTrainClass(e.target.value)}
                    data-ocid="train.class_select"
                  >
                    {["Sleeper", "3AC", "2AC", "1AC", "CC"].map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="text-foreground bg-card"
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="submit"
                    className="gradient-amber text-white font-bold px-5 flex-shrink-0 border-0 shadow-lg"
                    data-ocid="train.search_button"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Flight Form */}
            {activeTab === "flight" && (
              <form
                onSubmit={handleFlightSearch}
                className="space-y-3"
                data-ocid="flight.search_form"
              >
                <div className="flex gap-3 mb-1">
                  {(["one-way", "round-trip"] as TripType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        tripType === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setTripType(t)}
                      data-ocid={`flight.trip_type.${t}`}
                    >
                      {t === "one-way" ? "One Way" : "Round Trip"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="From Airport"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={flightFrom}
                      onChange={(e) => setFlightFrom(e.target.value)}
                      required
                      data-ocid="flight.from_input"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="To Airport"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={flightTo}
                      onChange={(e) => setFlightTo(e.target.value)}
                      required
                      data-ocid="flight.to_input"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="date"
                      min={today}
                      className="pl-9 bg-white/10 border-white/20 text-white"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      required
                      data-ocid="flight.date_input"
                    />
                  </div>
                  <select
                    className="rounded-xl px-3 bg-white/10 border border-white/20 text-white text-sm"
                    value={flightCabin}
                    onChange={(e) => setFlightCabin(e.target.value)}
                    data-ocid="flight.cabin_select"
                  >
                    {["Economy", "Business", "First"].map((c) => (
                      <option
                        key={c}
                        value={c}
                        className="text-foreground bg-card"
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Pax"
                        type="number"
                        min="1"
                        max="9"
                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        value={flightPassengers}
                        onChange={(e) => setFlightPassengers(e.target.value)}
                        data-ocid="flight.passengers_input"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="gradient-amber text-white font-bold px-5 border-0 shadow-lg"
                      data-ocid="flight.search_button"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Hotel Form */}
            {activeTab === "hotel" && (
              <form
                onSubmit={handleHotelSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
                data-ocid="hotel.search_form"
              >
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="City or Destination"
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    value={hotelCity}
                    onChange={(e) => setHotelCity(e.target.value)}
                    required
                    data-ocid="hotel.city_input"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    min={today}
                    placeholder="Check-in"
                    className="pl-9 bg-white/10 border-white/20 text-white"
                    value={hotelCheckIn}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    required
                    data-ocid="hotel.checkin_input"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    min={hotelCheckIn || today}
                    placeholder="Check-out"
                    className="pl-9 bg-white/10 border-white/20 text-white"
                    value={hotelCheckOut}
                    onChange={(e) => setHotelCheckOut(e.target.value)}
                    required
                    data-ocid="hotel.checkout_input"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Guests"
                      type="number"
                      min="1"
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(e.target.value)}
                      data-ocid="hotel.guests_input"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Rooms"
                      type="number"
                      min="1"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      value={hotelRooms}
                      onChange={(e) => setHotelRooms(e.target.value)}
                      data-ocid="hotel.rooms_input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="gradient-amber text-white font-bold border-0 shadow-lg"
                  data-ocid="hotel.search_button"
                >
                  <Search className="w-4 h-4 mr-2" /> Search Hotels
                </Button>
              </form>
            )}
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-8 text-white/60 text-sm"
          >
            {[
              "1M+ Happy Travelers",
              "10K+ Routes",
              "500+ Hotels",
              "24/7 Support",
            ].map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FREE FOOD BANNER ── */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-y border-amber-500/20 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-center"
        >
          <UtensilsCrossed className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="font-display font-semibold text-foreground">
            🎉 Free Meal for First-Time Bookers!
          </span>
          <span className="text-muted-foreground text-sm">
            New users get complimentary veg/non-veg meals on their first
            booking.
          </span>
          <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold">
            🍽️ Free Food Included
          </Badge>
        </motion.div>
      </section>

      {/* ── TRENDING DESTINATIONS ── */}
      <section
        className="py-20 px-4 bg-background"
        data-ocid="destinations.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" /> Trending Now
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3">
              Trending Destinations
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore popular places loved by thousands of travelers
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.05, y: -6 }}
                className="cursor-pointer group rounded-2xl overflow-hidden relative shadow-md"
                onClick={() =>
                  navigate(
                    `/bus/results?from=&to=${encodeURIComponent(dest.city)}&date=`,
                  )
                }
                data-ocid={`destinations.item.${i + 1}`}
              >
                <div className="h-40 sm:h-48 relative overflow-hidden">
                  <img
                    src={dest.img}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-display font-bold text-white text-sm">
                      {dest.city}
                    </p>
                    <p className="text-white/70 text-xs">{dest.tag}</p>
                    <p className="text-amber-400 text-xs font-semibold mt-0.5">
                      from {dest.from}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS ── */}
      <section className="py-20 px-4 section-alt" data-ocid="offers.section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3">
              Special Offers
            </h2>
            <p className="text-muted-foreground text-lg">
              Exclusive deals just for you — use these codes at checkout
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {OFFERS.map((offer, i) => (
              <motion.div
                key={offer.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`relative rounded-2xl p-6 border border-white/10 bg-gradient-to-br ${offer.gradient} overflow-hidden`}
                data-ocid={`offer.card.${i + 1}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p
                  className={`font-display font-black text-4xl ${offer.textColor} mb-2`}
                >
                  {offer.highlight}
                </p>
                <h3 className="font-display font-bold text-foreground text-lg mb-1">
                  {offer.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {offer.desc}
                </p>
                <CopyButton code={offer.code} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ── */}
      <section className="py-20 px-4 bg-background" data-ocid="hotels.section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">
                Top Rated Hotels
              </h2>
              <p className="text-muted-foreground text-lg">
                Hand-picked stays with verified reviews
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
              onClick={() => navigate("/hotel")}
              data-ocid="hotels.view_all_link"
            >
              View All Hotels <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          {hotelsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(hotels ?? []).slice(0, 4).map((h) => (
                <HotelCard key={String(h.id)} hotel={h} />
              ))}
            </div>
          )}
          {!hotelsLoading && (!hotels || hotels.length === 0) && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="hotels.empty_state"
            >
              <Hotel className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No hotels available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── POPULAR FLIGHTS ── */}
      <section className="py-20 px-4 section-alt" data-ocid="flights.section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-2">
                Popular Flights
              </h2>
              <p className="text-muted-foreground text-lg">
                Best fares on top routes across India
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
              onClick={() => navigate("/flight")}
              data-ocid="flights.view_all_link"
            >
              View All Flights <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          {flightsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(flights ?? []).slice(0, 4).map((f) => (
                <FlightCard key={String(f.id)} flight={f} />
              ))}
            </div>
          )}
          {!flightsLoading && (!flights || flights.length === 0) && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="flights.empty_state"
            >
              <Plane className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No flights available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        className="py-20 px-4 bg-background"
        data-ocid="testimonials.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3">
              What Travelers Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Real experiences from real explorers
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-2xl p-6"
                data-ocid={`testimonial.card.${i + 1}`}
              >
                <StarRating rating={t.rating} />
                <p className="text-foreground/90 mt-4 mb-6 leading-relaxed italic text-sm">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 section-alt" data-ocid="faq.section">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about Shaan Roadlines
            </p>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        className="py-20 px-4 gradient-hero"
        data-ocid="newsletter.section"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Get Exclusive Travel Deals
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Subscribe to our newsletter and be the first to know about flash
              sales, seasonal offers, and travel tips.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-3 max-w-md mx-auto"
              data-ocid="newsletter.form"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
                data-ocid="newsletter.email_input"
              />
              <Button
                type="submit"
                className="gradient-amber text-white font-bold border-0 shadow-xl flex-shrink-0"
                data-ocid="newsletter.submit_button"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
