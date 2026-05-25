import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserView {
    id: UserId;
    referralCode: string;
    name: string;
    createdAt: Timestamp;
    role: UserRole;
    totalBookings: bigint;
    email: string;
    loyaltyPoints: bigint;
    isFirstTimeUser: boolean;
    phone: string;
}
export interface AddReviewInput {
    referenceId: bigint;
    comment: string;
    bookingType: string;
    rating: bigint;
}
export interface UpdateMealCampaignInput {
    id: MealCampaignId;
    endDate: Timestamp;
    eligibleForFirstTime: boolean;
    name: string;
    eligibleForVIP: boolean;
    isActive: boolean;
    minDistanceKm: bigint;
    startDate: Timestamp;
    mealTypes: Array<string>;
}
export interface UpdateHotelInput {
    id: HotelId;
    availableRooms: bigint;
    starRating: bigint;
    city: string;
    pricePerNight: bigint;
    name: string;
    checkInTime: string;
    amenities: Array<string>;
    address: string;
    rating: number;
    checkOutTime: string;
    reviewCount: bigint;
    totalRooms: bigint;
    images: Array<string>;
}
export interface NotificationView {
    id: NotificationId;
    title: string;
    userId: UserId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    message: string;
}
export interface AddBusInput {
    to: string;
    duration: string;
    droppingPoints: Array<string>;
    busType: BusType;
    boardingPoints: Array<string>;
    arrivalTime: string;
    cancellationPolicy: string;
    departureTime: string;
    from: string;
    name: string;
    operatorName: string;
    amenities: Array<string>;
    totalSeats: bigint;
    price: bigint;
}
export interface ReviewView {
    id: ReviewId;
    userName: string;
    isApproved: boolean;
    userId: UserId;
    createdAt: Timestamp;
    referenceId: bigint;
    comment: string;
    bookingType: string;
    rating: bigint;
}
export interface AddFlightInput {
    to: string;
    duration: string;
    arrivalTime: string;
    flightNumber: string;
    departureTime: string;
    cabin: CabinClass;
    from: string;
    baggage: string;
    stops: bigint;
    availableSeats: bigint;
    airline: string;
    price: bigint;
}
export interface CouponView {
    id: CouponId;
    discountValue: bigint;
    expiresAt: Timestamp;
    maxDiscount: bigint;
    minBookingAmount: bigint;
    code: string;
    discountType: DiscountType;
    usedCount: bigint;
    isActive: boolean;
    usageLimit: bigint;
    applicableFor: CouponApplicableFor;
}
export interface TrainClass {
    fare: bigint;
    available: bigint;
    className: string;
}
export type TrainId = bigint;
export interface DashboardStats {
    pendingBookings: bigint;
    activeBuses: bigint;
    activeHotels: bigint;
    activeFlights: bigint;
    cancelledBookings: bigint;
    totalBookings: bigint;
    activeTrains: bigint;
    confirmedBookings: bigint;
    totalUsers: bigint;
    totalRevenue: bigint;
    totalCoupons: bigint;
    activeMealCampaigns: bigint;
}
export interface BookingView {
    id: BookingId;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    passengerDetails: Array<PassengerDetail>;
    userId: UserId;
    createdAt: Timestamp;
    toLocation: string;
    referenceId: bigint;
    fromLocation: string;
    totalAmount: bigint;
    bookingType: BookingType;
    travelDate: string;
    specialFeatures: SpecialFeatures;
}
export type HotelId = bigint;
export type UserId = Principal;
export type PaymentId = bigint;
export interface HotelView {
    id: HotelId;
    availableRooms: bigint;
    starRating: bigint;
    city: string;
    pricePerNight: bigint;
    name: string;
    createdAt: Timestamp;
    checkInTime: string;
    amenities: Array<string>;
    address: string;
    rating: number;
    checkOutTime: string;
    reviewCount: bigint;
    totalRooms: bigint;
    images: Array<string>;
}
export interface RouteStop {
    arrivalTime: string;
    station: string;
    departureTime: string;
    dayNumber: bigint;
}
export interface ProcessPaymentInput {
    method: PaymentMethod;
    bookingId: BookingId;
    amount: bigint;
}
export type NotificationId = bigint;
export interface MealEligibilityResult {
    couponCode?: string;
    eligible: boolean;
    campaignName?: string;
    mealTypes: Array<string>;
}
export interface RoomView {
    id: RoomId;
    name: string;
    hotelId: HotelId;
    description: string;
    amenities: Array<string>;
    available: boolean;
    capacity: bigint;
    price: bigint;
    roomType: RoomType;
}
export type MealCampaignId = bigint;
export type FlightId = bigint;
export interface TrainView {
    id: TrainId;
    to: string;
    duration: string;
    trainNumber: string;
    arrivalTime: string;
    departureTime: string;
    from: string;
    name: string;
    createdAt: Timestamp;
    classes: Array<TrainClass>;
    route: Array<RouteStop>;
}
export type Timestamp = bigint;
export interface LoyaltyTransaction {
    id: LoyaltyTxId;
    bookingId?: BookingId;
    transactionType: LoyaltyTransactionType;
    userId: UserId;
    createdAt: Timestamp;
    description: string;
    points: bigint;
}
export type BusId = bigint;
export interface AddTrainInput {
    to: string;
    duration: string;
    trainNumber: string;
    arrivalTime: string;
    departureTime: string;
    from: string;
    name: string;
    classes: Array<TrainClass>;
    route: Array<RouteStop>;
}
export type RoomId = bigint;
export interface CreateBookingInput {
    couponCode?: string;
    passengerDetails: Array<PassengerDetail>;
    toLocation: string;
    referenceId: bigint;
    fromLocation: string;
    distanceKm: bigint;
    totalAmount: bigint;
    bookingType: BookingType;
    travelDate: string;
}
export interface RevenueStats {
    period: RevenuePeriod;
    bookingsByType: Array<{
        revenue: bigint;
        count: bigint;
        bookingType: string;
    }>;
    totalRevenue: bigint;
}
export interface UpdateBusInput {
    id: BusId;
    to: string;
    duration: string;
    droppingPoints: Array<string>;
    busType: BusType;
    boardingPoints: Array<string>;
    arrivalTime: string;
    cancellationPolicy: string;
    departureTime: string;
    from: string;
    name: string;
    operatorName: string;
    amenities: Array<string>;
    totalSeats: bigint;
    availableSeats: bigint;
    rating: number;
    price: bigint;
}
export interface ValidateCouponResult {
    valid: boolean;
    discountAmount: bigint;
    message: string;
}
export interface PassengerDetail {
    age: bigint;
    name: string;
    seatNumber: string;
}
export interface PaymentView {
    id: PaymentId;
    status: PaymentTransactionStatus;
    method: PaymentMethod;
    bookingId: BookingId;
    userId: UserId;
    createdAt: Timestamp;
    amount: bigint;
    transactionId: string;
}
export interface FlightView {
    id: FlightId;
    to: string;
    duration: string;
    arrivalTime: string;
    flightNumber: string;
    departureTime: string;
    cabin: CabinClass;
    from: string;
    baggage: string;
    createdAt: Timestamp;
    stops: bigint;
    availableSeats: bigint;
    airline: string;
    price: bigint;
}
export type ReviewId = bigint;
export type CouponId = bigint;
export interface UpdateFlightInput {
    id: FlightId;
    to: string;
    duration: string;
    arrivalTime: string;
    flightNumber: string;
    departureTime: string;
    cabin: CabinClass;
    from: string;
    baggage: string;
    stops: bigint;
    availableSeats: bigint;
    airline: string;
    price: bigint;
}
export type BookingId = bigint;
export interface UpdateTrainInput {
    id: TrainId;
    to: string;
    duration: string;
    trainNumber: string;
    arrivalTime: string;
    departureTime: string;
    from: string;
    name: string;
    classes: Array<TrainClass>;
    route: Array<RouteStop>;
}
export interface UpdateUserInput {
    name: string;
    email: string;
    phone: string;
}
export interface UpdateCouponInput {
    id: CouponId;
    discountValue: bigint;
    expiresAt: Timestamp;
    maxDiscount: bigint;
    minBookingAmount: bigint;
    isActive: boolean;
    usageLimit: bigint;
    applicableFor: CouponApplicableFor;
}
export interface AddMealCampaignInput {
    endDate: Timestamp;
    eligibleForFirstTime: boolean;
    name: string;
    eligibleForVIP: boolean;
    minDistanceKm: bigint;
    startDate: Timestamp;
    mealTypes: Array<string>;
}
export interface AddHotelInput {
    starRating: bigint;
    city: string;
    pricePerNight: bigint;
    name: string;
    checkInTime: string;
    amenities: Array<string>;
    address: string;
    checkOutTime: string;
    totalRooms: bigint;
    images: Array<string>;
}
export type LoyaltyTxId = bigint;
export interface BusView {
    id: BusId;
    to: string;
    duration: string;
    droppingPoints: Array<string>;
    busType: BusType;
    boardingPoints: Array<string>;
    arrivalTime: string;
    cancellationPolicy: string;
    departureTime: string;
    from: string;
    name: string;
    createdAt: Timestamp;
    operatorName: string;
    amenities: Array<string>;
    totalSeats: bigint;
    availableSeats: bigint;
    rating: number;
    price: bigint;
}
export interface SpecialFeatures {
    freeFoodCouponCode?: string;
    freeFoodIncluded: boolean;
    mealType?: MealType;
}
export interface AddCouponInput {
    discountValue: bigint;
    expiresAt: Timestamp;
    maxDiscount: bigint;
    minBookingAmount: bigint;
    code: string;
    discountType: DiscountType;
    usageLimit: bigint;
    applicableFor: CouponApplicableFor;
}
export interface MealCampaignView {
    id: MealCampaignId;
    endDate: Timestamp;
    eligibleForFirstTime: boolean;
    name: string;
    eligibleForVIP: boolean;
    isActive: boolean;
    minDistanceKm: bigint;
    startDate: Timestamp;
    mealTypes: Array<string>;
}
export enum BookingStatus {
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Completed = "Completed",
    Pending = "Pending"
}
export enum BookingType {
    Bus = "Bus",
    Flight = "Flight",
    Train = "Train",
    Hotel = "Hotel"
}
export enum BusType {
    NonAC_Seater = "NonAC_Seater",
    AC_Sleeper = "AC_Sleeper",
    NonAC_Sleeper = "NonAC_Sleeper",
    AC_Seater = "AC_Seater"
}
export enum CabinClass {
    Business = "Business",
    First = "First",
    Economy = "Economy"
}
export enum CouponApplicableFor {
    All = "All",
    Bus = "Bus",
    Flight = "Flight",
    Train = "Train",
    Hotel = "Hotel"
}
export enum DiscountType {
    Percent = "Percent",
    Fixed = "Fixed"
}
export enum LoyaltyTransactionType {
    Earn = "Earn",
    Redeem = "Redeem"
}
export enum MealType {
    Veg = "Veg",
    NonVeg = "NonVeg",
    Beverages = "Beverages",
    Snacks = "Snacks"
}
export enum NotificationType {
    System = "System",
    Booking = "Booking",
    Offer = "Offer"
}
export enum PaymentMethod {
    UPI = "UPI",
    Card = "Card",
    NetBanking = "NetBanking",
    Wallet = "Wallet"
}
export enum PaymentStatus {
    Refunded = "Refunded",
    Paid = "Paid",
    Pending = "Pending"
}
export enum PaymentTransactionStatus {
    Failed = "Failed",
    Success = "Success",
    Pending = "Pending"
}
export enum RevenuePeriod {
    Day = "Day",
    Week = "Week",
    Year = "Year",
    Month = "Month"
}
export enum RoomType {
    Suite = "Suite",
    Double = "Double",
    Deluxe = "Deluxe",
    Single = "Single"
}
export enum UserRole {
    VIP = "VIP",
    User = "User",
    Admin = "Admin"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBus(input: AddBusInput): Promise<BusView>;
    addCoupon(input: AddCouponInput): Promise<CouponView>;
    addFlight(input: AddFlightInput): Promise<FlightView>;
    addHotel(input: AddHotelInput): Promise<HotelView>;
    addMealCampaign(input: AddMealCampaignInput): Promise<MealCampaignView>;
    addReview(input: AddReviewInput): Promise<ReviewView>;
    addTrain(input: AddTrainInput): Promise<TrainView>;
    approveReview(id: ReviewId): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    callOpenAI(userMessage: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cancelBooking(id: BookingId): Promise<boolean>;
    checkMealEligibility(distanceKm: bigint, bookingType: BookingType): Promise<MealEligibilityResult>;
    createBooking(input: CreateBookingInput): Promise<BookingView>;
    createOrUpdateUser(input: UpdateUserInput): Promise<UserView>;
    deleteBus(id: BusId): Promise<boolean>;
    deleteCoupon(id: CouponId): Promise<boolean>;
    deleteFlight(id: FlightId): Promise<boolean>;
    deleteHotel(id: HotelId): Promise<boolean>;
    deleteTrain(id: TrainId): Promise<boolean>;
    getActiveMealCampaigns(): Promise<Array<MealCampaignView>>;
    getAdminDashboardStats(): Promise<DashboardStats>;
    getAllBookings(): Promise<Array<BookingView>>;
    getAllReviews(): Promise<Array<ReviewView>>;
    getBooking(id: BookingId): Promise<BookingView | null>;
    getBus(id: BusId): Promise<BusView | null>;
    getBuses(): Promise<Array<BusView>>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCoupons(): Promise<Array<CouponView>>;
    getFlight(id: FlightId): Promise<FlightView | null>;
    getFlights(): Promise<Array<FlightView>>;
    getHotel(id: HotelId): Promise<HotelView | null>;
    getHotels(): Promise<Array<HotelView>>;
    getLoyaltyBalance(): Promise<bigint>;
    getLoyaltyHistory(): Promise<Array<LoyaltyTransaction>>;
    getMealCampaigns(): Promise<Array<MealCampaignView>>;
    getMyBookings(): Promise<Array<BookingView>>;
    getPaymentByBooking(bookingId: BookingId): Promise<PaymentView | null>;
    getRevenueStats(period: RevenuePeriod): Promise<RevenueStats>;
    getReviews(referenceId: bigint, bookingType: string): Promise<Array<ReviewView>>;
    getRoomsByHotel(hotelId: HotelId): Promise<Array<RoomView>>;
    getTrain(id: TrainId): Promise<TrainView | null>;
    getTrains(): Promise<Array<TrainView>>;
    getTransactionHistory(): Promise<Array<PaymentView>>;
    getUserNotifications(): Promise<Array<NotificationView>>;
    getUserProfile(): Promise<UserView | null>;
    isCallerAdmin(): Promise<boolean>;
    isOpenAIConfigured(): Promise<boolean>;
    markNotificationRead(notificationId: NotificationId): Promise<boolean>;
    processPayment(input: ProcessPaymentInput): Promise<PaymentView>;
    searchBuses(from: string, to: string, date: string): Promise<Array<BusView>>;
    searchFlights(from: string, to: string, date: string, cabin: string, tripType: string): Promise<Array<FlightView>>;
    searchHotels(city: string, checkIn: string, checkOut: string, guests: bigint, rooms: bigint): Promise<Array<HotelView>>;
    searchTrains(from: string, to: string, date: string, className: string): Promise<Array<TrainView>>;
    sendNotificationToUser(userId: Principal, title: string, message: string, notifType: NotificationType): Promise<void>;
    setOpenAIKey(key: string): Promise<void>;
    updateBookingStatus(id: BookingId, status: BookingStatus): Promise<boolean>;
    updateBus(input: UpdateBusInput): Promise<BusView | null>;
    updateCoupon(input: UpdateCouponInput): Promise<CouponView | null>;
    updateFlight(input: UpdateFlightInput): Promise<FlightView | null>;
    updateHotel(input: UpdateHotelInput): Promise<HotelView | null>;
    updateMealCampaign(input: UpdateMealCampaignInput): Promise<MealCampaignView | null>;
    updateTrain(input: UpdateTrainInput): Promise<TrainView | null>;
    updateUserProfile(input: UpdateUserInput): Promise<UserView>;
    validateCoupon(code: string, bookingAmount: bigint, bookingType: BookingType): Promise<ValidateCouponResult>;
}
