import Map "mo:core/Map";
import List "mo:core/List";
import CouponTypes "../types/coupon";
import CommonTypes "../types/common";
import BookingTypes "../types/booking";
import Text "mo:core/Text";

module {
  public func validate(
    coupons : Map.Map<Text, CouponTypes.Coupon>,
    code : Text,
    bookingAmount : Nat,
    bookingType : BookingTypes.BookingType,
    now : CommonTypes.Timestamp,
  ) : CouponTypes.ValidateCouponResult {
    // Find coupon by code
    var found : ?CouponTypes.Coupon = null;
    for ((_, c) in coupons.entries()) {
      if (c.code == code) { found := ?c };
    };
    switch (found) {
      case null { { valid = false; discountAmount = 0; message = "Invalid coupon code" } };
      case (?coupon) {
        if (not coupon.isActive) {
          return { valid = false; discountAmount = 0; message = "Coupon is inactive" };
        };
        if (now > coupon.expiresAt) {
          return { valid = false; discountAmount = 0; message = "Coupon has expired" };
        };
        if (coupon.usedCount >= coupon.usageLimit) {
          return { valid = false; discountAmount = 0; message = "Coupon usage limit reached" };
        };
        if (bookingAmount < coupon.minBookingAmount) {
          return { valid = false; discountAmount = 0; message = "Minimum booking amount not met" };
        };
        // Check applicableFor
        let applicable = switch (coupon.applicableFor) {
          case (#All) true;
          case (#Bus) bookingType == #Bus;
          case (#Train) bookingType == #Train;
          case (#Flight) bookingType == #Flight;
          case (#Hotel) bookingType == #Hotel;
        };
        if (not applicable) {
          return { valid = false; discountAmount = 0; message = "Coupon not applicable for this booking type" };
        };
        // Compute discount
        let disc = switch (coupon.discountType) {
          case (#Percent) {
            var d = bookingAmount * coupon.discountValue / 100;
            if (coupon.maxDiscount > 0 and d > coupon.maxDiscount) { d := coupon.maxDiscount };
            d;
          };
          case (#Fixed) {
            var d = coupon.discountValue;
            if (coupon.maxDiscount > 0 and d > coupon.maxDiscount) { d := coupon.maxDiscount };
            d;
          };
        };
        { valid = true; discountAmount = disc; message = "Coupon applied successfully" };
      };
    };
  };

  public func getAll(
    coupons : Map.Map<Text, CouponTypes.Coupon>
  ) : [CouponTypes.CouponView] {
    let buf = List.empty<CouponTypes.CouponView>();
    for ((_, c) in coupons.entries()) { buf.add(toView(c)) };
    buf.toArray();
  };

  public func add(
    coupons : Map.Map<Text, CouponTypes.Coupon>,
    idCounter : { var value : Nat },
    input : CouponTypes.AddCouponInput,
  ) : CouponTypes.CouponView {
    idCounter.value += 1;
    let coupon : CouponTypes.Coupon = {
      id = idCounter.value;
      code = input.code;
      discountType = input.discountType;
      discountValue = input.discountValue;
      minBookingAmount = input.minBookingAmount;
      maxDiscount = input.maxDiscount;
      expiresAt = input.expiresAt;
      usageLimit = input.usageLimit;
      var usedCount = 0;
      var isActive = true;
      applicableFor = input.applicableFor;
    };
    coupons.add(input.code, coupon);
    toView(coupon);
  };

  public func update(
    coupons : Map.Map<Text, CouponTypes.Coupon>,
    input : CouponTypes.UpdateCouponInput,
  ) : ?CouponTypes.CouponView {
    var found : ?CouponTypes.Coupon = null;
    for ((_, c) in coupons.entries()) {
      if (c.id == input.id) { found := ?c };
    };
    switch (found) {
      case null null;
      case (?c) {
        c.isActive := input.isActive;
        // usageLimit is immutable — only mutable fields can be patched
        ?toView(c);
      };
    };
  };

  public func delete(
    coupons : Map.Map<Text, CouponTypes.Coupon>,
    id : CommonTypes.CouponId,
  ) : Bool {
    var foundCode : ?Text = null;
    for ((k, c) in coupons.entries()) {
      if (c.id == id) { foundCode := ?k };
    };
    switch (foundCode) {
      case null false;
      case (?k) { coupons.remove(k); true };
    };
  };

  public func toView(coupon : CouponTypes.Coupon) : CouponTypes.CouponView {
    {
      id = coupon.id;
      code = coupon.code;
      discountType = coupon.discountType;
      discountValue = coupon.discountValue;
      minBookingAmount = coupon.minBookingAmount;
      maxDiscount = coupon.maxDiscount;
      expiresAt = coupon.expiresAt;
      usageLimit = coupon.usageLimit;
      usedCount = coupon.usedCount;
      isActive = coupon.isActive;
      applicableFor = coupon.applicableFor;
    };
  };

  public func seedCoupons() : [CouponTypes.Coupon] {
    [
      { id = 1; code = "FIRST10"; discountType = #Percent; discountValue = 10; minBookingAmount = 500; maxDiscount = 200; expiresAt = 9999999999999; usageLimit = 1000; var usedCount = 0; var isActive = true; applicableFor = #All },
      { id = 2; code = "TRAVEL500"; discountType = #Fixed; discountValue = 500; minBookingAmount = 2000; maxDiscount = 500; expiresAt = 9999999999999; usageLimit = 500; var usedCount = 0; var isActive = true; applicableFor = #Bus },
      { id = 3; code = "PREMIUM20"; discountType = #Percent; discountValue = 20; minBookingAmount = 5000; maxDiscount = 3000; expiresAt = 9999999999999; usageLimit = 200; var usedCount = 0; var isActive = true; applicableFor = #All },
    ];
  };
};
