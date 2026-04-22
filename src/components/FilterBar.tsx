import { CATEGORIES, CategoryId } from "@/lib/expenses";
import { Search, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterState = {
  search: string;
  categories: Set<CategoryId>;
  range: "all" | "7d" | "30d" | "month";
};

type Props = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onExport: () => void;
  resultCount: number;
};

const RANGES: { id: FilterState["range"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "month", label: "This month" },
];

export const FilterBar = ({ filters, onChange, onExport, resultCount }: Props) => {
  const toggleCat = (id: CategoryId) => {
    const next = new Set(filters.categories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...filters, categories: next });
  };

  const hasFilters =
    filters.search.length > 0 ||
    filters.categories.size > 0 ||
    filters.range !== "all";

  const clear = () =>
    onChange({ search: "", categories: new Set(), range: "all" });

  return (
    <div className="glass rounded-3xl p-4 md:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes…"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="input-glass w-full h-11 pl-10 pr-3 text-sm"
          />
        </div>

        <div className="flex gap-1 p-1 rounded-xl bg-secondary/40 border border-border/60">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => onChange({ ...filters, range: r.id })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filters.range === r.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={onExport}
          disabled={resultCount === 0}
          className="flex items-center gap-1.5 px-3 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 transition-all text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-3.5 h-3.5" />
          CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((c) => {
          const active = filters.categories.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleCat(c.id)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                active
                  ? "border-transparent text-primary-foreground"
                  : "bg-secondary/40 border-border/60 text-foreground/70 hover:border-primary/30"
              )}
              style={
                active
                  ? {
                      backgroundColor: `hsl(var(${c.colorVar}))`,
                      boxShadow: `0 0 14px hsl(var(${c.colorVar}) / 0.4)`,
                    }
                  : undefined
              }
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          );
        })}

        {hasFilters && (
          <button
            onClick={clear}
            className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
