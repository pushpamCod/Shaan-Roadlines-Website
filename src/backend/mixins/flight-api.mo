import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import FlightTypes "../types/flight";
import FlightLib "../lib/flight";
import Nat "mo:core/Nat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  flights : Map.Map<FlightTypes.FlightId, FlightTypes.Flight>,
  flightIdCounter : { var value : Nat },
) {
  // Seed flights on first load
  if (flights.size() == 0) {
    let seeds = FlightLib.seedFlights();
    for (f in seeds.vals()) {
      flights.add(f.id, f);
      if (f.id >= flightIdCounter.value) {
        flightIdCounter.value := f.id + 1;
      };
    };
  };

  public query func getFlights() : async [FlightTypes.FlightView] {
    FlightLib.getAll(flights);
  };

  public query func getFlight(id : FlightTypes.FlightId) : async ?FlightTypes.FlightView {
    FlightLib.get(flights, id);
  };

  public query func searchFlights(from : Text, to : Text, date : Text, cabin : Text, tripType : Text) : async [FlightTypes.FlightView] {
    FlightLib.search(flights, from, to, date, cabin, tripType);
  };

  public shared ({ caller }) func addFlight(input : FlightTypes.AddFlightInput) : async FlightTypes.FlightView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    FlightLib.add(flights, flightIdCounter, input, Time.now());
  };

  public shared ({ caller }) func updateFlight(input : FlightTypes.UpdateFlightInput) : async ?FlightTypes.FlightView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    FlightLib.update(flights, input);
  };

  public shared ({ caller }) func deleteFlight(id : FlightTypes.FlightId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    FlightLib.delete(flights, id);
  };
};
