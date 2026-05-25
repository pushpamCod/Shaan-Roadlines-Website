import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHotels, useReviews } from "@/hooks/useBackend";
import {
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  MapPin,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  pool: <span className="text-base">🏊</span>,
  gym: <Dumbbell className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  restaurant: <Coffee className="w-4 h-4" />,
  spa: <span className="text-base">🧖</span>,
  bar: <span className="text-base">🍷</span>,
  ac: <span className="text-base">❄️</span>,
  laundry: <span className="text-base">👕</span>,
  concierge: <span className="text-base">👌</span>,
};

const GALLERY_FALLBACKS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
];

const MOCK_REVIEWS = [
  {
    id: 1,
    userName: "Priya Sharma",
    rating: 5,
    comment:
      "Absolutely stunning property! The rooms were immaculate, staff was incredibly helpful, and the breakfast spread was magnificent.",
    date: "Jan 2026",
  },
  {
    id: 2,
    userName: "Rahul Mehta",
    rating: 4,
    comment:
      "Great location, modern amenities and excellent service. The rooftop pool was the highlight of our stay!",
    date: "Dec 2025",
  },
  {
    id: 3,
    userName: "Anjali Patel",
    rating: 5,
    comment:
      "Perfect for a romantic getaway. Loved the spa facilities and the city views from our suite.",
    date: "Nov 2025",
  },
  {
    id: 4,
    userName: "Vikram Singh",
    rating: 4,
    comment:
      "Business-friendly hotel with fast WiFi, great meeting rooms, and a convenient location near the airport.",
    date: "Oct 2025",
  },
];

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? today);
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") ?? tomorrow,
  );
  const [guests, setGuests] = useState(Number(searchParams.get("guests") ?? 2));
  const [rooms, setRooms] = useState(Number(searchParams.get("rooms") ?? 1));
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const { data: hotels = [], isLoading } = useHotels();
  const hotel = hotels.find((h) => h.id.toString() === id);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    ),
  );
  const totalPrice = hotel ? Number(hotel.pricePerNight) * nights * rooms : 0;

  const images =
    hotel && hotel.images.length > 0 ? hotel.images : GALLERY_FALLBACKS;

  function prevImg() {
    setLightboxIdx((i) =>
      i !== null ? (i === 0 ? images.length - 1 : i - 1) : 0,
    );
  }
  function nextImg() {
    setLightboxIdx((i) =>
      i !== null ? (i === images.length - 1 ? 0 : i + 1) : 0,
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="skeleton h-80 w-full rounded-2xl" />
          <div className="skeleton h-8 w-1/2 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🏨</span>
        <h2 className="text-xl font-display font-bold text-foreground">
          Hotel not found
        </h2>
        <Button onClick={() => navigate("/hotel")} variant="outline">
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back button */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to results
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="lg:flex gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                {images.slice(0, 4).map((img, i) => (
                  <div
                    key={`gallery-img-${i}`}
                    className={`relative overflow-hidden cursor-pointer group ${
                      i === 0 ? "col-span-2 row-span-2 h-72" : "h-[138px]"
                    }`}
                    onClick={() => setLightboxIdx(i)}
                    onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(i)}
                    role="button"
                    tabIndex={0}
                    data-ocid={`hotel.gallery.${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${hotel.name} ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth" />
                    {i === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          +{images.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hotel Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                    {hotel.name}
                  </h1>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: Number(hotel.starRating) }).map(
                        (_, i) => (
                          <Star
                            key={`hotel-star-${i}`}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ),
                      )}
                    </div>
                    <Badge variant="secondary">
                      {hotel.starRating.toString()}-Star Hotel
                    </Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {hotel.address}, {hotel.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="bg-primary text-primary-foreground font-bold text-lg rounded-xl px-3 py-1.5">
                      {hotel.rating.toFixed(1)}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {Number(hotel.rating) >= 4.5
                          ? "Exceptional"
                          : "Excellent"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hotel.reviewCount.toString()} reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-display font-bold text-foreground mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hotel.amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2"
                    >
                      <span className="text-primary">
                        {AMENITY_ICONS[a.toLowerCase()] ?? "✓"}
                      </span>
                      <span className="text-sm text-foreground capitalize">
                        {a}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-card border border-border rounded-2xl p-5 mt-4">
                <h3 className="font-display font-bold text-foreground mb-3">
                  Location
                </h3>
                <div className="bg-muted/40 rounded-xl h-36 flex flex-col items-center justify-center gap-2 border border-dashed border-border">
                  <MapPin className="w-8 h-8 text-primary" />
                  <p className="font-semibold text-foreground text-sm">
                    {hotel.address}
                  </p>
                  <p className="text-xs text-muted-foreground">{hotel.city}</p>
                </div>
                <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
                  <span>
                    ⏰ Check-in:{" "}
                    <strong className="text-foreground">
                      {hotel.checkInTime}
                    </strong>
                  </span>
                  <span>
                    ⏰ Check-out:{" "}
                    <strong className="text-foreground">
                      {hotel.checkOutTime}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-foreground text-xl">
                    Guest Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground font-bold rounded-lg px-2 py-1">
                      {hotel.rating.toFixed(1)}/5
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {hotel.reviewCount.toString()} reviews
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {MOCK_REVIEWS.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card border border-border rounded-2xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {review.userName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map(
                            (_, si) => (
                              <Star
                                key={`review-star-${review.id}-${si}`}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sticky Booking Panel */}
          <aside className="w-full lg:w-80 flex-shrink-0 mt-8 lg:mt-0">
            <div
              className="bg-card border border-border rounded-2xl p-5 sticky top-4 space-y-4"
              data-ocid="hotel.booking_panel"
            >
              <h3 className="font-display font-bold text-foreground text-lg">
                Book This Hotel
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1 block">
                    Check-in
                  </p>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input
                      data-ocid="hotel.booking_checkin"
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1 block">
                    Check-out
                  </p>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input
                      data-ocid="hotel.booking_checkout"
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1 block">
                      Guests
                    </p>
                    <div className="relative">
                      <Users className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary" />
                      <Input
                        data-ocid="hotel.booking_guests"
                        type="number"
                        min={1}
                        max={20}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1 block">
                      Rooms
                    </p>
                    <Input
                      data-ocid="hotel.booking_rooms"
                      type="number"
                      min={1}
                      max={10}
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-muted/40 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ₹{Number(hotel.pricePerNight).toLocaleString("en-IN")} ×{" "}
                    {nights} nights
                  </span>
                  <span className="text-foreground">
                    ₹
                    {(Number(hotel.pricePerNight) * nights).toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
                {rooms > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      × {rooms} rooms
                    </span>
                    <span className="text-foreground">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-foreground border-t border-border pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <Button
                data-ocid="hotel.select_rooms_button"
                className="w-full gradient-teal text-white font-bold py-3 rounded-xl hover:opacity-90 transition-smooth"
                onClick={() => {
                  const params = new URLSearchParams({
                    checkIn,
                    checkOut,
                    guests: guests.toString(),
                    rooms: rooms.toString(),
                  });
                  navigate(`/hotel/${hotel.id}/rooms?${params.toString()}`);
                }}
              >
                Select Rooms
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                ✔️ Free cancellation · No booking fees
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
          data-ocid="hotel.gallery_lightbox"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            type="button"
            className="absolute left-4 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              prevImg();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img
            src={images[lightboxIdx]}
            alt="Hotel gallery"
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              nextImg();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <p className="absolute bottom-4 text-white/60 text-sm">
            {lightboxIdx + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </main>
  );
}
