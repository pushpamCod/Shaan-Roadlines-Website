import CommonTypes "common";

module {
  public type UserRole = { #User; #Admin; #VIP };

  public type User = {
    id : CommonTypes.UserId;
    var name : Text;
    var email : Text;
    var phone : Text;
    var role : UserRole;
    createdAt : CommonTypes.Timestamp;
    var totalBookings : Nat;
    var loyaltyPoints : Nat;
    referralCode : Text;
    var isFirstTimeUser : Bool;
  };

  // Shared (immutable) view of a user returned to the frontend
  public type UserView = {
    id : CommonTypes.UserId;
    name : Text;
    email : Text;
    phone : Text;
    role : UserRole;
    createdAt : CommonTypes.Timestamp;
    totalBookings : Nat;
    loyaltyPoints : Nat;
    referralCode : Text;
    isFirstTimeUser : Bool;
  };

  public type UpdateUserInput = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type Notification = {
    id : CommonTypes.NotificationId;
    userId : CommonTypes.UserId;
    title : Text;
    message : Text;
    notificationType : NotificationType;
    var isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };

  public type NotificationType = { #Booking; #Offer; #System };

  public type NotificationView = {
    id : CommonTypes.NotificationId;
    userId : CommonTypes.UserId;
    title : Text;
    message : Text;
    notificationType : NotificationType;
    isRead : Bool;
    createdAt : CommonTypes.Timestamp;
  };

  public type LoyaltyTransaction = {
    id : CommonTypes.LoyaltyTxId;
    userId : CommonTypes.UserId;
    points : Nat;
    transactionType : LoyaltyTransactionType;
    description : Text;
    bookingId : ?CommonTypes.BookingId;
    createdAt : CommonTypes.Timestamp;
  };

  public type LoyaltyTransactionType = { #Earn; #Redeem };
};
