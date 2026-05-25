import type {
  BookingView,
  LoyaltyTransaction,
  NotificationView,
} from "@/backend";
import { BookingStatus, BookingType } from "@/backend";
import { FoodBadge } from "@/components/common/FoodBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useCancelBooking,
  useLoyaltyBalance,
  useLoyaltyHistory,
  useMarkNotificationRead,
  useMyBookings,
  useNotifications,
  useTransactionHistory,
  useUserProfile,
} from "@/hooks/useBackend";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Bus,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  Eye,
  Gift,
  Hotel,
  Loader2,
  Plane,
  Settings,
  Star,
  Train,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- Types ---
interface SavedTraveler {
  id: string;
  name: string;
  age: string;
  gender: string;
  idType: string;
  idNumber: string;
}

interface WishlistItem {
  id: string;
  type: string;
  name: string;
  route?: string;
  price: string;
}

type TabId =
  | "bookings"
  | "transactions"
  | "travelers"
  | "wishlist"
  | "notifications"
  | "loyalty"
  | "settings";

// --- Helpers ---
const BOOKING_TYPE_ICONS: Record<string, React.ElementType> = {
  Bus: Bus,
  Train: Train,
  Flight: Plane,
  Hotel: Hotel,
};

const BOOKING_TYPE_COLORS: Record<string, string> = {
  Bus: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Train: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Flight:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  Hotel:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
};

const STATUS_STYLES: Record<string, string> = {
  Confirmed:
    "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800",
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Completed:
    "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

function getLoyaltyTier(pts: number): {
  tier: string;
  color: string;
  next: number;
  label: string;
} {
  if (pts >= 10000)
    return {
      tier: "Platinum",
      color: "text-cyan-400",
      next: 10000,
      label: "Max Tier",
    };
  if (pts >= 5000)
    return {
      tier: "Gold",
      color: "text-yellow-500",
      next: 10000,
      label: "to Platinum",
    };
  if (pts >= 2000)
    return {
      tier: "Silver",
      color: "text-slate-400",
      next: 5000,
      label: "to Gold",
    };
  return {
    tier: "Bronze",
    color: "text-amber-600",
    next: 2000,
    label: "to Silver",
  };
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// --- Booking Card ---
function BookingCard({
  booking,
  onCancel,
  isCancelling,
}: {
  booking: BookingView;
  onCancel: (id: bigint) => void;
  isCancelling: boolean;
}) {
  const [showTicket, setShowTicket] = useState(false);
  const typeKey =
    Object.keys(BookingType).find(
      (k) =>
        BookingType[k as keyof typeof BookingType] ===
        booking.bookingType.toString(),
    ) ?? "Bus";
  const Icon = BOOKING_TYPE_ICONS[typeKey] ?? Bus;
  const statusKey =
    Object.keys(BookingStatus).find(
      (k) =>
        BookingStatus[k as keyof typeof BookingStatus] ===
        booking.status.toString(),
    ) ?? "Pending";
  const isConfirmed = statusKey === "Confirmed";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 flex flex-col gap-3 card-hover"
        data-ocid="booking.card"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${BOOKING_TYPE_COLORS[typeKey] ?? "bg-muted text-muted-foreground"}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {booking.fromLocation} → {booking.toLocation}
              </p>
              <p className="text-xs text-muted-foreground">
                {booking.travelDate} · Ref #{booking.id.toString()}
              </p>
            </div>
          </div>
          <Badge
            className={`text-xs font-medium border ${STATUS_STYLES[statusKey] ?? ""}`}
          >
            {statusKey}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            {booking.passengerDetails.length} passenger
            {booking.passengerDetails.length !== 1 ? "s" : ""}
          </span>
          <span className="font-semibold text-foreground">
            ₹{Number(booking.totalAmount).toLocaleString()}
          </span>
          <span>
            Payment:{" "}
            <span className="capitalize">
              {booking.paymentStatus.toString()}
            </span>
          </span>
        </div>

        {booking.specialFeatures?.freeFoodIncluded && (
          <FoodBadge
            mealType={booking.specialFeatures.mealType?.toString()}
            size="sm"
          />
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setShowTicket(true)}
            data-ocid="booking.view_button"
            type="button"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setShowTicket(true)}
            data-ocid="booking.download_button"
            type="button"
          >
            <Download className="w-3.5 h-3.5" /> Download Ticket
          </Button>
          {isConfirmed && (
            <Button
              variant="destructive"
              size="sm"
              className="text-xs gap-1"
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              data-ocid="booking.cancel_button"
              type="button"
            >
              {isCancelling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              Cancel
            </Button>
          )}
        </div>
      </motion.div>

      <Dialog open={showTicket} onOpenChange={setShowTicket}>
        <DialogContent className="max-w-md" data-ocid="booking.ticket_dialog">
          <DialogHeader>
            <DialogTitle>Booking Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg ${BOOKING_TYPE_COLORS[typeKey] ?? ""}`}
              >
                <Icon className="w-4 h-4" />
                {typeKey}
              </div>
              <Badge className={`border ${STATUS_STYLES[statusKey] ?? ""}`}>
                {statusKey}
              </Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">From</p>
                <p className="font-semibold">{booking.fromLocation}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">To</p>
                <p className="font-semibold">{booking.toLocation}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Date</p>
                <p className="font-semibold">{booking.travelDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Amount</p>
                <p className="font-semibold">
                  ₹{Number(booking.totalAmount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Booking ID</p>
                <p className="font-mono text-xs">{booking.id.toString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Passengers</p>
                <p className="font-semibold">
                  {booking.passengerDetails.length}
                </p>
              </div>
            </div>
            {booking.passengerDetails.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Passengers</p>
                <div className="space-y-1">
                  {booking.passengerDetails.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm bg-muted/30 px-3 py-1.5 rounded-lg"
                    >
                      <span>{p.name}</span>
                      <span className="text-muted-foreground">
                        {p.seatNumber
                          ? `Seat ${p.seatNumber}`
                          : `Age ${Number(p.age)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button
              className="w-full gap-2"
              onClick={() => {
                window.print();
              }}
              type="button"
              data-ocid="booking.print_button"
            >
              <Download className="w-4 h-4" /> Print / Save PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Tabs Config ---
const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "bookings", label: "My Bookings", icon: CreditCard },
  { id: "transactions", label: "Transactions", icon: ArrowRight },
  { id: "travelers", label: "Saved Travelers", icon: Users },
  { id: "wishlist", label: "Wishlist", icon: Bookmark },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "loyalty", label: "Loyalty Points", icon: Star },
  { id: "settings", label: "Account Settings", icon: Settings },
];

// --- Main Component ---
export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("bookings");
  const [bookingFilter, setBookingFilter] = useState("All");
  const [copiedCode, setCopiedCode] = useState(false);

  const [travelers, setTravelers] = useState<SavedTraveler[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("savedTravelers") ?? "[]");
    } catch {
      return [];
    }
  });
  const [addingTraveler, setAddingTraveler] = useState(false);
  const [travelerForm, setTravelerForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    idType: "Aadhar",
    idNumber: "",
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") ?? "[]");
    } catch {
      return [];
    }
  });

  const [notifPrefs, setNotifPrefs] = useState({
    bookings: true,
    offers: true,
    system: false,
  });

  const navigate = useNavigate();

  const { data: bookings = [], isLoading: loadingBookings } = useMyBookings();
  const { data: loyaltyBalance = BigInt(0) } = useLoyaltyBalance();
  const { data: notifications = [], isLoading: loadingNotifs } =
    useNotifications();
  const { data: profile } = useUserProfile();
  const { data: transactions = [], isLoading: loadingTx } =
    useTransactionHistory();
  const { data: loyaltyHistory = [] } = useLoyaltyHistory();
  const markRead = useMarkNotificationRead();
  const cancelBooking = useCancelBooking();

  const pts = Number(loyaltyBalance);
  const tier = getLoyaltyTier(pts);
  const unreadCount = notifications.filter(
    (n: NotificationView) => !n.isRead,
  ).length;

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "All") return bookings;
    return bookings.filter(
      (b: BookingView) => b.bookingType.toString() === bookingFilter,
    );
  }, [bookings, bookingFilter]);

  function handleCancelBooking(id: bigint) {
    cancelBooking.mutate(id, {
      onSuccess: () =>
        toast.success("Booking cancelled", {
          description: "Refund will be processed in 5–7 days.",
        }),
      onError: () =>
        toast.error("Cancellation failed", {
          description: "Please try again or contact support.",
        }),
    });
  }

  function handleMarkNotifRead(notif: NotificationView) {
    if (notif.isRead) return;
    markRead.mutate(notif.id);
  }

  function saveTraveler() {
    if (!travelerForm.name || !travelerForm.age) return;
    const newList = [
      ...travelers,
      { ...travelerForm, id: Date.now().toString() },
    ];
    setTravelers(newList);
    localStorage.setItem("savedTravelers", JSON.stringify(newList));
    setTravelerForm({
      name: "",
      age: "",
      gender: "Male",
      idType: "Aadhar",
      idNumber: "",
    });
    setAddingTraveler(false);
    toast.success("Traveler saved!");
  }

  function deleteTraveler(id: string) {
    const newList = travelers.filter((t: SavedTraveler) => t.id !== id);
    setTravelers(newList);
    localStorage.setItem("savedTravelers", JSON.stringify(newList));
    toast.success("Traveler removed");
  }

  function removeWishlistItem(id: string) {
    const newList = wishlistItems.filter((w: WishlistItem) => w.id !== id);
    setWishlistItems(newList);
    localStorage.setItem("wishlist", JSON.stringify(newList));
    toast.success("Removed from wishlist");
  }

  function copyReferralCode() {
    const code = profile?.referralCode ?? "TRAVEL100";
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopiedCode(false), 2000);
    });
  }

  const userName = profile?.name ?? "Traveler";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-10 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-xl font-bold text-primary">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
              Welcome back, {userName}!
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-sm font-semibold ${tier.color}`}>
                {tier.tier} Member
              </span>
              <span className="text-white/50">·</span>
              <span className="text-white/70 text-sm">
                {pts.toLocaleString()} pts
              </span>
              {profile?.totalBookings !== undefined && (
                <>
                  <span className="text-white/50">·</span>
                  <span className="text-white/70 text-sm">
                    {Number(profile.totalBookings)} bookings
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop sidebar */}
          <aside
            className="hidden lg:flex lg:flex-col gap-1 w-56 shrink-0"
            data-ocid="dashboard.sidebar"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`dashboard.tab.${tab.id}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth text-left w-full ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{tab.label}</span>
                  {tab.id === "notifications" && unreadCount > 0 && (
                    <span
                      className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Mobile horizontal tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-ocid={`dashboard.mobile_tab.${tab.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-smooth shrink-0 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.id === "notifications" && unreadCount > 0 && (
                    <span className="bg-destructive text-destructive-foreground w-4 h-4 rounded-full text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* MY BOOKINGS */}
                {activeTab === "bookings" && (
                  <div data-ocid="bookings.section">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-display font-bold">
                        My Bookings
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {bookings.length} total
                      </span>
                    </div>
                    <div
                      className="flex gap-2 mb-5 flex-wrap"
                      data-ocid="bookings.filter"
                    >
                      {["All", "Bus", "Train", "Flight", "Hotel"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setBookingFilter(f)}
                          data-ocid={`bookings.filter.${f.toLowerCase()}`}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-smooth ${
                            bookingFilter === f
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/60 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {loadingBookings ? (
                      <div
                        className="space-y-4"
                        data-ocid="bookings.loading_state"
                      >
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-32 rounded-2xl" />
                        ))}
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div
                        className="text-center py-16"
                        data-ocid="bookings.empty_state"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-lg">No bookings yet</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Start your journey and book your first trip!
                        </p>
                        <Button
                          className="mt-5"
                          onClick={() => navigate("/")}
                          data-ocid="bookings.start_cta"
                          type="button"
                        >
                          Start Booking <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredBookings.map((b: BookingView, idx: number) => (
                          <div
                            key={b.id.toString()}
                            data-ocid={`bookings.item.${idx + 1}`}
                          >
                            <BookingCard
                              booking={b}
                              onCancel={handleCancelBooking}
                              isCancelling={cancelBooking.isPending}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TRANSACTIONS */}
                {activeTab === "transactions" && (
                  <div data-ocid="transactions.section">
                    <h2 className="text-xl font-display font-bold mb-5">
                      Transaction History
                    </h2>
                    {loadingTx ? (
                      <div
                        className="space-y-3"
                        data-ocid="transactions.loading_state"
                      >
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-14 rounded-xl" />
                        ))}
                      </div>
                    ) : transactions.length === 0 ? (
                      <div
                        className="text-center py-16"
                        data-ocid="transactions.empty_state"
                      >
                        <ArrowRight className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold">No transactions yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your payment history will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border/50">
                                {[
                                  "Booking ID",
                                  "Amount",
                                  "Method",
                                  "Status",
                                  "Date",
                                  "Transaction ID",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((tx, idx) => (
                                <tr
                                  key={tx.id.toString()}
                                  data-ocid={`transactions.item.${idx + 1}`}
                                  className="border-b border-border/30 hover:bg-muted/20 transition-smooth"
                                >
                                  <td className="px-4 py-3 font-mono text-xs">
                                    {tx.bookingId.toString()}
                                  </td>
                                  <td className="px-4 py-3 font-semibold">
                                    ₹{Number(tx.amount).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    {tx.method.toString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge
                                      className={`text-xs border-0 ${
                                        tx.status.toString() === "Success"
                                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                          : tx.status.toString() === "Failed"
                                            ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                            : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {tx.status.toString()}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-muted-foreground text-xs">
                                    {formatDate(tx.createdAt)}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[6rem]">
                                    {tx.transactionId || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SAVED TRAVELERS */}
                {activeTab === "travelers" && (
                  <div data-ocid="travelers.section">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-display font-bold">
                        Saved Travelers
                      </h2>
                      <Button
                        size="sm"
                        onClick={() => setAddingTraveler(true)}
                        data-ocid="travelers.add_button"
                        type="button"
                      >
                        + Add Traveler
                      </Button>
                    </div>

                    {addingTraveler && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card rounded-2xl p-5 mb-5"
                        data-ocid="travelers.add_form"
                      >
                        <h3 className="font-semibold mb-4">New Traveler</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 sm:col-span-1">
                            <Label className="text-xs mb-1.5 block">
                              Full Name
                            </Label>
                            <Input
                              placeholder="John Doe"
                              value={travelerForm.name}
                              data-ocid="travelers.name_input"
                              onChange={(e) =>
                                setTravelerForm((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs mb-1.5 block">Age</Label>
                            <Input
                              type="number"
                              placeholder="25"
                              value={travelerForm.age}
                              data-ocid="travelers.age_input"
                              onChange={(e) =>
                                setTravelerForm((p) => ({
                                  ...p,
                                  age: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs mb-1.5 block">
                              Gender
                            </Label>
                            <Select
                              value={travelerForm.gender}
                              onValueChange={(v) =>
                                setTravelerForm((p) => ({ ...p, gender: v }))
                              }
                            >
                              <SelectTrigger data-ocid="travelers.gender_select">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["Male", "Female", "Other"].map((g) => (
                                  <SelectItem key={g} value={g}>
                                    {g}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs mb-1.5 block">
                              ID Type
                            </Label>
                            <Select
                              value={travelerForm.idType}
                              onValueChange={(v) =>
                                setTravelerForm((p) => ({ ...p, idType: v }))
                              }
                            >
                              <SelectTrigger data-ocid="travelers.id_type_select">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Aadhar",
                                  "Passport",
                                  "PAN",
                                  "Driving License",
                                ].map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs mb-1.5 block">
                              ID Number
                            </Label>
                            <Input
                              placeholder="XXXX-XXXX-XXXX"
                              value={travelerForm.idNumber}
                              data-ocid="travelers.id_number_input"
                              onChange={(e) =>
                                setTravelerForm((p) => ({
                                  ...p,
                                  idNumber: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={saveTraveler}
                            data-ocid="travelers.save_button"
                            type="button"
                          >
                            Save Traveler
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAddingTraveler(false)}
                            data-ocid="travelers.cancel_button"
                            type="button"
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {travelers.length === 0 && !addingTraveler ? (
                      <div
                        className="text-center py-16"
                        data-ocid="travelers.empty_state"
                      >
                        <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold">No saved travelers</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add travelers to auto-fill booking forms.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {travelers.map((t: SavedTraveler, idx: number) => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            data-ocid={`travelers.item.${idx + 1}`}
                            className="glass-card rounded-xl px-5 py-4 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-semibold text-sm">{t.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {t.age}y · {t.gender} · {t.idType}: {t.idNumber}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteTraveler(t.id)}
                              data-ocid={`travelers.delete_button.${idx + 1}`}
                              type="button"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* WISHLIST */}
                {activeTab === "wishlist" && (
                  <div data-ocid="wishlist.section">
                    <h2 className="text-xl font-display font-bold mb-5">
                      Wishlist
                    </h2>
                    {wishlistItems.length === 0 ? (
                      <div
                        className="text-center py-16"
                        data-ocid="wishlist.empty_state"
                      >
                        <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold">Your wishlist is empty</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Save hotels & routes for quick access.
                        </p>
                        <Button
                          className="mt-5"
                          variant="outline"
                          onClick={() => navigate("/hotel")}
                          data-ocid="wishlist.browse_cta"
                          type="button"
                        >
                          Browse Hotels
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {wishlistItems.map((w: WishlistItem, idx: number) => (
                          <motion.div
                            key={w.id}
                            data-ocid={`wishlist.item.${idx + 1}`}
                            className="glass-card rounded-xl px-5 py-4 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-semibold text-sm">{w.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {w.type}
                                {w.route ? ` · ${w.route}` : ""} · {w.price}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeWishlistItem(w.id)}
                              data-ocid={`wishlist.remove_button.${idx + 1}`}
                              type="button"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {activeTab === "notifications" && (
                  <div data-ocid="notifications.section">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-display font-bold">
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <Badge variant="destructive">
                          {unreadCount} unread
                        </Badge>
                      )}
                    </div>
                    {loadingNotifs ? (
                      <div
                        className="space-y-3"
                        data-ocid="notifications.loading_state"
                      >
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-16 rounded-xl" />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div
                        className="text-center py-16"
                        data-ocid="notifications.empty_state"
                      >
                        <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="font-semibold">No notifications</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You're all caught up!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map(
                          (n: NotificationView, idx: number) => {
                            const notifType = n.notificationType.toString();
                            return (
                              <motion.button
                                key={n.id.toString()}
                                type="button"
                                onClick={() => handleMarkNotifRead(n)}
                                data-ocid={`notifications.item.${idx + 1}`}
                                className={`w-full text-left px-5 py-4 rounded-xl transition-smooth flex items-start gap-4 ${
                                  n.isRead
                                    ? "bg-muted/20"
                                    : "glass-card border-primary/20"
                                }`}
                              >
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    notifType === "Offer"
                                      ? "bg-amber-100 dark:bg-amber-950/40"
                                      : notifType === "Booking"
                                        ? "bg-blue-100 dark:bg-blue-950/40"
                                        : "bg-muted/50"
                                  }`}
                                >
                                  {notifType === "Offer" ? (
                                    <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  ) : notifType === "Booking" ? (
                                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  ) : (
                                    <Bell className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p
                                      className={`text-sm font-medium ${n.isRead ? "text-muted-foreground" : "text-foreground"}`}
                                    >
                                      {n.title}
                                    </p>
                                    {!n.isRead && (
                                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    {n.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground/60 mt-1">
                                    {formatDate(n.createdAt)}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* LOYALTY */}
                {activeTab === "loyalty" && (
                  <div data-ocid="loyalty.section">
                    <h2 className="text-xl font-display font-bold mb-5">
                      Loyalty Points
                    </h2>

                    <div className="gradient-hero rounded-2xl p-8 mb-6 text-center relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 30% 50%, white 0%, transparent 60%)",
                        }}
                      />
                      <p className="text-white/70 text-sm mb-2">
                        Your Points Balance
                      </p>
                      <p className="text-5xl font-display font-bold text-white mb-1">
                        {pts.toLocaleString()}
                      </p>
                      <p className={`text-lg font-semibold ${tier.color} mb-4`}>
                        {tier.tier} Member
                      </p>
                      {tier.tier !== "Platinum" && (
                        <div className="max-w-xs mx-auto">
                          <div className="flex justify-between text-xs text-white/60 mb-1.5">
                            <span>{pts.toLocaleString()} pts</span>
                            <span>
                              {tier.next.toLocaleString()} pts {tier.label}
                            </span>
                          </div>
                          <Progress
                            value={Math.min((pts / tier.next) * 100, 100)}
                            className="h-2 bg-white/20"
                          />
                        </div>
                      )}
                    </div>

                    <div className="glass-card rounded-2xl p-5 mb-5">
                      <h3 className="font-semibold mb-4">Points History</h3>
                      {loyaltyHistory.length === 0 ? (
                        <div className="space-y-3">
                          {[
                            { desc: "Bus booking Mumbai → Pune", pts: 95 },
                            {
                              desc: "Hotel stay — The Taj Mahal Palace",
                              pts: 120,
                            },
                            { desc: "Flight booking DEL → BOM", pts: 200 },
                            { desc: "Referral bonus — TRAVEL100", pts: 500 },
                          ].map((item, i) => (
                            <div
                              key={i}
                              data-ocid={`loyalty.history_item.${i + 1}`}
                              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                            >
                              <p className="text-sm">{item.desc}</p>
                              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                +{item.pts} pts
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {loyaltyHistory.map(
                            (tx: LoyaltyTransaction, i: number) => (
                              <div
                                key={tx.id.toString()}
                                data-ocid={`loyalty.history_item.${i + 1}`}
                                className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                              >
                                <p className="text-sm">{tx.description}</p>
                                <span
                                  className={`text-sm font-semibold ${
                                    tx.transactionType.toString() === "Earn"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-500"
                                  }`}
                                >
                                  {tx.transactionType.toString() === "Earn"
                                    ? "+"
                                    : "-"}
                                  {Number(tx.points)}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>

                    <div className="glass-card rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Gift className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Refer &amp; Earn</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share your code and earn 500 points per referral. Your
                        friend gets 200 bonus points too!
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted/40 rounded-xl px-4 py-3 font-mono font-bold text-lg tracking-widest text-center">
                          {profile?.referralCode ?? "TRAVEL100"}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={copyReferralCode}
                          data-ocid="loyalty.copy_referral_button"
                          type="button"
                          className="h-12 w-12 rounded-xl"
                        >
                          {copiedCode ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SETTINGS */}
                {activeTab === "settings" && (
                  <div data-ocid="settings.section">
                    <h2 className="text-xl font-display font-bold mb-5">
                      Account Settings
                    </h2>

                    <Link to="/profile" data-ocid="settings.profile_link">
                      <div className="glass-card rounded-2xl px-5 py-4 flex items-center justify-between mb-4 hover:bg-muted/20 transition-smooth cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Edit Profile</p>
                            <p className="text-xs text-muted-foreground">
                              Name, email, phone number
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </Link>

                    <div className="glass-card rounded-2xl p-5 mb-4">
                      <h3 className="font-semibold mb-4">
                        Notification Preferences
                      </h3>
                      <div className="space-y-4">
                        {(
                          [
                            {
                              key: "bookings" as const,
                              label: "Booking Updates",
                              desc: "Confirmations, cancellations, reminders",
                            },
                            {
                              key: "offers" as const,
                              label: "Offers & Deals",
                              desc: "Promotions and exclusive discounts",
                            },
                            {
                              key: "system" as const,
                              label: "System Alerts",
                              desc: "App updates and important notices",
                            },
                          ] as const
                        ).map(({ key, label, desc }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <Label className="text-sm font-medium">
                                {label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {desc}
                              </p>
                            </div>
                            <Switch
                              checked={notifPrefs[key]}
                              onCheckedChange={(v) =>
                                setNotifPrefs((p) => ({ ...p, [key]: v }))
                              }
                              data-ocid={`settings.notif_${key}_switch`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-destructive/20">
                      <h3 className="font-semibold text-destructive mb-4">
                        Danger Zone
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/5"
                          data-ocid="settings.clear_wishlist_button"
                          type="button"
                          onClick={() => {
                            setWishlistItems([]);
                            localStorage.removeItem("wishlist");
                            toast.success("Wishlist cleared");
                          }}
                        >
                          Clear Wishlist
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-destructive/30 text-destructive hover:bg-destructive/5"
                          data-ocid="settings.delete_account_button"
                          type="button"
                          onClick={() =>
                            toast.info(
                              "Contact support to delete your account.",
                              { description: "support@shaanroadlines.in" },
                            )
                          }
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
