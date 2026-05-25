import CommonTypes "common";

module {
  public type BookingType = { #Bus; #Train; #Flight; #Hotel };

  public type BookingStatus = { #Pending; #Confirmed; #Cancelled; #Completed };

  public type PaymentStatus = { #Pending; #Paid; #Refunded };

  public type MealType = { #Veg; #NonVeg; #Snacks; #Beverages };

  public type PassengerDetail = {
    name : Text;
    age : Nat;
    seatNumber : Text;
  };

  public type SpecialFeatures = {
    freeFoodIncluded : Bool;
    mealType : ?MealType;
    freeFoodCouponCode : ?Text;
  };

  public type Booking = {
    id : CommonTypes.BookingId;
    userId : CommonTypes.UserId;
    bookingType : BookingType;
    referenceId : Nat; // busId / trainId / flightId / hotelId
    var status : BookingStatus;
    passengerDetails : [PassengerDetail];
    totalAmount : Nat;
    var paymentStatus : PaymentStatus;
    createdAt : CommonTypes.Timestamp;
    fromLocation : Text;
    toLocation : Text;
    travelDate : Text;
    specialFeatures : SpecialFeatures;
  };

  public type BookingView = {
    id : CommonTypes.BookingId;
    userId : CommonTypes.UserId;
    bookingType : BookingType;
    referenceId : Nat;
    status : BookingStatus;
    passengerDetails : [PassengerDetail];
    totalAmount : Nat;
    paymentStatus : PaymentStatus;
    createdAt : CommonTypes.Timestamp;
    fromLocation : Text;
    toLocation : Text;
    travelDate : Text;
    specialFeatures : SpecialFeatures;
  };

  public type CreateBookingInput = {
    bookingType : BookingType;
    referenceId : Nat;
    passengerDetails : [PassengerDetail];
    totalAmount : Nat;
    fromLocation : Text;
    toLocation : Text;
    travelDate : Text;
    distanceKm : Nat;
    couponCode : ?Text;
  };

  public type PaymentMethod = { #Card; #UPI; #Wallet; #NetBanking };

  public type PaymentTransactionStatus = { #Success; #Failed; #Pending };

  public type Payment = {
    id : CommonTypes.PaymentId;
    bookingId : CommonTypes.BookingId;
    userId : CommonTypes.UserId;
    amount : Nat;
    method : PaymentMethod;
    var status : PaymentTransactionStatus;
    transactionId : Text;
    createdAt : CommonTypes.Timestamp;
  };

  public type PaymentView = {
    id : CommonTypes.PaymentId;
    bookingId : CommonTypes.BookingId;
    userId : CommonTypes.UserId;
    amount : Nat;
    method : PaymentMethod;
    status : PaymentTransactionStatus;
    transactionId : Text;
    createdAt : CommonTypes.Timestamp;
  };

  public type ProcessPaymentInput = {
    bookingId : CommonTypes.BookingId;
    amount : Nat;
    method : PaymentMethod;
  };
};
