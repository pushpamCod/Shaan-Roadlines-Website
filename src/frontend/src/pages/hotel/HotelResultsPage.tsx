import type { HotelView } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHotels } from "@/hooks/useBackend";
import {
  Car,
  Coffee,
  Dumbbell,
  Filter,
  SlidersHorizontal,
  Star,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  pool: <span className="text-xs">🏊</span>,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  restaurant: <Coffee className="w-3.5 h-3.5" />,
  spa: <span className="text-xs">🧖</span>,
};

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600",
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= count ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

function HotelCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-9 w-full rounded" />
      </div>
    </div>
  );
}

function HotelCard({ hotel, idx }: { hotel: HotelView; idx: number }) {
  const navigate = useNavigate();
  const img = hotel.images[0] ?? FALLBACK_IMGS[idx % FALLBACK_IMGS.length];
  const ratingNum = Number(hotel.rating);
  const ratingLabel =
    ratingNum >= 4.5
      ? "Exceptional"
      : ratingNum >= 4.0
        ? "Excellent"
        : ratingNum >= 3.5
          ? "Very Good"
          : "Good";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      className="bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col"
      data-ocid={`hotel.results.item.${idx + 1}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={img}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm">
            ⭐ {hotel.rating.toFixed(1)} · {hotel.reviewCount.toString()}{" "}
            reviews
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="gradient-amber text-white border-0 text-xs">
            {hotel.availableRooms.toString()} rooms left
          </Badge>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-foreground text-lg leading-tight">
              {hotel.name}
            </h3>
            <StarRow count={Number(hotel.starRating)} />
          </div>
          <p className="text-sm text-muted-foreground">
            {hotel.city} · {hotel.address}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 5).map((a) => (
            <span
              key={a}
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5"
            >
              {AMENITY_ICONS[a.toLowerCase()] ?? null}
              {a}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground text-xs font-bold rounded-lg px-2 py-1">
            {hotel.rating.toFixed(1)}/5
          </span>
          <span className="text-sm font-semibold text-foreground">
            {ratingLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            ({hotel.reviewCount.toString()} reviews)
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Per night from</p>
            <p className="text-2xl font-display font-bold text-primary">
              ₹{Number(hotel.pricePerNight).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">
              Check-in {hotel.checkInTime} · Out {hotel.checkOutTime}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              data-ocid={`hotel.view_details.${idx + 1}`}
              variant="outline"
              size="sm"
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            >
              View Details
            </Button>
            <Button
              data-ocid={`hotel.book_now.${idx + 1}`}
              size="sm"
              className="gradient-teal text-white border-0"
              onClick={() => navigate(`/hotel/${hotel.id}/rooms`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HotelResultsPage() {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") ?? "";
  const checkIn = searchParams.get("checkIn") ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";
  const guests = Number(searchParams.get("guests") ?? 2);
  const rooms = Number(searchParams.get("rooms") ?? 1);

  const { data: hotels = [], isLoading } = useHotels(
    city,
    checkIn,
    checkOut,
    guests,
    rooms,
  );

  const [stars, setStars] = useState<number[]>([]);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(50000);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const toggleStar = (s: number) =>
    setStars((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  const toggleAmenity = (a: string) =>
    setAmenityFilters((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const filtered = useMemo(() => {
    let list = [...hotels];
    if (stars.length > 0)
      list = list.filter((h) => stars.includes(Number(h.starRating)));
    if (amenityFilters.length > 0)
      list = list.filter((h) =>
        amenityFilters.every((a) =>
          h.amenities.map((x) => x.toLowerCase()).includes(a.toLowerCase()),
        ),
      );
    list = list.filter((h) => Number(h.pricePerNight) <= priceMax);
    if (sortBy === "price")
      list.sort((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
    else if (sortBy === "rating")
      list.sort((a, b) => Number(b.rating) - Number(a.rating));
    else if (sortBy === "stars")
      list.sort((a, b) => Number(b.starRating) - Number(a.starRating));
    return list;
  }, [hotels, stars, amenityFilters, priceMax, sortBy]);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              Hotels in{" "}
              <span className="text-primary">{city || "All Cities"}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {checkIn} → {checkOut} · {guests} guests · {rooms} room
              {rooms !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((s) => !s)}
              className="md:hidden"
              data-ocid="hotel.filter_toggle"
            >
              <Filter className="w-4 h-4 mr-1" /> Filters
            </Button>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <select
                data-ocid="hotel.sort_select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-card border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rating">Sort: Best Rated</option>
                <option value="price">Sort: Price Low to High</option>
                <option value="stars">Sort: Star Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside
          className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-72 flex-shrink-0`}
          data-ocid="hotel.filters_panel"
        >
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-foreground">
                Filters
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStars([]);
                  setAmenityFilters([]);
                  setPriceMax(50000);
                }}
                className="text-xs text-primary"
              >
                Reset
              </Button>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Star Rating
              </h4>
              <div className="space-y-2">
                {[5, 4, 3, 2].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={stars.includes(s)}
                      onChange={() => toggleStar(s)}
                      className="rounded accent-primary"
                      data-ocid={`hotel.filter_star.${s}`}
                    />
                    <div className="flex gap-0.5">
                      {Array.from({ length: s }).map((_, i) => (
                        <Star
                          key={`filter-star-${s}-${i}`}
                          className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {s} Star
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Max Price:{" "}
                <span className="text-primary">
                  ₹{priceMax.toLocaleString("en-IN")}
                </span>
              </h4>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-primary"
                data-ocid="hotel.filter_price_slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹500</span>
                <span>₹50,000</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Amenities
              </h4>
              <div className="space-y-2">
                {["Pool", "Spa", "WiFi", "Gym", "Restaurant", "Parking"].map(
                  (a) => (
                    <label
                      key={a}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={amenityFilters.includes(a)}
                        onChange={() => toggleAmenity(a)}
                        className="rounded accent-primary"
                        data-ocid={`hotel.filter_amenity.${a.toLowerCase()}`}
                      />
                      <span className="text-sm text-muted-foreground">{a}</span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <HotelCardSkeleton key={`hotel-skeleton-${i}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-ocid="hotel.results.empty_state"
            >
              <span className="text-6xl">🏨</span>
              <h3 className="text-xl font-display font-bold text-foreground">
                No hotels found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting filters or search a different city
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-5">
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                hotels found
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((hotel, idx) => (
                  <HotelCard
                    key={hotel.id.toString()}
                    hotel={hotel}
                    idx={idx}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
