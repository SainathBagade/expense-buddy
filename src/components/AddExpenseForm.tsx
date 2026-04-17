import { useState } from "react";
import { CATEGORIES, CategoryId, Expense, todayISO } from "@/lib/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

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
      className="rounded-3xl bg-card shadow-card border border-border p-6 md:p-8"
    >
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">
          New expense
        </h2>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Quick add
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Amount
          </label>
          <div className="flex items-center gap-2 border-b-2 border-foreground/10 focus-within:border-foreground transition-colors pb-2">
            <span className="font-display text-4xl md:text-5xl text-muted-foreground">
              $
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="num font-display text-4xl md:text-5xl bg-transparent outline-none w-full placeholder:text-muted-foreground/40"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm font-medium border transition-all",
                    active
                      ? "bg-primary text-primary-foreground border-primary scale-105"
                      : "bg-background border-border hover:border-foreground/40"
                  )}
                >
                  <span className="mr-1.5">{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Note
            </label>
            <Input
              placeholder="Coffee with Sam"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl bg-background border-border h-11"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl bg-background border-border h-11"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add expense
        </Button>
      </div>
    </form>
  );
};
