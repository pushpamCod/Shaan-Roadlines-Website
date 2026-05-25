import Map "mo:core/Map";
import Time "mo:base/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import TrainTypes "../types/train";
import CommonTypes "../types/common";
import TrainLib "../lib/train";

mixin (
  accessControlState : AccessControl.AccessControlState,
  trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
  trainIdCounter : { var value : Nat },
) {
  // Seed on first use
  TrainLib.seedTrains(trains, trainIdCounter, Time.now());

  public query func getTrains() : async [TrainTypes.TrainView] {
    TrainLib.getAll(trains);
  };

  public query func getTrain(id : TrainTypes.TrainId) : async ?TrainTypes.TrainView {
    TrainLib.get(trains, id);
  };

  public query func searchTrains(from : Text, to : Text, date : Text, className : Text) : async [TrainTypes.TrainView] {
    TrainLib.search(trains, from, to, date, className);
  };

  public shared ({ caller }) func addTrain(input : TrainTypes.AddTrainInput) : async TrainTypes.TrainView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    TrainLib.add(trains, trainIdCounter, input, Time.now());
  };

  public shared ({ caller }) func updateTrain(input : TrainTypes.UpdateTrainInput) : async ?TrainTypes.TrainView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    TrainLib.update(trains, input);
  };

  public shared ({ caller }) func deleteTrain(id : TrainTypes.TrainId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    TrainLib.delete(trains, id);
  };
};
