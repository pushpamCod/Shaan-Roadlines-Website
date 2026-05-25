import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingTypes "../types/booking";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import CouponTypes "../types/coupon";
import MealTypes "../types/meal";
import BookingLib "../lib/booking";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : List.List<BookingTypes.Booking>,
  payments : List.List<BookingTypes.Payment>,
  users : Map.Map<CommonTypes.UserId, UserTypes.User>,
  coupons : Map.Map<Text, CouponTypes.Coupon>,
  mealCampaigns : List.List<MealTypes.MealCampaign>,
  loyaltyTxs : List.List<UserTypes.LoyaltyTransaction>,
  bookingCounter : { var value : Nat },
  paymentCounter : { var value : Nat },
  loyaltyTxCounter : { var value : Nat },
) {
  public shared ({ caller }) func createBooking(input : BookingTypes.CreateBookingInput) : async BookingTypes.BookingView {
    BookingLib.create(bookings, bookingCounter, users, coupons, mealCampaigns, caller, input, Time.now());
  };

  public query ({ caller }) func getBooking(id : CommonTypes.BookingId) : async ?BookingTypes.BookingView {
    BookingLib.get(bookings, id, caller);
  };

  public shared ({ caller }) func cancelBooking(id : CommonTypes.BookingId) : async Bool {
    BookingLib.cancel(bookings, id, caller);
  };

  public query ({ caller }) func getMyBookings() : async [BookingTypes.BookingView] {
    BookingLib.getForUser(bookings, caller);
  };

  public query ({ caller }) func getAllBookings() : async [BookingTypes.BookingView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) Runtime.trap("Unauthorized");
    BookingLib.getAll(bookings);
  };

  public shared ({ caller }) func updateBookingStatus(id : CommonTypes.BookingId, status : BookingTypes.BookingStatus) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) Runtime.trap("Unauthorized");
    BookingLib.updateStatus(bookings, id, status);
  };

  public shared ({ caller }) func processPayment(input : BookingTypes.ProcessPaymentInput) : async BookingTypes.PaymentView {
    BookingLib.processPayment(payments, paymentCounter, bookings, caller, input, Time.now());
  };

  public query ({ caller }) func getPaymentByBooking(bookingId : CommonTypes.BookingId) : async ?BookingTypes.PaymentView {
    BookingLib.getPaymentByBooking(payments, bookingId, caller);
  };

  public query ({ caller }) func getTransactionHistory() : async [BookingTypes.PaymentView] {
    BookingLib.getTransactionHistory(payments, caller);
  };
};
