import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";
import { motion } from "motion/react";

interface FoodBadgeProps {
  mealType?: string | null;
  size?: "sm" | "md";
}

export function FoodBadge({ mealType, size = "md" }: FoodBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge
        className={`
          bg-green-100 text-green-800 border-green-200 
          dark:bg-green-950/40 dark:text-green-400 dark:border-green-800
          flex items-center gap-1
          ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}
        `}
      >
        <Utensils className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
        Free {mealType ?? "Meal"} Included
      </Badge>
    </motion.div>
  );
}

export function FreeFoodPopup({
  mealType,
  onDismiss,
}: { mealType: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 z-50 bg-card border border-green-500/30 rounded-2xl shadow-elevated p-4 max-w-xs"
      data-ocid="food_popup.dialog"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
          <Utensils className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">🎉 Free Meal Unlocked!</p>
          <p className="text-xs text-muted-foreground mt-1">
            Complimentary {mealType} is included with your booking.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-3 w-full text-xs text-primary hover:underline"
        data-ocid="food_popup.close_button"
      >
        Got it, thanks!
      </button>
    </motion.div>
  );
}
