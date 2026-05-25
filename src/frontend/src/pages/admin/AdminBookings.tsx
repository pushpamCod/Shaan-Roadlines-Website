import type { BookingView } from "@/backend";
import { BookingStatus, BookingType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateBookingStatus } from "@/hooks/useBackend";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_FILTERS = ["All", "Bus", "Train", "Flight", "Hotel"];
const PAGE_SIZE = 10;

function statusBadge(s: BookingStatus) {
  const map: Record<string, string> = {
    [BookingStatus.Confirmed]: "bg-emerald-500/15 text-emerald-600",
    [BookingStatus.Pending]: "bg-amber-500/15 text-amber-600",
    [BookingStatus.Cancelled]: "bg-red-500/15 text-red-600",
    [BookingStatus.Completed]: "bg-blue-500/15 text-blue-600",
  };
  return <Badge className={`${map[s] ?? ""} border-0`}>{s}</Badge>;
}

export default function AdminBookings({
  bookings,
  loading,
}: { bookings: BookingView[]; loading: boolean }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const updateStatus = useUpdateBookingStatus();

  const filtered = bookings.filter((b) => {
    if (typeFilter !== "All" && b.bookingType !== typeFilter) return false;
    if (
      search &&
      !String(Number(b.id)).includes(search) &&
      !b.fromLocation.toLowerCase().includes(search.toLowerCase()) &&
      !b.toLocation.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleStatusChange(id: bigint, status: BookingStatus) {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Booking status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="space-y-4" data-ocid="admin.bookings.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck size={20} className="text-teal-500" />
          <h2 className="font-display font-bold text-foreground">
            Booking Management
          </h2>
          <Badge variant="outline">{bookings.length} total</Badge>
        </div>
        <Input
          placeholder="Search booking ID or route..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-60"
          data-ocid="admin.bookings.search_input"
        />
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={typeFilter === f ? "default" : "outline"}
            onClick={() => {
              setTypeFilter(f);
              setPage(1);
            }}
            data-ocid={`admin.bookings.filter.${f.toLowerCase()}`}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Booking ID",
                  "Type",
                  "Route",
                  "Amount",
                  "Status",
                  "Payment",
                  "Date",
                  "Update",
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {!loading && paged.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                    data-ocid="admin.bookings.empty_state"
                  >
                    No bookings found
                  </td>
                </tr>
              )}
              {paged.map((b, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.bookings.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{Number(b.id)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{b.bookingType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-foreground max-w-32 truncate">
                    {b.fromLocation} → {b.toLocation}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{(Number(b.totalAmount) / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{statusBadge(b.status)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{b.paymentStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {b.travelDate}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={b.status}
                      onChange={(e) =>
                        handleStatusChange(
                          b.id,
                          e.target.value as BookingStatus,
                        )
                      }
                      className="h-8 rounded border border-input bg-background px-2 text-xs"
                      data-ocid={`admin.bookings.status_select.${i + 1}`}
                    >
                      {Object.values(BookingStatus).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
            {Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              data-ocid="admin.bookings.pagination_prev"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="admin.bookings.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
