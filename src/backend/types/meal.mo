import CommonTypes "common";

module {
  public type MealCampaign = {
    id : CommonTypes.MealCampaignId;
    var name : Text;
    var isActive : Bool;
    var minDistanceKm : Nat;
    var eligibleForFirstTime : Bool;
    var eligibleForVIP : Bool;
    var mealTypes : [Text];
    var startDate : CommonTypes.Timestamp;
    var endDate : CommonTypes.Timestamp;
  };

  public type MealCampaignView = {
    id : CommonTypes.MealCampaignId;
    name : Text;
    isActive : Bool;
    minDistanceKm : Nat;
    eligibleForFirstTime : Bool;
    eligibleForVIP : Bool;
    mealTypes : [Text];
    startDate : CommonTypes.Timestamp;
    endDate : CommonTypes.Timestamp;
  };

  public type AddMealCampaignInput = {
    name : Text;
    minDistanceKm : Nat;
    eligibleForFirstTime : Bool;
    eligibleForVIP : Bool;
    mealTypes : [Text];
    startDate : CommonTypes.Timestamp;
    endDate : CommonTypes.Timestamp;
  };

  public type UpdateMealCampaignInput = {
    id : CommonTypes.MealCampaignId;
    name : Text;
    isActive : Bool;
    minDistanceKm : Nat;
    eligibleForFirstTime : Bool;
    eligibleForVIP : Bool;
    mealTypes : [Text];
    startDate : CommonTypes.Timestamp;
    endDate : CommonTypes.Timestamp;
  };

  public type MealEligibilityResult = {
    eligible : Bool;
    campaignName : ?Text;
    mealTypes : [Text];
    couponCode : ?Text;
  };
};
