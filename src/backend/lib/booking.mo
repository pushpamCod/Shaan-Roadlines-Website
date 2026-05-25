import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import BookingTypes "../types/booking";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import CouponTypes "../types/coupon";
import MealTypes "../types/meal";

module {
  public func create(
    bookings : List.List<BookingTypes.Booking>,
    bookingCounter : { var value : Nat },
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    coupons : Map.Map<Text, CouponTypes.Coupon>,
    mealCampaigns : List.List<MealTypes.MealCampaign>,
    caller : Principal,
    input : BookingTypes.CreateBookingInput,
    createdAt : CommonTypes.Timestamp,
  ) : BookingTypes.BookingView {
    // 1. Look up user
    let isFirstTimeUser = switch (users.get(caller)) {
      case (?u) { u.isFirstTimeUser };
      case null { true };
    };
    let userRole = switch (users.get(caller)) {
      case (?u) { u.role };
      case null { #User };
    };

    // 2. Apply coupon if provided
    let discount : Nat = switch (input.couponCode) {
      case null { 0 };
      case (?code) {
        var found : Nat = 0;
        for ((_, coupon) in coupons.entries()) {
          if (coupon.code == code and coupon.isActive and coupon.usedCount < coupon.usageLimit and input.totalAmount >= coupon.minBookingAmount and createdAt <= coupon.expiresAt) {
            let d = switch (coupon.discountType) {
              case (#Percent) {
                let raw = input.totalAmount * coupon.discountValue / 100;
                if (coupon.maxDiscount > 0) { Nat.min(raw, coupon.maxDiscount) } else { raw };
              };
              case (#Fixed) {
                Nat.min(coupon.discountValue, input.totalAmount);
              };
            };
            coupon.usedCount += 1;
            found := d;
          };
        };
        found;
      };
    };

    // 3. Final amount
    let finalAmount : Nat = if (discount >= input.totalAmount) { 0 } else { input.totalAmount - discount };

    // 4. Check meal eligibility
    var freeFoodIncluded = false;
    var freeFoodCouponCode : ?Text = null;
    var eligibleMealTypes : [Text] = [];
    label campaignSearch for (campaign in mealCampaigns.values()) {
      if (campaign.isActive) {
        let firstTimeMatch = isFirstTimeUser and campaign.eligibleForFirstTime;
        let distanceMatch = campaign.minDistanceKm > 0 and input.distanceKm >= campaign.minDistanceKm;
        let vipMatch = userRole == #VIP and campaign.eligibleForVIP;
        if (firstTimeMatch or distanceMatch or vipMatch) {
          freeFoodIncluded := true;
          freeFoodCouponCode := ?("MEAL-" # campaign.id.toText());
          eligibleMealTypes := campaign.mealTypes;
        };
      };
    };

    // 5. Create booking
    let booking : BookingTypes.Booking = {
      id = bookingCounter.value;
      userId = caller;
      bookingType = input.bookingType;
      referenceId = input.referenceId;
      var status = #Confirmed;
      passengerDetails = input.passengerDetails;
      totalAmount = finalAmount;
      var paymentStatus = #Pending;
      createdAt = createdAt;
      fromLocation = input.fromLocation;
      toLocation = input.toLocation;
      travelDate = input.travelDate;
      specialFeatures = {
        freeFoodIncluded = freeFoodIncluded;
        mealType = null;
        freeFoodCouponCode = freeFoodCouponCode;
      };
    };
    bookingCounter.value += 1;
    bookings.add(booking);

    // 6. Update user: increment totalBookings, clear isFirstTimeUser, add loyalty points
    switch (users.get(caller)) {
      case (?u) {
        let loyaltyEarned = finalAmount / 10;
        u.totalBookings += 1;
        u.isFirstTimeUser := false;
        u.loyaltyPoints += loyaltyEarned;
        users.add(caller, u);
      };
      case null {};
    };

    toView(booking);
  };

  public func get(
    bookings : List.List<BookingTypes.Booking>,
    id : CommonTypes.BookingId,
    caller : Principal,
  ) : ?BookingTypes.BookingView {
    switch (bookings.find(func(b : BookingTypes.Booking) : Bool { b.id == id and Principal.equal(b.userId, caller) })) {
      case (?b) { ?toView(b) };
      case null { null };
    };
  };

  public func cancel(
    bookings : List.List<BookingTypes.Booking>,
    id : CommonTypes.BookingId,
    caller : Principal,
  ) : Bool {
    var found = false;
    bookings.mapInPlace(func(b : BookingTypes.Booking) : BookingTypes.Booking {
      if (b.id == id and Principal.equal(b.userId, caller)) {
        b.status := #Cancelled;
        b.paymentStatus := #Refunded;
        found := true;
      };
      b;
    });
    found;
  };

  public func getForUser(
    bookings : List.List<BookingTypes.Booking>,
    userId : CommonTypes.UserId,
  ) : [BookingTypes.BookingView] {
    bookings.filter(func(b : BookingTypes.Booking) : Bool { Principal.equal(b.userId, userId) })
      .map<BookingTypes.Booking, BookingTypes.BookingView>(func(b) { toView(b) })
      .toArray();
  };

  public func getAll(
    bookings : List.List<BookingTypes.Booking>
  ) : [BookingTypes.BookingView] {
    bookings.map<BookingTypes.Booking, BookingTypes.BookingView>(func(b) { toView(b) }).toArray();
  };

  public func updateStatus(
    bookings : List.List<BookingTypes.Booking>,
    id : CommonTypes.BookingId,
    status : BookingTypes.BookingStatus,
  ) : Bool {
    var found = false;
    bookings.mapInPlace(func(b : BookingTypes.Booking) : BookingTypes.Booking {
      if (b.id == id) {
        b.status := status;
        found := true;
      };
      b;
    });
    found;
  };

  public func toView(booking : BookingTypes.Booking) : BookingTypes.BookingView {
    {
      id = booking.id;
      userId = booking.userId;
      bookingType = booking.bookingType;
      referenceId = booking.referenceId;
      status = booking.status;
      passengerDetails = booking.passengerDetails;
      totalAmount = booking.totalAmount;
      paymentStatus = booking.paymentStatus;
      createdAt = booking.createdAt;
      fromLocation = booking.fromLocation;
      toLocation = booking.toLocation;
      travelDate = booking.travelDate;
      specialFeatures = booking.specialFeatures;
    };
  };

  // Processes payment for a booking and returns the payment record
  public func processPayment(
    payments : List.List<BookingTypes.Payment>,
    paymentCounter : { var value : Nat },
    bookings : List.List<BookingTypes.Booking>,
    caller : Principal,
    input : BookingTypes.ProcessPaymentInput,
    createdAt : CommonTypes.Timestamp,
  ) : BookingTypes.PaymentView {
    let txId = "TXN-" # paymentCounter.value.toText() # "-" # createdAt.toText();
    let payment : BookingTypes.Payment = {
      id = paymentCounter.value;
      bookingId = input.bookingId;
      userId = caller;
      amount = input.amount;
      method = input.method;
      var status = #Success;
      transactionId = txId;
      createdAt = createdAt;
    };
    paymentCounter.value += 1;
    payments.add(payment);
    // Update booking payment status to Paid
    bookings.mapInPlace(func(b : BookingTypes.Booking) : BookingTypes.Booking {
      if (b.id == input.bookingId) {
        b.paymentStatus := #Paid;
      };
      b;
    });
    paymentToView(payment);
  };

  public func getPaymentByBooking(
    payments : List.List<BookingTypes.Payment>,
    bookingId : CommonTypes.BookingId,
    caller : Principal,
  ) : ?BookingTypes.PaymentView {
    switch (payments.find(func(p : BookingTypes.Payment) : Bool { p.bookingId == bookingId and Principal.equal(p.userId, caller) })) {
      case (?p) { ?paymentToView(p) };
      case null { null };
    };
  };

  public func getTransactionHistory(
    payments : List.List<BookingTypes.Payment>,
    userId : CommonTypes.UserId,
  ) : [BookingTypes.PaymentView] {
    payments.filter(func(p : BookingTypes.Payment) : Bool { Principal.equal(p.userId, userId) })
      .map<BookingTypes.Payment, BookingTypes.PaymentView>(func(p) { paymentToView(p) })
      .toArray();
  };

  public func paymentToView(payment : BookingTypes.Payment) : BookingTypes.PaymentView {
    {
      id = payment.id;
      bookingId = payment.bookingId;
      userId = payment.userId;
      amount = payment.amount;
      method = payment.method;
      status = payment.status;
      transactionId = payment.transactionId;
      createdAt = payment.createdAt;
    };
  };
};
