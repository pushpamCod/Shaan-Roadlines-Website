import type { PassengerDetail } from "@/backend";
import type { UserView } from "@/types";
import type { RecentItem, ToastItem, TravelMode } from "@/types";
import { create } from "zustand";

// ---- User Store ----
interface UserStore {
  user: UserView | null;
  isAuthenticated: boolean;
  setUser: (user: UserView | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// ---- Cart / Booking Store ----
interface CartStore {
  selectedSeats: string[];
  selectedRoom: bigint | null;
  passengerDetails: PassengerDetail[];
  couponCode: string;
  totalAmount: bigint;
  discountAmount: bigint;
  travelMode: TravelMode | null;
  referenceId: bigint | null;
  fromLocation: string;
  toLocation: string;
  travelDate: string;
  distanceKm: bigint;
  setSelectedSeats: (seats: string[]) => void;
  setSelectedRoom: (roomId: bigint | null) => void;
  setPassengerDetails: (details: PassengerDetail[]) => void;
  setCouponCode: (code: string) => void;
  setTotalAmount: (amount: bigint) => void;
  setDiscountAmount: (amount: bigint) => void;
  setBookingContext: (ctx: Partial<CartStore>) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  selectedSeats: [],
  selectedRoom: null,
  passengerDetails: [],
  couponCode: "",
  totalAmount: BigInt(0),
  discountAmount: BigInt(0),
  travelMode: null,
  referenceId: null,
  fromLocation: "",
  toLocation: "",
  travelDate: "",
  distanceKm: BigInt(0),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setSelectedRoom: (roomId) => set({ selectedRoom: roomId }),
  setPassengerDetails: (details) => set({ passengerDetails: details }),
  setCouponCode: (code) => set({ couponCode: code }),
  setTotalAmount: (amount) => set({ totalAmount: amount }),
  setDiscountAmount: (amount) => set({ discountAmount: amount }),
  setBookingContext: (ctx) => set((state) => ({ ...state, ...ctx })),
  clearCart: () =>
    set({
      selectedSeats: [],
      selectedRoom: null,
      passengerDetails: [],
      couponCode: "",
      totalAmount: BigInt(0),
      discountAmount: BigInt(0),
      travelMode: null,
      referenceId: null,
      fromLocation: "",
      toLocation: "",
      travelDate: "",
      distanceKm: BigInt(0),
    }),
}));

// ---- UI Store ----
interface UIStore {
  isChatOpen: boolean;
  toggleChat: () => void;
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isChatOpen: false,
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
  toasts: [],
  addToast: (toast) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { ...toast, id: Date.now().toString() + Math.random() },
      ].slice(-5),
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// ---- Recently Viewed Store ----
interface RecentlyViewedStore {
  items: RecentItem[];
  addItem: (item: Omit<RecentItem, "viewedAt">) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((s) => ({
      items: [
        { ...item, viewedAt: Date.now() },
        ...s.items.filter((i) => i.id !== item.id),
      ].slice(0, 10),
    })),
  clearItems: () => set({ items: [] }),
}));
