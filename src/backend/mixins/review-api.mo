import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:base/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import ReviewTypes "../types/review";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import ReviewLib "../lib/review";

mixin (
  accessControlState : AccessControl.AccessControlState,
  reviews : List.List<ReviewTypes.Review>,
  users : Map.Map<CommonTypes.UserId, UserTypes.User>,
  reviewIdCounter : { var value : Nat },
) {
  public shared ({ caller }) func addReview(input : ReviewTypes.AddReviewInput) : async ReviewTypes.ReviewView {
    ReviewLib.add(reviews, reviewIdCounter, users, caller, input, Time.now());
  };

  public query func getReviews(referenceId : Nat, bookingType : Text) : async [ReviewTypes.ReviewView] {
    ReviewLib.getByReference(reviews, referenceId, bookingType);
  };

  public shared ({ caller }) func approveReview(id : CommonTypes.ReviewId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    ReviewLib.approve(reviews, id);
  };

  public query ({ caller }) func getAllReviews() : async [ReviewTypes.ReviewView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized");
    };
    ReviewLib.getAll(reviews);
  };
};
