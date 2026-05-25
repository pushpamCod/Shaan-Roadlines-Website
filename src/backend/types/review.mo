import CommonTypes "common";

module {
  public type Review = {
    id : CommonTypes.ReviewId;
    userId : CommonTypes.UserId;
    userName : Text;
    referenceId : Nat;
    bookingType : Text;
    rating : Nat;
    comment : Text;
    createdAt : CommonTypes.Timestamp;
    var isApproved : Bool;
  };

  public type ReviewView = {
    id : CommonTypes.ReviewId;
    userId : CommonTypes.UserId;
    userName : Text;
    referenceId : Nat;
    bookingType : Text;
    rating : Nat;
    comment : Text;
    createdAt : CommonTypes.Timestamp;
    isApproved : Bool;
  };

  public type AddReviewInput = {
    referenceId : Nat;
    bookingType : Text;
    rating : Nat;
    comment : Text;
  };
};
