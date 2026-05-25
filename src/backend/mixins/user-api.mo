import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import UserTypes "../types/user";
import UserLib "../lib/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  users : Map.Map<CommonTypes.UserId, UserTypes.User>,
  notifications : List.List<UserTypes.Notification>,
  loyaltyTxs : List.List<UserTypes.LoyaltyTransaction>,
  counters : {
    var nextUserId : Nat;
    var nextNotifId : Nat;
    var nextLoyaltyTxId : Nat;
  },
) {
  let userIdCounter = { var value : Nat = counters.nextUserId };
  let notifCounter = { var value : Nat = counters.nextNotifId };
  let loyaltyTxCounter = { var value : Nat = counters.nextLoyaltyTxId };

  public shared ({ caller }) func createOrUpdateUser(input : UserTypes.UpdateUserInput) : async UserTypes.UserView {
    let now = Time.now();
    let view = UserLib.createOrUpdate(users, userIdCounter, caller, input, now);
    counters.nextUserId := userIdCounter.value;
    view;
  };

  public query ({ caller }) func getUserProfile() : async ?UserTypes.UserView {
    UserLib.getProfile(users, caller);
  };

  public shared ({ caller }) func updateUserProfile(input : UserTypes.UpdateUserInput) : async UserTypes.UserView {
    UserLib.updateProfile(users, caller, input);
  };

  public query ({ caller }) func getUserNotifications() : async [UserTypes.NotificationView] {
    UserLib.getUserNotifications(notifications, caller);
  };

  public shared ({ caller }) func markNotificationRead(notificationId : CommonTypes.NotificationId) : async Bool {
    UserLib.markNotificationRead(notifications, notificationId, caller);
  };

  public query ({ caller }) func getLoyaltyBalance() : async Nat {
    UserLib.getLoyaltyBalance(users, caller);
  };

  public query ({ caller }) func getLoyaltyHistory() : async [UserTypes.LoyaltyTransaction] {
    UserLib.getLoyaltyHistory(loyaltyTxs, caller);
  };
};
