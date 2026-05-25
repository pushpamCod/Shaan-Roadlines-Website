import Map "mo:core/Map";
import Time "mo:base/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CouponTypes "../types/coupon";
import CommonTypes "../types/common";
import BookingTypes "../types/booking";
import CouponLib "../lib/coupon";
import Text "mo:core/Text";

mixin (
  accessControlState : AccessControl.AccessControlState,
  coupons : Map.Map<Text, CouponTypes.Coupon>,
  couponIdCounter : { var value : Nat },
) {
  private func seedIfEmpty() {
    if (coupons.size() == 0) {
      let seeds = CouponLib.seedCoupons();
      for (c in seeds.vals()) {
        coupons.add(c.code, c);
      };
    };
  };

  public query func validateCoupon(code : Text, bookingAmount : Nat, bookingType : BookingTypes.BookingType) : async CouponTypes.ValidateCouponResult {
    CouponLib.validate(coupons, code, bookingAmount, bookingType, Time.now());
  };

  public query ({ caller }) func getCoupons() : async [CouponTypes.CouponView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) Runtime.trap("Unauthorized");
    CouponLib.getAll(coupons);
  };

  public shared ({ caller }) func addCoupon(input : CouponTypes.AddCouponInput) : async CouponTypes.CouponView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) Runtime.trap("Unauthorized");
    seedIfEmpty();
    CouponLib.add(coupons, couponIdCounter, input);
  };

  public shared ({ caller }) func updateCoupon(input : CouponTypes.UpdateCouponInput) : async ?CouponTypes.CouponView {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) Runtime.trap("Unauthorized");
    CouponLib.update(coupons, input);
  };

  public shared ({ caller }) func deleteCoupon(id : CommonTypes.CouponId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) Runtime.trap("Unauthorized");
    CouponLib.delete(coupons, id);
  };
};
