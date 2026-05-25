import { NotificationType } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendNotification } from "@/hooks/useBackend";
import { Principal } from "@icp-sdk/core/principal";
import { Bell, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SENT_LOG = [
  {
    to: "All Users",
    title: "Summer Sale Live!",
    type: NotificationType.Offer,
    time: "2 min ago",
  },
  {
    to: "xyz...abc",
    title: "Booking Confirmed #1034",
    type: NotificationType.Booking,
    time: "10 min ago",
  },
  {
    to: "All Users",
    title: "System Maintenance Tonight",
    type: NotificationType.System,
    time: "1 hour ago",
  },
  {
    to: "abc...def",
    title: "Your flight is delayed",
    type: NotificationType.Booking,
    time: "3 hours ago",
  },
];

export default function AdminNotifications() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifType, setNotifType] = useState<NotificationType>(
    NotificationType.System,
  );
  const sendNotification = useSendNotification();

  async function handleSend() {
    if (!title || !message || !userId) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const principal = Principal.fromText(userId);
      await sendNotification.mutateAsync({
        userId: principal,
        title,
        message,
        notifType,
      });
      toast.success("Notification sent successfully!");
      setUserId("");
      setTitle("");
      setMessage("");
    } catch {
      toast.error("Failed to send notification — check Principal ID");
    }
  }

  const typeColor: Record<NotificationType, string> = {
    [NotificationType.Offer]: "bg-amber-500/15 text-amber-600",
    [NotificationType.Booking]: "bg-teal-500/15 text-teal-600",
    [NotificationType.System]: "bg-blue-500/15 text-blue-600",
  };

  return (
    <div className="space-y-6" data-ocid="admin.notifications.section">
      <div className="flex items-center gap-2">
        <Bell size={20} className="text-primary" />
        <h2 className="font-display font-bold text-foreground">
          Send Notifications
        </h2>
      </div>

      {/* Send Form */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Compose Notification</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Recipient Principal ID
            </label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. aaaaa-bbbbb-ccccc-ddddd-cai"
              className="font-mono text-sm"
              data-ocid="admin.notifications.userid_input"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Notification Type
            </label>
            <select
              value={notifType}
              onChange={(e) => setNotifType(e.target.value as NotificationType)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              data-ocid="admin.notifications.type_select"
            >
              {Object.values(NotificationType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              data-ocid="admin.notifications.title_input"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification body text..."
              rows={4}
              data-ocid="admin.notifications.message_textarea"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sendNotification.isPending}
            className="w-full"
            data-ocid="admin.notifications.send_button"
          >
            <Send size={16} className="mr-2" />
            {sendNotification.isPending ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      </div>

      {/* Sent Log */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">
            Recent Sent
          </h3>
        </div>
        <div className="divide-y divide-border">
          {SENT_LOG.map((n, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3"
              data-ocid={`admin.notifications.sent.item.${i + 1}`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {n.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  To: {n.to}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${typeColor[n.type]} border-0`}>
                  {n.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
