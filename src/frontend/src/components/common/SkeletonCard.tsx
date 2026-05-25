import { cn } from "@/lib/utils";

function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn("rounded-lg skeleton", className)} />;
}

export function BusCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonBox className="h-5 w-40" />
          <SkeletonBox className="h-4 w-28" />
        </div>
        <SkeletonBox className="h-6 w-20" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-px flex-1" />
        <SkeletonBox className="h-4 w-16" />
        <SkeletonBox className="h-px flex-1" />
        <SkeletonBox className="h-8 w-20" />
      </div>
      <div className="flex gap-2">
        <SkeletonBox className="h-6 w-16 rounded-full" />
        <SkeletonBox className="h-6 w-12 rounded-full" />
        <SkeletonBox className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-7 w-24" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function FlightCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBox className="h-10 w-10 rounded-lg" />
        <div className="space-y-1.5">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3.5 w-24" />
        </div>
        <SkeletonBox className="ml-auto h-6 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <SkeletonBox className="h-5 w-12" />
          <SkeletonBox className="h-4 w-16" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <SkeletonBox className="h-3.5 w-16" />
          <SkeletonBox className="h-px w-full" />
          <SkeletonBox className="h-3.5 w-12" />
        </div>
        <div className="space-y-1 text-right">
          <SkeletonBox className="h-5 w-12" />
          <SkeletonBox className="h-4 w-16" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-7 w-24" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <SkeletonBox className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <SkeletonBox className="h-5 w-48" />
        <SkeletonBox className="h-4 w-36" />
        <div className="flex gap-2">
          <SkeletonBox className="h-5 w-16 rounded-full" />
          <SkeletonBox className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <SkeletonBox className="h-6 w-24" />
          <SkeletonBox className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function TrainCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonBox className="h-5 w-44" />
          <SkeletonBox className="h-4 w-28" />
        </div>
        <SkeletonBox className="h-6 w-20" />
      </div>
      <div className="flex items-center gap-3">
        <SkeletonBox className="h-8 w-16" />
        <SkeletonBox className="flex-1 h-px" />
        <SkeletonBox className="h-4 w-14" />
        <SkeletonBox className="flex-1 h-px" />
        <SkeletonBox className="h-8 w-16" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <SkeletonBox key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-7 w-24" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function GenericCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <SkeletonBox className="h-5 w-3/4" />
      <SkeletonBox className="h-4 w-1/2" />
      <SkeletonBox className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-2">
        <SkeletonBox className="h-7 w-20" />
        <SkeletonBox className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  variant?: "bus" | "flight" | "hotel" | "train" | "generic";
}

export function SkeletonList({
  count = 4,
  variant = "generic",
}: SkeletonListProps) {
  const SkeletonComp = {
    bus: BusCardSkeleton,
    flight: FlightCardSkeleton,
    hotel: HotelCardSkeleton,
    train: TrainCardSkeleton,
    generic: GenericCardSkeleton,
  }[variant];

  return (
    <div
      className={cn(
        "gap-4",
        variant === "hotel"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col",
      )}
    >
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <SkeletonComp key={n} />
      ))}
    </div>
  );
}
