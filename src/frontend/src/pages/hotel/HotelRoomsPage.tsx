import { RoomType } from "@/backend";
import type { RoomView } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHotels, useRoomsByHotel } from "@/hooks/useBackend";
import { useCartStore } from "@/store";
import {
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  Coffee,
  Dumbbell,
  Gift,
  Tag,
  Users,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ROOM_IMGS: Record<string, string> = {
  suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600",
  deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
  standard:
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600",
  premium: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600",
  default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  pool: <span className="text-xs">🏊</span>,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
  restaurant: <Coffee className="w-3.5 h-3.5" />,
  spa: <span className="text-xs">🧖</span>,
  tv: <span className="text-xs">📺</span>,
  minibar: <span className="text-xs">🫖</span>,
  balcony: <span className="text-xs">🌄</span>,
  ac: <span className="text-xs">❄️</span>,
};

const MOCK_ROOMS: RoomView[] = [
  {
    id: BigInt(1),
    hotelId: BigInt(1),
    roomType: RoomType.Suite,
    name: "Presidential Suite",
    description:
      "Luxurious suite with panoramic city views, private butler service, and a dedicated living area.",
    capacity: BigInt(4),
    price: BigInt(12500),
    amenities: ["WiFi", "Minibar", "Balcony", "Spa", "AC"],
    available: true,
  },
  {
    id: BigInt(2),
    hotelId: BigInt(1),
    roomType: RoomType.Deluxe,
    name: "Deluxe King Room",
    description:
      "Spacious king-bed room with garden view, premium bedding, and a marble bathroom with rain shower.",
    capacity: BigInt(2),
    price: BigInt(6800),
    amenities: ["WiFi", "TV", "AC", "Minibar"],
    available: true,
  },
  {
    id: BigInt(3),
    hotelId: BigInt(1),
    roomType: RoomType.Single,
    name: "Standard Double Room",
    description:
      "Comfortable double room with all essential amenities, perfect for business and leisure travelers.",
    capacity: BigInt(2),
    price: BigInt(3200),
    amenities: ["WiFi", "TV", "AC"],
    available: true,
  },
  {
    id: BigInt(4),
    hotelId: BigInt(1),
    roomType: RoomType.Double,
    name: "Premium Twin Room",
    description:
      "Elegant twin-bed room ideal for two guests, featuring contemporary decor and a work desk.",
    capacity: BigInt(2),
    price: BigInt(4500),
    amenities: ["WiFi", "TV", "AC", "Balcony"],
    available: false,
  },
];

export default function HotelRoomsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setBookingContext = useCartStore((s) => s.setBookingContext);
  const setSelectedRoom = useCartStore((s) => s.setSelectedRoom);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const checkIn = searchParams.get("checkIn") ?? today;
  const checkOut = searchParams.get("checkOut") ?? tomorrow;
  const guests = Number(searchParams.get("guests") ?? 2);
  const rooms = Number(searchParams.get("rooms") ?? 1);

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    ),
  );

  const { data: hotels = [] } = useHotels();
  const hotel = hotels.find((h) => h.id.toString() === id);
  const hotelId = hotel?.id ?? null;
  const { data: backendRooms = [], isLoading } = useRoomsByHotel(hotelId);
  const roomList = backendRooms.length > 0 ? backendRooms : MOCK_ROOMS;

  const [selectedRoomId, setSelectedRoomId] = useState<bigint | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [vipFoodEligible] = useState(Math.random() > 0.5);

  const selectedRoom = useMemo(
    () => roomList.find((r) => r.id === selectedRoomId) ?? null,
    [roomList, selectedRoomId],
  );

  const basePrice = selectedRoom
    ? Number(selectedRoom.price) * nights * rooms
    : 0;
  const discount = couponApplied ? Math.floor(basePrice * 0.1) : 0;
  const totalPrice = basePrice - discount;

  function getRoomImg(room: RoomView) {
    const key = room.roomType.toLowerCase();
    return ROOM_IMGS[key] ?? ROOM_IMGS.default;
  }

  function handleProceed() {
    if (!selectedRoom || !hotel) return;
    setSelectedRoom(selectedRoom.id);
    setBookingContext({
      travelMode: "hotel",
      referenceId: hotel.id,
      fromLocation: hotel.city,
      toLocation: hotel.city,
      travelDate: checkIn,
      totalAmount: BigInt(totalPrice),
      discountAmount: BigInt(discount),
      couponCode: coupon,
    });
    navigate("/booking/summary");
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-muted-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {hotel?.name ?? "Select Your Room"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {checkIn} → {checkOut} · {nights} night{nights !== 1 ? "s" : ""}{" "}
                · {guests} guests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:flex gap-8">
        {/* Rooms List */}
        <div className="flex-1 min-w-0 space-y-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`room-skeleton-${i}`}
                  className="bg-card border border-border rounded-2xl overflow-hidden flex h-48"
                >
                  <div className="skeleton w-48" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="skeleton h-5 w-1/2 rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-9 w-32 rounded" />
                  </div>
                </div>
              ))
            : roomList.map((room, i) => {
                const isSelected = selectedRoomId === room.id;
                return (
                  <motion.div
                    key={room.id.toString()}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-card border-2 rounded-2xl overflow-hidden transition-smooth ${
                      isSelected ? "border-primary shadow-lg" : "border-border"
                    } ${!room.available ? "opacity-60" : ""}`}
                    data-ocid={`hotel.room.item.${i + 1}`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-52 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={getRoomImg(room)}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        {!room.available && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display font-bold text-foreground text-lg">
                                {room.name}
                              </h3>
                              <Badge
                                variant={
                                  room.available ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {room.roomType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {room.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-display font-bold text-primary">
                              ₹{Number(room.price).toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              per night
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />{" "}
                            {room.capacity.toString()} guests
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.map((a) => (
                              <span
                                key={a}
                                className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5"
                              >
                                {AMENITY_ICONS[a.toLowerCase()] ?? null} {a}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <Badge
                            variant={room.available ? "default" : "secondary"}
                          >
                            {room.available ? "✔ Available" : "Unavailable"}
                          </Badge>
                          <Button
                            data-ocid={`hotel.room.select.${i + 1}`}
                            disabled={!room.available}
                            onClick={() =>
                              setSelectedRoomId(isSelected ? null : room.id)
                            }
                            className={
                              isSelected ? "gradient-teal text-white" : ""
                            }
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />{" "}
                                Selected
                              </>
                            ) : (
                              "Select Room"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {/* Booking Summary Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 mt-6 lg:mt-0">
          <div
            className="bg-card border border-border rounded-2xl p-5 sticky top-4 space-y-5"
            data-ocid="hotel.booking_summary"
          >
            <h3 className="font-display font-bold text-foreground text-lg">
              Booking Summary
            </h3>

            {selectedRoom ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-muted/40 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>{selectedRoom.roomType}</Badge>
                    <p className="font-semibold text-foreground text-sm">
                      {selectedRoom.name}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedRoom.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      Check-in:{" "}
                      <strong className="text-foreground">{checkIn}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      Check-out:{" "}
                      <strong className="text-foreground">{checkOut}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>
                      {guests} guests · {rooms} room{rooms !== 1 ? "s" : ""} ·{" "}
                      {nights} nights
                    </span>
                  </div>
                </div>

                {/* Coupon */}
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase mb-1 block">
                    <Tag className="w-3 h-3 inline mr-1" /> Coupon Code
                  </p>
                  <div className="flex gap-2">
                    <Input
                      data-ocid="hotel.coupon_input"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value.toUpperCase());
                        setCouponApplied(false);
                      }}
                      placeholder="SAVE10"
                      className="uppercase text-sm"
                    />
                    <Button
                      type="button"
                      data-ocid="hotel.apply_coupon_button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        coupon.length >= 4 && setCouponApplied(true)
                      }
                    >
                      Apply
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-green-600 mt-1">
                      ✔ 10% discount applied!
                    </p>
                  )}
                </div>

                {/* Free food */}
                {vipFoodEligible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-accent/10 border border-accent/30 rounded-xl p-3 flex items-start gap-2"
                    data-ocid="hotel.free_food_banner"
                  >
                    <Gift className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Free Meal Included! 🍽️
                      </p>
                      <p className="text-xs text-muted-foreground">
                        As a VIP guest, enjoy complimentary breakfast daily.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Price Breakdown */}
                <div className="bg-muted/40 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{Number(selectedRoom.price).toLocaleString("en-IN")} ×{" "}
                      {nights} nights
                    </span>
                    <span className="text-foreground">
                      ₹
                      {(Number(selectedRoom.price) * nights).toLocaleString(
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
                        ₹{basePrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
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
                  data-ocid="hotel.proceed_button"
                  className="w-full gradient-teal text-white font-bold py-3 rounded-xl hover:opacity-90 transition-smooth"
                  onClick={handleProceed}
                >
                  Proceed to Booking
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  ✔️ Free cancellation · Instant confirmation
                </p>
              </motion.div>
            ) : (
              <div
                className="flex flex-col items-center gap-3 py-8 text-center"
                data-ocid="hotel.no_room_selected"
              >
                <span className="text-4xl">🏗️</span>
                <p className="text-sm text-muted-foreground">
                  Select a room to see the pricing summary
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
