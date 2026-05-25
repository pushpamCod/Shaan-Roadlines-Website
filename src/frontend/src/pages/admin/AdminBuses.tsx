import type { AddBusInput, BusView, UpdateBusInput } from "@/backend";
import { BusType } from "@/backend";
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
import { useAddBus, useDeleteBus, useUpdateBus } from "@/hooks/useBackend";
import { Bus, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  operatorName: "",
  from: "",
  to: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
  busType: BusType.AC_Seater,
  totalSeats: "40",
  price: "100",
  rating: "4.2",
  amenities: "",
  cancellationPolicy: "",
  boardingPoints: "",
  droppingPoints: "",
};

export default function AdminBuses({
  buses,
  loading,
}: { buses: BusView[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBus, setEditBus] = useState<BusView | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const addBus = useAddBus();
  const updateBus = useUpdateBus();
  const deleteBus = useDeleteBus();

  const filtered = buses.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.operatorName.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditBus(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(b: BusView) {
    setEditBus(b);
    setForm({
      name: b.name,
      operatorName: b.operatorName,
      from: b.from,
      to: b.to,
      departureTime: b.departureTime,
      arrivalTime: b.arrivalTime,
      duration: b.duration,
      busType: b.busType,
      totalSeats: String(Number(b.totalSeats)),
      price: String(Number(b.price)),
      rating: String(b.rating),
      amenities: b.amenities.join(", "),
      cancellationPolicy: b.cancellationPolicy,
      boardingPoints: b.boardingPoints.join(", "),
      droppingPoints: b.droppingPoints.join(", "),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      if (editBus) {
        const input: UpdateBusInput = {
          id: editBus.id,
          name: form.name,
          operatorName: form.operatorName,
          from: form.from,
          to: form.to,
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
          duration: form.duration,
          busType: form.busType,
          totalSeats: BigInt(form.totalSeats),
          availableSeats: editBus.availableSeats,
          price: BigInt(form.price),
          rating: Number(form.rating),
          amenities: form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          cancellationPolicy: form.cancellationPolicy,
          boardingPoints: form.boardingPoints
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          droppingPoints: form.droppingPoints
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
        await updateBus.mutateAsync(input);
        toast.success("Bus updated successfully");
      } else {
        const input: AddBusInput = {
          name: form.name,
          operatorName: form.operatorName,
          from: form.from,
          to: form.to,
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
          duration: form.duration,
          busType: form.busType,
          totalSeats: BigInt(form.totalSeats),
          price: BigInt(form.price),
          amenities: form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          cancellationPolicy: form.cancellationPolicy,
          boardingPoints: form.boardingPoints
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          droppingPoints: form.droppingPoints
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
        await addBus.mutateAsync(input);
        toast.success("Bus added successfully");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save bus");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteBus.mutateAsync(deleteId);
      toast.success("Bus deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete bus");
    }
  }

  const f =
    (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4" data-ocid="admin.buses.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus size={20} className="text-amber-500" />
          <h2 className="font-display font-bold text-foreground">
            Bus Management
          </h2>
          <Badge variant="outline">{buses.length} buses</Badge>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search buses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56"
            data-ocid="admin.buses.search_input"
          />
          <Button onClick={openAdd} data-ocid="admin.buses.add_button">
            <Plus size={16} className="mr-1" /> Add Bus
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Name",
                  "Operator",
                  "Route",
                  "Type",
                  "Seats",
                  "Price",
                  "Rating",
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
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                    data-ocid="admin.buses.empty_state"
                  >
                    No buses found
                  </td>
                </tr>
              )}
              {filtered.map((b, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.buses.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {b.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.operatorName}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {b.from} → {b.to}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {b.busType.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {Number(b.availableSeats)}/{Number(b.totalSeats)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{Number(b.price)}
                  </td>
                  <td className="px-4 py-3">⭐ {b.rating.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(b)}
                        data-ocid={`admin.buses.edit_button.${i + 1}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(b.id)}
                        data-ocid={`admin.buses.delete_button.${i + 1}`}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editBus ? "Edit Bus" : "Add New Bus"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {(
              [
                ["name", "Bus Name"],
                ["operatorName", "Operator"],
                ["from", "From City"],
                ["to", "To City"],
                ["departureTime", "Departure (HH:MM)"],
                ["arrivalTime", "Arrival (HH:MM)"],
                ["duration", "Duration"],
                ["totalSeats", "Total Seats"],
                ["price", "Price (paise)"],
                ["rating", "Rating (0-5)"],
                ["amenities", "Amenities (comma-sep)"],
                ["cancellationPolicy", "Cancellation Policy"],
                ["boardingPoints", "Boarding Points"],
                ["droppingPoints", "Dropping Points"],
              ] as [keyof typeof EMPTY_FORM, string][]
            ).map(([k, label]) => (
              <div
                key={k}
                className={
                  k === "cancellationPolicy" ||
                  k === "amenities" ||
                  k === "boardingPoints" ||
                  k === "droppingPoints"
                    ? "col-span-2"
                    : ""
                }
              >
                <label className="text-xs text-muted-foreground mb-1 block">
                  {label}
                </label>
                <Input
                  value={form[k]}
                  onChange={f(k)}
                  placeholder={label}
                  data-ocid={`admin.buses.form.${k}`}
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">
                Bus Type
              </label>
              <select
                value={form.busType}
                onChange={f("busType")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                data-ocid="admin.buses.form.busType"
              >
                {Object.values(BusType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.buses.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addBus.isPending || updateBus.isPending}
              data-ocid="admin.buses.form.submit_button"
            >
              {addBus.isPending || updateBus.isPending
                ? "Saving..."
                : editBus
                  ? "Update"
                  : "Add Bus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bus</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this bus? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.buses.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteBus.isPending}
              data-ocid="admin.buses.delete.confirm_button"
            >
              {deleteBus.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
