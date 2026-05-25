import type { AddFlightInput, FlightView, UpdateFlightInput } from "@/backend";
import { CabinClass } from "@/backend";
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
  useAddFlight,
  useDeleteFlight,
  useUpdateFlight,
} from "@/hooks/useBackend";
import { Pencil, Plane, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM = {
  airline: "",
  flightNumber: "",
  from: "",
  to: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
  cabin: CabinClass.Economy,
  stops: "0",
  availableSeats: "150",
  price: "500000",
  baggage: "15kg",
};

export default function AdminFlights({
  flights,
  loading,
}: { flights: FlightView[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFlight, setEditFlight] = useState<FlightView | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const addFlight = useAddFlight();
  const updateFlight = useUpdateFlight();
  const deleteFlight = useDeleteFlight();

  const filtered = flights.filter(
    (f) =>
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      f.flightNumber.toLowerCase().includes(search.toLowerCase()),
  );

  function openAdd() {
    setEditFlight(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }
  function openEdit(fl: FlightView) {
    setEditFlight(fl);
    setForm({
      airline: fl.airline,
      flightNumber: fl.flightNumber,
      from: fl.from,
      to: fl.to,
      departureTime: fl.departureTime,
      arrivalTime: fl.arrivalTime,
      duration: fl.duration,
      cabin: fl.cabin,
      stops: String(Number(fl.stops)),
      availableSeats: String(Number(fl.availableSeats)),
      price: String(Number(fl.price)),
      baggage: fl.baggage,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    try {
      if (editFlight) {
        const input: UpdateFlightInput = {
          id: editFlight.id,
          airline: form.airline,
          flightNumber: form.flightNumber,
          from: form.from,
          to: form.to,
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
          duration: form.duration,
          cabin: form.cabin,
          stops: BigInt(form.stops),
          availableSeats: BigInt(form.availableSeats),
          price: BigInt(form.price),
          baggage: form.baggage,
        };
        await updateFlight.mutateAsync(input);
        toast.success("Flight updated");
      } else {
        const input: AddFlightInput = {
          airline: form.airline,
          flightNumber: form.flightNumber,
          from: form.from,
          to: form.to,
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
          duration: form.duration,
          cabin: form.cabin,
          stops: BigInt(form.stops),
          availableSeats: BigInt(form.availableSeats),
          price: BigInt(form.price),
          baggage: form.baggage,
        };
        await addFlight.mutateAsync(input);
        toast.success("Flight added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save flight");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteFlight.mutateAsync(deleteId);
      toast.success("Flight deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete flight");
    }
  }

  const f =
    (k: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4" data-ocid="admin.flights.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane size={20} className="text-sky-500" />
          <h2 className="font-display font-bold text-foreground">
            Flight Management
          </h2>
          <Badge variant="outline">{flights.length} flights</Badge>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search flights..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56"
            data-ocid="admin.flights.search_input"
          />
          <Button onClick={openAdd} data-ocid="admin.flights.add_button">
            <Plus size={16} className="mr-1" /> Add Flight
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Airline",
                  "Flight No.",
                  "Route",
                  "Cabin",
                  "Stops",
                  "Seats",
                  "Price",
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
                    data-ocid="admin.flights.empty_state"
                  >
                    No flights found
                  </td>
                </tr>
              )}
              {filtered.map((fl, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.flights.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{fl.airline}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {fl.flightNumber}
                  </td>
                  <td className="px-4 py-3">
                    {fl.from} → {fl.to}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{fl.cabin}</Badge>
                  </td>
                  <td className="px-4 py-3">{Number(fl.stops)}</td>
                  <td className="px-4 py-3">{Number(fl.availableSeats)}</td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{(Number(fl.price) / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(fl)}
                        data-ocid={`admin.flights.edit_button.${i + 1}`}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(fl.id)}
                        data-ocid={`admin.flights.delete_button.${i + 1}`}
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editFlight ? "Edit Flight" : "Add Flight"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {(
              [
                ["airline", "Airline"],
                ["flightNumber", "Flight Number"],
                ["from", "From"],
                ["to", "To"],
                ["departureTime", "Departure"],
                ["arrivalTime", "Arrival"],
                ["duration", "Duration"],
                ["stops", "Stops"],
                ["availableSeats", "Available Seats"],
                ["price", "Price (paise)"],
                ["baggage", "Baggage"],
              ] as [keyof typeof EMPTY_FORM, string][]
            ).map(([k, label]) => (
              <div key={k}>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {label}
                </label>
                <Input
                  value={form[k]}
                  onChange={f(k)}
                  placeholder={label}
                  data-ocid={`admin.flights.form.${k}`}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Cabin Class
              </label>
              <select
                value={form.cabin}
                onChange={f("cabin")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                data-ocid="admin.flights.form.cabin"
              >
                {Object.values(CabinClass).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.flights.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addFlight.isPending || updateFlight.isPending}
              data-ocid="admin.flights.form.submit_button"
            >
              {addFlight.isPending || updateFlight.isPending
                ? "Saving..."
                : editFlight
                  ? "Update"
                  : "Add Flight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Flight</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this flight?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.flights.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteFlight.isPending}
              data-ocid="admin.flights.delete.confirm_button"
            >
              {deleteFlight.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
