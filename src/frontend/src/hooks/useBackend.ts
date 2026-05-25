import { createActor } from "@/backend";
import type {
  BookingView,
  BusView,
  CouponView,
  DashboardStats,
  FlightView,
  HotelView,
  LoyaltyTransaction,
  MealCampaignView,
  MealEligibilityResult,
  NotificationView,
  PaymentView,
  RevenueStats,
  ReviewView,
  RoomView,
  TrainView,
  UserView,
} from "@/backend";
import { type BookingType, RevenuePeriod } from "@/backend";
import type { CreateBookingInput, ProcessPaymentInput } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor(createActor);
}

// ---- User ----
export function useUserProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserView | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminCheck() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Buses ----
export function useBuses(from?: string, to?: string, date?: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BusView[]>({
    queryKey: ["buses", from, to, date],
    queryFn: async () => {
      if (!actor) return [];
      if (from && to && date) return actor.searchBuses(from, to, date);
      return actor.getBuses();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Trains ----
export function useTrains(
  from?: string,
  to?: string,
  date?: string,
  className?: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<TrainView[]>({
    queryKey: ["trains", from, to, date, className],
    queryFn: async () => {
      if (!actor) return [];
      if (from && to && date)
        return actor.searchTrains(from, to, date, className ?? "");
      return actor.getTrains();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Flights ----
export function useFlights(
  from?: string,
  to?: string,
  date?: string,
  cabin?: string,
  tripType?: string,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FlightView[]>({
    queryKey: ["flights", from, to, date, cabin, tripType],
    queryFn: async () => {
      if (!actor) return [];
      if (from && to && date)
        return actor.searchFlights(
          from,
          to,
          date,
          cabin ?? "",
          tripType ?? "one-way",
        );
      return actor.getFlights();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Hotels ----
export function useHotels(
  city?: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number,
  rooms?: number,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<HotelView[]>({
    queryKey: ["hotels", city, checkIn, checkOut, guests, rooms],
    queryFn: async () => {
      if (!actor) return [];
      if (city && checkIn && checkOut)
        return actor.searchHotels(
          city,
          checkIn,
          checkOut,
          BigInt(guests ?? 1),
          BigInt(rooms ?? 1),
        );
      return actor.getHotels();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Rooms ----
export function useRoomsByHotel(hotelId: bigint | null) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RoomView[]>({
    queryKey: ["rooms", hotelId?.toString()],
    queryFn: async () => {
      if (!actor || !hotelId) return [];
      return actor.getRoomsByHotel(hotelId);
    },
    enabled: !!actor && !isFetching && !!hotelId,
  });
}

// ---- Bookings ----
export function useMyBookings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BookingView[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<BookingView[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTransactionHistory() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PaymentView[]>({
    queryKey: ["transactionHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Loyalty ----
export function useLoyaltyBalance() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<bigint>({
    queryKey: ["loyaltyBalance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getLoyaltyBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLoyaltyHistory() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<LoyaltyTransaction[]>({
    queryKey: ["loyaltyHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLoyaltyHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Notifications ----
export function useNotifications() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<NotificationView[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Admin ----
export function useAdminStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DashboardStats | null>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRevenueStats(period: RevenuePeriod = RevenuePeriod.Month) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<RevenueStats | null>({
    queryKey: ["revenueStats", period],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRevenueStats(period);
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Coupons ----
export function useCoupons() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CouponView[]>({
    queryKey: ["coupons"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCoupons();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Meal Campaigns ----
export function useActiveMealCampaigns() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<MealCampaignView[]>({
    queryKey: ["activeMealCampaigns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveMealCampaigns();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Reviews ----
export function useReviews(referenceId: bigint, bookingType: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ReviewView[]>({
    queryKey: ["reviews", referenceId?.toString(), bookingType],
    queryFn: async () => {
      if (!actor || !referenceId) return [];
      return actor.getReviews(referenceId, bookingType);
    },
    enabled: !!actor && !isFetching && !!referenceId,
  });
}

// ---- OpenAI ----
export function useOpenAIConfigured() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["openAIConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isOpenAIConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---- Mutations ----
export function useCreateBooking() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["loyaltyBalance"] });
    },
  });
}

export function useProcessPayment() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProcessPaymentInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.processPayment(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["transactionHistory"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
}

export function useValidateCoupon() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      code,
      amount,
      type,
    }: {
      code: string;
      amount: bigint;
      type: BookingType;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.validateCoupon(code, amount, type);
    },
  });
}

export function useCheckMealEligibility() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      distanceKm,
      bookingType,
    }: {
      distanceKm: bigint;
      bookingType: BookingType;
    }): Promise<MealEligibilityResult> => {
      if (!actor) throw new Error("Not connected");
      return actor.checkMealEligibility(distanceKm, bookingType);
    },
  });
}

export function useMarkNotificationRead() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markNotificationRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useCallOpenAI() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.callOpenAI(message);
      if (result.__kind__ === "ok") return result.ok;
      throw new Error(result.err);
    },
  });
}

export function useSetOpenAIKey() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.setOpenAIKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openAIConfigured"] });
    },
  });
}

// ---- Admin Bus Mutations ----
export function useAddBus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").AddBusInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBus(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateBus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").UpdateBusInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBus(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
}

export function useDeleteBus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBus(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ---- Admin Train Mutations ----
export function useAddTrain() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").AddTrainInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addTrain(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateTrain() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").UpdateTrainInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTrain(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
  });
}

export function useDeleteTrain() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTrain(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ---- Admin Flight Mutations ----
export function useAddFlight() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").AddFlightInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFlight(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateFlight() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").UpdateFlightInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFlight(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}

export function useDeleteFlight() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFlight(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ---- Admin Hotel Mutations ----
export function useAddHotel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").AddHotelInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addHotel(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateHotel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").UpdateHotelInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateHotel(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}

export function useDeleteHotel() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteHotel(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ---- Admin Coupon Mutations ----
export function useAddCoupon() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").AddCouponInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCoupon(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useUpdateCoupon() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/backend").UpdateCouponInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCoupon(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

export function useDeleteCoupon() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCoupon(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });
}

// ---- Admin Notifications ----
export function useSendNotification() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async ({
      userId,
      title,
      message,
      notifType,
    }: {
      userId: import("@icp-sdk/core/principal").Principal;
      title: string;
      message: string;
      notifType: import("@/backend").NotificationType;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendNotificationToUser(userId, title, message, notifType);
    },
  });
}

// ---- Admin Booking Status ----
export function useUpdateBookingStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: import("@/backend").BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}
