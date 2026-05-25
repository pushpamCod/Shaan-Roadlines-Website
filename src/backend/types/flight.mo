import CommonTypes "common";

module {
  public type FlightId = Nat;

  public type CabinClass = { #Economy; #Business; #First };

  public type TripType = { #OneWay; #RoundTrip; #MultiCity };

  public type Flight = {
    id : FlightId;
    var flightNumber : Text;
    var airline : Text;
    var from : Text;
    var to : Text;
    var departureTime : Text;
    var arrivalTime : Text;
    var duration : Text;
    var stops : Nat;
    var price : Nat;
    var cabin : CabinClass;
    var baggage : Text;
    var availableSeats : Nat;
    createdAt : CommonTypes.Timestamp;
  };

  public type FlightView = {
    id : FlightId;
    flightNumber : Text;
    airline : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    stops : Nat;
    price : Nat;
    cabin : CabinClass;
    baggage : Text;
    availableSeats : Nat;
    createdAt : CommonTypes.Timestamp;
  };

  public type AddFlightInput = {
    flightNumber : Text;
    airline : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    stops : Nat;
    price : Nat;
    cabin : CabinClass;
    baggage : Text;
    availableSeats : Nat;
  };

  public type UpdateFlightInput = {
    id : FlightId;
    flightNumber : Text;
    airline : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    stops : Nat;
    price : Nat;
    cabin : CabinClass;
    baggage : Text;
    availableSeats : Nat;
  };
};
