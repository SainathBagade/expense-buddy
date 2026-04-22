import { useEffect, useMemo, useState } from "react";
import {
  CategoryId,
  Expense,
  exportCSV,
  loadExpenses,
  monthKey,
  saveExpenses,
} from "@/lib/expenses";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { SummaryCard } from "@/components/SummaryCard";
import { BudgetCard } from "@/components/BudgetCard";
import { ChartsCard } from "@/components/ChartsCard";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { toast } from "sonner";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: new Set<CategoryId>(),
    range: "all",
  });

  useEffect(() => {
    setExpenses(loadExpenses());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveExpenses(expenses);
  }, [expenses, hydrated]);

  const handleAdd = (e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
    toast.success("Expense added");
  };

  const handleDelete = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast("Expense removed");
  };

  const handleUpdate = (id: string, patch: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
    toast.success("Expense updated");
  };

  const filtered = useMemo(() => {
    const today = new Date();
    const cutoff = new Date(today);
    if (filters.range === "7d") cutoff.setDate(today.getDate() - 7);
    if (filters.range === "30d") cutoff.setDate(today.getDate() - 30);
    const cutoffISO = cutoff.toISOString().slice(0, 10);
    const currentMonth = monthKey(today.toISOString().slice(0, 10));
    const q = filters.search.trim().toLowerCase();

    return expenses.filter((e) => {
      if (filters.categories.size > 0 && !filters.categories.has(e.category))
        return false;
      if (filters.range === "month" && monthKey(e.date) !== currentMonth)
        return false;
      if ((filters.range === "7d" || filters.range === "30d") && e.date < cutoffISO)
        return false;
      if (q && !e.note.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [expenses, filters]);

  const handleExport = () => {
    if (filtered.length === 0) return;
    exportCSV(filtered);
    toast.success(`Exported ${filtered.length} entries to CSV`);
  };

  return (
    <div className="min-h-screen relative">
      <header className="container max-w-7xl pt-8 pb-6 md:pt-12 md:pb-8 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center font-display font-bold text-lg text-primary-foreground glow-primary">
              ƒ
            </div>
            <div>
              <div className="font-display text-lg font-semibold leading-tight">
                Ledger
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                v2 · Glass
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] font-mono text-muted-foreground">
              Local-first · Encrypted in browser
            </span>
          </div>
        </div>

        <div className="max-w-3xl">
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1] mb-3">
            Your money,
            <br />
            <span className="text-gradient">crystal clear.</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            A modern dashboard for personal spending. Track budgets, spot trends,
            and stay in control — all with zero accounts.
          </p>
        </div>
      </header>

      <main className="container max-w-7xl pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: stats + activity */}
          <div className="lg:col-span-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SummaryCard expenses={expenses} />
              <BudgetCard expenses={expenses} />
            </div>

            <ChartsCard expenses={expenses} />

            <FilterBar
              filters={filters}
              onChange={setFilters}
              onExport={handleExport}
              resultCount={filtered.length}
            />

            <ExpenseList
              expenses={filtered}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>

          {/* Right: add form */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6">
              <AddExpenseForm onAdd={handleAdd} />
            </div>
          </div>
        </div>
      </main>

      <footer className="container max-w-7xl pb-10 text-center relative z-10">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Your data stays in your browser · Nothing leaves this device
        </p>
      </footer>
    </div>
  );
};

export default Index;
