import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  Bell,
  Bus,
  ChevronDown,
  Hotel,
  Info,
  LogOut,
  Menu,
  Moon,
  Plane,
  Sparkles,
  Sun,
  TrainFront,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { href: "/bus", label: "Bus", icon: Bus },
  { href: "/train", label: "Trains", icon: TrainFront },
  { href: "/flight", label: "Flights", icon: Plane },
  { href: "/hotel", label: "Hotels", icon: Hotel },
  { href: "/about-founder", label: "About", icon: Info },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { isAuthenticated, login, logout, user } = useAuth();
  const { data: notifications } = useNotifications();

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        scrolled
          ? "glass-dark border-b border-white/10 shadow-elevated"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-xl"
            data-ocid="navbar.logo"
          >
            <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-gradient">Shaan Roadlines</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                data-ocid={`navbar.${label.toLowerCase()}_link`}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                  isActive(href)
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              data-ocid="navbar.theme_toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" data-ocid="navbar.notifications_button">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden md:flex"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="navbar.user_menu"
                      className="hidden md:flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="max-w-24 truncate">
                        {user?.name ?? "Account"}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" data-ocid="navbar.dashboard_link">
                        <User className="w-4 h-4 mr-2" /> My Bookings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" data-ocid="navbar.profile_link">
                        <Sparkles className="w-4 h-4 mr-2" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" data-ocid="navbar.admin_link">
                        <Sparkles className="w-4 h-4 mr-2" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      data-ocid="navbar.logout_button"
                      className="text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                size="sm"
                onClick={login}
                data-ocid="navbar.login_button"
                className="hidden md:flex gradient-teal text-white border-0"
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-ocid="navbar.mobile_menu"
                  className="md:hidden"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card">
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 font-display font-bold text-xl mb-4"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
                      <Plane className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gradient">Shaan Roadlines</span>
                  </Link>

                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth",
                        isActive(href)
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}

                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-muted-foreground">
                      Dark Mode
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="px-4 mt-2">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Button variant="outline" className="w-full mb-2">
                            My Bookings
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full text-destructive"
                          onClick={() => {
                            logout();
                            setMobileOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full gradient-teal text-white border-0"
                        onClick={() => {
                          login();
                          setMobileOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}