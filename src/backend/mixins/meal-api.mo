import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:base/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import MealTypes "../types/meal";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import BookingTypes "../types/booking";
import MealLib "../lib/meal";

mixin (
  accessControlState : AccessControl.AccessControlState,
  mealCampaigns : List.List<MealTypes.MealCampaign>,
  users : Map.Map<CommonTypes.UserId, UserTypes.User>,
  mealCampaignCounter : { var value : Nat },
) {
  // Seed meal campaigns on first use
  if (mealCampaigns.size() == 0) {
    let seeds = MealLib.seedCampaigns();
    for (c in seeds.vals()) {
      mealCampaigns.add(c);
    };
  };

  public query func getActiveMealCampaigns() : async [MealTypes.MealCampaignView] {
    MealLib.getActive(mealCampaigns, Time.now());
  };

  public query ({ caller }) func checkMealEligibility(distanceKm : Nat, bookingType : BookingTypes.BookingType) : async MealTypes.MealEligibilityResult {
    MealLib.checkEligibility(mealCampaigns, users, caller, distanceKm, bookingType, Time.now());
  };

  public query ({ caller }) func getMealCampaigns() : async [MealTypes.MealCampaignView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    MealLib.getAll(mealCampaigns);
  };

  public shared ({ caller }) func addMealCampaign(input : MealTypes.AddMealCampaignInput) : async MealTypes.MealCampaignView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    MealLib.add(mealCampaigns, mealCampaignCounter, input);
  };

  public shared ({ caller }) func updateMealCampaign(input : MealTypes.UpdateMealCampaignInput) : async ?MealTypes.MealCampaignView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    MealLib.update(mealCampaigns, input);
  };
};
