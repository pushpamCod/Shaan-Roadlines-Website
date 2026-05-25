import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLoyaltyBalance,
  useUpdateUserProfile,
  useUserProfile,
} from "@/hooks/useBackend";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Star,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function getLoyaltyTier(pts: number): {
  tier: string;
  colorClass: string;
  bgClass: string;
} {
  if (pts >= 10000)
    return {
      tier: "Platinum",
      colorClass: "text-cyan-400",
      bgClass: "bg-cyan-100 dark:bg-cyan-950/40",
    };
  if (pts >= 5000)
    return {
      tier: "Gold",
      colorClass: "text-yellow-500",
      bgClass: "bg-yellow-100 dark:bg-yellow-950/40",
    };
  if (pts >= 2000)
    return {
      tier: "Silver",
      colorClass: "text-slate-500",
      bgClass: "bg-slate-100 dark:bg-slate-950/40",
    };
  return {
    tier: "Bronze",
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100 dark:bg-amber-950/40",
  };
}

function formatMemberSince(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { data: loyaltyBalance = BigInt(0) } = useLoyaltyBalance();
  const updateProfile = useUpdateUserProfile();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  const pts = Number(loyaltyBalance);
  const tier = getLoyaltyTier(pts);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    toast.success("Photo updated", {
      description: "Your profile photo has been updated.",
    });
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    updateProfile.mutate(form, {
      onSuccess: () => {
        toast.success("Profile updated!", {
          description: "Your information has been saved.",
        });
        setEditing(false);
      },
      onError: () =>
        toast.error("Update failed", { description: "Please try again." }),
    });
  }

  const displayName = profile?.name ?? "Traveler";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="gradient-hero h-48 relative" data-ocid="profile.banner">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, white 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 -mt-12">
        {/* Avatar + name header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-end gap-5"
          data-ocid="profile.header_card"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl border-4 border-card overflow-hidden bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="profile.upload_button"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-smooth"
              aria-label="Upload profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              data-ocid="profile.file_input"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name / tier */}
          <div className="flex-1 text-center sm:text-left">
            {isLoading ? (
              <>
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {displayName}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {profile?.email}
                </p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <Badge
                    className={`${tier.bgClass} ${tier.colorClass} border-0 font-semibold`}
                  >
                    <Star className="w-3 h-3 mr-1" /> {tier.tier}
                  </Badge>
                  {profile?.role?.toString() === "VIP" && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-0">
                      <Award className="w-3 h-3 mr-1" /> VIP
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="sm:self-start">
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                data-ocid="profile.edit_button"
                type="button"
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
                data-ocid="profile.cancel_edit_button"
                type="button"
              >
                Cancel
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
          data-ocid="profile.stats_row"
        >
          {[
            {
              icon: BookOpen,
              label: "Total Bookings",
              value: profile ? Number(profile.totalBookings).toString() : "—",
            },
            {
              icon: Star,
              label: "Loyalty Points",
              value: pts.toLocaleString(),
            },
            {
              icon: Calendar,
              label: "Member Since",
              value: profile ? formatMemberSince(profile.createdAt) : "—",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-4 text-center card-hover"
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-5 mx-auto mb-2" />
                  <Skeleton className="h-6 w-12 mx-auto mb-1" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-bold text-lg font-display">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </>
              )}
            </div>
          ))}
        </motion.div>

        {/* Edit form */}
        {editing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 mb-6"
            data-ocid="profile.edit_form"
          >
            <h2 className="font-display font-bold text-lg mb-5">
              Edit Information
            </h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-1.5 block text-muted-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={form.name}
                    placeholder="Your full name"
                    data-ocid="profile.name_input"
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1.5 block text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="email"
                    value={form.email}
                    placeholder="you@example.com"
                    data-ocid="profile.email_input"
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1.5 block text-muted-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    type="tel"
                    value={form.phone}
                    placeholder="+91 98765 43210"
                    data-ocid="profile.phone_input"
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                className="w-full gap-2 mt-2"
                onClick={handleSave}
                disabled={updateProfile.isPending}
                data-ocid="profile.save_button"
                type="button"
              >
                {updateProfile.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}

        <Separator className="my-2" />

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mt-6"
          data-ocid="profile.recent_activity"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Recent Activity</h2>
            <Link
              to="/dashboard"
              data-ocid="profile.view_all_link"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                {
                  icon: "🚌",
                  text: "Bus booking — Mumbai to Pune",
                  date: "2 days ago",
                  color: "bg-orange-100 dark:bg-orange-950/40",
                },
                {
                  icon: "✈️",
                  text: "Flight — Delhi to Bangalore",
                  date: "1 week ago",
                  color: "bg-purple-100 dark:bg-purple-950/40",
                },
                {
                  icon: "🏨",
                  text: "Hotel — The Oberoi, Mumbai",
                  date: "2 weeks ago",
                  color: "bg-emerald-100 dark:bg-emerald-950/40",
                },
              ].map((item, i) => (
                <div
                  key={item.text}
                  data-ocid={`profile.activity_item.${i + 1}`}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-smooth"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
