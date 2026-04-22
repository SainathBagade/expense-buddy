import { CATEGORIES, Expense, formatCurrency, monthKey } from "@/lib/expenses";
import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  expenses: Expense[];
};

export const SummaryCard = ({ expenses }: Props) => {
  const now = new Date();
  const currentMonth = monthKey(now.toISOString().slice(0, 10));
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = monthKey(prevDate.toISOString().slice(0, 10));

  const monthLabel = now.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const { monthTotal, prevTotal, monthCount, avgPerDay } = useMemo(() => {
    const monthItems = expenses.filter((e) => monthKey(e.date) === currentMonth);
    const total = monthItems.reduce((s, e) => s + e.amount, 0);
    const prev = expenses
      .filter((e) => monthKey(e.date) === prevMonth)
      .reduce((s, e) => s + e.amount, 0);
    const dayOfMonth = now.getDate();
    return {
      monthTotal: total,
      prevTotal: prev,
      monthCount: monthItems.length,
      avgPerDay: total / Math.max(1, dayOfMonth),
    };
  }, [expenses, currentMonth, prevMonth]);

  const delta = prevTotal > 0 ? ((monthTotal - prevTotal) / prevTotal) * 100 : 0;
  const isUp = delta > 0;

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-7 relative overflow-hidden">
      {/* Aurora glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
            {monthLabel}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-primary/15 text-primary border border-primary/30">
            ● Live
          </span>
        </div>

        <div className="mb-6">
          <div className="text-xs text-muted-foreground mb-1.5">Total spent</div>
          <div className="num font-display text-5xl md:text-6xl font-semibold tracking-tight text-gradient">
            {formatCurrency(monthTotal)}
          </div>

          {prevTotal > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-xs">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-medium ${
                  isUp
                    ? "bg-destructive/15 text-destructive"
                    : "bg-success/15 text-success"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(delta).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-3.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mb-1">
              Entries
            </div>
            <div className="num font-display text-2xl font-semibold">
              {monthCount}
            </div>
          </div>
          <div className="glass rounded-2xl p-3.5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mb-1">
              Avg / day
            </div>
            <div className="num font-display text-2xl font-semibold">
              {formatCurrency(avgPerDay)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
