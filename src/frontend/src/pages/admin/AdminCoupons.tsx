import type { AddCouponInput, CouponView, UpdateCouponInput } from "@/backend";
import { CouponApplicableFor, DiscountType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from "@/hooks/useBackend";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM = {
  code: "",
  discountType: DiscountType.Percent,
  discountValue: "10",
  minBookingAmount: "0",
  maxDiscount: "500",
  expiresAt: "",
  usageLimit: "100",
  isActive: "true",
  applicableFor: CouponApplicableFor.All,
};

export default function AdminCoupons({
  coupons,
  loading,
}: { coupons: CouponView[]; loading: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState<CouponView | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const addCoupon = useAddCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  function openAdd() {
    setEditCoupon(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(c: CouponView) {
    setEditCoupon(c);
    const d = new Date(Number(c.expiresAt) / 1_000_000);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: String(Number(c.discountValue)),
      minBookingAmount: String(Number(c.minBookingAmount)),
      maxDiscount: String(Number(c.maxDiscount)),
      expiresAt: d.toISOString().slice(0, 10),
      usageLimit: String(Number(c.usageLimit)),
      isActive: String(c.isActive),
      applicableFor: c.applicableFor,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      const expiresAt = BigInt(new Date(form.expiresAt).getTime() * 1_000_000);
      if (editCoupon) {
        const input: UpdateCouponInput = {
          id: editCoupon.id,
          discountValue: BigInt(form.discountValue),
          expiresAt,
          maxDiscount: BigInt(form.maxDiscount),
          minBookingAmount: BigInt(form.minBookingAmount),
          isActive: form.isActive === "true",
          usageLimit: BigInt(form.usageLimit),
          applicableFor: form.applicableFor,
        };
        await updateCoupon.mutateAsync(input);
        toast.success("Coupon updated");
      } else {
        const input: AddCouponInput = {
          code: form.code,
          discountType: form.discountType,
          discountValue: BigInt(form.discountValue),
          expiresAt,
          maxDiscount: BigInt(form.maxDiscount),
          minBookingAmount: BigInt(form.minBookingAmount),
          usageLimit: BigInt(form.usageLimit),
          applicableFor: form.applicableFor,
        };
        await addCoupon.mutateAsync(input);
        toast.success("Coupon created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save coupon");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteCoupon.mutateAsync(deleteId);
      toast.success("Coupon deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete coupon");
    }
  }

  const f =
    (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4" data-ocid="admin.coupons.section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={20} className="text-purple-500" />
          <h2 className="font-display font-bold text-foreground">
            Coupon Management
          </h2>
          <Badge variant="outline">{coupons.length} coupons</Badge>
        </div>
        <Button onClick={openAdd} data-ocid="admin.coupons.add_button">
          <Plus size={16} className="mr-1" /> Add Coupon
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Code",
                  "Type",
                  "Value",
                  "Min Amount",
                  "Max Discount",
                  "Usage",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {!loading && coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                    data-ocid="admin.coupons.empty_state"
                  >
                    No coupons yet
                  </td>
                </tr>
              )}
              {coupons.map((c, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.coupons.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono font-bold text-primary">
                    {c.code}
                  </td>
                  <td className="px-4 py-3">{c.discountType}</td>
                  <td className="px-4 py-3 font-semibold">
                    {c.discountType === DiscountType.Percent
                      ? `${Number(c.discountValue)}%`
                      : `₹${Number(c.discountValue)}`}
                  </td>
                  <td className="px-4 py-3">
                    ₹{(Number(c.minBookingAmount) / 100).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    ₹{(Number(c.maxDiscount) / 100).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {Number(c.usedCount)}/{Number(c.usageLimit)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        c.isActive
                          ? "bg-emerald-500/15 text-emerald-600 border-0"
                          : "bg-red-500/15 text-red-600 border-0"
                      }
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(c)}
                        data-ocid={`admin.coupons.edit_button.${i + 1}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(c.id)}
                        data-ocid={`admin.coupons.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editCoupon ? "Edit Coupon" : "Add Coupon"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {!editCoupon && (
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Code
                </label>
                <Input
                  value={form.code}
                  onChange={f("code")}
                  placeholder="e.g. TRAVEL50"
                  data-ocid="admin.coupons.form.code"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Discount Type
              </label>
              <select
                value={form.discountType}
                onChange={f("discountType")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                data-ocid="admin.coupons.form.discountType"
              >
                {Object.values(DiscountType).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Value
              </label>
              <Input
                type="number"
                value={form.discountValue}
                onChange={f("discountValue")}
                data-ocid="admin.coupons.form.discountValue"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Min Booking (paise)
              </label>
              <Input
                type="number"
                value={form.minBookingAmount}
                onChange={f("minBookingAmount")}
                data-ocid="admin.coupons.form.minAmount"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Max Discount (paise)
              </label>
              <Input
                type="number"
                value={form.maxDiscount}
                onChange={f("maxDiscount")}
                data-ocid="admin.coupons.form.maxDiscount"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Expires At
              </label>
              <Input
                type="date"
                value={form.expiresAt}
                onChange={f("expiresAt")}
                data-ocid="admin.coupons.form.expiresAt"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Usage Limit
              </label>
              <Input
                type="number"
                value={form.usageLimit}
                onChange={f("usageLimit")}
                data-ocid="admin.coupons.form.usageLimit"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Applicable For
              </label>
              <select
                value={form.applicableFor}
                onChange={f("applicableFor")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                data-ocid="admin.coupons.form.applicableFor"
              >
                {Object.values(CouponApplicableFor).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Status
              </label>
              <select
                value={form.isActive}
                onChange={f("isActive")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                data-ocid="admin.coupons.form.isActive"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.coupons.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addCoupon.isPending || updateCoupon.isPending}
              data-ocid="admin.coupons.form.submit_button"
            >
              {addCoupon.isPending || updateCoupon.isPending
                ? "Saving..."
                : editCoupon
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this coupon?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.coupons.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCoupon.isPending}
              data-ocid="admin.coupons.delete.confirm_button"
            >
              {deleteCoupon.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
