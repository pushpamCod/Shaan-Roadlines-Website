import type { AddTrainInput, TrainView } from "@/backend";
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
import { useAddTrain, useDeleteTrain } from "@/hooks/useBackend";
import { Pencil, Plus, Train, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM = {
  name: "",
  trainNumber: "",
  from: "",
  to: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
};

export default function AdminTrains({
  trains,
  loading,
}: { trains: TrainView[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const addTrain = useAddTrain();
  const deleteTrain = useDeleteTrain();

  const filtered = trains.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.trainNumber.includes(search),
  );

  async function handleSave() {
    try {
      const input: AddTrainInput = {
        name: form.name,
        trainNumber: form.trainNumber,
        from: form.from,
        to: form.to,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        duration: form.duration,
        classes: [
          { className: "Sleeper", fare: BigInt(50000), available: BigInt(80) },
        ],
        route: [],
      };
      await addTrain.mutateAsync(input);
      toast.success("Train added");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to add train");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteTrain.mutateAsync(deleteId);
      toast.success("Train deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete train");
    }
  }

  const f =
    (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-4" data-ocid="admin.trains.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-purple-500">
            <Train size={18} />
          </span>
          <h2 className="font-display font-bold text-foreground">
            Train Management
          </h2>
          <Badge variant="outline">{trains.length} trains</Badge>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search trains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56"
            data-ocid="admin.trains.search_input"
          />
          <Button
            onClick={() => {
              setForm(EMPTY_FORM);
              setDialogOpen(true);
            }}
            data-ocid="admin.trains.add_button"
          >
            <Plus size={16} className="mr-1" /> Add Train
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
                  "Train No.",
                  "Route",
                  "Departure",
                  "Arrival",
                  "Duration",
                  "Classes",
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
                    data-ocid="admin.trains.empty_state"
                  >
                    No trains found
                  </td>
                </tr>
              )}
              {filtered.map((t, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.trains.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {t.trainNumber}
                  </td>
                  <td className="px-4 py-3">
                    {t.from} → {t.to}
                  </td>
                  <td className="px-4 py-3">{t.departureTime}</td>
                  <td className="px-4 py-3">{t.arrivalTime}</td>
                  <td className="px-4 py-3">{t.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {t.classes.map((c) => (
                        <Badge
                          key={c.className}
                          variant="outline"
                          className="text-xs"
                        >
                          {c.className}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(t.id)}
                      data-ocid={`admin.trains.delete_button.${i + 1}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Train</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {(
              [
                ["name", "Train Name"],
                ["trainNumber", "Train Number"],
                ["from", "From Station"],
                ["to", "To Station"],
                ["departureTime", "Departure"],
                ["arrivalTime", "Arrival"],
                ["duration", "Duration"],
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
                  data-ocid={`admin.trains.form.${k}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.trains.form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addTrain.isPending}
              data-ocid="admin.trains.form.submit_button"
            >
              {addTrain.isPending ? "Adding..." : "Add Train"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Train</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this train?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="admin.trains.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTrain.isPending}
              data-ocid="admin.trains.delete.confirm_button"
            >
              {deleteTrain.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
