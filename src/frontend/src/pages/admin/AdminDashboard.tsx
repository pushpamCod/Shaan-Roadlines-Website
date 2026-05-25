import type { BookingView, DashboardStats } from "@/backend";
import { BookingStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bus,
  CalendarCheck,
  Hotel,
  IndianRupee,
  Plane,
  Train,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BOOKING_TREND = [
  { month: "Jan", bookings: 142 },
  { month: "Feb", bookings: 218 },
  { month: "Mar", bookings: 310 },
  { month: "Apr", bookings: 276 },
  { month: "May", bookings: 394 },
  { month: "Jun", bookings: 451 },
];

const REVENUE_BY_TYPE = [
  { type: "Bus", revenue: 128000 },
  { type: "Train", revenue: 94000 },
  { type: "Flight", revenue: 342000 },
  { type: "Hotel", revenue: 208000 },
];

const STATUS_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-24 mt-1" />
        ) : (
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function statusLabel(s: BookingStatus) {
  if (s === BookingStatus.Confirmed)
    return (
      <Badge className="bg-emerald-500/15 text-emerald-600 border-0">
        Confirmed
      </Badge>
    );
  if (s === BookingStatus.Pending)
    return (
      <Badge className="bg-amber-500/15 text-amber-600 border-0">Pending</Badge>
    );
  if (s === BookingStatus.Cancelled)
    return (
      <Badge className="bg-red-500/15 text-red-600 border-0">Cancelled</Badge>
    );
  return (
    <Badge className="bg-primary/15 text-primary border-0">Completed</Badge>
  );
}

export default function AdminDashboard({
  stats,
  bookings,
  loading,
}: {
  stats: DashboardStats | null;
  bookings: BookingView[];
  loading: boolean;
}) {
  const pieData = stats
    ? [
        { name: "Confirmed", value: Number(stats.confirmedBookings) },
        { name: "Pending", value: Number(stats.pendingBookings) },
        { name: "Cancelled", value: Number(stats.cancelledBookings) },
      ]
    : [];

  const recent = bookings.slice(0, 10);

  return (
    <div className="space-y-6" data-ocid="admin.dashboard.section">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats ? Number(stats.totalUsers).toLocaleString() : "—"}
          color="bg-blue-500"
          loading={loading}
        />
        <StatCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={stats ? Number(stats.totalBookings).toLocaleString() : "—"}
          color="bg-teal-500"
          loading={loading}
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={
            stats
              ? `₹${(Number(stats.totalRevenue) / 100).toLocaleString("en-IN")}`
              : "—"
          }
          color="bg-emerald-600"
          loading={loading}
        />
        <StatCard
          icon={Bus}
          label="Active Buses"
          value={stats ? Number(stats.activeBuses).toString() : "—"}
          color="bg-amber-500"
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Train}
          label="Active Trains"
          value={stats ? Number(stats.activeTrains).toString() : "—"}
          color="bg-purple-500"
          loading={loading}
        />
        <StatCard
          icon={Plane}
          label="Active Flights"
          value={stats ? Number(stats.activeFlights).toString() : "—"}
          color="bg-sky-500"
          loading={loading}
        />
        <StatCard
          icon={Hotel}
          label="Active Hotels"
          value={stats ? Number(stats.activeHotels).toString() : "—"}
          color="bg-rose-500"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Pending Bookings"
          value={stats ? Number(stats.pendingBookings).toString() : "—"}
          color="bg-orange-500"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Bookings Trend (6
            months)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BOOKING_TREND}>
              <defs>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "currentColor" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "currentColor" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#0ea5e9"
                fill="url(#bookGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">
            Booking Status
          </h3>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue by Type */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">
          Revenue by Booking Type
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={REVENUE_BY_TYPE}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="type"
              tick={{ fontSize: 12, fill: "currentColor" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bookings */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">
            Recent Bookings
          </h3>
        </div>
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
                  "Date",
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
              {recent.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No bookings yet
                  </td>
                </tr>
              )}
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {recent.map((b, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.booking.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{Number(b.id)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{b.bookingType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {b.fromLocation} → {b.toLocation}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    ₹{(Number(b.totalAmount) / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{statusLabel(b.status)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.travelDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
