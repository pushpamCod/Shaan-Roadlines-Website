import Map "mo:core/Map";
import List "mo:core/List";
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

module {
  public func getDashboardStats(
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
    bookings : List.List<BookingTypes.Booking>,
    coupons : Map.Map<Text, CouponTypes.Coupon>,
    mealCampaigns : List.List<MealTypes.MealCampaign>,
    _now : CommonTypes.Timestamp,
  ) : AdminTypes.DashboardStats {
    var pendingBookings = 0;
    var confirmedBookings = 0;
    var cancelledBookings = 0;
    bookings.forEach(func(b : BookingTypes.Booking) {
      switch (b.status) {
        case (#Pending) { pendingBookings += 1 };
        case (#Confirmed) { confirmedBookings += 1 };
        case (#Cancelled) { cancelledBookings += 1 };
        case (#Completed) {};
      };
    });
    var activeMealCampaigns = 0;
    mealCampaigns.forEach(func(c : MealTypes.MealCampaign) {
      if (c.isActive) { activeMealCampaigns += 1 };
    });
    {
      totalUsers = users.size();
      totalBookings = bookings.size();
      totalRevenue = 0; // Revenue computed separately via getRevenueStats
      activeBuses = buses.size();
      activeTrains = trains.size();
      activeFlights = flights.size();
      activeHotels = hotels.size();
      pendingBookings = pendingBookings;
      confirmedBookings = confirmedBookings;
      cancelledBookings = cancelledBookings;
      totalCoupons = coupons.size();
      activeMealCampaigns = activeMealCampaigns;
    };
  };

  public func getRevenueStats(
    bookings : List.List<BookingTypes.Booking>,
    payments : List.List<BookingTypes.Payment>,
    period : AdminTypes.RevenuePeriod,
    _now : CommonTypes.Timestamp,
  ) : AdminTypes.RevenueStats {
    // Compute per-type revenue by joining payments with bookings
    var busRev = 0;
    var trainRev = 0;
    var flightRev = 0;
    var hotelRev = 0;
    var busCount = 0;
    var trainCount = 0;
    var flightCount = 0;
    var hotelCount = 0;
    var totalRev = 0;

    payments.forEach(func(p : BookingTypes.Payment) {
      if (p.status == #Success) {
        switch (bookings.find(func(b : BookingTypes.Booking) : Bool { b.id == p.bookingId })) {
          case (?b) {
            totalRev += p.amount;
            switch (b.bookingType) {
              case (#Bus) { busRev += p.amount; busCount += 1 };
              case (#Train) { trainRev += p.amount; trainCount += 1 };
              case (#Flight) { flightRev += p.amount; flightCount += 1 };
              case (#Hotel) { hotelRev += p.amount; hotelCount += 1 };
            };
          };
          case null {};
        };
      };
    });

    {
      period = period;
      totalRevenue = totalRev;
      bookingsByType = [
        { bookingType = "Bus"; count = busCount; revenue = busRev },
        { bookingType = "Train"; count = trainCount; revenue = trainRev },
        { bookingType = "Flight"; count = flightCount; revenue = flightRev },
        { bookingType = "Hotel"; count = hotelCount; revenue = hotelRev },
      ];
    };
  };
};
