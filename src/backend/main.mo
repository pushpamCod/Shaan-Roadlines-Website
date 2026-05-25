import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";

import CommonTypes "types/common";
import UserTypes "types/user";
import BusTypes "types/bus";
import TrainTypes "types/train";
import FlightTypes "types/flight";
import HotelTypes "types/hotel";
import BookingTypes "types/booking";
import CouponTypes "types/coupon";
import MealTypes "types/meal";
import ReviewTypes "types/review";

import UserApiMixin "mixins/user-api";
import BusApiMixin "mixins/bus-api";
import TrainApiMixin "mixins/train-api";
import FlightApiMixin "mixins/flight-api";
import HotelApiMixin "mixins/hotel-api";
import BookingApiMixin "mixins/booking-api";
import CouponApiMixin "mixins/coupon-api";
import MealApiMixin "mixins/meal-api";
import ReviewApiMixin "mixins/review-api";
import AdminApiMixin "mixins/admin-api";
import OpenAIApiMixin "mixins/openai-api";

actor {
  // ── Authorization ──────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── Counters (mutable state wrapped in records for mixin sharing) ──────
  let counters = {
    var nextUserId : Nat = 0;
    var nextNotifId : Nat = 0;
    var nextLoyaltyTxId : Nat = 0;
  };
  let busIdCounter = { var value : Nat = 0 };
  let trainIdCounter = { var value : Nat = 0 };
  let flightIdCounter = { var value : Nat = 0 };
  let hotelIdCounter = { var value : Nat = 0 };
  let bookingCounter = { var value : Nat = 0 };
  let paymentCounter = { var value : Nat = 0 };
  let couponIdCounter = { var value : Nat = 0 };
  let mealCampaignCounter = { var value : Nat = 0 };
  let reviewIdCounter = { var value : Nat = 0 };

  // ── OpenAI key (admin-set, single canister-level key) ──────────────────
  let openAIApiKey = { var value : ?Text = null };

  // ── Domain state ───────────────────────────────────────────────────────
  let users = Map.empty<CommonTypes.UserId, UserTypes.User>();
  let buses = Map.empty<BusTypes.BusId, BusTypes.Bus>();
  let trains = Map.empty<TrainTypes.TrainId, TrainTypes.Train>();
  let flights = Map.empty<FlightTypes.FlightId, FlightTypes.Flight>();
  let hotels = Map.empty<HotelTypes.HotelId, HotelTypes.Hotel>();
  let rooms = List.empty<HotelTypes.Room>();
  let bookings = List.empty<BookingTypes.Booking>();
  let payments = List.empty<BookingTypes.Payment>();
  let coupons = Map.empty<Text, CouponTypes.Coupon>();
  let mealCampaigns = List.empty<MealTypes.MealCampaign>();
  let reviews = List.empty<ReviewTypes.Review>();
  let notifications = List.empty<UserTypes.Notification>();
  let loyaltyTxs = List.empty<UserTypes.LoyaltyTransaction>();
  let bookingLoyaltyTxCounter = { var value : Nat = 0 };

  // ── Mixin inclusions ───────────────────────────────────────────────────
  include UserApiMixin(accessControlState, users, notifications, loyaltyTxs, counters);
  include BusApiMixin(accessControlState, buses, busIdCounter);
  include TrainApiMixin(accessControlState, trains, trainIdCounter);
  include FlightApiMixin(accessControlState, flights, flightIdCounter);
  include HotelApiMixin(accessControlState, hotels, rooms, hotelIdCounter);
  include BookingApiMixin(accessControlState, bookings, payments, users, coupons, mealCampaigns, loyaltyTxs, bookingCounter, paymentCounter, bookingLoyaltyTxCounter);
  include CouponApiMixin(accessControlState, coupons, couponIdCounter);
  include MealApiMixin(accessControlState, mealCampaigns, users, mealCampaignCounter);
  include ReviewApiMixin(accessControlState, reviews, users, reviewIdCounter);
  let adminNotifCounter = { var value : Nat = 0 };
  include AdminApiMixin(accessControlState, users, buses, trains, flights, hotels, bookings, payments, coupons, mealCampaigns, notifications, adminNotifCounter);
  include OpenAIApiMixin(accessControlState, openAIApiKey);
};
