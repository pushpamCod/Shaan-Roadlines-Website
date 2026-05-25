import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import ReviewTypes "../types/review";
import CommonTypes "../types/common";
import UserTypes "../types/user";

module {
  public func add(
    reviews : List.List<ReviewTypes.Review>,
    idCounter : { var value : Nat },
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    caller : Principal,
    input : ReviewTypes.AddReviewInput,
    createdAt : CommonTypes.Timestamp,
  ) : ReviewTypes.ReviewView {
    let userName = switch (users.get(caller)) {
      case (?u) { u.name };
      case null { "Anonymous" };
    };
    let review : ReviewTypes.Review = {
      id = idCounter.value;
      userId = caller;
      userName = userName;
      referenceId = input.referenceId;
      bookingType = input.bookingType;
      rating = input.rating;
      comment = input.comment;
      createdAt = createdAt;
      var isApproved = false;
    };
    idCounter.value += 1;
    reviews.add(review);
    toView(review);
  };

  public func getByReference(
    reviews : List.List<ReviewTypes.Review>,
    referenceId : Nat,
    bookingType : Text,
  ) : [ReviewTypes.ReviewView] {
    reviews.filter(func(r : ReviewTypes.Review) : Bool {
      r.referenceId == referenceId and r.bookingType == bookingType and r.isApproved
    }).map<ReviewTypes.Review, ReviewTypes.ReviewView>(func(r) { toView(r) }).toArray();
  };

  public func approve(
    reviews : List.List<ReviewTypes.Review>,
    id : CommonTypes.ReviewId,
  ) : Bool {
    var found = false;
    reviews.mapInPlace(func(r : ReviewTypes.Review) : ReviewTypes.Review {
      if (r.id == id) {
        r.isApproved := true;
        found := true;
      };
      r;
    });
    found;
  };

  public func getAll(
    reviews : List.List<ReviewTypes.Review>
  ) : [ReviewTypes.ReviewView] {
    reviews.map<ReviewTypes.Review, ReviewTypes.ReviewView>(func(r) { toView(r) }).toArray();
  };

  public func toView(review : ReviewTypes.Review) : ReviewTypes.ReviewView {
    {
      id = review.id;
      userId = review.userId;
      userName = review.userName;
      referenceId = review.referenceId;
      bookingType = review.bookingType;
      rating = review.rating;
      comment = review.comment;
      createdAt = review.createdAt;
      isApproved = review.isApproved;
    };
  };
};
