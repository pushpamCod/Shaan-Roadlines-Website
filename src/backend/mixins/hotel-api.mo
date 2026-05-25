import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import HotelTypes "../types/hotel";
import HotelLib "../lib/hotel";
import Nat "mo:core/Nat";

mixin (
  accessControlState : AccessControl.AccessControlState,
  hotels : Map.Map<HotelTypes.HotelId, HotelTypes.Hotel>,
  rooms : List.List<HotelTypes.Room>,
  hotelIdCounter : { var value : Nat },
) {
  // Seed hotels on first load
  if (hotels.size() == 0) {
    let { hotels = seedH; rooms = seedR } = HotelLib.seedHotels();
    for (h in seedH.vals()) {
      hotels.add(h.id, h);
      if (h.id >= hotelIdCounter.value) {
        hotelIdCounter.value := h.id + 1;
      };
    };
    for (r in seedR.vals()) {
      rooms.add(r);
    };
  };

  public query func getHotels() : async [HotelTypes.HotelView] {
    HotelLib.getAll(hotels);
  };

  public query func getHotel(id : HotelTypes.HotelId) : async ?HotelTypes.HotelView {
    HotelLib.get(hotels, id);
  };

  public query func searchHotels(city : Text, checkIn : Text, checkOut : Text, guests : Nat, rooms_ : Nat) : async [HotelTypes.HotelView] {
    HotelLib.search(hotels, city, checkIn, checkOut, guests, rooms_);
  };

  public query func getRoomsByHotel(hotelId : HotelTypes.HotelId) : async [HotelTypes.RoomView] {
    HotelLib.getRoomsByHotel(rooms, hotelId);
  };

  public shared ({ caller }) func addHotel(input : HotelTypes.AddHotelInput) : async HotelTypes.HotelView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    HotelLib.add(hotels, hotelIdCounter, input, Time.now());
  };

  public shared ({ caller }) func updateHotel(input : HotelTypes.UpdateHotelInput) : async ?HotelTypes.HotelView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    HotelLib.update(hotels, input);
  };

  public shared ({ caller }) func deleteHotel(id : HotelTypes.HotelId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    HotelLib.delete(hotels, id);
  };
};
