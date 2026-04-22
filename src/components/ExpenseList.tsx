import { useState } from "react";
import { CATEGORIES, CategoryId, Expense, formatCurrency, getCategory } from "@/lib/expenses";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Expense>) => void;
};

export const ExpenseList = ({ expenses, onDelete, onUpdate }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftAmount, setDraftAmount] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [draftCategory, setDraftCategory] = useState<CategoryId>("food");

  const startEdit = (e: Expense) => {
    setEditingId(e.id);
    setDraftAmount(String(e.amount));
    setDraftNote(e.note);
    setDraftCategory(e.category);
  };

  const saveEdit = (id: string) => {
    const v = parseFloat(draftAmount);
    if (!v || v <= 0) return;
    onUpdate(id, { amount: v, note: draftNote.trim(), category: draftCategory });
    setEditingId(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="text-5xl mb-3 opacity-60">🌙</div>
        <h3 className="font-display text-lg font-semibold mb-1">
          Nothing to show
        </h3>
        <p className="text-sm text-muted-foreground">
          Try clearing filters or add a new expense.
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
    <div className="glass rounded-3xl overflow-hidden">
      <div className="px-6 md:px-7 pt-6 pb-3 flex items-baseline justify-between border-b border-border/40">
        <h2 className="font-display text-lg font-semibold">Activity</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
          {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="divide-y divide-border/40 max-h-[640px] overflow-y-auto">
        {sortedDates.map((date) => {
          const dayTotal = groups[date].reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date} className="px-6 md:px-7 py-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-semibold text-foreground/90 font-mono uppercase tracking-wider">
                  {formatDate(date)}
                </span>
                <span className="num text-xs text-muted-foreground tabular-nums">
                  {formatCurrency(dayTotal)}
                </span>
              </div>
              <ul className="space-y-1">
                {groups[date].map((e) => {
                  const cat = getCategory(e.category);
                  const isEditing = editingId === e.id;

                  if (isEditing) {
                    return (
                      <li
                        key={e.id}
                        className="rounded-2xl bg-secondary/40 border border-primary/40 ring-2 ring-primary/20 p-3 space-y-2 animate-fade-in"
                      >
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 rounded-lg bg-background/40 border border-border/60 px-2.5 py-1.5 flex-1">
                            <span className="text-primary/70 text-sm">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={draftAmount}
                              onChange={(ev) => setDraftAmount(ev.target.value)}
                              className="num bg-transparent outline-none w-full text-sm"
                              autoFocus
                            />
                          </div>
                          <input
                            type="text"
                            value={draftNote}
                            onChange={(ev) => setDraftNote(ev.target.value)}
                            placeholder="Note"
                            className="input-glass flex-[2] h-9 px-2.5 text-sm"
                          />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {CATEGORIES.map((c) => {
                            const active = draftCategory === c.id;
                            return (
                              <button
                                key={c.id}
                                onClick={() => setDraftCategory(c.id)}
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[11px] border transition-all",
                                  active
                                    ? "border-transparent text-primary-foreground"
                                    : "bg-background/40 border-border/60 text-foreground/70"
                                )}
                                style={
                                  active
                                    ? { backgroundColor: `hsl(var(${c.colorVar}))` }
                                    : undefined
                                }
                              >
                                {c.emoji} {c.label}
                              </button>
                            );
                          })}
                          <div className="ml-auto flex gap-1">
                            <button
                              onClick={() => saveEdit(e.id)}
                              className="p-1.5 rounded-lg bg-success/20 text-success hover:bg-success/30 transition-colors"
                              aria-label="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/70 transition-colors"
                              aria-label="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={e.id}
                      className="group flex items-center gap-3 py-2 -mx-2 px-2 rounded-2xl hover:bg-secondary/40 transition-colors animate-slide-up"
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 border"
                        style={{
                          backgroundColor: `hsl(var(${cat.colorVar}) / 0.18)`,
                          borderColor: `hsl(var(${cat.colorVar}) / 0.35)`,
                        }}
                      >
                        {cat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm">
                          {e.note || cat.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
                          {cat.label}
                        </div>
                      </div>
                      <div className="num font-semibold tabular-nums text-sm">
                        −{formatCurrency(e.amount)}
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(e)}
                          className="p-1.5 rounded-lg hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(e.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
