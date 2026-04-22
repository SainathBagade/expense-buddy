import { useState } from "react";
import { CATEGORIES, CategoryId, Expense, todayISO } from "@/lib/expenses";
import { cn } from "@/lib/utils";
import { Plus, Sparkles } from "lucide-react";

type Props = {
  onAdd: (expense: Expense) => void;
};

export const AddExpenseForm = ({ onAdd }: Props) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    onAdd({
      id: crypto.randomUUID(),
      amount: value,
      category,
      note: note.trim(),
      date,
      createdAt: Date.now(),
    });
    setAmount("");
    setNote("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-3xl p-6 md:p-7 relative overflow-hidden"
    >
      {/* subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <h2 className="font-display text-xl font-semibold">New expense</h2>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
          Quick add
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">
            Amount
          </label>
          <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 border border-border/60 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30 transition-all px-4 py-3">
            <span className="font-display text-3xl text-primary/70">$</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="num font-display text-3xl bg-transparent outline-none w-full placeholder:text-muted-foreground/40 text-foreground"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2.5">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    active
                      ? "border-transparent text-primary-foreground scale-105"
                      : "bg-secondary/40 border-border/60 text-foreground/80 hover:border-primary/40"
                  )}
                  style={
                    active
                      ? {
                          backgroundColor: `hsl(var(${c.colorVar}))`,
                          boxShadow: `0 0 20px hsl(var(${c.colorVar}) / 0.5)`,
                        }
                      : undefined
                  }
                >
                  <span className="mr-1">{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">
              Note
            </label>
            <input
              type="text"
              placeholder="Coffee with Sam"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-glass w-full h-11 px-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-glass w-full h-11 px-3 text-sm [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-sm tracking-wide hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Add expense
        </button>
      </div>
    </form>
  );
};
