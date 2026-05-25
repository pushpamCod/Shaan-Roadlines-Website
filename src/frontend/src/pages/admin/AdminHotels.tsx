import type { AddHotelInput, HotelView, UpdateHotelInput } from "@/backend";
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
  useAddHotel,
  useDeleteHotel,
  useUpdateHotel,
} from "@/hooks/useBackend";
import { Hotel, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  city: "",
  address: "",
  pricePerNight: "5000",
  starRating: "4",
  totalRooms: "50",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  amenities: "",
};

export default function AdminHotels({
  hotels,
  loading,
}: { hotels: HotelView[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<HotelView | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const addHotel = useAddHotel();
  const updateHotel = useUpdateHotel();
  const deleteHotel = useDeleteHotel();

  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditHotel(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(h: HotelView) {
    setEditHotel(h);
    setForm({
      name: h.name,
      city: h.city,
      address: h.address,
      pricePerNight: String(Number(h.pricePerNight)),
      starRating: String(Number(h.starRating)),
      totalRooms: String(Number(h.totalRooms)),
      checkInTime: h.checkInTime,
      checkOutTime: h.checkOutTime,
      amenities: h.amenities.join(", "),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      if (editHotel) {
        const input: UpdateHotelInput = {
          id: editHotel.id,
          name: form.name,
          city: form.city,
          address: form.address,
          pricePerNight: BigInt(form.pricePerNight),
          starRating: BigInt(form.starRating),
          totalRooms: BigInt(form.totalRooms),
          availableRooms: editHotel.availableRooms,
          checkInTime: form.checkInTime,
          checkOutTime: form.checkOutTime,
          amenities: form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          rating: editHotel.rating,
          reviewCount: editHotel.reviewCount,
          images: editHotel.images,
        };
        await updateHotel.mutateAsync(input);
        toast.success("Hotel updated");
      } else {
        const input: AddHotelInput = {
          name: form.name,
          city: form.city,
          address: form.address,
          pricePerNight: BigInt(form.pricePerNight),
          starRating: BigInt(form.starRating),
          totalRooms: BigInt(form.totalRooms),
          checkInTime: form.checkInTime,
          checkOutTime: form.checkOutTime,
          amenities: form.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          images: [],
        };
        await addHotel.mutateAsync(input);
        toast.success("Hotel added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save hotel");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteHotel.mutateAsync(deleteId);
      toast.success("Hotel deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete hotel");
    }
  }

  const f =
    (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4" data-ocid="admin.hotels.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Hotel size={20} className="text-rose-500" />
          <h2 className="font-display font-bold text-foreground">
            Hotel Management
          </h2>
          <Badge variant="outline">{hotels.length} hotels</Badge>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search hotels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56"
            data-ocid="admin.hotels.search_input"
          />
          <Button onClick={openAdd} data-ocid="admin.hotels.add_button">
            <Plus size={16} className="mr-1" /> Add Hotel
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
                  "City",
                  "Stars",
                  "Rooms",
                  "Price/Night",
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
                    <td colSpan={7} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                    data-ocid="admin.hotels.empty_state"
                  >
                    No hotels found
                  </td>
                </tr>
              )}
              {filtered.map((h, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.hotels.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{h.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.city}</td>
                  <td className="px-4 py-3">
                    {"⭐".repeat(Number(h.starRating))}
                  </td>
                  <td className="px-4 py-3">
                    {Number(h.availableRooms)}/{Number(h.totalRooms)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{(Number(h.pricePerNight) / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{h.rating.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(h)}
                        data-ocid={`admin.hotels.edit_button.${i + 1}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(h.id)}
                        data-ocid={`admin.hotels.delete_button.${i + 1}`}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editHotel ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {(
              [
                ["name", "Hotel Name"],
                ["city", "City"],
                ["address", "Address"],
                ["pricePerNight", "Price/Night (paise)"],
                ["starRating", "Star Rating (1-5)"],
                ["totalRooms", "Total Rooms"],
                ["checkInTime", "Check-In Time"],
                ["checkOutTime", "Check-Out Time"],
              ] as [keyof typeof EMPTY_FORM, string][]
            ).map(([k, label]) => (
              <div
                key={k}
                className={
                  k === "address" || k === "amenities" ? "col-span-2" : ""
                }
              >
                <label className="text-xs text-muted-foreground mb-1 block">
                  {label}
                </label>
                <Input
                  value={form[k]}
                  onChange={f(k)}
                  placeholder={label}
                  data-ocid={`admin.hotels.form.${k}`}
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">
                Amenities (comma-separated)
              </label>
              <Input
                value={form.amenities}
                onChange={f("amenities")}
                placeholder="WiFi, Pool, Spa..."
                data-ocid="admin.hotels.form.amenities"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.hotels.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addHotel.isPending || updateHotel.isPending}
              data-ocid="admin.hotels.form.submit_button"
            >
              {addHotel.isPending || updateHotel.isPending
                ? "Saving..."
                : editHotel
                  ? "Update"
                  : "Add Hotel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Hotel</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this hotel?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.hotels.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteHotel.isPending}
              data-ocid="admin.hotels.delete.confirm_button"
            >
              {deleteHotel.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
