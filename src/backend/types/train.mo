import CommonTypes "common";

module {
  public type TrainId = Nat;

  public type TrainClass = {
    className : Text;
    available : Nat;
    fare : Nat;
  };

  public type RouteStop = {
    station : Text;
    arrivalTime : Text;
    departureTime : Text;
    dayNumber : Nat;
  };

  public type Train = {
    id : TrainId;
    var trainNumber : Text;
    var name : Text;
    var from : Text;
    var to : Text;
    var departureTime : Text;
    var arrivalTime : Text;
    var duration : Text;
    var classes : [TrainClass];
    var route : [RouteStop];
    createdAt : CommonTypes.Timestamp;
  };

  public type TrainView = {
    id : TrainId;
    trainNumber : Text;
    name : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    classes : [TrainClass];
    route : [RouteStop];
    createdAt : CommonTypes.Timestamp;
  };

  public type AddTrainInput = {
    trainNumber : Text;
    name : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    classes : [TrainClass];
    route : [RouteStop];
  };

  public type UpdateTrainInput = {
    id : TrainId;
    trainNumber : Text;
    name : Text;
    from : Text;
    to : Text;
    departureTime : Text;
    arrivalTime : Text;
    duration : Text;
    classes : [TrainClass];
    route : [RouteStop];
  };
};
