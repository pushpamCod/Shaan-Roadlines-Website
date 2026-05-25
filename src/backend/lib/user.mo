import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import CommonTypes "../types/common";
import UserTypes "../types/user";

module {
  public func createOrUpdate(
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    idCounter : { var value : Nat },
    caller : CommonTypes.UserId,
    input : UserTypes.UpdateUserInput,
    now : CommonTypes.Timestamp,
  ) : UserTypes.UserView {
    switch (users.get(caller)) {
      case (?existing) {
        existing.name := input.name;
        existing.email := input.email;
        existing.phone := input.phone;
        toView(existing);
      };
      case null {
        idCounter.value += 1;
        let user : UserTypes.User = {
          id = caller;
          var name = input.name;
          var email = input.email;
          var phone = input.phone;
          var role = #User;
          createdAt = now;
          var totalBookings = 0;
          var loyaltyPoints = 0;
          referralCode = "REF" # Nat.toText(idCounter.value);
          var isFirstTimeUser = true;
        };
        users.add(caller, user);
        toView(user);
      };
    };
  };

  public func getProfile(
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    caller : CommonTypes.UserId,
  ) : ?UserTypes.UserView {
    switch (users.get(caller)) {
      case (?user) ?toView(user);
      case null null;
    };
  };

  public func updateProfile(
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    caller : CommonTypes.UserId,
    input : UserTypes.UpdateUserInput,
  ) : UserTypes.UserView {
    switch (users.get(caller)) {
      case (?user) {
        user.name := input.name;
        user.email := input.email;
        user.phone := input.phone;
        toView(user);
      };
      case null {
        // Should not happen if called after createOrUpdate
        let placeholder : UserTypes.UserView = {
          id = caller;
          name = input.name;
          email = input.email;
          phone = input.phone;
          role = #User;
          createdAt = 0;
          totalBookings = 0;
          loyaltyPoints = 0;
          referralCode = "";
          isFirstTimeUser = true;
        };
        placeholder;
      };
    };
  };

  public func toView(user : UserTypes.User) : UserTypes.UserView {
    {
      id = user.id;
      name = user.name;
      email = user.email;
      phone = user.phone;
      role = user.role;
      createdAt = user.createdAt;
      totalBookings = user.totalBookings;
      loyaltyPoints = user.loyaltyPoints;
      referralCode = user.referralCode;
      isFirstTimeUser = user.isFirstTimeUser;
    };
  };

  public func generateReferralCode(counter : Nat) : Text {
    "REF" # Nat.toText(counter);
  };

  // Notifications
  public func sendNotification(
    notifications : List.List<UserTypes.Notification>,
    notifCounter : { var value : Nat },
    userId : CommonTypes.UserId,
    title : Text,
    message : Text,
    notificationType : UserTypes.NotificationType,
    now : CommonTypes.Timestamp,
  ) : () {
    notifCounter.value += 1;
    let notif : UserTypes.Notification = {
      id = notifCounter.value;
      userId;
      title;
      message;
      notificationType;
      var isRead = false;
      createdAt = now;
    };
    notifications.add(notif);
  };

  public func getUserNotifications(
    notifications : List.List<UserTypes.Notification>,
    userId : CommonTypes.UserId,
  ) : [UserTypes.NotificationView] {
    let buf = List.empty<UserTypes.NotificationView>();
    for (n in notifications.values()) {
      if (n.userId == userId) {
        buf.add({
          id = n.id;
          userId = n.userId;
          title = n.title;
          message = n.message;
          notificationType = n.notificationType;
          isRead = n.isRead;
          createdAt = n.createdAt;
        });
      };
    };
    buf.toArray();
  };

  public func markNotificationRead(
    notifications : List.List<UserTypes.Notification>,
    notificationId : CommonTypes.NotificationId,
    userId : CommonTypes.UserId,
  ) : Bool {
    var found = false;
    notifications.mapInPlace(
      func(n) {
        if (n.id == notificationId and n.userId == userId) {
          found := true;
          n.isRead := true;
        };
        n;
      }
    );
    found;
  };

  // Loyalty
  public func getLoyaltyBalance(
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    userId : CommonTypes.UserId,
  ) : Nat {
    switch (users.get(userId)) {
      case (?user) user.loyaltyPoints;
      case null 0;
    };
  };

  public func getLoyaltyHistory(
    loyaltyTxs : List.List<UserTypes.LoyaltyTransaction>,
    userId : CommonTypes.UserId,
  ) : [UserTypes.LoyaltyTransaction] {
    let buf = List.empty<UserTypes.LoyaltyTransaction>();
    for (tx in loyaltyTxs.values()) {
      if (tx.userId == userId) {
        buf.add(tx);
      };
    };
    buf.toArray();
  };

  public func addLoyaltyPoints(
    users : Map.Map<CommonTypes.UserId, UserTypes.User>,
    loyaltyTxs : List.List<UserTypes.LoyaltyTransaction>,
    txCounter : { var value : Nat },
    userId : CommonTypes.UserId,
    points : Nat,
    description : Text,
    bookingId : ?CommonTypes.BookingId,
    now : CommonTypes.Timestamp,
  ) : () {
    switch (users.get(userId)) {
      case (?user) {
        user.loyaltyPoints += points;
      };
      case null {};
    };
    txCounter.value += 1;
    let tx : UserTypes.LoyaltyTransaction = {
      id = txCounter.value;
      userId;
      points;
      transactionType = #Earn;
      description;
      bookingId;
      createdAt = now;
    };
    loyaltyTxs.add(tx);
  };
};
