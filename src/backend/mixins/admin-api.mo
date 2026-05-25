import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:base/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import AdminTypes "../types/admin";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import BusTypes "../types/bus";
import TrainTypes "../types/train";
import FlightTypes "../types/flight";
import HotelTypes "../types/hotel";
import BookingTypes "../types/booking";
import CouponTypes "../types/coupon";
import MealTypes "../types/meal";
import AdminLib "../lib/admin";
import UserLib "../lib/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<CommonTypes.UserId, UserTypes.User>,
  buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
  trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
  flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
  hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
  bookings : List.List<BookingTypes.Booking>,
  payments : List.List<BookingTypes.Payment>,
  coupons : Map.Map<Text, CouponTypes.Coupon>,
  mealCampaigns : List.List<MealTypes.MealCampaign>,
  notifications : List.List<UserTypes.Notification>,
  notifCounter : { var value : Nat },
) {
  public query ({ caller }) func getAdminDashboardStats() : async AdminTypes.DashboardStats {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    AdminLib.getDashboardStats(users, buses, trains, flights, hotels, bookings, coupons, mealCampaigns, Time.now());
  };

  public query ({ caller }) func getRevenueStats(period : AdminTypes.RevenuePeriod) : async AdminTypes.RevenueStats {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    AdminLib.getRevenueStats(bookings, payments, period, Time.now());
  };

  public shared ({ caller }) func sendNotificationToUser(userId : Principal, title : Text, message : Text, notifType : UserTypes.NotificationType) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.sendNotification(notifications, notifCounter, userId, title, message, notifType, Time.now());
  };
};
