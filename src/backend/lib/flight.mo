import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import FlightTypes "../types/flight";
import CommonTypes "../types/common";
import Nat "mo:core/Nat";

module {
  public func getAll(
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>
  ) : [FlightTypes.FlightView] {
    let buf = List.empty<FlightTypes.FlightView>();
    for ((_, f) in flights.entries()) {
      buf.add(toView(f));
    };
    buf.toArray();
  };

  public func get(
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
    id : FlightTypes.FlightId,
  ) : ?FlightTypes.FlightView {
    switch (flights.get(id)) {
      case (?f) ?toView(f);
      case null null;
    };
  };

  public func search(
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
    from : Text,
    to : Text,
    _date : Text,
    cabin : Text,
    _tripType : Text,
  ) : [FlightTypes.FlightView] {
    let fromLower = from.toLower();
    let toLower = to.toLower();
    let cabinFilter : ?FlightTypes.CabinClass = if (cabin == "Economy") ?(#Economy)
      else if (cabin == "Business") ?(#Business)
      else if (cabin == "First") ?(#First)
      else null;
    let buf = List.empty<FlightTypes.FlightView>();
    for ((_, f) in flights.entries()) {
      let matchFrom = f.from.toLower().contains(#text fromLower);
      let matchTo = f.to.toLower().contains(#text toLower);
      let matchCabin = switch (cabinFilter) {
        case null true;
        case (?c) f.cabin == c;
      };
      if (matchFrom and matchTo and matchCabin) {
        buf.add(toView(f));
      };
    };
    buf.toArray();
  };

  public func add(
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
    idCounter : { var value : Nat },
    input : FlightTypes.AddFlightInput,
    createdAt : CommonTypes.Timestamp,
  ) : FlightTypes.FlightView {
    idCounter.value += 1;
    let id = idCounter.value;
    let flight : FlightTypes.Flight = {
      id;
      var flightNumber = input.flightNumber;
      var airline = input.airline;
      var from = input.from;
      var to = input.to;
      var departureTime = input.departureTime;
      var arrivalTime = input.arrivalTime;
      var duration = input.duration;
      var stops = input.stops;
      var price = input.price;
      var cabin = input.cabin;
      var baggage = input.baggage;
      var availableSeats = input.availableSeats;
      createdAt;
    };
    flights.add(id, flight);
    toView(flight);
  };

  public func update(
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
    input : FlightTypes.UpdateFlightInput,
  ) : ?FlightTypes.FlightView {
    switch (flights.get(input.id)) {
      case null null;
      case (?f) {
        f.flightNumber := input.flightNumber;
        f.airline := input.airline;
        f.from := input.from;
        f.to := input.to;
        f.departureTime := input.departureTime;
        f.arrivalTime := input.arrivalTime;
        f.duration := input.duration;
        f.stops := input.stops;
        f.price := input.price;
        f.cabin := input.cabin;
        f.baggage := input.baggage;
        f.availableSeats := input.availableSeats;
        ?toView(f);
      };
    };
  };

  public func delete(
    flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
    id : FlightTypes.FlightId,
  ) : Bool {
    switch (flights.get(id)) {
      case null false;
      case (?_) { flights.remove(id); true };
    };
  };

  public func toView(flight : FlightTypes.Flight) : FlightTypes.FlightView {
    {
      id = flight.id;
      flightNumber = flight.flightNumber;
      airline = flight.airline;
      from = flight.from;
      to = flight.to;
      departureTime = flight.departureTime;
      arrivalTime = flight.arrivalTime;
      duration = flight.duration;
      stops = flight.stops;
      price = flight.price;
      cabin = flight.cabin;
      baggage = flight.baggage;
      availableSeats = flight.availableSeats;
      createdAt = flight.createdAt;
    };
  };

  public func seedFlights() : [FlightTypes.Flight] {
    [
      { id = 1; var flightNumber = "6E-101"; var airline = "IndiGo"; var from = "DEL"; var to = "BOM"; var departureTime = "06:00"; var arrivalTime = "08:30"; var duration = "2h 30m"; var stops = 0; var price = 4500; var cabin = #Economy; var baggage = "15 kg"; var availableSeats = 80; createdAt = 0 },
      { id = 2; var flightNumber = "AI-101"; var airline = "Air India"; var from = "DEL"; var to = "BLR"; var departureTime = "07:00"; var arrivalTime = "10:15"; var duration = "3h 15m"; var stops = 0; var price = 5500; var cabin = #Economy; var baggage = "25 kg"; var availableSeats = 60; createdAt = 0 },
      { id = 3; var flightNumber = "SG-201"; var airline = "SpiceJet"; var from = "BOM"; var to = "GOA"; var departureTime = "09:00"; var arrivalTime = "10:30"; var duration = "1h 30m"; var stops = 0; var price = 3200; var cabin = #Economy; var baggage = "15 kg"; var availableSeats = 90; createdAt = 0 },
      { id = 4; var flightNumber = "6E-201"; var airline = "IndiGo"; var from = "DEL"; var to = "CCU"; var departureTime = "08:00"; var arrivalTime = "11:00"; var duration = "3h"; var stops = 0; var price = 4200; var cabin = #Economy; var baggage = "15 kg"; var availableSeats = 75; createdAt = 0 },
      { id = 5; var flightNumber = "UK-101"; var airline = "Vistara"; var from = "DEL"; var to = "BOM"; var departureTime = "10:00"; var arrivalTime = "12:30"; var duration = "2h 30m"; var stops = 0; var price = 22000; var cabin = #Business; var baggage = "30 kg"; var availableSeats = 20; createdAt = 0 },
      { id = 6; var flightNumber = "AI-401"; var airline = "Air India"; var from = "BLR"; var to = "DEL"; var departureTime = "14:00"; var arrivalTime = "17:30"; var duration = "3h 30m"; var stops = 0; var price = 5800; var cabin = #Economy; var baggage = "25 kg"; var availableSeats = 65; createdAt = 0 },
      { id = 7; var flightNumber = "6E-301"; var airline = "IndiGo"; var from = "CCU"; var to = "DEL"; var departureTime = "13:00"; var arrivalTime = "16:00"; var duration = "3h"; var stops = 0; var price = 4400; var cabin = #Economy; var baggage = "15 kg"; var availableSeats = 80; createdAt = 0 },
      { id = 8; var flightNumber = "SG-401"; var airline = "SpiceJet"; var from = "GOA"; var to = "BOM"; var departureTime = "17:00"; var arrivalTime = "18:30"; var duration = "1h 30m"; var stops = 0; var price = 3500; var cabin = #Economy; var baggage = "15 kg"; var availableSeats = 85; createdAt = 0 },
    ];
  };
};
