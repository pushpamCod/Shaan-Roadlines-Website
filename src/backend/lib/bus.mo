import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import BusTypes "../types/bus";
import CommonTypes "../types/common";
import Nat "mo:core/Nat";

module {
  public func getAll(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>
  ) : [BusTypes.BusView] {
    let buf = List.empty<BusTypes.BusView>();
    for ((_, bus) in buses.entries()) {
      buf.add(toView(bus));
    };
    buf.toArray();
  };

  public func get(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    id : BusTypes.BusId,
  ) : ?BusTypes.BusView {
    switch (buses.get(id)) {
      case (?bus) ?toView(bus);
      case null null;
    };
  };

  public func search(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    from : Text,
    to : Text,
    _date : Text,
  ) : [BusTypes.BusView] {
    let fromLower = from.toLower();
    let toLower = to.toLower();
    let buf = List.empty<BusTypes.BusView>();
    for ((_, bus) in buses.entries()) {
      let busFrom = bus.from.toLower();
      let busTo = bus.to.toLower();
      if (busFrom.contains(#text fromLower) and busTo.contains(#text toLower)) {
        buf.add(toView(bus));
      };
    };
    buf.toArray();
  };

  public func add(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    idCounter : { var value : Nat },
    input : BusTypes.AddBusInput,
    createdAt : CommonTypes.Timestamp,
  ) : BusTypes.BusView {
    idCounter.value += 1;
    let bus : BusTypes.Bus = {
      id = idCounter.value;
      var name = input.name;
      var operatorName = input.operatorName;
      var from = input.from;
      var to = input.to;
      var departureTime = input.departureTime;
      var arrivalTime = input.arrivalTime;
      var duration = input.duration;
      var busType = input.busType;
      var totalSeats = input.totalSeats;
      var availableSeats = input.totalSeats;
      var price = input.price;
      var rating = 0.0;
      var amenities = input.amenities;
      var cancellationPolicy = input.cancellationPolicy;
      var boardingPoints = input.boardingPoints;
      var droppingPoints = input.droppingPoints;
      createdAt;
    };
    buses.add(idCounter.value, bus);
    toView(bus);
  };

  public func update(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    input : BusTypes.UpdateBusInput,
  ) : ?BusTypes.BusView {
    switch (buses.get(input.id)) {
      case (?bus) {
        bus.name := input.name;
        bus.operatorName := input.operatorName;
        bus.from := input.from;
        bus.to := input.to;
        bus.departureTime := input.departureTime;
        bus.arrivalTime := input.arrivalTime;
        bus.duration := input.duration;
        bus.busType := input.busType;
        bus.totalSeats := input.totalSeats;
        bus.availableSeats := input.availableSeats;
        bus.price := input.price;
        bus.rating := input.rating;
        bus.amenities := input.amenities;
        bus.cancellationPolicy := input.cancellationPolicy;
        bus.boardingPoints := input.boardingPoints;
        bus.droppingPoints := input.droppingPoints;
        ?toView(bus);
      };
      case null null;
    };
  };

  public func delete(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    id : BusTypes.BusId,
  ) : Bool {
    switch (buses.get(id)) {
      case (?_) {
        buses.remove(id);
        true;
      };
      case null false;
    };
  };

  public func toView(bus : BusTypes.Bus) : BusTypes.BusView {
    {
      id = bus.id;
      name = bus.name;
      operatorName = bus.operatorName;
      from = bus.from;
      to = bus.to;
      departureTime = bus.departureTime;
      arrivalTime = bus.arrivalTime;
      duration = bus.duration;
      busType = bus.busType;
      totalSeats = bus.totalSeats;
      availableSeats = bus.availableSeats;
      price = bus.price;
      rating = bus.rating;
      amenities = bus.amenities;
      cancellationPolicy = bus.cancellationPolicy;
      boardingPoints = bus.boardingPoints;
      droppingPoints = bus.droppingPoints;
      createdAt = bus.createdAt;
    };
  };

  public func seedBuses(
    buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
    idCounter : { var value : Nat },
    now : CommonTypes.Timestamp,
  ) : () {
    if (buses.size() > 0) return;
    let seeds : [(Nat, Text, Text, Text, Text, Text, Text, Text, BusTypes.BusType, Nat, Nat, Nat, Float, [Text], Text, [Text], [Text])] = [
      (1, "Volvo A/C Sleeper", "RedBus Travels", "Delhi", "Mumbai", "20:00", "16:00 +1", "20h", #AC_Sleeper, 40, 32, 950, 4.3, ["WiFi","Charging Point","Water Bottle","Blanket"], "Free cancellation up to 2 hours before departure", ["Delhi ISBT","Akshardham"], ["Dadar","Bandra","Borivali"]),
      (2, "Intercity A/C Express", "Pawan Hans", "Delhi", "Jaipur", "06:00", "12:00", "6h", #AC_Seater, 45, 38, 650, 4.1, ["WiFi","Charging Point"], "Free cancellation up to 1 hour before departure", ["Dhaula Kuan","Mahipalpur"], ["Jaipur Central","Sindhi Camp"]),
      (3, "City Express", "MSRTC", "Mumbai", "Pune", "07:00", "11:00", "4h", #NonAC_Seater, 50, 45, 350, 3.8, ["Charging Point"], "No cancellation after boarding", ["Dadar","Kurla"], ["Pune Station","Shivajinagar"]),
      (4, "Kaveri Travels Sleeper", "Kaveri Travels", "Bangalore", "Chennai", "22:00", "06:00 +1", "8h", #AC_Sleeper, 36, 28, 800, 4.2, ["WiFi","Water Bottle","Blanket","Reading Light"], "Free cancellation up to 4 hours before departure", ["Majestic","Silk Board"], ["Chennai Central","T. Nagar"]),
      (5, "Agra Express", "UP Tourism", "Delhi", "Agra", "08:00", "12:00", "4h", #AC_Seater, 45, 40, 550, 4.0, ["WiFi","Charging Point"], "Free cancellation up to 2 hours before departure", ["India Gate","Akshardham"], ["Agra Fort","Taj Mahal"]),
      (6, "KSRTC Airavat", "KSRTC", "Hyderabad", "Bangalore", "21:00", "07:00 +1", "10h", #NonAC_Sleeper, 36, 30, 750, 3.9, ["Water Bottle"], "Free cancellation up to 3 hours before departure", ["Hyderabad Central","Mehdipatnam"], ["Kempegowda","Madivala"]),
      (7, "Greenline Express", "Greenline Travels", "Kolkata", "Bhubaneswar", "22:00", "06:00 +1", "8h", #AC_Seater, 45, 35, 600, 4.0, ["WiFi","Charging Point","Water Bottle"], "Free cancellation up to 2 hours before departure", ["Esplanade","Ultadanga"], ["Bhubaneswar ISBT","Master Canteen"]),
      (8, "Parveen Premium", "Parveen Travels", "Chennai", "Coimbatore", "22:30", "05:30 +1", "7h", #NonAC_Seater, 50, 42, 400, 3.7, ["Charging Point"], "No cancellation 1 hour before departure", ["Chennai CMBT","Tambaram"], ["Coimbatore Central","Gandhipuram"]),
    ];
    for ((id, name, op, frm, to, dep, arr, dur, bt, seats, avail, price, rating, amenities, policy, boarding, dropping) in seeds.vals()) {
      let bus : BusTypes.Bus = {
        id;
        var name;
        var operatorName = op;
        var from = frm;
        var to;
        var departureTime = dep;
        var arrivalTime = arr;
        var duration = dur;
        var busType = bt;
        var totalSeats = seats;
        var availableSeats = avail;
        var price;
        var rating;
        var amenities;
        var cancellationPolicy = policy;
        var boardingPoints = boarding;
        var droppingPoints = dropping;
        createdAt = now;
      };
      buses.add(id, bus);
      if (id > idCounter.value) { idCounter.value := id };
    };
  };
};
