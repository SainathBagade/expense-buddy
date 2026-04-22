import { useState, useEffect } from "react";
import { Expense, formatCurrency, loadBudget, monthKey, saveBudget } from "@/lib/expenses";
import { Wallet, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  expenses: Expense[];
};

export const BudgetCard = ({ expenses }: Props) => {
  const [budget, setBudget] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const b = loadBudget();
    setBudget(b);
    setDraft(b > 0 ? String(b) : "");
  }, []);

  const currentMonth = monthKey(new Date().toISOString().slice(0, 10));
  const spent = expenses
    .filter((e) => monthKey(e.date) === currentMonth)
    .reduce((s, e) => s + e.amount, 0);

  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const remaining = Math.max(0, budget - spent);
  const over = budget > 0 && spent > budget;

  const status =
    !budget
      ? "neutral"
      : pct >= 100
      ? "over"
      : pct >= 85
      ? "warn"
      : pct >= 60
      ? "ok"
      : "good";

  const barGradient = {
    over: "bg-gradient-warning",
    warn: "bg-gradient-warning",
    ok: "bg-gradient-primary",
    good: "bg-gradient-accent",
    neutral: "bg-secondary",
  }[status];

  const save = () => {
    const v = parseFloat(draft);
    if (!isNaN(v) && v >= 0) {
      saveBudget(v);
      setBudget(v);
      setEditing(false);
    }
  };

  const cancel = () => {
    setDraft(budget > 0 ? String(budget) : "");
    setEditing(false);
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-7 relative overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-accent" />
          </div>
          <h3 className="font-display text-base font-semibold">Monthly budget</h3>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            {budget > 0 ? "Edit" : "Set"}
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={save}
              className="p-1.5 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
              aria-label="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={cancel}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/70 transition-colors"
              aria-label="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 border border-primary/40 ring-2 ring-primary/30 px-4 py-3 mb-4">
          <span className="font-display text-2xl text-primary/70">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
            placeholder="2000"
            className="num font-display text-2xl bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground/40"
          />
        </div>
      ) : budget === 0 ? (
        <p className="text-sm text-muted-foreground mb-4">
          Set a monthly limit to track your progress.
        </p>
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="num font-display text-3xl font-semibold">
                {formatCurrency(spent)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                of {formatCurrency(budget)}
              </div>
            </div>
            <div className="text-right">
              <div
                className={cn(
                  "num font-display text-xl font-semibold",
                  over ? "text-destructive" : "text-accent"
                )}
              >
                {over
                  ? `−${formatCurrency(spent - budget)}`
                  : formatCurrency(remaining)}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-mono mt-0.5">
                {over ? "Over" : "Left"}
              </div>
            </div>
          </div>

          <div className="relative h-2.5 bg-secondary/60 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", barGradient)}
              style={{ width: `${pct}%` }}
            />
            {over && (
              <div className="absolute inset-0 bg-destructive/20 animate-pulse rounded-full" />
            )}
          </div>

          <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground mt-2">
            <span>{pct.toFixed(0)}% used</span>
            <span
              className={cn(
                status === "over" && "text-destructive",
                status === "warn" && "text-warning",
                status === "good" && "text-success"
              )}
            >
              {status === "over" && "⚠ Over budget"}
              {status === "warn" && "Slow down"}
              {status === "ok" && "On track"}
              {status === "good" && "Healthy"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
