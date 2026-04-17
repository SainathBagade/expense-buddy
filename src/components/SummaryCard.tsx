import { CATEGORIES, Expense, formatCurrency, monthKey } from "@/lib/expenses";
import { useMemo } from "react";

type Props = {
  expenses: Expense[];
};

export const SummaryCard = ({ expenses }: Props) => {
  const now = new Date();
  const currentMonth = monthKey(now.toISOString().slice(0, 10));
  const monthLabel = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const { monthTotal, byCategory, topCategory } = useMemo(() => {
    const monthItems = expenses.filter((e) => monthKey(e.date) === currentMonth);
    const total = monthItems.reduce((s, e) => s + e.amount, 0);
    const map = new Map<string, number>();
    monthItems.forEach((e) =>
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
    );
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return {
      monthTotal: total,
      byCategory: map,
      topCategory: sorted[0]?.[0],
    };
  }, [expenses, currentMonth]);

  return (
    <div className="rounded-3xl bg-primary text-primary-foreground shadow-elevated p-6 md:p-8 relative overflow-hidden">
      {/* Decorative blob */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs uppercase tracking-widest opacity-70">
            {monthLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
            This month
          </span>
        </div>

        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest opacity-70 mb-2">
            Total spent
          </div>
          <div className="num font-display text-5xl md:text-6xl font-semibold tracking-tight">
            {formatCurrency(monthTotal)}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest opacity-70 mb-3">
            Where it went
          </div>

          {monthTotal === 0 ? (
            <p className="text-sm opacity-70">
              Nothing tracked yet for this month.
            </p>
          ) : (
            <>
              <div className="flex h-2.5 rounded-full overflow-hidden bg-primary-foreground/10 mb-4">
                {CATEGORIES.map((c) => {
                  const v = byCategory.get(c.id) ?? 0;
                  if (!v) return null;
                  const pct = (v / monthTotal) * 100;
                  return (
                    <div
                      key={c.id}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: `hsl(var(${c.colorVar}))`,
                      }}
                      title={`${c.label} ${pct.toFixed(0)}%`}
                    />
                  );
                })}
              </div>

              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {CATEGORIES.filter((c) => byCategory.get(c.id)).map((c) => {
                  const v = byCategory.get(c.id) ?? 0;
                  const pct = (v / monthTotal) * 100;
                  return (
                    <li
                      key={c.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: `hsl(var(${c.colorVar}))`,
                          }}
                        />
                        <span className="truncate">
                          {c.emoji} {c.label}
                          {topCategory === c.id && (
                            <span className="ml-1.5 text-[10px] uppercase tracking-wider text-accent">
                              top
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="num opacity-80 tabular-nums">
                        {pct.toFixed(0)}%
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
