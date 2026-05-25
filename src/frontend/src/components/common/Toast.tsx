import { useUIStore } from "@/store";
import type { ToastItem } from "@/types";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "border-l-4 border-green-500 bg-green-50 dark:bg-green-950/40",
  error: "border-l-4 border-red-500 bg-red-50 dark:bg-red-950/40",
  info: "border-l-4 border-primary bg-primary/5",
  warning: "border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/40",
};

const iconStyles = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-primary",
  warning: "text-yellow-500",
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const { removeToast } = useUIStore();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      className={`flex items-start gap-3 p-4 rounded-lg shadow-elevated bg-card border ${styles[toast.type]} min-w-64 max-w-80`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconStyles[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="text-muted-foreground hover:text-foreground transition-smooth shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useUIStore();

  return (
    <div
      className="fixed top-20 right-4 z-[100] flex flex-col gap-2"
      data-ocid="toast.container"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Convenience hook for dispatching toasts
export function useToast() {
  const { addToast } = useUIStore();

  return {
    success: (title: string, message?: string) =>
      addToast({ type: "success", title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: "error", title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: "info", title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: "warning", title, message }),
  };
}
