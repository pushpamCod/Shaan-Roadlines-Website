import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrains } from "@/hooks/useBackend";
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Clock,
  Filter,
  Star,
  Train,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const DEPARTURE_FILTERS = [
  { label: "Any Time", value: "any" },
  { label: "Early Morning (00–06)", value: "early" },
  { label: "Morning (06–12)", value: "morning" },
  { label: "Afternoon (12–18)", value: "afternoon" },
  { label: "Night (18–24)", value: "night" },
];

function getHour(time: string): number {
  const [h] = time.split(":").map(Number);
  return h;
}

function filterByDeparture(time: string, filter: string): boolean {
  const h = getHour(time);
  if (filter === "early") return h < 6;
  if (filter === "morning") return h >= 6 && h < 12;
  if (filter === "afternoon") return h >= 12 && h < 18;
  if (filter === "night") return h >= 18;
  return true;
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          <div className="skeleton h-5 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export default function TrainResultsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const date = params.get("date") ?? "";
  const paramClass = params.get("class") ?? "";
  const passengers = Number(params.get("passengers") ?? 1);

  const [filterClass, setFilterClass] = useState(paramClass || "any");
  const [filterDepart, setFilterDepart] = useState("any");
  const [sort, setSort] = useState("departure");
  const [selectedClassMap, setSelectedClassMap] = useState<
    Record<string, string>
  >({});

  const { data: trains, isLoading } = useTrains(
    from,
    to,
    date,
    filterClass === "any" ? undefined : filterClass,
  );

  const filtered = useMemo(() => {
    let result = trains ?? [];
    if (filterDepart !== "any")
      result = result.filter((t) =>
        filterByDeparture(t.departureTime, filterDepart),
      );
    if (sort === "departure")
      result = [...result].sort((a, b) =>
        a.departureTime.localeCompare(b.departureTime),
      );
    if (sort === "duration")
      result = [...result].sort((a, b) => a.duration.localeCompare(b.duration));
    if (sort === "price")
      result = [...result].sort((a, b) => {
        const fa = a.classes[0] ? Number(a.classes[0].fare) : 9999;
        const fb = b.classes[0] ? Number(b.classes[0].fare) : 9999;
        return fa - fb;
      });
    return result;
  }, [trains, filterDepart, sort]);

  const handleBook = (trainId: bigint, selectedClass: string) => {
    navigate(
      `/train/${Number(trainId)}/seats?class=${encodeURIComponent(selectedClass)}&passengers=${passengers}`,
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            data-ocid="train.results.back_button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Train className="w-5 h-5 text-primary" />
            <span>{from}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span>{to}</span>
          </div>
          <div className="text-muted-foreground text-sm">{date}</div>
          <Badge variant="secondary" className="ml-auto">
            <Users className="w-3.5 h-3.5 mr-1" />
            {passengers} Passenger{passengers > 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="glass-card rounded-2xl p-4 sticky top-20 space-y-5">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Filter className="w-4 h-4 text-primary" /> Filters
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Class
              </p>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger
                  className="h-9"
                  data-ocid="train.results.class_filter"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">All Classes</SelectItem>
                  {[
                    "Sleeper",
                    "3AC",
                    "2AC",
                    "1AC",
                    "Chair Car",
                    "Executive",
                    "General",
                  ].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Departure
              </p>
              <div className="space-y-1">
                {DEPARTURE_FILTERS.map((f) => (
                  <button
                    type="button"
                    key={f.value}
                    onClick={() => setFilterDepart(f.value)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      filterDepart === f.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                    data-ocid={`train.results.depart_filter.${f.value}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground text-sm">
              {isLoading
                ? "Searching trains…"
                : `${filtered.length} train${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Sort:
              </span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                  className="h-8 w-36"
                  data-ocid="train.results.sort_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="departure">Departure</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
              data-ocid="train.results.empty_state"
            >
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-foreground">
                No trains found
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search a different date.
              </p>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="mt-6"
              >
                Modify Search
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filtered.map((train, idx) => {
                const id = String(Number(train.id));
                const chosen =
                  selectedClassMap[id] ?? train.classes[0]?.className ?? "";
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="glass-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all"
                    data-ocid={`train.results.item.${idx + 1}`}
                  >
                    <div className="flex flex-wrap gap-4 items-start">
                      {/* Train info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {train.trainNumber}
                          </Badge>
                          <span className="font-display font-bold text-foreground truncate">
                            {train.name}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-amber-500">
                            <Star className="w-3 h-3 fill-current" /> 4.2
                          </div>
                        </div>
                        {/* Times */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-xl font-bold font-mono text-foreground">
                              {train.departureTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {train.from}
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col items-center gap-0.5">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {train.duration}
                            </div>
                            <div className="w-full flex items-center">
                              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                              <Train className="w-3 h-3 text-primary mx-1" />
                              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold font-mono text-foreground">
                              {train.arrivalTime}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {train.to}
                            </div>
                          </div>
                        </div>
                        {/* Class chips */}
                        <div className="flex flex-wrap gap-2">
                          {train.classes.map((cls) => (
                            <button
                              type="button"
                              key={cls.className}
                              onClick={() =>
                                setSelectedClassMap((prev) => ({
                                  ...prev,
                                  [id]: cls.className,
                                }))
                              }
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                chosen === cls.className
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card border-border hover:border-primary/50 text-foreground"
                              }`}
                              data-ocid={`train.results.class_chip.${idx + 1}`}
                            >
                              {cls.className} ₹{Number(cls.fare)}
                              <span className="ml-1 opacity-70">
                                ({Number(cls.available)} seats)
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Book button */}
                      <div className="flex flex-col items-end gap-2">
                        {train.classes.find((c) => c.className === chosen) && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              ₹
                              {Number(
                                train.classes.find(
                                  (c) => c.className === chosen,
                                )?.fare ?? 0,
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              per passenger
                            </div>
                          </div>
                        )}
                        <Button
                          onClick={() => handleBook(train.id, chosen)}
                          disabled={
                            !chosen ||
                            Number(
                              train.classes.find((c) => c.className === chosen)
                                ?.available ?? 0,
                            ) === 0
                          }
                          className="whitespace-nowrap"
                          data-ocid={`train.results.book_button.${idx + 1}`}
                        >
                          Book in {chosen}{" "}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
