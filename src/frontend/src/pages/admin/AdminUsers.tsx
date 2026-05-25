import type { DashboardStats } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users } from "lucide-react";
import { useState } from "react";

const DEMO_USERS = [
  {
    name: "Arjun Sharma",
    email: "arjun.sharma@email.com",
    role: "User",
    bookings: 7,
    points: 2400,
    principal: "aaaaa-zzzzz-zzzzz-11111-cai",
  },
  {
    name: "Priya Nair",
    email: "priya.nair@email.com",
    role: "VIP",
    bookings: 24,
    points: 18200,
    principal: "bbbbb-qqqqq-qqqqq-22222-cai",
  },
  {
    name: "Ravi Kumar",
    email: "ravi.kumar@email.com",
    role: "Admin",
    bookings: 3,
    points: 500,
    principal: "ccccc-hhhhh-hhhhh-33333-cai",
  },
  {
    name: "Ananya Patel",
    email: "ananya.patel@email.com",
    role: "User",
    bookings: 11,
    points: 5600,
    principal: "ddddd-eeeee-eeeee-44444-cai",
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    role: "VIP",
    bookings: 41,
    points: 32100,
    principal: "eeeee-fffff-fffff-55555-cai",
  },
  {
    name: "Kavya Reddy",
    email: "kavya.reddy@email.com",
    role: "User",
    bookings: 5,
    points: 1800,
    principal: "fffff-ggggg-ggggg-66666-cai",
  },
];

const roleColor: Record<string, string> = {
  Admin: "bg-blue-500/15 text-blue-600",
  VIP: "bg-amber-500/15 text-amber-600",
  User: "bg-muted text-muted-foreground",
};

export default function AdminUsers({
  stats,
  loading,
}: { stats: DashboardStats | null; loading: boolean }) {
  const [search, setSearch] = useState("");

  const filtered = DEMO_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4" data-ocid="admin.users.section">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-500" />
          <h2 className="font-display font-bold text-foreground">
            User Management
          </h2>
          {!loading && stats && (
            <Badge variant="outline">
              {Number(stats.totalUsers)} registered
            </Badge>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="admin.users.search_input"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {[
                  "Principal",
                  "Name",
                  "Email",
                  "Role",
                  "Bookings",
                  "Loyalty Pts",
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
                    <td colSpan={6} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                    data-ocid="admin.users.empty_state"
                  >
                    No users found
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((u, i) => (
                  <tr
                    key={i}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.users.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {u.principal.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${roleColor[u.role] ?? ""} border-0`}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right pr-6">{u.bookings}</td>
                    <td className="px-4 py-3 text-right pr-6 font-semibold text-primary">
                      {u.points.toLocaleString()}
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
