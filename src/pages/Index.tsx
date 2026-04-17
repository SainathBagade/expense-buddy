import { useEffect, useState } from "react";
import { Expense, loadExpenses, saveExpenses } from "@/lib/expenses";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { SummaryCard } from "@/components/SummaryCard";
import { toast } from "sonner";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="container max-w-6xl pt-10 pb-6 md:pt-16 md:pb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg">
              ƒ
            </div>
            <span className="font-display text-xl font-semibold">Ledger</span>
          </div>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-muted-foreground">
            Personal · Local-first
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] max-w-3xl">
          Track every dollar,
          <br />
          <span className="italic text-muted-foreground">beautifully.</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl">
          A calm, no-nonsense way to record what you spend and see where it
          really goes.
        </p>
      </header>

      <main className="container max-w-6xl pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <SummaryCard expenses={expenses} />
            <ExpenseList expenses={expenses} onDelete={handleDelete} />
          </div>
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <AddExpenseForm onAdd={handleAdd} />
            </div>
          </div>
        </div>
      </main>

      <footer className="container max-w-6xl pb-10 text-center">
        <p className="text-xs text-muted-foreground">
          Your data stays in your browser. Nothing is sent anywhere.
        </p>
      </footer>
    </div>
  );
};

export default Index;
