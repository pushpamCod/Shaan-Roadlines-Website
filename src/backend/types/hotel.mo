import CommonTypes "common";

module {
  public type HotelId = Nat;
  public type RoomId = Nat;

  public type RoomType = { #Single; #Double; #Suite; #Deluxe };

  public type Hotel = {
    id : HotelId;
    var name : Text;
    var city : Text;
    var address : Text;
    var starRating : Nat;
    var pricePerNight : Nat;
    var amenities : [Text];
    var images : [Text];
    var checkInTime : Text;
    var checkOutTime : Text;
    var totalRooms : Nat;
    var availableRooms : Nat;
    var rating : Float;
    var reviewCount : Nat;
    createdAt : CommonTypes.Timestamp;
  };

  public type HotelView = {
    id : HotelId;
    name : Text;
    city : Text;
    address : Text;
    starRating : Nat;
    pricePerNight : Nat;
    amenities : [Text];
    images : [Text];
    checkInTime : Text;
    checkOutTime : Text;
    totalRooms : Nat;
    availableRooms : Nat;
    rating : Float;
    reviewCount : Nat;
    createdAt : CommonTypes.Timestamp;
  };

  public type Room = {
    id : RoomId;
    hotelId : HotelId;
    var roomType : RoomType;
    var name : Text;
    var description : Text;
    var capacity : Nat;
    var price : Nat;
    var amenities : [Text];
    var available : Bool;
  };

  public type RoomView = {
    id : RoomId;
    hotelId : HotelId;
    roomType : RoomType;
    name : Text;
    description : Text;
    capacity : Nat;
    price : Nat;
    amenities : [Text];
    available : Bool;
  };

  public type AddHotelInput = {
    name : Text;
    city : Text;
    address : Text;
    starRating : Nat;
    pricePerNight : Nat;
    amenities : [Text];
    images : [Text];
    checkInTime : Text;
    checkOutTime : Text;
    totalRooms : Nat;
  };

  public type UpdateHotelInput = {
    id : HotelId;
    name : Text;
    city : Text;
    address : Text;
    starRating : Nat;
    pricePerNight : Nat;
    amenities : [Text];
    images : [Text];
    checkInTime : Text;
    checkOutTime : Text;
    totalRooms : Nat;
    availableRooms : Nat;
    rating : Float;
    reviewCount : Nat;
  };

  public type AddRoomInput = {
    hotelId : HotelId;
    roomType : RoomType;
    name : Text;
    description : Text;
    capacity : Nat;
    price : Nat;
    amenities : [Text];
  };
};
