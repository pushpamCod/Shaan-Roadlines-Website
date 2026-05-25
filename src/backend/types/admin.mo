module {
  public type DashboardStats = {
    totalUsers : Nat;
    totalBookings : Nat;
    totalRevenue : Nat;
    activeBuses : Nat;
    activeTrains : Nat;
    activeFlights : Nat;
    activeHotels : Nat;
    pendingBookings : Nat;
    confirmedBookings : Nat;
    cancelledBookings : Nat;
    totalCoupons : Nat;
    activeMealCampaigns : Nat;
  };

  public type RevenuePeriod = { #Day; #Week; #Month; #Year };

  public type RevenueStats = {
    period : RevenuePeriod;
    totalRevenue : Nat;
    bookingsByType : [
      {
        bookingType : Text;
        count : Nat;
        revenue : Nat;
      }
    ];
  };
};
