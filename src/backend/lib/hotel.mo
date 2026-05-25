import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import HotelTypes "../types/hotel";
import CommonTypes "../types/common";
import Nat "mo:core/Nat";

module {
  public func getAll(
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>
  ) : [HotelTypes.HotelView] {
    let buf = List.empty<HotelTypes.HotelView>();
    for ((_, h) in hotels.entries()) {
      buf.add(toView(h));
    };
    buf.toArray();
  };

  public func get(
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
    id : HotelTypes.HotelId,
  ) : ?HotelTypes.HotelView {
    switch (hotels.get(id)) {
      case (?h) ?toView(h);
      case null null;
    };
  };

  public func search(
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
    city : Text,
    _checkIn : Text,
    _checkOut : Text,
    _guests : Nat,
    _rooms : Nat,
  ) : [HotelTypes.HotelView] {
    let cityLower = city.toLower();
    let buf = List.empty<HotelTypes.HotelView>();
    for ((_, h) in hotels.entries()) {
      if (h.city.toLower().contains(#text cityLower)) {
        buf.add(toView(h));
      };
    };
    buf.toArray();
  };

  public func getRoomsByHotel(
    rooms : List.List<HotelTypes.Room>,
    hotelId : HotelTypes.HotelId,
  ) : [HotelTypes.RoomView] {
    let buf = List.empty<HotelTypes.RoomView>();
    for (r in rooms.values()) {
      if (r.hotelId == hotelId) {
        buf.add(roomToView(r));
      };
    };
    buf.toArray();
  };

  public func add(
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
    idCounter : { var value : Nat },
    input : HotelTypes.AddHotelInput,
    createdAt : CommonTypes.Timestamp,
  ) : HotelTypes.HotelView {
    idCounter.value += 1;
    let id = idCounter.value;
    let hotel : HotelTypes.Hotel = {
      id;
      var name = input.name;
      var city = input.city;
      var address = input.address;
      var starRating = input.starRating;
      var pricePerNight = input.pricePerNight;
      var amenities = input.amenities;
      var images = input.images;
      var checkInTime = input.checkInTime;
      var checkOutTime = input.checkOutTime;
      var totalRooms = input.totalRooms;
      var availableRooms = input.totalRooms;
      var rating = 0.0;
      var reviewCount = 0;
      createdAt;
    };
    hotels.add(id, hotel);
    toView(hotel);
  };

  public func update(
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
    input : HotelTypes.UpdateHotelInput,
  ) : ?HotelTypes.HotelView {
    switch (hotels.get(input.id)) {
      case null null;
      case (?h) {
        h.name := input.name;
        h.city := input.city;
        h.address := input.address;
        h.starRating := input.starRating;
        h.pricePerNight := input.pricePerNight;
        h.amenities := input.amenities;
        h.images := input.images;
        h.checkInTime := input.checkInTime;
        h.checkOutTime := input.checkOutTime;
        h.totalRooms := input.totalRooms;
        h.availableRooms := input.availableRooms;
        h.rating := input.rating;
        h.reviewCount := input.reviewCount;
        ?toView(h);
      };
    };
  };

  public func delete(
    hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
    id : HotelTypes.HotelId,
  ) : Bool {
    switch (hotels.get(id)) {
      case null false;
      case (?_) { hotels.remove(id); true };
    };
  };

  public func toView(hotel : HotelTypes.Hotel) : HotelTypes.HotelView {
    {
      id = hotel.id;
      name = hotel.name;
      city = hotel.city;
      address = hotel.address;
      starRating = hotel.starRating;
      pricePerNight = hotel.pricePerNight;
      amenities = hotel.amenities;
      images = hotel.images;
      checkInTime = hotel.checkInTime;
      checkOutTime = hotel.checkOutTime;
      totalRooms = hotel.totalRooms;
      availableRooms = hotel.availableRooms;
      rating = hotel.rating;
      reviewCount = hotel.reviewCount;
      createdAt = hotel.createdAt;
    };
  };

  public func roomToView(room : HotelTypes.Room) : HotelTypes.RoomView {
    {
      id = room.id;
      hotelId = room.hotelId;
      roomType = room.roomType;
      name = room.name;
      description = room.description;
      capacity = room.capacity;
      price = room.price;
      amenities = room.amenities;
      available = room.available;
    };
  };

  public func seedHotels() : { hotels : [HotelTypes.Hotel]; rooms : [HotelTypes.Room] } {
    let hotels : [HotelTypes.Hotel] = [
      { id = 1; var name = "Taj Mahal Palace"; var city = "Mumbai"; var address = "Apollo Bunder, Mumbai 400001"; var starRating = 5; var pricePerNight = 12000; var amenities = ["Swimming Pool","Spa","Fine Dining","WiFi","Gym","Business Center","Concierge"]; var images = ["https://source.unsplash.com/800x600/?luxury-hotel"]; var checkInTime = "14:00"; var checkOutTime = "12:00"; var totalRooms = 20; var availableRooms = 8; var rating = 4.8; var reviewCount = 1240; createdAt = 0 },
      { id = 2; var name = "Oberoi New Delhi"; var city = "Delhi"; var address = "Dr Zakir Hussain Marg, New Delhi 110003"; var starRating = 5; var pricePerNight = 15000; var amenities = ["Swimming Pool","Spa","Restaurant","WiFi","Business Center","Bar"]; var images = []; var checkInTime = "14:00"; var checkOutTime = "12:00"; var totalRooms = 18; var availableRooms = 6; var rating = 4.9; var reviewCount = 980; createdAt = 0 },
      { id = 3; var name = "ITC Grand Chola"; var city = "Chennai"; var address = "63 Mount Road, Chennai 600032"; var starRating = 5; var pricePerNight = 8000; var amenities = ["Swimming Pool","Spa","Multi-Cuisine Restaurant","WiFi","Gym"]; var images = []; var checkInTime = "14:00"; var checkOutTime = "12:00"; var totalRooms = 22; var availableRooms = 10; var rating = 4.7; var reviewCount = 756; createdAt = 0 },
      { id = 4; var name = "The Leela Goa"; var city = "Goa"; var address = "Mobor, Cavelossim, South Goa 403731"; var starRating = 5; var pricePerNight = 9000; var amenities = ["Private Beach","Swimming Pool","Spa","Restaurant","Water Sports","WiFi"]; var images = []; var checkInTime = "15:00"; var checkOutTime = "11:00"; var totalRooms = 30; var availableRooms = 12; var rating = 4.8; var reviewCount = 1100; createdAt = 0 },
      { id = 5; var name = "Marriott Jaipur"; var city = "Jaipur"; var address = "Ashram Marg, Jaipur 302001"; var starRating = 4; var pricePerNight = 5500; var amenities = ["Swimming Pool","Restaurant","WiFi","Gym","Bar"]; var images = []; var checkInTime = "14:00"; var checkOutTime = "12:00"; var totalRooms = 25; var availableRooms = 15; var rating = 4.5; var reviewCount = 623; createdAt = 0 },
      { id = 6; var name = "The Park Kolkata"; var city = "Kolkata"; var address = "17 Park Street, Kolkata 700016"; var starRating = 4; var pricePerNight = 4500; var amenities = ["Restaurant","WiFi","Gym","Bar","Rooftop Pool"]; var images = []; var checkInTime = "14:00"; var checkOutTime = "12:00"; var totalRooms = 20; var availableRooms = 9; var rating = 4.4; var reviewCount = 445; createdAt = 0 },
    ];
    let rooms : [HotelTypes.Room] = [
      { id = 1; hotelId = 1; var roomType = #Double; var name = "Sea View Deluxe"; var description = "Panoramic sea view with luxurious interiors"; var capacity = 2; var price = 12000; var amenities = ["Sea View","King Bed","Mini Bar","Jacuzzi"]; var available = true },
      { id = 2; hotelId = 1; var roomType = #Suite; var name = "Presidential Suite"; var description = "Ultimate luxury with butler service"; var capacity = 4; var price = 35000; var amenities = ["Sea View","Living Room","Butler Service","Private Pool"]; var available = true },
      { id = 3; hotelId = 2; var roomType = #Double; var name = "Deluxe Room"; var description = "Elegant city view room"; var capacity = 2; var price = 15000; var amenities = ["City View","King Bed","Mini Bar"]; var available = true },
      { id = 4; hotelId = 2; var roomType = #Suite; var name = "Presidential Suite"; var description = "Supreme luxury in the heart of Delhi"; var capacity = 4; var price = 50000; var amenities = ["Panoramic View","Living Room","Private Dining"]; var available = true },
      { id = 5; hotelId = 3; var roomType = #Double; var name = "Superior Room"; var description = "Contemporary comfort with city views"; var capacity = 2; var price = 8000; var amenities = ["City View","Queen Bed","WiFi"]; var available = true },
      { id = 6; hotelId = 3; var roomType = #Suite; var name = "ITC One Suite"; var description = "Exclusive business suite"; var capacity = 2; var price = 18000; var amenities = ["Living Area","Work Desk","Premium Minibar"]; var available = true },
      { id = 7; hotelId = 4; var roomType = #Double; var name = "Garden Pool Villa"; var description = "Private pool villa with garden views"; var capacity = 2; var price = 9000; var amenities = ["Private Pool","Garden View","Outdoor Shower"]; var available = true },
      { id = 8; hotelId = 4; var roomType = #Suite; var name = "Beach Suite"; var description = "Steps from the private beach"; var capacity = 4; var price = 22000; var amenities = ["Beach Access","Private Deck","Plunge Pool"]; var available = true },
      { id = 9; hotelId = 5; var roomType = #Double; var name = "Deluxe Room"; var description = "Modern room with pool view"; var capacity = 2; var price = 5500; var amenities = ["Pool View","King Bed","WiFi"]; var available = true },
      { id = 10; hotelId = 5; var roomType = #Suite; var name = "Junior Suite"; var description = "Spacious suite with separate lounge"; var capacity = 3; var price = 9500; var amenities = ["Lounge Area","Premium Minibar","City View"]; var available = true },
      { id = 11; hotelId = 6; var roomType = #Double; var name = "Premier Room"; var description = "Stylish room in vibrant Park Street"; var capacity = 2; var price = 4500; var amenities = ["Street View","King Bed","WiFi"]; var available = true },
      { id = 12; hotelId = 6; var roomType = #Suite; var name = "Park Suite"; var description = "Luxurious suite with rooftop terrace"; var capacity = 4; var price = 9000; var amenities = ["Terrace","Living Room","City Panorama"]; var available = true },
    ];
    { hotels; rooms };
  };
};
