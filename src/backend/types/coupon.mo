import CommonTypes "common";

module {
  public type DiscountType = { #Percent; #Fixed };

  public type CouponApplicableFor = { #All; #Bus; #Train; #Flight; #Hotel };

  public type Coupon = {
    id : CommonTypes.CouponId;
    code : Text;
    discountType : DiscountType;
    discountValue : Nat;
    minBookingAmount : Nat;
    maxDiscount : Nat;
    expiresAt : CommonTypes.Timestamp;
    usageLimit : Nat;
    var usedCount : Nat;
    var isActive : Bool;
    applicableFor : CouponApplicableFor;
  };

  public type CouponView = {
    id : CommonTypes.CouponId;
    code : Text;
    discountType : DiscountType;
    discountValue : Nat;
    minBookingAmount : Nat;
    maxDiscount : Nat;
    expiresAt : CommonTypes.Timestamp;
    usageLimit : Nat;
    usedCount : Nat;
    isActive : Bool;
    applicableFor : CouponApplicableFor;
  };

  public type AddCouponInput = {
    code : Text;
    discountType : DiscountType;
    discountValue : Nat;
    minBookingAmount : Nat;
    maxDiscount : Nat;
    expiresAt : CommonTypes.Timestamp;
    usageLimit : Nat;
    applicableFor : CouponApplicableFor;
  };

  public type UpdateCouponInput = {
    id : CommonTypes.CouponId;
    discountValue : Nat;
    minBookingAmount : Nat;
    maxDiscount : Nat;
    expiresAt : CommonTypes.Timestamp;
    usageLimit : Nat;
    isActive : Bool;
    applicableFor : CouponApplicableFor;
  };

  public type ValidateCouponResult = {
    valid : Bool;
    discountAmount : Nat;
    message : Text;
  };
};
