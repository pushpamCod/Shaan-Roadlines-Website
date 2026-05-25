import CommonTypes "common";

module {
  public type BusId = Nat;

  public type BusType = { #AC_Sleeper; #AC_Seater; #NonAC_Sleeper; #NonAC_Seater };

  public type Bus = {
    id : BusId;
    var name : Text;
    var operatorName : Text;
    var from : Text;
    var to : Text;
    var departureTime : Text;
    var arrivalTime : Text;
    var duration : Text;
    var busType : BusType;
    var totalSeats : Nat;
    var availableSeats : Nat;
    var price : Nat;
    var rating : Float;
    var amenities : [Text];
    var cancellationPolicy : Text;
    var boardingPoints : [Text];
    var droppingPoints : [Text];
    createdAt : CommonTypes.Timestamp;
  };

  public type BusView = {
    id : BusId;
    name : Text;
    operatorName : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    busType : BusType;
    totalSeats : Nat;
    availableSeats : Nat;
    price : Nat;
    rating : Float;
    amenities : [Text];
    cancellationPolicy : Text;
    boardingPoints : [Text];
    droppingPoints : [Text];
    createdAt : CommonTypes.Timestamp;
  };

  public type AddBusInput = {
    name : Text;
    operatorName : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    busType : BusType;
    totalSeats : Nat;
    price : Nat;
    amenities : [Text];
    cancellationPolicy : Text;
    boardingPoints : [Text];
    droppingPoints : [Text];
  };

  public type UpdateBusInput = {
    id : BusId;
    name : Text;
    operatorName : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    busType : BusType;
    totalSeats : Nat;
    availableSeats : Nat;
    price : Nat;
    rating : Float;
    amenities : [Text];
    cancellationPolicy : Text;
    boardingPoints : [Text];
    droppingPoints : [Text];
  };
};
