import { Button } from "@/components/ui/button";
import {
  useAdminCheck,
  useAdminStats,
  useAllBookings,
  useBuses,
  useCoupons,
  useFlights,
  useHotels,
  useTrains,
} from "@/hooks/useBackend";
import {
  Bell,
  Bus,
  CalendarCheck,
  Home,
  Hotel,
  LayoutDashboard,
  Menu,
  Plane,
  ShieldAlert,
  Tag,
  Train,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminBookings from "./admin/AdminBookings";
import AdminBuses from "./admin/AdminBuses";
import AdminCoupons from "./admin/AdminCoupons";
import AdminDashboard from "./admin/AdminDashboard";
import AdminFlights from "./admin/AdminFlights";
import AdminHotels from "./admin/AdminHotels";
import AdminNotifications from "./admin/AdminNotifications";
import AdminTrains from "./admin/AdminTrains";
import AdminUsers from "./admin/AdminUsers";

type Section =
  | "dashboard"
  | "users"
  | "buses"
  | "trains"
  | "flights"
  | "hotels"
  | "bookings"
  | "coupons"
  | "notifications";

const NAV_ITEMS: {
  id: Section;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "text-primary",
  },
  { id: "users", label: "Users", icon: Users, color: "text-blue-500" },
  { id: "buses", label: "Buses", icon: Bus, color: "text-amber-500" },
  { id: "trains", label: "Trains", icon: Train, color: "text-purple-500" },
  { id: "flights", label: "Flights", icon: Plane, color: "text-sky-500" },
  { id: "hotels", label: "Hotels", icon: Hotel, color: "text-rose-500" },
  {
    id: "bookings",
    label: "Bookings",
    icon: CalendarCheck,
    color: "text-teal-500",
  },
  { id: "coupons", label: "Coupons", icon: Tag, color: "text-purple-500" },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    color: "text-orange-500",
  },
];

export default function AdminPage() {
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminCheck = useAdminCheck();
  const statsQuery = useAdminStats();
  const bookingsQuery = useAllBookings();
  const busesQuery = useBuses();
  const trainsQuery = useTrains();
  const flightsQuery = useFlights();
  const hotelsQuery = useHotels();
  const couponsQuery = useCoupons();

  // Access denied guard
  if (!adminCheck.isLoading && adminCheck.data === false) {
    return (
      <main
        className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4"
        data-ocid="admin.access_denied"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
          <ShieldAlert size={32} className="text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel.
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" data-ocid="admin.access_denied.home_link">
            <Home size={16} className="mr-2" /> Go to Homepage
          </Button>
        </Link>
      </main>
    );
  }

  function navigate(id: Section) {
    setSection(id);
    setSidebarOpen(false);
  }

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-3">
      <div className="px-3 py-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-display font-bold text-foreground">
              Admin Panel
            </p>
            <p className="text-xs text-muted-foreground">Shaan Roadlines</p>
          </div>
        </div>
      </div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => navigate(item.id)}
          data-ocid={`admin.sidebar.${item.id}`}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
            ${
              section === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
        >
          <item.icon
            size={18}
            className={section === item.id ? "text-primary" : item.color}
          />
          {item.label}
        </button>
      ))}
    </nav>
  );

  const currentNav = NAV_ITEMS.find((n) => n.id === section)!;

  return (
    <div className="min-h-screen bg-background flex" data-ocid="admin.page">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-card border-r border-border min-h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 w-full cursor-default"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-card border-r border-border">
            <div className="flex items-center justify-end p-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSidebarOpen(false)}
                data-ocid="admin.sidebar.close_button"
              >
                <X size={18} />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border px-4 lg:px-6 py-3 flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            data-ocid="admin.topbar.menu_button"
          >
            <Menu size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <currentNav.icon size={18} className={currentNav.color} />
            <h1 className="font-display font-bold text-foreground">
              {currentNav.label}
            </h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {section === "dashboard" && (
            <AdminDashboard
              stats={statsQuery.data ?? null}
              bookings={bookingsQuery.data ?? []}
              loading={statsQuery.isLoading}
            />
          )}
          {section === "users" && (
            <AdminUsers
              stats={statsQuery.data ?? null}
              loading={statsQuery.isLoading}
            />
          )}
          {section === "buses" && (
            <AdminBuses
              buses={busesQuery.data ?? []}
              loading={busesQuery.isLoading}
            />
          )}
          {section === "trains" && (
            <AdminTrains
              trains={trainsQuery.data ?? []}
              loading={trainsQuery.isLoading}
            />
          )}
          {section === "flights" && (
            <AdminFlights
              flights={flightsQuery.data ?? []}
              loading={flightsQuery.isLoading}
            />
          )}
          {section === "hotels" && (
            <AdminHotels
              hotels={hotelsQuery.data ?? []}
              loading={hotelsQuery.isLoading}
            />
          )}
          {section === "bookings" && (
            <AdminBookings
              bookings={bookingsQuery.data ?? []}
              loading={bookingsQuery.isLoading}
            />
          )}
          {section === "coupons" && (
            <AdminCoupons
              coupons={couponsQuery.data ?? []}
              loading={couponsQuery.isLoading}
            />
          )}
          {section === "notifications" && <AdminNotifications />}
        </div>
      </main>
    </div>
  );
}
