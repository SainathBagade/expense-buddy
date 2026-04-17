import { Expense, formatCurrency, getCategory } from "@/lib/expenses";
import { Trash2 } from "lucide-react";

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

export const ExpenseList = ({ expenses, onDelete }: Props) => {
  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl bg-card shadow-card border border-border p-10 text-center">
        <div className="text-5xl mb-3">📭</div>
        <h3 className="font-display text-xl font-semibold mb-1">
          No expenses yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Add your first one to get started.
        </p>
      </div>
    );
  }

  // Group by date
  const groups = expenses.reduce<Record<string, Expense[]>>((acc, e) => {
    (acc[e.date] ||= []).push(e);
    return acc;
  }, {});
  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yest = new Date(today.getTime() - 86400000).toISOString().slice(0, 10);
    if (iso === todayStr) return "Today";
    if (iso === yest) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-3xl bg-card shadow-card border border-border overflow-hidden">
      <div className="px-6 md:px-8 pt-6 pb-2 flex items-baseline justify-between">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">
          Activity
        </h2>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="divide-y divide-border">
        {sortedDates.map((date) => {
          const dayTotal = groups[date].reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date} className="px-6 md:px-8 py-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">
                  {formatDate(date)}
                </span>
                <span className="num text-xs text-muted-foreground">
                  {formatCurrency(dayTotal)}
                </span>
              </div>
              <ul className="space-y-1">
                {groups[date].map((e) => {
                  const cat = getCategory(e.category);
                  return (
                    <li
                      key={e.id}
                      className="group flex items-center gap-3 py-2 -mx-2 px-2 rounded-xl hover:bg-secondary/60 transition-colors animate-slide-up"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                        style={{
                          backgroundColor: `hsl(var(${cat.colorVar}) / 0.15)`,
                        }}
                      >
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {e.note || cat.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cat.label}
                        </div>
                      </div>
                      <div className="num font-semibold tabular-nums">
                        −{formatCurrency(e.amount)}
                      </div>
                      <button
                        onClick={() => onDelete(e.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
