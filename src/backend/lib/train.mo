import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import TrainTypes "../types/train";
import CommonTypes "../types/common";
import Nat "mo:core/Nat";

module {
  public func getAll(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>
  ) : [TrainTypes.TrainView] {
    let buf = List.empty<TrainTypes.TrainView>();
    for ((_, train) in trains.entries()) {
      buf.add(toView(train));
    };
    buf.toArray();
  };

  public func get(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    id : TrainTypes.TrainId,
  ) : ?TrainTypes.TrainView {
    switch (trains.get(id)) {
      case (?train) ?toView(train);
      case null null;
    };
  };

  public func search(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    from : Text,
    to : Text,
    _date : Text,
    className : Text,
  ) : [TrainTypes.TrainView] {
    let fromLower = from.toLower();
    let toLower = to.toLower();
    let classFilter = if (className.size() == 0) null else ?className.toLower();
    let buf = List.empty<TrainTypes.TrainView>();
    for ((_, train) in trains.entries()) {
      let trainFrom = train.from.toLower();
      let trainTo = train.to.toLower();
      let fromMatch = from.size() == 0 or trainFrom.contains(#text fromLower);
      let toMatch = to.size() == 0 or trainTo.contains(#text toLower);
      if (fromMatch and toMatch) {
        let classMatch = switch (classFilter) {
          case null true;
          case (?cls) {
            var found = false;
            for (c in train.classes.vals()) {
              if (c.className.toLower() == cls) { found := true };
            };
            found;
          };
        };
        if (classMatch) {
          buf.add(toView(train));
        };
      };
    };
    buf.toArray();
  };

  public func add(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    idCounter : { var value : Nat },
    input : TrainTypes.AddTrainInput,
    createdAt : CommonTypes.Timestamp,
  ) : TrainTypes.TrainView {
    idCounter.value += 1;
    let train : TrainTypes.Train = {
      id = idCounter.value;
      var trainNumber = input.trainNumber;
      var name = input.name;
      var from = input.from;
      var to = input.to;
      var departureTime = input.departureTime;
      var arrivalTime = input.arrivalTime;
      var duration = input.duration;
      var classes = input.classes;
      var route = input.route;
      createdAt;
    };
    trains.add(idCounter.value, train);
    toView(train);
  };

  public func update(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    input : TrainTypes.UpdateTrainInput,
  ) : ?TrainTypes.TrainView {
    switch (trains.get(input.id)) {
      case (?train) {
        train.trainNumber := input.trainNumber;
        train.name := input.name;
        train.from := input.from;
        train.to := input.to;
        train.departureTime := input.departureTime;
        train.arrivalTime := input.arrivalTime;
        train.duration := input.duration;
        train.classes := input.classes;
        train.route := input.route;
        ?toView(train);
      };
      case null null;
    };
  };

  public func delete(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    id : TrainTypes.TrainId,
  ) : Bool {
    switch (trains.get(id)) {
      case (?_) {
        trains.remove(id);
        true;
      };
      case null false;
    };
  };

  public func toView(train : TrainTypes.Train) : TrainTypes.TrainView {
    {
      id = train.id;
      trainNumber = train.trainNumber;
      name = train.name;
      from = train.from;
      to = train.to;
      departureTime = train.departureTime;
      arrivalTime = train.arrivalTime;
      duration = train.duration;
      classes = train.classes;
      route = train.route;
      createdAt = train.createdAt;
    };
  };

  public func seedTrains(
    trains : Map.Map<TrainTypes.TrainId, TrainTypes.Train>,
    idCounter : { var value : Nat },
    now : CommonTypes.Timestamp,
  ) : () {
    if (trains.size() > 0) return;
    let seed1 : TrainTypes.Train = {
      id = 1;
      var trainNumber = "12301";
      var name = "Rajdhani Express";
      var from = "Delhi";
      var to = "Howrah";
      var departureTime = "16:55";
      var arrivalTime = "10:05 +1";
      var duration = "17h10m";
      var classes = [
        { className = "Sleeper"; available = 50; fare = 500 },
        { className = "3AC"; available = 24; fare = 1200 },
        { className = "2AC"; available = 12; fare = 1800 },
        { className = "1AC"; available = 6; fare = 3200 },
      ];
      var route = [
        { station = "Delhi"; arrivalTime = "-"; departureTime = "16:55"; dayNumber = 1 },
        { station = "Kanpur"; arrivalTime = "22:10"; departureTime = "22:15"; dayNumber = 1 },
        { station = "Allahabad"; arrivalTime = "00:35"; departureTime = "00:40"; dayNumber = 2 },
        { station = "Howrah"; arrivalTime = "10:05"; departureTime = "-"; dayNumber = 2 },
      ];
      createdAt = now;
    };
    let seed2 : TrainTypes.Train = {
      id = 2;
      var trainNumber = "12002";
      var name = "Shatabdi Express";
      var from = "Delhi";
      var to = "Bhopal";
      var departureTime = "06:00";
      var arrivalTime = "14:00";
      var duration = "8h";
      var classes = [
        { className = "Chair Car"; available = 100; fare = 800 },
        { className = "Executive"; available = 24; fare = 1800 },
      ];
      var route = [
        { station = "Delhi"; arrivalTime = "-"; departureTime = "06:00"; dayNumber = 1 },
        { station = "Agra"; arrivalTime = "08:15"; departureTime = "08:20"; dayNumber = 1 },
        { station = "Gwalior"; arrivalTime = "09:45"; departureTime = "09:50"; dayNumber = 1 },
        { station = "Bhopal"; arrivalTime = "14:00"; departureTime = "-"; dayNumber = 1 },
      ];
      createdAt = now;
    };
    let seed3 : TrainTypes.Train = {
      id = 3;
      var trainNumber = "12213";
      var name = "Duronto Express";
      var from = "Delhi";
      var to = "Mumbai";
      var departureTime = "23:00";
      var arrivalTime = "17:00 +1";
      var duration = "18h";
      var classes = [
        { className = "Sleeper"; available = 60; fare = 600 },
        { className = "3AC"; available = 30; fare = 1400 },
        { className = "2AC"; available = 12; fare = 2200 },
      ];
      var route = [
        { station = "Delhi"; arrivalTime = "-"; departureTime = "23:00"; dayNumber = 1 },
        { station = "Mumbai"; arrivalTime = "17:00"; departureTime = "-"; dayNumber = 2 },
      ];
      createdAt = now;
    };
    let seed4 : TrainTypes.Train = {
      id = 4;
      var trainNumber = "12951";
      var name = "Mumbai Rajdhani";
      var from = "Mumbai";
      var to = "Delhi";
      var departureTime = "17:00";
      var arrivalTime = "08:35 +1";
      var duration = "15h35m";
      var classes = [
        { className = "3AC"; available = 36; fare = 2100 },
        { className = "2AC"; available = 16; fare = 2900 },
        { className = "1AC"; available = 4; fare = 4900 },
      ];
      var route = [
        { station = "Mumbai"; arrivalTime = "-"; departureTime = "17:00"; dayNumber = 1 },
        { station = "Delhi"; arrivalTime = "08:35"; departureTime = "-"; dayNumber = 2 },
      ];
      createdAt = now;
    };
    let seed5 : TrainTypes.Train = {
      id = 5;
      var trainNumber = "12760";
      var name = "Charminar Express";
      var from = "Hyderabad";
      var to = "Chennai";
      var departureTime = "18:30";
      var arrivalTime = "06:45 +1";
      var duration = "12h15m";
      var classes = [
        { className = "Sleeper"; available = 80; fare = 450 },
        { className = "3AC"; available = 32; fare = 1100 },
      ];
      var route = [
        { station = "Hyderabad"; arrivalTime = "-"; departureTime = "18:30"; dayNumber = 1 },
        { station = "Chennai"; arrivalTime = "06:45"; departureTime = "-"; dayNumber = 2 },
      ];
      createdAt = now;
    };
    let seed6 : TrainTypes.Train = {
      id = 6;
      var trainNumber = "12627";
      var name = "Karnataka Express";
      var from = "Delhi";
      var to = "Bangalore";
      var departureTime = "22:30";
      var arrivalTime = "05:45 +2";
      var duration = "31h15m";
      var classes = [
        { className = "Sleeper"; available = 100; fare = 700 },
        { className = "3AC"; available = 48; fare = 1600 },
        { className = "2AC"; available = 16; fare = 2400 },
      ];
      var route = [
        { station = "Delhi"; arrivalTime = "-"; departureTime = "22:30"; dayNumber = 1 },
        { station = "Bangalore"; arrivalTime = "05:45"; departureTime = "-"; dayNumber = 3 },
      ];
      createdAt = now;
    };
    trains.add(1, seed1);
    trains.add(2, seed2);
    trains.add(3, seed3);
    trains.add(4, seed4);
    trains.add(5, seed5);
    trains.add(6, seed6);
    idCounter.value := 6;
  };
};
