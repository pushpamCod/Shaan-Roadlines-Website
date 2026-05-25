import type {
  BookingStatus,
  BookingType,
  BookingView,
  BusType,
  BusView,
  CabinClass,
  CouponApplicableFor,
  CouponView,
  DashboardStats,
  DiscountType,
  FlightView,
  HotelView,
  LoyaltyTransaction,
  LoyaltyTransactionType,
  MealCampaignView,
  MealEligibilityResult,
  MealType,
  NotificationType,
  NotificationView,
  PassengerDetail,
  PaymentMethod,
  PaymentStatus,
  PaymentTransactionStatus,
  PaymentView,
  RevenuePeriod,
  RevenueStats,
  ReviewView,
  RoomType,
  RoomView,
  RouteStop,
  SpecialFeatures,
  TrainClass,
  TrainView,
  UserRole,
  UserView,
  ValidateCouponResult,
} from "@/backend";

export type {
  BookingView,
  BusView,
  FlightView,
  HotelView,
  TrainView,
  UserView,
  NotificationView,
  LoyaltyTransaction,
  DashboardStats,
  MealEligibilityResult,
  MealCampaignView,
  CouponView,
  ReviewView,
  RoomView,
  PaymentView,
  PassengerDetail,
  SpecialFeatures,
  BookingType,
  BookingStatus,
  BusType,
  CabinClass,
  PaymentMethod,
  PaymentStatus,
  UserRole,
  MealType,
  NotificationType,
  RoomType,
  DiscountType,
  CouponApplicableFor,
  LoyaltyTransactionType,
  PaymentTransactionStatus,
  RevenuePeriod,
  RevenueStats,
  ValidateCouponResult,
  TrainClass,
  RouteStop,
};

export type TravelMode = "bus" | "train" | "flight" | "hotel";

export interface SearchParams {
  from?: string;
  to?: string;
  date?: string;
  passengers?: number;
  cabin?: string;
  tripType?: string;
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

export interface SeatInfo {
  seatNumber: string;
  isAvailable: boolean;
  isSelected: boolean;
  seatType: "window" | "aisle" | "middle" | "sleeper" | "upper" | "lower";
}

export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

export interface RecentItem {
  id: string;
  type: TravelMode;
  title: string;
  route?: string;
  price?: bigint;
  viewedAt: number;
}
