import Map "mo:core/Map";
import Time "mo:base/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BusTypes "../types/bus";
import CommonTypes "../types/common";
import BusLib "../lib/bus";

mixin (
  accessControlState : AccessControl.AccessControlState,
  buses : Map.Map<BusTypes.BusId, BusTypes.Bus>,
  busIdCounter : { var value : Nat },
) {
  // Seed on first use
  BusLib.seedBuses(buses, busIdCounter, Time.now());

  public query func getBuses() : async [BusTypes.BusView] {
    BusLib.getAll(buses);
  };

  public query func getBus(id : BusTypes.BusId) : async ?BusTypes.BusView {
    BusLib.get(buses, id);
  };

  public query func searchBuses(from : Text, to : Text, date : Text) : async [BusTypes.BusView] {
    BusLib.search(buses, from, to, date);
  };

  public shared ({ caller }) func addBus(input : BusTypes.AddBusInput) : async BusTypes.BusView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    BusLib.add(buses, busIdCounter, input, Time.now());
  };

  public shared ({ caller }) func updateBus(input : BusTypes.UpdateBusInput) : async ?BusTypes.BusView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    BusLib.update(buses, input);
  };

  public shared ({ caller }) func deleteBus(id : BusTypes.BusId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    BusLib.delete(buses, id);
  };
};
