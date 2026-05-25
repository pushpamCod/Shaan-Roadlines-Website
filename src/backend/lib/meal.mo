import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MealTypes "../types/meal";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import BookingTypes "../types/booking";

module {
  public func getActive(
    campaigns : List.List<MealTypes.MealCampaign>,
    now : CommonTypes.Timestamp,
  ) : [MealTypes.MealCampaignView] {
    let buf = List.empty<MealTypes.MealCampaignView>();
    for (c in campaigns.values()) {
      if (c.isActive and now >= c.startDate and now <= c.endDate) {
        buf.add(toView(c));
      };
    };
    buf.toArray();
  };

  public func checkEligibility(
    campaigns : List.List<MealTypes.MealCampaign>,
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    userId : CommonTypes.UserId,
    distanceKm : Nat,
    _bookingType : BookingTypes.BookingType,
    now : CommonTypes.Timestamp,
  ) : MealTypes.MealEligibilityResult {
    let userOpt = users.get(userId);
    switch (userOpt) {
      case null { { eligible = false; campaignName = null; mealTypes = []; couponCode = null } };
      case (?user) {
        var result : ?MealTypes.MealCampaign = null;
        label search for (c in campaigns.values()) {
          if (c.isActive and now >= c.startDate and now <= c.endDate) {
            let eligible =
              (c.eligibleForFirstTime and user.isFirstTimeUser) or
              (c.minDistanceKm > 0 and distanceKm >= c.minDistanceKm) or
              (c.eligibleForVIP and user.role == #VIP);
            if (eligible) {
              result := ?c;
              break search;
            };
          };
        };
        switch (result) {
          case null { { eligible = false; campaignName = null; mealTypes = []; couponCode = null } };
          case (?campaign) {
            let code = generateCouponCode(userId, campaign.id);
            { eligible = true; campaignName = ?campaign.name; mealTypes = campaign.mealTypes; couponCode = ?code };
          };
        };
      };
    };
  };

  public func getAll(
    campaigns : List.List<MealTypes.MealCampaign>
  ) : [MealTypes.MealCampaignView] {
    let buf = List.empty<MealTypes.MealCampaignView>();
    for (c in campaigns.values()) {
      buf.add(toView(c));
    };
    buf.toArray();
  };

  public func add(
    campaigns : List.List<MealTypes.MealCampaign>,
    idCounter : { var value : Nat },
    input : MealTypes.AddMealCampaignInput,
  ) : MealTypes.MealCampaignView {
    idCounter.value += 1;
    let campaign : MealTypes.MealCampaign = {
      id = idCounter.value;
      var name = input.name;
      var isActive = true;
      var minDistanceKm = input.minDistanceKm;
      var eligibleForFirstTime = input.eligibleForFirstTime;
      var eligibleForVIP = input.eligibleForVIP;
      var mealTypes = input.mealTypes;
      var startDate = input.startDate;
      var endDate = input.endDate;
    };
    campaigns.add(campaign);
    toView(campaign);
  };

  public func update(
    campaigns : List.List<MealTypes.MealCampaign>,
    input : MealTypes.UpdateMealCampaignInput,
  ) : ?MealTypes.MealCampaignView {
    var found : ?MealTypes.MealCampaign = null;
    for (c in campaigns.values()) {
      if (c.id == input.id) { found := ?c };
    };
    switch (found) {
      case null null;
      case (?c) {
        c.name := input.name;
        c.isActive := input.isActive;
        c.minDistanceKm := input.minDistanceKm;
        c.eligibleForFirstTime := input.eligibleForFirstTime;
        c.eligibleForVIP := input.eligibleForVIP;
        c.mealTypes := input.mealTypes;
        c.startDate := input.startDate;
        c.endDate := input.endDate;
        ?toView(c);
      };
    };
  };

  public func toView(campaign : MealTypes.MealCampaign) : MealTypes.MealCampaignView {
    {
      id = campaign.id;
      name = campaign.name;
      isActive = campaign.isActive;
      minDistanceKm = campaign.minDistanceKm;
      eligibleForFirstTime = campaign.eligibleForFirstTime;
      eligibleForVIP = campaign.eligibleForVIP;
      mealTypes = campaign.mealTypes;
      startDate = campaign.startDate;
      endDate = campaign.endDate;
    };
  };

  public func generateCouponCode(userId : CommonTypes.UserId, campaignId : CommonTypes.MealCampaignId) : Text {
    "MEAL-" # campaignId.toText() # "-" # userId.toText();
  };

  public func seedCampaigns() : [MealTypes.MealCampaign] {
    [
      { id = 1; var name = "First Trip Treat"; var isActive = true; var minDistanceKm = 0; var eligibleForFirstTime = true; var eligibleForVIP = false; var mealTypes = ["Veg","Non-Veg","Snacks","Beverages"]; var startDate = 0; var endDate = 9999999999999 },
      { id = 2; var name = "Long Journey Meal"; var isActive = true; var minDistanceKm = 500; var eligibleForFirstTime = false; var eligibleForVIP = true; var mealTypes = ["Veg","Non-Veg","Beverages"]; var startDate = 0; var endDate = 9999999999999 },
    ];
  };
};
